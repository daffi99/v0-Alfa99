"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import Highlight from "@tiptap/extension-highlight"
import { ToggleList } from "./toggle-list-extension"
import { Undo2, Redo2, Bold, Italic, Strikethrough, Code, List, ListOrdered, CheckSquare, ChevronDown, ChevronRight, Highlighter, TextQuote, Save } from "lucide-react"
import { useEffect, useState, useRef } from "react"

interface EditorJsNoteProps {
  initialData?: string | null
  onSave: (content: string) => void
  onCancel: () => void
  placeholder?: string
  isEditing: boolean
  onEditChange: (editing: boolean) => void
}

const highlightColors = [
  { name: "Yellow", color: "#fef08a" },
  { name: "Green", color: "#bbf7d0" },
  { name: "Blue", color: "#bfdbfe" },
  { name: "Pink", color: "#fbcfe8" },
  { name: "Purple", color: "#ddd6fe" },
  { name: "Orange", color: "#fed7aa" },
]

// Helper function to convert old Editor.js format to TipTap content
function convertToTipTapContent(data: string | null | undefined): any {
  if (!data || !data.trim()) {
    return "<p></p>"
  }

  // Try to parse as JSON
  try {
    const parsed = JSON.parse(data)

    // If it's TipTap JSON format, return the parsed object directly
    if (parsed.type === "doc" && parsed.content) {
      return parsed
    }

    // If it's Editor.js format, convert to HTML
    if (parsed.blocks && Array.isArray(parsed.blocks)) {
      return parsed.blocks.map((block: any) => {
        switch (block.type) {
          case "header":
            const level = block.data.level || 2
            return `<h${level}>${block.data.text}</h${level}>`
          case "paragraph":
            return `<p>${block.data.text || ""}</p>`
          case "list":
            const listTag = block.data.style === "ordered" ? "ol" : "ul"
            const items = block.data.items.map((item: string) => `<li>${item}</li>`).join("")
            return `<${listTag}>${items}</${listTag}>`
          case "quote":
            return `<blockquote>${block.data.text}</blockquote>`
          case "code":
            return `<pre><code>${block.data.code}</code></pre>`
          default:
            return `<p>${block.data?.text || ""}</p>`
        }
      }).join("")
    }
  } catch {
    // Not JSON
  }

  // Check if it's already HTML
  if (data.startsWith("<") && data.includes(">")) {
    return data
  }

  // Plain text - convert to paragraphs
  const lines = data.split("\n").filter((line) => line.trim())
  if (lines.length === 0) return "<p></p>"
  return lines.map((line) => `<p>${line}</p>`).join("")
}

// TipTap Viewer Component (read-only)
export function EditorJsViewer({ content }: { content: string | null | undefined }) {
  const initialContent = convertToTipTapContent(content)

  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      ToggleList,
    ],
    content: initialContent,
    editable: false,
    editorProps: {
      attributes: {
        class: "tiptap-viewer focus:outline-none",
      },
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    if (editor && content) {
      const newContent = convertToTipTapContent(content)
      editor.commands.setContent(newContent)
    }
  }, [content, editor])

  if (!content || !content.trim()) return null
  if (!editor) return null

  return <EditorContent editor={editor} />
}

// Fallback function for plain text or invalid JSON
export function renderEditorJsContent(content: string | null | undefined): string {
  if (!content || !content.trim()) return ""
  return "" // TipTap viewer handles rendering
}

// TipTap Note Editor Component
export function EditorJsNote({ initialData, onSave, onCancel, placeholder = "Add a note...", isEditing, onEditChange }: EditorJsNoteProps) {
  const [isHeadingDropdownOpen, setIsHeadingDropdownOpen] = useState(false)
  const [isHighlightDropdownOpen, setIsHighlightDropdownOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const headingDropdownRef = useRef<HTMLDivElement>(null)
  const highlightDropdownRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      ToggleList,
    ],
    content: convertToTipTapContent(initialData),
    editorProps: {
      attributes: {
        class: "tiptap-note-editor focus:outline-none min-h-[60px]",
      },
    },
  })

  // Manual save function
  const handleSave = async () => {
    if (!editor || isSaving) return

    try {
      const jsonContent = JSON.stringify(editor.getJSON())
      setIsSaving(true)
      setSaveError(null)

      try {
        await onSave(jsonContent)
        setSaveError(null)
        onEditChange(false)
      } catch (error: any) {
        setSaveError(error.message || "Failed to save note")
      } finally {
        setIsSaving(false)
      }
    } catch (error) {
      console.error("Error saving:", error)
      setIsSaving(false)
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headingDropdownRef.current && !headingDropdownRef.current.contains(event.target as Node)) {
        setIsHeadingDropdownOpen(false)
      }
      if (highlightDropdownRef.current && !highlightDropdownRef.current.contains(event.target as Node)) {
        setIsHighlightDropdownOpen(false)
      }
    }

    if (isHeadingDropdownOpen || isHighlightDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isHeadingDropdownOpen, isHighlightDropdownOpen])

  const getCurrentHeadingLevel = () => {
    if (!editor) return null
    if (editor.isActive("heading", { level: 1 })) return 1
    if (editor.isActive("heading", { level: 2 })) return 2
    if (editor.isActive("heading", { level: 3 })) return 3
    if (editor.isActive("heading", { level: 4 })) return 4
    if (editor.isActive("heading", { level: 5 })) return 5
    if (editor.isActive("heading", { level: 6 })) return 6
    return null
  }

  const getHeadingLabel = () => {
    const level = getCurrentHeadingLevel()
    if (level) return `H${level}`
    return "P"
  }

  const handleHeadingSelect = (level: number | null) => {
    if (!editor) return
    if (level === null) {
      editor.chain().focus().setParagraph().run()
    } else {
      editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()
    }
    setIsHeadingDropdownOpen(false)
  }

  const handleHighlightSelect = (color: string | null) => {
    if (!editor) return
    if (color === null) {
      editor.chain().focus().unsetHighlight().run()
    } else {
      editor.chain().focus().toggleHighlight({ color }).run()
    }
    setIsHighlightDropdownOpen(false)
  }

  if (!editor) return null

  return (
    <div
      ref={containerRef}
      className="w-full relative"
      draggable={false}
      onDragStart={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
      }}
    >
      {/* Error display */}
      {saveError && (
        <div className="mb-1 text-[10px] text-red-500 bg-red-50 px-2 py-1 rounded">
          {saveError}
        </div>
      )}

      {/* Compact Toolbar */}
      {isEditing && (
        <div className="bg-white border border-border rounded-md p-1 mb-2 flex items-center gap-0.5 flex-wrap">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-1 rounded hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-1 rounded hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-border mx-0.5" />

          {/* Heading Dropdown */}
          <div className="relative" ref={headingDropdownRef}>
            <button
              onClick={() => setIsHeadingDropdownOpen(!isHeadingDropdownOpen)}
              className={`p-1 rounded hover:bg-muted transition-colors flex items-center gap-0.5 ${getCurrentHeadingLevel() ? 'bg-muted' : ''}`}
              title="Heading"
            >
              <span className="text-xs font-medium">{getHeadingLabel()}</span>
              <ChevronDown className="w-2.5 h-2.5" />
            </button>
            {isHeadingDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-border rounded-md shadow-lg z-50 min-w-[100px]">
                <button
                  onClick={() => handleHeadingSelect(null)}
                  className={`w-full text-left px-2 py-1 text-xs hover:bg-muted transition-colors ${!getCurrentHeadingLevel() ? 'bg-muted' : ''}`}
                >
                  Paragraph
                </button>
                {[1, 2, 3, 4, 5, 6].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleHeadingSelect(level)}
                    className={`w-full text-left px-2 py-1 text-xs hover:bg-muted transition-colors ${getCurrentHeadingLevel() === level ? 'bg-muted' : ''}`}
                  >
                    Heading {level}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-4 bg-border mx-0.5" />

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1 rounded hover:bg-muted transition-colors ${editor.isActive('bulletList') ? 'bg-muted' : ''}`}
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1 rounded hover:bg-muted transition-colors ${editor.isActive('orderedList') ? 'bg-muted' : ''}`}
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={`p-1 rounded hover:bg-muted transition-colors ${editor.isActive('taskList') ? 'bg-muted' : ''}`}
            title="Checklist"
          >
            <CheckSquare className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => editor.commands.insertCollapsibleBlock()}
            className={`p-1 rounded hover:bg-muted transition-colors ${editor.isActive('collapsibleBlock') ? 'bg-muted' : ''}`}
            title="Toggle List"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-border mx-0.5" />

          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1 rounded hover:bg-muted transition-colors ${editor.isActive('bold') ? 'bg-muted' : ''}`}
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1 rounded hover:bg-muted transition-colors ${editor.isActive('italic') ? 'bg-muted' : ''}`}
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1 rounded hover:bg-muted transition-colors ${editor.isActive('strike') ? 'bg-muted' : ''}`}
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-1 rounded hover:bg-muted transition-colors ${editor.isActive('code') ? 'bg-muted' : ''}`}
            title="Code"
          >
            <Code className="w-3.5 h-3.5" />
          </button>

          {/* Highlight Color Dropdown */}
          <div className="relative" ref={highlightDropdownRef}>
            <button
              onClick={() => setIsHighlightDropdownOpen(!isHighlightDropdownOpen)}
              className={`p-1 rounded hover:bg-muted transition-colors flex items-center gap-0.5 ${editor.isActive('highlight') ? 'bg-muted' : ''}`}
              title="Highlight"
            >
              <Highlighter className="w-3.5 h-3.5" />
              <ChevronDown className="w-2.5 h-2.5" />
            </button>
            {isHighlightDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-border rounded-md shadow-lg z-50 p-1.5 min-w-[100px]">
                <button
                  onClick={() => handleHighlightSelect(null)}
                  className="w-full text-left px-1.5 py-1 text-xs hover:bg-muted transition-colors rounded flex items-center gap-1.5"
                >
                  <span className="w-3 h-3 border border-border rounded flex items-center justify-center text-[8px]">✕</span>
                  None
                </button>
                <div className="border-t border-border my-1" />
                {highlightColors.map((item) => (
                  <button
                    key={item.color}
                    onClick={() => handleHighlightSelect(item.color)}
                    className="w-full text-left px-1.5 py-1 text-xs hover:bg-muted transition-colors rounded flex items-center gap-1.5"
                  >
                    <span
                      className="w-3 h-3 rounded border border-border"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1 rounded hover:bg-muted transition-colors ${editor.isActive('blockquote') ? 'bg-muted' : ''}`}
            title="Blockquote"
          >
            <TextQuote className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Editor container */}
      <EditorContent editor={editor} />

      {/* Save and Cancel buttons */}
      {isEditing && (
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="text-[10px] px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            <Save className="w-3 h-3" />
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => {
              setIsSaving(false)
              setSaveError(null)
              onEditChange(false)
              onCancel()
            }}
            className="text-[10px] px-2 py-1 border border-border rounded hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
