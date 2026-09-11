"use client"

import React from "react"
import { Sparkles, Layers } from "lucide-react"

export function KanbanSkeletonLoader() {
  return (
    <div className="relative p-6 sm:p-8 h-full min-h-[calc(100vh-80px)] overflow-hidden select-none">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Floating Glassmorphism Loading Card */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4">
        <div className="bg-card/90 dark:bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl rounded-2xl p-6 sm:p-8 max-w-xs sm:max-w-sm w-full flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
          {/* Animated Spinner with Pulsing Aura */}
          <div className="relative flex items-center justify-center">
            {/* Outer pulsating wave */}
            <div className="absolute w-14 h-14 rounded-full bg-primary/15 animate-ping opacity-75" />
            {/* Smooth dual-ring spinner */}
            <div className="w-12 h-12 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin" />
            {/* Center icon */}
            <div className="absolute flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-primary" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center justify-center gap-1.5">
              <span>Loading Tasks</span>
              <span className="inline-flex items-center space-x-0.5">
                <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-1 bg-primary rounded-full animate-bounce" />
              </span>
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Syncing workspace cards, episodes & scripts...
            </p>
          </div>

          {/* Indeterminate animated progress bar */}
          <div className="w-full bg-muted/80 h-1.5 rounded-full overflow-hidden relative">
            <div
              className="absolute inset-y-0 bg-gradient-to-r from-transparent via-primary to-transparent w-3/5 rounded-full"
              style={{
                animation: "skeleton-progress 1.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>

      {/* Realistic Background Kanban Columns with Shimmer */}
      <div className="flex flex-col gap-6 h-full opacity-40 blur-[1.5px] pointer-events-none">
        {/* Row 1: Backlog + In Progress (2 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Backlog column skeleton */}
          <div className="flex flex-col bg-muted/30 rounded-lg p-4 min-h-96 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-muted-foreground/25 rounded-md animate-pulse" />
              <div className="h-4 w-6 bg-muted-foreground/20 rounded-full animate-pulse" />
            </div>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-card border border-border/60 rounded-xl p-4 space-y-3 shadow-xs animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-32 bg-muted-foreground/20 rounded" />
                    <div className="h-4 w-12 bg-muted-foreground/15 rounded-full" />
                  </div>
                  <div className="h-2.5 w-full bg-muted-foreground/15 rounded" />
                  <div className="flex gap-2 pt-1">
                    <div className="h-5 w-16 bg-muted-foreground/10 rounded" />
                    <div className="h-5 w-14 bg-muted-foreground/10 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* In Progress 2-col skeleton */}
          <div className="md:col-span-2 flex flex-col bg-muted/30 rounded-lg p-4 min-h-96 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-28 bg-muted-foreground/25 rounded-md animate-pulse" />
              <div className="h-4 w-7 bg-primary/25 rounded-full animate-pulse" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((colIdx) => (
                <div key={colIdx} className="space-y-3">
                  {[1, 2].map((cardIdx) => (
                    <div key={cardIdx} className="bg-card border border-border/60 rounded-xl p-4 space-y-3 shadow-xs animate-pulse">
                      <div className="flex items-center justify-between">
                        <div className="h-4 w-36 bg-muted-foreground/20 rounded" />
                        <div className="h-4 w-16 bg-primary/20 rounded-full" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-2 w-full bg-muted-foreground/15 rounded" />
                        <div className="h-2 w-4/5 bg-muted-foreground/15 rounded" />
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div className="h-5 w-20 bg-muted-foreground/10 rounded" />
                        <div className="h-5 w-12 bg-muted-foreground/10 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Finished, Revision, Customer Revision, Done */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
          {[1, 2, 3, 4].map((col) => (
            <div key={col} className="bg-muted/20 rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-3.5 w-20 bg-muted-foreground/20 rounded animate-pulse" />
                <div className="h-3.5 w-5 bg-muted-foreground/15 rounded-full animate-pulse" />
              </div>
              <div className="h-24 bg-card border border-border/40 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes skeleton-progress {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(40%);
          }
          100% {
            transform: translateX(180%);
          }
        }
      `}</style>
    </div>
  )
}
