import { useState } from "react";
import { X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Supplier } from "@/lib/database/types";
import { cn } from "@/lib/utils";

interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editSupplier?: Supplier | null;
}

export function AddSupplierModal({ isOpen, onClose, onSave, editSupplier }: AddSupplierModalProps) {
  const [formData, setFormData] = useState({
    name: editSupplier?.name || "",
    phone: editSupplier?.phone || "",
    email: editSupplier?.email || "",
    address: editSupplier?.address || "",
    rating: editSupplier?.rating || 3,
    status: editSupplier?.status || "active" as const,
    totalOrders: editSupplier?.totalOrders || 0,
    lastOrderDate: editSupplier?.lastOrderDate || new Date().toISOString().split('T')[0],
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card rounded-t-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {editSupplier ? "تعديل المورد" : "إضافة مورد جديد"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">اسم المورد / الشركة</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: شركة الأمل الطبية"
              className="pharma-input"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="01XXXXXXXXX"
              className="pharma-input"
              dir="ltr"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="example@company.com"
              className="pharma-input"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">العنوان</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="مثال: المنطقة الصناعية، القاهرة"
              className="pharma-input"
            />
          </div>

          <div className="space-y-2">
            <Label>التقييم</Label>
            <div className="flex gap-2 justify-center py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "w-8 h-8 transition-colors",
                      star <= formData.rating
                        ? "fill-warning text-warning"
                        : "text-muted-foreground"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>حالة المورد</Label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: "active" })}
                className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                  formData.status === "active"
                    ? "border-success bg-success/10 text-success"
                    : "border-border text-muted-foreground"
                }`}
              >
                نشط
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: "inactive" })}
                className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                  formData.status === "inactive"
                    ? "border-warning bg-warning/10 text-warning"
                    : "border-border text-muted-foreground"
                }`}
              >
                غير نشط
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-12 rounded-xl">
              إلغاء
            </Button>
            <Button type="submit" className="flex-1 h-12 rounded-xl pharma-btn-primary">
              {editSupplier ? "حفظ التعديلات" : "إضافة المورد"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
