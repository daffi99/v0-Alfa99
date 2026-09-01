"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import type { Task } from "@/components/kanban-board"
import { DurationInput } from "@/components/duration-input"
import { ChevronDown, ChevronUp, MoreVertical, Check, RotateCcw } from "lucide-react"
import { BillingMonthPicker } from "@/components/billing-month-picker"

type BillingRow = {
  task: Task
  amount: number
}

type BillingByMonth = Record<string, BillingRow[]>

function parseDurationToSeconds(time?: string | null): number {
  if (!time) return 0
  const parts = time.split(":").map((p) => Number(p.trim()))

  if (parts.length === 3) {
    const [h, m, s] = parts
    if (Number.isNaN(h) || Number.isNaN(m) || Number.isNaN(s)) return 0
    return h * 3600 + m * 60 + s
  }

  if (parts.length === 2) {
    const [m, s] = parts
    if (Number.isNaN(m) || Number.isNaN(s)) return 0
    return m * 60 + s
  }

  return 0
}

function getRate(category: string | null, title?: string, override?: string | null): number {
  // Default rates
  const defaultCaptionRate = 1_400_000
  const defaultNonCaptionRate = 1_000_000

  // Special rates only apply to titles starting with "Bahasa"
  const isBahasa = title && title.trim().toLowerCase().startsWith("bahasa")

  let effectiveCategory = category
  if (override === "no_caption") {
    effectiveCategory = "No caption"
  } else if (override === "caption") {
    effectiveCategory = "Caption"
  }

  if (isBahasa) {
    // If title starts with "Bahasa": Caption = 1.300.000, non-Caption = 750.000
    return effectiveCategory === "Caption" ? 1_300_000 : 750_000
  }

  // For non-Bahasa tasks, use default rates
  return effectiveCategory === "Caption" ? defaultCaptionRate : defaultNonCaptionRate
}

function calculateAmount(duration: string | undefined, category: string | null, title?: string, override?: string | null): number {
  const seconds = parseDurationToSeconds(duration)
  const hours = seconds / 3600
  const rate = getRate(category, title, override)

  return Math.round(hours * rate)
}

function formatRupiah(amount: number): string {
  return "Rp" + amount.toLocaleString("id-ID")
}

// Normalize billing month format (convert old "December" to "December YYYY")
function normalizeBillingMonth(month: string | undefined | null): string {
  const currentYear = new Date().getFullYear()
  if (!month) return `December ${currentYear}`

  // If it already has a year, return as is
  if (/\d{4}/.test(month)) {
    return month
  }

  // If it's just a month name, add current year
  return `${month} ${currentYear}`
}


export default function BillingPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [grouped, setGrouped] = useState<BillingByMonth>({})
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [editingDuration, setEditingDuration] = useState<Record<string, string>>({})
  const [editingBillingMonth, setEditingBillingMonth] = useState<Record<string, string>>({})
  const [editingRateOverride, setEditingRateOverride] = useState<Record<string, string | null>>({})
  const [activeMenuTaskId, setActiveMenuTaskId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({})

  // Filters
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState("All")

  // Get current month/year string
  const getCurrentMonthYear = (): string => {
    const now = new Date()
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    const currentYear = new Date().getFullYear()
    return `${monthNames[now.getMonth()]} ${currentYear}`
  }

  // Close 3-dots dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuTaskId(null)
    window.addEventListener("click", handleClickOutside)
    return () => window.removeEventListener("click", handleClickOutside)
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/tasks")
        if (!res.ok) {
          setIsLoading(false)
          return
        }
        const raw = await res.json()
        const mapped: Task[] = raw
          .filter((t: any) => t.title?.toLowerCase() !== "today task")
          .map((task: any) => {
            const parsedProgress = task.progress
              ? typeof task.progress === "string"
                ? JSON.parse(task.progress)
                : task.progress
              : {}

            const billingRateOverride =
              task.billing_rate_override ||
              task.billingRateOverride ||
              parsedProgress.billingRateOverride ||
              null

            return {
              id: task.id,
              title: task.title,
              description: task.description,
              episodeRanges: task.episode_ranges ? task.episode_ranges.split(",") : [],
              category: task.category,
              status: task.status,
              stage: task.stage || "Backlog",
              notes: task.notes || "",
              created_at: task.created_at || task.createdAt || null,
              duration: task.duration || "00:10:00",
              billingMonth: task.billing_month || `December ${new Date().getFullYear()}`,
              billingRateOverride: billingRateOverride,
              progress: parsedProgress,
              episodes: [],
              subtasks: [],
              attachments: [],
            }
          })

        setTasks(mapped)

        // Initialize editing durations, billing months, and rate overrides with current values
        const initialEditingDuration: Record<string, string> = {}
        const initialEditingBillingMonth: Record<string, string> = {}
        const initialEditingRateOverride: Record<string, string | null> = {}

        mapped.forEach((task) => {
          initialEditingDuration[task.id] = task.duration || "00:10:00"
          initialEditingBillingMonth[task.id] = normalizeBillingMonth(task.billingMonth)
          initialEditingRateOverride[task.id] = task.billingRateOverride || null
        })
        setEditingDuration(initialEditingDuration)
        setEditingBillingMonth(initialEditingBillingMonth)
        setEditingRateOverride(initialEditingRateOverride)

        const byMonth: BillingByMonth = {}
        mapped.forEach((task) => {
          const month = normalizeBillingMonth(task.billingMonth)
          const amount = calculateAmount(task.duration, task.category, task.title, task.billingRateOverride)
          if (!byMonth[month]) byMonth[month] = []
          byMonth[month].push({ task, amount })
        })

        setGrouped(byMonth)

        // Initialize expanded months: current month expanded, others collapsed
        const currentMonthYear = getCurrentMonthYear()
        const initialExpanded: Record<string, boolean> = {}
        Object.keys(byMonth).forEach((month) => {
          initialExpanded[month] = month === currentMonthYear
        })
        setExpandedMonths(initialExpanded)
      } finally {
        setIsLoading(false)
      }
    }

    void load()
  }, [])

  const toggleMonth = (month: string) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [month]: !prev[month],
    }))
  }

  // Recalculate grouped data when tasks or editing states change
  useEffect(() => {
    if (tasks.length === 0) return

    const updated: BillingByMonth = {}
    tasks.forEach((task) => {
      const month = normalizeBillingMonth(editingBillingMonth[task.id] ?? task.billingMonth)
      const duration = editingDuration[task.id] ?? task.duration ?? "00:10:00"
      const override = editingRateOverride[task.id] ?? task.billingRateOverride ?? null
      const amount = calculateAmount(duration, task.category, task.title, override)

      if (!updated[month]) updated[month] = []
      updated[month].push({ task, amount })
    })
    setGrouped(updated)
  }, [tasks, editingBillingMonth, editingDuration, editingRateOverride])

  const handleDurationChange = useCallback(async (taskId: string, newDuration: string) => {
    // Don't update if duration hasn't changed
    const currentTask = tasks.find((t) => t.id === taskId)
    if (currentTask && currentTask.duration === newDuration) {
      return
    }

    // Update local state immediately
    setEditingDuration((prev) => ({ ...prev, [taskId]: newDuration }))

    // Update task in database
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duration: newDuration }),
      })

      if (!response.ok) {
        throw new Error("Failed to update duration")
      }

      // Update local tasks state (grouped data will recalculate via useEffect)
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? { ...task, duration: newDuration } : task)),
      )
    } catch (error) {
      console.error("Failed to update duration:", error)
      // Revert on error
      setTasks((prevTasks) => {
        const task = prevTasks.find((t) => t.id === taskId)
        setEditingDuration((prev) => ({
          ...prev,
          [taskId]: task?.duration || "00:10:00",
        }))
        return prevTasks
      })
      alert("Failed to save duration. Please try again.")
    }
  }, [tasks])

  const handleBillingMonthChange = async (taskId: string, newBillingMonth: string) => {
    // Update local state immediately
    setEditingBillingMonth((prev) => ({ ...prev, [taskId]: newBillingMonth }))

    // Update task in database
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingMonth: newBillingMonth }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to update billing month: ${response.statusText}`)
      }

      const updatedTask = await response.json()

      // Update local tasks state (grouped data will recalculate via useEffect)
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, billingMonth: updatedTask.billing_month || newBillingMonth }
            : task,
        ),
      )
    } catch (error) {
      console.error("Failed to update billing month:", error)
      // Revert on error
      setTasks((prevTasks) => {
        const task = prevTasks.find((t) => t.id === taskId)
        setEditingBillingMonth((prev) => ({
          ...prev,
          [taskId]: normalizeBillingMonth(task?.billingMonth),
        }))
        return prevTasks
      })
      const errorMessage = error instanceof Error ? error.message : "Failed to save billing month. Please try again."
      alert(errorMessage)
    }
  }

  const handleRateOverrideChange = async (taskId: string, newOverride: string | null) => {
    setActiveMenuTaskId(null)
    setEditingRateOverride((prev) => ({ ...prev, [taskId]: newOverride }))

    const currentTask = tasks.find((t) => t.id === taskId)
    const currentProgress = currentTask?.progress || {}
    const updatedProgress = { ...currentProgress, billingRateOverride: newOverride }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          progress: updatedProgress,
          billing_rate_override: newOverride,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save rate adjustment")
      }

      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                billingRateOverride: newOverride,
                progress: updatedProgress,
              }
            : t,
        ),
      )
    } catch (error) {
      console.error("Failed to update rate adjustment:", error)
      setEditingRateOverride((prev) => ({
        ...prev,
        [taskId]: currentTask?.billingRateOverride || null,
      }))
      alert("Failed to save rate adjustment. Please try again.")
    }
  }

  if (isLoading) {
    return <div className="p-8">Loading billing data...</div>
  }

  // Filter and Sort keys
  const months = Object.keys(grouped)
    .filter(month => {
      const parts = month.split(" ")
      if (parts.length !== 2) return false

      const mName = parts[0]
      const yNum = parseInt(parts[1]) || 0

      if (yNum !== selectedYear) return false
      if (selectedMonth !== "All" && mName !== selectedMonth) return false

      return true
    })
    .sort((a, b) => {
      // Parse "Month Year" format
      const parseMonthYear = (str: string) => {
        const parts = str.split(" ")
        if (parts.length !== 2) return { month: 0, year: 0 }
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ]
        const month = monthNames.indexOf(parts[0])
        const year = parseInt(parts[1]) || 0
        return { month, year }
      }

      const aParsed = parseMonthYear(a)
      const bParsed = parseMonthYear(b)

      // Sort by year descending, then by month descending
      if (bParsed.year !== aParsed.year) {
        return bParsed.year - aParsed.year
      }
      return bParsed.month - aParsed.month
    })

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Billing Summary</h1>
          <Link
            href="/"
            className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Kanban Board
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center bg-white p-4 rounded-lg border border-border shadow-sm">
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="flex-1 sm:w-[140px] px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Months</option>
              {[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="flex-1 sm:w-[100px] px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[
                new Date().getFullYear() - 1,
                new Date().getFullYear(),
                new Date().getFullYear() + 1
              ].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {months.length === 0 && <p className="text-sm text-muted-foreground">No tasks found.</p>}

      {months.map((month) => {
        const rows = grouped[month] || []
        const total = rows.reduce((sum, r) => {
          const currentDuration = editingDuration[r.task.id] ?? r.task.duration ?? "00:10:00"
          const currentOverride = editingRateOverride[r.task.id] ?? r.task.billingRateOverride ?? null
          return sum + calculateAmount(currentDuration, r.task.category, r.task.title, currentOverride)
        }, 0)

        const currentMonthYear = getCurrentMonthYear()
        const isCurrentMonth = month === currentMonthYear
        const isExpanded = expandedMonths[month] ?? isCurrentMonth

        return (
          <section key={month} className="bg-white rounded-xl shadow-sm border border-border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!isCurrentMonth && (
                  <button
                    onClick={() => toggleMonth(month)}
                    className="p-1 hover:bg-muted rounded transition-colors"
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                )}
                <h2 className="text-lg font-semibold">{month}</h2>
              </div>
              <div className="text-sm font-medium text-emerald-700">
                Total: {formatRupiah(total)}
              </div>
            </div>

            {isExpanded && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="py-2 pr-4">Done</th>
                      <th className="py-2 pr-4">Series</th>
                      <th className="py-2 pr-4">Billing Month</th>
                      <th className="py-2 pr-4">Duration</th>
                      <th className="py-2 pr-4">Category</th>
                      <th className="py-2 pr-4">Rate</th>
                      <th className="py-2 pr-4">Amount</th>
                      <th className="py-2 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(({ task }) => {
                      const currentDuration = editingDuration[task.id] ?? task.duration ?? "00:10:00"
                      const currentBillingMonth = normalizeBillingMonth(
                        editingBillingMonth[task.id] ?? task.billingMonth
                      )
                      const currentOverride = editingRateOverride[task.id] ?? task.billingRateOverride ?? null
                      const displayAmount = calculateAmount(currentDuration, task.category, task.title, currentOverride)
                      const currentRate = getRate(task.category, task.title, currentOverride)

                      return (
                        <tr key={task.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="py-2 pr-4">
                            <input
                              type="checkbox"
                              checked={!!checked[task.id]}
                              onChange={(e) =>
                                setChecked((prev) => ({
                                  ...prev,
                                  [task.id]: e.target.checked,
                                }))
                              }
                            />
                          </td>
                          <td className="py-2 pr-4">
                            <div className="font-medium">{task.title}</div>
                            {task.episodeRanges.length > 0 && (
                              <div className="text-xs text-muted-foreground">{task.episodeRanges.join(", ")}</div>
                            )}
                          </td>
                          <td className="py-2 pr-4">
                            <BillingMonthPicker
                              value={currentBillingMonth}
                              onChange={(newVal) => {
                                setEditingBillingMonth((prev) => ({ ...prev, [task.id]: newVal }))
                                handleBillingMonthChange(task.id, newVal)
                              }}
                              className="w-40"
                              buttonClassName="px-2 py-1 text-sm h-8"
                            />
                          </td>
                          <td className="py-2 pr-4">
                            <DurationInput
                              value={currentDuration}
                              onChange={(value) => {
                                setEditingDuration((prev) => ({ ...prev, [task.id]: value }))
                              }}
                              onBlur={(value) => {
                                const newDuration = value || "00:10:00"
                                handleDurationChange(task.id, newDuration)
                              }}
                            />
                          </td>
                          <td className="py-2 pr-4">{task.category || "-"}</td>
                          <td className="py-2 pr-4 text-muted-foreground">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span>{formatRupiah(currentRate)}/hour</span>
                              {currentOverride && (
                                <span className="text-[10px] bg-amber-500/15 text-amber-800 border border-amber-500/30 px-1.5 py-0.5 rounded font-medium">
                                  {currentOverride === "no_caption" ? "No Caption Rate" : "Caption Rate"}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2 pr-4 font-medium">{formatRupiah(displayAmount)}</td>
                          <td className="py-2 pr-4 text-right relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveMenuTaskId((prev) => (prev === task.id ? null : task.id))
                              }}
                              className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                              title="Rate Adjustment Menu"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {activeMenuTaskId === task.id && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-9 z-50 w-64 bg-white border border-border rounded-lg shadow-xl py-1 text-xs text-left"
                              >
                                <div className="px-3 py-1.5 font-semibold border-b border-border text-muted-foreground bg-muted/30">
                                  Rate Adjustment
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRateOverrideChange(
                                      task.id,
                                      currentOverride === "no_caption" ? null : "no_caption"
                                    )
                                  }
                                  className="w-full px-3 py-2 hover:bg-muted flex items-center justify-between transition-colors cursor-pointer"
                                >
                                  <span>Mark as No Caption Rate</span>
                                  {currentOverride === "no_caption" && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRateOverrideChange(
                                      task.id,
                                      currentOverride === "caption" ? null : "caption"
                                    )
                                  }
                                  className="w-full px-3 py-2 hover:bg-muted flex items-center justify-between transition-colors cursor-pointer"
                                >
                                  <span>Mark as Caption Rate</span>
                                  {currentOverride === "caption" && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                                </button>
                                {currentOverride && (
                                  <div className="border-t border-border mt-1 pt-1">
                                    <button
                                      type="button"
                                      onClick={() => handleRateOverrideChange(task.id, null)}
                                      className="w-full px-3 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors cursor-pointer"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5" />
                                      <span>Reset to Default Rate</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
