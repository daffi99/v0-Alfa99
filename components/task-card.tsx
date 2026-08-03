"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import dynamic from "next/dynamic"
import type { Task } from "./kanban-board"
import { CheckCircle2, Circle, Pencil, Loader2, ChevronDown, ChevronUp, ChevronRight, Trash2, ArrowRightLeft, FileSpreadsheet, FileText } from "lucide-react"
import { renderBlockNoteContent } from "./blocknote-note"
import { ScriptWizardModal, type ScriptData, type ScriptLineStatus } from "./script-wizard-modal"
import { ScriptSheetModal, STATUS_STYLE_MAP } from "./script-sheet-modal"

// Dynamic imports with SSR disabled to avoid "window is not defined" error
const BlockNoteNote = dynamic(
  () => import("./blocknote-note").then((mod) => mod.BlockNoteNote),
  { ssr: false }
)
const BlockNoteViewer = dynamic(
  () => import("./blocknote-note").then((mod) => mod.BlockNoteViewer),
  { ssr: false }
)

interface TaskCardProps {
  task: Task
  columnId: string
  onToggleEpisode: (columnId: string, taskId: string, episodeId: string) => void
  onToggleSubtask: (columnId: string, taskId: string, subtaskId: string) => void
  onEditTask: (task: Task, columnId: string) => void
  onUpdateNote: (columnId: string, taskId: string, notes: string) => void
  onUpdateStatus: (columnId: string, taskId: string, status: "Not started" | "In progress" | "Wait VO" | "Finished" | null) => void
  onMoveTask?: (task: Task, fromColumnId: string, toColumnId: string) => void
  onUpdateScriptData?: (columnId: string, taskId: string, scriptData: ScriptData) => void
}

export function TaskCard({ task, columnId, onToggleEpisode, onToggleSubtask, onEditTask, onUpdateNote, onUpdateStatus, onMoveTask, onUpdateScriptData }: TaskCardProps) {
  const completedEpisodes = task.episodes.filter((ep) => ep.completed).length
  const percentComplete = Math.round((completedEpisodes / task.episodes.length) * 100) || 0
  const [localNotes, setLocalNotes] = useState(task.notes || "")
  const [isNoteExpanded, setIsNoteExpanded] = useState(false)
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [localProgress, setLocalProgress] = useState(task.progress || {})
  const [updatingStepKey, setUpdatingStepKey] = useState<string | null>(null)
  const [updatingEpisodeId, setUpdatingEpisodeId] = useState<string | null>(null)
  const [updatingSubtaskId, setUpdatingSubtaskId] = useState<string | null>(null)
  const [isVoReportExpanded, setIsVoReportExpanded] = useState(true)
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [localScriptData, setLocalScriptData] = useState<ScriptData | undefined>(() => {
    if (task.scriptData) return task.scriptData
    if (task.script_data) {
      return typeof task.script_data === "string" ? JSON.parse(task.script_data) : task.script_data
    }
    if (typeof window !== "undefined" && task.id) {
      const cached = localStorage.getItem(`alfa_script_${task.id}`)
      if (cached) {
        try {
          return JSON.parse(cached)
        } catch {}
      }
    }
    return undefined
  })

  useEffect(() => {
    if (task.scriptData || task.script_data) {
      const s = task.scriptData || (typeof task.script_data === "string" ? JSON.parse(task.script_data) : task.script_data)
      setLocalScriptData(s)
      if (typeof window !== "undefined" && task.id && s) {
        try {
          localStorage.setItem(`alfa_script_${task.id}`, JSON.stringify(s))
        } catch {}
      }
    }
  }, [task.scriptData, task.script_data, task.id])

  const voReportSummaryItems = useMemo(() => {
    if (!localScriptData || !localScriptData.lines || localScriptData.lines.length === 0) {
      return []
    }

    const checkedVoReportKeys =
      ((localProgress && typeof localProgress === "object" ? localProgress.voReportChecks : {}) as Record<
        string,
        boolean
      >) || {}

    const masterMap = new Map<string, string>()
    if (localScriptData.masterArtists) {
      localScriptData.masterArtists.forEach((ma) => {
        if (ma.characterName) {
          masterMap.set(ma.characterName.toLowerCase(), ma.finalArtist || "Unassigned")
        }
      })
    }

    const charStatusMap = new Map<
      string,
      {
        character: string
        status: ScriptLineStatus
        epsSet: Set<string>
        totalLines: number
        inputtedLines: number
      }
    >()

    localScriptData.lines.forEach((line) => {
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

      const groupKey = `${targetChar.toLowerCase()}__${lineIssueStatus}`

      if (!charStatusMap.has(groupKey)) {
        charStatusMap.set(groupKey, {
          character: targetChar,
          status: lineIssueStatus as ScriptLineStatus,
          epsSet: new Set<string>(),
          totalLines: 0,
          inputtedLines: 0,
        })
      }

      const entry = charStatusMap.get(groupKey)!
      entry.totalLines += 1
      if (line.status === "Inputted") {
        entry.inputtedLines += 1
      }

      if (line.eps) {
        entry.epsSet.add(line.eps.trim())
      }
    })

    const reports: Array<{
      id: string
      status: ScriptLineStatus
      epSummary: string
      minEps: number
      isResolved: boolean
    }> = []

    charStatusMap.forEach(({ character, status, epsSet, totalLines, inputtedLines }, groupKey) => {
      const actor = masterMap.get(character.toLowerCase()) || "Unassigned"
      const sortedEps = Array.from(epsSet)
        .sort((a, b) => Number(a) - Number(b))
        .map((e) => e.padStart(3, "0"))

      const epsJoined = sortedEps.length > 0 ? sortedEps.join(", ") : "000"
      const minEps = sortedEps.length > 0 ? Number(sortedEps[0]) : 0
      const epSummary = `EP${epsJoined} ${character}/${actor}`

      const isResolved = !!checkedVoReportKeys[groupKey] || (totalLines > 0 && inputtedLines === totalLines)

      reports.push({
        id: groupKey,
        status,
        epSummary,
        minEps,
        isResolved,
      })
    })

    return reports.sort((a, b) => a.minEps - b.minEps)
  }, [localScriptData, localProgress.voReportChecks])

  const handleToggleVoReportCheck = async (itemId: string) => {
    const currentChecks = (localProgress.voReportChecks as Record<string, boolean>) || {}
    const isChecked = !!currentChecks[itemId]
    const willBeChecked = !isChecked
    const updatedChecks = { ...currentChecks, [itemId]: willBeChecked }
    const newProgress = { ...localProgress, voReportChecks: updatedChecks }

    setLocalProgress(newProgress)

    let updatedScriptData = localScriptData
    if (localScriptData && localScriptData.lines) {
      const [charNameLower, originalStatus] = itemId.split("__")
      const isBeluman = originalStatus === "Beluman"

      const updatedLines = localScriptData.lines.map((line) => {
        const lineChar = (line.character || "").trim().toLowerCase()
        const correctChar = (line.correctCharacter || "").trim().toLowerCase()
        const matchesChar = lineChar === charNameLower || (correctChar !== "" && correctChar === charNameLower)

        if (!matchesChar) return line

        if (willBeChecked) {
          // Store previousStatus when checking line to Inputted
          if (line.status === originalStatus) {
            return {
              ...line,
              status: "Inputted" as ScriptLineStatus,
              previousStatus: originalStatus as ScriptLineStatus,
            }
          }
        } else {
          // Restore exact previousStatus when unchecking
          if (
            line.status === "Inputted" &&
            (line.previousStatus === originalStatus || (!line.previousStatus && isBeluman))
          ) {
            return {
              ...line,
              status: (line.previousStatus || originalStatus) as ScriptLineStatus,
              previousStatus: undefined,
            }
          }
        }
        return line
      })
      updatedScriptData = { ...localScriptData, lines: updatedLines }
      setLocalScriptData(updatedScriptData)

      if (onUpdateScriptData) {
        onUpdateScriptData(columnId, task.id, updatedScriptData)
      }
    }

    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          progress: newProgress,
          scriptData: updatedScriptData,
        }),
      })
    } catch (err) {
      console.error("Failed to toggle VO report item check:", err)
      setLocalProgress(localProgress)
    }
  }

  const handleOpenScript = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (
      localScriptData &&
      (localScriptData.isConfigured || (localScriptData.lines && localScriptData.lines.length > 0))
    ) {
      setIsSheetOpen(true)
    } else {
      setIsWizardOpen(true)
    }
  }

  const handleSaveScriptData = (newData: ScriptData) => {
    setLocalScriptData(newData)
    if (typeof window !== "undefined" && task.id) {
      try {
        localStorage.setItem(`alfa_script_${task.id}`, JSON.stringify(newData))
      } catch {}
    }
    if (onUpdateScriptData) {
      onUpdateScriptData(columnId, task.id, newData)
    }
  }
  const noteTextareaRef = useRef<HTMLTextAreaElement>(null)
  const hasNotes = (() => {
    // Prefer localNotes as it's updated immediately on save
    const notes = localNotes || task.notes
    if (!notes || !notes.trim()) return false
    // Check for empty TipTap doc
    if (notes === '{"type":"doc","content":[{"type":"paragraph"}]}') return false
    if (notes === '{"type":"doc","content":[]}') return false
    // Check for empty BlockNote format
    if (notes === '[]') return false
    if (notes === '[{"type":"paragraph","content":""}]') return false
    try {
      const parsed = JSON.parse(notes)

      // Check for BlockNote format (array of blocks)
      if (Array.isArray(parsed)) {
        if (parsed.length === 0) return false
        // Check if all blocks are empty paragraphs
        const hasContent = parsed.some(block => {
          if (block.type === "paragraph") {
            if (!block.content) return false
            if (Array.isArray(block.content)) {
              return block.content.some((c: any) => c.text && c.text.trim().length > 0)
            }
            return typeof block.content === "string" && block.content.trim().length > 0
          }
          return true // non-paragraph blocks count as content
        })
        return hasContent
      }

      // Check for TipTap format (type: "doc")
      if (parsed.type === "doc") {
        // Empty doc check
        if (!parsed.content || parsed.content.length === 0) return false
        // Single empty paragraph check
        if (parsed.content.length === 1 &&
          parsed.content[0].type === "paragraph" &&
          (!parsed.content[0].content || parsed.content[0].content.length === 0)) {
          return false
        }
        return true
      }
      // Check for Editor.js format (blocks array)
      if (parsed.blocks && Array.isArray(parsed.blocks) && parsed.blocks.length > 0) {
        return true
      }
      return false
    } catch {
      // Not JSON, treat as plain text
      return notes.trim().length > 0
    }
  })()
  const isFinished = task.status === "Finished"
  const isTodayTask = task.title.trim().toLowerCase() === "today task"
  const shouldCollapse = isFinished && !isExpanded

  // Update local progress when task changes
  useEffect(() => {
    setLocalProgress(task.progress || {})
  }, [task.progress])

  // Update local notes when task changes
  useEffect(() => {
    setLocalNotes(task.notes || "")
    setIsEditingNote(false)
  }, [task.notes])

  // Auto-resize textarea based on content
  useEffect(() => {
    if (noteTextareaRef.current && isEditingNote) {
      noteTextareaRef.current.style.height = "auto"
      noteTextareaRef.current.style.height = `${noteTextareaRef.current.scrollHeight}px`
    }
  }, [localNotes, isEditingNote])

  const handleNoteSubmit = async (content: string) => {
    try {
      if (content !== (task.notes || "")) {
        await onUpdateNote(columnId, task.id, content)
      }
      setLocalNotes(content)
      // Check if content is empty (handle BlockNote, TipTap and Editor.js empty formats)
      let isEmpty = !content.trim() || content === "{}" || content === '{"blocks":[]}' || content === "[]"
      if (!isEmpty) {
        try {
          const parsed = JSON.parse(content)

          // Check BlockNote empty array or empty paragraph blocks
          if (Array.isArray(parsed)) {
            isEmpty = parsed.length === 0 || parsed.every(block =>
              block.type === "paragraph" &&
              (!block.content ||
                (Array.isArray(block.content) && block.content.every((c: any) => !c.text || !c.text.trim())))
            )
          }
          // Check TipTap empty doc
          else if (parsed.type === "doc" && (!parsed.content || parsed.content.length === 0)) {
            isEmpty = true
          }
          // Check TipTap doc with only empty paragraph
          else if (parsed.type === "doc" && parsed.content?.length === 1 &&
            parsed.content[0].type === "paragraph" && !parsed.content[0].content) {
            isEmpty = true
          }
        } catch {
          // Not JSON
        }
      }
      if (isEmpty) {
        setIsNoteExpanded(false)
      } else {
        setIsNoteExpanded(true) // Keep expanded if there's content
      }
    } catch (error: any) {
      throw error // Re-throw to show error in component
    }
  }

  const handleNoteCancel = () => {
    setLocalNotes(task.notes || "")
    setIsEditingNote(false)
    if (!hasNotes) {
      setIsNoteExpanded(false)
    }
  }

  const handleNoteKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      handleNoteCancel()
    }
  }

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case "Caption":
        return "bg-emerald-100 text-emerald-700"
      case "No caption":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "Not started":
        return "bg-gray-100 text-gray-700"
      case "In progress":
        return "bg-blue-100 text-blue-700"
      case "Wait VO":
        return "bg-yellow-100 text-yellow-700"
      case "Finished":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  // Format duration as MM:SS for display
  const formatDurationMMSS = (duration: string): string => {
    if (!duration) return ""
    const parts = duration.split(":")
    if (parts.length === 3) {
      const hours = parseInt(parts[0] || "0", 10)
      const minutes = parseInt(parts[1] || "0", 10)
      const seconds = parseInt(parts[2] || "0", 10)
      const totalMinutes = hours * 60 + minutes
      return `${String(totalMinutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    }
    if (parts.length === 2) {
      return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`
    }
    return duration
  }

  const statusOptions: Array<"Not started" | "In progress" | "Wait VO" | "Finished" | null> = [
    "Not started",
    "In progress",
    "Wait VO",
    "Finished",
    null,
  ]

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const statusDropdownRef = useRef<HTMLDivElement>(null)
  const statusButtonRef = useRef<HTMLButtonElement>(null)
  const [statusDropdownPosition, setStatusDropdownPosition] = useState({ top: 0, left: 0 })

  const updateStatusDropdownPosition = () => {
    if (statusButtonRef.current) {
      const rect = statusButtonRef.current.getBoundingClientRect()
      setStatusDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
      })
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node) &&
        statusButtonRef.current &&
        !statusButtonRef.current.contains(event.target as Node)
      ) {
        setIsStatusDropdownOpen(false)
      }
    }

    if (isStatusDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isStatusDropdownOpen])

  // Update status dropdown position on scroll/resize when open
  useEffect(() => {
    if (!isStatusDropdownOpen) return
    const updatePosition = () => updateStatusDropdownPosition()
    window.addEventListener("scroll", updatePosition, true)
    window.addEventListener("resize", updatePosition)
    return () => {
      window.removeEventListener("scroll", updatePosition, true)
      window.removeEventListener("resize", updatePosition)
    }
  }, [isStatusDropdownOpen])

  const [isMoveDropdownOpen, setIsMoveDropdownOpen] = useState(false)
  const moveDropdownRef = useRef<HTMLDivElement>(null)
  const moveButtonRef = useRef<HTMLButtonElement>(null)
  const [moveDropdownPosition, setMoveDropdownPosition] = useState({ top: 0, right: 0 })

  const updateMoveDropdownPosition = () => {
    if (moveButtonRef.current) {
      const rect = moveButtonRef.current.getBoundingClientRect()
      setMoveDropdownPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      })
    }
  }

  // Close move dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moveDropdownRef.current &&
        !moveDropdownRef.current.contains(event.target as Node) &&
        moveButtonRef.current &&
        !moveButtonRef.current.contains(event.target as Node)
      ) {
        setIsMoveDropdownOpen(false)
      }
    }

    if (isMoveDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMoveDropdownOpen])

  // Update position on scroll/resize when open
  useEffect(() => {
    if (!isMoveDropdownOpen) return
    const updatePosition = () => updateMoveDropdownPosition()
    window.addEventListener("scroll", updatePosition, true)
    window.addEventListener("resize", updatePosition)
    return () => {
      window.removeEventListener("scroll", updatePosition, true)
      window.removeEventListener("resize", updatePosition)
    }
  }, [isMoveDropdownOpen])

  return (
    <div
      className={`bg-white rounded-lg p-4 shadow-sm border border-border hover:shadow-md transition-shadow group relative ${isEditingNote ? "overflow-visible z-[100]" : ""}`}
      data-editing-note={isEditingNote}
      onDragStart={(e) => {
        if (isEditingNote) {
          e.preventDefault()
          e.stopPropagation()
          return false
        }
      }}
    >

      {/* Progress indicator - at top only if not finished */}
      {!isFinished && !isTodayTask && task.episodes.length > 0 && (
        <div className="mb-3">
          {!shouldCollapse && (
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-medium text-muted-foreground">
                {completedEpisodes} of {task.episodes.length} episodes completed
              </span>
              <span className="text-[10px] font-semibold text-emerald-600">{percentComplete}%</span>
            </div>
          )}
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>
      )}

      {/* Tags - at the very top with edit button */}
      {!isTodayTask && (
        <div className="flex items-center justify-between mb-2 gap-2">
          <div className="flex flex-wrap gap-1.5 flex-1">
            {task.category && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${getCategoryColor(task.category)}`}
              >
                {task.category}
              </span>
            )}
            <div>
              <button
                ref={statusButtonRef}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!isStatusDropdownOpen) {
                    updateStatusDropdownPosition()
                  }
                  setIsStatusDropdownOpen(!isStatusDropdownOpen)
                }}
                onMouseDown={(e) => {
                  e.stopPropagation()
                }}
                onDragStart={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap flex items-center gap-1 ${getStatusColor(task.status)} hover:opacity-80 transition-opacity cursor-pointer`}
              >
                {task.status || "Not started"}
                <ChevronDown className="w-3 h-3" />
              </button>
              {isStatusDropdownOpen && (
                <div
                  ref={statusDropdownRef}
                  className="fixed bg-white border border-border rounded-md shadow-lg z-[9999] min-w-[120px]"
                  style={{
                    top: `${statusDropdownPosition.top}px`,
                    left: `${statusDropdownPosition.left}px`,
                    animation: "fadeInScale 0.15s ease-out",
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation()
                  }}
                  onDragStart={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                  }}
                >
                  {statusOptions.map((status) => (
                    <button
                      key={status || "none"}
                      onClick={(e) => {
                        e.stopPropagation()
                        onUpdateStatus(columnId, task.id, status)
                        setIsStatusDropdownOpen(false)
                        // If status is Finished, expand the card
                        if (status === "Finished") {
                          setIsExpanded(true)
                        }
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation()
                      }}
                      className={`w-full text-left text-[10px] px-2 py-1.5 hover:bg-muted transition-colors first:rounded-t-md last:rounded-b-md ${(task.status === status || (task.status === null && status === null)) ? "bg-blue-50" : ""
                        }`}
                    >
                      {status || "Not started"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onMoveTask && (
              <div>
                <button
                  ref={moveButtonRef}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!isMoveDropdownOpen) {
                      updateMoveDropdownPosition()
                    }
                    setIsMoveDropdownOpen(!isMoveDropdownOpen)
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation()
                  }}
                  onDragStart={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded flex-shrink-0 cursor-pointer"
                  title="Move to stage"
                >
                  <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                </button>
                {isMoveDropdownOpen && (
                  <div
                    ref={moveDropdownRef}
                    className="fixed bg-white border border-border rounded-md shadow-lg z-[9999] w-[130px]"
                    style={{
                      top: `${moveDropdownPosition.top}px`,
                      right: `${moveDropdownPosition.right}px`,
                      animation: "fadeInScale 0.15s ease-out",
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation()
                    }}
                    onDragStart={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                    }}
                  >
                    {[
                      { id: "backlog", title: "Backlog" },
                      { id: "in-progress", title: "In Progress" },
                      { id: "finished", title: "Finished" },
                      { id: "revision", title: "Revision" },
                      { id: "customer-revision", title: "Customer Revision" },
                      { id: "done", title: "Done" },
                    ]
                      .filter((col) => col.id !== columnId)
                      .map((col) => (
                        <button
                          key={col.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            onMoveTask(task, columnId, col.id)
                            setIsMoveDropdownOpen(false)
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation()
                          }}
                          className="w-full text-left text-[11px] px-3 py-2 hover:bg-muted text-gray-700 transition-colors first:rounded-t-md last:rounded-b-md cursor-pointer"
                        >
                          {col.title}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            )}
            {isFinished && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsExpanded(!isExpanded)
                }}
                onMouseDown={(e) => {
                  e.stopPropagation()
                }}
                onDragStart={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded flex-shrink-0"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            )}
            <button
              onClick={() => onEditTask(task, columnId)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded flex-shrink-0"
              disabled={task.loading}
            >
              <Pencil className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={handleOpenScript}
              onMouseDown={(e) => e.stopPropagation()}
              onDragStart={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
              className={`p-1 rounded-md flex-shrink-0 cursor-pointer transition-all flex items-center justify-center border shadow-2xs ${
                localScriptData?.lines && localScriptData.lines.length > 0
                  ? "bg-emerald-100/90 text-emerald-700 hover:bg-emerald-200 border-emerald-400/80"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 border-border"
              }`}
              title={
                localScriptData?.lines && localScriptData.lines.length > 0
                  ? `Script Sheet (${localScriptData.lines.filter((l) => l.status === "Inputted").length}/${localScriptData.lines.length} Inputted)`
                  : "Script Setup"
              }
            >
              <FileSpreadsheet
                className={`w-3.5 h-3.5 ${
                  localScriptData?.lines && localScriptData.lines.length > 0 ? "text-emerald-700 font-bold" : "text-muted-foreground/70"
                }`}
              />
            </button>
          </div>
        </div>
      )}

      <div className={isFinished ? "mb-0" : "mb-2"}>
        <h3 className="font-bold text-black text-lg ">{task.title}</h3>
        {!isTodayTask && (
          <div className="flex items-center gap-1">
            {task.episodeRanges.length > 0 && (
              <p className="text-xs font-semibold text-black whitespace-nowrap">EP {task.episodeRanges.join(", ")}</p>
            )}
            {task.duration && (
              <p className="font-semibold text-xs text-black whitespace-nowrap">
                / Duration {formatDurationMMSS(task.duration)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Progress Checklist - horizontal (hidden when finished task is collapsed) */}
      {!shouldCollapse && !isTodayTask && (
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          {(() => {
            const isCaptionTask = task.category === "Caption" || (!task.category && task.title.toLowerCase().includes("caption"))

            const stepsList = isCaptionTask
              ? [
                  { label: "Preparation", key: "prep" },
                  { label: "Check VO", key: "checkVO" },
                  { label: "Editing", key: "editing" },
                  { label: "Caption Edit", key: "captionEdit" },
                  { label: "Completed", key: "completed" },
                ]
              : [
                  { label: "Preparation", key: "prep" },
                  { label: "Check VO", key: "checkVO" },
                  { label: "Editing", key: "editing" },
                  { label: "Completed", key: "completed" },
                ]

            const isStepCompleted = (key: string) => {
              switch (key) {
                case "prep":
                  return !!(localProgress.vocalSplit && localProgress.voEnhance && localProgress.subtitleJoin)
                case "checkVO":
                  return !!localProgress.checkVO
                case "editing":
                  return !!(localProgress.pitchShift && localProgress.volumeAdjustment && localProgress.subseq && localProgress.mixingVO)
                case "captionEdit":
                  return !!(localProgress.inputReplacementText && localProgress.inputSyncSRT && localProgress.reCheckSRT)
                case "completed":
                  return (
                    !!localProgress.completed ||
                    (!!(localProgress.vocalSplit && localProgress.voEnhance && localProgress.subtitleJoin) &&
                      !!localProgress.checkVO &&
                      !!(localProgress.pitchShift && localProgress.volumeAdjustment && localProgress.subseq && localProgress.mixingVO) &&
                      (!isCaptionTask || !!(localProgress.inputReplacementText && localProgress.inputSyncSRT && localProgress.reCheckSRT)))
                  )
                default:
                  return false
              }
            }

            const getToggledProgress = (key: string) => {
              const currentDone = isStepCompleted(key)
              const targetVal = !currentDone
              const updated = { ...localProgress }

              switch (key) {
                case "prep":
                  updated.vocalSplit = targetVal
                  updated.voEnhance = targetVal
                  updated.subtitleJoin = targetVal
                  break
                case "checkVO":
                  updated.checkVO = targetVal
                  break
                case "editing":
                  updated.pitchShift = targetVal
                  updated.volumeAdjustment = targetVal
                  updated.subseq = targetVal
                  updated.mixingVO = targetVal
                  break
                case "captionEdit":
                  updated.inputReplacementText = targetVal
                  updated.inputSyncSRT = targetVal
                  updated.reCheckSRT = targetVal
                  break
                case "completed":
                  updated.completed = targetVal
                  if (targetVal) {
                    updated.vocalSplit = true
                    updated.voEnhance = true
                    updated.subtitleJoin = true
                    updated.checkVO = true
                    updated.pitchShift = true
                    updated.volumeAdjustment = true
                    updated.subseq = true
                    updated.mixingVO = true
                    if (isCaptionTask) {
                      updated.inputReplacementText = true
                      updated.inputSyncSRT = true
                      updated.reCheckSRT = true
                    }
                  }
                  break
              }

              return updated
            }

            return stepsList.map((item, index) => {
              const stepNumber = index + 1
              const isCompleted = isStepCompleted(item.key)
              const isStepUpdating = updatingStepKey === item.key

              return (
                <button
                  key={item.key}
                  disabled={isStepUpdating}
                  onClick={async (e) => {
                    e.stopPropagation()
                    if (isStepUpdating) return
                    setUpdatingStepKey(item.key)

                    const willBeCompletedNow = item.key === "completed" && !isCompleted
                    const willBeUncompletedNow = item.key === "completed" && isCompleted

                    const newProgress = getToggledProgress(item.key)
                    setLocalProgress(newProgress)

                    const willBeCompleted = item.key === "completed" && !isCompleted

                    // Sync episode states when Completed step is toggled
                    if (item.key === "completed") {
                      if (willBeCompletedNow) {
                        task.episodes.forEach((ep) => {
                          if (!ep.completed) onToggleEpisode(columnId, task.id, ep.id)
                        })
                      } else if (willBeUncompletedNow) {
                        task.episodes.forEach((ep) => {
                          if (ep.completed) onToggleEpisode(columnId, task.id, ep.id)
                        })
                      }
                    }

                    try {
                      const updateData: any = { progress: newProgress }
                      if (willBeCompleted) {
                        updateData.status = "Finished"
                        onUpdateStatus(columnId, task.id, "Finished")
                      }

                      const response = await fetch(`/api/tasks/${task.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(updateData),
                      })
                      if (!response.ok) {
                        throw new Error("Failed to update progress")
                      }
                      const updatedTask = await response.json()
                      setLocalProgress(
                        updatedTask.progress
                          ? typeof updatedTask.progress === "string"
                            ? JSON.parse(updatedTask.progress)
                            : updatedTask.progress
                          : {}
                      )

                      if (willBeCompleted && updatedTask.status === "Finished") {
                        setIsExpanded(false)
                      }
                    } catch (error) {
                      console.error("Failed to update progress:", error)
                      setLocalProgress(task.progress || {})
                      if (willBeCompleted) {
                        onUpdateStatus(columnId, task.id, task.status)
                      }
                    } finally {
                      setUpdatingStepKey(null)
                    }
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className={`flex items-center gap-1 text-[10px] rounded px-1.5 py-1 transition-colors cursor-pointer ${
                    isStepUpdating ? "bg-amber-50 text-amber-800 font-semibold" : "hover:bg-muted/50"
                  }`}
                >
                  <span className="text-muted-foreground font-mono font-semibold">{stepNumber}</span>
                  {isStepUpdating ? (
                    <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin flex-shrink-0" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-border flex-shrink-0" />
                  )}
                  <span className={isStepUpdating ? "text-amber-800 font-semibold" : isCompleted ? "text-foreground font-semibold" : "text-muted-foreground font-medium"}>
                    {item.label}
                  </span>
                </button>
              )
            })
          })()}
        </div>
      )}

      {/* Description - hidden when collapsed */}
      {!shouldCollapse && task.description && <p className="text-xs text-muted-foreground mb-3">{task.description}</p>}

      {/* Episodes - hidden when collapsed */}
      {!shouldCollapse && !isTodayTask && task.episodes.length > 0 && (
        <div className="mb-3">
          <div className="grid grid-cols-5 gap-1">
            {task.episodes.map((episode) => {
              const isEpUpdating = updatingEpisodeId === episode.id
              return (
                <div
                  key={episode.id}
                  onClick={async (e) => {
                    e.stopPropagation()
                    if (isEpUpdating) return
                    setUpdatingEpisodeId(episode.id)
                    try {
                      await onToggleEpisode(columnId, task.id, episode.id)
                    } catch (err) {
                      console.error("Failed to toggle episode:", err)
                    } finally {
                      setUpdatingEpisodeId(null)
                    }
                  }}
                  className={`flex items-center justify-center cursor-pointer rounded px-1 py-0.5 transition-colors ${
                    isEpUpdating ? "bg-amber-50" : "hover:bg-muted/40"
                  }`}
                >
                  {isEpUpdating ? (
                    <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin mr-1 flex-shrink-0" />
                  ) : episode.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-border hover:text-muted-foreground mr-1 flex-shrink-0" />
                  )}
                  <span className={`text-[10px] min-w-fit ${isEpUpdating ? "font-bold text-amber-800" : "font-medium text-foreground"}`}>
                    {episode.number}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick Summary of VO Report (below episode checklist) */}
      {!shouldCollapse && !isTodayTask && voReportSummaryItems.length > 0 && (
        <div className="mb-3 bg-muted/20 p-2 rounded-lg border border-border/50">
          <div className="flex items-center justify-between border-b pb-1">
            <span className="text-[10px] font-bold text-foreground tracking-wide flex items-center gap-1">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> VO Report Summary ({voReportSummaryItems.length})
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsVoReportExpanded(!isVoReportExpanded)
              }}
              className="text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors"
              title={isVoReportExpanded ? "Collapse Summary" : "Expand Summary"}
            >
              {isVoReportExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
          {isVoReportExpanded && (
            <div className="space-y-1 max-h-44 overflow-y-auto pr-1 mt-1.5">
              {voReportSummaryItems.map((item) => {
                const isChecked = item.isResolved || !!(localProgress.voReportChecks as Record<string, boolean>)?.[item.id]
                const statusStyle = STATUS_STYLE_MAP[item.status] || {
                  label: item.status,
                  bg: "bg-gray-100",
                  text: "text-gray-700",
                  border: "border-gray-200",
                }

                return (
                  <label
                    key={item.id}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 text-[9px] cursor-pointer hover:bg-background/80 p-1 rounded transition-colors"
                  >
                    <div className="w-[72px] flex-shrink-0 flex justify-end">
                      <span
                        className={`text-[8.5px] px-1.5 py-0.2 rounded font-bold border whitespace-nowrap text-right ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                      >
                        {statusStyle.label}
                      </span>
                    </div>
                    <span
                      className={`font-mono text-foreground font-semibold leading-tight text-[9px] min-w-0 flex-1 ${
                        isChecked ? "line-through text-muted-foreground/60" : ""
                      }`}
                    >
                      {item.epSummary}
                    </span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleVoReportCheck(item.id)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer accent-emerald-600 flex-shrink-0 ml-1"
                    />
                  </label>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Subtasks - hidden when collapsed */}
      {!shouldCollapse && !isTodayTask && task.subtasks.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">Sub tasks</p>
          <div className="space-y-1">
            {task.subtasks.map((subtask) => {
              const isSubUpdating = updatingSubtaskId === subtask.id
              return (
                <div
                  key={subtask.id}
                  onClick={async (e) => {
                    e.stopPropagation()
                    if (isSubUpdating) return
                    setUpdatingSubtaskId(subtask.id)
                    try {
                      await onToggleSubtask(columnId, task.id, subtask.id)
                    } catch (err) {
                      console.error("Failed to toggle subtask:", err)
                    } finally {
                      setUpdatingSubtaskId(null)
                    }
                  }}
                  className={`flex items-center gap-2 cursor-pointer p-1 rounded transition-colors ${
                    isSubUpdating ? "bg-amber-50" : "hover:bg-muted/40"
                  }`}
                >
                  {isSubUpdating ? (
                    <Loader2 className="w-4 h-4 text-amber-600 animate-spin flex-shrink-0" />
                  ) : subtask.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-border flex-shrink-0 hover:text-muted-foreground" />
                  )}
                  <span
                    className={`text-xs ${
                      isSubUpdating
                        ? "text-amber-800 font-semibold"
                        : subtask.completed
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {subtask.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Image - hidden when collapsed */}
      {!shouldCollapse && task.image && (
        <div className="mb-3 rounded-md overflow-hidden bg-muted h-24">
          <img src={task.image || "/placeholder.svg"} alt={task.title} className="w-full h-full object-cover" />
        </div>
      )}



      {/* Notes field at very bottom - hidden when collapsed */}
      {!shouldCollapse && (
        <div
          className={`mt-3 pt-3 border-t border-border group/note ${isEditingNote ? "overflow-visible" : ""}`}
          draggable={false}
          onDragStart={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onMouseDown={(e) => {
            if (isEditingNote) {
              e.stopPropagation()
            }
          }}
        >
          {!isNoteExpanded && !hasNotes ? (
            <button
              onClick={() => {
                setIsNoteExpanded(true)
                setIsEditingNote(true)
              }}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              + Add note
            </button>
          ) : (
            <>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-medium text-muted-foreground">Note</label>
                {!isEditingNote && (
                  <button
                    onClick={() => {
                      onUpdateNote(columnId, task.id, "")
                      setLocalNotes("")
                      setIsNoteExpanded(false)
                    }}
                    className="text-[10px] text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 opacity-0 group-hover/note:opacity-100 transition-opacity"
                    title="Remove note"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
              {isEditingNote ? (
                <BlockNoteNote
                  key={`editor-${task.id}-${isEditingNote}`}
                  initialData={task.notes}
                  onSave={handleNoteSubmit}
                  onCancel={handleNoteCancel}
                  placeholder="Add a note about this series..."
                  isEditing={isEditingNote}
                  onEditChange={setIsEditingNote}
                />
              ) : hasNotes ? (
                <div
                  onClick={() => {
                    setIsEditingNote(true)
                    setIsNoteExpanded(true)
                  }}
                  className="cursor-text pb-9"
                >
                  {(() => {
                    // Prefer localNotes as it's updated immediately on save
                    const notesContent = localNotes || task.notes
                    try {
                      const data = typeof notesContent === "string" ? JSON.parse(notesContent) : notesContent
                      // Check for BlockNote format (array), TipTap format (type: "doc") or Editor.js format (blocks array)
                      if (Array.isArray(data) || (data.type === "doc" && data.content) || (data.blocks && Array.isArray(data.blocks) && data.blocks.length > 0)) {
                        return <BlockNoteViewer key={`viewer-${task.id}-${localNotes?.slice(0, 30)}`} content={notesContent} />
                      }
                    } catch {
                      // Not JSON, fall through to HTML rendering
                    }
                    // Fallback to plain text rendering
                    const fallbackText = renderBlockNoteContent(notesContent)
                    if (!fallbackText) return null
                    return (
                      <div className="text-xs text-foreground whitespace-pre-wrap">
                        {fallbackText}
                      </div>
                    )
                  })()}
                </div>
              ) : null}
            </>
          )}
        </div>
      )}



      {/* Script Modals */}
      {isWizardOpen && (
        <ScriptWizardModal
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          taskTitle={task.title}
          initialData={localScriptData}
          onComplete={(data) => {
            handleSaveScriptData(data)
            setIsWizardOpen(false)
            setIsSheetOpen(true)
          }}
        />
      )}

      {isSheetOpen && localScriptData && (
        <ScriptSheetModal
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          taskTitle={task.title}
          taskCategory={task.category}
          taskProgress={localProgress}
          onUpdateProgress={async (newProgress) => {
            const isCap = task.category === "Caption" || (!task.category && task.title.toLowerCase().includes("caption"))
            const wasDone = !!(localProgress.completed || (
              !!(localProgress.vocalSplit && localProgress.voEnhance && localProgress.subtitleJoin) &&
              !!localProgress.checkVO &&
              !!(localProgress.pitchShift && localProgress.volumeAdjustment && localProgress.subseq && localProgress.mixingVO) &&
              (!isCap || !!(localProgress.inputReplacementText && localProgress.inputSyncSRT && localProgress.reCheckSRT))
            ))

            setLocalProgress(newProgress)

            const nowDone = !!(newProgress.completed || (
              !!(newProgress.vocalSplit && newProgress.voEnhance && newProgress.subtitleJoin) &&
              !!newProgress.checkVO &&
              !!(newProgress.pitchShift && newProgress.volumeAdjustment && newProgress.subseq && newProgress.mixingVO) &&
              (!isCap || !!(newProgress.inputReplacementText && newProgress.inputSyncSRT && newProgress.reCheckSRT))
            ))

            if (!wasDone && nowDone) {
              task.episodes.forEach((ep) => {
                if (!ep.completed) onToggleEpisode(columnId, task.id, ep.id)
              })
            } else if (wasDone && !nowDone) {
              task.episodes.forEach((ep) => {
                if (ep.completed) onToggleEpisode(columnId, task.id, ep.id)
              })
            }

            try {
              await fetch(`/api/tasks/${task.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ progress: newProgress }),
              })
            } catch (e) {
              console.error("Failed to update progress from script modal:", e)
            }
          }}
          scriptData={localScriptData}
          onSave={handleSaveScriptData}
          onReRunWizard={() => {
            setIsSheetOpen(false)
            setIsWizardOpen(true)
          }}
        />
      )}
    </div>
  )
}
