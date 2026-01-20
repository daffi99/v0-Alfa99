"use client"

import { useState, useEffect, useRef } from "react"
import type React from "react"

// Format duration for display (no leading zeros on hours)
function formatDurationForDisplay(duration: string): string {
  if (!duration) return "0:00:00"
  
  const parts = duration.split(":")
  if (parts.length === 3) {
    const h = parseInt(parts[0]?.trim() || "0", 10).toString()
    const m = parts[1]?.trim().padStart(2, "0") || "00"
    const s = parts[2]?.trim().padStart(2, "0") || "00"
    return `${h}:${m}:${s}`
  }
  if (parts.length === 2) {
    const m = parts[0]?.trim().padStart(2, "0") || "00"
    const s = parts[1]?.trim().padStart(2, "0") || "00"
    return `0:${m}:${s}`
  }
  return duration
}

// Parse duration string to hours, minutes, seconds
function parseDuration(duration: string): { hours: number; minutes: number; seconds: number } {
  if (!duration) return { hours: 0, minutes: 0, seconds: 0 }
  
  const parts = duration.split(":").map((p) => parseInt(p.trim() || "0", 10))
  
  if (parts.length === 3) {
    return { hours: parts[0] || 0, minutes: parts[1] || 0, seconds: parts[2] || 0 }
  }
  if (parts.length === 2) {
    return { hours: 0, minutes: parts[0] || 0, seconds: parts[1] || 0 }
  }
  return { hours: 0, minutes: 0, seconds: 0 }
}

interface DurationInputProps {
  value: string
  onChange: (value: string) => void
  onBlur: (value: string) => void
  className?: string
  buttonClassName?: string
}

export function DurationInput({
  value,
  onChange,
  onBlur,
  className = "",
  buttonClassName = "",
}: DurationInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localValue, setLocalValue] = useState(parseDuration(value))
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 })
  const popupRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    setLocalValue(parseDuration(value))
  }, [value])

  const updateValue = (newValue: { hours: number; minutes: number; seconds: number }) => {
    setLocalValue(newValue)
    const formatted = `${newValue.hours}:${String(newValue.minutes).padStart(2, "0")}:${String(newValue.seconds).padStart(2, "0")}`
    // Use setTimeout to defer onChange call and avoid setState during render
    setTimeout(() => onChange(formatted), 0)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        const formatted = `${localValue.hours}:${String(localValue.minutes).padStart(2, "0")}:${String(localValue.seconds).padStart(2, "0")}`
        onBlur(formatted)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, localValue, onBlur])

  const handleInputChange = (type: "hours" | "minutes" | "seconds", inputValue: string) => {
    const numValue = parseInt(inputValue.replace(/\D/g, "") || "0", 10)
    
    const newValue = { ...localValue }
    if (type === "hours") {
      newValue.hours = Math.min(99, Math.max(0, numValue))
    } else if (type === "minutes") {
      newValue.minutes = Math.min(59, Math.max(0, numValue))
    } else {
      newValue.seconds = Math.min(59, Math.max(0, numValue))
    }
    updateValue(newValue)
  }

  const handleIncrement = (type: "hours" | "minutes" | "seconds") => {
    const newValue = { ...localValue }
    if (type === "hours") {
      newValue.hours = Math.min(99, newValue.hours + 1)
    } else if (type === "minutes") {
      newValue.minutes = newValue.minutes >= 59 ? 0 : newValue.minutes + 1
    } else {
      newValue.seconds = newValue.seconds >= 59 ? 0 : newValue.seconds + 1
    }
    updateValue(newValue)
  }

  const handleDecrement = (type: "hours" | "minutes" | "seconds") => {
    const newValue = { ...localValue }
    if (type === "hours") {
      newValue.hours = Math.max(0, newValue.hours - 1)
    } else if (type === "minutes") {
      newValue.minutes = newValue.minutes <= 0 ? 59 : newValue.minutes - 1
    } else {
      newValue.seconds = newValue.seconds <= 0 ? 59 : newValue.seconds - 1
    }
    updateValue(newValue)
  }

  const displayValue = formatDurationForDisplay(value)

  const updatePopupPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      // For fixed positioning, use viewport coordinates (no scroll offset needed)
      setPopupPosition({
        top: rect.bottom + 4,
        left: rect.left,
      })
    }
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isOpen) {
      updatePopupPosition()
    }
    setIsOpen(!isOpen)
  }

  // Update popup position on scroll and resize when open
  useEffect(() => {
    if (!isOpen) return

    const updatePosition = () => {
      updatePopupPosition()
    }

    window.addEventListener("scroll", updatePosition, true)
    window.addEventListener("resize", updatePosition)
    
    return () => {
      window.removeEventListener("scroll", updatePosition, true)
      window.removeEventListener("resize", updatePosition)
    }
  }, [isOpen])

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
        onDragStart={(e) => {
          e.stopPropagation()
          e.preventDefault()
        }}
        className={`w-28 px-3 py-1.5 border border-border rounded-md hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-background transition-colors text-left ${buttonClassName}`}
      >
        {displayValue || "0:00:00"}
      </button>

      {isOpen && (
        <div
          ref={popupRef}
          className="fixed z-[9999] bg-white border border-border rounded-lg shadow-xl p-4"
          style={{
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
            animation: "fadeInScale 0.15s ease-out",
          }}
          onMouseDown={(e) => {
            e.stopPropagation()
          }}
          onDragStart={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          <div className="flex items-center gap-2">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => handleIncrement("hours")}
                className="w-8 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <input
                type="text"
                value={localValue.hours}
                onChange={(e) => handleInputChange("hours", e.target.value)}
                className="w-12 text-center text-lg font-semibold py-2 border border-transparent rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-transparent"
                style={{ fontSize: "1.125rem" }}
              />
              <button
                type="button"
                onClick={() => handleDecrement("hours")}
                className="w-8 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="text-xs text-muted-foreground mt-1">Hours</div>
            </div>

            <div className="text-lg font-semibold">:</div>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => handleIncrement("minutes")}
                className="w-8 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <input
                type="text"
                value={String(localValue.minutes).padStart(2, "0")}
                onChange={(e) => handleInputChange("minutes", e.target.value)}
                className="w-12 text-center text-lg font-semibold py-2 border border-transparent rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-transparent"
                style={{ fontSize: "1.125rem" }}
              />
              <button
                type="button"
                onClick={() => handleDecrement("minutes")}
                className="w-8 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="text-xs text-muted-foreground mt-1">Minutes</div>
            </div>

            <div className="text-lg font-semibold">:</div>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => handleIncrement("seconds")}
                className="w-8 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <input
                type="text"
                value={String(localValue.seconds).padStart(2, "0")}
                onChange={(e) => handleInputChange("seconds", e.target.value)}
                className="w-12 text-center text-lg font-semibold py-2 border border-transparent rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-transparent"
                style={{ fontSize: "1.125rem" }}
              />
              <button
                type="button"
                onClick={() => handleDecrement("seconds")}
                className="w-8 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="text-xs text-muted-foreground mt-1">Seconds</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

