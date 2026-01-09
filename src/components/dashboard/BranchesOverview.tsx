import { Building2, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Branch {
  id: string;
  name: string;
  sales: number;
  trend: number;
  isActive: boolean;
}

const branches: Branch[] = [
  { id: "1", name: "فرع المعادي", sales: 125000, trend: 12, isActive: true },
  { id: "2", name: "فرع الدقي", sales: 98000, trend: -5, isActive: true },
  { id: "3", name: "فرع مدينة نصر", sales: 156000, trend: 18, isActive: true },
  { id: "4", name: "فرع الهرم", sales: 87000, trend: 3, isActive: true },
  { id: "5", name: "فرع المهندسين", sales: 112000, trend: -2, isActive: false },
];

export function BranchesOverview() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">أداء الفروع</h3>
        <button className="text-sm text-primary hover:underline">عرض الكل</button>
      </div>

      <div className="space-y-2">
        {branches.slice(0, 4).map((branch, index) => (
          <div
            key={branch.id}
            className="pharma-card p-3 flex items-center gap-3 animate-slide-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className={cn(
              "p-2 rounded-xl",
              branch.isActive ? "bg-primary/10" : "bg-muted"
            )}>
              <Building2 className={cn(
                "w-5 h-5",
                branch.isActive ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm truncate">{branch.name}</p>
                {!branch.isActive && (
                  <span className="pharma-badge pharma-badge-warning text-[10px]">غير نشط</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {branch.sales.toLocaleString('ar-EG')} ج.م
              </p>
            </div>

            <div className={cn(
              "flex items-center gap-1 text-xs font-medium",
              branch.trend >= 0 ? "text-success" : "text-destructive"
            )}>
              {branch.trend >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{Math.abs(branch.trend)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
