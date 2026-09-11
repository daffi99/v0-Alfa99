"use client"

import React from "react"
import { Users, X } from "lucide-react"

export interface WrongCastModalState {
  isOpen: boolean
  currentCharacter: string
  targetLineId?: string
}

interface WrongCastCharacterOption {
  characterName: string
  lineCount: number
}

interface WrongCastModalProps {
  modal: WrongCastModalState
  options: WrongCastCharacterOption[]
  onClose: () => void
  onSelectCharacter: (characterName: string) => void
}

export function WrongCastModal({
  modal,
  options,
  onClose,
  onSelectCharacter,
}: WrongCastModalProps) {
  if (!modal.isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-xl shadow-2xl p-5 w-full max-w-4xl flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              Select Correct Character for Wrong Cast
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Line for <b className="text-foreground font-semibold">{modal.currentCharacter}</b> was assigned to the wrong cast. Pick the correct intended character:
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 7 Rows X N Columns Grid */}
        <div className="p-3 bg-muted/20 border rounded-lg overflow-x-auto max-w-full">
          <div className="grid grid-rows-7 grid-flow-col gap-1.5 min-w-max">
            {options.map((item, idx) => {
              const isUnused = item.lineCount === 0
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectCharacter(item.characterName)}
                  className={`px-2.5 py-1.5 rounded-md border text-xs transition-all flex items-center justify-between gap-2.5 min-w-[125px] shadow-2xs group active:scale-95 cursor-pointer whitespace-nowrap ${
                    isUnused
                      ? "border-border/50 bg-muted/30 text-muted-foreground opacity-50 hover:opacity-100 hover:border-amber-400 hover:text-foreground"
                      : "border-border bg-card hover:bg-amber-500/10 hover:border-amber-500 text-foreground font-semibold"
                  }`}
                >
                  <span className={isUnused ? "font-normal text-muted-foreground" : "font-bold group-hover:text-amber-700"}>
                    {item.characterName}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      isUnused
                        ? "bg-muted/80 text-muted-foreground"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {item.lineCount}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-end border-t pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium border rounded-md hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
