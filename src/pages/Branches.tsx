import { useState, useEffect } from "react";
import { Search, Filter, MapPin, Phone, TrendingUp, TrendingDown, Plus, MoreVertical, Edit2, Trash2, WifiOff } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddBranchModal } from "@/components/modals/AddBranchModal";
import { useDatabase } from "@/hooks/useDatabase";
import { Branch } from "@/lib/database/types";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const filters = [
  { id: "all", label: "الكل" },
  { id: "active", label: "نشط" },
  { id: "inactive", label: "غير نشط" },
  { id: "top", label: "الأعلى مبيعات" },
];

export default function Branches() {
  const { getBranches, addBranch, updateBranch, deleteBranch } = useDatabase();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  useEffect(() => {
    setBranches(getBranches());
  }, [getBranches]);

  const refreshBranches = () => {
    setBranches(getBranches());
  };

  const handleAddBranch = (branchData: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingBranch) {
      updateBranch(editingBranch.id, branchData);
    } else {
      addBranch(branchData);
    }
    refreshBranches();
    setEditingBranch(null);
  };

  const handleEditBranch = (branch: Branch) => {
    setEditingBranch(branch);
    setIsModalOpen(true);
  };

  const handleDeleteBranch = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الفرع؟")) {
      deleteBranch(id);
      refreshBranches();
    }
  };

  const filteredBranches = branches
    .filter(branch => {
      if (activeFilter === "active") return branch.status === "active";
      if (activeFilter === "inactive") return branch.status === "inactive";
      return true;
    })
    .filter(branch => 
      branch.name.includes(searchQuery) || 
      branch.address.includes(searchQuery) ||
      branch.manager.includes(searchQuery)
    )
    .sort((a, b) => {
      if (activeFilter === "top") return b.monthlySales - a.monthlySales;
      return 0;
    });

  const totalSales = branches.reduce((sum, b) => sum + b.monthlySales, 0);
  const activeBranches = branches.filter(b => b.status === "active").length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="إدارة الفروع" />

      <main className="px-4 py-4 space-y-4">
        {/* Offline Banner */}
        <div className="offline-banner animate-fade-in">
          <WifiOff className="w-4 h-4" />
          <span>وضع غير متصل - البيانات محفوظة محليًا</span>
        </div>

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
          {filteredBranches.length === 0 ? (
            <div className="pharma-card p-8 text-center">
              <p className="text-muted-foreground">لا توجد فروع مطابقة</p>
            </div>
          ) : (
            filteredBranches.map((branch, index) => (
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 rounded-lg hover:bg-muted">
                        <MoreVertical className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditBranch(branch)}>
                        <Edit2 className="w-4 h-4 ml-2" />
                        تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteBranch(branch.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 ml-2" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">المبيعات</p>
                    <p className="text-sm font-semibold">{(branch.monthlySales / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">الموظفين</p>
                    <p className="text-sm font-semibold">{branch.employeesCount}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">الحالة</p>
                    <p className={cn(
                      "text-sm font-semibold",
                      branch.status === "active" ? "text-success" : "text-warning"
                    )}>
                      {branch.status === "active" ? "نشط" : "غير نشط"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="text-sm">
                    <span className="text-muted-foreground">المدير: </span>
                    <span className="font-medium">{branch.manager}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1.5 h-8"
                    onClick={() => window.open(`tel:${branch.phone}`)}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    اتصال
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Add Button */}
      <Button 
        onClick={() => {
          setEditingBranch(null);
          setIsModalOpen(true);
        }}
        className="fixed bottom-20 left-4 right-4 h-12 rounded-xl pharma-btn-primary gap-2 shadow-lg"
      >
        <Plus className="w-5 h-5" />
        إضافة فرع جديد
      </Button>

      <AddBranchModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBranch(null);
        }}
        onSave={handleAddBranch}
        editBranch={editingBranch}
      />

      <BottomNavigation />
    </div>
  );
}
