import { useState } from "react";
import { Search, Filter, MapPin, Phone, TrendingUp, TrendingDown, Plus, MoreVertical } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  employees: number;
  monthlySales: number;
  trend: number;
  status: "active" | "inactive";
}

const branches: Branch[] = [
  { id: "1", name: "فرع المعادي", address: "15 شارع النصر، المعادي", phone: "01012345678", manager: "محمد أحمد", employees: 12, monthlySales: 125000, trend: 12, status: "active" },
  { id: "2", name: "فرع الدقي", address: "25 شارع التحرير، الدقي", phone: "01098765432", manager: "علي حسن", employees: 8, monthlySales: 98000, trend: -5, status: "active" },
  { id: "3", name: "فرع مدينة نصر", address: "شارع عباس العقاد", phone: "01234567890", manager: "سمير عبدالله", employees: 15, monthlySales: 156000, trend: 18, status: "active" },
  { id: "4", name: "فرع الهرم", address: "شارع الهرم الرئيسي", phone: "01123456789", manager: "خالد محمود", employees: 10, monthlySales: 87000, trend: 3, status: "active" },
  { id: "5", name: "فرع المهندسين", address: "شارع شهاب", phone: "01234567891", manager: "أحمد سعيد", employees: 6, monthlySales: 45000, trend: -8, status: "inactive" },
  { id: "6", name: "فرع الزمالك", address: "شارع 26 يوليو", phone: "01567890123", manager: "ياسر فاروق", employees: 9, monthlySales: 134000, trend: 7, status: "active" },
];

const filters = [
  { id: "all", label: "الكل" },
  { id: "active", label: "نشط" },
  { id: "inactive", label: "غير نشط" },
  { id: "top", label: "الأعلى مبيعات" },
];

export default function Branches() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBranches = branches.filter(branch => {
    if (activeFilter === "active") return branch.status === "active";
    if (activeFilter === "inactive") return branch.status === "inactive";
    return true;
  });

  const totalSales = branches.reduce((sum, b) => sum + b.monthlySales, 0);
  const activeBranches = branches.filter(b => b.status === "active").length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="إدارة الفروع" />

      <main className="px-4 py-4 space-y-4">
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-2">
          <div className="pharma-card p-3 text-center">
            <p className="text-2xl font-bold text-primary">{branches.length}</p>
            <p className="text-xs text-muted-foreground">إجمالي الفروع</p>
          </div>
          <div className="pharma-card p-3 text-center">
            <p className="text-2xl font-bold text-success">{activeBranches}</p>
            <p className="text-xs text-muted-foreground">فرع نشط</p>
          </div>
          <div className="pharma-card p-3 text-center">
            <p className="text-lg font-bold">{(totalSales / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-muted-foreground">مبيعات الشهر</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Input
            placeholder="بحث في الفروع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pharma-input pl-10 pr-12"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <button className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-muted transition-colors">
            <Filter className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                activeFilter === filter.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Branches List */}
        <div className="space-y-3">
          {filteredBranches.map((branch, index) => (
            <div
              key={branch.id}
              className={cn(
                "pharma-card p-4 animate-slide-up",
                branch.status === "active" && "border-r-4 border-r-success"
              )}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{branch.name}</h3>
                    {branch.status === "inactive" && (
                      <span className="pharma-badge pharma-badge-warning text-[10px]">غير نشط</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{branch.address}</span>
                  </div>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-muted">
                  <MoreVertical className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">المبيعات</p>
                  <p className="text-sm font-semibold">{(branch.monthlySales / 1000).toFixed(0)}K</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">الموظفين</p>
                  <p className="text-sm font-semibold">{branch.employees}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">النمو</p>
                  <div className={cn(
                    "flex items-center justify-center gap-1 text-sm font-semibold",
                    branch.trend >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {branch.trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {Math.abs(branch.trend)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="text-sm">
                  <span className="text-muted-foreground">المدير: </span>
                  <span className="font-medium">{branch.manager}</span>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 h-8">
                  <Phone className="w-3.5 h-3.5" />
                  اتصال
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Button */}
        <Button className="fixed bottom-20 left-4 right-4 h-12 rounded-xl pharma-btn-primary gap-2 shadow-lg">
          <Plus className="w-5 h-5" />
          إضافة فرع جديد
        </Button>
      </main>

      <BottomNavigation />
    </div>
  );
}
