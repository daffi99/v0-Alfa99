import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// UPDATE task
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { id } = await params
    const body = await request.json()

    const updateData: Record<string, any> = {
      ...body,
      updated_at: new Date().toISOString(),
    }

    if (body.completedEpisodes) {
      updateData.completed_episodes = JSON.stringify(body.completedEpisodes)
      delete updateData.completedEpisodes
    }

    // Convert progress object to JSON string for database
    if (body.progress !== undefined) {
      updateData.progress = typeof body.progress === 'string' ? body.progress : JSON.stringify(body.progress)
    }

    // Convert episodeRanges array to comma-separated string for database
    if (body.episodeRanges) {
      updateData.episode_ranges = Array.isArray(body.episodeRanges)
        ? body.episodeRanges.join(",")
        : body.episodeRanges
      delete updateData.episodeRanges
    }

    // Map billingMonth (camelCase from frontend) to billing_month column
    if (body.billingMonth !== undefined) {
      updateData.billing_month = body.billingMonth
      delete updateData.billingMonth
    }

    // Map scriptData (camelCase from frontend) to script_data column
    if (body.scriptData !== undefined) {
      updateData.script_data = typeof body.scriptData === 'string' ? body.scriptData : JSON.stringify(body.scriptData)
      delete updateData.scriptData
    }

    // If user is authenticated, use user_id filter (RLS will also enforce this)
    // If not authenticated, RLS will block the update anyway
    let query = supabase.from("tasks").update(updateData).eq("id", id)
    
    if (user) {
      query = query.eq("user_id", user.id)
    }

    const { data: task, error } = await query.select().single()

    if (error) {
      console.error("[v0] Supabase update error:", error)
      // If RLS error, provide more helpful message
      if (error.code === "42501" || error.message.includes("permission denied")) {
        return NextResponse.json({ error: "Unauthorized: You don't have permission to update this task" }, { status: 403 })
      }
      // Check if column doesn't exist
      if (error.message?.includes("column") && error.message?.includes("does not exist")) {
        return NextResponse.json(
          { error: `Database column missing: ${error.message}. Please run the migration script.` },
          { status: 500 }
        )
      }
      // Return the actual error message
      return NextResponse.json(
        { error: error.message || "Failed to update task", code: error.code },
        { status: 500 }
      )
    }

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error: any) {
    console.error("[v0] PATCH /api/tasks/[id] error:", error)
    const errorMessage = error?.message || "Failed to update task"
    return NextResponse.json({ error: errorMessage, details: error }, { status: 500 })
  }
}

// DELETE task
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { id } = await params

    // If user is authenticated, use user_id filter (RLS will also enforce this)
    // If not authenticated, RLS will block the delete anyway
    let query = supabase.from("tasks").delete().eq("id", id)
    
    if (user) {
      query = query.eq("user_id", user.id)
    }

    const { error } = await query

    if (error) {
      // If RLS error, provide more helpful message
      if (error.code === "42501" || error.message.includes("permission denied")) {
        return NextResponse.json({ error: "Unauthorized: You don't have permission to delete this task" }, { status: 403 })
      }
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] DELETE /api/tasks/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
