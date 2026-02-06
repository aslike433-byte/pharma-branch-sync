# PharmaLife - كود المصدر الكامل
## نظام إدارة الصيدليات

تاريخ التحديث: 2026-02-06

---

## جدول المحتويات
1. [ملفات التكوين](#ملفات-التكوين)
2. [الملف الرئيسي](#الملف-الرئيسي)
3. [قاعدة البيانات](#قاعدة-البيانات)
4. [الصفحات](#الصفحات)
5. [المكونات](#المكونات)
6. [Hooks](#hooks)
7. [المكتبات المساعدة](#المكتبات-المساعدة)
8. [الأنماط](#الأنماط)

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

### tailwind.config.ts
```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        arabic: ['"Noto Sans Arabic"', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
        'soft': 'var(--shadow-md)',
        'glow': '0 0 20px hsl(var(--primary) / 0.3)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

---

## الملف الرئيسي

### src/main.tsx
```tsx
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
```

### src/App.tsx
```tsx
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

### src/components/ThemeProvider.tsx
```tsx
import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

---

## قاعدة البيانات

### src/lib/database/types.ts
```typescript
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

### src/lib/database/index.ts
```typescript
export { db } from './localStorage';
export * from './types';
```

### src/lib/database/localStorage.ts
```typescript
import { DatabaseSchema, BackupData } from './types';

const DB_KEY = 'pharmalife_db';
const DB_VERSION = '1.0.0';

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

  // الفروع
  getBranches() { return [...this.data.branches]; }
  getBranch(id: string) { return this.data.branches.find(b => b.id === id); }
  addBranch(branch: Omit<DatabaseSchema['branches'][0], 'id' | 'createdAt' | 'updatedAt'>) {
    const newBranch = { ...branch, id: this.generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.data.branches.push(newBranch);
    this.saveToStorage(this.data);
    return newBranch;
  }
  updateBranch(id: string, updates: Partial<DatabaseSchema['branches'][0]>) {
    const index = this.data.branches.findIndex(b => b.id === id);
    if (index !== -1) {
      this.data.branches[index] = { ...this.data.branches[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveToStorage(this.data);
      return this.data.branches[index];
    }
    return null;
  }
  deleteBranch(id: string) { this.data.branches = this.data.branches.filter(b => b.id !== id); this.saveToStorage(this.data); }

  // الموردين
  getSuppliers() { return [...this.data.suppliers]; }
  getSupplier(id: string) { return this.data.suppliers.find(s => s.id === id); }
  addSupplier(supplier: Omit<DatabaseSchema['suppliers'][0], 'id' | 'createdAt' | 'updatedAt'>) {
    const newSupplier = { ...supplier, id: this.generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.data.suppliers.push(newSupplier);
    this.saveToStorage(this.data);
    return newSupplier;
  }
  updateSupplier(id: string, updates: Partial<DatabaseSchema['suppliers'][0]>) {
    const index = this.data.suppliers.findIndex(s => s.id === id);
    if (index !== -1) {
      this.data.suppliers[index] = { ...this.data.suppliers[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveToStorage(this.data);
      return this.data.suppliers[index];
    }
    return null;
  }
  deleteSupplier(id: string) { this.data.suppliers = this.data.suppliers.filter(s => s.id !== id); this.saveToStorage(this.data); }

  // التراخيص
  getLicenses() { return [...this.data.licenses]; }
  getLicense(id: string) { return this.data.licenses.find(l => l.id === id); }
  addLicense(license: Omit<DatabaseSchema['licenses'][0], 'id' | 'createdAt' | 'updatedAt'>) {
    const newLicense = { ...license, id: this.generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.data.licenses.push(newLicense);
    this.saveToStorage(this.data);
    return newLicense;
  }
  updateLicense(id: string, updates: Partial<DatabaseSchema['licenses'][0]>) {
    const index = this.data.licenses.findIndex(l => l.id === id);
    if (index !== -1) {
      this.data.licenses[index] = { ...this.data.licenses[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveToStorage(this.data);
      return this.data.licenses[index];
    }
    return null;
  }
  deleteLicense(id: string) { this.data.licenses = this.data.licenses.filter(l => l.id !== id); this.saveToStorage(this.data); }

  // الموظفين
  getEmployees() { return [...this.data.employees]; }
  getEmployee(id: string) { return this.data.employees.find(e => e.id === id); }
  addEmployee(employee: Omit<DatabaseSchema['employees'][0], 'id' | 'createdAt' | 'updatedAt'>) {
    const newEmployee = { ...employee, id: this.generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.data.employees.push(newEmployee);
    this.saveToStorage(this.data);
    return newEmployee;
  }
  updateEmployee(id: string, updates: Partial<DatabaseSchema['employees'][0]>) {
    const index = this.data.employees.findIndex(e => e.id === id);
    if (index !== -1) {
      this.data.employees[index] = { ...this.data.employees[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveToStorage(this.data);
      return this.data.employees[index];
    }
    return null;
  }
  deleteEmployee(id: string) { this.data.employees = this.data.employees.filter(e => e.id !== id); this.saveToStorage(this.data); }

  // المخزون
  getProducts() { return [...(this.data.products || [])]; }
  getProduct(id: string) { return (this.data.products || []).find(p => p.id === id); }
  addProduct(product: Omit<DatabaseSchema['products'][0], 'id' | 'createdAt' | 'updatedAt'>) {
    if (!this.data.products) this.data.products = [];
    const newProduct = { ...product, id: this.generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.data.products.push(newProduct);
    this.saveToStorage(this.data);
    return newProduct;
  }
  updateProduct(id: string, updates: Partial<DatabaseSchema['products'][0]>) {
    if (!this.data.products) this.data.products = [];
    const index = this.data.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.data.products[index] = { ...this.data.products[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveToStorage(this.data);
      return this.data.products[index];
    }
    return null;
  }
  deleteProduct(id: string) { if (this.data.products) { this.data.products = this.data.products.filter(p => p.id !== id); this.saveToStorage(this.data); } }

  // الطلبات
  getOrders() { return [...(this.data.orders || [])]; }
  getOrder(id: string) { return (this.data.orders || []).find(o => o.id === id); }
  addOrder(order: Omit<DatabaseSchema['orders'][0], 'id' | 'createdAt' | 'updatedAt'>) {
    if (!this.data.orders) this.data.orders = [];
    const newOrder = { ...order, id: this.generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.data.orders.push(newOrder);
    this.saveToStorage(this.data);
    return newOrder;
  }
  updateOrder(id: string, updates: Partial<DatabaseSchema['orders'][0]>) {
    if (!this.data.orders) this.data.orders = [];
    const index = this.data.orders.findIndex(o => o.id === id);
    if (index !== -1) {
      this.data.orders[index] = { ...this.data.orders[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveToStorage(this.data);
      return this.data.orders[index];
    }
    return null;
  }
  deleteOrder(id: string) { if (this.data.orders) { this.data.orders = this.data.orders.filter(o => o.id !== id); this.saveToStorage(this.data); } }

  // المبيعات
  getSales() { return [...this.data.sales]; }
  addSale(sale: Omit<DatabaseSchema['sales'][0], 'id' | 'createdAt' | 'updatedAt'>) {
    const newSale = { ...sale, id: this.generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.data.sales.push(newSale);
    this.saveToStorage(this.data);
    return newSale;
  }

  // المستخدمين
  getUsers() { return [...this.data.users]; }
  authenticateUser(username: string, password: string) {
    return this.data.users.find(u => u.username === username && u.password === password);
  }

  // الإحصائيات
  getStats() {
    return {
      activeBranches: this.data.branches.filter(b => b.status === 'active').length,
      totalBranches: this.data.branches.length,
      totalEmployees: this.data.employees.filter(e => e.status === 'active').length,
      totalSales: this.data.branches.reduce((sum, b) => sum + b.monthlySales, 0),
      activeSuppliers: this.data.suppliers.filter(s => s.status === 'active').length,
      totalSuppliers: this.data.suppliers.length,
      expiringLicenses: this.data.licenses.filter(l => l.status === 'expiring').length,
      expiredLicenses: this.data.licenses.filter(l => l.status === 'expired').length,
      totalLicenses: this.data.licenses.length,
    };
  }

  // النسخ الاحتياطي
  createBackup(): BackupData {
    return { version: DB_VERSION, createdAt: new Date().toISOString(), data: { ...this.data } };
  }
  restoreBackup(backup: BackupData): boolean {
    try {
      if (!backup.data || !backup.version) throw new Error('ملف النسخ الاحتياطي غير صالح');
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

### src/pages/Login.tsx
```tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock, WifiOff, Globe, LogIn } from "lucide-react";
import { PharmaIcon } from "@/components/ui/PharmaIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (username && password) {
      toast.success("تم تسجيل الدخول بنجاح");
      navigate("/dashboard");
    } else {
      toast.error("يرجى إدخال اسم المستخدم وكلمة المرور");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <button className="absolute top-4 right-4 z-10 p-2 rounded-full bg-card border border-border shadow-soft hover:bg-muted transition-colors">
        <Globe className="w-5 h-5 text-muted-foreground" />
      </button>
      <div className="pharma-header text-primary-foreground px-6 pt-12 pb-16 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white/20 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <PharmaIcon size="xl" className="mb-4" />
          <h1 className="text-2xl font-bold tracking-wide">ELNADY PHARMACIES</h1>
          <p className="text-primary-foreground/80 mt-1">PharmaLife System</p>
        </div>
      </div>
      <div className="flex-1 px-6 -mt-8">
        <div className="pharma-card p-6 animate-slide-up">
          <h2 className="text-xl font-bold text-center mb-4">تسجيل الدخول</h2>
          <div className="offline-banner mb-6">
            <WifiOff className="w-4 h-4" />
            <span>وضع غير متصل بالشبكة</span>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">اسم المستخدم</label>
              <div className="relative">
                <Input type="text" placeholder="أدخل اسم المستخدم" value={username} onChange={(e) => setUsername(e.target.value)} className="pharma-input pl-10 pr-12" />
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">كلمة المرور</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="أدخل كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} className="pharma-input px-12" />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">تذكرني</label>
              </div>
              <button type="button" className="text-sm text-primary hover:underline">نسيت كلمة المرور؟</button>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full pharma-btn-primary h-12 text-base font-semibold rounded-xl gap-2">
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>تسجيل الدخول</span><LogIn className="w-5 h-5 rotate-180" /></>}
            </Button>
          </form>
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">PharmaLife v1.0.2</p>
            <p className="text-xs text-muted-foreground mt-1">© ELNADY PHARMACIES 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### src/pages/Dashboard.tsx
```tsx
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
        <div className="offline-banner animate-fade-in">
          <WifiOff className="w-4 h-4" />
          <span>وضع غير متصل - البيانات محفوظة محليًا</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StatsCard title="إجمالي الفروع" value="15" subtitle="فرع نشط" icon={Building2} variant="default" />
          <StatsCard title="الأصناف" value="12,405" subtitle="صنف مسجل" icon={Package} variant="info" />
          <StatsCard title="الموظفين" value="148" subtitle="موظف نشط" icon={Users} variant="success" />
          <StatsCard title="المبيعات" value="1.2M" subtitle="هذا الشهر" icon={TrendingUp} trend={{ value: 12, isPositive: true }} variant="default" />
        </div>
        <section>
          <h3 className="font-semibold mb-3">الوصول السريع</h3>
          <QuickActions />
        </section>
        <section className="pharma-card p-4">
          <AlertsList />
        </section>
        <section>
          <BranchesOverview />
        </section>
      </main>
      <BottomNavigation />
    </div>
  );
}
```

### src/pages/NotFound.tsx
```tsx
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">Return to Home</a>
      </div>
    </div>
  );
};
export default NotFound;
```

> **ملاحظة:** الصفحات التالية (Branches, Inventory, Orders, Suppliers, Licenses, Payroll, Reports, Settings) كبيرة جداً ومتاحة في ملفات المشروع مباشرة. يمكنك الاطلاع عليها من مستودع GitHub.

---

## المكونات

### src/components/layout/Header.tsx
```tsx
import { Menu, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LicenseAlertsBadge } from "@/components/alerts/LicenseAlertsBadge";

interface HeaderProps {
  title: string;
  showNotifications?: boolean;
  showBack?: boolean;
  onMenuClick?: () => void;
}

export function Header({ title, showNotifications = true, showBack = false, onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        {showBack ? (
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowRight className="w-6 h-6" />
          </button>
        ) : (
          <button onClick={onMenuClick} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-lg font-bold">{title}</h1>
        <div className="flex items-center gap-2">
          {showNotifications && <LicenseAlertsBadge />}
          <Link to="/profile" className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            <span className="text-sm font-semibold text-primary">أ</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
```

### src/components/layout/BottomNavigation.tsx
```tsx
import { Link, useLocation } from "react-router-dom";
import { Home, Users, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "الرئيسية", path: "/dashboard" },
  { icon: Users, label: "الموردين", path: "/suppliers" },
  { icon: BarChart3, label: "التقارير", path: "/reports" },
  { icon: Settings, label: "الإعدادات", path: "/settings" },
];

export function BottomNavigation() {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
          return (
            <Link key={item.path} to={item.path} className={cn("flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200", isActive ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
              <item.icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
              <span className={cn("text-xs", isActive && "font-semibold")}>{item.label}</span>
              {isActive && <div className="absolute -bottom-0 w-12 h-1 rounded-t-full bg-primary" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

### src/components/dashboard/StatsCard.tsx
```tsx
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  variant?: "default" | "success" | "warning" | "destructive" | "info";
}

const variantStyles = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
};

export function StatsCard({ title, value, subtitle, icon: Icon, trend, variant = "default" }: StatsCardProps) {
  return (
    <div className="pharma-card p-4 animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <div className={cn("p-2.5 rounded-xl", variantStyles[variant])}><Icon className="w-5 h-5" /></div>
        {trend && (
          <span className={cn("text-xs font-medium px-2 py-1 rounded-full", trend.isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
            {trend.isPositive ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
```

### src/components/dashboard/QuickActions.tsx
```tsx
import { Link } from "react-router-dom";
import { Building2, Package, FileCheck, Wallet, TrendingUp, ShoppingCart, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  { icon: Building2, label: "الفروع", path: "/branches", color: "bg-primary/10 text-primary" },
  { icon: Package, label: "الأصناف", path: "/inventory", color: "bg-info/10 text-info" },
  { icon: FileCheck, label: "التراخيص", path: "/licenses", color: "bg-warning/10 text-warning" },
  { icon: Wallet, label: "الرواتب", path: "/payroll", color: "bg-success/10 text-success" },
  { icon: TrendingUp, label: "المبيعات", path: "/sales", color: "bg-accent/10 text-accent" },
  { icon: ShoppingCart, label: "المشتريات", path: "/orders", color: "bg-destructive/10 text-destructive" },
  { icon: Users, label: "الموردين", path: "/suppliers", color: "bg-info/10 text-info" },
  { icon: Settings, label: "الإعدادات", path: "/settings", color: "bg-muted text-muted-foreground" },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((action, index) => (
        <Link key={action.path} to={action.path} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-soft transition-all duration-200 animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
          <div className={cn("p-3 rounded-xl", action.color)}><action.icon className="w-5 h-5" /></div>
          <span className="text-xs font-medium text-center">{action.label}</span>
        </Link>
      ))}
    </div>
  );
}
```

### src/components/ui/PharmaIcon.tsx
```tsx
import { cn } from "@/lib/utils";

interface PharmaIconProps { className?: string; size?: "sm" | "md" | "lg" | "xl"; }
const sizeClasses = { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-16 h-16", xl: "w-24 h-24" };

export function PharmaIcon({ className, size = "md" }: PharmaIconProps) {
  return (
    <div className={cn("flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm", sizeClasses[size], className)}>
      <svg viewBox="0 0 24 24" fill="none" className="w-2/3 h-2/3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" opacity="0.2" />
        <path d="M12 8v8" stroke="currentColor" strokeWidth="2.5" />
        <path d="M8 12h8" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    </div>
  );
}
```

### src/lib/utils.ts
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

> **ملاحظة:** باقي المكونات (Modals, Charts, Alerts, BranchesOverview, AlertsList) وصفحات (Branches, Inventory, Orders, Suppliers, Licenses, Payroll, Reports, Settings) متاحة في ملفات المشروع مباشرة. يمكنك الحصول عليها عبر ربط المشروع بـ GitHub.

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
    toast({ title: 'تم إضافة الفرع بنجاح' });
    return newBranch;
  }, []);
  const updateBranch = useCallback((id: string, updates: Partial<Branch>) => {
    const updated = db.updateBranch(id, updates);
    if (updated) toast({ title: 'تم تحديث الفرع بنجاح' });
    return updated;
  }, []);
  const deleteBranch = useCallback((id: string) => { db.deleteBranch(id); toast({ title: 'تم حذف الفرع بنجاح' }); }, []);

  const getSuppliers = useCallback(() => db.getSuppliers(), []);
  const addSupplier = useCallback((supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSupplier = db.addSupplier(supplier);
    toast({ title: 'تم إضافة المورد بنجاح' });
    return newSupplier;
  }, []);
  const updateSupplier = useCallback((id: string, updates: Partial<Supplier>) => {
    const updated = db.updateSupplier(id, updates);
    if (updated) toast({ title: 'تم تحديث المورد بنجاح' });
    return updated;
  }, []);
  const deleteSupplier = useCallback((id: string) => { db.deleteSupplier(id); toast({ title: 'تم حذف المورد بنجاح' }); }, []);

  const getLicenses = useCallback(() => db.getLicenses(), []);
  const addLicense = useCallback((license: Omit<License, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLicense = db.addLicense(license);
    toast({ title: 'تم إضافة الترخيص بنجاح' });
    return newLicense;
  }, []);
  const updateLicense = useCallback((id: string, updates: Partial<License>) => {
    const updated = db.updateLicense(id, updates);
    if (updated) toast({ title: 'تم تحديث الترخيص بنجاح' });
    return updated;
  }, []);
  const deleteLicense = useCallback((id: string) => { db.deleteLicense(id); toast({ title: 'تم حذف الترخيص بنجاح' }); }, []);

  const getEmployees = useCallback(() => db.getEmployees(), []);
  const addEmployee = useCallback((employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEmployee = db.addEmployee(employee);
    toast({ title: 'تم إضافة الموظف بنجاح' });
    return newEmployee;
  }, []);
  const updateEmployee = useCallback((id: string, updates: Partial<Employee>) => {
    const updated = db.updateEmployee(id, updates);
    if (updated) toast({ title: 'تم تحديث بيانات الموظف بنجاح' });
    return updated;
  }, []);
  const deleteEmployee = useCallback((id: string) => { db.deleteEmployee(id); toast({ title: 'تم حذف الموظف بنجاح' }); }, []);

  const getProducts = useCallback(() => db.getProducts(), []);
  const addProduct = useCallback((product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct = db.addProduct(product);
    toast({ title: 'تم إضافة الصنف بنجاح' });
    return newProduct;
  }, []);
  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    const updated = db.updateProduct(id, updates);
    if (updated) toast({ title: 'تم تحديث الصنف بنجاح' });
    return updated;
  }, []);
  const deleteProduct = useCallback((id: string) => { db.deleteProduct(id); toast({ title: 'تم حذف الصنف بنجاح' }); }, []);

  const getOrders = useCallback(() => db.getOrders(), []);
  const addOrder = useCallback((order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder = db.addOrder(order);
    toast({ title: 'تم إضافة الطلب بنجاح' });
    return newOrder;
  }, []);
  const updateOrder = useCallback((id: string, updates: Partial<Order>) => {
    const updated = db.updateOrder(id, updates);
    if (updated) toast({ title: 'تم تحديث الطلب بنجاح' });
    return updated;
  }, []);
  const deleteOrder = useCallback((id: string) => { db.deleteOrder(id); toast({ title: 'تم حذف الطلب بنجاح' }); }, []);

  const getStats = useCallback(() => db.getStats(), []);
  const authenticateUser = useCallback((username: string, password: string) => db.authenticateUser(username, password), []);

  const createBackup = useCallback(() => {
    setIsLoading(true);
    try { db.downloadBackup(); toast({ title: 'تم إنشاء النسخة الاحتياطية بنجاح' }); }
    catch { toast({ title: 'خطأ في إنشاء النسخة الاحتياطية', variant: 'destructive' }); }
    finally { setIsLoading(false); }
  }, []);

  const restoreBackup = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const backup = JSON.parse(e.target?.result as string) as BackupData;
          const success = db.restoreBackup(backup);
          if (success) { toast({ title: 'تم استعادة النسخة الاحتياطية بنجاح' }); resolve(true); }
          else { toast({ title: 'ملف النسخ الاحتياطي غير صالح', variant: 'destructive' }); resolve(false); }
        } catch { toast({ title: 'خطأ في قراءة ملف النسخ الاحتياطي', variant: 'destructive' }); resolve(false); }
        finally { setIsLoading(false); }
      };
      reader.readAsText(file);
    });
  }, []);

  const resetDatabase = useCallback(() => { db.resetDatabase(); toast({ title: 'تم إعادة تعيين قاعدة البيانات' }); }, []);

  return {
    isLoading, getBranches, addBranch, updateBranch, deleteBranch,
    getSuppliers, addSupplier, updateSupplier, deleteSupplier,
    getLicenses, addLicense, updateLicense, deleteLicense,
    getEmployees, addEmployee, updateEmployee, deleteEmployee,
    getProducts, addProduct, updateProduct, deleteProduct,
    getOrders, addOrder, updateOrder, deleteOrder,
    getStats, authenticateUser, createBackup, restoreBackup, resetDatabase,
  };
}
```

### src/hooks/useTheme.ts
```typescript
import { useTheme as useNextTheme } from "next-themes";

export function useTheme() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useNextTheme();
  const isDark = resolvedTheme === "dark";
  const isLight = resolvedTheme === "light";
  const isSystem = theme === "system";
  const toggleTheme = () => { if (isDark) setTheme("light"); else setTheme("dark"); };
  return { theme, setTheme, systemTheme, resolvedTheme, isDark, isLight, isSystem, toggleTheme };
}
```

### src/hooks/use-mobile.tsx
```tsx
import * as React from "react";
const MOBILE_BREAKPOINT = 768;
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}
```

---

## الأنماط

### src/index.css
```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 120 20% 97%;
    --foreground: 150 10% 15%;
    --card: 0 0% 100%;
    --card-foreground: 150 10% 15%;
    --popover: 0 0% 100%;
    --popover-foreground: 150 10% 15%;
    --primary: 122 45% 34%;
    --primary-foreground: 0 0% 100%;
    --secondary: 120 25% 95%;
    --secondary-foreground: 122 45% 34%;
    --muted: 120 15% 92%;
    --muted-foreground: 150 10% 45%;
    --accent: 122 85% 50%;
    --accent-foreground: 0 0% 100%;
    --success: 122 60% 45%;
    --success-foreground: 0 0% 100%;
    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 100%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --info: 210 85% 55%;
    --info-foreground: 0 0% 100%;
    --border: 120 15% 88%;
    --input: 120 15% 88%;
    --ring: 122 45% 34%;
    --radius: 0.75rem;
    --gradient-primary: linear-gradient(135deg, hsl(122, 45%, 34%) 0%, hsl(122, 55%, 28%) 100%);
    --gradient-header: linear-gradient(180deg, hsl(122, 45%, 34%) 0%, hsl(122, 50%, 30%) 100%);
    --gradient-card: linear-gradient(180deg, hsl(0, 0%, 100%) 0%, hsl(120, 20%, 98%) 100%);
    --shadow-sm: 0 1px 2px 0 hsl(150 10% 15% / 0.05);
    --shadow-md: 0 4px 6px -1px hsl(150 10% 15% / 0.1), 0 2px 4px -2px hsl(150 10% 15% / 0.1);
    --shadow-lg: 0 10px 15px -3px hsl(150 10% 15% / 0.1), 0 4px 6px -4px hsl(150 10% 15% / 0.1);
    --shadow-card: 0 2px 8px -2px hsl(150 10% 15% / 0.08), 0 4px 16px -4px hsl(150 10% 15% / 0.12);
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }

  .dark {
    --background: 150 15% 8%;
    --foreground: 120 15% 95%;
    --card: 150 15% 12%;
    --card-foreground: 120 15% 95%;
    --popover: 150 15% 12%;
    --popover-foreground: 120 15% 95%;
    --primary: 122 50% 45%;
    --primary-foreground: 0 0% 100%;
    --secondary: 150 15% 18%;
    --secondary-foreground: 120 15% 90%;
    --muted: 150 15% 20%;
    --muted-foreground: 120 10% 60%;
    --accent: 122 75% 55%;
    --accent-foreground: 0 0% 100%;
    --success: 122 55% 50%;
    --success-foreground: 0 0% 100%;
    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 100%;
    --destructive: 0 70% 50%;
    --destructive-foreground: 0 0% 100%;
    --info: 210 80% 60%;
    --info-foreground: 0 0% 100%;
    --border: 150 15% 22%;
    --input: 150 15% 22%;
    --ring: 122 50% 45%;
    --gradient-primary: linear-gradient(135deg, hsl(122, 50%, 40%) 0%, hsl(122, 55%, 32%) 100%);
    --gradient-header: linear-gradient(180deg, hsl(122, 50%, 38%) 0%, hsl(122, 55%, 28%) 100%);
    --gradient-card: linear-gradient(180deg, hsl(150, 15%, 12%) 0%, hsl(150, 15%, 10%) 100%);
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 224.3 76.3% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}

@layer base {
  * { @apply border-border; }
  html { direction: rtl; }
  body { @apply bg-background text-foreground font-arabic antialiased; font-feature-settings: "rlig" 1, "calt" 1; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { @apply bg-muted rounded-full; }
  ::-webkit-scrollbar-thumb { @apply bg-primary/30 rounded-full hover:bg-primary/50 transition-colors; }
}

@layer components {
  .pharma-card { @apply bg-card rounded-xl shadow-card border border-border/50 overflow-hidden; background: var(--gradient-card); }
  .pharma-header { background: var(--gradient-header); }
  .pharma-btn-primary { @apply bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200; background: var(--gradient-primary); }
  .pharma-input { @apply bg-background border border-input rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200; }
  .pharma-badge { @apply inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium; }
  .pharma-badge-success { @apply bg-success/15 text-success; }
  .pharma-badge-warning { @apply bg-warning/15 text-warning; }
  .pharma-badge-destructive { @apply bg-destructive/15 text-destructive; }
  .pharma-badge-info { @apply bg-info/15 text-info; }
  .pharma-badge-error { @apply bg-destructive/15 text-destructive; }
  .status-indicator { @apply w-2 h-2 rounded-full; }
  .status-active { @apply bg-success; }
  .status-warning { @apply bg-warning; }
  .status-inactive { @apply bg-destructive; }
  .offline-banner { @apply bg-warning/10 text-warning border border-warning/20 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2; }
}

@layer utilities {
  .text-gradient { @apply bg-clip-text text-transparent; background-image: var(--gradient-primary); }
  .shadow-card { box-shadow: var(--shadow-card); }
  .shadow-soft { box-shadow: var(--shadow-md); }
  .animate-fade-in { animation: fadeIn 0.3s ease-out; }
  .animate-slide-up { animation: slideUp 0.4s ease-out; }
  .animate-scale-in { animation: scaleIn 0.3s ease-out; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
}
```

---

## هيكل الملفات

```
src/
├── main.tsx
├── App.tsx
├── App.css
├── index.css
├── vite-env.d.ts
├── components/
│   ├── ThemeProvider.tsx
│   ├── NavLink.tsx
│   ├── alerts/
│   │   ├── LicenseAlertsBadge.tsx
│   │   └── LicenseAlertsProvider.tsx
│   ├── charts/
│   │   └── ReportCharts.tsx
│   ├── dashboard/
│   │   ├── AlertsList.tsx
│   │   ├── BranchesOverview.tsx
│   │   ├── QuickActions.tsx
│   │   └── StatsCard.tsx
│   ├── layout/
│   │   ├── BottomNavigation.tsx
│   │   └── Header.tsx
│   ├── modals/
│   │   ├── AddBranchModal.tsx
│   │   ├── AddEmployeeModal.tsx
│   │   ├── AddLicenseModal.tsx
│   │   ├── AddOrderModal.tsx
│   │   ├── AddProductModal.tsx
│   │   └── AddSupplierModal.tsx
│   └── ui/
│       ├── PharmaIcon.tsx
│       ├── button.tsx, card.tsx, input.tsx, ...
│       └── (shadcn/ui components)
├── hooks/
│   ├── use-mobile.tsx
│   ├── use-toast.ts
│   ├── useDatabase.ts
│   ├── useLicenseAlerts.ts
│   └── useTheme.ts
├── lib/
│   ├── utils.ts
│   ├── pdfExport.ts
│   ├── projectExport.ts
│   └── database/
│       ├── index.ts
│       ├── types.ts
│       └── localStorage.ts
└── pages/
    ├── Branches.tsx
    ├── Dashboard.tsx
    ├── Inventory.tsx
    ├── Licenses.tsx
    ├── Login.tsx
    ├── NotFound.tsx
    ├── Orders.tsx
    ├── Payroll.tsx
    ├── Reports.tsx
    ├── Settings.tsx
    └── Suppliers.tsx
```

---

> **ملاحظة هامة:** هذا الملف يحتوي على الملفات الأساسية للمشروع. بعض الملفات الكبيرة (مثل صفحات Branches, Inventory, Orders, Suppliers, Licenses, Payroll, Reports, Settings والمكونات الفرعية) لم يتم تضمينها بالكامل لتجنب حجم الملف الكبير. للحصول على الكود الكامل 100%، يُنصح بربط المشروع بـ GitHub.
