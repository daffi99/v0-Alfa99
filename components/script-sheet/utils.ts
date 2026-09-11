import { type ScriptLine, type ScriptLineStatus } from "../script-wizard-modal"

export const SCRIPT_LINE_STATUSES: ScriptLineStatus[] = [
  "Beluman",
  "Inputted",
  "Not used",
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
  "Not used": { label: "Not used", bg: "bg-slate-200 dark:bg-slate-700", text: "text-slate-700 dark:text-slate-200", border: "border-slate-300 dark:border-slate-600" },
  "Not Used": { label: "Not used", bg: "bg-slate-200 dark:bg-slate-700", text: "text-slate-700 dark:text-slate-200", border: "border-slate-300 dark:border-slate-600" },
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
    return `${pad(parts[0])}:${pad(parts[1])}:${pad(parts[2])}:${pad(parts[3])}`
  }
  if (parts.length === 3) {
    if (hasMsOrFrame) {
      return `00:${pad(parts[0])}:${pad(parts[1])}:${pad(parts[2])}`
    }
    return `${pad(parts[0])}:${pad(parts[1])}:${pad(parts[2])}:00`
  }
  if (parts.length === 2) {
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
  Inputted: null,
  "Not used": null,
}

export function formatReportTitle(title: string): string {
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
export { TimeStepperInput } from "./time-stepper-input"
