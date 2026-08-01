"use client"

import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/mantine/style.css"
import "@blocknote/core/fonts/inter.css"
import { X, Save, Trash2, FileText } from "lucide-react"
import { useEffect, useState, useCallback } from "react"

interface BlockNotePopupProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (content: any) => void
  initialContent?: any
  title?: string
}

export function BlockNotePopup({
  isOpen,
  onClose,
  onSave,
  initialContent,
  title = "Note Editor"
}: BlockNotePopupProps) {
  const [noteTitle, setNoteTitle] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Create the BlockNote editor
  const editor = useCreateBlockNote({
    initialContent: initialContent || [
      {
        type: "paragraph",
        content: "Start writing your note here...",
      },
    ],
  })

  // Reset content when popup opens with new content
  useEffect(() => {
    if (isOpen && editor && initialContent) {
      editor.replaceBlocks(editor.document, initialContent)
    }
  }, [isOpen, initialContent])

  // Handle save
  const handleSave = useCallback(async () => {
    if (!editor) return

    setIsSaving(true)
    try {
      const content = editor.document
      console.log("BlockNote saved content:", content)

      if (onSave) {
        await onSave({
          title: noteTitle || "Untitled Note",
          content,
          savedAt: new Date().toISOString()
        })
      }

      setLastSaved(new Date())
    } catch (error) {
      console.error("Error saving:", error)
    } finally {
      setIsSaving(false)
    }
  }, [editor, noteTitle, onSave])

  // Handle clear
  const handleClear = useCallback(() => {
    if (!editor) return

    editor.replaceBlocks(editor.document, [
      {
        type: "paragraph",
        content: "",
      },
    ])
    setNoteTitle("")
  }, [editor])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      // Don't interfere with Tab - let BlockNote handle it natively
      if (e.key === "Tab") return

      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        handleSave()
      }

      // Escape to close
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, handleSave, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "slideIn 0.2s ease-out"
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder={title}
                className="text-lg font-semibold bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-400 w-full"
              />
              {lastSaved && (
                <p className="text-xs text-gray-400 mt-0.5">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Editor Container */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-white">
          <div className="blocknote-light-wrapper">
            <BlockNoteView
              editor={editor}
              theme="light"
              data-theming-css-variables-demo
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
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="px-3 py-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex items-center gap-2"
              title="Clear content"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Note
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

