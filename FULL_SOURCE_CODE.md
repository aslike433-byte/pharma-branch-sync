# PharmaLife - كود المصدر الكامل
## نظام إدارة الصيدليات

تاريخ الإنشاء: 2026-01-16

---

## جدول المحتويات
1. [ملفات التكوين](#ملفات-التكوين)
2. [الملف الرئيسي](#الملف-الرئيسي)
3. [قاعدة البيانات](#قاعدة-البيانات)
4. [الصفحات](#الصفحات)
5. [المكونات](#المكونات)
6. [Hooks](#hooks)

---

## ملفات التكوين

### index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lovable App</title>
    <meta name="description" content="Lovable Generated Project" />
    <meta name="author" content="Lovable" />
    <meta property="og:title" content="Lovable App" />
    <meta property="og:description" content="Lovable Generated Project" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@Lovable" />
    <meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### vite.config.ts
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
```

---

## الملف الرئيسي

### src/App.tsx
```typescript
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Suppliers from "./pages/Suppliers";
import Settings from "./pages/Settings";
import Branches from "./pages/Branches";
import Reports from "./pages/Reports";
import Licenses from "./pages/Licenses";
import Payroll from "./pages/Payroll";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Settings />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/licenses" element={<Licenses />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/sales" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
```

---

## قاعدة البيانات

### src/lib/database/types.ts
```typescript
// أنواع البيانات الأساسية للنظام

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  status: 'active' | 'inactive';
  monthlySales: number;
  employeesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  rating: number;
  status: 'active' | 'inactive';
  totalOrders: number;
  lastOrderDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface License {
  id: string;
  branchId: string;
  type: 'pharmacy' | 'employee' | 'maintenance' | 'health';
  name: string;
  licenseNumber: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring' | 'expired';
  documentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  branchId: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  salary: number;
  allowances: number;
  deductions: number;
  status: 'active' | 'inactive';
  hireDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  branchId: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  branchId: string;
  month: string;
  totalSales: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  branchId: string;
  name: string;
  category: 'medicines' | 'cosmetics' | 'supplements' | 'equipment' | 'other';
  sku: string;
  barcode?: string;
  quantity: number;
  minQuantity: number;
  price: number;
  costPrice: number;
  supplierId?: string;
  expiryDate?: string;
  status: 'available' | 'low' | 'out';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  supplierId: string;
  branchId: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  notes?: string;
  orderDate: string;
  expectedDeliveryDate?: string;
  deliveredDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseSchema {
  branches: Branch[];
  suppliers: Supplier[];
  licenses: License[];
  employees: Employee[];
  expenses: Expense[];
  sales: Sale[];
  users: User[];
  products: Product[];
  orders: Order[];
  settings: Record<string, any>;
}

export interface BackupData {
  version: string;
  createdAt: string;
  data: DatabaseSchema;
}
```

### src/lib/database/localStorage.ts
```typescript
// خدمة قاعدة البيانات المحلية

import { DatabaseSchema, BackupData } from './types';

const DB_KEY = 'pharmalife_db';
const DB_VERSION = '1.0.0';

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

class LocalDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadFromStorage();
  }

  private loadFromStorage(): DatabaseSchema {
    try {
      const stored = localStorage.getItem(DB_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('خطأ في تحميل قاعدة البيانات:', error);
    }
    this.saveToStorage(defaultData);
    return { ...defaultData };
  }

  private saveToStorage(data: DatabaseSchema): void {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('خطأ في حفظ قاعدة البيانات:', error);
    }
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
    this.saveToStorage(this.data);
    return newBranch;
  }

  updateBranch(id: string, updates: Partial<DatabaseSchema['branches'][0]>) {
    const index = this.data.branches.findIndex(b => b.id === id);
    if (index !== -1) {
      this.data.branches[index] = {
        ...this.data.branches[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.saveToStorage(this.data);
      return this.data.branches[index];
    }
    return null;
  }

  deleteBranch(id: string) {
    this.data.branches = this.data.branches.filter(b => b.id !== id);
    this.saveToStorage(this.data);
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
    this.saveToStorage(this.data);
    return newSupplier;
  }

  updateSupplier(id: string, updates: Partial<DatabaseSchema['suppliers'][0]>) {
    const index = this.data.suppliers.findIndex(s => s.id === id);
    if (index !== -1) {
      this.data.suppliers[index] = {
        ...this.data.suppliers[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.saveToStorage(this.data);
      return this.data.suppliers[index];
    }
    return null;
  }

  deleteSupplier(id: string) {
    this.data.suppliers = this.data.suppliers.filter(s => s.id !== id);
    this.saveToStorage(this.data);
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
    this.saveToStorage(this.data);
    return newLicense;
  }

  updateLicense(id: string, updates: Partial<DatabaseSchema['licenses'][0]>) {
    const index = this.data.licenses.findIndex(l => l.id === id);
    if (index !== -1) {
      this.data.licenses[index] = {
        ...this.data.licenses[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.saveToStorage(this.data);
      return this.data.licenses[index];
    }
    return null;
  }

  deleteLicense(id: string) {
    this.data.licenses = this.data.licenses.filter(l => l.id !== id);
    this.saveToStorage(this.data);
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
    this.saveToStorage(this.data);
    return newEmployee;
  }

  updateEmployee(id: string, updates: Partial<DatabaseSchema['employees'][0]>) {
    const index = this.data.employees.findIndex(e => e.id === id);
    if (index !== -1) {
      this.data.employees[index] = {
        ...this.data.employees[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.saveToStorage(this.data);
      return this.data.employees[index];
    }
    return null;
  }

  deleteEmployee(id: string) {
    this.data.employees = this.data.employees.filter(e => e.id !== id);
    this.saveToStorage(this.data);
  }

  // ==================== المخزون ====================
  getProducts(): DatabaseSchema['products'] {
    return [...(this.data.products || [])];
  }

  getProduct(id: string) {
    return (this.data.products || []).find(p => p.id === id);
  }

  addProduct(product: Omit<DatabaseSchema['products'][0], 'id' | 'createdAt' | 'updatedAt'>) {
    if (!this.data.products) {
      this.data.products = [];
    }
    const newProduct = {
      ...product,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.products.push(newProduct);
    this.saveToStorage(this.data);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<DatabaseSchema['products'][0]>) {
    if (!this.data.products) {
      this.data.products = [];
    }
    const index = this.data.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.data.products[index] = {
        ...this.data.products[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.saveToStorage(this.data);
      return this.data.products[index];
    }
    return null;
  }

  deleteProduct(id: string) {
    if (this.data.products) {
      this.data.products = this.data.products.filter(p => p.id !== id);
      this.saveToStorage(this.data);
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
    if (!this.data.orders) {
      this.data.orders = [];
    }
    const newOrder = {
      ...order,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.orders.push(newOrder);
    this.saveToStorage(this.data);
    return newOrder;
  }

  updateOrder(id: string, updates: Partial<DatabaseSchema['orders'][0]>) {
    if (!this.data.orders) {
      this.data.orders = [];
    }
    const index = this.data.orders.findIndex(o => o.id === id);
    if (index !== -1) {
      this.data.orders[index] = {
        ...this.data.orders[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.saveToStorage(this.data);
      return this.data.orders[index];
    }
    return null;
  }

  deleteOrder(id: string) {
    if (this.data.orders) {
      this.data.orders = this.data.orders.filter(o => o.id !== id);
      this.saveToStorage(this.data);
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
    this.saveToStorage(this.data);
    return newSale;
  }

  // ==================== المستخدمين ====================
  getUsers(): DatabaseSchema['users'] {
    return [...this.data.users];
  }

  authenticateUser(username: string, password: string) {
    return this.data.users.find(
      u => u.username === username && u.password === password
    );
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
      version: DB_VERSION,
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
      this.saveToStorage(this.data);
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

  resetDatabase(): void {
    this.data = { ...defaultData };
    this.saveToStorage(this.data);
  }
}

export const db = new LocalDatabase();
```

---

## الصفحات

نظراً لحجم الكود الكبير، يمكنك تحميل الملف الكامل من المشروع أو مراجعة الملفات التالية:

- `src/pages/Login.tsx` - صفحة تسجيل الدخول
- `src/pages/Dashboard.tsx` - لوحة التحكم الرئيسية
- `src/pages/Branches.tsx` - إدارة الفروع
- `src/pages/Suppliers.tsx` - إدارة الموردين
- `src/pages/Licenses.tsx` - إدارة التراخيص
- `src/pages/Payroll.tsx` - إدارة الرواتب والموظفين
- `src/pages/Inventory.tsx` - إدارة المخزون
- `src/pages/Orders.tsx` - إدارة المشتريات
- `src/pages/Reports.tsx` - التقارير والإحصائيات
- `src/pages/Settings.tsx` - الإعدادات والملف الشخصي

---

## Hooks

### src/hooks/useDatabase.ts
```typescript
import { useState, useCallback } from 'react';
import { db } from '@/lib/database';
import { Branch, Supplier, License, Employee, Product, Order, BackupData } from '@/lib/database/types';
import { toast } from '@/hooks/use-toast';

export function useDatabase() {
  const [isLoading, setIsLoading] = useState(false);

  const getBranches = useCallback(() => db.getBranches(), []);
  const addBranch = useCallback((branch: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBranch = db.addBranch(branch);
    toast({ title: 'تم إضافة الفرع بنجاح', variant: 'default' });
    return newBranch;
  }, []);
  // ... المزيد من الدوال

  return {
    isLoading,
    getBranches,
    addBranch,
    // ... المزيد
  };
}
```

### src/hooks/useLicenseAlerts.ts
```typescript
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

export function useLicenseAlerts() {
  const { getLicenses, getBranches } = useDatabase();
  const [alerts, setAlerts] = useState<LicenseAlert[]>([]);

  const checkLicenseAlerts = useCallback(() => {
    const licenses = getLicenses();
    const branches = getBranches();
    // ... تحقق من التراخيص وإنشاء التنبيهات
  }, [getLicenses, getBranches]);

  return {
    alerts,
    checkLicenseAlerts,
    // ... المزيد
  };
}
```

---

## ملاحظة

هذا الملف يحتوي على الأكواد الرئيسية للمشروع. للحصول على الكود الكامل لجميع الملفات، يمكنك:

1. تحميل المشروع من GitHub إذا كان متصلاً
2. استخدام خاصية النسخ الاحتياطي في الإعدادات
3. مراجعة كل ملف على حدة في محرر الأكواد

---

**إجمالي الملفات:** ~50 ملف
**اللغات المستخدمة:** TypeScript, React, Tailwind CSS
**قاعدة البيانات:** localStorage (محلية)
