"use client"

import React, { useState, useMemo } from "react"
import { Plus, X, Search, Check, ChevronDown, Link, Unlink } from "lucide-react"
import { type ScriptLineStatus } from "../../script-wizard-modal"
import { SCRIPT_LINE_STATUSES, TimeStepperInput, timeToSeconds, shiftTimingValue } from "../utils"

export interface AddLineModalState {
  isOpen: boolean
  position: "before" | "after"
  refLineId: string
  afterEps: string
  character: string
  lineText: string
  status?: ScriptLineStatus
  startTime?: string
  endTime?: string
  batchTime?: string
}

interface AddLineModalProps {
  modal: AddLineModalState
  allCharacters: string[]
  isAddLineBatchOverride: boolean
  setIsAddLineBatchOverride: (val: boolean) => void
  setAddLineModal: React.Dispatch<React.SetStateAction<AddLineModalState>>
  onClose: () => void
  onSave: () => void
}

export function AddLineModal({
  modal,
  allCharacters,
  isAddLineBatchOverride,
  setIsAddLineBatchOverride,
  setAddLineModal,
  onClose,
  onSave,
}: AddLineModalProps) {
  const [isCharSelectOpen, setIsCharSelectOpen] = useState(false)
  const [charSearchQuery, setCharSearchQuery] = useState("")

  const filteredCharacters = useMemo(() => {
    if (!charSearchQuery.trim()) return allCharacters
    return allCharacters.filter((c) =>
      c.toLowerCase().includes(charSearchQuery.trim().toLowerCase())
    )
  }, [allCharacters, charSearchQuery])

  if (!modal.isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-md p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-sm text-foreground">
              {modal.position === "before" ? "Add Line Before" : "Add Line After"}
            </h3>
            {modal.afterEps && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary font-mono text-muted-foreground">
                EP {modal.afterEps.padStart(3, "0")}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {/* Character selection */}
          <div>
            <label className="block font-semibold text-foreground mb-1">
              Character Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCharSelectOpen(!isCharSelectOpen)}
                className="w-full h-9 px-3 text-xs rounded-md border border-input bg-background text-foreground hover:bg-muted/50 flex items-center justify-between font-medium cursor-pointer transition-colors shadow-2xs"
              >
                <span className={modal.character ? "font-bold text-foreground" : "text-muted-foreground"}>
                  {modal.character || "Select Character..."}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              </button>

              {isCharSelectOpen && (
                <>
                  <div
                    className="fixed inset-0 z-50"
                    onClick={() => setIsCharSelectOpen(false)}
                  />
                  <div className="absolute left-0 right-0 top-full mt-1 z-55 bg-popover border border-border rounded-lg shadow-2xl p-1.5 flex flex-col space-y-1.5 animate-in fade-in zoom-in-95 duration-100 text-left">
                    <div className="relative p-0.5">
                      <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search character..."
                        value={charSearchQuery}
                        onChange={(e) => setCharSearchQuery(e.target.value)}
                        className="w-full h-7 pl-7 pr-6 text-xs rounded border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                        autoFocus
                      />
                      {charSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setCharSearchQuery("")}
                          className="absolute right-2 top-2 p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors cursor-pointer"
                          title="Clear search"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="overflow-y-auto space-y-0.5 max-h-48 pr-0.5">
                      {filteredCharacters.map((charName) => {
                        const isSelected = modal.character === charName
                        return (
                          <button
                            key={charName}
                            type="button"
                            onClick={() => {
                              setAddLineModal((prev) => ({ ...prev, character: charName }))
                              setIsCharSelectOpen(false)
                              setCharSearchQuery("")
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-primary text-primary-foreground font-bold"
                                : "text-foreground hover:bg-muted"
                            }`}
                          >
                            <span>{charName}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                          </button>
                        )
                      })}
                      {filteredCharacters.length === 0 && (
                        <div className="p-3 text-center text-xs text-muted-foreground">
                          No matching characters found
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Line Status */}
          <div>
            <label className="block font-semibold text-foreground mb-1">
              Line Status
            </label>
            <select
              value={modal.status || "Inputted"}
              onChange={(e) => setAddLineModal((prev) => ({ ...prev, status: e.target.value as ScriptLineStatus }))}
              className="w-full h-8 px-2.5 text-xs rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
            >
              {SCRIPT_LINE_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Timing Inputs with Steppers */}
          <div className="grid grid-cols-3 gap-2">
            <TimeStepperInput
              label="Start Time"
              value={modal.startTime || ""}
              onChange={(val) => {
                setAddLineModal((prev) => {
                  if (isAddLineBatchOverride) {
                    const oldStartSec = timeToSeconds(prev.startTime || "")
                    const newStartSec = timeToSeconds(val)
                    if (oldStartSec !== null && newStartSec !== null) {
                      const delta = newStartSec - oldStartSec
                      return {
                        ...prev,
                        startTime: val,
                        endTime: shiftTimingValue(prev.endTime || "", delta),
                      }
                    }
                    return { ...prev, startTime: val }
                  }
                  const oldStartSec = timeToSeconds(prev.startTime || "")
                  const newStartSec = timeToSeconds(val)
                  if (oldStartSec !== null && newStartSec !== null) {
                    const delta = newStartSec - oldStartSec
                    return {
                      ...prev,
                      startTime: val,
                      endTime: shiftTimingValue(prev.endTime || "", delta),
                      batchTime: shiftTimingValue(prev.batchTime || "", delta),
                    }
                  }
                  return { ...prev, startTime: val }
                })
              }}
              onStep={(delta) => {
                setAddLineModal((prev) => ({
                  ...prev,
                  startTime: shiftTimingValue(prev.startTime || "", delta),
                  endTime: shiftTimingValue(prev.endTime || "", delta),
                  batchTime: isAddLineBatchOverride ? (prev.batchTime || "") : shiftTimingValue(prev.batchTime || "", delta),
                }))
              }}
              placeholder="e.g. 00:00:16"
            />
            <TimeStepperInput
              label="End Time"
              value={modal.endTime || ""}
              onChange={(val) => setAddLineModal((prev) => ({ ...prev, endTime: val }))}
              onStep={(delta) => {
                setAddLineModal((prev) => ({
                  ...prev,
                  endTime: shiftTimingValue(prev.endTime || "", delta),
                }))
              }}
              placeholder="e.g. 00:00:18"
            />
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-foreground truncate">Batch Time</span>
                <button
                  type="button"
                  onClick={() => setIsAddLineBatchOverride(!isAddLineBatchOverride)}
                  className={`text-[9px] font-bold px-1 py-0.5 rounded border flex items-center gap-0.5 transition-colors cursor-pointer ${
                    isAddLineBatchOverride
                      ? "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                      : "bg-muted text-muted-foreground hover:text-foreground border-input"
                  }`}
                  title={isAddLineBatchOverride ? "Batch time is unlinked (Manual Override active)" : "Click to unlink & override Batch Time manually"}
                >
                  {isAddLineBatchOverride ? <Unlink className="w-2.5 h-2.5 text-amber-600" /> : <Link className="w-2.5 h-2.5 text-muted-foreground" />}
                  <span>{isAddLineBatchOverride ? "Override" : "Linked"}</span>
                </button>
              </div>
              <TimeStepperInput
                label=""
                value={modal.batchTime || ""}
                onChange={(val) => {
                  setAddLineModal((prev) => {
                    if (isAddLineBatchOverride) {
                      return { ...prev, batchTime: val }
                    }
                    const oldBatchSec = timeToSeconds(prev.batchTime || "")
                    const newBatchSec = timeToSeconds(val)
                    if (oldBatchSec !== null && newBatchSec !== null) {
                      const delta = newBatchSec - oldBatchSec
                      return {
                        ...prev,
                        batchTime: val,
                        startTime: shiftTimingValue(prev.startTime || "", delta),
                        endTime: shiftTimingValue(prev.endTime || "", delta),
                      }
                    }
                    return { ...prev, batchTime: val }
                  })
                }}
                onStep={(delta) => {
                  setAddLineModal((prev) => {
                    if (isAddLineBatchOverride) {
                      return {
                        ...prev,
                        batchTime: shiftTimingValue(prev.batchTime || "", delta),
                      }
                    }
                    return {
                      ...prev,
                      startTime: shiftTimingValue(prev.startTime || "", delta),
                      endTime: shiftTimingValue(prev.endTime || "", delta),
                      batchTime: shiftTimingValue(prev.batchTime || "", delta),
                    }
                  })
                }}
                placeholder="e.g. 00:04:22"
              />
            </div>
          </div>

          {/* Line Text */}
          <div>
            <label className="block font-semibold text-foreground mb-1">
              Script Line Text <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Write dialogue/script line here..."
              value={modal.lineText}
              onChange={(e) => setAddLineModal((prev) => ({ ...prev, lineText: e.target.value }))}
              className="w-full min-h-[80px] p-3 text-xs font-mono rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!modal.character || !modal.lineText.trim()}
            onClick={onSave}
            className="px-4 py-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 rounded-md shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Line</span>
          </button>
        </div>
      </div>
    </div>
  )
}
