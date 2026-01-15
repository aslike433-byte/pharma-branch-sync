import { useEffect } from 'react';
import { useLicenseAlerts } from '@/hooks/useLicenseAlerts';

export function LicenseAlertsProvider({ children }: { children: React.ReactNode }) {
  const { checkLicenseAlerts } = useLicenseAlerts();

  useEffect(() => {
    // Initial check is handled by the hook
    // Set up periodic check every hour
    const interval = setInterval(() => {
      checkLicenseAlerts();
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, [checkLicenseAlerts]);

  return <>{children}</>;
}
