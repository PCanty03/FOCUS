import { CheckSquare, Clock, BookOpen, Sparkles, FileText, Settings, Shield } from 'lucide-react';

type SidebarProps = {
  activePage: string;
  onNavigate: (page: string) => void;
};

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'planner', label: 'Planner', icon: FileText },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'timer', label: 'Timer', icon: Clock },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'motivation', label: 'Motivation', icon: Sparkles },
    { id: 'debrief', label: 'Debrief', icon: FileText },
    { id: 'blocker', label: 'Website Blocker', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-56 bg-sidebar border-r border-border h-full flex flex-col p-4">
      <div className="mb-8">
        <h2 className="text-sidebar-foreground px-3 py-2">FOCUS</h2>
      </div>
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}