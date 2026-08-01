"use client"

import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/mantine/style.css"
import "@blocknote/core/fonts/inter.css"
import { Save, X } from "lucide-react"
import { useEffect, useState, useCallback, useRef } from "react"
import { Block, BlockNoteEditor } from "@blocknote/core"

interface BlockNoteNoteProps {
    initialData?: string | null
    onSave: (content: string) => void
    onCancel: () => void
    placeholder?: string
    isEditing: boolean
    onEditChange: (editing: boolean) => void
}

// Helper function to convert old formats to BlockNote format
function convertToBlockNoteContent(data: string | null | undefined): Block[] | undefined {
    if (!data || !data.trim()) return undefined

    try {
        const parsed = JSON.parse(data)

        // Check if it's already BlockNote format (array of blocks with type)
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type) {
            return parsed as Block[]
        }

        // Convert TipTap format to BlockNote
        if (parsed.type === "doc" && parsed.content) {
            const blocks: Block[] = []

            for (const node of parsed.content) {
                if (node.type === "paragraph") {
                    const textContent = node.content?.map((c: any) => {
                        if (c.type === "text") {
                            // Handle marks (bold, italic, etc.)
                            let styles: any = {}
                            if (c.marks) {
                                for (const mark of c.marks) {
                                    if (mark.type === "bold") styles.bold = true
                                    if (mark.type === "italic") styles.italic = true
                                    if (mark.type === "strike") styles.strike = true
                                    if (mark.type === "code") styles.code = true
                                    if (mark.type === "highlight") {
                                        styles.backgroundColor = mark.attrs?.color || "yellow"
                                    }
                                }
                            }
                            return { type: "text", text: c.text, styles }
                        }
                        return null
                    }).filter(Boolean) || []

                    blocks.push({
                        type: "paragraph",
                        content: textContent.length > 0 ? textContent : undefined,
                    } as Block)
                } else if (node.type === "heading") {
                    const level = node.attrs?.level || 1
                    const textContent = node.content?.map((c: any) => c.text).join("") || ""
                    blocks.push({
                        type: "heading",
                        props: { level: Math.min(level, 3) as 1 | 2 | 3 },
                        content: [{ type: "text", text: textContent, styles: {} }],
                    } as Block)
                } else if (node.type === "bulletList") {
                    for (const item of node.content || []) {
                        const textContent = item.content?.[0]?.content?.map((c: any) => c.text).join("") || ""
                        blocks.push({
                            type: "bulletListItem",
                            content: [{ type: "text", text: textContent, styles: {} }],
                        } as Block)
                    }
                } else if (node.type === "orderedList") {
                    for (const item of node.content || []) {
                        const textContent = item.content?.[0]?.content?.map((c: any) => c.text).join("") || ""
                        blocks.push({
                            type: "numberedListItem",
                            content: [{ type: "text", text: textContent, styles: {} }],
                        } as Block)
                    }
                } else if (node.type === "taskList") {
                    for (const item of node.content || []) {
                        const textContent = item.content?.[0]?.content?.map((c: any) => c.text).join("") || ""
                        const checked = item.attrs?.checked || false
                        blocks.push({
                            type: "checkListItem",
                            props: { checked },
                            content: [{ type: "text", text: textContent, styles: {} }],
                        } as Block)
                    }
                } else if (node.type === "blockquote") {
                    const textContent = node.content?.[0]?.content?.map((c: any) => c.text).join("") || ""
                    blocks.push({
                        type: "paragraph",
                        props: { textColor: "gray" },
                        content: [{ type: "text", text: `"${textContent}"`, styles: { italic: true } }],
                    } as Block)
                } else if (node.type === "codeBlock") {
                    const textContent = node.content?.map((c: any) => c.text).join("") || ""
                    blocks.push({
                        type: "codeBlock",
                        props: { language: node.attrs?.language || "" },
                        content: textContent,
                    } as Block)
                }
            }

            return blocks.length > 0 ? blocks : undefined
        }

        // Convert Editor.js format
        if (parsed.blocks && Array.isArray(parsed.blocks)) {
            const blocks: Block[] = []

            for (const block of parsed.blocks) {
                if (block.type === "paragraph") {
                    blocks.push({
                        type: "paragraph",
                        content: [{ type: "text", text: block.data?.text || "", styles: {} }],
                    } as Block)
                } else if (block.type === "header") {
                    blocks.push({
                        type: "heading",
                        props: { level: Math.min(block.data?.level || 1, 3) as 1 | 2 | 3 },
                        content: [{ type: "text", text: block.data?.text || "", styles: {} }],
                    } as Block)
                } else if (block.type === "list") {
                    const items = block.data?.items || []
                    const isOrdered = block.data?.style === "ordered"
                    for (const item of items) {
                        blocks.push({
                            type: isOrdered ? "numberedListItem" : "bulletListItem",
                            content: [{ type: "text", text: item, styles: {} }],
                        } as Block)
                    }
                }
            }

            return blocks.length > 0 ? blocks : undefined
        }
    } catch {
        // Not JSON, treat as plain text
        if (data.trim()) {
            return [{
                type: "paragraph",
                content: [{ type: "text", text: data.trim(), styles: {} }],
            }] as Block[]
        }
    }

    return undefined
}

// BlockNote Viewer Component (read-only)
export function BlockNoteViewer({ content }: { content: string | null | undefined }) {
    const initialContent = convertToBlockNoteContent(content)

    const editor = useCreateBlockNote({
        initialContent: initialContent || [{ type: "paragraph", content: "" }],
    })

    if (!content || !content.trim()) return null

    return (
        <div className="blocknote-viewer-wrapper">
            <BlockNoteView
                editor={editor}
                theme="light"
                editable={false}
            />
        </div>
    )
}

// Fallback function for plain text or invalid JSON
export function renderBlockNoteContent(content: string | null | undefined): string {
    if (!content) return ""

    try {
        const parsed = JSON.parse(content)

        // BlockNote format (array of blocks)
        if (Array.isArray(parsed)) {
            return parsed.map(block => {
                if (block.content) {
                    if (Array.isArray(block.content)) {
                        return block.content.map((c: any) => c.text || "").join("")
                    }
                    return block.content
                }
                return ""
            }).join("\n")
        }

        // TipTap format
        if (parsed.type === "doc" && parsed.content) {
            return parsed.content.map((node: any) => {
                if (node.content) {
                    return node.content.map((c: any) => c.text || "").join("")
                }
                return ""
            }).join("\n")
        }

        // Editor.js format
        if (parsed.blocks && Array.isArray(parsed.blocks)) {
            return parsed.blocks.map((block: any) => block.data?.text || "").join("\n")
        }
    } catch {
        return content
    }

    return content
}

// BlockNote Note Editor Component
export function BlockNoteNote({
    initialData,
    onSave,
    onCancel,
    placeholder = "Add a note...",
    isEditing,
    onEditChange
}: BlockNoteNoteProps) {
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const initialContent = convertToBlockNoteContent(initialData)

    const editor = useCreateBlockNote({
        initialContent: initialContent || [{ type: "paragraph", content: placeholder }],
    })

    // Manual save function
    const handleSave = useCallback(async () => {
        if (!editor) return

        setIsSaving(true)
        setSaveError(null)

        try {
            const blocks = editor.document

            // Check if content is empty
            const isEmpty = blocks.length === 0 ||
                (blocks.length === 1 &&
                    blocks[0].type === "paragraph" &&
                    (!blocks[0].content ||
                        (Array.isArray(blocks[0].content) && blocks[0].content.length === 0) ||
                        (Array.isArray(blocks[0].content) && blocks[0].content.every((c: any) => !c.text || c.text.trim() === ""))))

            const content = isEmpty ? "" : JSON.stringify(blocks)
            await onSave(content)
            onEditChange(false)
        } catch (error: any) {
            console.error("Failed to save note:", error)
            setSaveError(error.message || "Failed to save")
        } finally {
            setIsSaving(false)
        }
    }, [editor, onSave, onEditChange])

    // Handle click outside to save
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                handleSave()
            }
        }

        if (isEditing) {
            // Small delay to prevent immediate trigger
            const timer = setTimeout(() => {
                document.addEventListener("mousedown", handleClickOutside)
            }, 100)
            return () => {
                clearTimeout(timer)
                document.removeEventListener("mousedown", handleClickOutside)
            }
        }
    }, [isEditing, handleSave])

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isEditing) return

            // Don't interfere with Tab - let BlockNote handle it natively
            // This matches the sidebar popup behavior
            if (e.key === "Tab") return

            // Ctrl/Cmd + S to save
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault()
                handleSave()
            }

            // Escape to cancel
            if (e.key === "Escape") {
                onCancel()
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [isEditing, handleSave, onCancel])

    if (!isEditing) return null

    return (
        <div
            ref={containerRef}
            className="blocknote-note-wrapper relative pb-9"
            onDragStart={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}
            draggable={false}
        >
            {/* Compact Editor */}
            <div
                className="blocknote-note-editor"
                onMouseDown={(e) => {
                    // Only stop propagation for non-editor clicks to prevent card drag
                    // Let BlockNote handle clicks internally
                    e.stopPropagation()
                }}
            // No onKeyDown needed - buttons have tabIndex={-1}
            >
                <BlockNoteView
                    editor={editor}
                    theme="light"
                    portalElements={{
                        default: typeof document !== "undefined" ? document.body : null,
                        slashMenu: typeof document !== "undefined" ? document.body : null,
                        formattingToolbar: typeof document !== "undefined" ? document.body : null,
                        linkToolbar: typeof document !== "undefined" ? document.body : null,
                        emojiPicker: typeof document !== "undefined" ? document.body : null,
                        sideMenu: typeof document !== "undefined" ? document.body : null,
                        filePanel: typeof document !== "undefined" ? document.body : null,
                        tableHandles: typeof document !== "undefined" ? document.body : null,
                        comments: typeof document !== "undefined" ? document.body : null,
                    }}
                />
            </div>

            {/* Save/Cancel Actions */}
            <div
                className="absolute bottom-0 left-0 right-0 flex items-center justify-between pt-2"
                style={{
                    // Subtle fade so buttons are readable without pushing content down
                    background: "linear-gradient(to top, rgba(255,255,255,0.98), rgba(255,255,255,0))",
                }}
            >
                <div className="flex items-center gap-1 px-1">
                    {saveError && (
                        <span className="text-[10px] text-red-500">{saveError}</span>
                    )}
                </div>
                <div className="flex items-center gap-1 px-1 pb-1">
                    <button
                        onClick={onCancel}
                        className="text-[10px] px-2 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors flex items-center gap-1"
                        disabled={isSaving}
                        tabIndex={-1}
                    >
                        <X className="w-3 h-3" />
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="text-[10px] px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded transition-colors flex items-center gap-1 disabled:opacity-50"
                        tabIndex={-1}
                    >
                        {isSaving ? (
                            <>
                                <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-3 h-3" />
                                Save
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
