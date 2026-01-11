import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend,
} from "recharts";
import { Branch, Employee, License } from "@/lib/database/types";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--info))",
  "hsl(var(--destructive))",
  "hsl(var(--accent))",
];

interface BranchSalesChartProps {
  branches: Branch[];
}

export function BranchSalesChart({ branches }: BranchSalesChartProps) {
  const data = useMemo(() => {
    return branches
      .sort((a, b) => b.monthlySales - a.monthlySales)
      .slice(0, 6)
      .map((branch) => ({
        name: branch.name.replace("فرع ", ""),
        sales: branch.monthlySales / 1000,
      }));
  }, [branches]);

  return (
    <div className="pharma-card p-4">
      <h3 className="font-semibold mb-4">مبيعات الفروع (ألف ج.م)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fontSize: 11 }} 
              width={70}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                direction: "rtl",
              }}
              formatter={(value: number) => [`${value}K ج.م`, "المبيعات"]}
            />
            <Bar 
              dataKey="sales" 
              fill="hsl(var(--primary))" 
              radius={[0, 4, 4, 0]}
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface SalesDistributionChartProps {
  branches: Branch[];
}

export function SalesDistributionChart({ branches }: SalesDistributionChartProps) {
  const data = useMemo(() => {
    const totalSales = branches.reduce((sum, b) => sum + b.monthlySales, 0);
    return branches
      .sort((a, b) => b.monthlySales - a.monthlySales)
      .slice(0, 5)
      .map((branch) => ({
        name: branch.name.replace("فرع ", ""),
        value: branch.monthlySales,
        percentage: ((branch.monthlySales / totalSales) * 100).toFixed(1),
      }));
  }, [branches]);

  return (
    <div className="pharma-card p-4">
      <h3 className="font-semibold mb-4">توزيع المبيعات</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              label={({ name, percentage }) => `${name} (${percentage}%)`}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                direction: "rtl",
              }}
              formatter={(value: number) => [`${(value / 1000).toFixed(0)}K ج.م`, "المبيعات"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-1.5 text-xs">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface MonthlySalesTrendProps {
  currentSales: number;
}

export function MonthlySalesTrend({ currentSales }: MonthlySalesTrendProps) {
  const data = useMemo(() => {
    // Generate mock trend data for last 6 months
    const months = ["أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر", "يناير"];
    const baseValue = currentSales * 0.7;
    return months.map((month, index) => ({
      month,
      sales: Math.round((baseValue + (currentSales - baseValue) * (index / 5)) / 1000),
    }));
  }, [currentSales]);

  return (
    <div className="pharma-card p-4">
      <h3 className="font-semibold mb-4">اتجاه المبيعات (6 أشهر)</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                direction: "rtl",
              }}
              formatter={(value: number) => [`${value}K ج.م`, "المبيعات"]}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="hsl(var(--primary))"
              fill="url(#salesGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface EmployeeSalaryChartProps {
  employees: Employee[];
}

export function EmployeeSalaryChart({ employees }: EmployeeSalaryChartProps) {
  const data = useMemo(() => {
    const baseSalary = employees.reduce((sum, e) => sum + e.salary, 0);
    const allowances = employees.reduce((sum, e) => sum + e.allowances, 0);
    const deductions = employees.reduce((sum, e) => sum + e.deductions, 0);
    
    return [
      { name: "الرواتب الأساسية", value: baseSalary / 1000, fill: "hsl(var(--primary))" },
      { name: "البدلات", value: allowances / 1000, fill: "hsl(var(--success))" },
      { name: "الخصومات", value: deductions / 1000, fill: "hsl(var(--destructive))" },
    ];
  }, [employees]);

  return (
    <div className="pharma-card p-4">
      <h3 className="font-semibold mb-4">توزيع الرواتب (ألف ج.م)</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                direction: "rtl",
              }}
              formatter={(value: number) => [`${value.toFixed(1)}K ج.م`]}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface LicenseStatusChartProps {
  licenses: License[];
}

export function LicenseStatusChart({ licenses }: LicenseStatusChartProps) {
  const data = useMemo(() => {
    const valid = licenses.filter((l) => l.status === "valid").length;
    const expiring = licenses.filter((l) => l.status === "expiring").length;
    const expired = licenses.filter((l) => l.status === "expired").length;

    return [
      { name: "سارية", value: valid, fill: "hsl(var(--success))" },
      { name: "تنتهي قريباً", value: expiring, fill: "hsl(var(--warning))" },
      { name: "منتهية", value: expired, fill: "hsl(var(--destructive))" },
    ].filter((d) => d.value > 0);
  }, [licenses]);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="pharma-card p-4">
      <h3 className="font-semibold mb-4">حالة التراخيص</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                direction: "rtl",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex justify-center gap-4 mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 text-xs">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            <span>{item.name}: {item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface EmployeesByBranchChartProps {
  branches: Branch[];
}

export function EmployeesByBranchChart({ branches }: EmployeesByBranchChartProps) {
  const data = useMemo(() => {
    return branches
      .sort((a, b) => b.employeesCount - a.employeesCount)
      .slice(0, 6)
      .map((branch) => ({
        name: branch.name.replace("فرع ", ""),
        employees: branch.employeesCount,
      }));
  }, [branches]);

  return (
    <div className="pharma-card p-4">
      <h3 className="font-semibold mb-4">عدد الموظفين لكل فرع</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                direction: "rtl",
              }}
              formatter={(value: number) => [`${value} موظف`]}
            />
            <Bar 
              dataKey="employees" 
              fill="hsl(var(--info))" 
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
