// هوك للتعامل مع قاعدة البيانات

import { useState, useCallback } from 'react';
import { db } from '@/lib/database';
import { Branch, Supplier, License, Employee, BackupData } from '@/lib/database/types';
import { toast } from '@/hooks/use-toast';

export function useDatabase() {
  const [isLoading, setIsLoading] = useState(false);

  // ==================== الفروع ====================
  const getBranches = useCallback(() => {
    return db.getBranches();
  }, []);

  const addBranch = useCallback((branch: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBranch = db.addBranch(branch);
    toast({ title: 'تم إضافة الفرع بنجاح', variant: 'default' });
    return newBranch;
  }, []);

  const updateBranch = useCallback((id: string, updates: Partial<Branch>) => {
    const updated = db.updateBranch(id, updates);
    if (updated) {
      toast({ title: 'تم تحديث الفرع بنجاح', variant: 'default' });
    }
    return updated;
  }, []);

  const deleteBranch = useCallback((id: string) => {
    db.deleteBranch(id);
    toast({ title: 'تم حذف الفرع بنجاح', variant: 'default' });
  }, []);

  // ==================== الموردين ====================
  const getSuppliers = useCallback(() => {
    return db.getSuppliers();
  }, []);

  const addSupplier = useCallback((supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSupplier = db.addSupplier(supplier);
    toast({ title: 'تم إضافة المورد بنجاح', variant: 'default' });
    return newSupplier;
  }, []);

  const updateSupplier = useCallback((id: string, updates: Partial<Supplier>) => {
    const updated = db.updateSupplier(id, updates);
    if (updated) {
      toast({ title: 'تم تحديث المورد بنجاح', variant: 'default' });
    }
    return updated;
  }, []);

  const deleteSupplier = useCallback((id: string) => {
    db.deleteSupplier(id);
    toast({ title: 'تم حذف المورد بنجاح', variant: 'default' });
  }, []);

  // ==================== التراخيص ====================
  const getLicenses = useCallback(() => {
    return db.getLicenses();
  }, []);

  const addLicense = useCallback((license: Omit<License, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLicense = db.addLicense(license);
    toast({ title: 'تم إضافة الترخيص بنجاح', variant: 'default' });
    return newLicense;
  }, []);

  // ==================== الموظفين ====================
  const getEmployees = useCallback(() => {
    return db.getEmployees();
  }, []);

  const addEmployee = useCallback((employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEmployee = db.addEmployee(employee);
    toast({ title: 'تم إضافة الموظف بنجاح', variant: 'default' });
    return newEmployee;
  }, []);

  // ==================== الإحصائيات ====================
  const getStats = useCallback(() => {
    return db.getStats();
  }, []);

  // ==================== المصادقة ====================
  const authenticateUser = useCallback((username: string, password: string) => {
    return db.authenticateUser(username, password);
  }, []);

  // ==================== النسخ الاحتياطي ====================
  const createBackup = useCallback(() => {
    setIsLoading(true);
    try {
      db.downloadBackup();
      toast({ title: 'تم إنشاء النسخة الاحتياطية بنجاح', variant: 'default' });
    } catch (error) {
      toast({ title: 'خطأ في إنشاء النسخة الاحتياطية', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const restoreBackup = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const backup = JSON.parse(e.target?.result as string) as BackupData;
          const success = db.restoreBackup(backup);
          if (success) {
            toast({ title: 'تم استعادة النسخة الاحتياطية بنجاح', variant: 'default' });
            resolve(true);
          } else {
            toast({ title: 'ملف النسخ الاحتياطي غير صالح', variant: 'destructive' });
            resolve(false);
          }
        } catch (error) {
          toast({ title: 'خطأ في قراءة ملف النسخ الاحتياطي', variant: 'destructive' });
          resolve(false);
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsText(file);
    });
  }, []);

  const resetDatabase = useCallback(() => {
    db.resetDatabase();
    toast({ title: 'تم إعادة تعيين قاعدة البيانات', variant: 'default' });
  }, []);

  return {
    isLoading,
    // الفروع
    getBranches,
    addBranch,
    updateBranch,
    deleteBranch,
    // الموردين
    getSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    // التراخيص
    getLicenses,
    addLicense,
    // الموظفين
    getEmployees,
    addEmployee,
    // الإحصائيات
    getStats,
    // المصادقة
    authenticateUser,
    // النسخ الاحتياطي
    createBackup,
    restoreBackup,
    resetDatabase,
  };
}
