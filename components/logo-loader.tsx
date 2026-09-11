"use client"

import React from "react"

interface LogoLoaderProps {
  label?: string
  sublabel?: string
  className?: string
}

export function LogoLoader({
  label = "Loading tasks",
  sublabel,
  className = "h-[calc(100vh-140px)]",
}: LogoLoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center w-full select-none ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        {/* Small Logo with gentle breathing animation */}
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden transition-transform animate-pulse">
            <img
              src="/logo_kanban.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Clean minimal loading text with animated dots */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
          <span>{label}</span>
          <span className="inline-flex space-x-0.5">
            <span className="w-1 h-1 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 h-1 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-1 bg-muted-foreground/60 rounded-full animate-bounce" />
          </span>
        </div>
        {sublabel && (
          <p className="text-[11px] text-muted-foreground/70">{sublabel}</p>
        )}
      </div>
    </div>
  )
}
