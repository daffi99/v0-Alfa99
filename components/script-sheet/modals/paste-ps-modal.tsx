"use client"

import React from "react"
import { Sparkles, X } from "lucide-react"

interface PastePsModalProps {
  isOpen: boolean
  pasteText: string
  onChangePasteText: (val: string) => void
  onClose: () => void
  onApply: () => void
}

export function PastePsModal({
  isOpen,
  pasteText,
  onChangePasteText,
  onClose,
  onApply,
}: PastePsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-xl shadow-2xl max-w-md w-full p-5 space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-foreground">
              Paste Pitch Shifter (PS) Column
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          Copy a single column of PS numbers from Google Sheets (e.g. 0.97, 1.04, 0.98) and paste below to update characters row by row.
        </p>

        <textarea
          placeholder={`0.97\n1.04\n0.98\n0.92`}
          value={pasteText}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChangePasteText(e.target.value)}
          className="w-full font-mono text-xs h-36 p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="flex items-center justify-end gap-2 pt-2 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted rounded-md cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onApply}
            className="px-4 py-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md transition-colors cursor-pointer"
          >
            Apply PS Values
          </button>
        </div>
      </div>
    </div>
  )
}
