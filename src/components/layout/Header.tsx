import { Bell, Menu } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  title: string;
  showNotifications?: boolean;
  onMenuClick?: () => void;
}

export function Header({ title, showNotifications = true, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl hover:bg-muted transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <h1 className="text-lg font-bold">{title}</h1>

        <div className="flex items-center gap-2">
          {showNotifications && (
            <button className="relative p-2 rounded-xl hover:bg-muted transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
          )}
          <Link to="/profile" className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            <span className="text-sm font-semibold text-primary">أ</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
