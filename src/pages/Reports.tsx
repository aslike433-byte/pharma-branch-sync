import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  Users, 
  DollarSign, 
  Package,
  FileText,
  Calendar,
  Download,
  ChevronDown,
  BarChart3,
  PieChart,
  Loader2
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { useDatabase } from "@/hooks/useDatabase";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { exportReportToPDF } from "@/lib/pdfExport";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const months = [
  { value: "2024-01", label: "يناير 2024" },
  { value: "2024-02", label: "فبراير 2024" },
  { value: "2024-03", label: "مارس 2024" },
  { value: "2023-12", label: "ديسمبر 2023" },
  { value: "2023-11", label: "نوفمبر 2023" },
];

const reportTypes = [
  { id: "overview", label: "نظرة عامة", icon: BarChart3 },
  { id: "branches", label: "الفروع", icon: Building2 },
  { id: "sales", label: "المبيعات", icon: DollarSign },
  { id: "employees", label: "الموظفين", icon: Users },
];

export default function Reports() {
  const { getStats, getBranches, getSuppliers, getEmployees, getLicenses } = useDatabase();
  const [selectedMonth, setSelectedMonth] = useState("2024-01");
  const [activeReport, setActiveReport] = useState("overview");
  const [stats, setStats] = useState<ReturnType<typeof getStats> | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const dbStats = getStats();
    setStats(dbStats);
  }, [getStats]);

  const branches = getBranches();
  const suppliers = getSuppliers();
  const employees = getEmployees();
  const licenses = getLicenses();

  // حساب إحصائيات إضافية
  const totalSales = branches.reduce((sum, b) => sum + b.monthlySales, 0);
  const avgSalesPerBranch = branches.length > 0 ? totalSales / branches.length : 0;
  const topBranch = branches.reduce((max, b) => b.monthlySales > (max?.monthlySales || 0) ? b : max, branches[0]);
  const lowBranch = branches.reduce((min, b) => b.monthlySales < (min?.monthlySales || Infinity) ? b : min, branches[0]);

  const avgRating = suppliers.length > 0 
    ? suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length 
    : 0;

  const totalSalaries = employees.reduce((sum, e) => sum + e.salary + e.allowances - e.deductions, 0);

  const validLicenses = licenses.filter(l => l.status === 'valid').length;
  const expiringLicenses = licenses.filter(l => l.status === 'expiring').length;
  const expiredLicenses = licenses.filter(l => l.status === 'expired').length;

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      exportReportToPDF({
        branches,
        employees,
        suppliers,
        licenses,
        stats: {
          totalBranches: stats?.totalBranches || 0,
          activeBranches: stats?.activeBranches || 0,
          totalSuppliers: stats?.totalSuppliers || 0,
          activeSuppliers: stats?.activeSuppliers || 0,
          totalEmployees: stats?.totalEmployees || 0,
          totalSales: totalSales,
        },
        selectedMonth,
        reportType: activeReport,
      });
      toast({
        title: "تم التصدير بنجاح",
        description: "تم تحميل ملف PDF للتقرير",
      });
    } catch (error) {
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير التقرير",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="التقارير والإحصائيات" />

      <main className="px-4 py-4 space-y-4">
        {/* Period Selector */}
        <div className="pharma-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-medium">الفترة الزمنية</span>
            </div>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Report Type Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveReport(type.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                activeReport === type.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card border border-border text-muted-foreground hover:border-primary/30"
              )}
            >
              <type.icon className="w-4 h-4" />
              {type.label}
            </button>
          ))}
        </div>

        {/* Overview Report */}
        {activeReport === "overview" && (
          <div className="space-y-4 animate-fade-in">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="pharma-card p-4 bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">إجمالي المبيعات</p>
                    <p className="text-xl font-bold">{(totalSales / 1000000).toFixed(2)}M</p>
                    <div className="flex items-center gap-1 text-success text-xs">
                      <TrendingUp className="w-3 h-3" />
                      <span>+12%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pharma-card p-4 bg-gradient-to-br from-success/10 to-success/5">
              <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">الفروع النشطة</p>
                    <p className="text-xl font-bold">{stats?.activeBranches || 0}/{stats?.totalBranches || 0}</p>
                    <p className="text-xs text-muted-foreground">فرع</p>
                  </div>
                </div>
              </div>

              <div className="pharma-card p-4 bg-gradient-to-br from-info/10 to-info/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-info/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-info" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">الموظفين</p>
                    <p className="text-xl font-bold">{stats?.totalEmployees || 0}</p>
                    <p className="text-xs text-muted-foreground">موظف</p>
                  </div>
                </div>
              </div>

              <div className="pharma-card p-4 bg-gradient-to-br from-warning/10 to-warning/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                    <Package className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">الموردين</p>
                    <p className="text-xl font-bold">{stats?.activeSuppliers || 0}/{stats?.totalSuppliers || 0}</p>
                    <p className="text-xs text-muted-foreground">نشط</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Insights */}
            <div className="pharma-card p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                ملخص سريع
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm">متوسط المبيعات للفرع</span>
                  <span className="font-bold text-primary">{(avgSalesPerBranch / 1000).toFixed(0)}K ج.م</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm">إجمالي الرواتب</span>
                  <span className="font-bold text-info">{(totalSalaries / 1000).toFixed(0)}K ج.م</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm">متوسط تقييم الموردين</span>
                  <span className="font-bold text-warning">{avgRating.toFixed(1)} ⭐</span>
                </div>
              </div>
            </div>

            {/* Licenses Status */}
            <div className="pharma-card p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                حالة التراخيص
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-success/10">
                  <p className="text-2xl font-bold text-success">{validLicenses}</p>
                  <p className="text-xs text-muted-foreground">سارية</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-warning/10">
                  <p className="text-2xl font-bold text-warning">{expiringLicenses}</p>
                  <p className="text-xs text-muted-foreground">تنتهي قريباً</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-destructive/10">
                  <p className="text-2xl font-bold text-destructive">{expiredLicenses}</p>
                  <p className="text-xs text-muted-foreground">منتهية</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Branches Report */}
        {activeReport === "branches" && (
          <div className="space-y-4 animate-fade-in">
            {/* Top & Bottom Performers */}
            <div className="grid grid-cols-2 gap-3">
              <div className="pharma-card p-4 border-r-4 border-r-success">
                <p className="text-xs text-muted-foreground mb-1">أعلى مبيعات</p>
                <p className="font-bold">{topBranch?.name || '-'}</p>
                <p className="text-success text-lg font-bold">
                  {topBranch ? (topBranch.monthlySales / 1000).toFixed(0) + 'K' : '-'}
                </p>
              </div>
              <div className="pharma-card p-4 border-r-4 border-r-destructive">
                <p className="text-xs text-muted-foreground mb-1">أقل مبيعات</p>
                <p className="font-bold">{lowBranch?.name || '-'}</p>
                <p className="text-destructive text-lg font-bold">
                  {lowBranch ? (lowBranch.monthlySales / 1000).toFixed(0) + 'K' : '-'}
                </p>
              </div>
            </div>

            {/* Branches Performance List */}
            <div className="pharma-card p-4">
              <h3 className="font-semibold mb-4">أداء الفروع</h3>
              <div className="space-y-3">
                {branches
                  .sort((a, b) => b.monthlySales - a.monthlySales)
                  .map((branch, index) => {
                    const percentage = (branch.monthlySales / (topBranch?.monthlySales || 1)) * 100;
                    return (
                      <div key={branch.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                              index === 0 ? "bg-warning/20 text-warning" :
                              index === 1 ? "bg-muted text-muted-foreground" :
                              index === 2 ? "bg-orange-500/20 text-orange-500" :
                              "bg-muted/50 text-muted-foreground"
                            )}>
                              {index + 1}
                            </span>
                            <span className="font-medium text-sm">{branch.name}</span>
                          </div>
                          <span className="font-bold text-sm">
                            {(branch.monthlySales / 1000).toFixed(0)}K
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              index === 0 ? "bg-primary" :
                              index < 3 ? "bg-primary/70" :
                              "bg-primary/40"
                            )}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Branch Stats Summary */}
            <div className="pharma-card p-4">
              <h3 className="font-semibold mb-4">ملخص الفروع</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground">إجمالي الموظفين</p>
                  <p className="text-xl font-bold">{branches.reduce((sum, b) => sum + b.employeesCount, 0)}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground">متوسط الموظفين/فرع</p>
                  <p className="text-xl font-bold">
                    {branches.length > 0 ? (branches.reduce((sum, b) => sum + b.employeesCount, 0) / branches.length).toFixed(0) : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sales Report */}
        {activeReport === "sales" && (
          <div className="space-y-4 animate-fade-in">
            {/* Sales Overview */}
            <div className="pharma-card p-4 bg-gradient-to-br from-primary/10 to-transparent">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">إجمالي المبيعات</h3>
                <div className="flex items-center gap-1 text-success text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12% عن الشهر السابق</span>
                </div>
              </div>
              <p className="text-4xl font-bold text-primary mb-2">
                {(totalSales / 1000000).toFixed(2)}
                <span className="text-lg text-muted-foreground mr-1">مليون ج.م</span>
              </p>
            </div>

            {/* Sales by Branch */}
            <div className="pharma-card p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                توزيع المبيعات على الفروع
              </h3>
              <div className="space-y-3">
                {branches
                  .sort((a, b) => b.monthlySales - a.monthlySales)
                  .slice(0, 5)
                  .map((branch) => {
                    const percentage = ((branch.monthlySales / totalSales) * 100).toFixed(1);
                    return (
                      <div key={branch.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {branch.name.charAt(branch.name.indexOf(' ') + 1) || branch.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{branch.name}</p>
                            <p className="text-xs text-muted-foreground">{branch.employeesCount} موظف</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="font-bold">{(branch.monthlySales / 1000).toFixed(0)}K</p>
                          <p className="text-xs text-muted-foreground">{percentage}%</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Sales Comparison */}
            <div className="pharma-card p-4">
              <h3 className="font-semibold mb-4">مقارنة المبيعات</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-success/10">
                  <p className="text-xs text-muted-foreground mb-1">هذا الشهر</p>
                  <p className="text-lg font-bold text-success">{(totalSales / 1000000).toFixed(1)}M</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">الشهر السابق</p>
                  <p className="text-lg font-bold">{((totalSales * 0.88) / 1000000).toFixed(1)}M</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-primary/10">
                  <p className="text-xs text-muted-foreground mb-1">الفرق</p>
                  <p className="text-lg font-bold text-primary">+{((totalSales * 0.12) / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Employees Report */}
        {activeReport === "employees" && (
          <div className="space-y-4 animate-fade-in">
            {/* Employee Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="pharma-card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-info/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-info" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">إجمالي الموظفين</p>
                    <p className="text-2xl font-bold">{employees.length}</p>
                  </div>
                </div>
              </div>
              <div className="pharma-card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">إجمالي الرواتب</p>
                    <p className="text-xl font-bold">{(totalSalaries / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Salary Breakdown */}
            <div className="pharma-card p-4">
              <h3 className="font-semibold mb-4">تفاصيل الرواتب</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="text-sm">الرواتب الأساسية</span>
                  <span className="font-bold">
                    {(employees.reduce((sum, e) => sum + e.salary, 0) / 1000).toFixed(0)}K ج.م
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-success/10">
                  <span className="text-sm text-success">البدلات</span>
                  <span className="font-bold text-success">
                    +{(employees.reduce((sum, e) => sum + e.allowances, 0) / 1000).toFixed(0)}K ج.م
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-destructive/10">
                  <span className="text-sm text-destructive">الخصومات</span>
                  <span className="font-bold text-destructive">
                    -{(employees.reduce((sum, e) => sum + e.deductions, 0) / 1000).toFixed(0)}K ج.م
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border-2 border-primary/20">
                  <span className="font-medium">صافي الرواتب</span>
                  <span className="font-bold text-primary text-lg">
                    {(totalSalaries / 1000).toFixed(0)}K ج.م
                  </span>
                </div>
              </div>
            </div>

            {/* Employees by Status */}
            <div className="pharma-card p-4">
              <h3 className="font-semibold mb-4">حالة الموظفين</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-4 rounded-xl bg-success/10">
                  <p className="text-3xl font-bold text-success">
                    {employees.filter(e => e.status === 'active').length}
                  </p>
                  <p className="text-sm text-muted-foreground">نشط</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted">
                  <p className="text-3xl font-bold text-muted-foreground">
                    {employees.filter(e => e.status === 'inactive').length}
                  </p>
                  <p className="text-sm text-muted-foreground">غير نشط</p>
                </div>
              </div>
            </div>

            {/* Top Employees by Salary */}
            <div className="pharma-card p-4">
              <h3 className="font-semibold mb-4">أعلى الرواتب</h3>
              <div className="space-y-2">
                {employees
                  .sort((a, b) => (b.salary + b.allowances - b.deductions) - (a.salary + a.allowances - a.deductions))
                  .slice(0, 5)
                  .map((emp, index) => (
                    <div key={emp.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-sm">{emp.name}</p>
                          <p className="text-xs text-muted-foreground">{emp.position}</p>
                        </div>
                      </div>
                      <span className="font-bold">
                        {((emp.salary + emp.allowances - emp.deductions) / 1000).toFixed(1)}K
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Export Button */}
        <Button 
          onClick={handleExportPDF}
          disabled={isExporting}
          className="w-full h-12 rounded-xl pharma-btn-primary gap-2"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري التصدير...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              تصدير التقرير PDF
            </>
          )}
        </Button>
      </main>

      <BottomNavigation />
    </div>
  );
}
