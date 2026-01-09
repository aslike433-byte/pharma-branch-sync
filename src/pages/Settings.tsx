import { useNavigate } from "react-router-dom";
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
  ChevronLeft
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
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
            <p className="text-xs text-muted-foreground">Branches Managed</p>
          </div>
          <div className="pharma-card p-4 text-center animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex justify-center mb-2">
              <RefreshCw className="w-6 h-6 text-success" />
            </div>
            <p className="text-2xl font-bold">Synced</p>
            <p className="text-xs text-muted-foreground">Data Status</p>
          </div>
        </div>

        {/* Security Section */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-1">
            SECURITY
          </h3>
          <div className="pharma-card divide-y divide-border">
            <SettingsItem
              icon={Lock}
              title="Change Password"
              subtitle="Last changed 30 days ago"
              hasArrow
            />
            <SettingsItem
              icon={Scan}
              title="Face ID Login"
              hasSwitch
              defaultChecked
            />
          </div>
        </section>

        {/* Preferences Section */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-1">
            PREFERENCES
          </h3>
          <div className="pharma-card divide-y divide-border">
            <SettingsItem
              icon={Globe}
              title="Language"
              value="English"
              hasArrow
            />
            <SettingsItem
              icon={History}
              title="Login History"
              hasArrow
            />
            <SettingsItem
              icon={Bell}
              title="Sync Notifications"
              subtitle="Alert when sync completes"
              hasSwitch
            />
          </div>
        </section>

        {/* Logout */}
        <button 
          onClick={() => navigate("/")}
          className="w-full pharma-card p-4 flex items-center justify-center gap-2 text-destructive hover:bg-destructive/5 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>

        {/* Footer */}
        <div className="text-center pt-4 pb-8">
          <p className="text-sm text-muted-foreground">PharmaLife App v1.0.4</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <button className="text-sm text-primary">Privacy Policy</button>
            <button className="text-sm text-primary">Terms of Service</button>
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
}

function SettingsItem({ 
  icon: Icon, 
  title, 
  subtitle, 
  value, 
  hasArrow, 
  hasSwitch,
  defaultChecked 
}: SettingsItemProps) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="p-2 rounded-xl bg-muted">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {value && (
        <span className="text-sm text-muted-foreground">{value}</span>
      )}
      {hasArrow && (
        <ChevronLeft className="w-5 h-5 text-muted-foreground" />
      )}
      {hasSwitch && (
        <Switch defaultChecked={defaultChecked} />
      )}
    </div>
  );
}
