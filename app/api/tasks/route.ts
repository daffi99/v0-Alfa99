import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET all tasks for current user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // In production, you'll want to add proper auth here
    const { data: tasks, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: true })

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json([], { status: 200 })
    }

    return NextResponse.json(tasks || [])
  } catch (error) {
    console.error("[v0] GET /api/tasks error:", error)
    return NextResponse.json([], { status: 200 })
  }
}

// POST create new task
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data: task, error } = await supabase
      .from("tasks")
      .insert({
        title: body.title,
        description: body.description,
        duration: body.duration,
        category: body.category,
        status: body.status,
        stage: body.stage,
        episode_ranges: body.episodeRanges,
        completed_episodes: JSON.stringify(body.completedEpisodes || []),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error("[v0] POST /api/tasks error:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
