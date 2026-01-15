import { Menu, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LicenseAlertsBadge } from "@/components/alerts/LicenseAlertsBadge";

interface HeaderProps {
  title: string;
  showNotifications?: boolean;
  showBack?: boolean;
  onMenuClick?: () => void;
}

export function Header({ title, showNotifications = true, showBack = false, onMenuClick }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        {showBack ? (
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        <h1 className="text-lg font-bold">{title}</h1>

        <div className="flex items-center gap-2">
          {showNotifications && <LicenseAlertsBadge />}
          <Link to="/profile" className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            <span className="text-sm font-semibold text-primary">أ</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
