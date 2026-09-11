"use client"

import React from "react"
import { RotateCcw } from "lucide-react"

interface ResetVoaModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ResetVoaModal({
  isOpen,
  onClose,
  onConfirm,
}: ResetVoaModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 border-b pb-3">
          <div className="p-2.5 rounded-full bg-red-100 text-red-600 flex-shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Reset All VOA Reports</h3>
            <p className="text-xs text-muted-foreground">Mark all lines as Inputted & clear all report entries</p>
          </div>
        </div>

        <p className="text-xs text-foreground leading-relaxed">
          Are you sure you want to reset all VOA reports? This will set all script lines to Inputted and clear all entries from the report list like a fresh start.
        </p>

        <div className="flex items-center justify-end gap-2 border-t pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold rounded-md border border-border hover:bg-muted text-foreground transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-1.5 text-xs font-bold rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Yes, Reset All Reports</span>
          </button>
        </div>
      </div>
    </div>
  )
}
