import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// UPDATE task
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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

    const { data: task, error } = await supabase
      .from("tasks")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(task)
  } catch (error) {
    console.error("[v0] PATCH /api/tasks/[id] error:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

// DELETE task
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const { error } = await supabase.from("tasks").delete().eq("id", id).eq("user_id", user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] DELETE /api/tasks/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
