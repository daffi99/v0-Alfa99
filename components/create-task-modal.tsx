"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"
import { EpisodeRangePicker } from "./episode-range-picker"
import { DurationInput } from "./duration-input"
import { BillingMonthPicker } from "./billing-month-picker"
import { CustomSelect } from "./custom-select"
import { format } from "date-fns"

interface CreateTaskModalProps {
  onSave: (task: {
    title: string
    description: string
    episodeRanges: string[]
    category: "Caption" | "No caption" | null
    status: "Not started" | "In progress" | "Wait VO" | "Finished" | null
    stage: string
    duration: string
    billingMonth: string
  }) => void
  onClose: () => void
}

export function CreateTaskModal({ onSave, onClose }: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    episodeRanges: [] as string[],
    category: "" as "Caption" | "No caption" | "",
    status: "" as "Not started" | "In progress" | "Wait VO" | "Finished" | "",
    stage: "Backlog",
    duration: "00:10:00",
    billingMonth: format(new Date(), "MMMM yyyy"),
  })

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert("Please enter a task title")
      return
    }

    onSave({
      title: formData.title,
      description: formData.description,
      episodeRanges: formData.episodeRanges,
      category: formData.category || null,
      status: formData.status || null,
      stage: formData.stage,
      duration: formData.duration || "00:10:00",
      billingMonth: formData.billingMonth,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white">
          <h2 className="text-lg font-semibold">Create New Task</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Enter task description"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Episode Range */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Episode Range</label>
            <EpisodeRangePicker
              value={formData.episodeRanges}
              onChange={(ranges) => setFormData({ ...formData, episodeRanges: ranges })}
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
            <CustomSelect
              value={formData.category}
              onChange={(val) =>
                setFormData({ ...formData, category: val as "Caption" | "No caption" | "" })
              }
              options={["Caption", "No caption"]}
              placeholder="Select category"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
            <CustomSelect
              value={formData.status}
              onChange={(val) =>
                setFormData({
                  ...formData,
                  status: val as "Not started" | "In progress" | "Wait VO" | "Finished" | "",
                })
              }
              options={["Not started", "In progress", "Wait VO", "Finished"]}
              placeholder="Select status"
            />
          </div>

          {/* Stage */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Stage</label>
            <CustomSelect
              value={formData.stage}
              onChange={(val) => setFormData({ ...formData, stage: val })}
              options={["Backlog", "In Progress", "Finished", "Revision", "Customer Revision", "Done"]}
            />
          </div>

          {/* Duration (timecode) */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Duration (timecode)</label>
            <DurationInput
              value={formData.duration || "00:10:00"}
              onChange={(value) => setFormData({ ...formData, duration: value })}
              onBlur={(value) => setFormData({ ...formData, duration: value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Billing month</label>
            <BillingMonthPicker
              value={formData.billingMonth}
              onChange={(newVal) => setFormData({ ...formData, billingMonth: newVal })}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">You can group tasks later by this month name.</p>
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
              Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

