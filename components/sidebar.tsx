"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { LayoutGrid, Calendar, MessageSquare, Users, Settings, X, Info, FileText } from "lucide-react"

// Dynamic import with SSR disabled to avoid "window is not defined" error
const BlockNotePopup = dynamic(
  () => import("./blocknote-popup").then((mod) => mod.BlockNotePopup),
  { ssr: false }
)

export function Sidebar() {
  const [showPresetPopup, setShowPresetPopup] = useState(false)
  const [showEditorPopup, setShowEditorPopup] = useState(false)

  const handleSaveNote = (data: any) => {
    console.log("Note saved:", data)
    // You can handle the saved data here (e.g., send to API, store in state, etc.)
    alert(`Note "${data.title}" saved successfully! Check console for details.`)
  }

  return (
    <>
      <aside className="w-20 bg-white border-r border-border flex flex-col items-center py-6 space-y-4">
        <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
          S
        </div>

        <button
          onClick={() => setShowPresetPopup(true)}
          className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-muted transition-colors group"
          title="Show Presets"
        >
          <Info className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>

        <button
          onClick={() => setShowEditorPopup(true)}
          className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-muted transition-colors group"
          title="BlockNote Editor"
        >
          <FileText className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </aside>

      {/* Preset Popup Modal */}
      {showPresetPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowPresetPopup(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold">Presets</h2>
              <button
                onClick={() => setShowPresetPopup(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* DZ Preset */}
              <div className="space-y-2">
                <h3 className="font-semibold text-xl text-foreground">DZ Preset</h3>
                <div className="pl-4 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    • NR SRT but Text Replacement is white Color 64/48
                  </p>
                </div>
              </div>

              {/* NR Preset */}
              <div className="space-y-2">
                <h3 className="font-semibold text-xl text-foreground">NR Preset</h3>
                <div className="pl-4 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    • NR with <span className="inline-block w-4 h-4 rounded border border-border align-middle" style={{ backgroundColor: '#fbf9da' }}></span> <span className="text-foreground">#fbf9da</span> 64/48
                  </p>
                </div>
              </div>

              {/* JZ Preset */}
              <div className="space-y-2">
                <h3 className="font-semibold text-xl text-foreground">JZ Preset</h3>
                <div className="pl-4 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    • SUB Use preset with
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • Text Replacement JZ with <span className="inline-block w-4 h-4 rounded border border-border align-middle" style={{ backgroundColor: '#E59B44' }}></span> <span className="text-foreground">#E59B44</span> 64/48
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-muted/30">
              <button
                onClick={() => setShowPresetPopup(false)}
                className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BlockNote Popup Modal */}
      <BlockNotePopup
        isOpen={showEditorPopup}
        onClose={() => setShowEditorPopup(false)}
        onSave={handleSaveNote}
        title="Quick Note"
      />
    </>
  )
}
