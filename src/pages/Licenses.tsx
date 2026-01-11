import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Building2,
  Calendar,
  Bell,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { ar } from "date-fns/locale";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { License, Branch } from "@/lib/database/types";
import { AddLicenseModal } from "@/components/modals/AddLicenseModal";
import { cn } from "@/lib/utils";

const licenseTypeLabels: Record<License['type'], string> = {
  pharmacy: "رخصة صيدلية",
  employee: "رخصة موظف",
  maintenance: "رخصة صيانة",
  health: "شهادة صحية",
};

const statusConfig = {
  valid: { label: "سارية", color: "bg-success/10 text-success", icon: CheckCircle },
  expiring: { label: "تنتهي قريباً", color: "bg-warning/10 text-warning", icon: Clock },
  expired: { label: "منتهية", color: "bg-destructive/10 text-destructive", icon: XCircle },
};

export default function Licenses() {
  const { getLicenses, getBranches, addLicense, updateLicense, deleteLicense } = useDatabase();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLicense, setEditingLicense] = useState<License | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [licenseToDelete, setLicenseToDelete] = useState<License | null>(null);

  useEffect(() => {
    setLicenses(getLicenses());
    setBranches(getBranches());
  }, [getLicenses, getBranches]);

  const getBranchName = (branchId: string) => {
    return branches.find((b) => b.id === branchId)?.name || "غير محدد";
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    return differenceInDays(new Date(expiryDate), new Date());
  };

  // Statistics
  const stats = useMemo(() => {
    const valid = licenses.filter((l) => l.status === "valid").length;
    const expiring = licenses.filter((l) => l.status === "expiring").length;
    const expired = licenses.filter((l) => l.status === "expired").length;
    return { valid, expiring, expired, total: licenses.length };
  }, [licenses]);

  // Filter licenses
  const filteredLicenses = useMemo(() => {
    return licenses.filter((license) => {
      const matchesSearch =
        license.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        license.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getBranchName(license.branchId).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || license.status === statusFilter;
      const matchesType = typeFilter === "all" || license.type === typeFilter;
      const matchesBranch = branchFilter === "all" || license.branchId === branchFilter;
      return matchesSearch && matchesStatus && matchesType && matchesBranch;
    });
  }, [licenses, searchQuery, statusFilter, typeFilter, branchFilter, branches]);

  // Sort by expiry (expiring first, then expired, then valid)
  const sortedLicenses = useMemo(() => {
    return [...filteredLicenses].sort((a, b) => {
      const priority = { expired: 0, expiring: 1, valid: 2 };
      if (priority[a.status] !== priority[b.status]) {
        return priority[a.status] - priority[b.status];
      }
      return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
    });
  }, [filteredLicenses]);

  const handleAddLicense = (licenseData: Omit<License, 'id' | 'createdAt' | 'updatedAt'>) => {
    addLicense(licenseData);
    setLicenses(getLicenses());
  };

  const handleEditLicense = (licenseData: Omit<License, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingLicense) {
      updateLicense(editingLicense.id, licenseData);
      setLicenses(getLicenses());
      setEditingLicense(null);
    }
  };

  const handleDeleteLicense = () => {
    if (licenseToDelete) {
      deleteLicense(licenseToDelete.id);
      setLicenses(getLicenses());
      setLicenseToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const openEditModal = (license: License) => {
    setEditingLicense(license);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (license: License) => {
    setLicenseToDelete(license);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="إدارة التراخيص" />

      <main className="px-4 py-4 space-y-4">
        {/* Alerts Summary */}
        {(stats.expiring > 0 || stats.expired > 0) && (
          <div className="space-y-2">
            {stats.expired > 0 && (
              <div className="pharma-card p-4 border-r-4 border-r-destructive bg-destructive/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-destructive">تراخيص منتهية</p>
                    <p className="text-sm text-muted-foreground">
                      {stats.expired} ترخيص منتهي يحتاج للتجديد فوراً
                    </p>
                  </div>
                  <Bell className="w-5 h-5 text-destructive animate-pulse" />
                </div>
              </div>
            )}
            {stats.expiring > 0 && (
              <div className="pharma-card p-4 border-r-4 border-r-warning bg-warning/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-warning">تراخيص تنتهي قريباً</p>
                    <p className="text-sm text-muted-foreground">
                      {stats.expiring} ترخيص ينتهي خلال 30 يوماً
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-2">
          <div className="pharma-card p-3 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">الإجمالي</p>
          </div>
          <div className="pharma-card p-3 text-center bg-success/5">
            <p className="text-2xl font-bold text-success">{stats.valid}</p>
            <p className="text-xs text-muted-foreground">سارية</p>
          </div>
          <div className="pharma-card p-3 text-center bg-warning/5">
            <p className="text-2xl font-bold text-warning">{stats.expiring}</p>
            <p className="text-xs text-muted-foreground">تنتهي قريباً</p>
          </div>
          <div className="pharma-card p-3 text-center bg-destructive/5">
            <p className="text-2xl font-bold text-destructive">{stats.expired}</p>
            <p className="text-xs text-muted-foreground">منتهية</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="البحث في التراخيص..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 flex-shrink-0">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="valid">سارية</SelectItem>
                <SelectItem value="expiring">تنتهي قريباً</SelectItem>
                <SelectItem value="expired">منتهية</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32 flex-shrink-0">
                <SelectValue placeholder="النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الأنواع</SelectItem>
                <SelectItem value="pharmacy">رخصة صيدلية</SelectItem>
                <SelectItem value="employee">رخصة موظف</SelectItem>
                <SelectItem value="maintenance">رخصة صيانة</SelectItem>
                <SelectItem value="health">شهادة صحية</SelectItem>
              </SelectContent>
            </Select>

            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="w-36 flex-shrink-0">
                <SelectValue placeholder="الفرع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الفروع</SelectItem>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Licenses List */}
        <div className="space-y-3">
          {sortedLicenses.length === 0 ? (
            <div className="pharma-card p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">لا توجد تراخيص</p>
            </div>
          ) : (
            sortedLicenses.map((license) => {
              const StatusIcon = statusConfig[license.status].icon;
              const daysLeft = getDaysUntilExpiry(license.expiryDate);

              return (
                <div
                  key={license.id}
                  className={cn(
                    "pharma-card p-4 transition-all",
                    license.status === "expired" && "border-r-4 border-r-destructive",
                    license.status === "expiring" && "border-r-4 border-r-warning"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          license.status === "valid" && "bg-success/10",
                          license.status === "expiring" && "bg-warning/10",
                          license.status === "expired" && "bg-destructive/10"
                        )}
                      >
                        <StatusIcon
                          className={cn(
                            "w-6 h-6",
                            license.status === "valid" && "text-success",
                            license.status === "expiring" && "text-warning",
                            license.status === "expired" && "text-destructive"
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{license.name}</h3>
                          <Badge
                            variant="outline"
                            className={cn("text-xs", statusConfig[license.status].color)}
                          >
                            {statusConfig[license.status].label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {license.licenseNumber}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {getBranchName(license.branchId)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {licenseTypeLabels[license.type]}
                          </span>
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditModal(license)}>
                          <Edit className="w-4 h-4 ml-2" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(license)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 ml-2" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Expiry Info */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>تنتهي: {format(new Date(license.expiryDate), "dd/MM/yyyy", { locale: ar })}</span>
                      </div>
                      <span
                        className={cn(
                          "font-medium",
                          daysLeft < 0 && "text-destructive",
                          daysLeft >= 0 && daysLeft <= 30 && "text-warning",
                          daysLeft > 30 && "text-success"
                        )}
                      >
                        {daysLeft < 0
                          ? `منتهية منذ ${Math.abs(daysLeft)} يوم`
                          : daysLeft === 0
                          ? "تنتهي اليوم"
                          : `متبقي ${daysLeft} يوم`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add Button */}
        <Button
          onClick={() => {
            setEditingLicense(null);
            setIsModalOpen(true);
          }}
          className="w-full h-12 rounded-xl pharma-btn-primary gap-2"
        >
          <Plus className="w-5 h-5" />
          إضافة ترخيص جديد
        </Button>
      </main>

      {/* Add/Edit Modal */}
      <AddLicenseModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingLicense(null);
        }}
        onSubmit={editingLicense ? handleEditLicense : handleAddLicense}
        license={editingLicense}
        branches={branches}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف الترخيص</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف "{licenseToDelete?.name}"؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLicense}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNavigation />
    </div>
  );
}
