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

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Prepare insert data
    const insertData: Record<string, any> = {
      title: body.title,
      description: body.description,
      duration: body.duration ?? "00:10:00",
      category: body.category,
      status: body.status,
      stage: body.stage || "Backlog",
      episode_ranges: Array.isArray(body.episodeRanges) ? body.episodeRanges.join(",") : body.episodeRanges || "",
      completed_episodes: JSON.stringify(body.completedEpisodes || []),
      notes: body.notes || null,
      billing_month: body.billingMonth ?? "December 2025",
      script_data: body.scriptData ? (typeof body.scriptData === 'string' ? body.scriptData : JSON.stringify(body.scriptData)) : (body.script_data ? (typeof body.script_data === 'string' ? body.script_data : JSON.stringify(body.script_data)) : null),
    }

    // If user is authenticated, add user_id
    // For development, user_id can be null if no user is authenticated
    if (user) {
      insertData.user_id = user.id
    } else {
      // For development: allow null user_id
      insertData.user_id = null
    }

    const { data: task, error } = await supabase.from("tasks").insert(insertData).select().single()

    if (error) {
      // If RLS error, provide more helpful message
      if (error.code === "42501" || error.message.includes("permission denied")) {
        return NextResponse.json(
          { error: "Unauthorized: You need to be authenticated to create tasks" },
          { status: 403 },
        )
      }
      throw error
    }

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error("[v0] POST /api/tasks error:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
