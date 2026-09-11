"use client"

import React from "react"
import { Sparkles, X, Check } from "lucide-react"

export interface EditPsModalState {
  isOpen: boolean
  characterName: string
  currentPs: string
  newPs: string
}

interface EditPsModalProps {
  modal: EditPsModalState
  onClose: () => void
  onSave: () => void
  onRemove: () => void
  onChangeNewPs: (value: string) => void
}

export function EditPsModal({
  modal,
  onClose,
  onSave,
  onRemove,
  onChangeNewPs,
}: EditPsModalProps) {
  if (!modal.isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-card border rounded-xl shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-500">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              {modal.currentPs ? "Edit Pitch/Speed (PS)" : "Add New Pitch/Speed (PS)"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground rounded-md p-1 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-medium text-muted-foreground block mb-1">
              Character
            </label>
            <div className="text-xs font-bold px-3 py-2 bg-muted/50 rounded-md text-foreground font-mono">
              {modal.characterName}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-muted-foreground block mb-1">
              Pitch / Speed Value (e.g. +2/+10 or 0/-5)
            </label>
            <input
              type="text"
              value={modal.newPs}
              onChange={(e) => onChangeNewPs(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && modal.newPs.trim()) {
                  onSave()
                } else if (e.key === "Escape") {
                  onClose()
                }
              }}
              placeholder="Enter PS (e.g. +2/+5)..."
              autoFocus
              className="w-full text-xs font-mono font-medium px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          {modal.currentPs ? (
            <button
              type="button"
              onClick={onRemove}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-md text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              Clear PS
            </button>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold rounded-md border border-border hover:bg-muted text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={!modal.newPs.trim()}
              className="px-4 py-1.5 text-xs font-bold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
