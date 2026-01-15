import { useEffect, useCallback, useState } from 'react';
import { useDatabase } from './useDatabase';
import { License } from '@/lib/database/types';
import { toast } from '@/hooks/use-toast';

interface LicenseAlert {
  id: string;
  license: License;
  type: 'expired' | 'expiring_soon' | 'expiring_week';
  daysLeft: number;
  message: string;
}

const ALERT_SHOWN_KEY = 'pharmalife_license_alerts_shown';
const ALERT_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

export function useLicenseAlerts() {
  const { getLicenses, getBranches } = useDatabase();
  const [alerts, setAlerts] = useState<LicenseAlert[]>([]);
  const [hasChecked, setHasChecked] = useState(false);

  const getDaysUntilExpiry = (expiryDate: string): number => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const checkLicenseAlerts = useCallback(() => {
    const licenses = getLicenses();
    const branches = getBranches();
    const branchMap = new Map(branches.map(b => [b.id, b.name]));
    
    const newAlerts: LicenseAlert[] = [];

    licenses.forEach(license => {
      const daysLeft = getDaysUntilExpiry(license.expiryDate);
      const branchName = branchMap.get(license.branchId) || 'غير محدد';

      if (daysLeft < 0) {
        // Expired
        newAlerts.push({
          id: `expired-${license.id}`,
          license,
          type: 'expired',
          daysLeft,
          message: `ترخيص "${license.name}" في ${branchName} منتهي منذ ${Math.abs(daysLeft)} يوم`,
        });
      } else if (daysLeft <= 7) {
        // Expiring within a week
        newAlerts.push({
          id: `expiring-week-${license.id}`,
          license,
          type: 'expiring_week',
          daysLeft,
          message: daysLeft === 0 
            ? `ترخيص "${license.name}" في ${branchName} ينتهي اليوم!`
            : `ترخيص "${license.name}" في ${branchName} ينتهي خلال ${daysLeft} أيام`,
        });
      } else if (daysLeft <= 30) {
        // Expiring within a month
        newAlerts.push({
          id: `expiring-soon-${license.id}`,
          license,
          type: 'expiring_soon',
          daysLeft,
          message: `ترخيص "${license.name}" في ${branchName} ينتهي خلال ${daysLeft} يوم`,
        });
      }
    });

    // Sort by urgency (expired first, then by days left)
    newAlerts.sort((a, b) => {
      if (a.type === 'expired' && b.type !== 'expired') return -1;
      if (a.type !== 'expired' && b.type === 'expired') return 1;
      return a.daysLeft - b.daysLeft;
    });

    setAlerts(newAlerts);
    return newAlerts;
  }, [getLicenses, getBranches]);

  const shouldShowAlerts = useCallback((): boolean => {
    const lastShown = localStorage.getItem(ALERT_SHOWN_KEY);
    if (!lastShown) return true;
    
    const lastShownTime = parseInt(lastShown, 10);
    return Date.now() - lastShownTime > ALERT_INTERVAL;
  }, []);

  const markAlertsAsShown = useCallback(() => {
    localStorage.setItem(ALERT_SHOWN_KEY, Date.now().toString());
  }, []);

  const showAlertToasts = useCallback((alertsToShow: LicenseAlert[]) => {
    // Show max 3 toasts to avoid overwhelming the user
    const criticalAlerts = alertsToShow.filter(a => a.type === 'expired' || a.type === 'expiring_week');
    const alertsToDisplay = criticalAlerts.slice(0, 3);

    alertsToDisplay.forEach((alert, index) => {
      setTimeout(() => {
        toast({
          title: alert.type === 'expired' ? '⚠️ ترخيص منتهي' : '⏰ ترخيص ينتهي قريباً',
          description: alert.message,
          variant: alert.type === 'expired' ? 'destructive' : 'default',
          duration: 8000,
        });
      }, index * 1500); // Stagger toasts
    });

    // Show summary if there are more alerts
    if (criticalAlerts.length > 3) {
      setTimeout(() => {
        toast({
          title: '📋 تنبيهات إضافية',
          description: `يوجد ${criticalAlerts.length - 3} تنبيهات أخرى للتراخيص`,
          duration: 5000,
        });
      }, 3 * 1500 + 500);
    }
  }, []);

  const checkAndShowAlerts = useCallback(() => {
    if (hasChecked) return;
    
    const newAlerts = checkLicenseAlerts();
    
    if (shouldShowAlerts() && newAlerts.length > 0) {
      showAlertToasts(newAlerts);
      markAlertsAsShown();
    }
    
    setHasChecked(true);
  }, [hasChecked, checkLicenseAlerts, shouldShowAlerts, showAlertToasts, markAlertsAsShown]);

  // Auto-check on mount
  useEffect(() => {
    // Small delay to let the app load first
    const timer = setTimeout(() => {
      checkAndShowAlerts();
    }, 2000);

    return () => clearTimeout(timer);
  }, [checkAndShowAlerts]);

  const getAlertStats = useCallback(() => {
    const expired = alerts.filter(a => a.type === 'expired').length;
    const expiringWeek = alerts.filter(a => a.type === 'expiring_week').length;
    const expiringSoon = alerts.filter(a => a.type === 'expiring_soon').length;
    
    return {
      total: alerts.length,
      expired,
      expiringWeek,
      expiringSoon,
      hasCritical: expired > 0 || expiringWeek > 0,
    };
  }, [alerts]);

  const forceShowAlerts = useCallback(() => {
    const newAlerts = checkLicenseAlerts();
    if (newAlerts.length > 0) {
      showAlertToasts(newAlerts);
    } else {
      toast({
        title: '✅ لا توجد تنبيهات',
        description: 'جميع التراخيص سارية',
      });
    }
  }, [checkLicenseAlerts, showAlertToasts]);

  return {
    alerts,
    checkLicenseAlerts,
    getAlertStats,
    forceShowAlerts,
  };
}
