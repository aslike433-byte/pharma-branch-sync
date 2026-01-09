import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { 
  ArrowRight, 
  Camera, 
  Lock, 
  Scan, 
  Globe, 
  History, 
  Bell, 
  LogOut,
  Building2,
  RefreshCw,
  ChevronLeft,
  Download,
  Upload,
  Database,
  RotateCcw
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useDatabase } from "@/hooks/useDatabase";
import { toast } from "@/hooks/use-toast";

export default function Settings() {
  const navigate = useNavigate();
  const { createBackup, restoreBackup, resetDatabase, isLoading } = useDatabase();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await restoreBackup(file);
      // إعادة تحميل الصفحة لتحديث البيانات
      window.location.reload();
    }
    // إعادة تعيين الـ input
    e.target.value = '';
  };

  const handleReset = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين قاعدة البيانات؟ سيتم حذف جميع البيانات!')) {
      resetDatabase();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">الملف الشخصي</h1>
          <button className="text-sm font-medium text-primary">تعديل</button>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Profile Card */}
        <div className="flex flex-col items-center animate-fade-in">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              <span className="text-3xl font-bold text-primary">أ</span>
            </div>
            <button className="absolute bottom-0 right-0 p-2 rounded-full bg-info text-info-foreground shadow-lg">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          <h2 className="text-xl font-bold">أحمد النادي</h2>
          <p className="text-primary font-medium">المشرف العام</p>
          <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-muted">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">SUP-001</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="pharma-card p-4 text-center animate-slide-up">
            <div className="flex justify-center mb-2">
              <Building2 className="w-6 h-6 text-info" />
            </div>
            <p className="text-2xl font-bold">15</p>
            <p className="text-xs text-muted-foreground">الفروع المُدارة</p>
          </div>
          <div className="pharma-card p-4 text-center animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex justify-center mb-2">
              <RefreshCw className="w-6 h-6 text-success" />
            </div>
            <p className="text-2xl font-bold">متزامن</p>
            <p className="text-xs text-muted-foreground">حالة البيانات</p>
          </div>
        </div>

        {/* Backup Section */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-1">
            النسخ الاحتياطي
          </h3>
          <div className="pharma-card divide-y divide-border">
            <button 
              onClick={createBackup}
              disabled={isLoading}
              className="w-full"
            >
              <SettingsItem
                icon={Download}
                title="إنشاء نسخة احتياطية"
                subtitle="تحميل ملف JSON للبيانات"
                hasArrow
              />
            </button>
            <button 
              onClick={handleRestoreClick}
              disabled={isLoading}
              className="w-full"
            >
              <SettingsItem
                icon={Upload}
                title="استعادة نسخة احتياطية"
                subtitle="استيراد ملف JSON"
                hasArrow
              />
            </button>
            <button 
              onClick={handleReset}
              disabled={isLoading}
              className="w-full"
            >
              <SettingsItem
                icon={RotateCcw}
                title="إعادة تعيين البيانات"
                subtitle="استعادة البيانات الافتراضية"
                hasArrow
                destructive
              />
            </button>
          </div>
        </section>

        {/* Security Section */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-1">
            الأمان
          </h3>
          <div className="pharma-card divide-y divide-border">
            <SettingsItem
              icon={Lock}
              title="تغيير كلمة المرور"
              subtitle="آخر تغيير منذ 30 يوم"
              hasArrow
            />
            <SettingsItem
              icon={Scan}
              title="تسجيل الدخول بالبصمة"
              hasSwitch
              defaultChecked
            />
          </div>
        </section>

        {/* Preferences Section */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-1">
            التفضيلات
          </h3>
          <div className="pharma-card divide-y divide-border">
            <SettingsItem
              icon={Globe}
              title="اللغة"
              value="العربية"
              hasArrow
            />
            <SettingsItem
              icon={History}
              title="سجل الدخول"
              hasArrow
            />
            <SettingsItem
              icon={Bell}
              title="إشعارات المزامنة"
              subtitle="تنبيه عند اكتمال المزامنة"
              hasSwitch
            />
          </div>
        </section>

        {/* Database Info */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-1">
            قاعدة البيانات
          </h3>
          <div className="pharma-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-success/10">
                <Database className="w-6 h-6 text-success" />
              </div>
              <div className="flex-1">
                <p className="font-medium">التخزين المحلي</p>
                <p className="text-xs text-muted-foreground">localStorage - متصل</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                نشط
              </div>
            </div>
          </div>
        </section>

        {/* Logout */}
        <button 
          onClick={() => navigate("/")}
          className="w-full pharma-card p-4 flex items-center justify-center gap-2 text-destructive hover:bg-destructive/5 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">تسجيل الخروج</span>
        </button>

        {/* Footer */}
        <div className="text-center pt-4 pb-8">
          <p className="text-sm text-muted-foreground">PharmaLife App v1.0.4</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <button className="text-sm text-primary">سياسة الخصوصية</button>
            <button className="text-sm text-primary">شروط الاستخدام</button>
          </div>
        </div>
      </main>
    </div>
  );
}

interface SettingsItemProps {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  value?: string;
  hasArrow?: boolean;
  hasSwitch?: boolean;
  defaultChecked?: boolean;
  destructive?: boolean;
}

function SettingsItem({ 
  icon: Icon, 
  title, 
  subtitle, 
  value, 
  hasArrow, 
  hasSwitch,
  defaultChecked,
  destructive
}: SettingsItemProps) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className={cn("p-2 rounded-xl", destructive ? "bg-destructive/10" : "bg-muted")}>
        <Icon className={cn("w-5 h-5", destructive ? "text-destructive" : "text-muted-foreground")} />
      </div>
      <div className="flex-1 text-right">
        <p className={cn("font-medium", destructive && "text-destructive")}>{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {value && (
        <span className="text-sm text-muted-foreground">{value}</span>
      )}
      {hasArrow && (
        <ChevronLeft className={cn("w-5 h-5", destructive ? "text-destructive" : "text-muted-foreground")} />
      )}
      {hasSwitch && (
        <Switch defaultChecked={defaultChecked} />
      )}
    </div>
  );
}
