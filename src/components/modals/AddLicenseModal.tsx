import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { License, Branch } from "@/lib/database/types";

interface AddLicenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (license: Omit<License, 'id' | 'createdAt' | 'updatedAt'>) => void;
  license?: License | null;
  branches: Branch[];
}

const licenseTypes = [
  { value: "pharmacy", label: "رخصة صيدلية" },
  { value: "employee", label: "رخصة موظف" },
  { value: "maintenance", label: "رخصة صيانة" },
  { value: "health", label: "شهادة صحية" },
];

export function AddLicenseModal({
  open,
  onOpenChange,
  onSubmit,
  license,
  branches,
}: AddLicenseModalProps) {
  const [formData, setFormData] = useState({
    branchId: "",
    type: "pharmacy" as License['type'],
    name: "",
    licenseNumber: "",
    issueDate: new Date(),
    expiryDate: new Date(),
    status: "valid" as License['status'],
    documentUrl: "",
  });

  useEffect(() => {
    if (license) {
      setFormData({
        branchId: license.branchId,
        type: license.type,
        name: license.name,
        licenseNumber: license.licenseNumber,
        issueDate: new Date(license.issueDate),
        expiryDate: new Date(license.expiryDate),
        status: license.status,
        documentUrl: license.documentUrl || "",
      });
    } else {
      setFormData({
        branchId: branches[0]?.id || "",
        type: "pharmacy",
        name: "",
        licenseNumber: "",
        issueDate: new Date(),
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        status: "valid",
        documentUrl: "",
      });
    }
  }, [license, branches, open]);

  const calculateStatus = (expiryDate: Date): License['status'] => {
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 30) return 'expiring';
    return 'valid';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const status = calculateStatus(formData.expiryDate);
    onSubmit({
      branchId: formData.branchId,
      type: formData.type,
      name: formData.name,
      licenseNumber: formData.licenseNumber,
      issueDate: formData.issueDate.toISOString(),
      expiryDate: formData.expiryDate.toISOString(),
      status,
      documentUrl: formData.documentUrl || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right">
            {license ? "تعديل الترخيص" : "إضافة ترخيص جديد"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* الفرع */}
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

          {/* نوع الترخيص */}
          <div className="space-y-2">
            <Label>نوع الترخيص</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as License['type'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {licenseTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* اسم الترخيص */}
          <div className="space-y-2">
            <Label>اسم الترخيص</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: رخصة مزاولة المهنة"
              required
            />
          </div>

          {/* رقم الترخيص */}
          <div className="space-y-2">
            <Label>رقم الترخيص</Label>
            <Input
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              placeholder="مثال: PH-2024-001"
              required
            />
          </div>

          {/* تاريخ الإصدار */}
          <div className="space-y-2">
            <Label>تاريخ الإصدار</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-right font-normal",
                    !formData.issueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {formData.issueDate ? (
                    format(formData.issueDate, "dd/MM/yyyy", { locale: ar })
                  ) : (
                    <span>اختر التاريخ</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.issueDate}
                  onSelect={(date) => date && setFormData({ ...formData, issueDate: date })}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* تاريخ الانتهاء */}
          <div className="space-y-2">
            <Label>تاريخ الانتهاء</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-right font-normal",
                    !formData.expiryDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {formData.expiryDate ? (
                    format(formData.expiryDate, "dd/MM/yyyy", { locale: ar })
                  ) : (
                    <span>اختر التاريخ</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.expiryDate}
                  onSelect={(date) => date && setFormData({ ...formData, expiryDate: date })}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 pharma-btn-primary">
              {license ? "حفظ التعديلات" : "إضافة الترخيص"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
