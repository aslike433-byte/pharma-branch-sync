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
  month: string; // YYYY-MM
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

export interface DatabaseSchema {
  branches: Branch[];
  suppliers: Supplier[];
  licenses: License[];
  employees: Employee[];
  expenses: Expense[];
  sales: Sale[];
  users: User[];
  settings: Record<string, any>;
}

export interface BackupData {
  version: string;
  createdAt: string;
  data: DatabaseSchema;
}
