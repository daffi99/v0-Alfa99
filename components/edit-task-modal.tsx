"use client"

import type React from "react"

import { useState } from "react"
import type { Task } from "./kanban-board"
import { X } from "lucide-react"

interface EditTaskModalProps {
  task: Task
  onSave: (task: Task) => void
  onClose: () => void
}

export function EditTaskModal({ task, onSave, onClose }: EditTaskModalProps) {
  const [formData, setFormData] = useState(task)

  const handleSave = () => {
    onSave(formData)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, title: e.target.value })
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, description: e.target.value })
  }

  const handleEpisodeRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, episodeRange: e.target.value })
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "Caption" | "No caption" | null
    setFormData({ ...formData, category: value || null })
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "Check VO" | "Mixing" | "Mixing SRT" | null
    setFormData({ ...formData, status: value || null })
  }

  const handleSubtaskChange = (subtaskId: string, title: string) => {
    setFormData({
      ...formData,
      subtasks: formData.subtasks.map((st) => (st.id === subtaskId ? { ...st, title } : st)),
    })
  }

  const addSubtask = () => {
    setFormData({
      ...formData,
      subtasks: [
        ...formData.subtasks,
        {
          id: `sub-${Date.now()}`,
          title: "New subtask",
          completed: false,
        },
      ],
    })
  }

  const removeSubtask = (subtaskId: string) => {
    setFormData({
      ...formData,
      subtasks: formData.subtasks.filter((st) => st.id !== subtaskId),
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white">
          <h2 className="text-lg font-semibold">Edit Task</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
            <textarea
              value={formData.description}
              onChange={handleDescriptionChange}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Episode Range</label>
            <input
              type="text"
              value={formData.episodeRange}
              onChange={handleEpisodeRangeChange}
              placeholder="e.g., 051-060"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
            <select
              value={formData.category || ""}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              <option value="Caption">Caption</option>
              <option value="No caption">No caption</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
            <select
              value={formData.status || ""}
              onChange={handleStatusChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select status</option>
              <option value="Check VO">Check VO</option>
              <option value="Mixing">Mixing</option>
              <option value="Mixing SRT">Mixing SRT</option>
            </select>
          </div>

          {/* Subtasks */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Subtasks</label>
            <div className="space-y-2 mb-2">
              {formData.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={subtask.title}
                    onChange={(e) => handleSubtaskChange(subtask.id, e.target.value)}
                    className="flex-1 px-2 py-1 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => removeSubtask(subtask.id)}
                    className="px-2 py-1 text-red-500 hover:bg-red-50 rounded text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addSubtask} className="text-sm text-blue-500 hover:underline">
              + Add subtask
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-border">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
