"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, X } from "lucide-react"

interface EpisodeRange {
  start: string
  end: string
}

interface EpisodeRangePickerProps {
  value: string[] // Array of ranges like ["031-040", "056-060"]
  onChange: (ranges: string[]) => void
}

export function EpisodeRangePicker({ value, onChange }: EpisodeRangePickerProps) {
  const [ranges, setRanges] = useState<EpisodeRange[]>(() => {
    if (value.length === 0) return [{ start: "", end: "" }]
    return value.map((range) => {
      const parts = range.split("-")
      return {
        start: parts[0]?.trim() || "",
        end: parts[1]?.trim() || "",
      }
    })
  })
  const popupRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        // Format and save ranges when closing
        const formatted = ranges
          .filter((r) => r.start && r.end)
          .map((r) => `${r.start}-${r.end}`)
        onChange(formatted)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, ranges, onChange])

  const updateRange = (index: number, field: "start" | "end", newValue: string) => {
    const numValue = newValue.replace(/\D/g, "") // Only numbers
    setRanges((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: numValue }
      return updated
    })
  }

  const addRange = () => {
    setRanges((prev) => [...prev, { start: "", end: "" }])
  }

  const removeRange = (index: number) => {
    setRanges((prev) => {
      const newRanges = prev.filter((_, i) => i !== index)
      return newRanges.length === 0 ? [{ start: "", end: "" }] : newRanges
    })
  }

  const formatDisplayValue = (): string => {
    const formatted = ranges
      .filter((r) => r.start && r.end)
      .map((r) => `${r.start}-${r.end}`)
    return formatted.length > 0 ? formatted.join(", ") : "Add episode range"
  }

  const displayValue = formatDisplayValue()

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-border rounded-md hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-background transition-colors text-left"
      >
        {displayValue}
      </button>

      {isOpen && (
        <div
          ref={popupRef}
          className="absolute z-50 mt-1 bg-white border border-border rounded-lg shadow-xl p-4 min-w-[400px]"
          style={{
            top: "100%",
            left: 0,
            animation: "fadeInScale 0.15s ease-out",
          }}
        >
          <div className="space-y-3">
            {ranges.map((range, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex flex-col">
                    <label className="text-xs text-muted-foreground mb-1">Start</label>
                    <input
                      type="text"
                      value={range.start}
                      onChange={(e) => updateRange(index, "start", e.target.value)}
                      placeholder="031"
                      className="w-20 px-2 py-1.5 border border-border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-center"
                    />
                  </div>
                  <div className="text-lg font-semibold mt-6">-</div>
                  <div className="flex flex-col">
                    <label className="text-xs text-muted-foreground mb-1">End</label>
                    <input
                      type="text"
                      value={range.end}
                      onChange={(e) => updateRange(index, "end", e.target.value)}
                      placeholder="040"
                      className="w-20 px-2 py-1.5 border border-border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-center"
                    />
                  </div>
                </div>
                {ranges.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRange(index)}
                    className="p-1 hover:bg-red-50 rounded text-red-500 transition-colors mt-6"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addRange}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-border rounded hover:bg-muted transition-colors text-sm text-muted-foreground"
            >
              <Plus className="w-4 h-4" />
              Add another range
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

