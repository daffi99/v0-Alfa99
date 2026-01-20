"use client"

import { useState } from "react"
import { KanbanBoard } from "@/components/kanban-board"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onCreateTask={() => setShowCreateModal(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <main className="flex-1 overflow-auto">
          <KanbanBoard
            onCreateTaskTrigger={showCreateModal}
            onCreateTaskHandled={() => setShowCreateModal(false)}
            searchQuery={searchQuery}
          />
        </main>
      </div>
    </div>
  )
}
