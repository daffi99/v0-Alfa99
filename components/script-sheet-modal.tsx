"use client"

import React, { useState, useMemo, useRef, useEffect } from "react"
import {
  FileText,
  Users,
  BarChart3,
  FileSpreadsheet,
  Copy,
  Check,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  Sparkles,
  Zap,
  CheckCircle2,
  CheckSquare,
  Clock,
  X,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  RotateCcw,
  MoreVertical,
  Volume2,
  Link,
  Unlink,
  Pencil,
} from "lucide-react"
import { normalizeMultilinesInQuotes, getDistinctEpisodeRanges, type ScriptData, type ScriptLine, type MasterArtistMapping, type ScriptLineStatus } from "./script-wizard-modal"

interface ScriptSheetModalProps {
  isOpen: boolean
  onClose: () => void
  taskTitle: string
  taskCategory?: "Caption" | "No caption" | null
  taskProgress?: any
  onUpdateProgress?: (newProgress: any) => void
  scriptData: ScriptData
  onSave: (updatedData: ScriptData) => void
  onReRunWizard: () => void
  taskId?: string
  episodeRanges?: string[] | string
  episodes?: any[]
}

export const SCRIPT_LINE_STATUSES: ScriptLineStatus[] = [
  "Beluman",
  "Inputted",
  "Missing",
  "Broken",
  "VO Error",
  "Need Pauses",
  "Wrong Cast",
  "Too Short",
  "Too Long",
  "Onomatopoeia",
]

export const STATUS_STYLE_MAP: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  Beluman: { label: "Beluman", bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
  Inputted: { label: "Inputted", bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-200" },
  "No Revision": { label: "No Revision", bg: "bg-emerald-100 dark:bg-emerald-950/60", text: "text-emerald-800 dark:text-emerald-300", border: "border-emerald-300 dark:border-emerald-800" },
  Missing: { label: "Missing", bg: "bg-red-700", text: "text-white", border: "border-red-800" },
  Broken: { label: "Broken", bg: "bg-purple-700", text: "text-white", border: "border-purple-800" },
  "VO Error": { label: "VO Error", bg: "bg-amber-200", text: "text-amber-900", border: "border-amber-300" },
  "Need Pauses": { label: "Need Pauses", bg: "bg-sky-200", text: "text-sky-900", border: "border-sky-300" },
  "Wrong Cast": { label: "Wrong Cast", bg: "bg-amber-900", text: "text-amber-100", border: "border-amber-950" },
  "Too Short": { label: "Too Short", bg: "bg-teal-800", text: "text-white", border: "border-teal-900" },
  "Too Long": { label: "Too Long", bg: "bg-indigo-900", text: "text-white", border: "border-indigo-950" },
  Onomatopoeia: { label: "Onomatopoeia", bg: "bg-fuchsia-100 dark:bg-fuchsia-950/60", text: "text-fuchsia-800 dark:text-fuchsia-300", border: "border-fuchsia-300 dark:border-fuchsia-800" },
  "Missing Onomatopoeia": { label: "Onomatopoeia", bg: "bg-fuchsia-100 dark:bg-fuchsia-950/60", text: "text-fuchsia-800 dark:text-fuchsia-300", border: "border-fuchsia-300 dark:border-fuchsia-800" },
}

export function formatCompactTimeToken(timeStr: string): string {
  if (!timeStr || timeStr === "-") return "-"
  return timeStr
    .split(",")
    .map((t) => {
      const trimmed = t.trim()
      if (trimmed.startsWith("00:")) {
        return trimmed.slice(3)
      }
      return trimmed
    })
    .join(", ")
}

export function formatMmSs(timeStr?: string): string {
  if (!timeStr || timeStr === "-" || !timeStr.trim()) return "-"
  const clean = timeStr.trim().split(".")[0]
  const parts = clean.split(":").map((p) => parseInt(p, 10))
  if (parts.some((p) => isNaN(p))) return timeStr.trim()
  const pad = (n: number) => n.toString().padStart(2, "0")

  if (parts.length === 3) {
    const [h, m, s] = parts
    if (h > 0) {
      return `${pad(h)}:${pad(m)}:${pad(s)}`
    }
    return `${pad(m)}:${pad(s)}`
  }
  if (parts.length === 2) {
    const [m, s] = parts
    return `${pad(m)}:${pad(s)}`
  }
  return timeStr.trim()
}

export function formatToFullTimecode(timeStr?: string): string {
  if (!timeStr || timeStr === "-" || !timeStr.trim()) return ""
  const raw = timeStr.trim()
  const hasMsOrFrame = /[.,]/.test(raw)

  let clean = raw.replace(/[,.](\d+)/g, (_, ms) => {
    const frame = ms.length >= 2 ? ms.slice(0, 2) : ms.padStart(2, "0")
    return `:${frame}`
  })

  const parts = clean.split(":").map((p) => p.trim())
  const pad = (s: string) => s.padStart(2, "0").slice(-2)

  if (parts.length >= 4) {
    // HH:MM:SS:FF (e.g. "00:20:36:05")
    return `${pad(parts[0])}:${pad(parts[1])}:${pad(parts[2])}:${pad(parts[3])}`
  }
  if (parts.length === 3) {
    if (hasMsOrFrame) {
      // Was MM:SS.FF (e.g. "20:36.05") -> "00:20:36:05"
      return `00:${pad(parts[0])}:${pad(parts[1])}:${pad(parts[2])}`
    }
    // Was HH:MM:SS (e.g. "00:20:36") -> "00:20:36:00"
    return `${pad(parts[0])}:${pad(parts[1])}:${pad(parts[2])}:00`
  }
  if (parts.length === 2) {
    // MM:SS (e.g. "20:36", "09:21") -> "00:20:36:00"
    return `00:${pad(parts[0])}:${pad(parts[1])}:00`
  }
  if (parts.length === 1 && !isNaN(Number(parts[0]))) {
    const sec = parseInt(parts[0], 10)
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    return `${pad(h.toString())}:${pad(m.toString())}:${pad(s.toString())}:00`
  }

  return clean
}

export function formatDisplayTiming(timeStr?: string): string {
  if (!timeStr || timeStr === "-" || !timeStr.trim()) return "-"
  let clean = timeStr.trim()
  if (clean.endsWith(":00")) {
    clean = clean.slice(0, -3)
  } else if (clean.endsWith(".00") || clean.endsWith(",00") || clean.endsWith(",000") || clean.endsWith(".000")) {
    clean = clean.split(/[.,]/)[0]
  }
  return clean
}

export function timeToSeconds(timeStr?: string): number | null {
  if (!timeStr || timeStr === "-") return null
  const clean = timeStr.trim()
  const parts = clean.split(":").map((p) => parseFloat(p))
  if (parts.some((p) => isNaN(p))) return null
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 1) return parts[0]
  return null
}

export function secondsToTimeString(sec: number, hasHours = false): string {
  if (sec < 0) sec = 0
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.floor(sec % 60)
  const pad = (n: number) => n.toString().padStart(2, "0")
  if (hasHours || h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`
  return `${pad(m)}:${pad(s)}`
}

export function computeDefaultTiming(refLine?: ScriptLine): { startTime: string; endTime: string } {
  if (!refLine) return { startTime: "", endTime: "" }
  const refTime = refLine.endTime || refLine.startTime
  const sec = timeToSeconds(refTime)
  if (sec === null) return { startTime: "", endTime: "" }
  const newStartSec = sec + 2
  const newEndSec = newStartSec + 2
  const hasHours = !!refTime && refTime.includes(":") && refTime.split(":").length === 3
  return {
    startTime: secondsToTimeString(newStartSec, hasHours),
    endTime: secondsToTimeString(newEndSec, hasHours),
  }
}

export function getBatchTimeRange(startTimeStr?: string, endTimeStr?: string, batchTimeStr?: string): string {
  if (!batchTimeStr || batchTimeStr === "-") return ""
  const compactBatch = formatCompactTimeToken(batchTimeStr)
  if (compactBatch.includes("-")) return compactBatch

  const startSec = timeToSeconds(startTimeStr)
  const endSec = timeToSeconds(endTimeStr)
  const batchStartSec = timeToSeconds(batchTimeStr)

  if (startSec !== null && endSec !== null && endSec > startSec && batchStartSec !== null) {
    const duration = endSec - startSec
    const batchEndSec = batchStartSec + duration
    const hasHours = batchTimeStr.includes(":") && batchTimeStr.split(":").length === 3
    const batchEndStr = secondsToTimeString(batchEndSec, hasHours)
    return `${compactBatch}-${formatCompactTimeToken(batchEndStr)}`
  }
  return compactBatch
}

export const STATUS_REPORT_SUFFIX_MAP: Record<ScriptLineStatus, string | null> = {
  Beluman: "_Missing audio file",
  Missing: "_Missing Sentence.",
  Broken: "_Still Contain original Audio",
  "VO Error": "_Need to retake, mispronunciation.",
  "Need Pauses": "_Need a pause, can't sync with actor lips.",
  "Wrong Cast": "_Missing Sentence, Wrong cast assigned.",
  "Too Short": "_Too short, can't sync with actor lips.",
  "Too Long": "_Too long, can't sync with actor lips.",
  Onomatopoeia: "_Missing onomatopoeia",
  "Missing Onomatopoeia": "_Missing onomatopoeia",
  Inputted: null, // Inputted lines do not create VOA report lines
}

export function formatReportTitle(title: string): string {
  // Format title: add "_" between Name and Number, e.g. "Germany 090 (120)" -> "Germany_090 (120)"
  return title.trim().replace(/([a-zA-Z]+)\s+(\d+)/g, "$1_$2")
}

export function normalizeCharKey(name: string): string {
  if (!name) return ""
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s\-_.:,;'"’“”\u00A0\u200B\uFEFF]+/g, "")
    .trim()
}

export function formatEpisodeRangeNumbers(epsList: string[]): string {
  if (!epsList || epsList.length === 0) return "000"

  const epNumbers = Array.from(
    new Set(
      epsList
        .map((e) => parseInt(e.trim(), 10))
        .filter((num) => !isNaN(num))
    )
  ).sort((a, b) => a - b)

  if (epNumbers.length === 0) return epsList.join(", ")

  const ranges: string[] = []
  let rangeStart = epNumbers[0]
  let rangeEnd = epNumbers[0]

  for (let i = 1; i < epNumbers.length; i++) {
    const current = epNumbers[i]
    if (current === rangeEnd + 1) {
      rangeEnd = current
    } else {
      if (rangeStart === rangeEnd) {
        ranges.push(rangeStart.toString().padStart(3, "0"))
      } else {
        ranges.push(`${rangeStart.toString().padStart(3, "0")}-${rangeEnd.toString().padStart(3, "0")}`)
      }
      rangeStart = current
      rangeEnd = current
    }
  }

  if (rangeStart === rangeEnd) {
    ranges.push(rangeStart.toString().padStart(3, "0"))
  } else {
    ranges.push(`${rangeStart.toString().padStart(3, "0")}-${rangeEnd.toString().padStart(3, "0")}`)
  }

  return ranges.join(", ")
}

export function formatEpisodeRanges(epsList: string[]): string {
  const rangeStr = formatEpisodeRangeNumbers(epsList)
  return rangeStr ? `EP${rangeStr}` : "EP000"
}

export function shiftTimingValue(timeStr: string, deltaSeconds: number): string {
  if (!timeStr || timeStr === "-") return timeStr
  if (timeStr.includes("-") && timeStr.split("-").length === 2 && !timeStr.startsWith("-")) {
    const [start, end] = timeStr.split("-").map((s) => s.trim())
    const startSec = timeToSeconds(start)
    const endSec = timeToSeconds(end)
    if (startSec !== null && endSec !== null) {
      const newStartSec = Math.max(0, startSec + deltaSeconds)
      const newEndSec = Math.max(0, endSec + deltaSeconds)
      const hasHours = start.includes(":") && start.split(":").length === 3
      return `${secondsToTimeString(newStartSec, hasHours)}-${secondsToTimeString(newEndSec, hasHours)}`
    }
  }
  const currentSec = timeToSeconds(timeStr)
  if (currentSec === null) return timeStr
  const newSec = Math.max(0, currentSec + deltaSeconds)
  const hasHours = timeStr.includes(":") && timeStr.split(":").length === 3
  return secondsToTimeString(newSec, hasHours)
}

export function TimeStepperInput({
  label,
  value,
  onChange,
  onStep,
  placeholder,
}: {
  label: string
  value: string
  onChange: (val: string) => void
  onStep?: (deltaSeconds: number) => void
  placeholder?: string
}) {
  const handleStep = (deltaSeconds: number) => {
    if (onStep) {
      onStep(deltaSeconds)
    } else {
      let currentSec = timeToSeconds(value)
      if (currentSec === null) currentSec = 0
      const newSec = Math.max(0, currentSec + deltaSeconds)
      const hasHours = value.includes(":") && value.split(":").length === 3
      onChange(secondsToTimeString(newSec, hasHours))
    }
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="block font-semibold text-foreground text-xs">{label}</label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleStep(-1)}
            className="px-1.5 py-0.5 text-[10px] font-bold bg-muted hover:bg-muted/80 text-foreground border border-input rounded flex items-center gap-0.5 cursor-pointer transition-colors active:scale-95"
            title="Subtract 1 second"
          >
            -1s
          </button>
          <button
            type="button"
            onClick={() => handleStep(1)}
            className="px-1.5 py-0.5 text-[10px] font-bold bg-muted hover:bg-muted/80 text-foreground border border-input rounded flex items-center gap-0.5 cursor-pointer transition-colors active:scale-95"
            title="Add 1 second"
          >
            +1s
          </button>
        </div>
      </div>
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder={placeholder || "00:00:00"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-8 pl-2.5 pr-7 text-xs font-mono rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col -space-y-0.5">
          <button
            type="button"
            onClick={() => handleStep(1)}
            className="p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded cursor-pointer transition-colors"
            title="Increase 1 second"
          >
            <ChevronUp className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => handleStep(-1)}
            className="p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded cursor-pointer transition-colors"
            title="Decrease 1 second"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

const CHARACTER_COLOR_PALETTE = [
  "bg-amber-50 text-amber-900 border-amber-200",
  "bg-rose-50 text-rose-900 border-rose-200",
  "bg-sky-50 text-sky-900 border-sky-200",
  "bg-emerald-50 text-emerald-900 border-emerald-200",
  "bg-purple-50 text-purple-900 border-purple-200",
  "bg-indigo-50 text-indigo-900 border-indigo-200",
  "bg-orange-50 text-orange-900 border-orange-200",
]

export function ScriptSheetModal({
  isOpen,
  onClose,
  taskTitle,
  taskCategory,
  taskProgress = {},
  onUpdateProgress,
  scriptData,
  onSave,
  onReRunWizard,
  taskId,
  episodeRanges,
  episodes,
}: ScriptSheetModalProps) {
  const [activeTab, setActiveTab] = useState<"lines" | "master" | "summary" | "episodes" | "report">("lines")
  const [data, setData] = useState<ScriptData>(scriptData)
  const [localProgress, setLocalProgress] = useState<Record<string, any>>(taskProgress || {})
  const [isProgressExpanded, setIsProgressExpanded] = useState(true)
  const [isCheckVoMode, setIsCheckVoMode] = useState(false)

  const isSingleEpisodeCard = useMemo(() => {
    // 1. Check explicit episodeRanges
    if (episodeRanges) {
      const ranges = Array.isArray(episodeRanges) ? episodeRanges : [episodeRanges]
      if (ranges.length === 1) {
        const r = ranges[0].trim()
        if (r.includes("-")) {
          const [start, end] = r.split("-").map((s) => s.trim())
          if (start && end && Number(start) === Number(end)) return true
        } else if (r) {
          return true
        }
      }
    }
    // 2. Check episodes array
    if (episodes && episodes.length === 1) return true

    // 3. Check distinct episodes in lines
    if (data.lines && data.lines.length > 0) {
      const distinctEps = new Set(data.lines.map((l) => (l.eps || "").trim()).filter(Boolean))
      if (distinctEps.size === 1) return true
    }

    return false
  }, [episodeRanges, episodes, data.lines])

  React.useEffect(() => {
    setLocalProgress(taskProgress || {})
  }, [taskProgress])

  const toggleSubStep = (key: string) => {
    const updated = { ...localProgress, [key]: !localProgress[key] }
    setLocalProgress(updated)
    if (onUpdateProgress) {
      onUpdateProgress(updated)
    }
  }

  // Counts for Caption sub-steps
  const prepSubSteps = ["vocalSplit", "voEnhance", "subtitleJoin"]
  const checkVoSubSteps = ["checkVO"]
  const editingSubSteps = ["pitchShift", "volumeAdjustment", "subseq", "mixingVO"]
  const captionEditSubSteps = ["inputReplacementText", "inputSyncSRT", "reCheckSRT"]

  const prepCompletedCount = prepSubSteps.filter((k) => !!localProgress[k]).length
  const checkVoCompletedCount = checkVoSubSteps.filter((k) => !!localProgress[k]).length
  const editingCompletedCount = editingSubSteps.filter((k) => !!localProgress[k]).length
  const captionEditCompletedCount = captionEditSubSteps.filter((k) => !!localProgress[k]).length

  // Condition: VO Error Note column and paste modal are active for Caption type cards
  const isCaptionTask =
    taskCategory === "Caption" ||
    (!taskCategory && (taskTitle ? taskTitle.toLowerCase().includes("caption") : true)) ||
    taskCategory === undefined

  const captionSubStepsCompletedCount =
    prepCompletedCount + checkVoCompletedCount + editingCompletedCount + (isCaptionTask ? captionEditCompletedCount : 0)
  const totalSubStepsCount = isCaptionTask ? 11 : 8

  // Tab 1 Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCharacterFilter, setSelectedCharacterFilter] = useState("all")
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all")

  // Copy indicator state
  const [copiedReport, setCopiedReport] = useState(false)
  const [copiedRowIndex, setCopiedRowIndex] = useState<number | null>(null)
  const [copiedCharName, setCopiedCharName] = useState<string | null>(null)
  const [copiedScriptLineId, setCopiedScriptLineId] = useState<string | null>(null)

  // Highlighted line ID when navigating from VOA report
  const [highlightedLineId, setHighlightedLineId] = useState<string | null>(null)

  // Navigate to Script lines tab & auto-scroll to specified line
  const handleNavigateToScriptLine = (lineId?: string) => {
    if (!lineId) return
    setSearchQuery("")
    setSelectedCharacterFilter("all")
    setSelectedStatusFilter("all")
    setActiveTab("lines")
    setHighlightedLineId(lineId)
    setTimeout(() => {
      const el = document.getElementById(`script-line-${lineId}`)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 120)
    setTimeout(() => {
      setHighlightedLineId((prev) => (prev === lineId ? null : prev))
    }, 3500)
  }

  // Copy single VOA Report line
  const handleCopySingleReportLine = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedRowIndex(idx)
    setTimeout(() => setCopiedRowIndex(null), 2000)
  }

  // Copy character name helper
  const handleCopyCharName = (charName: string) => {
    navigator.clipboard.writeText(charName)
    setCopiedCharName(charName)
    setTimeout(() => setCopiedCharName(null), 2000)
  }

  // Copy script line text helper
  const handleCopyScriptLineText = (lineId: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedScriptLineId(lineId)
    setTimeout(() => setCopiedScriptLineId(null), 2000)
  }

  // Copy start time to clipboard formatted as full timecode (HH:MM:SS:FF e.g. 00:20:36:05)
  const [copiedTimingLineId, setCopiedTimingLineId] = useState<string | null>(null)
  const handleCopyStartTime = (lineId: string, rawStartTime?: string) => {
    if (!rawStartTime || rawStartTime === "-" || !rawStartTime.trim()) return
    const tc = formatToFullTimecode(rawStartTime)
    if (tc && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(tc)
      setCopiedTimingLineId(lineId)
      setTimeout(() => setCopiedTimingLineId(null), 1500)
    }
  }

  // Column Widths for Script Lines Table
  const [colWidths, setColWidths] = useState<{
    character: number
    scriptText: number
    voErrorNote: number
  }>({
    character: 110,
    scriptText: 320,
    voErrorNote: 130,
  })

  // Resize handler for table columns
  const handleMouseDownResize = (
    colKey: "character" | "scriptText" | "voErrorNote",
    e: React.MouseEvent
  ) => {
    e.preventDefault()
    e.stopPropagation()

    const startX = e.clientX
    const startWidth = colWidths[colKey]

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const minWidth = colKey === "character" ? 70 : colKey === "scriptText" ? 120 : 70
      const newWidth = Math.max(minWidth, startWidth + deltaX)
      setColWidths((prev) => ({
        ...prev,
        [colKey]: newWidth,
      }))
    }

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
  }

  // Single-Column PS Paste Modal State
  const [isPsModalOpen, setIsPsModalOpen] = useState(false)
  const [psPasteText, setPsPasteText] = useState("")

  // Single-Column VO Error Paste Modal State
  const [isVoErrorModalOpen, setIsVoErrorModalOpen] = useState(false)
  const [voErrorPasteText, setVoErrorPasteText] = useState("")

  // Unused Characters Collapsible Panel State
  const [isUnusedExpanded, setIsUnusedExpanded] = useState(false)

  // Reset All VOA Report Confirmation Modal State
  const [isResetVoaModalOpen, setIsResetVoaModalOpen] = useState(false)

  // Status Action Custom Dropdown Menu State
  const [openActionDropdown, setOpenActionDropdown] = useState<string | null>(null)

  // Line Status Custom Dropdown Menu State
  const [openLineStatusDropdown, setOpenLineStatusDropdown] = useState<string | null>(null)

  // 3-Dots Row Action Custom Dropdown Menu State
  const [openRowActionDropdown, setOpenRowActionDropdown] = useState<string | null>(null)

  // 3-Dots Master Artist Custom Dropdown Menu State
  const [openMasterActionDropdown, setOpenMasterActionDropdown] = useState<number | null>(null)

  // Edit VO Artist Modal State
  const [editArtistModal, setEditArtistModal] = useState<{
    isOpen: boolean
    characterName: string
    currentArtist: string
    newArtist: string
  }>({
    isOpen: false,
    characterName: "",
    currentArtist: "",
    newArtist: "",
  })

  // Scroll Container Ref & Persistent Scroll Position Memory State (Tab 1: Script Lines)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const lastScrollTopRef = useRef<number>(0)
  const scrollStorageKey = useMemo(() => `script_scroll_${taskTitle.replace(/\s+/g, "_")}`, [taskTitle])

  // Save scroll position for Tab 1 to sessionStorage
  const handleTableScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop
    lastScrollTopRef.current = top
    try {
      sessionStorage.setItem(scrollStorageKey, top.toString())
    } catch (err) {}
  }

  // Summary Tab Scroll Container Ref & Persistent Scroll Position Memory State (Tab 3: Character Summary)
  const summaryScrollContainerRef = useRef<HTMLDivElement | null>(null)
  const lastSummaryScrollTopRef = useRef<number>(0)
  const summaryScrollStorageKey = useMemo(
    () => `script_summary_scroll_${taskTitle.replace(/\s+/g, "_")}`,
    [taskTitle]
  )

  // Save scroll position for Tab 3 to sessionStorage
  const handleSummaryTableScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop
    lastSummaryScrollTopRef.current = top
    try {
      sessionStorage.setItem(summaryScrollStorageKey, top.toString())
    } catch (err) {}
  }

  // Edit Timing Modal State
  const [editTimingModal, setEditTimingModal] = useState<{
    isOpen: boolean
    lineId: string
    startTime: string
    endTime: string
    batchTime: string
  }>({
    isOpen: false,
    lineId: "",
    startTime: "",
    endTime: "",
    batchTime: "",
  })
  const [isEditBatchOverride, setIsEditBatchOverride] = useState(false)

  // Add Line Modal State (Before or After)
  const [addLineModal, setAddLineModal] = useState<{
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
  }>({
    isOpen: false,
    position: "after",
    refLineId: "",
    afterEps: "",
    character: "",
    lineText: "",
    status: "Inputted",
    startTime: "",
    endTime: "",
    batchTime: "",
  })
  const [isAddLineBatchOverride, setIsAddLineBatchOverride] = useState(false)

  // Tab 3 Character Summary Search & VOA Filter State
  const [summarySearchQuery, setSummarySearchQuery] = useState("")
  const [summaryVoaFilter, setSummaryVoaFilter] = useState("ALL")
  const [summaryStatusFilter, setSummaryStatusFilter] = useState("ALL")

  // Restore scroll positions upon render / modal open / tab switch / data update
  useEffect(() => {
    if (!isOpen) return

    if (activeTab === "lines") {
      let targetTop = lastScrollTopRef.current
      try {
        const saved = sessionStorage.getItem(scrollStorageKey)
        if (saved) {
          targetTop = parseInt(saved, 10)
        }
      } catch (err) {}

      const applyScroll = () => {
        if (scrollContainerRef.current && targetTop > 0) {
          scrollContainerRef.current.scrollTop = targetTop
          lastScrollTopRef.current = targetTop
        }
      }
      applyScroll()
      const t = setTimeout(applyScroll, 50)
      return () => clearTimeout(t)
    } else if (activeTab === "summary") {
      let targetTop = lastSummaryScrollTopRef.current
      try {
        const saved = sessionStorage.getItem(summaryScrollStorageKey)
        if (saved) {
          targetTop = parseInt(saved, 10)
        }
      } catch (err) {}

      const applyScroll = () => {
        if (summaryScrollContainerRef.current && targetTop > 0) {
          summaryScrollContainerRef.current.scrollTop = targetTop
          lastSummaryScrollTopRef.current = targetTop
        }
      }
      applyScroll()
      const t = setTimeout(applyScroll, 50)
      return () => clearTimeout(t)
    }
  }, [isOpen, activeTab, data.lines, scrollStorageKey, summaryScrollStorageKey])

  // Multi-Range Episode Offset State
  const distinctRanges = useMemo(() => {
    return getDistinctEpisodeRanges(data.lines.map((l) => l.eps))
  }, [data.lines])

  const [range1Duration, setRange1Duration] = useState<string>(() => {
    return data.rangeDurations?.["0"] || ""
  })

  useEffect(() => {
    if (data.rangeDurations?.["0"] !== undefined) {
      setRange1Duration(data.rangeDurations["0"])
    }
  }, [data.rangeDurations])

  const handleUpdateRange1Duration = (val: string) => {
    setRange1Duration(val)
    const newRangeDurations = {
      ...(data.rangeDurations || {}),
      "0": val.trim(),
    }
    const updatedData = {
      ...data,
      rangeDurations: newRangeDurations,
    }
    setData(updatedData)
    onSave(updatedData)
  }

  // Base batch time offset per range for continuous timeline mapping
  const rangeBaseOffsets = useMemo(() => {
    const baseMap: Record<number, number> = {}
    distinctRanges.forEach((range, rIdx) => {
      if (rIdx === 0) return
      const linesInRange = data.lines.filter((l) => {
        const ep = parseInt(l.eps.replace(/\D/g, ""), 10)
        return ep >= range.start && ep <= range.end
      })
      const firstLineWithTiming = linesInRange.find(
        (l) => l.batchTime && l.batchTime !== "-" && timeToSeconds(l.batchTime) !== null
      )
      if (firstLineWithTiming && firstLineWithTiming.batchTime) {
        const bSec = timeToSeconds(firstLineWithTiming.batchTime) || 0
        const sSec = (firstLineWithTiming.startTime && timeToSeconds(firstLineWithTiming.startTime)) || 0
        baseMap[rIdx] = Math.max(0, bSec - sSec)
      }
    })
    return baseMap
  }, [distinctRanges, data.lines])

  // Interactive UI checkboxes for Character Summary rows
  const [uiCheckedRows, setUiCheckedRows] = useState<Record<string, boolean>>({})

  const toggleUiRowCheck = (key: string) => {
    setUiCheckedRows((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Custom Character Select Popover State in Add Line Modal
  const [isAddLineCharSelectOpen, setIsAddLineCharSelectOpen] = useState(false)
  const [addLineCharSearchQuery, setAddLineCharSearchQuery] = useState("")

  const filteredAddLineCharacters = useMemo(() => {
    const allChars = Array.from(
      new Set(
        [
          ...data.masterArtists.map((ma) => ma.characterName),
          ...data.lines.map((l) => l.character).filter(Boolean),
        ].sort()
      )
    )
    if (!addLineCharSearchQuery.trim()) return allChars
    const q = addLineCharSearchQuery.toLowerCase()
    return allChars.filter((c) => c.toLowerCase().includes(q))
  }, [data.masterArtists, data.lines, addLineCharSearchQuery])

  // Save New Line
  const handleSaveAddLine = () => {
    if (!addLineModal.character || !addLineModal.lineText.trim()) return

    const newLine: ScriptLine = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      eps: addLineModal.afterEps,
      character: addLineModal.character.trim(),
      lineText: addLineModal.lineText.trim(),
      status: addLineModal.status || "Inputted",
      startTime: addLineModal.startTime?.trim() || undefined,
      endTime: addLineModal.endTime?.trim() || undefined,
      batchTime: addLineModal.batchTime?.trim() || undefined,
    }

    const targetIndex = data.lines.findIndex((l) => l.id === addLineModal.refLineId)
    const updatedLines = [...data.lines]
    if (targetIndex !== -1) {
      const insertIndex = addLineModal.position === "before" ? targetIndex : targetIndex + 1
      updatedLines.splice(insertIndex, 0, newLine)
    } else {
      updatedLines.push(newLine)
    }

    updateData({ ...data, lines: updatedLines })
    setAddLineModal({
      isOpen: false,
      position: "after",
      refLineId: "",
      afterEps: "",
      character: "",
      lineText: "",
      status: "Inputted",
      startTime: "",
      endTime: "",
      batchTime: "",
    })
  }

  // Save Edited Timing
  const handleSaveEditTiming = () => {
    if (!editTimingModal.lineId) return

    const updatedLines = data.lines.map((line) => {
      if (line.id === editTimingModal.lineId) {
        return {
          ...line,
          startTime: editTimingModal.startTime.trim() || undefined,
          endTime: editTimingModal.endTime.trim() || undefined,
          batchTime: editTimingModal.batchTime.trim() || undefined,
        }
      }
      return line
    })

    updateData({ ...data, lines: updatedLines })
    setEditTimingModal({ isOpen: false, lineId: "", startTime: "", endTime: "", batchTime: "" })
  }

  // Filter Custom Dropdown Menu States
  const [isCharFilterOpen, setIsCharFilterOpen] = useState(false)
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false)

  const handleConfirmResetVoaReport = () => {
    // Convert all lines to Inputted
    const updatedLines = data.lines.map((line) => {
      return {
        ...line,
        status: "Inputted" as ScriptLineStatus,
        previousStatus: undefined,
      }
    })

    // Clear all voReportChecks for a fresh, completely clean state
    const currentChecks: Record<string, any> = localProgress && typeof localProgress === "object" ? { ...localProgress } : {}
    const updatedProgress = { ...currentChecks, voReportChecks: {} }
    setLocalProgress(updatedProgress)

    if (onUpdateProgress) {
      onUpdateProgress(updatedProgress)
    }

    updateData({ ...data, lines: updatedLines })
    setIsResetVoaModalOpen(false)
  }

  // Wrong Cast Character Selection Popup State
  const [wrongCastModal, setWrongCastModal] = useState<{
    isOpen: boolean
    currentCharacter: string
    targetLineId?: string
    targetCharName?: string
    targetFiltered?: boolean
  }>({
    isOpen: false,
    currentCharacter: "",
  })

  if (!isOpen) return null

  // Generate dynamic HSL character color mapping with Golden Angle (137.5°) for maximum contrast between main characters
  const characterColors = useMemo(() => {
    const map: Record<string, React.CSSProperties> = {}

    // Calculate line counts per character to rank main characters first
    const charLineCounts = new Map<string, number>()
    data.lines.forEach((l) => {
      if (!l.character) return
      const key = l.character.trim().toLowerCase()
      charLineCounts.set(key, (charLineCounts.get(key) || 0) + 1)
    })

    // Sort unique characters by line count descending (main characters first)
    const allChars = Array.from(
      new Set(
        [
          ...data.masterArtists.map((ma) => ma.characterName.trim()),
          ...data.lines.map((l) => (l.character || "").trim()).filter(Boolean),
        ]
      )
    ).sort((a, b) => {
      const countA = charLineCounts.get(a.toLowerCase()) || 0
      const countB = charLineCounts.get(b.toLowerCase()) || 0
      return countB - countA
    })

    const GOLDEN_ANGLE = 137.508 // Golden ratio hue step for maximum visual contrast

    allChars.forEach((charName, idx) => {
      const hue = Math.round((idx * GOLDEN_ANGLE) % 360)
      map[charName] = {
        backgroundColor: `hsla(${hue}, 80%, 45%, 0.20)`,
      }
    })
    return map
  }, [data.lines, data.masterArtists])

  // Update Data Handler
  const updateData = (newData: ScriptData) => {
    setData(newData)
    onSave(newData)

    if (onUpdateProgress && newData.lines) {
      const currentChecks: Record<string, any> = localProgress && typeof localProgress === "object" ? { ...localProgress } : {}
      const voChecks: Record<string, boolean> = { ...(currentChecks.voReportChecks || {}) }

      const groupTotalMap = new Map<string, number>()
      const groupInputtedMap = new Map<string, number>()

      newData.lines.forEach((line) => {
        if (!line.character) return
        const lineChar = (line.character || "").trim()
        const correctChar = (line.correctCharacter || "").trim()
        const targetChar =
          line.status === "Wrong Cast" && correctChar !== ""
            ? correctChar
            : lineChar

        if (!targetChar) return
        const origStatus = line.previousStatus || line.status
        if (!origStatus || origStatus === "Inputted") return

        const eps = (line.eps || "").trim()
        const normKey = normalizeCharKey(targetChar)
        const groupKey =
          origStatus === "Beluman"
            ? `${normKey}__${origStatus}`
            : `${normKey}__${origStatus}__${eps}`

        groupTotalMap.set(groupKey, (groupTotalMap.get(groupKey) || 0) + 1)
        if (line.status === "Inputted") {
          groupInputtedMap.set(groupKey, (groupInputtedMap.get(groupKey) || 0) + 1)
        }
      })

      groupTotalMap.forEach((total, groupKey) => {
        const inputted = groupInputtedMap.get(groupKey) || 0
        if (inputted === total && total > 0) {
          voChecks[groupKey] = true
        } else if (inputted < total) {
          voChecks[groupKey] = false
        }
      })

      const updatedProgress = { ...currentChecks, voReportChecks: voChecks }
      setLocalProgress(updatedProgress)
      onUpdateProgress(updatedProgress)
    }
  }

  // Dynamically compute characters matching the selected Status Filter for Tab 1 Character Filter dropdown (Sorted A-Z)
  const availableCharacterFilterOptions = useMemo(() => {
    const linesToUse =
      selectedStatusFilter === "all"
        ? data.lines
        : data.lines.filter((line) => {
            const lineIssueStatus = line.previousStatus || line.status
            return line.status === selectedStatusFilter || lineIssueStatus === selectedStatusFilter
          })

    return Array.from(new Set(linesToUse.map((l) => l.character)))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
  }, [data.lines, selectedStatusFilter])

  // Reset selected character filter if selected character is not present in the status-filtered characters
  useEffect(() => {
    if (
      selectedCharacterFilter !== "all" &&
      !availableCharacterFilterOptions.includes(selectedCharacterFilter)
    ) {
      setSelectedCharacterFilter("all")
    }
  }, [availableCharacterFilterOptions, selectedCharacterFilter])

  // Filtered script lines for Tab 1
  const filteredLines = useMemo(() => {
    return data.lines.filter((line) => {
      const matchesSearch =
        line.lineText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        line.character.toLowerCase().includes(searchQuery.toLowerCase()) ||
        line.eps.includes(searchQuery)
      const matchesChar =
        selectedCharacterFilter === "all" ||
        line.character === selectedCharacterFilter
      const lineIssueStatus = line.previousStatus || line.status
      const matchesStatus =
        selectedStatusFilter === "all" ||
        line.status === selectedStatusFilter ||
        lineIssueStatus === selectedStatusFilter
      return matchesSearch && matchesChar && matchesStatus
    })
  }, [data.lines, searchQuery, selectedCharacterFilter, selectedStatusFilter])

  // Character Summary Calculation (Tab 3)
  const characterSummaries = useMemo(() => {
    const summaryMap = new Map<
      string,
      {
        character: string
        actor: string
        ps: string
        linesCount: number
        inputtedLinesCount: number
        belumanLinesCount: number
        brokenLinesCount: number
        episodesSet: Set<string>
        firstTiming?: string
        firstLineId?: string
      }
    >()

    // Initialize map with all master artists
    data.masterArtists.forEach((ma) => {
      const key = normalizeCharKey(ma.characterName)
      if (key) {
        summaryMap.set(key, {
          character: ma.characterName,
          actor: ma.finalArtist,
          ps: ma.pitchSpeed || "-",
          linesCount: 0,
          inputtedLinesCount: 0,
          belumanLinesCount: 0,
          brokenLinesCount: 0,
          episodesSet: new Set<string>(),
          firstTiming: undefined,
          firstLineId: undefined,
        })
      }
    })

    // Count line occurrences for all statuses
    data.lines.forEach((line) => {
      if (!line.character) return
      const status = line.status || "Beluman"

      const lineChar = line.character.trim()
      const charKey = normalizeCharKey(lineChar)
      if (!charKey) return

      if (!summaryMap.has(charKey)) {
        summaryMap.set(charKey, {
          character: lineChar,
          actor: "Unassigned",
          ps: "-",
          linesCount: 0,
          inputtedLinesCount: 0,
          belumanLinesCount: 0,
          brokenLinesCount: 0,
          episodesSet: new Set<string>(),
          firstTiming: undefined,
          firstLineId: undefined,
        })
      }
      const entry = summaryMap.get(charKey)!
      entry.character = lineChar
      entry.linesCount += 1
      if (status === "Inputted") {
        entry.inputtedLinesCount += 1
      } else if (status === "Beluman") {
        entry.belumanLinesCount += 1
      } else {
        entry.brokenLinesCount += 1
      }
      if (line.eps) {
        entry.episodesSet.add(line.eps.trim())
      }

      if (line.startTime && line.startTime.trim() && line.startTime.trim() !== "-") {
        const lineTimeSec = timeToSeconds(line.startTime.trim())
        if (lineTimeSec !== null) {
          const currentFirstSec = entry.firstTiming ? timeToSeconds(entry.firstTiming) : null
          if (currentFirstSec === null || lineTimeSec < currentFirstSec) {
            entry.firstTiming = line.startTime.trim()
            entry.firstLineId = line.id
          }
        } else if (!entry.firstTiming) {
          entry.firstTiming = line.startTime.trim()
          entry.firstLineId = line.id
        }
      }
    })

    const result = Array.from(summaryMap.values()).map((entry) => {
      const sortedEps = Array.from(entry.episodesSet)
        .sort((a, b) => Number(a) - Number(b))
        .map((e) => e.padStart(3, "0"))

      const checkedMap = data.checkedCharacters || {}
      const isChecked = checkedMap[entry.character] ?? (entry.ps !== "-" && Boolean(entry.ps))

      return {
        character: entry.character,
        actor: entry.actor,
        ps: entry.ps,
        linesCount: entry.linesCount,
        inputtedLinesCount: entry.inputtedLinesCount,
        belumanLinesCount: entry.belumanLinesCount,
        brokenLinesCount: entry.brokenLinesCount,
        episodesList: sortedEps.join(", "),
        firstTiming: entry.firstTiming ? formatMmSs(entry.firstTiming) : "-",
        firstTimingRaw: entry.firstTiming,
        firstLineId: entry.firstLineId,
        isChecked,
      }
    })

    return result
  }, [data.masterArtists, data.lines, data.checkedCharacters])

  // Active characters (with >0 lines) sorted from highest line count to lowest
  const activeCharacterSummaries = useMemo(() => {
    return characterSummaries
      .filter((cs) => cs.linesCount > 0)
      .sort((a, b) => b.linesCount - a.linesCount)
  }, [characterSummaries])

  // Unique VOA Voice Actor Names list for Tab 3 filter dropdown
  const uniqueVoaArtists = useMemo(() => {
    const artists = new Set<string>()
    activeCharacterSummaries.forEach((cs) => {
      if (cs.actor && cs.actor !== "Unassigned") {
        artists.add(cs.actor)
      }
    })
    return Array.from(artists).sort((a, b) => a.localeCompare(b))
  }, [activeCharacterSummaries])

  // Filtered Character Summaries for Tab 3 (search query + VOA dropdown filter + Status filter)
  const filteredCharacterSummaries = useMemo(() => {
    return activeCharacterSummaries.filter((cs) => {
      const query = summarySearchQuery.trim().toLowerCase()
      const matchesQuery =
        !query ||
        cs.character.toLowerCase().includes(query) ||
        cs.actor.toLowerCase().includes(query) ||
        cs.ps.toLowerCase().includes(query)

      const matchesVoa =
        summaryVoaFilter === "ALL" ||
        (summaryVoaFilter === "UNASSIGNED"
          ? cs.actor === "Unassigned"
          : cs.actor.toLowerCase() === summaryVoaFilter.toLowerCase())

      let matchesStatus = true
      if (summaryStatusFilter === "BELUMAN") {
        matchesStatus = cs.belumanLinesCount > 0
      } else if (summaryStatusFilter === "INPUTTED") {
        matchesStatus = cs.inputtedLinesCount > 0
      } else if (summaryStatusFilter === "BROKEN") {
        matchesStatus = cs.brokenLinesCount > 0
      }

      return matchesQuery && matchesVoa && matchesStatus
    })
  }, [activeCharacterSummaries, summarySearchQuery, summaryVoaFilter, summaryStatusFilter])

  // Unused characters (with 0 lines)
  const unusedCharacterSummaries = useMemo(() => {
    return characterSummaries.filter((cs) => cs.linesCount === 0)
  }, [characterSummaries])

  // Episode Character Summary Calculation (Tab 4)
  const episodeCharacterSummaries = useMemo(() => {
    // Map overall line count per character across all episodes
    const overallCharLineMap = new Map<string, number>()
    data.lines.forEach((line) => {
      if (!line.character) return
      const charKey = line.character.trim()
      overallCharLineMap.set(charKey, (overallCharLineMap.get(charKey) || 0) + 1)
    })

    const epMap = new Map<string, Map<string, number>>()

    data.lines.forEach((line) => {
      if (!line.eps || !line.character) return
      const epsKey = line.eps.trim()
      const charKey = line.character.trim()

      if (!epMap.has(epsKey)) {
        epMap.set(epsKey, new Map<string, number>())
      }
      const charCounts = epMap.get(epsKey)!
      charCounts.set(charKey, (charCounts.get(charKey) || 0) + 1)
    })

    const episodes = Array.from(epMap.entries()).map(([eps, charMap]) => {
      const charactersInEp = Array.from(charMap.entries())
        .map(([character, count]) => ({
          character,
          count,
          overallCount: overallCharLineMap.get(character) || 0,
        }))
        // Sort by OVERALL total line count descending, fallback to episode count, then character name
        .sort((a, b) => b.overallCount - a.overallCount || b.count - a.count || a.character.localeCompare(b.character))

      const formattedEps = eps.padStart(3, "0")
      const characterNamesList = charactersInEp.map((c) => c.character).join(", ")

      return {
        eps,
        formattedEps,
        charactersCount: charactersInEp.length,
        characterNamesList,
        charactersInEp,
      }
    })

    return episodes.sort((a, b) => Number(a.eps) - Number(b.eps))
  }, [data.lines])

  // Total sum of all episode character counts across all episode rows
  const totalEpisodeCharCountSum = useMemo(() => {
    return episodeCharacterSummaries.reduce((sum, ep) => sum + ep.charactersCount, 0)
  }, [episodeCharacterSummaries])

  // VOA Missing / Issue Audio Report Lines Calculation (Tab 5)
  const missingReports = useMemo(() => {
    const masterMap = new Map<string, string>()
    data.masterArtists.forEach((ma) => {
      const key = normalizeCharKey(ma.characterName)
      if (key) {
        masterMap.set(key, ma.finalArtist)
      }
    })

    const formattedTitle = formatReportTitle(taskTitle)

    const checkedVoReportKeys =
      ((localProgress && typeof localProgress === "object" ? localProgress.voReportChecks : {}) as Record<
        string,
        boolean
      >) || {}

    // Group lines by target character & status (or track checked keys)
    const charStatusMap = new Map<
      string,
      {
        character: string
        status: ScriptLineStatus
        epsSet: Set<string>
        startTimeSet: Set<string>
        endTimeSet: Set<string>
        batchTimeSet: Set<string>
        isResolved: boolean
        firstLineId?: string
      }
    >()

    data.lines.forEach((line) => {
      if (!line.character) return

      const lineChar = (line.character || "").trim()
      const correctChar = (line.correctCharacter || "").trim()
      const targetChar =
        line.status === "Wrong Cast" && correctChar !== ""
          ? correctChar
          : lineChar

      if (!targetChar) return

      const lineIssueStatus = line.previousStatus || line.status
      if (!lineIssueStatus || lineIssueStatus === "Inputted") return

      const eps = (line.eps || "").trim()
      const normKey = normalizeCharKey(targetChar)
      const groupKey =
        lineIssueStatus === "Beluman"
          ? `${normKey}__${lineIssueStatus}`
          : `${normKey}__${lineIssueStatus}__${eps}`

      if (!charStatusMap.has(groupKey)) {
        charStatusMap.set(groupKey, {
          character: targetChar,
          status: lineIssueStatus as ScriptLineStatus,
          epsSet: new Set<string>(),
          startTimeSet: new Set<string>(),
          endTimeSet: new Set<string>(),
          batchTimeSet: new Set<string>(),
          totalLines: 0,
          inputtedLines: 0,
          firstLineId: line.id,
        })
      }

      const entry = charStatusMap.get(groupKey)!
      entry.character = targetChar
      entry.totalLines += 1
      if (line.status === "Inputted") {
        entry.inputtedLines += 1
      }
      if (eps) {
        entry.epsSet.add(eps)
      }
      if (line.startTime && line.startTime.trim() && line.startTime.trim() !== "-") {
        entry.startTimeSet.add(line.startTime.trim())
      }
      if (line.endTime && line.endTime.trim() && line.endTime.trim() !== "-") {
        entry.endTimeSet.add(line.endTime.trim())
      }
      if (line.batchTime && line.batchTime.trim() && line.batchTime.trim() !== "-") {
        entry.batchTimeSet.add(line.batchTime.trim())
      }
    })

    const reports: Array<{
      groupKey: string
      status: ScriptLineStatus
      epsJoined: string
      epsFormattedRange: string
      character: string
      actor: string
      reportString: string
      epSummary: string
      startTimeFormatted: string
      batchTimeFormatted: string
      minEps: number
      isResolved: boolean
      firstLineId?: string
    }> = []

    charStatusMap.forEach(({ character, status, epsSet, startTimeSet, endTimeSet, batchTimeSet, totalLines, inputtedLines, firstLineId }, groupKey) => {
      const isResolved = !!checkedVoReportKeys[groupKey] || (totalLines > 0 && inputtedLines === totalLines)
      const actor = masterMap.get(normalizeCharKey(character)) || "Unassigned"
      let suffix = STATUS_REPORT_SUFFIX_MAP[status] || ""

      if (status === "Onomatopoeia" || status === "Missing Onomatopoeia") {
        const startArr = Array.from(startTimeSet)
        const endArr = Array.from(endTimeSet)
        const batchArr = Array.from(batchTimeSet)

        let startEndRange = ""
        if (startArr.length > 0 && endArr.length > 0) {
          startEndRange = `${formatCompactTimeToken(startArr[0])}-${formatCompactTimeToken(endArr[0])}`
        } else if (startArr.length > 0) {
          startEndRange = formatCompactTimeToken(startArr[0])
        }

        let batchRange = ""
        if (batchArr.length > 0) {
          batchRange = getBatchTimeRange(startArr[0], endArr[0], batchArr[0])
        }

        let timingDetail = ""
        if (startEndRange && batchRange) {
          timingDetail = ` at ${startEndRange}/${batchRange}`
        } else if (startEndRange) {
          timingDetail = ` at ${startEndRange}`
        } else if (batchRange) {
          timingDetail = ` at ${batchRange}`
        }

        suffix = `_Missing onomatopoeia${timingDetail}`
      }

      const sortedEps = Array.from(epsSet)
        .sort((a, b) => Number(a) - Number(b))
        .map((e) => e.padStart(3, "0"))

      const epsJoined = sortedEps.length > 0 ? sortedEps.join(", ") : "000"
      const epsFormattedRange = formatEpisodeRanges(Array.from(epsSet))
      const minEps = sortedEps.length > 0 ? Number(sortedEps[0]) : 0

      const isBeluman = status === "Beluman"
      const rawStart = isBeluman ? "-" : (Array.from(startTimeSet).join(", ") || "-")
      const rawBatch = isBeluman ? "-" : (Array.from(batchTimeSet).join(", ") || "-")

      const startTimeFormatted = isBeluman ? "-" : formatCompactTimeToken(rawStart)
      const batchTimeFormatted = isBeluman ? "-" : formatCompactTimeToken(rawBatch)

      const reportString = `${formattedTitle}_${epsJoined}_${character}/${actor}${suffix}`
      const epSummary = `${epsFormattedRange} ${character}/${actor}`

      reports.push({
        groupKey,
        status,
        epsJoined,
        epsFormattedRange,
        character,
        actor,
        reportString,
        epSummary,
        startTimeFormatted,
        batchTimeFormatted,
        minEps,
        isResolved,
        firstLineId,
      })
    })

    return reports.sort((a, b) => {
      if (a.isResolved !== b.isResolved) return a.isResolved ? 1 : -1
      return a.minEps - b.minEps
    })
  }, [data.lines, data.masterArtists, taskTitle, localProgress.voReportChecks])

  // Sorted character options for Wrong Cast selection:
  // Characters with lines > 0 sorted highest to lowest line count, followed by 0-line characters.
  const wrongCastCharacterOptions = useMemo(() => {
    if (!wrongCastModal.isOpen) return []

    const lineCountMap = new Map<string, number>()
    data.lines.forEach((l) => {
      if (!l.character) return
      const key = l.character.trim().toLowerCase()
      lineCountMap.set(key, (lineCountMap.get(key) || 0) + 1)
    })

    const filtered = data.masterArtists.filter(
      (ma) => ma.characterName.trim().toLowerCase() !== wrongCastModal.currentCharacter.trim().toLowerCase()
    )

    return filtered
      .map((ma) => {
        const lineCount = lineCountMap.get(ma.characterName.trim().toLowerCase()) || 0
        return {
          ...ma,
          lineCount,
        }
      })
      .sort((a, b) => {
        if (a.lineCount > 0 && b.lineCount > 0) {
          return b.lineCount - a.lineCount
        }
        if (a.lineCount > 0 && b.lineCount === 0) return -1
        if (a.lineCount === 0 && b.lineCount > 0) return 1
        return a.characterName.localeCompare(b.characterName)
      })
  }, [data.masterArtists, data.lines, wrongCastModal.isOpen, wrongCastModal.currentCharacter])

  // Single Column PS Data Update - preserving blank line index mapping
  const handleApplySingleColumnPs = () => {
    if (!psPasteText) return

    const psLines = normalizeMultilinesInQuotes(psPasteText).map((v) => v.trim())

    if (psLines.length === 0) return

    const updatedMasters = data.masterArtists.map((ma, idx) => {
      if (idx < psLines.length) {
        const val = psLines[idx]
        if (!val || val === "-" || val.toLowerCase() === "null" || val.toLowerCase() === "undefined") {
          return { ...ma, pitchSpeed: undefined }
        }
        return { ...ma, pitchSpeed: val }
      }
      return ma
    })

    updateData({ ...data, masterArtists: updatedMasters })
    setIsPsModalOpen(false)
    setPsPasteText("")
  }

  // Edit Single Character VO Artist in Master Artist Tab
  const handleSaveVoArtist = async () => {
    const trimmedArtist = editArtistModal.newArtist.trim()
    if (!trimmedArtist || !editArtistModal.characterName) return

    const normTarget = normalizeCharKey(editArtistModal.characterName)
    const updatedMasters = data.masterArtists.map((ma) => {
      if (normalizeCharKey(ma.characterName) === normTarget) {
        return {
          ...ma,
          finalArtist: trimmedArtist,
        }
      }
      return ma
    })

    const updatedData = { ...data, masterArtists: updatedMasters }
    updateData(updatedData)

    if (taskId) {
      try {
        await fetch(`/api/tasks/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scriptData: updatedData }),
        })
      } catch (e) {
        console.error("Failed to persist updated VO artist to DB:", e)
      }
    }

    setEditArtistModal({ isOpen: false, characterName: "", currentArtist: "", newArtist: "" })
  }

  // Single Column VO Error Data Update - preserving line index mapping
  const handleApplySingleColumnVoError = () => {
    if (!voErrorPasteText) return

    const voLines = normalizeMultilinesInQuotes(voErrorPasteText).map((v) => {
      let val = v.trim()
      // Strip outer quotes exported from Google Sheets
      val = val.replace(/^["']|["']$/g, "").trim()
      return val
    })

    if (voLines.length === 0) return

    const updatedLines = data.lines.map((line, idx) => {
      if (idx < voLines.length) {
        const val = voLines[idx]
        const cleanNote =
          val &&
          val !== "-" &&
          val !== '""' &&
          val.toLowerCase() !== "null" &&
          val.toLowerCase() !== "undefined"
            ? val
            : undefined

        let newStatus = line.status
        if (cleanNote) {
          newStatus = "VO Error" as ScriptLineStatus
        } else {
          newStatus = "Inputted" as ScriptLineStatus
        }

        return {
          ...line,
          voErrorNote: cleanNote,
          status: newStatus,
        }
      }
      return line
    })

    updateData({ ...data, lines: updatedLines })
    setIsVoErrorModalOpen(false)
    setVoErrorPasteText("")
  }

  // Update VO error note & auto switch status
  const handleUpdateVoErrorNote = (lineId: string, note: string) => {
    const updated = data.lines.map((l) => {
      if (l.id === lineId) {
        const cleanNote = note || undefined
        let newStatus = l.status
        if (cleanNote && cleanNote.trim() !== "") {
          newStatus = "VO Error" as ScriptLineStatus
        } else if ((l.status === "VO Error" || !l.status) && (!cleanNote || cleanNote.trim() === "")) {
          newStatus = "Inputted" as ScriptLineStatus
        }
        return {
          ...l,
          voErrorNote: cleanNote,
          status: newStatus,
        }
      }
      return l
    })
    updateData({ ...data, lines: updated })
  }

  // Update single line status
  const handleUpdateLineStatus = (lineId: string, newStatus: ScriptLineStatus) => {
    if (newStatus === "Wrong Cast") {
      const targetLine = data.lines.find((l) => l.id === lineId)
      const curChar = targetLine ? targetLine.character : ""
      setWrongCastModal({
        isOpen: true,
        currentCharacter: curChar,
        targetLineId: lineId,
      })
      return
    }

    const updated = data.lines.map((l) => {
      if (l.id === lineId) {
        return {
          ...l,
          status: newStatus,
        }
      }
      return l
    })
    updateData({ ...data, lines: updated })
  }

  // Mark all filtered lines as Inputted
  const handleMarkFilteredInputted = () => {
    const filteredIds = new Set(filteredLines.map((l) => l.id))
    const updated = data.lines.map((l) => {
      if (filteredIds.has(l.id)) {
        return { ...l, status: "Inputted" as const }
      }
      return l
    })
    updateData({ ...data, lines: updated })
  }

  // Delete line
  const handleDeleteLine = (lineId: string) => {
    const updated = data.lines.filter((l) => l.id !== lineId)
    updateData({ ...data, lines: updated })
  }

  // Add blank line
  const handleAddLine = () => {
    const newLine: ScriptLine = {
      id: `line-${Date.now()}`,
      eps: "11",
      character: "New Character",
      lineText: "",
      status: "Beluman",
    }
    updateData({ ...data, lines: [newLine, ...data.lines] })
  }

  // Copy VOA Report
  const handleCopyReport = () => {
    const allText = missingReports.map((r) => r.reportString).join("\n")
    navigator.clipboard.writeText(allText)
    setCopiedReport(true)
    setTimeout(() => setCopiedReport(false), 2000)
  }

  // Toggle VOA Report checklist checkbox for a specific individual report line item
  const handleToggleVoReportCheck = (groupKey: string) => {
    const currentProgress: Record<string, any> =
      localProgress && typeof localProgress === "object" ? { ...localProgress } : {}
    const voChecks: Record<string, boolean> = {
      ...(currentProgress.voReportChecks || {}),
    }

    const nextState = !voChecks[groupKey]

    const parts = groupKey.split("__")
    const groupChar = parts[0]?.toLowerCase() || ""
    const originalStatus = parts[1] || ""
    const groupEps = parts[2]?.trim() || ""

    const matchesGroup = (line: ScriptLine) => {
      const lineChar = (line.character || "").trim()
      const correctChar = (line.correctCharacter || "").trim()
      const targetChar = line.status === "Wrong Cast" && correctChar ? correctChar : lineChar
      const normChar = normalizeCharKey(targetChar)
      const issueStatus = (line.previousStatus || line.status).trim()
      const eps = (line.eps || "").trim()

      if (normChar !== groupChar) return false
      if (issueStatus.toLowerCase() !== originalStatus.toLowerCase()) return false

      if (groupEps) {
        return eps === groupEps || Number(eps) === Number(groupEps)
      }
      return true
    }

    const updatedLines = data.lines.map((line) => {
      if (matchesGroup(line)) {
        if (nextState) {
          return {
            ...line,
            previousStatus: line.status !== "Inputted" ? line.status : line.previousStatus,
            status: "Inputted" as ScriptLineStatus,
          }
        } else {
          return {
            ...line,
            status: (line.previousStatus || originalStatus) as ScriptLineStatus,
            previousStatus: undefined,
          }
        }
      }
      return line
    })

    voChecks[groupKey] = nextState
    const updatedProgress = { ...currentProgress, voReportChecks: voChecks }
    setLocalProgress(updatedProgress)
    if (onUpdateProgress) {
      onUpdateProgress(updatedProgress)
    }

    updateData({ ...data, lines: updatedLines })
  }

  // Toggle character check in summary
  const handleToggleCharCheck = (charName: string) => {
    const currentChecks = { ...(data.checkedCharacters || {}) }
    currentChecks[charName] = !currentChecks[charName]
    updateData({ ...data, checkedCharacters: currentChecks })
  }

  // Check / Uncheck all characters in summary
  const handleCheckAll = (checked: boolean) => {
    const currentChecks = { ...(data.checkedCharacters || {}) }
    characterSummaries.forEach((cs) => {
      currentChecks[cs.character] = checked
    })
    updateData({ ...data, checkedCharacters: currentChecks })
  }

  // Batch update line status for a specific character across all script lines (Inputted, Beluman, Broken, etc.)
  const handleBatchUpdateCharacterStatus = (charName: string, newStatus: ScriptLineStatus) => {
    const targetName = charName.trim().toLowerCase()
    const updatedLines = data.lines.map((line) => {
      if (line.character && line.character.trim().toLowerCase() === targetName) {
        return {
          ...line,
          status: newStatus,
          previousStatus: newStatus === "Inputted" ? line.status : undefined,
        }
      }
      return line
    })
    updateData({ ...data, lines: updatedLines })
  }

  // Click PS / Pitch in Tab 3 Character Summary to switch to Script tab, filter by that character, and copy first timing
  const handlePitchClick = (charName: string, firstTimingRaw?: string) => {
    if (firstTimingRaw && firstTimingRaw !== "-" && firstTimingRaw.trim()) {
      const tc = formatToFullTimecode(firstTimingRaw)
      if (tc && typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(tc)
      }
    }
    setSelectedCharacterFilter(charName)
    setSelectedStatusFilter("all")
    setSearchQuery("")
    setActiveTab("lines")
  }

  // Handle wrong cast character selection from popup modal
  const handleSelectWrongCastCharacter = (selectedCorrectCharacter: string) => {
    let updatedLines = [...data.lines]

    if (wrongCastModal.targetLineId) {
      updatedLines = updatedLines.map((l) => {
        if (l.id === wrongCastModal.targetLineId) {
          return {
            ...l,
            character: selectedCorrectCharacter,
            correctCharacter: selectedCorrectCharacter,
            status: "Wrong Cast" as ScriptLineStatus,
          }
        }
        return l
      })
    } else if (wrongCastModal.targetCharName) {
      const targetName = wrongCastModal.targetCharName.trim().toLowerCase()
      updatedLines = updatedLines.map((l) => {
        if (l.character && l.character.trim().toLowerCase() === targetName) {
          return {
            ...l,
            character: selectedCorrectCharacter,
            correctCharacter: selectedCorrectCharacter,
            status: "Wrong Cast" as ScriptLineStatus,
          }
        }
        return l
      })
    } else if (wrongCastModal.targetFiltered) {
      const filteredIds = new Set(filteredLines.map((l) => l.id))
      updatedLines = updatedLines.map((l) => {
        if (filteredIds.has(l.id)) {
          return {
            ...l,
            character: selectedCorrectCharacter,
            correctCharacter: selectedCorrectCharacter,
            status: "Wrong Cast" as ScriptLineStatus,
          }
        }
        return l
      })
    }

    updateData({ ...data, lines: updatedLines })
    setWrongCastModal({ isOpen: false, currentCharacter: "" })
  }

  const totalLines = data.lines.length
  const inputtedCount = data.lines.filter((l) => l.status === "Inputted").length
  const belumanCount = data.lines.filter((l) => l.status === "Beluman").length
  const issueCount = totalLines - inputtedCount

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-background border border-border rounded-xl shadow-2xl w-[96vw] max-w-[1580px] h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3 px-4 border-b flex items-center justify-between bg-card">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                Script
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                {taskTitle}
              </span>
            </div>
            <span className="text-muted-foreground/30 hidden sm:inline">•</span>
            <div className="text-xs text-muted-foreground flex items-center gap-3">
              <span>
                Total Lines: <b>{totalLines}</b>
              </span>
              <span>•</span>
              <span className="text-emerald-600 font-medium">
                Inputted: <b>{inputtedCount}</b>
              </span>
              <span>•</span>
              <span className="text-red-600 font-medium">
                Beluman: <b>{belumanCount}</b>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCheckVoMode(!isCheckVoMode)}
              className={`px-3 py-1.5 text-xs border rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                isCheckVoMode
                  ? "bg-amber-500/15 border-amber-500/50 text-amber-700 dark:text-amber-300 font-semibold shadow-2xs"
                  : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
              title="Toggle Check VO Mode to hide workflow progress steps"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Check VO Mode</span>
              {isCheckVoMode && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
            <button
              onClick={onReRunWizard}
              className="px-3 py-1.5 text-xs border border-border rounded-md hover:bg-muted transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
              Re-run Setup Wizard
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Workflow Progress Checklist Panel (Entirely hidden when Check VO Mode is active) */}
        {!isCheckVoMode && (
          <div className="bg-muted/20 border-b py-1.5 px-3 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] font-bold text-foreground tracking-wide">
                Workflow Progress Steps
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300/60">
                {captionSubStepsCompletedCount} / {totalSubStepsCount} Done
              </span>
            </div>
            <button
              onClick={() => setIsProgressExpanded(!isProgressExpanded)}
              className="text-[10px] text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1 bg-background px-2 py-0.5 rounded border shadow-2xs transition-colors"
            >
              {isProgressExpanded ? (
                <>
                  Hide Steps <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  Show Steps <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          </div>

          {isProgressExpanded && (
            <div className={`grid grid-cols-1 ${isCaptionTask ? "sm:grid-cols-[1.3fr_auto_1.8fr_1.8fr]" : "sm:grid-cols-[1.3fr_auto_1.8fr]"} gap-2.5 bg-card p-2 rounded-md border text-[10px] mt-1.5 shadow-2xs`}>
              {/* Group 1: Prep (1 line) */}
              <div className="border-r pr-2 last:border-r-0 border-border/40">
                <div className="font-bold text-foreground border-b pb-0.5 mb-1 flex items-center justify-between text-[10px]">
                  <span>Prep</span>
                  <span className="text-[9px] font-mono text-muted-foreground font-semibold">
                    {prepCompletedCount}/3
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {[
                    { label: "Vocal Split", key: "vocalSplit" },
                    { label: "VO Enhance", key: "voEnhance" },
                    { label: "Subtitle Join", key: "subtitleJoin" },
                  ].map((item) => {
                    const isChecked = !!localProgress[item.key]
                    return (
                      <label
                        key={item.key}
                        className="flex items-center gap-1 cursor-pointer text-[10px] text-muted-foreground hover:text-foreground select-none leading-tight py-0.2 whitespace-nowrap"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSubStep(item.key)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-3 h-3 cursor-pointer accent-emerald-600 flex-shrink-0"
                        />
                        <span className={isChecked ? "line-through text-muted-foreground/60 font-medium" : "font-semibold text-foreground"}>
                          {item.label}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Group 2: Check VO (1 line - compact width) */}
              <div className="border-r pr-2.5 last:border-r-0 border-border/40 min-w-[90px]">
                <div className="font-bold text-foreground border-b pb-0.5 mb-1 flex items-center justify-between text-[10px]">
                  <span>Check VO</span>
                  <span className="text-[9px] font-mono text-muted-foreground font-semibold">
                    {checkVoCompletedCount}/1
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {[
                    { label: "Check VO", key: "checkVO" },
                  ].map((item) => {
                    const isChecked = !!localProgress[item.key]
                    return (
                      <label
                        key={item.key}
                        className="flex items-center gap-1 cursor-pointer text-[10px] text-muted-foreground hover:text-foreground select-none leading-tight py-0.2 whitespace-nowrap"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSubStep(item.key)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-3 h-3 cursor-pointer accent-emerald-600 flex-shrink-0"
                        />
                        <span className={isChecked ? "line-through text-muted-foreground/60 font-medium" : "font-semibold text-foreground"}>
                          {item.label}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Group 3: Editing (2 lines) */}
              <div className="border-r pr-2 last:border-r-0 border-border/40">
                <div className="font-bold text-foreground border-b pb-0.5 mb-1 flex items-center justify-between text-[10px]">
                  <span>Editing</span>
                  <span className="text-[9px] font-mono text-muted-foreground font-semibold">
                    {editingCompletedCount}/4
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  {[
                    { label: "Pitch Shift", key: "pitchShift" },
                    { label: "Volume Adjustment", key: "volumeAdjustment" },
                    { label: "Subseq", key: "subseq" },
                    { label: "Mixing VO", key: "mixingVO" },
                  ].map((item) => {
                    const isChecked = !!localProgress[item.key]
                    return (
                      <label
                        key={item.key}
                        className="flex items-center gap-1 cursor-pointer text-[10px] text-muted-foreground hover:text-foreground select-none leading-tight py-0.2 whitespace-nowrap"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSubStep(item.key)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-3 h-3 cursor-pointer accent-emerald-600 flex-shrink-0"
                        />
                        <span className={isChecked ? "line-through text-muted-foreground/60 font-medium" : "font-semibold text-foreground"}>
                          {item.label}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Group 4: Caption Edit (2 lines, Caption cards only) */}
              {isCaptionTask && (
                <div>
                  <div className="font-bold text-foreground border-b pb-0.5 mb-1 flex items-center justify-between text-[10px]">
                    <span>Caption Edit</span>
                    <span className="text-[9px] font-mono text-muted-foreground font-semibold">
                      {captionEditCompletedCount}/3
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    {[
                      { label: "Replacement text", key: "inputReplacementText" },
                      { label: "Input Sync SRT", key: "inputSyncSRT" },
                      { label: "Re check SRT", key: "reCheckSRT" },
                    ].map((item) => {
                      const isChecked = !!localProgress[item.key]
                      return (
                        <label
                          key={item.key}
                          className="flex items-center gap-1 cursor-pointer text-[10px] text-muted-foreground hover:text-foreground select-none leading-tight py-0.2 whitespace-nowrap"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSubStep(item.key)}
                            className="rounded text-emerald-600 focus:ring-emerald-500 w-3 h-3 cursor-pointer accent-emerald-600 flex-shrink-0"
                          />
                          <span className={isChecked ? "line-through text-muted-foreground/60 font-medium" : "font-semibold text-foreground"}>
                            {item.label}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        )}

        {/* Tab Buttons */}
        <div className="px-4 pt-3 bg-card border-b flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("lines")}
            className={`px-3 py-2 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === "lines"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Script Lines ({data.lines.length})
          </button>

          <button
            onClick={() => setActiveTab("summary")}
            className={`px-3 py-2 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === "summary"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Character Summary ({activeCharacterSummaries.length})
          </button>

          <button
            onClick={() => setActiveTab("report")}
            className={`px-3 py-2 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === "report"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" /> VOA Report
            {belumanCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-red-500 text-white rounded-full text-[10px] font-bold">
                {missingReports.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("episodes")}
            className={`px-3 py-2 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === "episodes"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-500" /> Episode Character ({totalEpisodeCharCountSum})
          </button>

          <button
            onClick={() => setActiveTab("master")}
            className={`px-3 py-2 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === "master"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Master Artist ({data.masterArtists.length})
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-hidden p-4 flex flex-col bg-background">
          {/* TAB 1: SCRIPT LINES MANAGER */}
          {activeTab === "lines" && (
            <div className="flex-1 flex flex-col overflow-hidden space-y-3">
              {!isCheckVoMode && (
                <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/30 p-2.5 rounded-lg border text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search script lines or characters..."
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        className="w-full h-8 text-xs pl-8 pr-7 bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="absolute right-2 top-2 p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors cursor-pointer"
                          title="Clear search"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Custom Character Filter Dropdown */}
                    <div className={`relative inline-block text-left ${isCharFilterOpen ? "z-40" : ""}`}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCharFilterOpen(!isCharFilterOpen)
                          setIsStatusFilterOpen(false)
                        }}
                        className="h-8 px-3 text-xs font-semibold bg-background hover:bg-muted/80 text-foreground border border-input rounded-md shadow-2xs flex items-center gap-2 cursor-pointer transition-colors active:scale-95 whitespace-nowrap"
                      >
                        <span>
                          {selectedCharacterFilter === "all"
                            ? "All Characters"
                            : selectedCharacterFilter}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>

                      {isCharFilterOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsCharFilterOpen(false)}
                          />
                          <div className="absolute left-0 top-full mt-1 z-50 w-60 min-w-[220px] max-h-64 overflow-y-auto bg-card border border-border rounded-lg shadow-xl p-1 space-y-0.5 animate-in fade-in zoom-in-95 duration-100 text-left">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCharacterFilter("all")
                                setIsCharFilterOpen(false)
                              }}
                              className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                                selectedCharacterFilter === "all"
                                  ? "bg-primary/10 text-primary font-bold"
                                  : "text-foreground hover:bg-muted"
                              }`}
                            >
                              <span>All Characters</span>
                              {selectedCharacterFilter === "all" && <Check className="w-3.5 h-3.5 text-primary" />}
                            </button>
                            {availableCharacterFilterOptions.map((char) => {
                              const isSelected = selectedCharacterFilter === char
                              return (
                                <button
                                  key={char}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCharacterFilter(char)
                                    setIsCharFilterOpen(false)
                                  }}
                                  className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                                    isSelected
                                      ? "bg-primary/10 text-primary font-bold"
                                      : "text-foreground hover:bg-muted"
                                  }`}
                                >
                                  <span className="truncate text-foreground font-semibold flex-1 text-left">{char}</span>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                                </button>
                              )
                            })}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Custom Status Filter Dropdown */}
                    <div className={`relative inline-block text-left ${isStatusFilterOpen ? "z-40" : ""}`}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsStatusFilterOpen(!isStatusFilterOpen)
                          setIsCharFilterOpen(false)
                        }}
                        className="h-8 px-3 text-xs font-semibold bg-background hover:bg-muted/80 text-foreground border border-input rounded-md shadow-2xs flex items-center gap-2 cursor-pointer transition-colors active:scale-95 whitespace-nowrap"
                      >
                        <span>
                          {selectedStatusFilter === "all"
                            ? `All Statuses (${totalLines})`
                            : `${selectedStatusFilter} (${data.lines.filter((l) => l.status === selectedStatusFilter).length})`}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>

                      {isStatusFilterOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsStatusFilterOpen(false)}
                          />
                          <div className="absolute left-0 top-full mt-1 z-50 w-60 min-w-[220px] max-h-72 overflow-y-auto bg-card border border-border rounded-lg shadow-xl p-1 space-y-0.5 animate-in fade-in zoom-in-95 duration-100 text-left">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedStatusFilter("all")
                                setIsStatusFilterOpen(false)
                              }}
                              className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                                selectedStatusFilter === "all"
                                  ? "bg-primary/10 text-primary font-bold"
                                  : "text-foreground hover:bg-muted"
                              }`}
                            >
                              <span>All Statuses</span>
                              <span className="text-[10px] font-mono opacity-60">({totalLines})</span>
                            </button>
                            {SCRIPT_LINE_STATUSES.map((st) => {
                              const count = data.lines.filter((l) => l.status === st).length
                              const style = STATUS_STYLE_MAP[st]
                              const isSelected = selectedStatusFilter === st
                              return (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => {
                                    setSelectedStatusFilter(st)
                                    setIsStatusFilterOpen(false)
                                  }}
                                  className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                                    isSelected
                                      ? "bg-primary/10 font-bold text-foreground"
                                      : "text-foreground hover:bg-muted"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${style?.bg || "bg-gray-300"} border ${style?.border || "border-gray-400"}`} />
                                    <span className="truncate text-foreground font-semibold">{st}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <span className="text-[10px] font-mono text-muted-foreground font-bold">({count})</span>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCaptionTask && (
                      <button
                        onClick={() => setIsVoErrorModalOpen(true)}
                        className="h-8 px-3 text-xs border border-red-200 text-red-700 bg-red-50/60 hover:bg-red-100 rounded-md transition-colors flex items-center gap-1.5 font-semibold"
                      >
                        <FileText className="w-3.5 h-3.5 text-red-600" />
                        Paste VO Error Column
                      </button>
                    )}
                    <button
                      onClick={handleMarkFilteredInputted}
                      className="h-8 px-3 text-xs border border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100 rounded-md transition-colors flex items-center gap-1 font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Filtered as Inputted
                    </button>
                    <button
                      onClick={handleAddLine}
                      className="h-8 px-3 text-xs bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Line
                    </button>
                  </div>
                </div>
              )}

              <div
                ref={scrollContainerRef}
                onScroll={handleTableScroll}
                className="flex-1 overflow-auto border rounded-lg"
              >
                <table className="w-full text-xs text-left border-collapse table-fixed min-w-[1050px]">
                  <thead className="sticky top-0 bg-muted font-semibold text-muted-foreground border-b z-10">
                    <tr>
                      <th className="p-2 w-12 text-center border-r shrink-0">Eps</th>
                      <th className="p-2 w-24 text-center border-r shrink-0">Start</th>
                      <th className="p-2 w-24 text-center border-r shrink-0">End</th>
                      <th className="p-2 w-24 text-center border-r shrink-0">Batch</th>
                      <th
                        style={{ width: `${colWidths.character}px` }}
                        className="p-2 relative select-none group border-r shrink-0"
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">Character</span>
                          <div
                            onMouseDown={(e) => handleMouseDownResize("character", e)}
                            className="absolute right-0 top-0 bottom-0 w-2.5 cursor-col-resize hover:bg-primary/40 active:bg-primary z-20 flex items-center justify-center transition-colors"
                            title="Drag to resize Character column"
                          >
                            <div className="w-0.5 h-4 bg-muted-foreground/30 group-hover:bg-primary/60 rounded-full" />
                          </div>
                        </div>
                      </th>
                      <th
                        style={{ width: `${colWidths.scriptText}px` }}
                        className="p-2 relative select-none group border-r shrink-0"
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">Script file (Lines)</span>
                          <div
                            onMouseDown={(e) => handleMouseDownResize("scriptText", e)}
                            className="absolute right-0 top-0 bottom-0 w-2.5 cursor-col-resize hover:bg-primary/40 active:bg-primary z-20 flex items-center justify-center transition-colors"
                            title="Drag to resize Script Lines column"
                          >
                            <div className="w-0.5 h-4 bg-muted-foreground/30 group-hover:bg-primary/60 rounded-full" />
                          </div>
                        </div>
                      </th>
                      {isCaptionTask && (
                        <th
                          style={{ width: `${colWidths.voErrorNote}px` }}
                          className="p-2 relative select-none group border-r text-red-600 font-semibold text-[10px] shrink-0"
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">VO Error Note</span>
                            <div
                              onMouseDown={(e) => handleMouseDownResize("voErrorNote", e)}
                              className="absolute right-0 top-0 bottom-0 w-2.5 cursor-col-resize hover:bg-red-400/40 active:bg-red-500 z-20 flex items-center justify-center transition-colors"
                              title="Drag to resize VO Error Note column"
                            >
                              <div className="w-0.5 h-4 bg-red-300 rounded-full" />
                            </div>
                          </div>
                        </th>
                      )}
                      <th className="p-2 w-28 text-center border-r shrink-0">Status</th>
                      <th className="p-2 w-12 text-center shrink-0">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredLines.map((line, idx) => {
                      const currentEps = line.eps ? line.eps.trim().padStart(3, "0") : "Unknown"
                      const prevEps =
                        idx > 0 && filteredLines[idx - 1].eps
                          ? filteredLines[idx - 1].eps.trim().padStart(3, "0")
                          : null
                      const showDivider = idx === 0 || currentEps !== prevEps
                      const countInEp = filteredLines.filter(
                        (l) => (l.eps ? l.eps.trim().padStart(3, "0") : "Unknown") === currentEps
                      ).length

                      const displayLineText = line.lineText
                        ? line.lineText
                            .replace(/Missing Onomatopoeia/gi, "Onomatopoeia")
                            .replace(/\\N/gi, " ")
                            .replace(/[\r\n]+/g, " ")
                            .replace(/\s+/g, " ")
                            .trim()
                        : ""

                      const prevLine = idx > 0 ? filteredLines[idx - 1] : undefined
                      const currStartSec = timeToSeconds(line.startTime)
                      const prevEndSec = timeToSeconds(prevLine?.endTime || prevLine?.startTime)

                      const isNoRange = !!line.startTime && (!line.endTime || line.endTime === "-" || line.startTime === line.endTime)
                      const isOverlap = currStartSec !== null && prevEndSec !== null && currStartSec <= prevEndSec
                      const isSpecialTimingMark = line.status === "Onomatopoeia" || line.status === "Missing Onomatopoeia"

                      const lineEpNum = parseInt(line.eps.replace(/\D/g, ""), 10)
                      const rangeIndex = distinctRanges.findIndex((r) => lineEpNum >= r.start && lineEpNum <= r.end)
                      const offsetSec = rangeIndex > 0 ? timeToSeconds(range1Duration) || 0 : 0

                      let timelineBatchTime: string | null = null
                      if (offsetSec > 0 && line.batchTime && line.batchTime !== "-") {
                        const lineBatchSec = timeToSeconds(line.batchTime)
                        const baseSec = rangeBaseOffsets[rangeIndex] ?? 0
                        if (lineBatchSec !== null) {
                          const elapsedSec = Math.max(0, lineBatchSec - baseSec)
                          const finalTimelineSec = offsetSec + elapsedSec
                          const hasHours = line.batchTime.includes(":") && line.batchTime.split(":").length === 3
                          timelineBatchTime = secondsToTimeString(finalTimelineSec, hasHours || finalTimelineSec >= 3600)
                        }
                      }

                      return (
                        <React.Fragment key={line.id}>
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
                          {(() => {
                            const isVoError = line.status === "VO Error" || Boolean(line.voErrorNote)
                            const isBeluman = line.status === "Beluman"
                            const charStyle = characterColors[line.character]
                            return (
                              <tr
                                id={`script-line-${line.id}`}
                                style={!isVoError && !isBeluman ? charStyle : undefined}
                                className={`transition-all duration-300 ${
                                  highlightedLineId === line.id
                                    ? "bg-amber-300/80 dark:bg-amber-500/50 ring-2 ring-amber-500 z-30 shadow-md animate-pulse"
                                    : isVoError
                                    ? "bg-amber-500/15 hover:bg-amber-500/20"
                                    : isBeluman
                                    ? "bg-red-500/10 hover:bg-red-500/15"
                                    : "hover:brightness-95 dark:hover:brightness-125"
                                  } ${openLineStatusDropdown === line.id || openRowActionDropdown === line.id ? "relative z-40" : ""}`}
                              >
                                <td className="p-2 text-center border-r font-mono text-[11px] font-bold">
                                  {line.eps ? line.eps.trim().padStart(3, "0") : "-"}
                                </td>
                                 <td className="p-1.5 text-center border-r font-mono text-[10px] text-muted-foreground whitespace-nowrap overflow-hidden">
                                   {line.startTime && line.startTime !== "-" ? (
                                     <button
                                       type="button"
                                       onClick={() => handleCopyStartTime(line.id, line.startTime)}
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
                                       {copiedTimingLineId === line.id && (
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
                                     <div className="text-[9px] text-purple-700 dark:text-purple-400 font-mono font-medium leading-tight mt-0.5 truncate" title={`Timeline offset (+${range1Duration}): ${timelineBatchTime}`}>
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
                                        onChange={(e) => handleUpdateVoErrorNote(line.id, e.target.value)}
                                        className="w-full bg-transparent text-red-600 font-medium placeholder:text-muted-foreground/30 outline-none border-b border-transparent focus:border-red-400 text-[10px] py-0"
                                      />
                                      {line.voErrorNote && (
                                        <button
                                          onClick={() => handleUpdateVoErrorNote(line.id, "")}
                                          className="p-0.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                                          title="Remove VO Error Note"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                )}
                                <td className="p-2 border-r text-center">
                                  <div className={`relative inline-block text-center ${openLineStatusDropdown === line.id ? "z-40" : ""}`}>
                                    <button
                                      type="button"
                                      onClick={() => setOpenLineStatusDropdown(openLineStatusDropdown === line.id ? null : line.id)}
                                      className={`h-5 text-[10px] px-2 rounded-full font-bold transition-all border outline-none cursor-pointer flex items-center justify-center gap-1 active:scale-95 whitespace-nowrap ${
                                        STATUS_STYLE_MAP[line.status]?.bg || "bg-gray-100"
                                      } ${STATUS_STYLE_MAP[line.status]?.text || "text-gray-800"} ${
                                        STATUS_STYLE_MAP[line.status]?.border || "border-gray-200"
                                      }`}
                                    >
                                      <span>{STATUS_STYLE_MAP[line.status]?.label || line.status}</span>
                                      <ChevronDown className="w-2.5 h-2.5 opacity-70" />
                                    </button>

                                    {openLineStatusDropdown === line.id && (
                                      <>
                                        <div
                                          className="fixed inset-0 z-40"
                                          onClick={() => setOpenLineStatusDropdown(null)}
                                        />
                                        <div
                                          className={`absolute left-1/2 -translate-x-1/2 ${
                                            idx >= filteredLines.length - 6 && idx >= 6 ? "bottom-full mb-1" : "top-full mt-1"
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
                                                  handleUpdateLineStatus(line.id, st)
                                                  setOpenLineStatusDropdown(null)
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
                                  <div className={`relative inline-block text-center ${openRowActionDropdown === line.id ? "z-40" : ""}`}>
                                    <button
                                      type="button"
                                      onClick={() => setOpenRowActionDropdown(openRowActionDropdown === line.id ? null : line.id)}
                                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                      title="Actions"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>

                                    {openRowActionDropdown === line.id && (
                                      <>
                                        <div
                                          className="fixed inset-0 z-40"
                                          onClick={() => setOpenRowActionDropdown(null)}
                                        />
                                        <div
                                          className={`absolute right-0 ${
                                            idx >= filteredLines.length - 4 && idx >= 4 ? "bottom-full mb-1" : "top-full mt-1"
                                          } z-50 w-48 bg-card border border-border rounded-lg shadow-xl p-1 space-y-0.5 animate-in fade-in zoom-in-95 duration-100 text-left`}
                                        >
                                          <button
                                            type="button"
                                            onClick={() => {
                                              handleCopyScriptLineText(line.id, displayLineText || line.lineText || "")
                                              setOpenRowActionDropdown(null)
                                            }}
                                            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
                                          >
                                            {copiedScriptLineId === line.id ? (
                                              <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                            ) : (
                                              <Copy className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                            )}
                                            <span>{copiedScriptLineId === line.id ? "Copied Script!" : "Copy Script Line"}</span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const defaultTime = computeDefaultTiming(line)
                                              setAddLineModal({
                                                isOpen: true,
                                                position: "before",
                                                refLineId: line.id,
                                                afterEps: line.eps || "",
                                                character: line.character || "",
                                                lineText: "",
                                                status: "Inputted",
                                                startTime: defaultTime.startTime,
                                                endTime: defaultTime.endTime,
                                                batchTime: line.batchTime || "",
                                              })
                                              setOpenRowActionDropdown(null)
                                            }}
                                            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
                                          >
                                            <Plus className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                            <span>Add Line Before</span>
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => {
                                              const defaultTime = computeDefaultTiming(line)
                                              setAddLineModal({
                                                isOpen: true,
                                                position: "after",
                                                refLineId: line.id,
                                                afterEps: line.eps || "",
                                                character: line.character || "",
                                                lineText: "",
                                                status: "Inputted",
                                                startTime: defaultTime.startTime,
                                                endTime: defaultTime.endTime,
                                                batchTime: line.batchTime || "",
                                              })
                                              setOpenRowActionDropdown(null)
                                            }}
                                            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
                                          >
                                            <Plus className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                            <span>Add Line After</span>
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => {
                                              const defaultTime = computeDefaultTiming(line)
                                              setAddLineModal({
                                                isOpen: true,
                                                position: "after",
                                                refLineId: line.id,
                                                afterEps: line.eps || "",
                                                character: line.character || "",
                                                lineText: "Onomatopoeia",
                                                status: "Onomatopoeia",
                                                startTime: defaultTime.startTime,
                                                endTime: defaultTime.endTime,
                                                batchTime: line.batchTime || "",
                                              })
                                              setOpenRowActionDropdown(null)
                                            }}
                                            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold text-fuchsia-700 dark:text-fuchsia-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/40 rounded-md transition-colors cursor-pointer"
                                          >
                                            <Sparkles className="w-3.5 h-3.5 text-fuchsia-500 flex-shrink-0" />
                                            <span>Add Onomatopoeia</span>
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => {
                                              const defaultTime = computeDefaultTiming(prevLine)
                                              setEditTimingModal({
                                                isOpen: true,
                                                lineId: line.id,
                                                startTime: line.startTime || defaultTime.startTime,
                                                endTime: line.endTime || defaultTime.endTime,
                                                batchTime: line.batchTime || "",
                                              })
                                              setOpenRowActionDropdown(null)
                                            }}
                                            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
                                          >
                                            <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                            <span>Edit Timing</span>
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => {
                                              handleDeleteLine(line.id)
                                              setOpenRowActionDropdown(null)
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
                            )
                          })()}
                        </React.Fragment>
                      )
                    })}
                    {filteredLines.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-muted-foreground">
                          No script lines found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: MASTER ARTIST MAPPING */}
          {activeTab === "master" && (
            <div className="flex-1 flex flex-col overflow-hidden space-y-3">
              <div className="flex items-center justify-between bg-muted/30 p-2.5 rounded-lg border text-xs">
                <span className="text-muted-foreground font-medium">
                  Master Voice Actor Mappings ({data.masterArtists.length} registered characters)
                </span>
                <button
                  onClick={() => setIsPsModalOpen(true)}
                  className="h-8 px-3 text-xs border border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 font-medium rounded-md transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Paste Pitch Data (PS Column)
                </button>
              </div>

              <div className="flex-1 overflow-auto border rounded-lg">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="sticky top-0 bg-muted font-semibold text-muted-foreground border-b z-10">
                    <tr>
                      <th className="p-2.5">Character name</th>
                      <th className="p-2.5">Final artist</th>
                      <th className="p-2.5 w-36">PS</th>
                      <th className="p-2.5 w-12 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data.masterArtists.map((ma, idx) => (
                      <tr key={idx} className="hover:bg-muted/40 transition-colors">
                        <td className="p-2.5 font-semibold text-foreground">
                          <div className="flex items-center gap-1.5 group">
                            <span>{ma.characterName}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyCharName(ma.characterName)}
                              className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors cursor-pointer opacity-70 group-hover:opacity-100"
                              title={`Copy "${ma.characterName}"`}
                            >
                              {copiedCharName === ma.characterName ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="p-2.5 font-medium text-emerald-700">
                          {ma.finalArtist}
                        </td>
                        <td className="p-2.5 font-mono">
                          {ma.pitchSpeed ? (
                            <span className="text-xs px-2 py-0.5 rounded bg-secondary font-mono">
                              {ma.pitchSpeed}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic text-[11px]">
                              Not set
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-center relative">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMasterActionDropdown(
                                openMasterActionDropdown === idx ? null : idx
                              )
                            }
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            title="Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openMasterActionDropdown === idx && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setOpenMasterActionDropdown(null)}
                              />
                              <div
                                className={`absolute right-2 ${
                                  idx >= data.masterArtists.length - 3 && idx >= 3
                                    ? "bottom-full mb-1"
                                    : "top-full mt-1"
                                } z-50 w-44 bg-card border border-border rounded-lg shadow-xl p-1 animate-in fade-in zoom-in-95 duration-100 text-left`}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditArtistModal({
                                      isOpen: true,
                                      characterName: ma.characterName,
                                      currentArtist: ma.finalArtist || "",
                                      newArtist: ma.finalArtist || "",
                                    })
                                    setOpenMasterActionDropdown(null)
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
                                >
                                  <Pencil className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                  <span>Change VO Artist</span>
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CHARACTER & ACTOR SUMMARY REPORT (Sorted Highest to Lowest + Collapsed 0 Lines) */}
          {activeTab === "summary" && (
            <div className="flex-1 flex flex-col overflow-hidden space-y-3">
              {/* Search & VOA Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 bg-card p-2.5 rounded-lg border shadow-2xs text-xs">
                <div className="flex items-center gap-2 flex-1 min-w-[280px]">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search character or VOA..."
                      value={summarySearchQuery}
                      onChange={(e) => setSummarySearchQuery(e.target.value)}
                      className="w-full h-8 pl-8 pr-7 text-xs rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                    />
                    {summarySearchQuery && (
                      <button
                        type="button"
                        onClick={() => setSummarySearchQuery("")}
                        className="absolute right-2 top-2 p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors cursor-pointer"
                        title="Clear search"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <select
                    value={summaryVoaFilter}
                    onChange={(e) => setSummaryVoaFilter(e.target.value)}
                    className="h-8 px-2.5 text-xs rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium cursor-pointer max-w-[170px] truncate"
                  >
                    <option value="ALL">All VOA Artists ({uniqueVoaArtists.length})</option>
                    {uniqueVoaArtists.map((artist) => (
                      <option key={artist} value={artist}>
                        {artist}
                      </option>
                    ))}
                    <option value="UNASSIGNED">Unassigned Artists</option>
                  </select>

                  <select
                    value={summaryStatusFilter}
                    onChange={(e) => setSummaryStatusFilter(e.target.value)}
                    className="h-8 px-2.5 text-xs rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium cursor-pointer max-w-[140px] truncate"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="BELUMAN">Beluman</option>
                    <option value="INPUTTED">Inputted</option>
                    <option value="BROKEN">Broken / Issues</option>
                  </select>

                  {(summarySearchQuery || summaryVoaFilter !== "ALL" || summaryStatusFilter !== "ALL") && (
                    <button
                      type="button"
                      onClick={() => {
                        setSummarySearchQuery("")
                        setSummaryVoaFilter("ALL")
                        setSummaryStatusFilter("ALL")
                      }}
                      className="text-[11px] text-muted-foreground hover:text-foreground underline cursor-pointer font-medium whitespace-nowrap"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCheckAll(true)}
                    className="h-8 px-2.5 text-xs border border-border text-foreground hover:bg-muted font-medium rounded-md transition-colors cursor-pointer"
                  >
                    Check All
                  </button>
                  <button
                    onClick={() => handleCheckAll(false)}
                    className="h-8 px-2.5 text-xs border border-border text-foreground hover:bg-muted font-medium rounded-md transition-colors cursor-pointer"
                  >
                    Uncheck All
                  </button>
                  <button
                    onClick={() => setIsPsModalOpen(true)}
                    className="h-8 px-3 text-xs border border-border rounded-md hover:bg-muted font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Update Pitch Data (PS)
                  </button>
                </div>
              </div>

              <div ref={summaryScrollContainerRef} onScroll={handleSummaryTableScroll} className="flex-1 overflow-auto border rounded-lg space-y-4 p-1">
                {/* Active Characters Table */}
                <table className="w-full text-xs text-left border-collapse border rounded-md">
                  <thead className="sticky top-0 bg-muted font-semibold text-muted-foreground border-b z-10">
                    <tr>
                      <th className="p-2.5 w-16 text-center text-muted-foreground font-semibold">
                        <div className="flex items-center justify-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={
                              filteredCharacterSummaries.length > 0 &&
                              filteredCharacterSummaries.every((cs) => !!uiCheckedRows[cs.character])
                            }
                            onChange={(e) => {
                              const isChecked = e.target.checked
                              const updated = { ...uiCheckedRows }
                              filteredCharacterSummaries.forEach((cs) => {
                                updated[cs.character] = isChecked
                              })
                              setUiCheckedRows(updated)
                            }}
                            className="rounded text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer accent-primary"
                          />
                          <span>No.</span>
                        </div>
                      </th>
                      <th className="p-2.5 w-20">PS</th>
                      <th className="p-2.5 w-32">Character</th>
                      <th className="p-2.5 w-20 text-center">Count</th>
                      <th className="p-2.5 w-28">Actor</th>
                      <th className="p-2.5">Appear in</th>
                      {isSingleEpisodeCard && (
                        <th className="p-2.5 w-28 whitespace-nowrap">First Timing</th>
                      )}
                      <th className="p-2.5 w-64 text-right pr-3">Status Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredCharacterSummaries.map((cs, idx) => {
                      const isBeluman = cs.belumanLinesCount > 0
                      return (
                        <tr
                          key={idx}
                          className={`transition-colors ${
                            isBeluman
                              ? "bg-red-500/10 hover:bg-red-500/15"
                              : "bg-emerald-500/10 hover:bg-emerald-500/15"
                          } ${openActionDropdown === cs.character ? "relative z-40" : ""}`}
                        >
                          <td className="p-2.5 text-center font-mono text-xs text-muted-foreground font-semibold whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <input
                                type="checkbox"
                                checked={!!uiCheckedRows[cs.character]}
                                onChange={() => toggleUiRowCheck(cs.character)}
                                className="rounded text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer accent-primary"
                              />
                              <span>{idx + 1}</span>
                            </div>
                          </td>
                          <td className="p-2.5 font-mono">
                            <div className="flex items-center gap-2">
                              {cs.ps !== "-" && Boolean(cs.ps) ? (
                                <input
                                  type="checkbox"
                                  checked={cs.isChecked}
                                  onChange={() => handleToggleCharCheck(cs.character)}
                                  className="rounded text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                                />
                              ) : null}
                              {cs.ps !== "-" ? (
                                <button
                                  type="button"
                                  onClick={() => handlePitchClick(cs.character, cs.firstTimingRaw || cs.firstTiming)}
                                  className="text-xs px-2 py-0.5 rounded bg-secondary font-mono font-bold hover:bg-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-2xs inline-flex items-center gap-1"
                                  title={`Click to view script, filter by "${cs.character}", and copy first timing (${cs.firstTimingRaw ? formatToFullTimecode(cs.firstTimingRaw) : "00:00:00:00"})`}
                                >
                                  <span>{cs.ps}</span>
                                </button>
                              ) : (
                                <span className="text-gray-300">-</span>
                              )}
                            </div>
                          </td>
                          <td className="p-2.5 font-bold text-foreground">
                            <div className="flex items-center gap-1.5 group">
                              <span>{cs.character}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyCharName(cs.character)}
                                className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors cursor-pointer opacity-70 group-hover:opacity-100"
                                title={`Copy "${cs.character}"`}
                              >
                                {copiedCharName === cs.character ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="p-2.5 text-center font-bold font-mono text-xs text-primary bg-primary/5">
                            {cs.linesCount}
                          </td>
                          <td className="p-2.5 font-medium text-emerald-700">
                            {cs.actor}
                          </td>
                          <td className="p-2.5 font-mono text-[11px] text-muted-foreground">
                            {cs.episodesList || "None"}
                          </td>
                          {isSingleEpisodeCard && (
                            <td className="p-2.5 whitespace-nowrap font-mono text-xs">
                              {cs.firstTiming && cs.firstTiming !== "-" ? (
                                cs.firstLineId ? (
                                  <button
                                    type="button"
                                    onClick={() => handleNavigateToScriptLine(cs.firstLineId!)}
                                    className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-2xs inline-flex items-center gap-1"
                                    title="Click to view first dialogue in Script tab"
                                  >
                                    <Clock className="w-3 h-3 text-muted-foreground" />
                                    <span>{cs.firstTiming}</span>
                                  </button>
                                ) : (
                                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold inline-block">
                                    {cs.firstTiming}
                                  </span>
                                )
                              ) : (
                                <span className="text-muted-foreground/50 italic">-</span>
                              )}
                            </td>
                          )}
                          <td className="p-2.5 text-right pr-3">
                            <div className="flex items-center justify-end gap-2">
                              <span
                                className={`text-[10px] font-mono flex items-center gap-1.5 px-2 py-1 rounded border font-medium ${
                                  isBeluman
                                    ? "bg-red-50/60 text-red-700 border-red-200"
                                    : "bg-emerald-50/60 text-emerald-700 border-emerald-200"
                                }`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                    isBeluman ? "bg-red-500" : "bg-emerald-500"
                                  }`}
                                />
                                <b>{cs.inputtedLinesCount}</b>/<b>{cs.linesCount}</b> In
                              </span>
                            <div className={`relative inline-block text-left ${openActionDropdown === cs.character ? "z-40" : ""}`}>
                              <button
                                type="button"
                                onClick={() => setOpenActionDropdown(openActionDropdown === cs.character ? null : cs.character)}
                                className="h-7 px-2.5 text-[11px] font-semibold bg-background hover:bg-muted/80 text-foreground border border-border rounded-md shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors active:scale-95"
                              >
                                <span>Set Status</span>
                                <ChevronDown className="w-3 h-3 text-muted-foreground" />
                              </button>

                              {openActionDropdown === cs.character && (
                                <>
                                  <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setOpenActionDropdown(null)}
                                  />
                                  <div
                                    className={`absolute right-0 ${
                                      idx >= activeCharacterSummaries.length - 3 && idx >= 3 ? "bottom-full mb-1" : "top-full mt-1"
                                    } z-50 w-36 bg-popover border border-border rounded-lg shadow-xl p-1 space-y-0.5 animate-in fade-in zoom-in-95 duration-100 text-left`}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleBatchUpdateCharacterStatus(cs.character, "Inputted")
                                        setOpenActionDropdown(null)
                                      }}
                                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-medium text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-md transition-colors cursor-pointer"
                                    >
                                      <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                                      Inputted
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleBatchUpdateCharacterStatus(cs.character, "Beluman")
                                        setOpenActionDropdown(null)
                                      }}
                                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors cursor-pointer"
                                    >
                                      <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                                      Beluman
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleBatchUpdateCharacterStatus(cs.character, "Broken")
                                        setOpenActionDropdown(null)
                                      }}
                                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-md transition-colors cursor-pointer"
                                    >
                                      <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                                      Broken
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )})}
                    {activeCharacterSummaries.length === 0 && (
                      <tr>
                        <td colSpan={isSingleEpisodeCard ? 9 : 8} className="p-8 text-center text-muted-foreground">
                          No active characters with lines.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Collapsible Section for 0 Line Characters */}
                {unusedCharacterSummaries.length > 0 && (
                  <div className="border rounded-lg overflow-hidden bg-card">
                    <button
                      onClick={() => setIsUnusedExpanded(!isUnusedExpanded)}
                      className="w-full p-3 bg-muted/40 hover:bg-muted flex items-center justify-between text-xs font-semibold text-muted-foreground transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span>Unused Characters ({unusedCharacterSummaries.length})</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary font-medium">
                          0 Lines in script
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-primary">
                        {isUnusedExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        <span>{isUnusedExpanded ? "Hide Unused" : "Show Unused Characters"}</span>
                      </div>
                    </button>

                    {isUnusedExpanded && (
                      <div className="border-t divide-y">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead className="bg-muted/60 text-muted-foreground text-[11px]">
                            <tr>
                              <th className="p-2.5 w-16 text-center text-muted-foreground font-semibold">
                                <div className="flex items-center justify-center gap-1.5">
                                  <input
                                    type="checkbox"
                                    checked={
                                      unusedCharacterSummaries.length > 0 &&
                                      unusedCharacterSummaries.every((cs) => !!uiCheckedRows[`unused_${cs.character}`])
                                    }
                                    onChange={(e) => {
                                      const isChecked = e.target.checked
                                      const updated = { ...uiCheckedRows }
                                      unusedCharacterSummaries.forEach((cs) => {
                                        updated[`unused_${cs.character}`] = isChecked
                                      })
                                      setUiCheckedRows(updated)
                                    }}
                                    className="rounded text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer accent-primary"
                                  />
                                  <span>No.</span>
                                </div>
                              </th>
                              <th className="p-2.5 w-24">PS</th>
                              <th className="p-2.5">Character</th>
                              <th className="p-2.5 w-28 text-center">Count</th>
                              <th className="p-2.5">Actor</th>
                              <th className="p-2.5">Appear in</th>
                              {isSingleEpisodeCard && (
                                <th className="p-2.5 w-28 whitespace-nowrap">First Timing</th>
                              )}
                              <th className="p-2.5 w-64 text-right pr-3">Status Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y opacity-75">
                            {unusedCharacterSummaries.map((cs, idx) => (
                              <tr key={idx} className="hover:bg-muted/20">
                                <td className="p-2.5 text-center font-mono text-xs text-muted-foreground font-semibold whitespace-nowrap">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <input
                                      type="checkbox"
                                      checked={!!uiCheckedRows[`unused_${cs.character}`]}
                                      onChange={() => toggleUiRowCheck(`unused_${cs.character}`)}
                                      className="rounded text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer accent-primary"
                                    />
                                    <span>{idx + 1}</span>
                                  </div>
                                </td>
                                <td className="p-2.5 font-mono">
                                  <div className="flex items-center gap-2">
                                    {cs.ps !== "-" && Boolean(cs.ps) ? (
                                      <input
                                        type="checkbox"
                                        checked={cs.isChecked}
                                        onChange={() => handleToggleCharCheck(cs.character)}
                                        className="rounded text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                                      />
                                    ) : null}
                                    {cs.ps !== "-" ? (
                                      <button
                                        type="button"
                                        onClick={() => handlePitchClick(cs.character, cs.firstTimingRaw || cs.firstTiming)}
                                        className="text-xs px-2 py-0.5 rounded bg-secondary font-mono font-bold hover:bg-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-2xs"
                                        title={`Click to view script, filter by "${cs.character}", and copy first timing (${cs.firstTimingRaw ? formatToFullTimecode(cs.firstTimingRaw) : "00:00:00:00"})`}
                                      >
                                        {cs.ps}
                                      </button>
                                    ) : (
                                      <span className="text-gray-300">-</span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-2.5 font-medium text-muted-foreground">
                                  <div className="flex items-center gap-1.5 group">
                                    <span>{cs.character}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyCharName(cs.character)}
                                      className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors cursor-pointer opacity-70 group-hover:opacity-100"
                                      title={`Copy "${cs.character}"`}
                                    >
                                      {copiedCharName === cs.character ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>
                                </td>
                                <td className="p-2.5 text-center font-mono text-muted-foreground">0</td>
                                <td className="p-2.5 text-muted-foreground">{cs.actor}</td>
                                <td className="p-2.5 font-mono text-muted-foreground">-</td>
                                {isSingleEpisodeCard && (
                                  <td className="p-2.5 font-mono text-muted-foreground italic text-xs">-</td>
                                )}
                                <td className="p-2.5 font-mono text-muted-foreground text-right pr-3">-</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: EPISODE CHARACTER */}
          {activeTab === "episodes" && (
            <div className="flex-1 flex flex-col overflow-hidden space-y-3">
              <div className="flex items-center justify-between bg-indigo-50/50 border border-indigo-100 p-2.5 rounded-lg text-xs">
                <span className="text-indigo-950 font-medium flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Showing <b>{episodeCharacterSummaries.length}</b> episodes with character list sorted by line count (highest to lowest).
                </span>
              </div>

              <div className="flex-1 overflow-auto border rounded-lg bg-card">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="sticky top-0 bg-muted font-semibold text-muted-foreground border-b z-10">
                    <tr>
                      <th className="p-2.5 w-16 text-center">Eps</th>
                      <th className="p-2.5 w-28 text-center">Char Count</th>
                      <th className="p-2.5">Character List (Highest Line Count First)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {episodeCharacterSummaries.map((ep, idx) => (
                      <tr key={idx} className="hover:bg-muted/30 transition-colors">
                        <td className="p-2.5 text-center font-bold font-mono text-sm text-foreground border-r">
                          {ep.eps}
                        </td>
                        <td className="p-2.5 text-center font-extrabold font-mono text-sm text-indigo-600 border-r bg-indigo-50/20">
                          {ep.charactersCount}
                        </td>
                        <td className="p-2.5">
                          <div className="space-y-1.5">
                            <div className="font-semibold text-foreground text-[12px] leading-relaxed">
                              {ep.characterNamesList}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              {ep.charactersInEp.map((c, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-[11px] font-medium border border-border"
                                >
                                  <span>{c.character}</span>
                                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1 rounded">
                                    {c.count}
                                  </span>
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {episodeCharacterSummaries.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-12 text-center text-muted-foreground">
                          No episode script data found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: AUTO-GENERATED VOA MISSING AUDIO REPORT */}
          {activeTab === "report" && (
            <div className="flex-1 flex flex-col overflow-hidden space-y-3">
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs">
                <div className="flex items-center gap-2 text-amber-900">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>
                    Auto-generated <b>{missingReports.length}</b> missing VOA audio report entries for lines marked <b>Beluman</b>.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsResetVoaModalOpen(true)}
                    className="h-8 px-3 text-xs bg-red-50 hover:bg-red-100 text-red-700 font-semibold border border-red-200 rounded-md transition-colors flex items-center gap-1.5 active:scale-95 cursor-pointer"
                    title="Reset all VOA report lines and clear the report list"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset All VOA Report
                  </button>
                  <button
                    onClick={handleCopyReport}
                    disabled={missingReports.length === 0}
                    className="h-8 px-3 text-xs bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {copiedReport ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied to Clipboard!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy All Report Lines
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto border rounded-lg bg-card">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="sticky top-0 bg-muted font-semibold text-muted-foreground border-b z-10">
                    <tr>
                      <th className="p-2.5 w-10 text-center">✓</th>
                      <th className="p-2.5 w-28">Status</th>
                      <th className="p-2.5 w-32">Artist</th>
                      <th className="p-2.5 w-24">EPS</th>
                      <th className="p-2.5 w-36">Start Timing</th>
                      <th className="p-2.5 w-36">Batch Timing</th>
                      <th className="p-2.5">Auto-Generated VOA Report String</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-mono text-[11px]">
                    {missingReports.map((item, idx) => (
                      <tr key={idx} className={`hover:bg-muted/30 transition-colors ${item.isResolved ? "bg-emerald-50/20" : ""}`}>
                        <td className="p-2.5 text-center">
                          <input
                            type="checkbox"
                            checked={item.isResolved}
                            onChange={() => handleToggleVoReportCheck(item.groupKey)}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                            title={item.isResolved ? "Mark as unresolved" : "Mark as resolved"}
                          />
                        </td>
                        <td className="p-2.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              type="button"
                              onClick={() => handleNavigateToScriptLine(item.firstLineId)}
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold border cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-2xs flex items-center gap-1 ${
                                STATUS_STYLE_MAP[item.status]?.bg || "bg-gray-100"
                              } ${STATUS_STYLE_MAP[item.status]?.text || "text-gray-800"} ${
                                STATUS_STYLE_MAP[item.status]?.border || "border-gray-200"
                              } ${item.isResolved ? "line-through opacity-60" : ""}`}
                              title="Click to switch to Script tab & scroll to line"
                            >
                              <span>{item.status}</span>
                            </button>
                            {item.isResolved && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600" /> Resolved
                              </span>
                            )}
                          </div>
                        </td>
                        <td className={`p-2.5 font-bold text-xs ${item.isResolved ? "line-through text-muted-foreground/60" : "text-foreground"}`}>
                          {item.character}
                        </td>
                        <td className="p-2.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 font-mono font-bold text-[11px] inline-block ${item.isResolved ? "opacity-50 line-through" : ""}`}>
                            {item.epsFormattedRange}
                          </span>
                        </td>
                        <td className="p-2.5 whitespace-nowrap">
                          {item.startTimeFormatted !== "-" ? (
                            <span className={`px-2 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 font-sans font-bold text-[11px] inline-block shadow-2xs ${item.isResolved ? "opacity-50 line-through" : ""}`}>
                              {item.startTimeFormatted}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/50 font-sans text-xs">-</span>
                          )}
                        </td>
                        <td className="p-2.5 whitespace-nowrap">
                          {item.batchTimeFormatted !== "-" ? (
                            <span className={`px-2 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 font-sans font-bold text-[11px] inline-block shadow-2xs ${item.isResolved ? "opacity-50 line-through" : ""}`}>
                              {item.batchTimeFormatted}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/50 font-sans text-xs">-</span>
                          )}
                        </td>
                        <td className="p-2.5 font-medium text-foreground">
                          <div className="flex items-center justify-between gap-2 group">
                            <span className={`select-all font-mono text-xs ${item.isResolved ? "line-through text-muted-foreground/60" : ""}`}>
                              {item.reportString}
                            </span>
                            <button
                              onClick={() => handleCopySingleReportLine(item.reportString, idx)}
                              className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded transition-colors flex-shrink-0 cursor-pointer"
                              title="Copy this report line"
                            >
                              {copiedRowIndex === idx ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {missingReports.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-muted-foreground font-sans">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                          <p className="font-semibold text-foreground">No Missing VOA Audio Files!</p>
                          <p className="text-xs mt-1">All script lines are marked as Inputted.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal for Single Column PS Paste */}
        {isPsModalOpen && (
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
                  onClick={() => setIsPsModalOpen(false)}
                  className="p-1 rounded text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                Copy a single column of PS numbers from Google Sheets (e.g. 0.97, 1.04, 0.98) and paste below to update characters row by row.
              </p>

              <textarea
                placeholder={`0.97\n1.04\n0.98\n0.92`}
                value={psPasteText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPsPasteText(e.target.value)}
                className="w-full font-mono text-xs h-36 p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  onClick={() => setIsPsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplySingleColumnPs}
                  className="px-4 py-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md transition-colors"
                >
                  Apply PS Values
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Single Column VO Error Notes Paste */}
        {isVoErrorModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background border border-border rounded-xl shadow-2xl max-w-md w-full p-5 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-600" />
                  <h3 className="text-sm font-bold text-foreground">
                    Paste VO Error Notes Column
                  </h3>
                </div>
                <button
                  onClick={() => setIsVoErrorModalOpen(false)}
                  className="p-1 rounded text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                Copy a single column of VO Error notes from Google Sheets (e.g. wrong pronunciation / ewig) and paste below to update lines in order. Non-empty notes will automatically set line status to VO Error.
              </p>

              <textarea
                placeholder={`wrong pronunciation / ewig\nwrong pronunciation / fleisch`}
                value={voErrorPasteText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setVoErrorPasteText(e.target.value)}
                className="w-full font-mono text-xs h-36 p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  onClick={() => setIsVoErrorModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplySingleColumnVoError}
                  className="px-4 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
                >
                  Apply VO Error Notes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Wrong Cast Character Selection */}
        {wrongCastModal.isOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background border border-border rounded-xl shadow-2xl p-5 w-full max-w-4xl flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-600" />
                    Select Correct Character for Wrong Cast
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Line for <b className="text-foreground font-semibold">{wrongCastModal.currentCharacter}</b> was assigned to the wrong cast. Pick the correct intended character:
                  </p>
                </div>
                <button
                  onClick={() => setWrongCastModal({ isOpen: false, currentCharacter: "" })}
                  className="p-1 text-muted-foreground hover:text-foreground rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 7 Rows X N Columns Grid */}
              <div className="p-3 bg-muted/20 border rounded-lg overflow-x-auto max-w-full">
                <div className="grid grid-rows-7 grid-flow-col gap-1.5 min-w-max">
                  {wrongCastCharacterOptions.map((item, idx) => {
                    const isUnused = item.lineCount === 0
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectWrongCastCharacter(item.characterName)}
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
                  onClick={() => setWrongCastModal({ isOpen: false, currentCharacter: "" })}
                  className="px-4 py-2 text-xs font-medium border rounded-md hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Modal Confirmation for Resetting All VOA Reports */}
        {isResetVoaModalOpen && (
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

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  onClick={() => setIsResetVoaModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmResetVoaReport}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Confirm Reset All
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Modal for Editing 3 Timings */}
        {editTimingModal.isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-sm p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-sm text-foreground">Edit Line Timing</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditTimingModal({ isOpen: false, lineId: "", startTime: "", endTime: "", batchTime: "" })}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <TimeStepperInput
                  label="Start Time"
                  value={editTimingModal.startTime}
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
                  value={editTimingModal.endTime}
                  onChange={(val) => setEditTimingModal({ ...editTimingModal, endTime: val })}
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
                    value={editTimingModal.batchTime}
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
                  onClick={() => setEditTimingModal({ isOpen: false, lineId: "", startTime: "", endTime: "", batchTime: "" })}
                  className="px-3.5 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditTiming}
                  className="px-4 py-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-md shadow-sm transition-colors cursor-pointer"
                >
                  Save Timing
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Adding Line */}
        {addLineModal.isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-md p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-sm text-foreground">
                    {addLineModal.position === "before" ? "Add Line Before" : "Add Line After"}
                  </h3>
                  {addLineModal.afterEps && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary font-mono text-muted-foreground">
                      EP {addLineModal.afterEps.padStart(3, "0")}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setAddLineModal({ isOpen: false, position: "after", refLineId: "", afterEps: "", character: "", lineText: "", status: "Inputted", startTime: "", endTime: "", batchTime: "" })}
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
                      onClick={() => setIsAddLineCharSelectOpen(!isAddLineCharSelectOpen)}
                      className="w-full h-9 px-3 text-xs rounded-md border border-input bg-background text-foreground hover:bg-muted/50 flex items-center justify-between font-medium cursor-pointer transition-colors shadow-2xs"
                    >
                      <span className={addLineModal.character ? "font-bold text-foreground" : "text-muted-foreground"}>
                        {addLineModal.character || "Select Character..."}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    </button>

                    {isAddLineCharSelectOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-50"
                          onClick={() => setIsAddLineCharSelectOpen(false)}
                        />
                        <div className="absolute left-0 right-0 top-full mt-1 z-55 bg-popover border border-border rounded-lg shadow-2xl p-1.5 flex flex-col space-y-1.5 animate-in fade-in zoom-in-95 duration-100 text-left">
                          <div className="relative p-0.5">
                            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
                            <input
                              type="text"
                              placeholder="Search character..."
                              value={addLineCharSearchQuery}
                              onChange={(e) => setAddLineCharSearchQuery(e.target.value)}
                              className="w-full h-7 pl-7 pr-6 text-xs rounded border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                              autoFocus
                            />
                            {addLineCharSearchQuery && (
                              <button
                                type="button"
                                onClick={() => setAddLineCharSearchQuery("")}
                                className="absolute right-2 top-2 p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors cursor-pointer"
                                title="Clear search"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <div className="overflow-y-auto space-y-0.5 max-h-48 pr-0.5">
                            {filteredAddLineCharacters.map((charName) => {
                              const isSelected = addLineModal.character === charName
                              return (
                                <button
                                  key={charName}
                                  type="button"
                                  onClick={() => {
                                    setAddLineModal({ ...addLineModal, character: charName })
                                    setIsAddLineCharSelectOpen(false)
                                    setAddLineCharSearchQuery("")
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
                            {filteredAddLineCharacters.length === 0 && (
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
                    value={addLineModal.status || "Inputted"}
                    onChange={(e) => setAddLineModal({ ...addLineModal, status: e.target.value as ScriptLineStatus })}
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
                    value={addLineModal.startTime || ""}
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
                    value={addLineModal.endTime || ""}
                    onChange={(val) => setAddLineModal({ ...addLineModal, endTime: val })}
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
                      value={addLineModal.batchTime || ""}
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
                    value={addLineModal.lineText}
                    onChange={(e) => setAddLineModal({ ...addLineModal, lineText: e.target.value })}
                    className="w-full min-h-[80px] p-3 text-xs font-mono rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t pt-3">
                <button
                  type="button"
                  onClick={() => setAddLineModal({ isOpen: false, position: "after", refLineId: "", afterEps: "", character: "", lineText: "", status: "Inputted", startTime: "", endTime: "", batchTime: "" })}
                  className="px-3.5 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!addLineModal.character || !addLineModal.lineText.trim()}
                  onClick={handleSaveAddLine}
                  className="px-4 py-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 rounded-md shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Editing Master VO Artist */}
        {editArtistModal.isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-sm p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-sm text-foreground">Change VO Artist</h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditArtistModal({
                      isOpen: false,
                      characterName: "",
                      currentArtist: "",
                      newArtist: "",
                    })
                  }
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
                    {editArtistModal.characterName}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    VO Artist Name
                  </label>
                  <input
                    type="text"
                    value={editArtistModal.newArtist}
                    onChange={(e) =>
                      setEditArtistModal((prev) => ({ ...prev, newArtist: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleSaveVoArtist()
                      }
                      if (e.key === "Escape") {
                        setEditArtistModal({
                          isOpen: false,
                          characterName: "",
                          currentArtist: "",
                          newArtist: "",
                        })
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
                  onClick={() =>
                    setEditArtistModal({
                      isOpen: false,
                      characterName: "",
                      currentArtist: "",
                      newArtist: "",
                    })
                  }
                  className="px-3 py-1.5 text-xs font-semibold rounded-md border border-border hover:bg-muted text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveVoArtist}
                  disabled={!editArtistModal.newArtist.trim()}
                  className="px-4 py-1.5 text-xs font-bold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
