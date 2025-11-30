"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { KanbanColumn } from "./kanban-column"
import { EditTaskModal } from "./edit-task-modal"

export interface Task {
  id: string
  title: string
  description: string
  episodeRanges: string[]
  category: "Caption" | "No caption" | null
  status: "Check VO" | "Mixing" | "Mixing SRT" | null
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
    tasks: [
      {
        id: "task-1",
        title: "Italian 06",
        description: "Duration 19.00",
        episodeRanges: ["051-060"],
        category: "Caption",
        status: "Check VO",
        episodes: [
          { id: "ep-1", number: "051", completed: false },
          { id: "ep-2", number: "052", completed: false },
          { id: "ep-3", number: "053", completed: false },
          { id: "ep-4", number: "054", completed: false },
          { id: "ep-5", number: "055", completed: false },
          { id: "ep-6", number: "056", completed: false },
          { id: "ep-7", number: "057", completed: false },
          { id: "ep-8", number: "058", completed: false },
          { id: "ep-9", number: "059", completed: false },
          { id: "ep-10", number: "060", completed: false },
        ],
        subtasks: [],
        attachments: [],
      },
      {
        id: "task-2",
        title: "Germany 24",
        description: "Duration 24.00",
        episodeRanges: ["051-060", "066-070"],
        category: "No caption",
        status: "Mixing",
        episodes: [
          { id: "ep-1", number: "051", completed: true },
          { id: "ep-2", number: "052", completed: true },
          { id: "ep-3", number: "053", completed: false },
          { id: "ep-4", number: "054", completed: false },
          { id: "ep-5", number: "055", completed: false },
          { id: "ep-6", number: "056", completed: false },
          { id: "ep-7", number: "057", completed: false },
          { id: "ep-8", number: "058", completed: false },
          { id: "ep-9", number: "059", completed: false },
          { id: "ep-10", number: "060", completed: false },
          { id: "ep-11", number: "066", completed: false },
          { id: "ep-12", number: "067", completed: false },
          { id: "ep-13", number: "068", completed: false },
          { id: "ep-14", number: "069", completed: false },
          { id: "ep-15", number: "070", completed: false },
        ],
        subtasks: [],
        attachments: [],
      },
    ],
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

export function KanbanBoard() {
  const [board, setBoard] = useState<Column[]>(initialBoardData)
  const [editingTask, setEditingTask] = useState<{ task: Task; columnId: string } | null>(null)
  const [draggedTask, setDraggedTask] = useState<{ task: Task; fromColumnId: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
          episodeRanges: task.episode_ranges.split(","),
          category: task.category,
          status: task.status,
          episodes: parseCompletedEpisodes(task.episode_ranges, task.completed_episodes),
          subtasks: [],
          attachments: [],
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

        const transformedBoard: Column[] = [
          { id: "backlog", title: "Backlog", tasks: stageMap["Backlog"] },
          { id: "in-progress", title: "In Progress", tasks: stageMap["In Progress"] },
          { id: "finished", title: "Finished", tasks: stageMap["Finished"] },
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

  const parseCompletedEpisodes = (ranges: string, completedJson: string) => {
    const completed = JSON.parse(completedJson || "[]")
    const rangeArray = ranges.split(",")
    const episodes: Array<{ id: string; number: string; completed: boolean }> = []

    rangeArray.forEach((range) => {
      const [start, end] = range.trim().split("-").map(Number)
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
  }

  const handleDragStart = (task: Task, columnId: string) => {
    setDraggedTask({ task, fromColumnId: columnId })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (columnId: string) => {
    if (!draggedTask) return

    const stageMap: { [key: string]: string } = {
      backlog: "Backlog",
      "in-progress": "In Progress",
      finished: "Finished",
      revision: "Revision",
      "customer-revision": "Customer Revision",
      done: "Done",
    }

    const newStage = stageMap[columnId]

    // Update backend
    fetch(`/api/tasks/${draggedTask.task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: newStage }),
    }).catch(console.error)

    const newBoard = board.map((col) => {
      if (col.id === draggedTask.fromColumnId) {
        return {
          ...col,
          tasks: col.tasks.filter((t) => t.id !== draggedTask.task.id),
        }
      }
      if (col.id === columnId) {
        return {
          ...col,
          tasks: [...col.tasks, { ...draggedTask.task, stage: newStage }],
        }
      }
      return col
    })

    setBoard(newBoard)
    setDraggedTask(null)
  }

  const handleToggleEpisode = async (columnId: string, taskId: string, episodeId: string) => {
    // Set loading state immediately for UI feedback
    const newBoard = board.map((col) => {
      if (col.id === columnId) {
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
    const task = board.find((col) => col.id === columnId)?.tasks.find((t) => t.id === taskId)

    if (!task) return

    // Toggle episode locally
    const updatedTask = {
      ...task,
      episodes: task.episodes.map((ep) => (ep.id === episodeId ? { ...ep, completed: !ep.completed } : ep)),
    }

    // Send to backend
    try {
      const completedEpisodes = updatedTask.episodes.filter((ep) => ep.completed).map((ep) => ep.number)

      await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completedEpisodes }),
      })

      // Update UI with final state
      const finalBoard = board.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: col.tasks.map((t) => (t.id === taskId ? { ...updatedTask, loading: false } : t)),
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
          if (col.id === columnId) {
            return {
              ...col,
              tasks: col.tasks.map((t) => (t.id === taskId ? { ...t, loading: false } : t)),
            }
          }
          return col
        }),
      )
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

  const handleSaveTask = async (updatedTask: Task) => {
    try {
      await fetch(`/api/tasks/${updatedTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updatedTask.title,
          description: updatedTask.description,
          category: updatedTask.category,
          status: updatedTask.status,
        }),
      })

      const newBoard = board.map((col) => {
        if (col.id === editingTask?.columnId) {
          return {
            ...col,
            tasks: col.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
          }
        }
        return col
      })
      setBoard(newBoard)
    } catch (error) {
      console.error("[v0] Failed to save task:", error)
    }

    setEditingTask(null)
  }

  if (isLoading) {
    return <div className="p-8 text-center">Loading tasks...</div>
  }

  return (
    <div className="p-8 h-full">
      <div className="grid grid-cols-3 gap-6 h-full auto-rows-max">
        {board.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onToggleEpisode={handleToggleEpisode}
            onToggleSubtask={handleToggleSubtask}
            onEditTask={handleEditTask}
          />
        ))}
      </div>

      {editingTask && (
        <EditTaskModal task={editingTask.task} onSave={handleSaveTask} onClose={() => setEditingTask(null)} />
      )}
    </div>
  )
}
