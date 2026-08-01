"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { KanbanColumn } from "./kanban-column"
import { EditTaskModal } from "./edit-task-modal"
import { CreateTaskModal } from "./create-task-modal"
import { TaskCard } from "./task-card"
import { ChevronDown, ChevronUp } from "lucide-react"

export interface Task {
  id: string
  title: string
  description: string
  episodeRanges: string[]
  category: "Caption" | "No caption" | null
  status: "Not started" | "In progress" | "Wait VO" | "Finished" | null
  stage?: string
  notes?: string
  created_at?: string
  duration?: string
  billingMonth?: string
  episodes: Array<{
    id: string
    number: string
    completed: boolean
  }>
  subtasks: Array<{
    id: string
    title: string
    completed: boolean
  }>
  attachments: Array<{
    name: string
    url: string
    type: "link" | "file" | "image"
  }>
  image?: string
  loading?: boolean
  progress?: {
    checkVO?: boolean
    pitchShift?: boolean
    mixing?: boolean
    mixingSRT?: boolean
    completed?: boolean
  }
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

const initialBoardData: Column[] = [
  {
    id: "backlog",
    title: "Backlog",
    tasks: [],
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [],
  },
  {
    id: "finished",
    title: "Finished",
    tasks: [],
  },
  {
    id: "revision",
    title: "Revision",
    tasks: [],
  },
  {
    id: "customer-revision",
    title: "Customer Revision",
    tasks: [],
  },
  {
    id: "done",
    title: "Done",
    tasks: [],
  },
]

interface KanbanBoardProps {
  onCreateTaskTrigger?: boolean
  onCreateTaskHandled?: () => void
  searchQuery?: string
}

export function KanbanBoard({ onCreateTaskTrigger, onCreateTaskHandled, searchQuery = "" }: KanbanBoardProps) {
  const [board, setBoard] = useState<Column[]>(initialBoardData)
  const [editingTask, setEditingTask] = useState<{ task: Task; columnId: string } | null>(null)
  const [creatingTask, setCreatingTask] = useState(false)
  const [draggedTask, setDraggedTask] = useState<{ task: Task; fromColumnId: string } | null>(null)
  const [dragSuccessful, setDragSuccessful] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Helper function to sort Finished column by created_at (newest first)
  const sortFinishedColumn = (boardData: Column[]): Column[] => {
    return boardData.map((column) => {
      if (column.id === "finished") {
        const sortedTasks = [...column.tasks].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
          return dateB - dateA // Newest first (descending)
        })
        return { ...column, tasks: sortedTasks }
      }
      return column
    })
  }
  const [isDoneExpanded, setIsDoneExpanded] = useState(false)

  // Handle external trigger to open create modal
  useEffect(() => {
    if (onCreateTaskTrigger) {
      setCreatingTask(true)
      onCreateTaskHandled?.()
    }
  }, [onCreateTaskTrigger, onCreateTaskHandled])

  // Check if a string is a valid UUID
  const isValidUUID = (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(id)
  }

  // Create a task in the database if it doesn't exist (has non-UUID ID)
  const ensureTaskExists = async (task: Task, stage: string): Promise<string> => {
    if (isValidUUID(task.id)) {
      return task.id
    }

    // Task doesn't exist in DB, create it
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          duration: task.duration || "00:10:00",
          category: task.category,
          status: task.status,
          stage: stage,
          episodeRanges: task.episodeRanges,
          completedEpisodes: task.episodes.filter((ep) => ep.completed).map((ep) => ep.number),
          billingMonth: task.billingMonth || "December 2025",
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create task: ${response.statusText}`)
      }

      const newTask = await response.json()
      return newTask.id
    } catch (error) {
      console.error("[v0] Failed to create task:", error)
      throw error
    }
  }

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetch("/api/tasks")
        if (!response.ok) {
          console.log("[v0] Backend unavailable, using local data")
          setBoard(initialBoardData)
          return
        }

        const tasks = await response.json()

        if (!tasks || tasks.length === 0) {
          console.log("[v0] No tasks from backend, using local data")
          setBoard(initialBoardData)
          return
        }

        // Transform Supabase data to UI format
        const transformedTasks = tasks.map((task: any) => ({
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
          billingMonth: task.billing_month || "December",
          episodes: parseCompletedEpisodes(task.episode_ranges || "", task.completed_episodes || "[]"),
          subtasks: [],
          attachments: [],
          progress: task.progress ? (typeof task.progress === 'string' ? JSON.parse(task.progress) : task.progress) : {},
        }))

        // Group tasks by stage
        const stageMap: { [key: string]: Task[] } = {
          Backlog: [],
          "In Progress": [],
          Finished: [],
          Revision: [],
          "Customer Revision": [],
          Done: [],
        }

        transformedTasks.forEach((task: Task) => {
          const stage = task.stage || "Backlog"
          stageMap[stage]?.push(task)
        })

        // Sort Finished tasks by created_at (newest first / descending)
        const finishedTasks = stageMap["Finished"].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
          return dateB - dateA // Newest first (descending)
        })

        const transformedBoard: Column[] = [
          { id: "backlog", title: "Backlog", tasks: stageMap["Backlog"] },
          { id: "in-progress", title: "In Progress", tasks: stageMap["In Progress"] },
          { id: "finished", title: "Finished", tasks: finishedTasks },
          { id: "revision", title: "Revision", tasks: stageMap["Revision"] },
          { id: "customer-revision", title: "Customer Revision", tasks: stageMap["Customer Revision"] },
          { id: "done", title: "Done", tasks: stageMap["Done"] },
        ]

        setBoard(transformedBoard)
      } catch (error) {
        console.error("[v0] Failed to load tasks:", error)
        setBoard(initialBoardData)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

  // Filter tasks based on search query
  const filteredBoard = board.map(column => ({
    ...column,
    tasks: column.tasks.filter(task => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return task.title.toLowerCase().includes(query)
    })
  }))

  const parseCompletedEpisodes = (ranges: string, completedJson: string) => {
    try {
      const completed = JSON.parse(completedJson || "[]")
      if (!ranges || ranges.trim() === "") {
        return []
      }
      const rangeArray = ranges.split(",")
      const episodes: Array<{ id: string; number: string; completed: boolean }> = []

      rangeArray.forEach((range) => {
        const trimmed = range.trim()
        if (!trimmed) return
        const [start, end] = trimmed.split("-").map(Number)
        if (isNaN(start) || isNaN(end)) return
        for (let i = start; i <= end; i++) {
          const number = String(i).padStart(3, "0")
          episodes.push({
            id: `ep-${number}`,
            number,
            completed: completed.includes(number),
          })
        }
      })

      return episodes
    } catch (error) {
      console.error("[v0] Failed to parse episodes:", error)
      return []
    }
  }

  const [originalBoardState, setOriginalBoardState] = useState<Column[] | null>(null)

  const handleDragStart = (task: Task, columnId: string) => {
    setDraggedTask({ task, fromColumnId: columnId })
    setDragSuccessful(false)
    // Save the current board state before drag
    setOriginalBoardState(board)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDragEnd = () => {
    // If drag ended without successful drop, restore the original board state
    if (draggedTask && !dragSuccessful && originalBoardState) {
      setBoard(originalBoardState)
    }
    setDraggedTask(null)
    setDragSuccessful(false)
    setOriginalBoardState(null)
  }

  // Helper function to map split column IDs to actual board column IDs
  const mapColumnId = (columnId: string): string => {
    const columnIdMap: { [key: string]: string } = {
      "in-progress-1": "in-progress",
      "in-progress-2": "in-progress",
    }
    return columnIdMap[columnId] || columnId
  }

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (!draggedTask) return

    const stageMap: { [key: string]: string } = {
      backlog: "Backlog",
      "in-progress": "In Progress",
      "in-progress-1": "In Progress",
      "in-progress-2": "In Progress",
      finished: "Finished",
      revision: "Revision",
      "customer-revision": "Customer Revision",
      done: "Done",
    }

    const newStage = stageMap[columnId]
    if (!newStage) {
      // Invalid drop zone, restore state
      if (originalBoardState) {
        setBoard(originalBoardState)
      }
      setDraggedTask(null)
      setDragSuccessful(false)
      setOriginalBoardState(null)
      return
    }

    const actualColumnId = mapColumnId(columnId)

    // Save current state for potential revert
    const previousBoard = board

    // Optimistically update UI
    const newBoard = board.map((col) => {
      // Map fromColumnId as well if needed
      const actualFromColumnId = mapColumnId(draggedTask.fromColumnId)

      // Same column - just update the stage without removing/adding
      if (col.id === actualFromColumnId && col.id === actualColumnId) {
        return {
          ...col,
          tasks: col.tasks.map((t) =>
            t.id === draggedTask.task.id ? { ...t, stage: newStage } : t
          ),
        }
      }

      // Remove from source column
      if (col.id === actualFromColumnId) {
        return {
          ...col,
          tasks: col.tasks.filter((t) => t.id !== draggedTask.task.id),
        }
      }

      // Add to target column
      if (col.id === actualColumnId) {
        return {
          ...col,
          tasks: [...col.tasks, { ...draggedTask.task, stage: newStage }],
        }
      }
      return col
    })

    setBoard(sortFinishedColumn(newBoard))
    setDragSuccessful(true)
    setDraggedTask(null)

    // Update backend - ensure task exists first if it has a non-UUID ID
    ensureTaskExists(draggedTask.task, newStage)
      .then((taskId) => {
        return fetch(`/api/tasks/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stage: newStage }),
        })
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to update task: ${response.statusText}`)
        }
        return response.json()
      })
      .then((updatedTask) => {
        // Update the task ID in the board if it was created
        if (!isValidUUID(draggedTask.task.id)) {
          setBoard((prevBoard) =>
            prevBoard.map((col) => ({
              ...col,
              tasks: col.tasks.map((t) => (t.id === draggedTask.task.id ? { ...t, id: updatedTask.id } : t)),
            })),
          )
        }
      })
      .catch((error) => {
        console.error("[v0] Failed to update task stage:", error)
        // Revert the UI change on error
        setBoard(previousBoard)
        alert("Failed to save changes. Please try again.")
      })
  }

  const moveTaskDirectly = async (task: Task, fromColumnId: string, toColumnId: string) => {
    const stageMap: { [key: string]: string } = {
      backlog: "Backlog",
      "in-progress": "In Progress",
      finished: "Finished",
      revision: "Revision",
      "customer-revision": "Customer Revision",
      done: "Done",
    }

    const newStage = stageMap[toColumnId]
    if (!newStage) return

    const actualFromColumnId = mapColumnId(fromColumnId)
    const actualToColumnId = mapColumnId(toColumnId)

    // Save current state for potential revert
    const previousBoard = board

    // Optimistically update UI
    const newBoard = board.map((col) => {
      // Same column - just update stage
      if (col.id === actualFromColumnId && col.id === actualToColumnId) {
        return {
          ...col,
          tasks: col.tasks.map((t) =>
            t.id === task.id ? { ...t, stage: newStage } : t
          ),
        }
      }

      // Remove from source column
      if (col.id === actualFromColumnId) {
        return {
          ...col,
          tasks: col.tasks.filter((t) => t.id !== task.id),
        }
      }

      // Add to target column
      if (col.id === actualToColumnId) {
        return {
          ...col,
          tasks: [...col.tasks, { ...task, stage: newStage }],
        }
      }
      return col
    })

    setBoard(sortFinishedColumn(newBoard))

    try {
      const dbTaskId = await ensureTaskExists(task, newStage)
      const response = await fetch(`/api/tasks/${dbTaskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update task: ${response.statusText}`)
      }
      const updatedTask = await response.json()

      // Update task ID in board if it was created
      if (!isValidUUID(task.id)) {
        setBoard((prevBoard) =>
          prevBoard.map((col) => ({
            ...col,
            tasks: col.tasks.map((t) => (t.id === task.id ? { ...t, id: updatedTask.id } : t)),
          })),
        )
      }
    } catch (error) {
      console.error("[v0] Failed to update task stage:", error)
      setBoard(previousBoard)
      alert("Failed to save changes. Please try again.")
    }
  }

  const handleToggleEpisode = async (columnId: string, taskId: string, episodeId: string) => {
    const actualColumnId = mapColumnId(columnId)
    // Set loading state immediately for UI feedback
    const newBoard = board.map((col) => {
      if (col.id === actualColumnId) {
        return {
          ...col,
          tasks: col.tasks.map((task) => {
            if (task.id === taskId) {
              return {
                ...task,
                loading: true,
              }
            }
            return task
          }),
        }
      }
      return col
    })
    setBoard(newBoard)

    // Find the episode and task
    const task = board.find((col) => col.id === actualColumnId)?.tasks.find((t) => t.id === taskId)

    if (!task) return

    // Toggle episode locally
    const updatedTask = {
      ...task,
      episodes: task.episodes.map((ep) => (ep.id === episodeId ? { ...ep, completed: !ep.completed } : ep)),
    }

    // Send to backend - ensure task exists first if it has a non-UUID ID
    try {
      const completedEpisodes = updatedTask.episodes.filter((ep) => ep.completed).map((ep) => ep.number)

      // Get the current stage for the task
      const currentColumn = board.find((col) => col.id === actualColumnId)
      const currentTask = currentColumn?.tasks.find((t) => t.id === taskId)
      const currentStage = currentTask?.stage || "Backlog"

      // Ensure task exists in database
      const dbTaskId = await ensureTaskExists(updatedTask, currentStage)

      const response = await fetch(`/api/tasks/${dbTaskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completedEpisodes }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to update: ${response.statusText}`)
      }

      const savedTask = await response.json()

      // Update UI with final state - update task ID if it was created
      const finalBoard = board.map((col) => {
        if (col.id === actualColumnId) {
          return {
            ...col,
            tasks: col.tasks.map((t) =>
              t.id === taskId ? { ...updatedTask, id: dbTaskId, loading: false } : t,
            ),
          }
        }
        return col
      })
      setBoard(finalBoard)
    } catch (error) {
      console.error("[v0] Failed to update episode:", error)
      // Revert on error
      setBoard(
        newBoard.map((col) => {
          if (col.id === actualColumnId) {
            return {
              ...col,
              tasks: col.tasks.map((t) => (t.id === taskId ? { ...t, loading: false } : t)),
            }
          }
          return col
        }),
      )
      alert("Failed to save episode progress. Please try again.")
    }
  }

  const handleToggleSubtask = (columnId: string, taskId: string, subtaskId: string) => {
    const newBoard = board.map((col) => {
      if (col.id === columnId) {
        return {
          ...col,
          tasks: col.tasks.map((task) => {
            if (task.id === taskId) {
              return {
                ...task,
                subtasks: task.subtasks.map((st) => (st.id === subtaskId ? { ...st, completed: !st.completed } : st)),
              }
            }
            return task
          }),
        }
      }
      return col
    })
    setBoard(newBoard)
  }

  const handleEditTask = (task: Task, columnId: string) => {
    setEditingTask({ task, columnId })
  }

  const handleUpdateStatus = async (
    columnId: string,
    taskId: string,
    status: "Not started" | "In progress" | "Wait VO" | "Finished" | null,
  ) => {
    const actualColumnId = mapColumnId(columnId)
    try {
      // Find the task to get its current stage
      const currentColumn = board.find((col) => col.id === actualColumnId)
      const currentTask = currentColumn?.tasks.find((t) => t.id === taskId)

      if (!currentTask) return

      const currentStage = currentTask.stage || "Backlog"

      // Ensure task exists in database
      const dbTaskId = await ensureTaskExists(currentTask, currentStage)

      const response = await fetch(`/api/tasks/${dbTaskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to update status: ${response.statusText}`)
      }

      // Update UI
      const newBoard = board.map((col) => {
        if (col.id === actualColumnId) {
          return {
            ...col,
            tasks: col.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
          }
        }
        return col
      })
      setBoard(newBoard)
    } catch (error) {
      console.error("[v0] Failed to update status:", error)
      // Revert the status change on error
      const currentColumn = board.find((col) => col.id === actualColumnId)
      const currentTask = currentColumn?.tasks.find((t) => t.id === taskId)
      const newBoard = board.map((col) => {
        if (col.id === actualColumnId) {
          return {
            ...col,
            tasks: col.tasks.map((t) => (t.id === taskId ? { ...t, status: currentTask?.status || null } : t)),
          }
        }
        return col
      })
      setBoard(newBoard)
    }
  }

  const handleUpdateNote = async (columnId: string, taskId: string, notes: string) => {
    const actualColumnId = mapColumnId(columnId)
    try {
      // Find the task to get its current stage
      const currentColumn = board.find((col) => col.id === actualColumnId)
      const currentTask = currentColumn?.tasks.find((t) => t.id === taskId)

      if (!currentTask) return

      const currentStage = currentTask.stage || "Backlog"

      // Ensure task exists in database
      const dbTaskId = await ensureTaskExists(currentTask, currentStage)

      const response = await fetch(`/api/tasks/${dbTaskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to update note: ${response.statusText}`)
      }

      // Update UI
      const newBoard = board.map((col) => {
        if (col.id === actualColumnId) {
          return {
            ...col,
            tasks: col.tasks.map((t) => (t.id === taskId ? { ...t, notes } : t)),
          }
        }
        return col
      })
      setBoard(newBoard)
    } catch (error) {
      console.error("[v0] Failed to update note:", error)
      // Revert the note change on error
      const currentColumn = board.find((col) => col.id === actualColumnId)
      const currentTask = currentColumn?.tasks.find((t) => t.id === taskId)
      const newBoard = board.map((col) => {
        if (col.id === actualColumnId) {
          return {
            ...col,
            tasks: col.tasks.map((t) => (t.id === taskId ? { ...t, notes: currentTask?.notes || "" } : t)),
          }
        }
        return col
      })
      setBoard(newBoard)
    }
  }

  const handleCreateTask = async (taskData: {
    title: string
    description: string
    episodeRanges: string[]
    category: "Caption" | "No caption" | null
    status: "Not started" | "In progress" | "Wait VO" | "Finished" | null
    stage: string
    duration: string
    billingMonth: string
  }) => {
    try {
      // Create task in database
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          duration: taskData.duration || "00:10:00",
          category: taskData.category,
          status: taskData.status,
          stage: taskData.stage,
          episodeRanges: taskData.episodeRanges,
          completedEpisodes: [],
          billingMonth: taskData.billingMonth || "December",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to create task: ${response.statusText}`)
      }

      const savedTask = await response.json()

      // Transform the saved task to UI format
      const newTask: Task = {
        id: savedTask.id,
        title: savedTask.title,
        description: savedTask.description,
        episodeRanges: savedTask.episode_ranges ? savedTask.episode_ranges.split(",") : [],
        category: savedTask.category,
        status: savedTask.status,
        stage: savedTask.stage || "Backlog",
        notes: savedTask.notes || "",
        created_at: savedTask.created_at || savedTask.createdAt || null,
        duration: savedTask.duration || "00:10:00",
        billingMonth: savedTask.billing_month || "December",
        episodes: parseCompletedEpisodes(savedTask.episode_ranges || "", savedTask.completed_episodes || "[]"),
        subtasks: [],
        attachments: [],
        progress: savedTask.progress ? (typeof savedTask.progress === 'string' ? JSON.parse(savedTask.progress) : savedTask.progress) : {},
      }

      // Map stage to column ID
      const stageToColumnId: { [key: string]: string } = {
        Backlog: "backlog",
        "In Progress": "in-progress",
        Finished: "finished",
        Revision: "revision",
        "Customer Revision": "customer-revision",
        Done: "done",
      }

      const columnId = stageToColumnId[newTask.stage || "Backlog"] || "backlog"

      // Add task to the appropriate column
      const newBoard = board.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: [...col.tasks, newTask],
          }
        }
        return col
      })

      setBoard(sortFinishedColumn(newBoard))
      setCreatingTask(false)
    } catch (error) {
      console.error("[v0] Failed to create task:", error)
      alert("Failed to create task. Please try again.")
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to delete task: ${response.statusText}`)
      }

      // Remove task from board
      const newBoard = board.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => t.id !== taskId),
      }))

      setBoard(newBoard)
      setEditingTask(null)
    } catch (error) {
      console.error("[v0] Failed to delete task:", error)
      alert("Failed to delete task. Please try again.")
    }
  }

  const handleSaveTask = async (updatedTask: Task) => {
    try {
      // Get the current stage for the task
      const actualColumnId = editingTask?.columnId ? mapColumnId(editingTask.columnId) : undefined
      const currentColumn = actualColumnId ? board.find((col) => col.id === actualColumnId) : undefined
      const currentTask = currentColumn?.tasks.find((t) => t.id === updatedTask.id)
      const currentStage = currentTask?.stage || updatedTask.stage || "Backlog"

      // Ensure task exists in database
      const dbTaskId = await ensureTaskExists(updatedTask, currentStage)

      const response = await fetch(`/api/tasks/${dbTaskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updatedTask.title,
          description: updatedTask.description,
          category: updatedTask.category,
          status: updatedTask.status,
          episodeRanges: updatedTask.episodeRanges,
          duration: updatedTask.duration,
          billingMonth: updatedTask.billingMonth,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to save: ${response.statusText}`)
      }

      const savedTask = await response.json()

      const newBoard = board.map((col) => {
        if (col.id === actualColumnId) {
          return {
            ...col,
            tasks: col.tasks.map((t) => (t.id === updatedTask.id ? { ...updatedTask, id: dbTaskId } : t)),
          }
        }
        return col
      })
      setBoard(sortFinishedColumn(newBoard))
      setEditingTask(null)
    } catch (error) {
      console.error("[v0] Failed to save task:", error)
      alert("Failed to save task changes. Please try again.")
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center">Loading tasks...</div>
  }

  // Separate columns into rows
  const backlogColumn = filteredBoard.find((col) => col.id === "backlog")
  const inProgressColumn = filteredBoard.find((col) => col.id === "in-progress")
  const row2Columns = filteredBoard.filter((col) => ["finished", "revision", "customer-revision"].includes(col.id))
  const doneColumn = filteredBoard.find((col) => col.id === "done")

  // Split In Progress tasks into 2 groups, distributing to emptier column first
  // Sort tasks by created_at (newest first)
  const inProgressTasks = [...(inProgressColumn?.tasks || [])].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
    return dateB - dateA // Newest first
  })

  const inProgressCol1: Task[] = []
  const inProgressCol2: Task[] = []

  // Distribute tasks to keep columns balanced (emptier column gets priority)
  inProgressTasks.forEach((task, index) => {
    if (inProgressCol1.length <= inProgressCol2.length) {
      inProgressCol1.push(task)
    } else {
      inProgressCol2.push(task)
    }
  })

  // Split Done tasks into 3 groups, distributing to emptier column first
  // Sort tasks by created_at (newest first)
  const doneTasks = [...(doneColumn?.tasks || [])].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
    return dateB - dateA // Newest first
  })

  const doneCol1: Task[] = []
  const doneCol2: Task[] = []
  const doneCol3: Task[] = []

  // Distribute tasks to keep columns balanced (emptier column gets priority)
  doneTasks.forEach((task, index) => {
    if (doneCol1.length <= doneCol2.length && doneCol1.length <= doneCol3.length) {
      doneCol1.push(task)
    } else if (doneCol2.length <= doneCol3.length) {
      doneCol2.push(task)
    } else {
      doneCol3.push(task)
    }
  })

  return (
    <>
      <div className="p-8 h-full">
        <div className="flex flex-col gap-6 h-full">
          {/* Row 1: Backlog, In Progress (unified with 2 columns) */}
          <div className="grid grid-cols-3 gap-6">
            {/* Backlog column */}
            {backlogColumn && (
              <KanbanColumn
                column={backlogColumn}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={(e, columnId) => handleDrop(e, columnId)}
                onDragEnd={handleDragEnd}
                onToggleEpisode={handleToggleEpisode}
                onToggleSubtask={handleToggleSubtask}
                onEditTask={handleEditTask}
                onUpdateNote={handleUpdateNote}
                onUpdateStatus={handleUpdateStatus}
                onMoveTask={moveTaskDirectly}
                searchQuery={searchQuery}
              />
            )}
            {/* In Progress - Unified section with 2 columns */}
            {inProgressColumn && (
              <div className={`col-span-2 flex flex-col bg-muted/30 rounded-lg p-4 ${searchQuery && inProgressTasks.length === 0 ? "" : "min-h-96"}`}>
                {/* Single title spanning both columns */}
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  {inProgressColumn.title}
                </h2>
                {/* Two columns side by side */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                  {/* Column 1 */}
                  <div
                    className="flex flex-col space-y-3 overflow-y-auto pr-2"
                    onDragOver={handleDragOver}
                    onDrop={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleDrop(e, "in-progress")
                    }}
                  >
                    {inProgressCol1.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onMouseDown={(e) => {
                          const cardElement = (e.currentTarget as HTMLElement).querySelector('[data-editing-note="true"]')
                          if (cardElement) {
                            e.currentTarget.setAttribute('draggable', 'false')
                            setTimeout(() => {
                              e.currentTarget?.setAttribute('draggable', 'true')
                            }, 100)
                          }
                        }}
                        onDragStart={(e) => {
                          const target = e.target as HTMLElement
                          const wrapper = e.currentTarget as HTMLElement
                          const cardElement = wrapper.querySelector('[data-editing-note="true"]')

                          if (
                            cardElement ||
                            target.closest('[data-editing-note="true"]') ||
                            target.closest("button") ||
                            target.closest("textarea") ||
                            target.closest("input") ||
                            target.closest("[role='button']") ||
                            target.closest(".editorjs-note-container") ||
                            target.closest(".codex-editor") ||
                            target.closest(".ce-block") ||
                            target.closest(".ce-toolbar") ||
                            target.closest(".ce-popover") ||
                            target.closest(".ce-inline-toolbar") ||
                            target.closest(".tiptap-note-editor") ||
                            target.closest(".ProseMirror") ||
                            target.closest(".group\\/note")
                          ) {
                            e.preventDefault()
                            e.stopPropagation()
                            return false
                          }
                          handleDragStart(task, "in-progress")
                        }}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => {
                          // Prevent cards from accepting drops
                          e.stopPropagation()
                        }}
                        onDrop={(e) => {
                          // Prevent cards from accepting drops
                          e.stopPropagation()
                          e.preventDefault()
                        }}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <TaskCard
                          task={task}
                          columnId="in-progress"
                          onToggleEpisode={handleToggleEpisode}
                          onToggleSubtask={handleToggleSubtask}
                          onEditTask={handleEditTask}
                          onUpdateNote={handleUpdateNote}
                          onUpdateStatus={handleUpdateStatus}
                          onMoveTask={moveTaskDirectly}
                        />
                      </div>
                    ))}
                    {inProgressCol1.length === 0 && (
                      <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">No tasks yet</div>
                    )}
                  </div>
                  {/* Column 2 */}
                  <div
                    className="flex flex-col space-y-3 overflow-y-auto pr-2"
                    onDragOver={handleDragOver}
                    onDrop={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleDrop(e, "in-progress")
                    }}
                  >
                    {inProgressCol2.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onMouseDown={(e) => {
                          const cardElement = (e.currentTarget as HTMLElement).querySelector('[data-editing-note="true"]')
                          if (cardElement) {
                            e.currentTarget.setAttribute('draggable', 'false')
                            setTimeout(() => {
                              e.currentTarget?.setAttribute('draggable', 'true')
                            }, 100)
                          }
                        }}
                        onDragStart={(e) => {
                          const target = e.target as HTMLElement
                          const wrapper = e.currentTarget as HTMLElement
                          const cardElement = wrapper.querySelector('[data-editing-note="true"]')

                          if (
                            cardElement ||
                            target.closest('[data-editing-note="true"]') ||
                            target.closest("button") ||
                            target.closest("textarea") ||
                            target.closest("input") ||
                            target.closest("[role='button']") ||
                            target.closest(".editorjs-note-container") ||
                            target.closest(".codex-editor") ||
                            target.closest(".ce-block") ||
                            target.closest(".ce-toolbar") ||
                            target.closest(".ce-popover") ||
                            target.closest(".ce-inline-toolbar") ||
                            target.closest(".tiptap-note-editor") ||
                            target.closest(".ProseMirror") ||
                            target.closest(".group\\/note")
                          ) {
                            e.preventDefault()
                            e.stopPropagation()
                            return false
                          }
                          handleDragStart(task, "in-progress")
                        }}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => {
                          // Prevent cards from accepting drops
                          e.stopPropagation()
                        }}
                        onDrop={(e) => {
                          // Prevent cards from accepting drops
                          e.stopPropagation()
                          e.preventDefault()
                        }}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <TaskCard
                          task={task}
                          columnId="in-progress"
                          onToggleEpisode={handleToggleEpisode}
                          onToggleSubtask={handleToggleSubtask}
                          onEditTask={handleEditTask}
                          onUpdateNote={handleUpdateNote}
                          onUpdateStatus={handleUpdateStatus}
                          onMoveTask={moveTaskDirectly}
                        />
                      </div>
                    ))}
                    {inProgressCol2.length === 0 && (
                      <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">No tasks yet</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Row 2: Finished, Revision, Customer Revision (3 columns) */}
          <div className="grid grid-cols-3 gap-6">
            {row2Columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={(e, columnId) => handleDrop(e, columnId)}
                onDragEnd={handleDragEnd}
                onToggleEpisode={handleToggleEpisode}
                onToggleSubtask={handleToggleSubtask}
                onEditTask={handleEditTask}
                onUpdateNote={handleUpdateNote}
                onUpdateStatus={handleUpdateStatus}
                onMoveTask={moveTaskDirectly}
                searchQuery={searchQuery}
              />
            ))}
          </div>

          {/* Row 3: Done (unified with 3 columns) */}
          <div className="grid grid-cols-3 gap-6">
            {doneColumn && (
              <div className={`col-span-3 flex flex-col bg-muted/30 rounded-lg p-4 ${searchQuery && doneTasks.length === 0 ? "" : "min-h-96"}`}>
                {/* Single title spanning all columns with expand/collapse button */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {doneColumn.title}
                  </h2>
                  <button
                    onClick={() => setIsDoneExpanded(!isDoneExpanded)}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                    title={isDoneExpanded ? "Collapse" : "Expand"}
                  >
                    {isDoneExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        <span>Collapse</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        <span>Expand</span>
                      </>
                    )}
                  </button>
                </div>
                {/* Scrollable container with max height and fade effect */}
                <div className="relative flex-1" style={{ maxHeight: isDoneExpanded ? '600px' : '300px' }}>
                  <div
                    className={`h-full pr-2 ${isDoneExpanded ? 'overflow-y-auto' : 'overflow-hidden'}`}
                    style={isDoneExpanded ? {
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#cbd5e1 transparent'
                    } : {}}
                  >
                    {/* Three columns side by side */}
                    <div className="grid grid-cols-3 gap-4">
                      {/* Column 1 */}
                      <div
                        className="flex flex-col space-y-3"
                        onDragOver={handleDragOver}
                        onDrop={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDrop(e, "done")
                        }}
                      >
                        {doneCol1.map((task) => (
                          <div
                            key={task.id}
                            draggable
                            onMouseDown={(e) => {
                              const cardElement = (e.currentTarget as HTMLElement).querySelector('[data-editing-note="true"]')
                              if (cardElement) {
                                e.currentTarget.setAttribute('draggable', 'false')
                                setTimeout(() => {
                                  e.currentTarget?.setAttribute('draggable', 'true')
                                }, 100)
                              }
                            }}
                            onDragStart={(e) => {
                              const target = e.target as HTMLElement
                              const wrapper = e.currentTarget as HTMLElement
                              const cardElement = wrapper.querySelector('[data-editing-note="true"]')
                              if (
                                cardElement ||
                                target.closest('[data-editing-note="true"]') ||
                                target.closest("button") ||
                                target.closest("textarea") ||
                                target.closest("input") ||
                                target.closest("[role='button']") ||
                                target.closest(".tiptap-note-editor") ||
                                target.closest(".ProseMirror") ||
                                target.closest(".group\\/note")
                              ) {
                                e.preventDefault()
                                e.stopPropagation()
                                return
                              }
                              handleDragStart(task, "done")
                            }}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => {
                              e.stopPropagation()
                            }}
                            onDrop={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                            }}
                            className="cursor-grab active:cursor-grabbing"
                          >
                            <TaskCard
                              task={task}
                              columnId="done"
                              onToggleEpisode={handleToggleEpisode}
                              onToggleSubtask={handleToggleSubtask}
                              onEditTask={handleEditTask}
                              onUpdateNote={handleUpdateNote}
                              onUpdateStatus={handleUpdateStatus}
                              onMoveTask={moveTaskDirectly}
                            />
                          </div>
                        ))}
                        {doneCol1.length === 0 && (
                          <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">No tasks yet</div>
                        )}
                      </div>
                      {/* Column 2 */}
                      <div
                        className="flex flex-col space-y-3"
                        onDragOver={handleDragOver}
                        onDrop={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDrop(e, "done")
                        }}
                      >
                        {doneCol2.map((task) => (
                          <div
                            key={task.id}
                            draggable
                            onMouseDown={(e) => {
                              const cardElement = (e.currentTarget as HTMLElement).querySelector('[data-editing-note="true"]')
                              if (cardElement) {
                                e.currentTarget.setAttribute('draggable', 'false')
                                setTimeout(() => {
                                  e.currentTarget?.setAttribute('draggable', 'true')
                                }, 100)
                              }
                            }}
                            onDragStart={(e) => {
                              const target = e.target as HTMLElement
                              const wrapper = e.currentTarget as HTMLElement
                              const cardElement = wrapper.querySelector('[data-editing-note="true"]')
                              if (
                                cardElement ||
                                target.closest('[data-editing-note="true"]') ||
                                target.closest("button") ||
                                target.closest("textarea") ||
                                target.closest("input") ||
                                target.closest("[role='button']") ||
                                target.closest(".tiptap-note-editor") ||
                                target.closest(".ProseMirror") ||
                                target.closest(".group\\/note")
                              ) {
                                e.preventDefault()
                                e.stopPropagation()
                                return
                              }
                              handleDragStart(task, "done")
                            }}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => {
                              e.stopPropagation()
                            }}
                            onDrop={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                            }}
                            className="cursor-grab active:cursor-grabbing"
                          >
                            <TaskCard
                              task={task}
                              columnId="done"
                              onToggleEpisode={handleToggleEpisode}
                              onToggleSubtask={handleToggleSubtask}
                              onEditTask={handleEditTask}
                              onUpdateNote={handleUpdateNote}
                              onUpdateStatus={handleUpdateStatus}
                              onMoveTask={moveTaskDirectly}
                            />
                          </div>
                        ))}
                        {doneCol2.length === 0 && (
                          <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">No tasks yet</div>
                        )}
                      </div>
                      {/* Column 3 */}
                      <div
                        className="flex flex-col space-y-3"
                        onDragOver={handleDragOver}
                        onDrop={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDrop(e, "done")
                        }}
                      >
                        {doneCol3.map((task) => (
                          <div
                            key={task.id}
                            draggable
                            onMouseDown={(e) => {
                              const cardElement = (e.currentTarget as HTMLElement).querySelector('[data-editing-note="true"]')
                              if (cardElement) {
                                e.currentTarget.setAttribute('draggable', 'false')
                                setTimeout(() => {
                                  e.currentTarget?.setAttribute('draggable', 'true')
                                }, 100)
                              }
                            }}
                            onDragStart={(e) => {
                              const target = e.target as HTMLElement
                              const wrapper = e.currentTarget as HTMLElement
                              const cardElement = wrapper.querySelector('[data-editing-note="true"]')
                              if (
                                cardElement ||
                                target.closest('[data-editing-note="true"]') ||
                                target.closest("button") ||
                                target.closest("textarea") ||
                                target.closest("input") ||
                                target.closest("[role='button']") ||
                                target.closest(".tiptap-note-editor") ||
                                target.closest(".ProseMirror") ||
                                target.closest(".group\\/note")
                              ) {
                                e.preventDefault()
                                e.stopPropagation()
                                return
                              }
                              handleDragStart(task, "done")
                            }}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => {
                              e.stopPropagation()
                            }}
                            onDrop={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                            }}
                            className="cursor-grab active:cursor-grabbing"
                          >
                            <TaskCard
                              task={task}
                              columnId="done"
                              onToggleEpisode={handleToggleEpisode}
                              onToggleSubtask={handleToggleSubtask}
                              onEditTask={handleEditTask}
                              onUpdateNote={handleUpdateNote}
                              onUpdateStatus={handleUpdateStatus}
                              onMoveTask={moveTaskDirectly}
                            />
                          </div>
                        ))}
                        {doneCol3.length === 0 && (
                          <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">No tasks yet</div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Fade effect at bottom to indicate scrollable content - only show when expanded */}
                  {isDoneExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-muted/30 to-transparent pointer-events-none" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {editingTask && (
        <EditTaskModal
          task={editingTask.task}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          onClose={() => setEditingTask(null)}
        />
      )}

      {creatingTask && (
        <CreateTaskModal onSave={handleCreateTask} onClose={() => setCreatingTask(false)} />
      )}
    </>
  )
}

