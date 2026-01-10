import { useState, useEffect } from "react";
import { Search, Filter, Star, Phone, Edit2, Plus, WifiOff, ArrowUpDown, Trash2, MoreVertical } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddSupplierModal } from "@/components/modals/AddSupplierModal";
import { useDatabase } from "@/hooks/useDatabase";
import { Supplier } from "@/lib/database/types";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const filters = [
  { id: "all", label: "الكل" },
  { id: "top", label: "الأعلى تقييمًا", icon: Star },
  { id: "active", label: "نشط" },
  { id: "inactive", label: "غير نشط" },
];

const statusStyles = {
  active: { label: "نشط", color: "bg-success/15 text-success border-success/20" },
  inactive: { label: "غير نشط", color: "bg-muted text-muted-foreground border-border" },
};

export default function Suppliers() {
  const { getSuppliers, addSupplier, updateSupplier, deleteSupplier } = useDatabase();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    setSuppliers(getSuppliers());
  }, [getSuppliers]);

  const refreshSuppliers = () => {
    setSuppliers(getSuppliers());
  };

  const handleAddSupplier = (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingSupplier) {
      updateSupplier(editingSupplier.id, supplierData);
    } else {
      addSupplier(supplierData);
    }
    refreshSuppliers();
    setEditingSupplier(null);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleDeleteSupplier = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المورد؟")) {
      deleteSupplier(id);
      refreshSuppliers();
    }
  };

  const filteredSuppliers = suppliers
    .filter(supplier => {
      if (activeFilter === "active") return supplier.status === "active";
      if (activeFilter === "inactive") return supplier.status === "inactive";
      return true;
    })
    .filter(supplier => 
      supplier.name.includes(searchQuery) || 
      supplier.phone.includes(searchQuery) ||
      supplier.email.includes(searchQuery)
    )
    .sort((a, b) => {
      if (activeFilter === "top") return b.rating - a.rating;
      return 0;
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
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
            {filteredSuppliers.length} مورد متاح
          </span>
          <button className="flex items-center gap-1.5 text-sm text-primary">
            <ArrowUpDown className="w-4 h-4" />
            فرز
          </button>
        </div>

        {/* Suppliers List */}
        <div className="space-y-3">
          {filteredSuppliers.length === 0 ? (
            <div className="pharma-card p-8 text-center">
              <p className="text-muted-foreground">لا يوجد موردين مطابقين</p>
            </div>
          ) : (
            filteredSuppliers.map((supplier, index) => (
              <div
                key={supplier.id}
                className={cn(
                  "pharma-card overflow-hidden animate-slide-up",
                  supplier.status === "active" && "border-r-4 border-r-success"
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
                        {supplier.email && (
                          <span className="text-xs text-muted-foreground">• {supplier.email}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-warning/10">
                        <span className="text-sm font-semibold text-foreground">{supplier.rating}</span>
                        <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 rounded-lg hover:bg-muted">
                            <MoreVertical className="w-5 h-5 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditSupplier(supplier)}>
                            <Edit2 className="w-4 h-4 ml-2" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteSupplier(supplier.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">آخر شراء</p>
                      <p className="text-sm font-medium">{formatDate(supplier.lastOrderDate)}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">إجمالي الطلبات</p>
                      <p className="text-sm font-medium">{supplier.totalOrders} طلب</p>
                    </div>
                  </div>

                  {/* Address */}
                  {supplier.address && (
                    <div className="text-sm text-muted-foreground mb-3">
                      📍 {supplier.address}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-10 rounded-xl gap-2"
                      onClick={() => window.open(`tel:${supplier.phone}`)}
                    >
                      <Phone className="w-4 h-4" />
                      اتصال
                    </Button>
                    <Button
                      size="icon"
                      className="h-10 w-10 rounded-xl bg-accent text-accent-foreground"
                      onClick={() => handleEditSupplier(supplier)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Add Button */}
      <Button 
        onClick={() => {
          setEditingSupplier(null);
          setIsModalOpen(true);
        }}
        className="fixed bottom-20 left-4 right-4 h-12 rounded-xl pharma-btn-primary gap-2 shadow-lg"
      >
        <Plus className="w-5 h-5" />
        إضافة مورد
      </Button>

      <AddSupplierModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSupplier(null);
        }}
        onSave={handleAddSupplier}
        editSupplier={editingSupplier}
      />

      <BottomNavigation />
    </div>
  );
}
