import { AlertTriangle, Clock, Package, FileX } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "inventory" | "license" | "expiry" | "urgent";
  title: string;
  description: string;
  time: string;
}

const alerts: Alert[] = [
  {
    id: "1",
    type: "inventory",
    title: "نقص في المخزون",
    description: "5 أصناف تحتاج إعادة طلب في فرع المعادي",
    time: "منذ ساعة"
  },
  {
    id: "2", 
    type: "license",
    title: "رخصة تنتهي قريبًا",
    description: "رخصة فرع الدقي تنتهي خلال 7 أيام",
    time: "منذ 3 ساعات"
  },
  {
    id: "3",
    type: "expiry",
    title: "أدوية قاربت الانتهاء",
    description: "12 صنف ينتهي خلال 30 يوم",
    time: "اليوم"
  },
];

const alertStyles = {
  inventory: { icon: Package, color: "bg-warning/10 text-warning border-warning/20" },
  license: { icon: FileX, color: "bg-destructive/10 text-destructive border-destructive/20" },
  expiry: { icon: Clock, color: "bg-info/10 text-info border-info/20" },
  urgent: { icon: AlertTriangle, color: "bg-destructive/10 text-destructive border-destructive/20" },
};

export function AlertsList() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">التنبيهات الهامة</h3>
        <button className="text-sm text-primary hover:underline">عرض الكل</button>
      </div>
      
      <div className="space-y-2">
        {alerts.map((alert, index) => {
          const style = alertStyles[alert.type];
          return (
            <div
              key={alert.id}
              className={cn(
                "p-3 rounded-xl border flex items-start gap-3 animate-slide-up",
                style.color
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-2 rounded-lg bg-current/10">
                <style.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{alert.title}</p>
                <p className="text-xs opacity-80 mt-0.5">{alert.description}</p>
              </div>
              <span className="text-xs opacity-60 whitespace-nowrap">{alert.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
