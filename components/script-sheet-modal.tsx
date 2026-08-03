"use client"

import React, { useState, useMemo } from "react"
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
} from "lucide-react"
import type { ScriptData, ScriptLine, MasterArtistMapping, ScriptLineStatus } from "./script-wizard-modal"

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
]

export const STATUS_STYLE_MAP: Record<
  ScriptLineStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  Beluman: { label: "Beluman", bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
  Inputted: { label: "Inputted", bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-200" },
  Missing: { label: "Missing", bg: "bg-red-700", text: "text-white", border: "border-red-800" },
  Broken: { label: "Broken", bg: "bg-purple-700", text: "text-white", border: "border-purple-800" },
  "VO Error": { label: "VO Error", bg: "bg-amber-200", text: "text-amber-900", border: "border-amber-300" },
  "Need Pauses": { label: "Need Pauses", bg: "bg-sky-200", text: "text-sky-900", border: "border-sky-300" },
  "Wrong Cast": { label: "Wrong Cast", bg: "bg-amber-900", text: "text-amber-100", border: "border-amber-950" },
  "Too Short": { label: "Too Short", bg: "bg-teal-800", text: "text-white", border: "border-teal-900" },
  "Too Long": { label: "Too Long", bg: "bg-indigo-900", text: "text-white", border: "border-indigo-950" },
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
  Inputted: null, // Inputted lines do not create VOA report lines
}

export function formatReportTitle(title: string): string {
  // Format title: add "_" between Name and Number, e.g. "Germany 090 (120)" -> "Germany_090 (120)"
  return title.trim().replace(/([a-zA-Z]+)\s+(\d+)/g, "$1_$2")
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
}: ScriptSheetModalProps) {
  const [activeTab, setActiveTab] = useState<"lines" | "master" | "summary" | "episodes" | "report">("lines")
  const [data, setData] = useState<ScriptData>(scriptData)
  const [localProgress, setLocalProgress] = useState<Record<string, any>>(taskProgress || {})
  const [isProgressExpanded, setIsProgressExpanded] = useState(true)

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

  const captionSubStepsCompletedCount =
    prepCompletedCount + checkVoCompletedCount + editingCompletedCount + captionEditCompletedCount

  // Condition: VO Error Note column and paste modal are active for Caption type cards
  const isCaptionTask =
    taskCategory === "Caption" ||
    (!taskCategory && (taskTitle ? taskTitle.toLowerCase().includes("caption") : true)) ||
    taskCategory === undefined

  // Tab 1 Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCharacterFilter, setSelectedCharacterFilter] = useState("all")
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all")

  // Copy indicator state
  const [copiedReport, setCopiedReport] = useState(false)
  const [copiedRowIndex, setCopiedRowIndex] = useState<number | null>(null)

  // Copy single VOA Report line
  const handleCopySingleReportLine = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedRowIndex(idx)
    setTimeout(() => setCopiedRowIndex(null), 2000)
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

  // Generate character color mapping
  const characterColors = useMemo(() => {
    const map: Record<string, string> = {}
    const chars = Array.from(
      new Set(data.lines.map((l) => l.character).filter(Boolean))
    )
    chars.forEach((char, idx) => {
      map[char] = CHARACTER_COLOR_PALETTE[idx % CHARACTER_COLOR_PALETTE.length]
    })
    return map
  }, [data.lines])

  // Update Data Handler
  const updateData = (newData: ScriptData) => {
    setData(newData)
    onSave(newData)
  }

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
      const matchesStatus =
        selectedStatusFilter === "all" ||
        line.status === selectedStatusFilter
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
        episodesSet: Set<string>
      }
    >()

    // Initialize map with all master artists
    data.masterArtists.forEach((ma) => {
      summaryMap.set(ma.characterName.toLowerCase(), {
        character: ma.characterName,
        actor: ma.finalArtist,
        ps: ma.pitchSpeed || "-",
        linesCount: 0,
        inputtedLinesCount: 0,
        belumanLinesCount: 0,
        episodesSet: new Set<string>(),
      })
    })

    // Count line occurrences
    data.lines.forEach((line) => {
      if (!line.character) return
      const charKey = line.character.trim().toLowerCase()
      if (!summaryMap.has(charKey)) {
        summaryMap.set(charKey, {
          character: line.character,
          actor: "Unassigned",
          ps: "-",
          linesCount: 0,
          inputtedLinesCount: 0,
          belumanLinesCount: 0,
          episodesSet: new Set<string>(),
        })
      }
      const entry = summaryMap.get(charKey)!
      entry.linesCount += 1
      if (line.status === "Inputted") {
        entry.inputtedLinesCount += 1
      } else {
        entry.belumanLinesCount += 1
      }
      if (line.eps) {
        entry.episodesSet.add(line.eps.trim())
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
        episodesList: sortedEps.join(", "),
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

  // Unused characters (with 0 lines)
  const unusedCharacterSummaries = useMemo(() => {
    return characterSummaries.filter((cs) => cs.linesCount === 0)
  }, [characterSummaries])

  // Episode Character Summary Calculation (Tab 4)
  const episodeCharacterSummaries = useMemo(() => {
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
        }))
        .sort((a, b) => b.count - a.count)

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

  // VOA Missing / Issue Audio Report Lines Calculation (Tab 5)
  const missingReports = useMemo(() => {
    const masterMap = new Map<string, string>()
    data.masterArtists.forEach((ma) => {
      masterMap.set(ma.characterName.toLowerCase(), ma.finalArtist)
    })

    const formattedTitle = formatReportTitle(taskTitle)

    // Group lines by target character & status (skip Inputted lines)
    const charStatusMap = new Map<
      string,
      {
        character: string
        status: ScriptLineStatus
        epsSet: Set<string>
      }
    >()

    data.lines.forEach((line) => {
      const suffix = STATUS_REPORT_SUFFIX_MAP[line.status]
      if (!suffix || !line.character || line.status === "Inputted") return

      const targetChar =
        line.status === "Wrong Cast" && line.correctCharacter
          ? line.correctCharacter.trim()
          : line.character.trim()

      const groupKey = `${targetChar.toLowerCase()}__${line.status}`

      if (!charStatusMap.has(groupKey)) {
        charStatusMap.set(groupKey, {
          character: targetChar,
          status: line.status,
          epsSet: new Set<string>(),
        })
      }

      if (line.eps) {
        charStatusMap.get(groupKey)!.epsSet.add(line.eps.trim())
      }
    })

    const reports: Array<{
      groupKey: string
      status: ScriptLineStatus
      epsJoined: string
      character: string
      actor: string
      reportString: string
      epSummary: string
      minEps: number
      isResolved: boolean
    }> = []

    charStatusMap.forEach(({ character, status, epsSet }, groupKey) => {
      const actor = masterMap.get(character.toLowerCase()) || "Unassigned"
      const suffix = STATUS_REPORT_SUFFIX_MAP[status] || ""
      const sortedEps = Array.from(epsSet)
        .sort((a, b) => Number(a) - Number(b))
        .map((e) => e.padStart(3, "0"))

      const epsJoined = sortedEps.length > 0 ? sortedEps.join(", ") : "000"
      const minEps = sortedEps.length > 0 ? Number(sortedEps[0]) : 0

      const reportString = `${formattedTitle}_${epsJoined}_${character}/${actor}${suffix}`
      const epSummary = `EP${epsJoined} ${character}/${actor}`

      reports.push({
        groupKey,
        status,
        epsJoined,
        character,
        actor,
        reportString,
        epSummary,
        minEps,
        isResolved: false,
      })
    })

    return reports.sort((a, b) => a.minEps - b.minEps)
  }, [data.lines, data.masterArtists, taskTitle])

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

    const psLines = psPasteText
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((v) => v.trim())

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

  // Single Column VO Error Data Update - preserving line index mapping
  const handleApplySingleColumnVoError = () => {
    if (!voErrorPasteText) return

    const voLines = voErrorPasteText
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((v) => v.trim())

    if (voLines.length === 0) return

    const updatedLines = data.lines.map((line, idx) => {
      if (idx < voLines.length) {
        const val = voLines[idx]
        const cleanNote =
          val && val !== "-" && val.toLowerCase() !== "null" && val.toLowerCase() !== "undefined"
            ? val
            : undefined

        let newStatus = line.status
        if (cleanNote) {
          newStatus = "VO Error" as ScriptLineStatus
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
        } else if (l.status === "VO Error" && (!cleanNote || cleanNote.trim() === "")) {
          newStatus = "Beluman" as ScriptLineStatus
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

  // Batch update line status for a specific character across all script lines (Inputted or Beluman)
  const handleBatchUpdateCharacterStatus = (charName: string, newStatus: "Inputted" | "Beluman") => {
    const targetName = charName.trim().toLowerCase()
    const updatedLines = data.lines.map((line) => {
      if (line.character && line.character.trim().toLowerCase() === targetName) {
        return { ...line, status: newStatus }
      }
      return line
    })
    updateData({ ...data, lines: updatedLines })
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-5xl w-[95vw] h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
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

        {/* Workflow Progress Checklist Panel (Caption Cards) */}
        {isCaptionTask && (
          <div className="bg-muted/20 border-b py-1.5 px-3 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] font-bold text-foreground tracking-wide">
                  Workflow Progress Steps
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300/60">
                  {captionSubStepsCompletedCount} / 11 Done
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
              <div className="grid grid-cols-1 sm:grid-cols-[1.3fr_auto_1.8fr_1.8fr] gap-2.5 bg-card p-2 rounded-md border text-[10px] mt-1.5 shadow-2xs">
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

                {/* Group 4: Caption Edit (2 lines) */}
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
            <BarChart3 className="w-3.5 h-3.5" /> Character Summary
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
            <Layers className="w-3.5 h-3.5 text-indigo-500" /> Episode Character ({episodeCharacterSummaries.length})
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
              <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/30 p-2.5 rounded-lg border text-xs">
                <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search script lines or characters..."
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      className="w-full h-8 text-xs pl-8 pr-3 bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <select
                    value={selectedCharacterFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCharacterFilter(e.target.value)}
                    className="h-8 text-xs px-2 bg-background border border-input rounded-md focus:outline-none"
                  >
                    <option value="all">All Characters</option>
                    {Array.from(new Set(data.lines.map((l) => l.character))).map(
                      (char) => (
                        <option key={char} value={char}>
                          {char}
                        </option>
                      )
                    )}
                  </select>
                  <select
                    value={selectedStatusFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatusFilter(e.target.value)}
                    className="h-8 text-xs px-2 bg-background border border-input rounded-md focus:outline-none font-medium"
                  >
                    <option value="all">All Statuses ({totalLines})</option>
                    {SCRIPT_LINE_STATUSES.map((st) => {
                      const count = data.lines.filter((l) => l.status === st).length
                      return (
                        <option key={st} value={st}>
                          {st} ({count})
                        </option>
                      )
                    })}
                  </select>
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

              <div className="flex-1 overflow-auto border rounded-lg">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="sticky top-0 bg-muted font-semibold text-muted-foreground border-b z-10">
                    <tr>
                      <th className="p-2 w-10 text-center">Eps</th>
                      <th className="p-2 w-16 text-center">Start</th>
                      <th className="p-2 w-16 text-center">End</th>
                      <th className="p-2 w-16 text-center">Batch</th>
                      <th className="p-2 w-16">Character</th>
                      <th className="p-2">Script file (Lines)</th>
                      {isCaptionTask && (
                        <th className="p-2 w-28 text-red-600 font-semibold text-[10px]">VO Error Note</th>
                      )}
                      <th className="p-2 w-24 text-center">Status</th>
                      <th className="p-2 w-10 text-center">Action</th>
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
                            .replace(/\\N/gi, " ")
                            .replace(/[\r\n]+/g, " ")
                            .replace(/\s+/g, " ")
                            .trim()
                        : ""

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
                          <tr
                            className={`hover:bg-muted/40 transition-colors ${
                              characterColors[line.character] || ""
                            }`}
                          >
                            <td className="p-2 text-center border-r font-mono text-[11px] font-bold">
                              {line.eps ? line.eps.trim().padStart(3, "0") : "-"}
                            </td>
                            <td className="p-2 text-center border-r font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                              {line.startTime || "-"}
                            </td>
                            <td className="p-2 text-center border-r font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                              {line.endTime || "-"}
                            </td>
                            <td className="p-2 text-center border-r font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                              {line.batchTime || "-"}
                            </td>
                            <td className="p-2 border-r font-semibold text-[10px] whitespace-nowrap truncate max-w-[80px]" title={line.character}>
                              {line.character}
                            </td>
                            <td className="p-2 border-r whitespace-nowrap overflow-hidden text-ellipsis leading-relaxed font-medium">
                              {displayLineText}
                            </td>
                            {isCaptionTask && (
                              <td className="p-2 border-r text-[10px] text-red-600 font-semibold">
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
                              <select
                                value={line.status}
                                onChange={(e) => handleUpdateLineStatus(line.id, e.target.value as ScriptLineStatus)}
                                className={`h-5 text-[10px] px-1.5 rounded-full font-bold transition-all border outline-none cursor-pointer ${
                                  STATUS_STYLE_MAP[line.status]?.bg || "bg-gray-100"
                                } ${STATUS_STYLE_MAP[line.status]?.text || "text-gray-800"} ${
                                  STATUS_STYLE_MAP[line.status]?.border || "border-gray-200"
                                }`}
                              >
                                {SCRIPT_LINE_STATUSES.map((st) => (
                                  <option key={st} value={st} className="bg-background text-foreground font-semibold">
                                    {st}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="p-2 text-center">
                              <button
                                onClick={() => handleDeleteLine(line.id)}
                                className="p-1 rounded text-muted-foreground hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
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
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data.masterArtists.map((ma, idx) => (
                      <tr key={idx} className="hover:bg-muted/40 transition-colors">
                        <td className="p-2.5 font-semibold text-foreground">
                          {ma.characterName}
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
              <div className="flex items-center justify-between bg-muted/30 p-2.5 rounded-lg border text-xs">
                <span className="text-muted-foreground font-medium">
                  Sorted by line count (Highest to Lowest) • {activeCharacterSummaries.length} Active Characters
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCheckAll(true)}
                    className="h-8 px-2.5 text-xs border border-border text-foreground hover:bg-muted font-medium rounded-md transition-colors"
                  >
                    Check All
                  </button>
                  <button
                    onClick={() => handleCheckAll(false)}
                    className="h-8 px-2.5 text-xs border border-border text-foreground hover:bg-muted font-medium rounded-md transition-colors"
                  >
                    Uncheck All
                  </button>
                  <button
                    onClick={() => setIsPsModalOpen(true)}
                    className="h-8 px-3 text-xs border border-border rounded-md hover:bg-muted font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Update Pitch Data (PS)
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto border rounded-lg space-y-4 p-1">
                {/* Active Characters Table */}
                <table className="w-full text-xs text-left border-collapse border rounded-md">
                  <thead className="sticky top-0 bg-muted font-semibold text-muted-foreground border-b z-10">
                    <tr>
                      <th className="p-2.5 w-10 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="checkbox"
                            checked={
                              activeCharacterSummaries.length > 0 &&
                              activeCharacterSummaries.every((cs) => cs.isChecked)
                            }
                            onChange={(e) => handleCheckAll(e.target.checked)}
                            className="rounded text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                            title={
                              activeCharacterSummaries.every((cs) => cs.isChecked)
                                ? "Uncheck All"
                                : "Check All"
                            }
                          />
                        </div>
                      </th>
                      <th className="p-2.5 w-20">PS</th>
                      <th className="p-2.5 w-32">Character</th>
                      <th className="p-2.5 w-20 text-center">Count</th>
                      <th className="p-2.5 w-28">Actor</th>
                      <th className="p-2.5">Appear in</th>
                      <th className="p-2.5 w-64 text-right pr-3">Status Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {activeCharacterSummaries.map((cs, idx) => (
                      <tr
                        key={idx}
                        className={`hover:bg-muted/40 transition-colors ${
                          cs.isChecked ? "bg-emerald-50/30" : ""
                        }`}
                      >
                        <td className="p-2.5 text-center">
                          {cs.ps !== "-" && Boolean(cs.ps) ? (
                            <input
                              type="checkbox"
                              checked={cs.isChecked}
                              onChange={() => handleToggleCharCheck(cs.character)}
                              className="rounded text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                            />
                          ) : null}
                        </td>
                        <td className="p-2.5 font-mono">
                          {cs.ps !== "-" ? (
                            <span className="text-xs px-2 py-0.5 rounded bg-secondary font-mono">
                              {cs.ps}
                            </span>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                        <td className="p-2.5 font-bold text-foreground">
                          {cs.character}
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
                        <td className="p-2.5 text-right pr-3">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-[10px] font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/60">
                              <b className="text-emerald-700">{cs.inputtedLinesCount}</b>/<b className="text-muted-foreground">{cs.linesCount}</b> In
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleBatchUpdateCharacterStatus(cs.character, "Inputted")}
                                className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded transition-all active:scale-95 whitespace-nowrap"
                                title={`Mark all ${cs.linesCount} lines for ${cs.character} as Inputted`}
                              >
                                Inputted
                              </button>
                              <button
                                onClick={() => handleBatchUpdateCharacterStatus(cs.character, "Beluman")}
                                className="px-2 py-0.5 text-[10px] font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded transition-all active:scale-95 whitespace-nowrap"
                                title={`Mark all ${cs.linesCount} lines for ${cs.character} as Beluman`}
                              >
                                Beluman
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {activeCharacterSummaries.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-muted-foreground">
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
                              <th className="p-2.5 w-14 text-center">Check</th>
                              <th className="p-2.5 w-24">PS</th>
                              <th className="p-2.5">Character</th>
                              <th className="p-2.5 w-28 text-center">Count</th>
                              <th className="p-2.5">Actor</th>
                              <th className="p-2.5">Appear in</th>
                              <th className="p-2.5 w-64 text-right pr-3">Status Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y opacity-75">
                            {unusedCharacterSummaries.map((cs, idx) => (
                              <tr key={idx} className="hover:bg-muted/20">
                                <td className="p-2.5 text-center">
                                  {cs.ps !== "-" && Boolean(cs.ps) ? (
                                    <input
                                      type="checkbox"
                                      checked={cs.isChecked}
                                      onChange={() => handleToggleCharCheck(cs.character)}
                                      className="rounded text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                                    />
                                  ) : null}
                                </td>
                                <td className="p-2.5 font-mono">{cs.ps}</td>
                                <td className="p-2.5 font-medium text-muted-foreground">{cs.character}</td>
                                <td className="p-2.5 text-center font-mono text-muted-foreground">0</td>
                                <td className="p-2.5 text-muted-foreground">{cs.actor}</td>
                                <td className="p-2.5 font-mono text-muted-foreground">-</td>
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
                      <th className="p-2.5 w-28">Status</th>
                      <th className="p-2.5 w-36">Artist</th>
                      <th className="p-2.5">Auto-Generated VOA Report String</th>
                      <th className="p-2.5 w-40">EP Summary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-mono text-[11px]">
                    {missingReports.map((item, idx) => (
                      <tr key={idx} className={`hover:bg-muted/30 transition-colors ${item.isResolved ? "bg-emerald-50/20" : ""}`}>
                        <td className="p-2.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                                STATUS_STYLE_MAP[item.status]?.bg || "bg-gray-100"
                              } ${STATUS_STYLE_MAP[item.status]?.text || "text-gray-800"} ${
                                STATUS_STYLE_MAP[item.status]?.border || "border-gray-200"
                              } ${item.isResolved ? "line-through opacity-60" : ""}`}
                            >
                              {item.status}
                            </span>
                            {item.isResolved && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600" /> Resolved
                              </span>
                            )}
                          </div>
                        </td>
                        <td className={`p-2.5 font-semibold ${item.isResolved ? "line-through text-muted-foreground/60" : "text-foreground"}`}>
                          {item.character}
                        </td>
                        <td className="p-2.5 font-medium text-slate-800 bg-muted/20">
                          <div className="flex items-center justify-between gap-2 group">
                            <span className={`select-all font-mono ${item.isResolved ? "line-through text-muted-foreground/60" : ""}`}>
                              {item.reportString}
                            </span>
                            <button
                              onClick={() => handleCopySingleReportLine(item.reportString, idx)}
                              className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded transition-colors flex-shrink-0"
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
                        <td className={`p-2.5 font-bold ${item.isResolved ? "line-through text-emerald-800/50" : "text-emerald-800"}`}>
                          {item.epSummary}
                        </td>
                      </tr>
                    ))}
                    {missingReports.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-muted-foreground font-sans">
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
      </div>
    </div>
  )
}
