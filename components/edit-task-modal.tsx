"use client"

import type React from "react"

import { useState } from "react"
import type { Task } from "./kanban-board"
import { X, Trash2 } from "lucide-react"
import { DurationInput } from "./duration-input"
import { BillingMonthPicker } from "./billing-month-picker"
import { CustomSelect } from "./custom-select"

interface EditTaskModalProps {
  task: Task
  onSave: (task: Task) => void
  onDelete?: (taskId: string) => void
  onClose: () => void
}

export function EditTaskModal({ task, onSave, onDelete, onClose }: EditTaskModalProps) {
  const [formData, setFormData] = useState({
    ...task,
    episodeRange: task.episodeRanges.join(", "),
    duration: task.duration || "00:10:00",
    billingMonth: task.billingMonth
      ? (/\d{4}/.test(task.billingMonth) ? task.billingMonth : `${task.billingMonth} 2025`)
      : "December 2025",
  })

  const handleSave = () => {
    // Convert episodeRange string back to array
    const episodeRanges = formData.episodeRange
      .split(",")
      .map((range) => range.trim())
      .filter((range) => range.length > 0)

    onSave({
      ...formData,
      episodeRanges: episodeRanges.length > 0 ? episodeRanges : [],
    })
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, title: e.target.value })
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, description: e.target.value })
  }

  const handleCategoryChange = (value: string) => {
    const category = value as "Caption" | "No caption" | null
    setFormData({ ...formData, category: category || null })
  }

  const handleStatusChange = (value: string) => {
    const status = value as "Not started" | "In progress" | "Wait VO" | "Finished" | null
    setFormData({ ...formData, status: status || null })
  }


  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
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
              rows={1}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Episode Range</label>
            <input
              type="text"
              value={formData.episodeRange || ""}
              disabled
              placeholder="e.g., 051-060 or 051-060,066-070"
              className="w-full px-3 py-2 border border-border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">Episode range cannot be changed after task creation</p>
          </div>

          {/* Duration and Billing Month - 2 columns */}
          <div className="grid grid-cols-2 gap-4">
            {/* Duration (timecode) */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Duration (timecode)</label>
              <DurationInput
                value={formData.duration || "00:10:00"}
                onChange={(value) => setFormData({ ...formData, duration: value })}
                onBlur={(value) => setFormData({ ...formData, duration: value })}
              />
            </div>

            {/* Billing Month */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Billing month</label>
              <BillingMonthPicker
                value={formData.billingMonth || ""}
                onChange={(value) => setFormData({ ...formData, billingMonth: value })}
                className="w-full"
              />
            </div>
          </div>

          {/* Category and Status - 2 columns */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
              <CustomSelect
                value={formData.category || ""}
                onChange={(val) => handleCategoryChange(val)}
                options={["Caption", "No caption"]}
                placeholder="Select category"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
              <CustomSelect
                value={formData.status || ""}
                onChange={(val) => handleStatusChange(val)}
                options={["Not started", "In progress", "Wait VO", "Finished"]}
                placeholder="Select status"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-border">
            {onDelete && (
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete this task?")) {
                    onDelete(task.id)
                    onClose()
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
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
