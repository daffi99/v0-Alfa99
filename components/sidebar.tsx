import { LayoutGrid, Calendar, MessageSquare, Users, Settings } from "lucide-react"

export function Sidebar() {
  return (
    <aside className="w-20 bg-white border-r border-border flex flex-col items-center py-6 space-y-4">
      <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
        C
      </div>
      <nav className="flex-1 flex flex-col items-center space-y-4">
        <button className="p-3 hover:bg-muted rounded-lg transition-colors" title="Board">
          <LayoutGrid className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="p-3 hover:bg-muted rounded-lg transition-colors" title="Calendar">
          <Calendar className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="p-3 hover:bg-muted rounded-lg transition-colors" title="Messages">
          <MessageSquare className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="p-3 hover:bg-muted rounded-lg transition-colors" title="Team">
          <Users className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="p-3 hover:bg-muted rounded-lg transition-colors" title="Settings">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
      </nav>
      <button className="p-3 hover:bg-muted rounded-lg transition-colors" title="Profile">
        <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
      </button>
    </aside>
  )
}
