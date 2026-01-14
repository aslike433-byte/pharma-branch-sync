import { AlertTriangle, Clock, Package, FileX, CreditCard, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { db } from "@/lib/database/localStorage";
import { Order, License, Product } from "@/lib/database/types";
import { format, differenceInDays, parseISO, isPast } from "date-fns";
import { ar } from "date-fns/locale";

interface Alert {
  id: string;
  type: "inventory" | "license" | "expiry" | "urgent" | "payment" | "delivery";
  title: string;
  description: string;
  time: string;
  count?: number;
}

const alertStyles = {
  inventory: { icon: Package, color: "bg-warning/10 text-warning border-warning/20" },
  license: { icon: FileX, color: "bg-destructive/10 text-destructive border-destructive/20" },
  expiry: { icon: Clock, color: "bg-info/10 text-info border-info/20" },
  urgent: { icon: AlertTriangle, color: "bg-destructive/10 text-destructive border-destructive/20" },
  payment: { icon: CreditCard, color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  delivery: { icon: Truck, color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
};

export function AlertsList() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const generateAlerts = () => {
      const newAlerts: Alert[] = [];
      const today = new Date();

      // Check orders for late deliveries and unpaid
      const orders = db.getOrders();
      const lateOrders = orders.filter((order: Order) => {
        if (order.status === 'delivered' || order.status === 'cancelled') return false;
        if (!order.expectedDeliveryDate) return false;
        return isPast(parseISO(order.expectedDeliveryDate));
      });

      const unpaidOrders = orders.filter((order: Order) => 
        order.paymentStatus === 'unpaid' && order.status !== 'cancelled'
      );

      const partialPaidOrders = orders.filter((order: Order) => 
        order.paymentStatus === 'partial' && order.status !== 'cancelled'
      );

      // Check licenses for expired and expiring
      const licenses = db.getLicenses();
      const expiredLicenses = licenses.filter((license: License) => 
        license.status === 'expired' || isPast(parseISO(license.expiryDate))
      );

      const expiringLicenses = licenses.filter((license: License) => {
        const daysUntil = differenceInDays(parseISO(license.expiryDate), today);
        return daysUntil > 0 && daysUntil <= 30;
      });

      // Check products for low stock and out of stock
      const products = db.getProducts();
      const outOfStockProducts = products.filter((p: Product) => p.quantity === 0);
      const lowStockProducts = products.filter((p: Product) => 
        p.quantity > 0 && p.quantity <= p.minQuantity
      );

      // Check products expiring soon
      const expiringProducts = products.filter((p: Product) => {
        if (!p.expiryDate) return false;
        const daysUntil = differenceInDays(parseISO(p.expiryDate), today);
        return daysUntil > 0 && daysUntil <= 30;
      });

      // Add alerts based on data
      if (lateOrders.length > 0) {
        newAlerts.push({
          id: 'late-orders',
          type: 'urgent',
          title: 'طلبات متأخرة',
          description: `${lateOrders.length} طلب تجاوز موعد التسليم المتوقع`,
          time: 'الآن',
          count: lateOrders.length
        });
      }

      if (unpaidOrders.length > 0) {
        const totalUnpaid = unpaidOrders.reduce((sum: number, o: Order) => sum + o.totalAmount, 0);
        newAlerts.push({
          id: 'unpaid-orders',
          type: 'payment',
          title: 'طلبات غير مدفوعة',
          description: `${unpaidOrders.length} طلب بقيمة ${totalUnpaid.toLocaleString()} ج.م`,
          time: 'مستحقة',
          count: unpaidOrders.length
        });
      }

      if (partialPaidOrders.length > 0) {
        newAlerts.push({
          id: 'partial-paid-orders',
          type: 'payment',
          title: 'مدفوعات جزئية',
          description: `${partialPaidOrders.length} طلب يحتاج استكمال الدفع`,
          time: 'متابعة',
          count: partialPaidOrders.length
        });
      }

      if (expiredLicenses.length > 0) {
        newAlerts.push({
          id: 'expired-licenses',
          type: 'urgent',
          title: 'تراخيص منتهية',
          description: `${expiredLicenses.length} رخصة منتهية الصلاحية - إجراء فوري مطلوب`,
          time: 'عاجل',
          count: expiredLicenses.length
        });
      }

      if (expiringLicenses.length > 0) {
        newAlerts.push({
          id: 'expiring-licenses',
          type: 'license',
          title: 'تراخيص تنتهي قريباً',
          description: `${expiringLicenses.length} رخصة تنتهي خلال 30 يوم`,
          time: 'تنبيه',
          count: expiringLicenses.length
        });
      }

      if (outOfStockProducts.length > 0) {
        newAlerts.push({
          id: 'out-of-stock',
          type: 'urgent',
          title: 'نفاد المخزون',
          description: `${outOfStockProducts.length} صنف نفد من المخزون`,
          time: 'عاجل',
          count: outOfStockProducts.length
        });
      }

      if (lowStockProducts.length > 0) {
        newAlerts.push({
          id: 'low-stock',
          type: 'inventory',
          title: 'مخزون منخفض',
          description: `${lowStockProducts.length} صنف يحتاج إعادة طلب`,
          time: 'تنبيه',
          count: lowStockProducts.length
        });
      }

      if (expiringProducts.length > 0) {
        newAlerts.push({
          id: 'expiring-products',
          type: 'expiry',
          title: 'أدوية قاربت الانتهاء',
          description: `${expiringProducts.length} صنف ينتهي خلال 30 يوم`,
          time: 'مراجعة',
          count: expiringProducts.length
        });
      }

      // Sort by priority (urgent first)
      const priorityOrder = ['urgent', 'payment', 'license', 'inventory', 'expiry', 'delivery'];
      newAlerts.sort((a, b) => priorityOrder.indexOf(a.type) - priorityOrder.indexOf(b.type));

      setAlerts(newAlerts);
    };

    generateAlerts();
  }, []);

  if (alerts.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">التنبيهات الهامة</h3>
        </div>
        <div className="text-center py-6 text-muted-foreground">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">لا توجد تنبيهات حالياً</p>
          <p className="text-xs opacity-70">كل شيء يعمل بشكل جيد</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">التنبيهات الهامة</h3>
        <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">
          {alerts.length} تنبيه
        </span>
      </div>
      
      <div className="space-y-2">
        {alerts.map((alert, index) => {
          const style = alertStyles[alert.type];
          return (
            <div
              key={alert.id}
              className={cn(
                "p-3 rounded-xl border flex items-start gap-3 animate-slide-up cursor-pointer hover:opacity-90 transition-opacity",
                style.color
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-2 rounded-lg bg-current/10">
                <style.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{alert.title}</p>
                  {alert.count && alert.count > 1 && (
                    <span className="text-xs bg-current/10 px-1.5 py-0.5 rounded">
                      {alert.count}
                    </span>
                  )}
                </div>
                <p className="text-xs opacity-80 mt-0.5">{alert.description}</p>
              </div>
              <span className="text-xs opacity-60 whitespace-nowrap font-medium">
                {alert.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
