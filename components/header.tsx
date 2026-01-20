"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calculator, Search } from "lucide-react"
import { format } from "date-fns"

interface HeaderProps {
  onCreateTask?: () => void
  searchQuery?: string
  setSearchQuery?: (query: string) => void
}

export function Header({ onCreateTask, searchQuery = "", setSearchQuery }: HeaderProps) {
  const [title, setTitle] = useState("Your Task")

  useEffect(() => {
    setTitle(`Your Task in ${format(new Date(), "MMMM yyyy")}`)
  }, [])

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8">
      <h1 className="text-2xl font-bold text-foreground min-w-[200px]">{title}</h1>

      <div className="flex-1 max-w-xl mx-8 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery?.(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-3">
        <Link href="/billing">
          <Button variant="outline" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Billing
          </Button>
        </Link>
        <Button onClick={onCreateTask} className="bg-blue-500 hover:bg-blue-600 text-white">
          Add a task
        </Button>
      </div>
    </header>
  )
}
