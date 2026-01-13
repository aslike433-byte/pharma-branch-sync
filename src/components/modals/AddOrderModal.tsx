import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDatabase } from "@/hooks/useDatabase";
import { Order, OrderItem, Supplier, Branch, Product } from "@/lib/database/types";
import { Plus, Trash2 } from "lucide-react";

interface AddOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: Order | null;
  onSuccess: () => void;
}

export function AddOrderModal({ open, onOpenChange, order, onSuccess }: AddOrderModalProps) {
  const { getSuppliers, getBranches, getProducts, addOrder, updateOrder } = useDatabase();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    supplierId: "",
    branchId: "",
    status: "pending" as Order["status"],
    paymentStatus: "unpaid" as Order["paymentStatus"],
    expectedDeliveryDate: "",
    notes: "",
  });

  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    setSuppliers(getSuppliers());
    setBranches(getBranches());
    setProducts(getProducts());
  }, []);

  useEffect(() => {
    if (order) {
      setFormData({
        supplierId: order.supplierId,
        branchId: order.branchId,
        status: order.status,
        paymentStatus: order.paymentStatus,
        expectedDeliveryDate: order.expectedDeliveryDate || "",
        notes: order.notes || "",
      });
      setItems(order.items);
    } else {
      setFormData({
        supplierId: "",
        branchId: "",
        status: "pending",
        paymentStatus: "unpaid",
        expectedDeliveryDate: "",
        notes: "",
      });
      setItems([]);
    }
  }, [order, open]);

  const addItem = () => {
    setItems([...items, { productId: "", productName: "", quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...items];
    if (field === "productId") {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index] = {
          ...newItems[index],
          productId: product.id,
          productName: product.name,
          unitPrice: product.costPrice,
          total: newItems[index].quantity * product.costPrice,
        };
      }
    } else if (field === "quantity") {
      const qty = Number(value);
      newItems[index] = {
        ...newItems[index],
        quantity: qty,
        total: qty * newItems[index].unitPrice,
      };
    } else if (field === "unitPrice") {
      const price = Number(value);
      newItems[index] = {
        ...newItems[index],
        unitPrice: price,
        total: newItems[index].quantity * price,
      };
    }
    setItems(newItems);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

  const generateOrderNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `ORD-${year}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    try {
      const orderData = {
        ...formData,
        items,
        totalAmount,
        orderNumber: order?.orderNumber || generateOrderNumber(),
        orderDate: order?.orderDate || new Date().toISOString().split("T")[0],
        deliveredDate: formData.status === "delivered" ? new Date().toISOString().split("T")[0] : undefined,
      };

      if (order) {
        updateOrder(order.id, orderData);
      } else {
        addOrder(orderData);
      }
      onSuccess();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: "pending", label: "قيد الانتظار" },
    { value: "confirmed", label: "مؤكد" },
    { value: "shipped", label: "تم الشحن" },
    { value: "delivered", label: "تم التسليم" },
    { value: "cancelled", label: "ملغي" },
  ];

  const paymentOptions = [
    { value: "unpaid", label: "غير مدفوع" },
    { value: "partial", label: "مدفوع جزئياً" },
    { value: "paid", label: "مدفوع" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{order ? "تعديل الطلب" : "إضافة طلب جديد"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>المورد</Label>
              <Select
                value={formData.supplierId}
                onValueChange={(value) => setFormData({ ...formData, supplierId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المورد" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الفرع</Label>
              <Select
                value={formData.branchId}
                onValueChange={(value) => setFormData({ ...formData, branchId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفرع" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>حالة الطلب</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Order["status"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>حالة الدفع</Label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value) => setFormData({ ...formData, paymentStatus: value as Order["paymentStatus"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>تاريخ التسليم المتوقع</Label>
            <Input
              type="date"
              value={formData.expectedDeliveryDate}
              onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
            />
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">الأصناف</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 ml-1" />
                إضافة صنف
              </Button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Select
                    value={item.productId}
                    onValueChange={(value) => updateItem(index, "productId", value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="اختر الصنف" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs">الكمية</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">سعر الوحدة</Label>
                    <Input
                      type="number"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">الإجمالي</Label>
                    <Input type="text" value={`${item.total.toLocaleString()} ج.م`} disabled />
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                لم تتم إضافة أي أصناف بعد
              </div>
            )}

            {items.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <span className="font-semibold">إجمالي الطلب:</span>
                <span className="text-lg font-bold text-primary">{totalAmount.toLocaleString()} ج.م</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>ملاحظات</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="ملاحظات إضافية..."
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={loading || items.length === 0}>
              {loading ? "جاري الحفظ..." : order ? "تحديث" : "إضافة"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
