"use client"

import type { Task } from "./kanban-board"
import { CheckCircle2, Circle, Pencil, Loader2 } from "lucide-react"

interface TaskCardProps {
  task: Task
  columnId: string
  onToggleEpisode: (columnId: string, taskId: string, episodeId: string) => void
  onToggleSubtask: (columnId: string, taskId: string, subtaskId: string) => void
  onEditTask: (task: Task, columnId: string) => void
}

export function TaskCard({ task, columnId, onToggleEpisode, onToggleSubtask, onEditTask }: TaskCardProps) {
  const completedEpisodes = task.episodes.filter((ep) => ep.completed).length
  const percentComplete = Math.round((completedEpisodes / task.episodes.length) * 100) || 0

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
      case "Check VO":
        return "bg-blue-100 text-blue-700"
      case "Mixing":
        return "bg-purple-100 text-purple-700"
      case "Mixing SRT":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div
      className={`bg-white rounded-lg p-4 shadow-sm border border-border hover:shadow-md transition-shadow group relative ${task.loading ? "opacity-60" : ""}`}
    >
      {task.loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-lg">
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
        </div>
      )}

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-muted-foreground">Progress</span>
          <span className="text-xs font-semibold text-emerald-600">{percentComplete}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-sm">{task.title}</h3>
          <p className="text-xs text-muted-foreground">Ep. {task.episodeRanges.join(", ")}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-2 mb-3">
            {task.category && (
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${getCategoryColor(task.category)}`}
              >
                {task.category}
              </span>
            )}
            {task.status && (
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${getStatusColor(task.status)}`}
              >
                {task.status}
              </span>
            )}
          </div>
          <button
            onClick={() => onEditTask(task, columnId)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
            disabled={task.loading}
          >
            <Pencil className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && <p className="text-xs text-muted-foreground mb-3">{task.description}</p>}

      {task.episodes.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Episodes {completedEpisodes}/{task.episodes.length}
          </p>
          <div className="grid grid-cols-5 gap-1">
            {task.episodes.map((episode) => (
              <div
                key={episode.id}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleEpisode(columnId, task.id, episode.id)
                }}
                className="flex items-center justify-center cursor-pointer"
              >
                {episode.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Circle className="w-4 h-4 text-border hover:text-muted-foreground" />
                )}
                <span className="text-xs font-medium text-foreground min-w-fit">{episode.number}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtasks */}
      {task.subtasks.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">Sub tasks</p>
          <div className="space-y-1">
            {task.subtasks.map((subtask) => (
              <div
                key={subtask.id}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleSubtask(columnId, task.id, subtask.id)
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                {subtask.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-border flex-shrink-0 hover:text-muted-foreground" />
                )}
                <span
                  className={`text-xs ${subtask.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                >
                  {subtask.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image */}
      {task.image && (
        <div className="mb-3 rounded-md overflow-hidden bg-muted h-24">
          <img src={task.image || "/placeholder.svg"} alt={task.title} className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  )
}
