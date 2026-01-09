import { useState } from "react";
import { Search, Filter, Star, Phone, Edit2, Plus, WifiOff, ArrowUpDown, Eye } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Supplier {
  id: string;
  name: string;
  category: string;
  rating: number;
  status: "active" | "inactive" | "pending";
  totalOrders: number;
  lastOrder: string;
  image?: string;
  pendingOrder?: {
    amount: number;
    status: string;
  };
}

const suppliers: Supplier[] = [
  {
    id: "1",
    name: "شركة الأمل الطبية",
    category: "مستلزمات جراحية",
    rating: 4.8,
    status: "active",
    totalOrders: 15,
    lastOrder: "24 أكتوبر 2023"
  },
  {
    id: "2",
    name: "فارما إيجيبت",
    category: "أدوية عامة",
    rating: 3.5,
    status: "inactive",
    totalOrders: 4,
    lastOrder: "10 سبتمبر 2023"
  },
  {
    id: "3",
    name: "المتحدة للأدوية",
    category: "مستحضرات تجميل",
    rating: 4.2,
    status: "pending",
    totalOrders: 8,
    lastOrder: "5 نوفمبر 2023",
    pendingOrder: {
      amount: 5000,
      status: "بانتظار التأكيد"
    }
  },
  {
    id: "4",
    name: "الشرق للمستلزمات",
    category: "معدات طبية",
    rating: 4.5,
    status: "active",
    totalOrders: 22,
    lastOrder: "1 ديسمبر 2023"
  },
];

const filters = [
  { id: "all", label: "الكل" },
  { id: "top", label: "الأعلى تقييمًا", icon: Star },
  { id: "recent", label: "مشتريات حديثة" },
  { id: "pending", label: "طلبات معلقة" },
];

const statusStyles = {
  active: { label: "نشط", color: "bg-success/15 text-success border-success/20" },
  inactive: { label: "خامل", color: "bg-muted text-muted-foreground border-border" },
  pending: { label: "طلب معلق", color: "bg-warning/15 text-warning border-warning/20" },
};

export default function Suppliers() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="إدارة الموردين" />

      <main className="px-4 py-4 space-y-4">
        {/* Offline Banner */}
        <div className="offline-banner animate-fade-in">
          <WifiOff className="w-4 h-4" />
          <span>وضع غير متصل - البيانات محفوظة محليًا</span>
        </div>

        {/* Search & Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Input
              placeholder="بحث باسم المورد، رقم الهاتف..."
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
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  activeFilter === filter.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:border-primary/30"
                )}
              >
                {filter.icon && <filter.icon className="w-3.5 h-3.5" />}
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count & Sort */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {suppliers.length} مورد متاح
          </span>
          <button className="flex items-center gap-1.5 text-sm text-primary">
            <ArrowUpDown className="w-4 h-4" />
            فرز
          </button>
        </div>

        {/* Suppliers List */}
        <div className="space-y-3">
          {suppliers.map((supplier, index) => (
            <div
              key={supplier.id}
              className={cn(
                "pharma-card overflow-hidden animate-slide-up",
                supplier.status === "active" && "border-r-4 border-r-success",
                supplier.status === "pending" && "border-r-4 border-r-warning"
              )}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="p-4">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {supplier.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{supplier.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        "pharma-badge text-[10px]",
                        statusStyles[supplier.status].color
                      )}>
                        {statusStyles[supplier.status].label}
                      </span>
                      <span className="text-xs text-muted-foreground">• {supplier.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-warning/10">
                    <span className="text-sm font-semibold text-foreground">{supplier.rating}</span>
                    <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">آخر شراء</p>
                    <p className="text-sm font-medium">{supplier.lastOrder}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">إجمالي الطلبات</p>
                    <p className="text-sm font-medium">{supplier.totalOrders} طلب ناجح</p>
                  </div>
                </div>

                {/* Pending Order Alert */}
                {supplier.pendingOrder && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-info/10 text-info text-sm mb-3">
                    <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center text-[10px]">i</span>
                    <span>يوجد طلب بقيمة {supplier.pendingOrder.amount.toLocaleString('ar-EG')} ج.م {supplier.pendingOrder.status}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-10 rounded-xl gap-2"
                  >
                    {supplier.pendingOrder ? (
                      <>
                        <Eye className="w-4 h-4" />
                        عرض الطلب
                      </>
                    ) : (
                      <>
                        <Phone className="w-4 h-4" />
                        إتصال
                      </>
                    )}
                  </Button>
                  <Button
                    size="icon"
                    className="h-10 w-10 rounded-xl bg-accent text-accent-foreground"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Button */}
        <Button className="fixed bottom-20 left-4 right-4 h-12 rounded-xl pharma-btn-primary gap-2 shadow-lg">
          <Plus className="w-5 h-5" />
          إضافة مورد
        </Button>
      </main>

      <BottomNavigation />
    </div>
  );
}
