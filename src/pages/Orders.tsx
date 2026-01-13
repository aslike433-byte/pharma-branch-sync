import { useState, useEffect, useMemo } from "react";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { useDatabase } from "@/hooks/useDatabase";
import { Order, Supplier, Branch } from "@/lib/database/types";
import { AddOrderModal } from "@/components/modals/AddOrderModal";
import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  ShoppingCart,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Package,
  CreditCard,
  Building2,
  Calendar,
  AlertTriangle,
} from "lucide-react";

export default function Orders() {
  const { getOrders, getSuppliers, getBranches, deleteOrder } = useDatabase();
  const [orders, setOrders] = useState<Order[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const loadData = () => {
    setOrders(getOrders());
    setSuppliers(getSuppliers());
    setBranches(getBranches());
  };

  useEffect(() => {
    loadData();
  }, []);

  const getSupplierName = (id: string) => suppliers.find((s) => s.id === id)?.name || "-";
  const getBranchName = (id: string) => branches.find((b) => b.id === id)?.name || "-";

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getSupplierName(order.supplierId).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesBranch = branchFilter === "all" || order.branchId === branchFilter;
      return matchesSearch && matchesStatus && matchesBranch;
    });
  }, [orders, searchQuery, statusFilter, branchFilter, suppliers]);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const shipped = orders.filter((o) => o.status === "shipped").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const totalValue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const unpaidValue = orders
      .filter((o) => o.paymentStatus !== "paid")
      .reduce((sum, o) => sum + o.totalAmount, 0);
    return { total, pending, shipped, delivered, totalValue, unpaidValue };
  }, [orders]);

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleDelete = (order: Order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      deleteOrder(orderToDelete.id);
      loadData();
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    }
  };

  const handleAddNew = () => {
    setSelectedOrder(null);
    setModalOpen(true);
  };

  const getStatusConfig = (status: Order["status"]) => {
    const configs = {
      pending: { label: "قيد الانتظار", icon: Clock, color: "bg-warning/20 text-warning" },
      confirmed: { label: "مؤكد", icon: CheckCircle2, color: "bg-info/20 text-info" },
      shipped: { label: "تم الشحن", icon: Truck, color: "bg-primary/20 text-primary" },
      delivered: { label: "تم التسليم", icon: Package, color: "bg-success/20 text-success" },
      cancelled: { label: "ملغي", icon: XCircle, color: "bg-destructive/20 text-destructive" },
    };
    return configs[status];
  };

  const getPaymentConfig = (status: Order["paymentStatus"]) => {
    const configs = {
      unpaid: { label: "غير مدفوع", color: "bg-destructive/20 text-destructive" },
      partial: { label: "مدفوع جزئياً", color: "bg-warning/20 text-warning" },
      paid: { label: "مدفوع", color: "bg-success/20 text-success" },
    };
    return configs[status];
  };

  return (
    <div className="min-h-screen bg-background pb-20" dir="rtl">
      <Header title="إدارة المشتريات" showBack />

      <main className="p-4 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-xl">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">إجمالي الطلبات</p>
                  <p className="text-xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-warning/10 to-warning/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/20 rounded-xl">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">قيد الانتظار</p>
                  <p className="text-xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/20 rounded-xl">
                  <CreditCard className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">إجمالي القيمة</p>
                  <p className="text-lg font-bold">{stats.totalValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/20 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">غير مدفوع</p>
                  <p className="text-lg font-bold">{stats.unpaidValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="بحث برقم الطلب أو المورد..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="confirmed">مؤكد</SelectItem>
                <SelectItem value="shipped">تم الشحن</SelectItem>
                <SelectItem value="delivered">تم التسليم</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>

            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="الفرع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفروع</SelectItem>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>لا توجد طلبات</p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const paymentConfig = getPaymentConfig(order.paymentStatus);
              const StatusIcon = statusConfig.icon;

              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${statusConfig.color}`}>
                          <StatusIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{order.orderNumber}</CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {getSupplierName(order.supplierId)}
                          </p>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(order)}>
                            <Edit2 className="w-4 h-4 ml-2" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(order)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className={statusConfig.color}>
                        {statusConfig.label}
                      </Badge>
                      <Badge variant="secondary" className={paymentConfig.color}>
                        {paymentConfig.label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="w-4 h-4" />
                        <span>{getBranchName(order.branchId)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(order.orderDate).toLocaleDateString("ar-EG")}</span>
                      </div>
                    </div>

                    <div className="p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {order.items.length} صنف
                        </span>
                        <span className="font-bold text-primary">
                          {order.totalAmount.toLocaleString()} ج.م
                        </span>
                      </div>
                    </div>

                    {order.expectedDeliveryDate && (
                      <p className="text-xs text-muted-foreground">
                        التسليم المتوقع:{" "}
                        {new Date(order.expectedDeliveryDate).toLocaleDateString("ar-EG")}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Add Button */}
        <Button
          onClick={handleAddNew}
          className="fixed bottom-20 left-4 h-14 w-14 rounded-full shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </main>

      <AddOrderModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        order={selectedOrder}
        onSuccess={loadData}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف الطلب "{orderToDelete?.orderNumber}"؟ لا يمكن التراجع عن هذا
              الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNavigation />
    </div>
  );
}
