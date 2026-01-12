import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product, Branch, Supplier } from "@/lib/database/types";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editProduct?: Product | null;
  branches: Branch[];
  suppliers: Supplier[];
}

const categories = [
  { value: 'medicines', label: 'أدوية' },
  { value: 'cosmetics', label: 'مستحضرات تجميل' },
  { value: 'supplements', label: 'مكملات غذائية' },
  { value: 'equipment', label: 'أجهزة طبية' },
  { value: 'other', label: 'أخرى' },
];

type CategoryType = 'medicines' | 'cosmetics' | 'supplements' | 'equipment' | 'other';
type StatusType = 'available' | 'low' | 'out';

export function AddProductModal({ isOpen, onClose, onSave, editProduct, branches, suppliers }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    branchId: "",
    category: "medicines" as CategoryType,
    sku: "",
    barcode: "",
    quantity: 0,
    minQuantity: 10,
    price: 0,
    costPrice: 0,
    supplierId: "",
    expiryDate: "",
    status: "available" as StatusType,
  });

  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name,
        branchId: editProduct.branchId,
        category: editProduct.category,
        sku: editProduct.sku,
        barcode: editProduct.barcode || "",
        quantity: editProduct.quantity,
        minQuantity: editProduct.minQuantity,
        price: editProduct.price,
        costPrice: editProduct.costPrice,
        supplierId: editProduct.supplierId || "",
        expiryDate: editProduct.expiryDate || "",
        status: editProduct.status,
      });
    } else {
      setFormData({
        name: "",
        branchId: branches[0]?.id || "",
        category: "medicines",
        sku: `SKU-${Date.now().toString(36).toUpperCase()}`,
        barcode: "",
        quantity: 0,
        minQuantity: 10,
        price: 0,
        costPrice: 0,
        supplierId: "",
        expiryDate: "",
        status: "available",
      });
    }
  }, [editProduct, branches, isOpen]);

  // Auto-calculate status based on quantity
  useEffect(() => {
    let newStatus: StatusType = "available";
    if (formData.quantity === 0) {
      newStatus = "out";
    } else if (formData.quantity <= formData.minQuantity) {
      newStatus = "low";
    }
    setFormData(prev => ({ ...prev, status: newStatus }));
  }, [formData.quantity, formData.minQuantity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      barcode: formData.barcode || undefined,
      supplierId: formData.supplierId || undefined,
      expiryDate: formData.expiryDate || undefined,
    });
    onClose();
  };

  const profit = formData.price - formData.costPrice;
  const profitMargin = formData.costPrice > 0 ? ((profit / formData.costPrice) * 100).toFixed(1) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right">
            {editProduct ? "تعديل بيانات الصنف" : "إضافة صنف جديد"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">اسم الصنف</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="أدخل اسم الصنف"
              required
              className="text-right"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="branch">الفرع</Label>
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

            <div className="space-y-2">
              <Label htmlFor="category">التصنيف</Label>
              <Select
                value={formData.category}
                onValueChange={(value: CategoryType) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="sku">رمز الصنف (SKU)</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="SKU-001"
                required
                className="text-left"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode">الباركود (اختياري)</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="123456789"
                className="text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier">المورد (اختياري)</Label>
            <Select
              value={formData.supplierId}
              onValueChange={(value) => setFormData({ ...formData, supplierId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر المورد" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">بدون مورد</SelectItem>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border-t border-border pt-4">
            <h4 className="font-medium mb-3 text-right">الكميات</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="quantity">الكمية المتاحة</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  placeholder="0"
                  min={0}
                  className="text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minQuantity">الحد الأدنى للتنبيه</Label>
                <Input
                  id="minQuantity"
                  type="number"
                  value={formData.minQuantity}
                  onChange={(e) => setFormData({ ...formData, minQuantity: Number(e.target.value) })}
                  placeholder="10"
                  min={0}
                  className="text-left"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h4 className="font-medium mb-3 text-right">الأسعار</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="costPrice">سعر التكلفة</Label>
                <Input
                  id="costPrice"
                  type="number"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                  placeholder="0"
                  min={0}
                  step={0.01}
                  className="text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">سعر البيع</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder="0"
                  min={0}
                  step={0.01}
                  className="text-left"
                  dir="ltr"
                />
              </div>
            </div>

            {formData.costPrice > 0 && (
              <div className="mt-3 p-3 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">هامش الربح:</span>
                  <span className="text-lg font-bold text-success">
                    {profit.toLocaleString('ar-EG')} ج.م ({profitMargin}%)
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">تاريخ انتهاء الصلاحية (اختياري)</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="text-left"
              dir="ltr"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 pharma-btn-primary">
              {editProduct ? "حفظ التعديلات" : "إضافة الصنف"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
