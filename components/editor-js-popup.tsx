"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import Highlight from "@tiptap/extension-highlight"
import { ToggleList } from "./toggle-list-extension"
import { X, Undo2, Redo2, Bold, Italic, Strikethrough, Code, List, ListOrdered, CheckSquare, ChevronDown, ChevronRight, Highlighter, TextQuote } from "lucide-react"
import { useEffect, useState, useRef } from "react"

interface EditorJsPopupProps {
  isOpen: boolean
  onClose: () => void
}

const highlightColors = [
  { name: "Yellow", color: "#fef08a" },
  { name: "Green", color: "#bbf7d0" },
  { name: "Blue", color: "#bfdbfe" },
  { name: "Pink", color: "#fbcfe8" },
  { name: "Purple", color: "#ddd6fe" },
  { name: "Orange", color: "#fed7aa" },
]

export function EditorJsPopup({ isOpen, onClose }: EditorJsPopupProps) {
  const [isHeadingDropdownOpen, setIsHeadingDropdownOpen] = useState(false)
  const [isHighlightDropdownOpen, setIsHighlightDropdownOpen] = useState(false)
  const headingDropdownRef = useRef<HTMLDivElement>(null)
  const highlightDropdownRef = useRef<HTMLDivElement>(null)

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
    content: "<p>Welcome to TipTap! Start editing your content here.</p>",
    editorProps: {
      attributes: {
        class: "tiptap-editor focus:outline-none min-h-[300px]",
      },
    },
  })

  useEffect(() => {
    if (!isOpen && editor) {
      // Reset content when popup closes
      editor.commands.setContent("<p>Welcome to TipTap! Start editing your content here.</p>")
    }
  }, [isOpen, editor])

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
    return "Paragraph"
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

  const handleSave = () => {
    if (editor) {
      try {
        const outputData = editor.getJSON()
        console.log("TipTap output:", outputData)
        // You can handle the saved data here (e.g., send to API, store in state, etc.)
        alert("Content saved! Check console for output.")
      } catch (error) {
        console.error("Error saving editor content:", error)
      }
    }
  }

  if (!isOpen || !editor) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">TipTap Simple Editor</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="border-b border-border p-2 flex items-center gap-1 flex-wrap">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-2 rounded hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-2 rounded hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Heading Dropdown */}
          <div className="relative" ref={headingDropdownRef}>
            <button
              onClick={() => setIsHeadingDropdownOpen(!isHeadingDropdownOpen)}
              className={`p-2 rounded hover:bg-muted transition-colors flex items-center gap-1 ${getCurrentHeadingLevel() ? 'bg-muted' : ''}`}
              title="Heading"
            >
              <span className="text-sm font-medium">{getHeadingLabel()}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {isHeadingDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-border rounded-md shadow-lg z-50 min-w-[140px]">
                <button
                  onClick={() => handleHeadingSelect(null)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${!getCurrentHeadingLevel() ? 'bg-muted' : ''}`}
                >
                  Paragraph
                </button>
                {[1, 2, 3, 4, 5, 6].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleHeadingSelect(level)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${getCurrentHeadingLevel() === level ? 'bg-muted' : ''}`}
                  >
                    Heading {level}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-border mx-1" />

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('bulletList') ? 'bg-muted' : ''}`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('orderedList') ? 'bg-muted' : ''}`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('taskList') ? 'bg-muted' : ''}`}
            title="Checklist"
          >
            <CheckSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.commands.insertCollapsibleBlock()}
            className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('collapsibleBlock') ? 'bg-muted' : ''}`}
            title="Toggle List"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-border mx-1" />

          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('bold') ? 'bg-muted' : ''}`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('italic') ? 'bg-muted' : ''}`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('strike') ? 'bg-muted' : ''}`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('code') ? 'bg-muted' : ''}`}
            title="Code"
          >
            <Code className="w-4 h-4" />
          </button>

          {/* Highlight Color Dropdown */}
          <div className="relative" ref={highlightDropdownRef}>
            <button
              onClick={() => setIsHighlightDropdownOpen(!isHighlightDropdownOpen)}
              className={`p-2 rounded hover:bg-muted transition-colors flex items-center gap-1 ${editor.isActive('highlight') ? 'bg-muted' : ''}`}
              title="Highlight"
            >
              <Highlighter className="w-4 h-4" />
              <ChevronDown className="w-3 h-3" />
            </button>
            {isHighlightDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-border rounded-md shadow-lg z-50 p-2 min-w-[120px]">
                <button
                  onClick={() => handleHighlightSelect(null)}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted transition-colors rounded flex items-center gap-2"
                >
                  <span className="w-4 h-4 border border-border rounded flex items-center justify-center text-xs">✕</span>
                  No highlight
                </button>
                <div className="border-t border-border my-1" />
                {highlightColors.map((item) => (
                  <button
                    key={item.color}
                    onClick={() => handleHighlightSelect(item.color)}
                    className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted transition-colors rounded flex items-center gap-2"
                  >
                    <span
                      className="w-4 h-4 rounded border border-border"
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
            className={`p-2 rounded hover:bg-muted transition-colors ${editor.isActive('blockquote') ? 'bg-muted' : ''}`}
            title="Blockquote"
          >
            <TextQuote className="w-4 h-4" />
          </button>
        </div>

        {/* Editor Container */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          <EditorContent editor={editor} />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/30 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

