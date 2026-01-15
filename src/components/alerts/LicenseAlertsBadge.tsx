import { Bell } from 'lucide-react';
import { useLicenseAlerts } from '@/hooks/useLicenseAlerts';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function LicenseAlertsBadge() {
  const { alerts, getAlertStats, forceShowAlerts } = useLicenseAlerts();
  const stats = getAlertStats();

  if (stats.total === 0) {
    return (
      <Button variant="ghost" size="icon" className="relative" onClick={forceShowAlerts}>
        <Bell className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className={cn(
            "absolute -top-1 -right-1 min-w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center",
            stats.hasCritical 
              ? "bg-destructive text-destructive-foreground animate-pulse" 
              : "bg-warning text-warning-foreground"
          )}>
            {stats.total}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b bg-muted/50">
          <h4 className="font-semibold text-sm">تنبيهات التراخيص</h4>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.expired > 0 && <span className="text-destructive">{stats.expired} منتهي</span>}
            {stats.expired > 0 && stats.expiringWeek > 0 && ' • '}
            {stats.expiringWeek > 0 && <span className="text-warning">{stats.expiringWeek} ينتهي خلال أسبوع</span>}
            {(stats.expired > 0 || stats.expiringWeek > 0) && stats.expiringSoon > 0 && ' • '}
            {stats.expiringSoon > 0 && <span className="text-primary">{stats.expiringSoon} ينتهي قريباً</span>}
          </p>
        </div>
        <ScrollArea className="max-h-64">
          <div className="p-2 space-y-2">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={cn(
                  "p-3 rounded-lg text-sm",
                  alert.type === 'expired' && "bg-destructive/10 border border-destructive/20",
                  alert.type === 'expiring_week' && "bg-warning/10 border border-warning/20",
                  alert.type === 'expiring_soon' && "bg-primary/10 border border-primary/20",
                )}
              >
                <div className="flex items-start gap-2">
                  <span className={cn(
                    "mt-0.5",
                    alert.type === 'expired' && "text-destructive",
                    alert.type === 'expiring_week' && "text-warning",
                    alert.type === 'expiring_soon' && "text-primary",
                  )}>
                    {alert.type === 'expired' ? '⚠️' : '⏰'}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{alert.license.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.daysLeft < 0 
                        ? `منتهي منذ ${Math.abs(alert.daysLeft)} يوم`
                        : alert.daysLeft === 0
                          ? 'ينتهي اليوم!'
                          : `${alert.daysLeft} يوم متبقي`
                      }
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-2 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => window.location.href = '/licenses'}
          >
            عرض جميع التراخيص
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
