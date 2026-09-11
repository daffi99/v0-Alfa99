"use client"

import React from "react"
import { Clock, X, Link, Unlink } from "lucide-react"
import { TimeStepperInput, timeToSeconds, shiftTimingValue } from "../utils"

export interface EditTimingModalState {
  isOpen: boolean
  lineId: string
  startTime: string
  endTime: string
  batchTime: string
}

interface EditTimingModalProps {
  modal: EditTimingModalState
  isEditBatchOverride: boolean
  setIsEditBatchOverride: (val: boolean) => void
  setEditTimingModal: React.Dispatch<React.SetStateAction<EditTimingModalState>>
  onClose: () => void
  onSave: () => void
}

export function EditTimingModal({
  modal,
  isEditBatchOverride,
  setIsEditBatchOverride,
  setEditTimingModal,
  onClose,
  onSave,
}: EditTimingModalProps) {
  if (!modal.isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-sm p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Edit Line Timing</h3>
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
          <TimeStepperInput
            label="Start Time"
            value={modal.startTime}
            onChange={(val) => {
              setEditTimingModal((prev) => {
                if (isEditBatchOverride) {
                  const oldStartSec = timeToSeconds(prev.startTime)
                  const newStartSec = timeToSeconds(val)
                  if (oldStartSec !== null && newStartSec !== null) {
                    const delta = newStartSec - oldStartSec
                    return {
                      ...prev,
                      startTime: val,
                      endTime: shiftTimingValue(prev.endTime, delta),
                    }
                  }
                  return { ...prev, startTime: val }
                }
                const oldStartSec = timeToSeconds(prev.startTime)
                const newStartSec = timeToSeconds(val)
                if (oldStartSec !== null && newStartSec !== null) {
                  const delta = newStartSec - oldStartSec
                  return {
                    ...prev,
                    startTime: val,
                    endTime: shiftTimingValue(prev.endTime, delta),
                    batchTime: shiftTimingValue(prev.batchTime, delta),
                  }
                }
                return { ...prev, startTime: val }
              })
            }}
            onStep={(delta) => {
              setEditTimingModal((prev) => ({
                ...prev,
                startTime: shiftTimingValue(prev.startTime, delta),
                endTime: shiftTimingValue(prev.endTime, delta),
                batchTime: isEditBatchOverride ? prev.batchTime : shiftTimingValue(prev.batchTime, delta),
              }))
            }}
            placeholder="e.g. 00:00:16"
          />
          <TimeStepperInput
            label="End Time"
            value={modal.endTime}
            onChange={(val) => setEditTimingModal({ ...modal, endTime: val })}
            onStep={(delta) => {
              setEditTimingModal((prev) => ({
                ...prev,
                endTime: shiftTimingValue(prev.endTime, delta),
              }))
            }}
            placeholder="e.g. 00:00:18"
          />
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-foreground">Batch Time</span>
              <button
                type="button"
                onClick={() => setIsEditBatchOverride(!isEditBatchOverride)}
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 transition-colors cursor-pointer ${
                  isEditBatchOverride
                    ? "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                    : "bg-muted text-muted-foreground hover:text-foreground border-input"
                }`}
                title={isEditBatchOverride ? "Batch time is unlinked (Manual Override active)" : "Click to unlink & override Batch Time manually"}
              >
                {isEditBatchOverride ? <Unlink className="w-3 h-3 text-amber-600" /> : <Link className="w-3 h-3 text-muted-foreground" />}
                <span>{isEditBatchOverride ? "Manual Override" : "Linked"}</span>
              </button>
            </div>
            <TimeStepperInput
              label=""
              value={modal.batchTime}
              onChange={(val) => {
                setEditTimingModal((prev) => {
                  if (isEditBatchOverride) {
                    return { ...prev, batchTime: val }
                  }
                  const oldBatchSec = timeToSeconds(prev.batchTime)
                  const newBatchSec = timeToSeconds(val)
                  if (oldBatchSec !== null && newBatchSec !== null) {
                    const delta = newBatchSec - oldBatchSec
                    return {
                      ...prev,
                      batchTime: val,
                      startTime: shiftTimingValue(prev.startTime, delta),
                      endTime: shiftTimingValue(prev.endTime, delta),
                    }
                  }
                  return { ...prev, batchTime: val }
                })
              }}
              onStep={(delta) => {
                setEditTimingModal((prev) => {
                  if (isEditBatchOverride) {
                    return {
                      ...prev,
                      batchTime: shiftTimingValue(prev.batchTime, delta),
                    }
                  }
                  return {
                    ...prev,
                    startTime: shiftTimingValue(prev.startTime, delta),
                    endTime: shiftTimingValue(prev.endTime, delta),
                    batchTime: shiftTimingValue(prev.batchTime, delta),
                  }
                })
              }}
              placeholder="e.g. 00:04:22"
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
            onClick={onSave}
            className="px-4 py-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-md shadow-sm transition-colors cursor-pointer"
          >
            Save Timing
          </button>
        </div>
      </div>
    </div>
  )
}
