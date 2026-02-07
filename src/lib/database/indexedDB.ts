// قاعدة بيانات IndexedDB للتخزين المحلي المتقدم

import { DatabaseSchema, BackupData } from './types';

const DB_NAME = 'pharmalife_db';
const DB_VERSION = 1;
const STORE_NAME = 'app_data';
const DATA_KEY = 'main';
const BACKUP_VERSION = '1.0.0';

// البيانات الافتراضية
const defaultData: DatabaseSchema = {
  branches: [
    { id: '1', name: 'فرع المعادي', address: 'شارع 9 - المعادي', phone: '01012345678', manager: 'أحمد محمد', status: 'active', monthlySales: 125000, employeesCount: 8, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', name: 'فرع مدينة نصر', address: 'شارع مكرم عبيد', phone: '01112345678', manager: 'محمد علي', status: 'active', monthlySales: 98000, employeesCount: 6, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', name: 'فرع الدقي', address: 'شارع التحرير', phone: '01212345678', manager: 'سارة أحمد', status: 'active', monthlySales: 115000, employeesCount: 7, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '4', name: 'فرع الهرم', address: 'شارع الهرم الرئيسي', phone: '01512345678', manager: 'خالد إبراهيم', status: 'active', monthlySales: 87000, employeesCount: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '5', name: 'فرع المهندسين', address: 'شارع لبنان', phone: '01012345679', manager: 'فاطمة حسن', status: 'active', monthlySales: 142000, employeesCount: 9, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  suppliers: [
    { id: '1', name: 'شركة فارما للأدوية', phone: '02-12345678', email: 'pharma@example.com', address: 'المنطقة الصناعية - 6 أكتوبر', rating: 5, status: 'active', totalOrders: 156, lastOrderDate: '2024-01-05', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', name: 'مستودع الشفاء', phone: '02-23456789', email: 'shifa@example.com', address: 'العاشر من رمضان', rating: 4, status: 'active', totalOrders: 89, lastOrderDate: '2024-01-03', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', name: 'توزيع النيل للأدوية', phone: '02-34567890', email: 'nile@example.com', address: 'مدينة بدر', rating: 4, status: 'active', totalOrders: 67, lastOrderDate: '2024-01-02', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  licenses: [
    { id: '1', branchId: '1', type: 'pharmacy', name: 'رخصة مزاولة المهنة', licenseNumber: 'PH-2024-001', issueDate: '2024-01-01', expiryDate: '2025-01-01', status: 'valid', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', branchId: '1', type: 'health', name: 'شهادة صحية', licenseNumber: 'HL-2024-001', issueDate: '2024-01-01', expiryDate: '2024-02-15', status: 'expiring', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', branchId: '2', type: 'pharmacy', name: 'رخصة مزاولة المهنة', licenseNumber: 'PH-2024-002', issueDate: '2023-06-01', expiryDate: '2024-01-10', status: 'expired', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  employees: [
    { id: '1', branchId: '1', name: 'أحمد محمد علي', position: 'صيدلي', phone: '01012345680', email: 'ahmed@pharma.com', salary: 8000, allowances: 1500, deductions: 500, status: 'active', hireDate: '2022-03-15', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', branchId: '1', name: 'سارة حسن', position: 'مساعد صيدلي', phone: '01112345680', email: 'sara@pharma.com', salary: 5000, allowances: 800, deductions: 200, status: 'active', hireDate: '2023-01-10', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', branchId: '2', name: 'محمد خالد', position: 'صيدلي', phone: '01212345680', email: 'mohamed@pharma.com', salary: 7500, allowances: 1200, deductions: 400, status: 'active', hireDate: '2021-08-20', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  expenses: [],
  sales: [
    { id: '1', branchId: '1', month: '2024-01', totalSales: 125000, notes: 'مبيعات جيدة', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', branchId: '2', month: '2024-01', totalSales: 98000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  users: [
    { id: '1', username: 'admin', password: 'admin123', name: 'مدير النظام', role: 'admin', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  products: [
    { id: '1', branchId: '1', name: 'باراسيتامول 500 مجم', category: 'medicines', sku: 'MED-001', quantity: 150, minQuantity: 50, price: 25, costPrice: 18, supplierId: '1', expiryDate: '2025-06-01', status: 'available', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', branchId: '1', name: 'أموكسيسيللين 500 مجم', category: 'medicines', sku: 'MED-002', quantity: 30, minQuantity: 40, price: 45, costPrice: 32, supplierId: '1', expiryDate: '2025-03-15', status: 'low', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', branchId: '1', name: 'فيتامين سي 1000', category: 'supplements', sku: 'SUP-001', quantity: 0, minQuantity: 20, price: 85, costPrice: 60, supplierId: '2', expiryDate: '2025-12-01', status: 'out', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '4', branchId: '2', name: 'كريم مرطب للبشرة', category: 'cosmetics', sku: 'COS-001', quantity: 45, minQuantity: 15, price: 120, costPrice: 85, supplierId: '3', status: 'available', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '5', branchId: '1', name: 'جهاز قياس الضغط', category: 'equipment', sku: 'EQP-001', quantity: 8, minQuantity: 5, price: 450, costPrice: 320, supplierId: '2', status: 'available', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  orders: [
    { id: '1', supplierId: '1', branchId: '1', orderNumber: 'ORD-2024-001', items: [{ productId: '1', productName: 'باراسيتامول 500 مجم', quantity: 100, unitPrice: 18, total: 1800 }], totalAmount: 1800, status: 'delivered', paymentStatus: 'paid', orderDate: '2024-01-01', expectedDeliveryDate: '2024-01-05', deliveredDate: '2024-01-04', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', supplierId: '2', branchId: '1', orderNumber: 'ORD-2024-002', items: [{ productId: '3', productName: 'فيتامين سي 1000', quantity: 50, unitPrice: 60, total: 3000 }], totalAmount: 3000, status: 'shipped', paymentStatus: 'partial', orderDate: '2024-01-10', expectedDeliveryDate: '2024-01-15', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', supplierId: '1', branchId: '2', orderNumber: 'ORD-2024-003', items: [{ productId: '2', productName: 'أموكسيسيللين 500 مجم', quantity: 200, unitPrice: 32, total: 6400 }], totalAmount: 6400, status: 'pending', paymentStatus: 'unpaid', orderDate: '2024-01-12', expectedDeliveryDate: '2024-01-18', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  settings: {
    companyName: 'صيدليات النادي',
    currency: 'EGP',
    language: 'ar',
    theme: 'light',
  },
};

// فئة إدارة IndexedDB
class IndexedDBManager {
  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbPromise = this.openDB();
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get(key: string): Promise<DatabaseSchema | null> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error);
    });
  }

  async set(key: string, value: DatabaseSchema): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(value, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

const idbManager = new IndexedDBManager();

/**
 * قاعدة بيانات IndexedDB مع كاش في الذاكرة
 * تعمل بنفس واجهة LocalDatabase لضمان التوافق
 * البيانات تُقرأ وتُكتب بشكل متزامن من الكاش، وتُحفظ في الخلفية إلى IndexedDB
 */
class IndexedDatabase {
  private data: DatabaseSchema;
  private initialized: boolean = false;
  private initPromise: Promise<void>;

  constructor() {
    // نبدأ بالبيانات الافتراضية، ثم نحمّل من IndexedDB
    this.data = this.loadFromLocalStorageFallback();
    this.initPromise = this.initFromIndexedDB();
  }

  /** محاولة التحميل من localStorage كـ fallback للبيانات الموجودة */
  private loadFromLocalStorageFallback(): DatabaseSchema {
    try {
      const stored = localStorage.getItem('pharmalife_db');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return { ...defaultData };
  }

  private async initFromIndexedDB(): Promise<void> {
    try {
      const stored = await idbManager.get(DATA_KEY);
      if (stored) {
        this.data = stored;
      } else {
        // ترحيل من localStorage إلى IndexedDB
        await idbManager.set(DATA_KEY, this.data);
      }
      this.initialized = true;
    } catch (error) {
      console.error('خطأ في تهيئة IndexedDB:', error);
      // نستمر مع البيانات المحملة من localStorage أو الافتراضية
      this.initialized = true;
    }
  }

  /** انتظار التهيئة (للاستخدام الخارجي إذا لزم الأمر) */
  async waitForInit(): Promise<void> {
    return this.initPromise;
  }

  private persistToIndexedDB(): void {
    // حفظ غير متزامن في الخلفية
    idbManager.set(DATA_KEY, this.data).catch(error => {
      console.error('خطأ في حفظ البيانات إلى IndexedDB:', error);
      // Fallback: حفظ في localStorage
      try {
        localStorage.setItem('pharmalife_db', JSON.stringify(this.data));
      } catch {
        console.error('فشل الحفظ في localStorage أيضاً');
      }
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // ==================== الفروع ====================
  getBranches(): DatabaseSchema['branches'] {
    return [...this.data.branches];
  }

  getBranch(id: string) {
    return this.data.branches.find(b => b.id === id);
  }

  addBranch(branch: Omit<DatabaseSchema['branches'][0], 'id' | 'createdAt' | 'updatedAt'>) {
    const newBranch = {
      ...branch,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.branches.push(newBranch);
    this.persistToIndexedDB();
    return newBranch;
  }

  updateBranch(id: string, updates: Partial<DatabaseSchema['branches'][0]>) {
    const index = this.data.branches.findIndex(b => b.id === id);
    if (index !== -1) {
      this.data.branches[index] = { ...this.data.branches[index], ...updates, updatedAt: new Date().toISOString() };
      this.persistToIndexedDB();
      return this.data.branches[index];
    }
    return null;
  }

  deleteBranch(id: string) {
    this.data.branches = this.data.branches.filter(b => b.id !== id);
    this.persistToIndexedDB();
  }

  // ==================== الموردين ====================
  getSuppliers(): DatabaseSchema['suppliers'] {
    return [...this.data.suppliers];
  }

  getSupplier(id: string) {
    return this.data.suppliers.find(s => s.id === id);
  }

  addSupplier(supplier: Omit<DatabaseSchema['suppliers'][0], 'id' | 'createdAt' | 'updatedAt'>) {
    const newSupplier = {
      ...supplier,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.suppliers.push(newSupplier);
    this.persistToIndexedDB();
    return newSupplier;
  }

  updateSupplier(id: string, updates: Partial<DatabaseSchema['suppliers'][0]>) {
    const index = this.data.suppliers.findIndex(s => s.id === id);
    if (index !== -1) {
      this.data.suppliers[index] = { ...this.data.suppliers[index], ...updates, updatedAt: new Date().toISOString() };
      this.persistToIndexedDB();
      return this.data.suppliers[index];
    }
    return null;
  }

  deleteSupplier(id: string) {
    this.data.suppliers = this.data.suppliers.filter(s => s.id !== id);
    this.persistToIndexedDB();
  }

  // ==================== التراخيص ====================
  getLicenses(): DatabaseSchema['licenses'] {
    return [...this.data.licenses];
  }

  getLicense(id: string) {
    return this.data.licenses.find(l => l.id === id);
  }

  addLicense(license: Omit<DatabaseSchema['licenses'][0], 'id' | 'createdAt' | 'updatedAt'>) {
    const newLicense = {
      ...license,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.licenses.push(newLicense);
    this.persistToIndexedDB();
    return newLicense;
  }

  updateLicense(id: string, updates: Partial<DatabaseSchema['licenses'][0]>) {
    const index = this.data.licenses.findIndex(l => l.id === id);
    if (index !== -1) {
      this.data.licenses[index] = { ...this.data.licenses[index], ...updates, updatedAt: new Date().toISOString() };
      this.persistToIndexedDB();
      return this.data.licenses[index];
    }
    return null;
  }

  deleteLicense(id: string) {
    this.data.licenses = this.data.licenses.filter(l => l.id !== id);
    this.persistToIndexedDB();
  }

  // ==================== الموظفين ====================
  getEmployees(): DatabaseSchema['employees'] {
    return [...this.data.employees];
  }

  getEmployee(id: string) {
    return this.data.employees.find(e => e.id === id);
  }

  addEmployee(employee: Omit<DatabaseSchema['employees'][0], 'id' | 'createdAt' | 'updatedAt'>) {
    const newEmployee = {
      ...employee,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.employees.push(newEmployee);
    this.persistToIndexedDB();
    return newEmployee;
  }

  updateEmployee(id: string, updates: Partial<DatabaseSchema['employees'][0]>) {
    const index = this.data.employees.findIndex(e => e.id === id);
    if (index !== -1) {
      this.data.employees[index] = { ...this.data.employees[index], ...updates, updatedAt: new Date().toISOString() };
      this.persistToIndexedDB();
      return this.data.employees[index];
    }
    return null;
  }

  deleteEmployee(id: string) {
    this.data.employees = this.data.employees.filter(e => e.id !== id);
    this.persistToIndexedDB();
  }

  // ==================== المخزون ====================
  getProducts(): DatabaseSchema['products'] {
    return [...(this.data.products || [])];
  }

  getProduct(id: string) {
    return (this.data.products || []).find(p => p.id === id);
  }

  addProduct(product: Omit<DatabaseSchema['products'][0], 'id' | 'createdAt' | 'updatedAt'>) {
    if (!this.data.products) this.data.products = [];
    const newProduct = {
      ...product,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.products.push(newProduct);
    this.persistToIndexedDB();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<DatabaseSchema['products'][0]>) {
    if (!this.data.products) this.data.products = [];
    const index = this.data.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.data.products[index] = { ...this.data.products[index], ...updates, updatedAt: new Date().toISOString() };
      this.persistToIndexedDB();
      return this.data.products[index];
    }
    return null;
  }

  deleteProduct(id: string) {
    if (this.data.products) {
      this.data.products = this.data.products.filter(p => p.id !== id);
      this.persistToIndexedDB();
    }
  }

  // ==================== الطلبات ====================
  getOrders(): DatabaseSchema['orders'] {
    return [...(this.data.orders || [])];
  }

  getOrder(id: string) {
    return (this.data.orders || []).find(o => o.id === id);
  }

  addOrder(order: Omit<DatabaseSchema['orders'][0], 'id' | 'createdAt' | 'updatedAt'>) {
    if (!this.data.orders) this.data.orders = [];
    const newOrder = {
      ...order,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.orders.push(newOrder);
    this.persistToIndexedDB();
    return newOrder;
  }

  updateOrder(id: string, updates: Partial<DatabaseSchema['orders'][0]>) {
    if (!this.data.orders) this.data.orders = [];
    const index = this.data.orders.findIndex(o => o.id === id);
    if (index !== -1) {
      this.data.orders[index] = { ...this.data.orders[index], ...updates, updatedAt: new Date().toISOString() };
      this.persistToIndexedDB();
      return this.data.orders[index];
    }
    return null;
  }

  deleteOrder(id: string) {
    if (this.data.orders) {
      this.data.orders = this.data.orders.filter(o => o.id !== id);
      this.persistToIndexedDB();
    }
  }

  // ==================== المبيعات ====================
  getSales(): DatabaseSchema['sales'] {
    return [...this.data.sales];
  }

  addSale(sale: Omit<DatabaseSchema['sales'][0], 'id' | 'createdAt' | 'updatedAt'>) {
    const newSale = {
      ...sale,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.sales.push(newSale);
    this.persistToIndexedDB();
    return newSale;
  }

  // ==================== المستخدمين ====================
  getUsers(): DatabaseSchema['users'] {
    return [...this.data.users];
  }

  authenticateUser(username: string, password: string) {
    return this.data.users.find(u => u.username === username && u.password === password);
  }

  // ==================== الإحصائيات ====================
  getStats() {
    const activeBranches = this.data.branches.filter(b => b.status === 'active').length;
    const totalEmployees = this.data.employees.filter(e => e.status === 'active').length;
    const totalSales = this.data.branches.reduce((sum, b) => sum + b.monthlySales, 0);
    const activeSuppliers = this.data.suppliers.filter(s => s.status === 'active').length;
    const expiringLicenses = this.data.licenses.filter(l => l.status === 'expiring').length;
    const expiredLicenses = this.data.licenses.filter(l => l.status === 'expired').length;

    return {
      activeBranches,
      totalBranches: this.data.branches.length,
      totalEmployees,
      totalSales,
      activeSuppliers,
      totalSuppliers: this.data.suppliers.length,
      expiringLicenses,
      expiredLicenses,
      totalLicenses: this.data.licenses.length,
    };
  }

  // ==================== النسخ الاحتياطي ====================
  createBackup(): BackupData {
    return {
      version: BACKUP_VERSION,
      createdAt: new Date().toISOString(),
      data: { ...this.data },
    };
  }

  restoreBackup(backup: BackupData): boolean {
    try {
      if (!backup.data || !backup.version) {
        throw new Error('ملف النسخ الاحتياطي غير صالح');
      }
      this.data = backup.data;
      this.persistToIndexedDB();
      return true;
    } catch (error) {
      console.error('خطأ في استعادة النسخ الاحتياطي:', error);
      return false;
    }
  }

  downloadBackup(): void {
    const backup = this.createBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pharmalife-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // إعادة تعيين قاعدة البيانات
  resetDatabase(): void {
    this.data = { ...defaultData };
    this.persistToIndexedDB();
    // مسح localStorage القديم أيضاً
    try { localStorage.removeItem('pharmalife_db'); } catch {}
  }
}

// تصدير نسخة واحدة من قاعدة البيانات
export const db = new IndexedDatabase();
