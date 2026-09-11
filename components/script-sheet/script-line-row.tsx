"use client"

import React, { memo } from "react"
import {
  Check,
  ChevronDown,
  Clock,
  Copy,
  MoreVertical,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react"
import { type ScriptLine, type ScriptLineStatus } from "../script-wizard-modal"
import {
  STATUS_STYLE_MAP,
  SCRIPT_LINE_STATUSES,
  formatDisplayTiming,
  formatToFullTimecode,
  timeToSeconds,
} from "./utils"

export interface ScriptLineRowProps {
  line: ScriptLine
  prevLine?: ScriptLine
  idx: number
  showDivider: boolean
  currentEps: string
  countInEp: number
  isCaptionTask: boolean
  charStyle?: React.CSSProperties
  isHighlighted: boolean
  isStatusDropdownOpen: boolean
  isActionDropdownOpen: boolean
  isTimingCopied: boolean
  isScriptLineCopied: boolean
  colWidths: { character: number; scriptText: number; voErrorNote: number }
  timelineBatchTime: string | null
  totalLinesCount: number
  onCopyStartTime: (lineId: string, time?: string) => void
  onCopyScriptLineText: (lineId: string, text: string) => void
  onUpdateVoErrorNote: (lineId: string, note: string) => void
  onUpdateLineStatus: (lineId: string, status: ScriptLineStatus) => void
  onOpenStatusDropdown: (lineId: string | null) => void
  onOpenActionDropdown: (lineId: string | null) => void
  onOpenAddLineModal: (position: "before" | "after", line: ScriptLine, isOno?: boolean) => void
  onOpenEditTimingModal: (line: ScriptLine, prevLine?: ScriptLine) => void
  onDeleteLine: (lineId: string) => void
}

export const ScriptLineRow = memo(function ScriptLineRow({
  line,
  prevLine,
  idx,
  showDivider,
  currentEps,
  countInEp,
  isCaptionTask,
  charStyle,
  isHighlighted,
  isStatusDropdownOpen,
  isActionDropdownOpen,
  isTimingCopied,
  isScriptLineCopied,
  colWidths,
  timelineBatchTime,
  totalLinesCount,
  onCopyStartTime,
  onCopyScriptLineText,
  onUpdateVoErrorNote,
  onUpdateLineStatus,
  onOpenStatusDropdown,
  onOpenActionDropdown,
  onOpenAddLineModal,
  onOpenEditTimingModal,
  onDeleteLine,
}: ScriptLineRowProps) {
  const displayLineText = line.lineText
    ? line.lineText
        .replace(/Missing Onomatopoeia/gi, "Onomatopoeia")
        .replace(/\\N/gi, " ")
        .replace(/[\r\n]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : ""

  const currStartSec = timeToSeconds(line.startTime)
  const prevEndSec = timeToSeconds(prevLine?.endTime || prevLine?.startTime)

  const isNoRange = !!line.startTime && (!line.endTime || line.endTime === "-" || line.startTime === line.endTime)
  const isOverlap = currStartSec !== null && prevEndSec !== null && currStartSec <= prevEndSec
  const isSpecialTimingMark = line.status === "Onomatopoeia" || line.status === "Missing Onomatopoeia"

  const isVoError = line.status === "VO Error" || Boolean(line.voErrorNote)
  const isBeluman = line.status === "Beluman"
  const isNotUsed = line.status === "Not used"

  return (
    <React.Fragment>
      {showDivider && (
        <tr className="bg-indigo-50/80 dark:bg-indigo-950/50 border-y-2 border-indigo-200 dark:border-indigo-800">
          <td colSpan={isCaptionTask ? 9 : 8} className="px-3 py-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-mono font-bold text-xs shadow-xs">
                EPISODE {currentEps}
              </span>
              <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                {countInEp} {countInEp === 1 ? "line" : "lines"} in this episode
              </span>
            </div>
          </td>
        </tr>
      )}
      <tr
        id={`script-line-${line.id}`}
        style={!isVoError && !isBeluman && !isNotUsed ? charStyle : undefined}
        className={`transition-all duration-300 ${
          isHighlighted
            ? "bg-amber-300/80 dark:bg-amber-500/50 ring-2 ring-amber-500 z-30 shadow-md animate-pulse"
            : isVoError
            ? "bg-amber-500/15 hover:bg-amber-500/20"
            : isBeluman
            ? "bg-red-500/10 hover:bg-red-500/15"
            : isNotUsed
            ? "bg-slate-100/80 dark:bg-slate-900/40 text-muted-foreground hover:bg-slate-200/60 dark:hover:bg-slate-800/50"
            : "hover:brightness-95 dark:hover:brightness-125"
        } ${isStatusDropdownOpen || isActionDropdownOpen ? "relative z-40" : ""}`}
      >
        <td className="p-2 text-center border-r font-mono text-[11px] font-bold">
          {line.eps ? line.eps.trim().padStart(3, "0") : "-"}
        </td>
        <td className="p-1.5 text-center border-r font-mono text-[10px] text-muted-foreground whitespace-nowrap overflow-hidden">
          {line.startTime && line.startTime !== "-" ? (
            <button
              type="button"
              onClick={() => onCopyStartTime(line.id, line.startTime)}
              className="w-full px-1 py-0.5 rounded hover:bg-muted/80 hover:text-foreground active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center gap-1 font-mono text-[10px]"
              title={`Click to copy timecode (${formatToFullTimecode(line.startTime)})`}
            >
              {isSpecialTimingMark ? (
                <span
                  className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold border border-amber-400/40 text-[10px]"
                  title={
                    isOverlap
                      ? "Overlapping start time"
                      : isNoRange
                      ? "No range timing"
                      : "Missing Onomatopoeia timing"
                  }
                >
                  {formatDisplayTiming(line.startTime)}
                </span>
              ) : (
                <span>{formatDisplayTiming(line.startTime)}</span>
              )}
              {isTimingCopied && (
                <Check className="w-3 h-3 text-emerald-600 flex-shrink-0 animate-in zoom-in-50" />
              )}
            </button>
          ) : (
            "-"
          )}
        </td>
        <td className="p-1.5 text-center border-r font-mono text-[10px] text-muted-foreground whitespace-nowrap overflow-hidden">
          {isSpecialTimingMark && line.endTime && line.endTime !== "-" ? (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono font-bold border border-amber-400/40 text-[10px]">
              {formatDisplayTiming(line.endTime)}
            </span>
          ) : (
            formatDisplayTiming(line.endTime)
          )}
        </td>
        <td className="p-1.5 text-center border-r font-mono text-[10px] text-muted-foreground whitespace-nowrap overflow-hidden">
          {isSpecialTimingMark && line.batchTime && line.batchTime !== "-" ? (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono font-bold border border-amber-400/40 text-[10px]">
              {formatDisplayTiming(line.batchTime)}
            </span>
          ) : (
            formatDisplayTiming(line.batchTime)
          )}
          {timelineBatchTime && (
            <div className="text-[9px] text-purple-700 dark:text-purple-400 font-mono font-medium leading-tight mt-0.5 truncate" title={`Timeline offset: ${timelineBatchTime}`}>
              {timelineBatchTime}
            </div>
          )}
        </td>
        <td
          style={{ width: `${colWidths.character}px`, minWidth: `${colWidths.character}px`, maxWidth: `${colWidths.character}px` }}
          className="p-2 border-r font-semibold text-[10px] whitespace-nowrap truncate overflow-hidden"
          title={line.character}
        >
          {line.character}
        </td>
        <td
          style={{ width: `${colWidths.scriptText}px`, minWidth: `${colWidths.scriptText}px`, maxWidth: `${colWidths.scriptText}px` }}
          className="p-2 border-r whitespace-nowrap overflow-hidden text-ellipsis leading-relaxed font-medium"
          title={displayLineText}
        >
          {line.status === "Onomatopoeia" || line.status === "Missing Onomatopoeia" ? (
            <span className="px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-800 dark:text-fuchsia-200 font-bold border border-fuchsia-400/40 text-[11px]">
              {displayLineText}
            </span>
          ) : (
            displayLineText
          )}
        </td>
        {isCaptionTask && (
          <td
            style={{ width: `${colWidths.voErrorNote}px`, minWidth: `${colWidths.voErrorNote}px`, maxWidth: `${colWidths.voErrorNote}px` }}
            className="p-2 border-r text-[10px] text-red-600 font-semibold"
          >
            <div className="flex items-center gap-1">
              <input
                type="text"
                placeholder="Note..."
                value={line.voErrorNote || ""}
                onChange={(e) => onUpdateVoErrorNote(line.id, e.target.value)}
                className="w-full bg-transparent text-red-600 font-medium placeholder:text-muted-foreground/30 outline-none border-b border-transparent focus:border-red-400 text-[10px] py-0"
              />
              {line.voErrorNote && (
                <button
                  type="button"
                  onClick={() => onUpdateVoErrorNote(line.id, "")}
                  className="p-0.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0 cursor-pointer"
                  title="Remove VO Error Note"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </td>
        )}
        <td className="p-2 border-r text-center">
          <div className={`relative inline-block text-center ${isStatusDropdownOpen ? "z-40" : ""}`}>
            <button
              type="button"
              onClick={() => onOpenStatusDropdown(isStatusDropdownOpen ? null : line.id)}
              className={`h-5 text-[10px] px-2 rounded-full font-bold transition-all border outline-none cursor-pointer flex items-center justify-center gap-1 active:scale-95 whitespace-nowrap ${
                STATUS_STYLE_MAP[line.status]?.bg || "bg-gray-100"
              } ${STATUS_STYLE_MAP[line.status]?.text || "text-gray-800"} ${
                STATUS_STYLE_MAP[line.status]?.border || "border-gray-200"
              }`}
            >
              <span>{STATUS_STYLE_MAP[line.status]?.label || line.status}</span>
              <ChevronDown className="w-2.5 h-2.5 opacity-70" />
            </button>

            {isStatusDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => onOpenStatusDropdown(null)}
                />
                <div
                  className={`absolute left-1/2 -translate-x-1/2 ${
                    idx >= totalLinesCount - 6 && idx >= 6 ? "bottom-full mb-1" : "top-full mt-1"
                  } z-50 w-36 min-w-[140px] max-h-64 overflow-y-auto bg-card border border-border rounded-lg shadow-xl p-1 space-y-0.5 animate-in fade-in zoom-in-95 duration-100 text-left`}
                >
                  {SCRIPT_LINE_STATUSES.map((st) => {
                    const style = STATUS_STYLE_MAP[st]
                    const isSelected = line.status === st || (st === "Onomatopoeia" && line.status === "Missing Onomatopoeia")
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          onUpdateLineStatus(line.id, st)
                          onOpenStatusDropdown(null)
                        }}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-primary/10 text-foreground font-bold"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${style?.bg || "bg-gray-300"} border ${style?.border || "border-gray-400"}`} />
                        <span className="flex-1 text-left text-foreground">{style?.label || st}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </td>
        <td className="p-2 text-center">
          <div className={`relative inline-block text-center ${isActionDropdownOpen ? "z-40" : ""}`}>
            <button
              type="button"
              onClick={() => onOpenActionDropdown(isActionDropdownOpen ? null : line.id)}
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isActionDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => onOpenActionDropdown(null)}
                />
                <div
                  className={`absolute right-0 ${
                    idx >= totalLinesCount - 4 && idx >= 4 ? "bottom-full mb-1" : "top-full mt-1"
                  } z-50 w-48 bg-card border border-border rounded-lg shadow-xl p-1 space-y-0.5 animate-in fade-in zoom-in-95 duration-100 text-left`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onCopyScriptLineText(line.id, displayLineText || line.lineText || "")
                      onOpenActionDropdown(null)
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
                  >
                    {isScriptLineCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span>{isScriptLineCopied ? "Copied Script!" : "Copy Script Line"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenAddLineModal("before", line, false)
                      onOpenActionDropdown(null)
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span>Add Line Before</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenAddLineModal("after", line, false)
                      onOpenActionDropdown(null)
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span>Add Line After</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenAddLineModal("after", line, true)
                      onOpenActionDropdown(null)
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold text-fuchsia-700 dark:text-fuchsia-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/40 rounded-md transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-fuchsia-500 flex-shrink-0" />
                    <span>Add Onomatopoeia</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenEditTimingModal(line, prevLine)
                      onOpenActionDropdown(null)
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span>Edit Timing</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onDeleteLine(line.id)
                      onOpenActionDropdown(null)
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Delete Line</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </td>
      </tr>
    </React.Fragment>
  )
})
