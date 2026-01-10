import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Branch } from "@/lib/database/types";

interface AddBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (branch: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editBranch?: Branch | null;
}

export function AddBranchModal({ isOpen, onClose, onSave, editBranch }: AddBranchModalProps) {
  const [formData, setFormData] = useState({
    name: editBranch?.name || "",
    address: editBranch?.address || "",
    phone: editBranch?.phone || "",
    manager: editBranch?.manager || "",
    status: editBranch?.status || "active" as const,
    monthlySales: editBranch?.monthlySales || 0,
    employeesCount: editBranch?.employeesCount || 0,
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
            {editBranch ? "تعديل الفرع" : "إضافة فرع جديد"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">اسم الفرع</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: فرع المعادي"
              className="pharma-input"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">العنوان</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="مثال: 15 شارع النصر، المعادي"
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
            <Label htmlFor="manager">اسم المدير</Label>
            <Input
              id="manager"
              value={formData.manager}
              onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
              placeholder="مثال: محمد أحمد"
              className="pharma-input"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeesCount">عدد الموظفين</Label>
              <Input
                id="employeesCount"
                type="number"
                value={formData.employeesCount}
                onChange={(e) => setFormData({ ...formData, employeesCount: parseInt(e.target.value) || 0 })}
                className="pharma-input"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlySales">المبيعات الشهرية</Label>
              <Input
                id="monthlySales"
                type="number"
                value={formData.monthlySales}
                onChange={(e) => setFormData({ ...formData, monthlySales: parseInt(e.target.value) || 0 })}
                className="pharma-input"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>حالة الفرع</Label>
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
              {editBranch ? "حفظ التعديلات" : "إضافة الفرع"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
