"use client"

import React from "react"
import { Users, X, Check } from "lucide-react"

export interface EditArtistModalState {
  isOpen: boolean
  characterName: string
  currentArtist: string
  newArtist: string
}

interface EditArtistModalProps {
  modal: EditArtistModalState
  onClose: () => void
  onSave: () => void
  onChangeNewArtist: (value: string) => void
}

export function EditArtistModal({
  modal,
  onClose,
  onSave,
  onChangeNewArtist,
}: EditArtistModalProps) {
  if (!modal.isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-sm p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Change VO Artist</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
              Character Name
            </label>
            <div className="font-bold text-xs text-foreground bg-muted/50 px-3 py-2 rounded-md border border-border/60">
              {modal.characterName}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
              VO Artist Name
            </label>
            <input
              type="text"
              value={modal.newArtist}
              onChange={(e) => onChangeNewArtist(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  onSave()
                }
                if (e.key === "Escape") {
                  onClose()
                }
              }}
              placeholder="Enter artist name..."
              autoFocus
              className="w-full text-xs font-medium px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t">
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
            disabled={!modal.newArtist.trim()}
            className="px-4 py-1.5 text-xs font-bold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  )
}
