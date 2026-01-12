import { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  WifiOff,
  Package,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Building2,
  TrendingUp,
  Calendar,
  Barcode
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddProductModal } from "@/components/modals/AddProductModal";
import { useDatabase } from "@/hooks/useDatabase";
import { Product, Branch, Supplier } from "@/lib/database/types";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

const statusFilters = [
  { id: "all", label: "الكل" },
  { id: "available", label: "متوفر" },
  { id: "low", label: "منخفض" },
  { id: "out", label: "نفد" },
];

const categoryFilters = [
  { id: "all", label: "كل الأصناف" },
  { id: "medicines", label: "أدوية" },
  { id: "cosmetics", label: "مستحضرات تجميل" },
  { id: "supplements", label: "مكملات غذائية" },
  { id: "equipment", label: "أجهزة طبية" },
  { id: "other", label: "أخرى" },
];

const categoryLabels: Record<string, string> = {
  medicines: "أدوية",
  cosmetics: "مستحضرات تجميل",
  supplements: "مكملات غذائية",
  equipment: "أجهزة طبية",
  other: "أخرى",
};

export default function Inventory() {
  const { getProducts, getBranches, getSuppliers, addProduct, updateProduct, deleteProduct } = useDatabase();
  const [products, setProducts] = useState<Product[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    setProducts(getProducts());
    setBranches(getBranches());
    setSuppliers(getSuppliers());
  }, [getProducts, getBranches, getSuppliers]);

  const refreshProducts = () => {
    setProducts(getProducts());
  };

  const handleAddProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    refreshProducts();
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      refreshProducts();
    }
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter(prod => {
        if (statusFilter !== "all") return prod.status === statusFilter;
        return true;
      })
      .filter(prod => {
        if (categoryFilter !== "all") return prod.category === categoryFilter;
        return true;
      })
      .filter(prod => {
        if (selectedBranch !== "all") return prod.branchId === selectedBranch;
        return true;
      })
      .filter(prod => 
        prod.name.includes(searchQuery) || 
        prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prod.barcode && prod.barcode.includes(searchQuery))
      );
  }, [products, statusFilter, categoryFilter, selectedBranch, searchQuery]);

  const stats = useMemo(() => {
    const total = products.length;
    const available = products.filter(p => p.status === "available").length;
    const low = products.filter(p => p.status === "low").length;
    const out = products.filter(p => p.status === "out").length;
    const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
    
    return { total, available, low, out, totalValue };
  }, [products]);

  const getBranchName = (branchId: string) => {
    return branches.find(b => b.id === branchId)?.name || "غير محدد";
  };

  const getSupplierName = (supplierId?: string) => {
    if (!supplierId) return null;
    return suppliers.find(s => s.id === supplierId)?.name;
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ar-EG') + " ج.م";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'low':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'out':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'متوفر';
      case 'low': return 'منخفض';
      case 'out': return 'نفد';
      default: return status;
    }
  };

  const lowStockProducts = products.filter(p => p.status === "low");
  const outOfStockProducts = products.filter(p => p.status === "out");

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="إدارة المخزون" />

      <main className="px-4 py-4 space-y-4">
        {/* Offline Banner */}
        <div className="offline-banner animate-fade-in">
          <WifiOff className="w-4 h-4" />
          <span>وضع غير متصل - البيانات محفوظة محليًا</span>
        </div>

        {/* Alerts */}
        {outOfStockProducts.length > 0 && (
          <Alert variant="destructive" className="animate-fade-in">
            <XCircle className="h-4 w-4" />
            <AlertDescription className="text-right">
              <strong>{outOfStockProducts.length} صنف</strong> نفد من المخزون ويحتاج إلى طلب فوري
            </AlertDescription>
          </Alert>
        )}

        {lowStockProducts.length > 0 && (
          <Alert className="border-warning/50 bg-warning/10 animate-fade-in">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-right text-warning">
              <strong>{lowStockProducts.length} صنف</strong> على وشك النفاد
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="pharma-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">إجمالي الأصناف</p>
              </div>
            </div>
          </div>
          
          <div className="pharma-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-success/10">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-lg font-bold">{formatCurrency(stats.totalValue)}</p>
                <p className="text-xs text-muted-foreground">قيمة المخزون</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="pharma-card p-3 text-center">
            <p className="text-xl font-bold text-success">{stats.available}</p>
            <p className="text-xs text-muted-foreground">متوفر</p>
          </div>
          <div className="pharma-card p-3 text-center">
            <p className="text-xl font-bold text-warning">{stats.low}</p>
            <p className="text-xs text-muted-foreground">منخفض</p>
          </div>
          <div className="pharma-card p-3 text-center">
            <p className="text-xl font-bold text-destructive">{stats.out}</p>
            <p className="text-xs text-muted-foreground">نفد</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Input
            placeholder="بحث بالاسم أو الرمز أو الباركود..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pharma-input pl-10 pr-12"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <button className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-muted transition-colors">
            <Filter className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Branch Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedBranch("all")}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5",
              selectedBranch === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground"
            )}
          >
            <Building2 className="w-3.5 h-3.5" />
            كل الفروع
          </button>
          {branches.map((branch) => (
            <button
              key={branch.id}
              onClick={() => setSelectedBranch(branch.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                selectedBranch === branch.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground"
              )}
            >
              {branch.name}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categoryFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setCategoryFilter(filter.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                categoryFilter === filter.id
                  ? "bg-info text-info-foreground"
                  : "bg-card border border-border text-muted-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Status Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {statusFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setStatusFilter(filter.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                statusFilter === filter.id
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-card border border-border text-muted-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Products List */}
        <div className="space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="pharma-card p-8 text-center">
              <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-muted-foreground">لا توجد أصناف مطابقة</p>
            </div>
          ) : (
            filteredProducts.map((product, index) => {
              const supplierName = getSupplierName(product.supplierId);
              const isExpiringSoon = product.expiryDate && 
                new Date(product.expiryDate) <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
              
              return (
                <div
                  key={product.id}
                  className={cn(
                    "pharma-card p-4 animate-slide-up",
                    product.status === "available" && "border-r-4 border-r-success",
                    product.status === "low" && "border-r-4 border-r-warning",
                    product.status === "out" && "border-r-4 border-r-destructive"
                  )}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{product.name}</h3>
                        <span className={cn(
                          "pharma-badge text-[10px] flex items-center gap-1",
                          product.status === "available" && "pharma-badge-success",
                          product.status === "low" && "pharma-badge-warning",
                          product.status === "out" && "pharma-badge-error"
                        )}>
                          {getStatusIcon(product.status)}
                          {getStatusLabel(product.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
                        <span className="pharma-badge pharma-badge-info text-[10px]">
                          {categoryLabels[product.category]}
                        </span>
                        <span>•</span>
                        <span>{getBranchName(product.branchId)}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 rounded-lg hover:bg-muted">
                          <MoreVertical className="w-5 h-5 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                          <Edit2 className="w-4 h-4 ml-2" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 ml-2" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Product Info */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Barcode className="w-3.5 h-3.5" />
                      <span dir="ltr">{product.sku}</span>
                    </div>
                    {supplierName && (
                      <div className="flex items-center gap-1">
                        <span>المورد: {supplierName}</span>
                      </div>
                    )}
                  </div>

                  {/* Quantity and Price */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">الكمية</p>
                      <p className={cn(
                        "text-sm font-bold",
                        product.quantity === 0 && "text-destructive",
                        product.quantity > 0 && product.quantity <= product.minQuantity && "text-warning"
                      )}>
                        {product.quantity}
                      </p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">الحد الأدنى</p>
                      <p className="text-sm font-semibold">{product.minQuantity}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">التكلفة</p>
                      <p className="text-sm font-semibold">{product.costPrice}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-primary/10">
                      <p className="text-xs text-muted-foreground">السعر</p>
                      <p className="text-sm font-bold text-primary">{product.price}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    {product.expiryDate ? (
                      <div className={cn(
                        "flex items-center gap-1 text-xs",
                        isExpiringSoon ? "text-warning" : "text-muted-foreground"
                      )}>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          ينتهي: {new Date(product.expiryDate).toLocaleDateString('ar-EG')}
                          {isExpiringSoon && " ⚠️"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">بدون تاريخ صلاحية</span>
                    )}
                    <div className="text-xs text-muted-foreground">
                      القيمة: {formatCurrency(product.quantity * product.price)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Add Button */}
      <Button 
        onClick={() => {
          setEditingProduct(null);
          setIsModalOpen(true);
        }}
        className="fixed bottom-20 left-4 right-4 h-12 rounded-xl pharma-btn-primary gap-2 shadow-lg"
      >
        <Plus className="w-5 h-5" />
        إضافة صنف جديد
      </Button>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleAddProduct}
        editProduct={editingProduct}
        branches={branches}
        suppliers={suppliers}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من حذف هذا الصنف؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNavigation />
    </div>
  );
}
