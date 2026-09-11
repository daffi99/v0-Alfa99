"use client"

import React from "react"

export function KanbanSkeletonLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] w-full select-none">
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
          <span>Loading tasks</span>
          <span className="inline-flex space-x-0.5">
            <span className="w-1 h-1 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 h-1 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-1 bg-muted-foreground/60 rounded-full animate-bounce" />
          </span>
        </div>
      </div>
    </div>
  )
}
