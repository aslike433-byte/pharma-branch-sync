import { Link } from "react-router-dom";
import { 
  Building2, 
  Package, 
  FileCheck, 
  Wallet,
  TrendingUp,
  ShoppingCart,
  Users,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  { icon: Building2, label: "الفروع", path: "/branches", color: "bg-primary/10 text-primary" },
  { icon: Package, label: "الأصناف", path: "/inventory", color: "bg-info/10 text-info" },
  { icon: FileCheck, label: "التراخيص", path: "/licenses", color: "bg-warning/10 text-warning" },
  { icon: Wallet, label: "الرواتب", path: "/payroll", color: "bg-success/10 text-success" },
  { icon: TrendingUp, label: "المبيعات", path: "/sales", color: "bg-accent/10 text-accent" },
  { icon: ShoppingCart, label: "المشتريات", path: "/orders", color: "bg-destructive/10 text-destructive" },
  { icon: Users, label: "الموردين", path: "/suppliers", color: "bg-info/10 text-info" },
  { icon: Settings, label: "الإعدادات", path: "/settings", color: "bg-muted text-muted-foreground" },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((action, index) => (
        <Link
          key={action.path}
          to={action.path}
          className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-soft transition-all duration-200 animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className={cn("p-3 rounded-xl", action.color)}>
            <action.icon className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-center">{action.label}</span>
        </Link>
      ))}
    </div>
  );
}
