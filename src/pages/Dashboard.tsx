import { Building2, Package, Users, TrendingUp, WifiOff } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AlertsList } from "@/components/dashboard/AlertsList";
import { BranchesOverview } from "@/components/dashboard/BranchesOverview";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="لوحة التحكم" />

      <main className="px-4 py-4 space-y-6">
        {/* Offline Banner */}
        <div className="offline-banner animate-fade-in">
          <WifiOff className="w-4 h-4" />
          <span>وضع غير متصل - البيانات محفوظة محليًا</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatsCard
            title="إجمالي الفروع"
            value="15"
            subtitle="فرع نشط"
            icon={Building2}
            variant="default"
          />
          <StatsCard
            title="الأصناف"
            value="12,405"
            subtitle="صنف مسجل"
            icon={Package}
            variant="info"
          />
          <StatsCard
            title="الموظفين"
            value="148"
            subtitle="موظف نشط"
            icon={Users}
            variant="success"
          />
          <StatsCard
            title="المبيعات"
            value="1.2M"
            subtitle="هذا الشهر"
            icon={TrendingUp}
            trend={{ value: 12, isPositive: true }}
            variant="default"
          />
        </div>

        {/* Quick Actions */}
        <section>
          <h3 className="font-semibold mb-3">الوصول السريع</h3>
          <QuickActions />
        </section>

        {/* Alerts */}
        <section className="pharma-card p-4">
          <AlertsList />
        </section>

        {/* Branches Overview */}
        <section>
          <BranchesOverview />
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}
