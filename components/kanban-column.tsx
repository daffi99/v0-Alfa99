"use client"

import type React from "react"

import type { Task } from "./kanban-board"
import { TaskCard } from "./task-card"

interface KanbanColumnProps {
  column: {
    id: string
    title: string
    tasks: Task[]
  }
  onDragStart: (task: Task, columnId: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (columnId: string) => void
  onToggleEpisode: (columnId: string, taskId: string, episodeId: string) => void
  onToggleSubtask: (columnId: string, taskId: string, subtaskId: string) => void
  onEditTask: (task: Task, columnId: string) => void
}

export function KanbanColumn({
  column,
  onDragStart,
  onDragOver,
  onDrop,
  onToggleEpisode,
  onToggleSubtask,
  onEditTask,
}: KanbanColumnProps) {
  return (
    <div
      className="flex flex-col bg-muted/30 rounded-lg p-4 min-h-96"
      onDragOver={onDragOver}
      onDrop={() => onDrop(column.id)}
    >
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">{column.title}</h2>
      <div className="flex-1 space-y-3 overflow-y-auto pr-2">
        {column.tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={() => onDragStart(task, column.id)}
            className="cursor-grab active:cursor-grabbing"
          >
            <TaskCard
              task={task}
              columnId={column.id}
              onToggleEpisode={onToggleEpisode}
              onToggleSubtask={onToggleSubtask}
              onEditTask={onEditTask}
            />
          </div>
        ))}
        {column.tasks.length === 0 && (
          <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">No tasks yet</div>
        )}
      </div>
    </div>
  )
}
