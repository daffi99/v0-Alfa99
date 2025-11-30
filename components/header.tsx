import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8">
      <h1 className="text-2xl font-bold text-foreground">Your tasks</h1>
      <div className="flex items-center gap-3">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">Add a task</Button>
        <Button variant="outline">Invite</Button>
      </div>
    </header>
  )
}
