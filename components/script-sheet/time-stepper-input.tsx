import React from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { timeToSeconds, secondsToTimeString } from "./utils"

export function TimeStepperInput({
  label,
  value,
  onChange,
  onStep,
  placeholder,
}: {
  label: string
  value: string
  onChange: (val: string) => void
  onStep?: (deltaSeconds: number) => void
  placeholder?: string
}) {
  const handleStep = (deltaSeconds: number) => {
    if (onStep) {
      onStep(deltaSeconds)
    } else {
      let currentSec = timeToSeconds(value)
      if (currentSec === null) currentSec = 0
      const newSec = Math.max(0, currentSec + deltaSeconds)
      const hasHours = value.includes(":") && value.split(":").length === 3
      onChange(secondsToTimeString(newSec, hasHours))
    }
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="block font-semibold text-foreground text-xs">{label}</label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleStep(-1)}
            className="px-1.5 py-0.5 text-[10px] font-bold bg-muted hover:bg-muted/80 text-foreground border border-input rounded flex items-center gap-0.5 cursor-pointer transition-colors active:scale-95"
            title="Subtract 1 second"
          >
            -1s
          </button>
          <button
            type="button"
            onClick={() => handleStep(1)}
            className="px-1.5 py-0.5 text-[10px] font-bold bg-muted hover:bg-muted/80 text-foreground border border-input rounded flex items-center gap-0.5 cursor-pointer transition-colors active:scale-95"
            title="Add 1 second"
          >
            +1s
          </button>
        </div>
      </div>
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder={placeholder || "00:00:00"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-8 pl-2.5 pr-7 text-xs font-mono rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col -space-y-0.5">
          <button
            type="button"
            onClick={() => handleStep(1)}
            className="p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded cursor-pointer transition-colors"
            title="Increase 1 second"
          >
            <ChevronUp className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => handleStep(-1)}
            className="p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded cursor-pointer transition-colors"
            title="Decrease 1 second"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
