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
  Clock,
  X,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import type { ScriptData, ScriptLine, MasterArtistMapping } from "./script-wizard-modal"

interface ScriptSheetModalProps {
  isOpen: boolean
  onClose: () => void
  taskTitle: string
  scriptData: ScriptData
  onSave: (updatedData: ScriptData) => void
  onReRunWizard: () => void
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
  scriptData,
  onSave,
  onReRunWizard,
}: ScriptSheetModalProps) {
  const [activeTab, setActiveTab] = useState<"lines" | "master" | "summary" | "episodes" | "report">("lines")
  const [data, setData] = useState<ScriptData>(scriptData)

  // Tab 1 Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCharacterFilter, setSelectedCharacterFilter] = useState("all")
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all")

  // Copy indicator state
  const [copiedReport, setCopiedReport] = useState(false)

  // Single-Column PS Paste Modal State
  const [isPsModalOpen, setIsPsModalOpen] = useState(false)
  const [psPasteText, setPsPasteText] = useState("")

  // Unused Characters Collapsible Panel State
  const [isUnusedExpanded, setIsUnusedExpanded] = useState(false)

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
    const masterMap = new Map<string, MasterArtistMapping>()
    data.masterArtists.forEach((ma) => {
      masterMap.set(ma.characterName.toLowerCase(), ma)
    })

    const summaryMap = new Map<
      string,
      {
        character: string
        actor: string
        ps: string
        linesCount: number
        episodes: Set<string>
        isChecked: boolean
      }
    >()

    data.lines.forEach((line) => {
      if (!line.character) return
      const key = line.character.trim()
      const keyLower = key.toLowerCase()
      const master = masterMap.get(keyLower)

      if (!summaryMap.has(key)) {
        summaryMap.set(key, {
          character: key,
          actor: master?.finalArtist || "Unassigned",
          ps: master?.pitchSpeed || "-",
          linesCount: 0,
          episodes: new Set<string>(),
          isChecked: data.checkedCharacters?.[key] ?? true,
        })
      }

      const item = summaryMap.get(key)!
      item.linesCount += 1
      if (line.eps) item.episodes.add(line.eps)
    })

    data.masterArtists.forEach((ma) => {
      if (!summaryMap.has(ma.characterName)) {
        summaryMap.set(ma.characterName, {
          character: ma.characterName,
          actor: ma.finalArtist,
          ps: ma.pitchSpeed || "-",
          linesCount: 0,
          episodes: new Set<string>(),
          isChecked: data.checkedCharacters?.[ma.characterName] ?? true,
        })
      }
    })

    return Array.from(summaryMap.values()).map((s) => ({
      ...s,
      episodesList: Array.from(s.episodes)
        .sort((a, b) => Number(a) - Number(b))
        .map((e) => (e.length === 1 ? `0${e}` : e))
        .join(", "),
    }))
  }, [data.lines, data.masterArtists, data.checkedCharacters])

  // Active (linesCount > 0 sorted highest to lowest) & Unused (linesCount === 0 collapsed)
  const { activeCharacterSummaries, unusedCharacterSummaries } = useMemo(() => {
    const active = characterSummaries
      .filter((cs) => cs.linesCount > 0)
      .sort((a, b) => b.linesCount - a.linesCount)

    const unused = characterSummaries
      .filter((cs) => cs.linesCount === 0)
      .sort((a, b) => a.character.localeCompare(b.character))

    return { activeCharacterSummaries: active, unusedCharacterSummaries: unused }
  }, [characterSummaries])

  // Episode Character Summary Calculation (Tab 5)
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

    const masterMap = new Map<string, string>()
    data.masterArtists.forEach((ma) => {
      masterMap.set(ma.characterName.toLowerCase(), ma.finalArtist)
    })

    const episodes = Array.from(epMap.entries()).map(([eps, charCounts]) => {
      // Sort characters in this episode by line count in this episode descending
      const charactersInEp = Array.from(charCounts.entries())
        .map(([character, count]) => ({
          character,
          actor: masterMap.get(character.toLowerCase()) || "Unassigned",
          count,
        }))
        .sort((a, b) => b.count - a.count)

      const formattedEps = eps.length === 1 ? `0${eps}` : eps
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
  }, [data.lines, data.masterArtists])

  // Missing Audio Report Lines Calculation (Tab 4)
  const missingReports = useMemo(() => {
    const masterMap = new Map<string, string>()
    data.masterArtists.forEach((ma) => {
      masterMap.set(ma.characterName.toLowerCase(), ma.finalArtist)
    })

    const cleanTitle = taskTitle.trim()
    const belumanLines = data.lines.filter((l) => l.status === "Beluman")

    const reportGroups = new Map<
      string,
      {
        eps: string
        character: string
        actor: string
        reportString: string
        epSummary: string
      }
    >()

    belumanLines.forEach((line) => {
      const key = `${line.eps}_${line.character}`
      if (!reportGroups.has(key)) {
        const actor = masterMap.get(line.character.toLowerCase()) || "Unassigned"
        const formattedEps = line.eps.length === 1 ? `0${line.eps}` : line.eps
        const reportString = `${cleanTitle}_${formattedEps}_${line.character}/${actor}_Missing audio file`
        const epSummary = `EP${line.eps} ${line.character}/${actor}`

        reportGroups.set(key, {
          eps: line.eps,
          character: line.character,
          actor,
          reportString,
          epSummary,
        })
      }
    })

    return Array.from(reportGroups.values()).sort(
      (a, b) => Number(a.eps) - Number(b.eps)
    )
  }, [data.lines, data.masterArtists, taskTitle])

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

  // Toggle single line status
  const handleToggleLineStatus = (lineId: string) => {
    const updated = data.lines.map((l) => {
      if (l.id === lineId) {
        return {
          ...l,
          status: (l.status === "Inputted" ? "Beluman" : "Inputted") as "Inputted" | "Beluman",
        }
      }
      return l
    })
    updateData({ ...data, lines: updated })
  }

  // Mark all filtered as Inputted
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

  const totalLines = data.lines.length
  const inputtedCount = data.lines.filter((l) => l.status === "Inputted").length
  const belumanCount = totalLines - inputtedCount

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-5xl w-[95vw] h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-card">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                Sheet Management Dashboard
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                {taskTitle}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
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
              className="px-3 py-1.5 text-xs border border-border rounded-md hover:bg-muted transition-colors flex items-center gap-1.5"
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
            onClick={() => setActiveTab("master")}
            className={`px-3 py-2 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === "master"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Master Artist ({data.masterArtists.length})
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
                    className="h-8 text-xs px-2 bg-background border border-input rounded-md focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="Inputted">Inputted</option>
                    <option value="Beluman">Beluman</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
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
                      <th className="p-2.5 w-16 text-center">Eps</th>
                      <th className="p-2.5 w-24">Start Time</th>
                      <th className="p-2.5 w-24">End Time</th>
                      <th className="p-2.5 w-24">Batch tim</th>
                      <th className="p-2.5 w-36">Character</th>
                      <th className="p-2.5">Script file (Lines)</th>
                      <th className="p-2.5 w-28 text-center">Status</th>
                      <th className="p-2.5 w-12 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredLines.map((line) => (
                      <tr
                        key={line.id}
                        className={`hover:bg-muted/40 transition-colors ${
                          characterColors[line.character] || ""
                        }`}
                      >
                        <td className="p-2.5 font-bold text-center border-r font-mono">
                          {line.eps}
                        </td>
                        <td className="p-2.5 border-r font-mono text-[11px] text-muted-foreground">
                          {line.startTime || "-"}
                        </td>
                        <td className="p-2.5 border-r font-mono text-[11px] text-muted-foreground">
                          {line.endTime || "-"}
                        </td>
                        <td className="p-2.5 border-r font-mono text-[11px] text-muted-foreground">
                          {line.batchTime || "-"}
                        </td>
                        <td className="p-2.5 border-r font-semibold">
                          {line.character}
                        </td>
                        <td className="p-2.5 border-r whitespace-pre-wrap leading-relaxed">
                          {line.lineText}
                        </td>
                        <td className="p-2.5 border-r text-center">
                          <button
                            onClick={() => handleToggleLineStatus(line.id)}
                            className={`h-6 text-[10px] px-2.5 rounded-full font-bold transition-all ${
                              line.status === "Inputted"
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            }`}
                          >
                            {line.status}
                          </button>
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            onClick={() => handleDeleteLine(line.id)}
                            className="p-1 rounded text-muted-foreground hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredLines.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-muted-foreground">
                          No script lines match your filters.
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
                <button
                  onClick={() => setIsPsModalOpen(true)}
                  className="h-8 px-3 text-xs border border-border rounded-md hover:bg-muted font-medium transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Update Pitch Data (PS)
                </button>
              </div>

              <div className="flex-1 overflow-auto border rounded-lg space-y-4 p-1">
                {/* Active Characters Table */}
                <table className="w-full text-xs text-left border-collapse border rounded-md">
                  <thead className="sticky top-0 bg-muted font-semibold text-muted-foreground border-b z-10">
                    <tr>
                      <th className="p-2.5 w-14 text-center">Check</th>
                      <th className="p-2.5 w-24">PS</th>
                      <th className="p-2.5">Character</th>
                      <th className="p-2.5 w-28 text-center">Count</th>
                      <th className="p-2.5">Actor</th>
                      <th className="p-2.5">Appear in</th>
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
                          <input
                            type="checkbox"
                            checked={cs.isChecked}
                            onChange={() => handleToggleCharCheck(cs.character)}
                            className="rounded text-primary focus:ring-primary h-3.5 w-3.5"
                          />
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
                      </tr>
                    ))}
                    {activeCharacterSummaries.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
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
                            </tr>
                          </thead>
                          <tbody className="divide-y opacity-75">
                            {unusedCharacterSummaries.map((cs, idx) => (
                              <tr key={idx} className="hover:bg-muted/20">
                                <td className="p-2.5 text-center">
                                  <input
                                    type="checkbox"
                                    checked={cs.isChecked}
                                    onChange={() => handleToggleCharCheck(cs.character)}
                                    className="rounded text-primary focus:ring-primary h-3.5 w-3.5"
                                  />
                                </td>
                                <td className="p-2.5 font-mono">{cs.ps}</td>
                                <td className="p-2.5 font-medium text-muted-foreground">{cs.character}</td>
                                <td className="p-2.5 text-center font-mono text-muted-foreground">0</td>
                                <td className="p-2.5 text-muted-foreground">{cs.actor}</td>
                                <td className="p-2.5 font-mono text-muted-foreground">-</td>
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
                <button
                  onClick={handleCopyReport}
                  disabled={missingReports.length === 0}
                  className="h-8 px-3 text-xs bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
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

              <div className="flex-1 overflow-auto border rounded-lg bg-card">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="sticky top-0 bg-muted font-semibold text-muted-foreground border-b z-10">
                    <tr>
                      <th className="p-2.5 w-16 text-center">z</th>
                      <th className="p-2.5 w-32">Status</th>
                      <th className="p-2.5 w-16 text-center">z</th>
                      <th className="p-2.5 w-36">Artist</th>
                      <th className="p-2.5">Auto-Generated VOA Report String</th>
                      <th className="p-2.5 w-40">EP Summary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-mono text-[11px]">
                    {missingReports.map((item, idx) => (
                      <tr key={idx} className="hover:bg-muted/30">
                        <td className="p-2.5 text-center font-bold">{item.eps}</td>
                        <td className="p-2.5">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold border border-red-200">
                            Beluman
                          </span>
                        </td>
                        <td className="p-2.5 text-center font-bold">{item.eps}</td>
                        <td className="p-2.5 font-semibold text-foreground">
                          ➡soon {item.character}
                        </td>
                        <td className="p-2.5 font-medium text-slate-800 select-all bg-muted/20">
                          {item.reportString}
                        </td>
                        <td className="p-2.5 font-bold text-emerald-800">
                          {item.epSummary}
                        </td>
                      </tr>
                    ))}
                    {missingReports.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-muted-foreground font-sans">
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
      </div>
    </div>
  )
}
