"use client"

import type React from "react"
import { useState, useEffect } from "react"

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
  onDrop: (e: React.DragEvent, columnId: string) => void
  onDragEnd?: () => void
  onToggleEpisode: (columnId: string, taskId: string, episodeId: string) => void
  onToggleSubtask: (columnId: string, taskId: string, subtaskId: string) => void
  onEditTask: (task: Task, columnId: string) => void
  onUpdateNote: (columnId: string, taskId: string, notes: string) => void
  onUpdateStatus: (columnId: string, taskId: string, status: "Not started" | "In progress" | "Wait VO" | "Finished" | null) => void
  onMoveTask?: (task: Task, fromColumnId: string, toColumnId: string) => void
  onUpdateScriptData?: (columnId: string, taskId: string, scriptData: any) => void
  searchQuery?: string
}

export function KanbanColumn({
  column,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onToggleEpisode,
  onToggleSubtask,
  onEditTask,
  onUpdateNote,
  onUpdateStatus,
  onMoveTask,
  onUpdateScriptData,
  searchQuery = "",
}: KanbanColumnProps) {
  const [hasEditingCard, setHasEditingCard] = useState(false)

  // Detect if any card in this column is being edited
  useEffect(() => {
    const checkEditing = () => {
      const editingCard = document.querySelector(`[data-column-id="${column.id}"] [data-editing-note="true"]`)
      setHasEditingCard(!!editingCard)
    }

    // Use MutationObserver to detect changes
    const observer = new MutationObserver(checkEditing)
    const columnEl = document.querySelector(`[data-column-id="${column.id}"]`)
    if (columnEl) {
      observer.observe(columnEl, { attributes: true, subtree: true, attributeFilter: ['data-editing-note'] })
    }

    return () => observer.disconnect()
  }, [column.id])

  const isSearchEmpty = searchQuery && column.tasks.length === 0
  const unfinishedCount = column.tasks.filter((t) => {
    if (t.status === "Finished") return false
    const isTodayTask = t.title && t.title.trim().toLowerCase() === "today task"
    if (isTodayTask) return false
    return true
  }).length

  return (
    <div
      className={`flex flex-col bg-muted/30 rounded-lg p-4 ${isSearchEmpty ? "" : "min-h-96"}`}
      data-column-id={column.id}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, column.id)}
    >
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
        <span>{column.title}</span>
        {unfinishedCount > 0 && (
          <span className="inline-flex items-center justify-center bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full lowercase tracking-normal">
            {unfinishedCount}
          </span>
        )}
      </h2>
      <div className="flex-1 space-y-3 pr-2 overflow-y-auto kanban-column-scroll-container">
        {column.tasks.map((task) => {
          // Check if this card is being edited by looking at the rendered element
          const isEditing = false // Will be determined by the DOM
          return (
            <div
              key={task.id}
              draggable={true}
              onMouseDown={(e) => {
                // Check if card is in edit mode and prevent drag initiation
                const cardElement = (e.currentTarget as HTMLElement).querySelector('[data-editing-note="true"]')
                if (cardElement) {
                  // Don't stop propagation for clicks, just prevent drag
                  e.currentTarget.setAttribute('draggable', 'false')
                  // Re-enable after a short delay
                  setTimeout(() => {
                    e.currentTarget?.setAttribute('draggable', 'true')
                  }, 100)
                }
              }}
              onDragStart={(e) => {
                // Only allow drag if not clicking on interactive elements
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
                  target.closest(".blocknote-note-wrapper") ||
                  target.closest(".blocknote-note-editor") ||
                  target.closest(".group\\/note")
                ) {
                  e.preventDefault()
                  e.stopPropagation()
                  return false
                }
                onDragStart(task, column.id)
              }}
              onDragEnd={onDragEnd}
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
                columnId={column.id}
                onToggleEpisode={onToggleEpisode}
                onToggleSubtask={onToggleSubtask}
                onEditTask={onEditTask}
                onUpdateNote={onUpdateNote}
                onUpdateStatus={onUpdateStatus}
                onMoveTask={onMoveTask}
                onUpdateScriptData={onUpdateScriptData}
              />
            </div>
          )
        })}
        {column.tasks.length === 0 && (
          <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">No tasks yet</div>
        )}
      </div>
    </div>
  )
}
