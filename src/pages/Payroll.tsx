import { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  WifiOff,
  Users,
  Wallet,
  TrendingUp,
  Phone,
  Mail,
  Building2,
  Calendar,
  DollarSign,
  Calculator
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddEmployeeModal } from "@/components/modals/AddEmployeeModal";
import { useDatabase } from "@/hooks/useDatabase";
import { Employee, Branch } from "@/lib/database/types";
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

const filters = [
  { id: "all", label: "الكل" },
  { id: "active", label: "نشط" },
  { id: "inactive", label: "غير نشط" },
  { id: "highest", label: "الأعلى راتب" },
];

export default function Payroll() {
  const { getEmployees, getBranches, addEmployee, updateEmployee, deleteEmployee } = useDatabase();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  useEffect(() => {
    setEmployees(getEmployees());
    setBranches(getBranches());
  }, [getEmployees, getBranches]);

  const refreshEmployees = () => {
    setEmployees(getEmployees());
  };

  const handleAddEmployee = (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, employeeData);
    } else {
      addEmployee(employeeData);
    }
    refreshEmployees();
    setEditingEmployee(null);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployeeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      deleteEmployee(employeeToDelete);
      refreshEmployees();
    }
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const filteredEmployees = useMemo(() => {
    return employees
      .filter(emp => {
        if (activeFilter === "active") return emp.status === "active";
        if (activeFilter === "inactive") return emp.status === "inactive";
        return true;
      })
      .filter(emp => {
        if (selectedBranch !== "all") return emp.branchId === selectedBranch;
        return true;
      })
      .filter(emp => 
        emp.name.includes(searchQuery) || 
        emp.position.includes(searchQuery) ||
        emp.phone.includes(searchQuery)
      )
      .sort((a, b) => {
        if (activeFilter === "highest") {
          return (b.salary + b.allowances - b.deductions) - (a.salary + a.allowances - a.deductions);
        }
        return 0;
      });
  }, [employees, activeFilter, selectedBranch, searchQuery]);

  const stats = useMemo(() => {
    const activeEmployees = employees.filter(e => e.status === "active");
    const totalSalaries = activeEmployees.reduce((sum, e) => sum + e.salary, 0);
    const totalAllowances = activeEmployees.reduce((sum, e) => sum + e.allowances, 0);
    const totalDeductions = activeEmployees.reduce((sum, e) => sum + e.deductions, 0);
    const netTotal = totalSalaries + totalAllowances - totalDeductions;
    
    return {
      totalEmployees: employees.length,
      activeEmployees: activeEmployees.length,
      totalSalaries,
      totalAllowances,
      totalDeductions,
      netTotal,
    };
  }, [employees]);

  const getBranchName = (branchId: string) => {
    return branches.find(b => b.id === branchId)?.name || "غير محدد";
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ar-EG') + " ج.م";
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="إدارة الرواتب والموظفين" />

      <main className="px-4 py-4 space-y-4">
        {/* Offline Banner */}
        <div className="offline-banner animate-fade-in">
          <WifiOff className="w-4 h-4" />
          <span>وضع غير متصل - البيانات محفوظة محليًا</span>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="pharma-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalEmployees}</p>
                <p className="text-xs text-muted-foreground">إجمالي الموظفين</p>
              </div>
            </div>
          </div>
          
          <div className="pharma-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-success/10">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{stats.activeEmployees}</p>
                <p className="text-xs text-muted-foreground">موظف نشط</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payroll Summary */}
        <div className="pharma-card p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">ملخص الرواتب الشهرية</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">الرواتب الأساسية</p>
              <p className="text-sm font-semibold">{formatCurrency(stats.totalSalaries)}</p>
            </div>
            <div className="p-2 rounded-lg bg-success/10">
              <p className="text-xs text-muted-foreground">البدلات</p>
              <p className="text-sm font-semibold text-success">+{formatCurrency(stats.totalAllowances)}</p>
            </div>
            <div className="p-2 rounded-lg bg-destructive/10">
              <p className="text-xs text-muted-foreground">الخصومات</p>
              <p className="text-sm font-semibold text-destructive">-{formatCurrency(stats.totalDeductions)}</p>
            </div>
          </div>
          
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
            <span className="font-medium">صافي الرواتب الشهرية:</span>
            <span className="text-xl font-bold text-primary">{formatCurrency(stats.netTotal)}</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Input
            placeholder="بحث في الموظفين..."
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

        {/* Status Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                activeFilter === filter.id
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-card border border-border text-muted-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Employees List */}
        <div className="space-y-3">
          {filteredEmployees.length === 0 ? (
            <div className="pharma-card p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-muted-foreground">لا يوجد موظفين مطابقين</p>
            </div>
          ) : (
            filteredEmployees.map((employee, index) => {
              const netSalary = employee.salary + employee.allowances - employee.deductions;
              
              return (
                <div
                  key={employee.id}
                  className={cn(
                    "pharma-card p-4 animate-slide-up",
                    employee.status === "active" && "border-r-4 border-r-success"
                  )}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{employee.name}</h3>
                        {employee.status === "inactive" && (
                          <span className="pharma-badge pharma-badge-warning text-[10px]">غير نشط</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span className="pharma-badge pharma-badge-info text-[10px]">{employee.position}</span>
                        <span className="text-xs">•</span>
                        <span className="text-xs">{getBranchName(employee.branchId)}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 rounded-lg hover:bg-muted">
                          <MoreVertical className="w-5 h-5 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditEmployee(employee)}>
                          <Edit2 className="w-4 h-4 ml-2" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 ml-2" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      <span dir="ltr">{employee.phone}</span>
                    </div>
                    {employee.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        <span dir="ltr" className="truncate max-w-[120px]">{employee.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Salary Details */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">الأساسي</p>
                      <p className="text-sm font-semibold">{(employee.salary / 1000).toFixed(1)}K</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-success/10">
                      <p className="text-xs text-muted-foreground">البدلات</p>
                      <p className="text-sm font-semibold text-success">+{(employee.allowances / 1000).toFixed(1)}K</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-destructive/10">
                      <p className="text-xs text-muted-foreground">الخصومات</p>
                      <p className="text-sm font-semibold text-destructive">-{(employee.deductions / 1000).toFixed(1)}K</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-primary/10">
                      <p className="text-xs text-muted-foreground">الصافي</p>
                      <p className="text-sm font-bold text-primary">{(netSalary / 1000).toFixed(1)}K</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>تاريخ التعيين: {new Date(employee.hireDate).toLocaleDateString('ar-EG')}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1.5 h-7 text-xs"
                        onClick={() => window.open(`tel:${employee.phone}`)}
                      >
                        <Phone className="w-3 h-3" />
                        اتصال
                      </Button>
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
          setEditingEmployee(null);
          setIsModalOpen(true);
        }}
        className="fixed bottom-20 left-4 right-4 h-12 rounded-xl pharma-btn-primary gap-2 shadow-lg"
      >
        <Plus className="w-5 h-5" />
        إضافة موظف جديد
      </Button>

      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleAddEmployee}
        editEmployee={editingEmployee}
        branches={branches}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من حذف هذا الموظف؟ لا يمكن التراجع عن هذا الإجراء.
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
