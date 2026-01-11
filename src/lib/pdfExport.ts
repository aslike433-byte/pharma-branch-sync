import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Branch, Employee, Supplier, License } from './database/types';

// Extend jsPDF type for autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ReportData {
  branches: Branch[];
  employees: Employee[];
  suppliers: Supplier[];
  licenses: License[];
  stats: {
    totalBranches: number;
    activeBranches: number;
    totalSuppliers: number;
    activeSuppliers: number;
    totalEmployees: number;
    totalSales: number;
  };
  selectedMonth: string;
  reportType: string;
}

const formatNumber = (num: number): string => {
  return num.toLocaleString('ar-EG');
};

const formatCurrency = (num: number): string => {
  return `${formatNumber(num)} ج.م`;
};

export const exportReportToPDF = (data: ReportData): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Add Arabic font support - use built-in fonts for simplicity
  doc.setFont('helvetica');
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let yPos = 20;

  // Helper function to add centered text
  const addCenteredText = (text: string, y: number, size: number = 12) => {
    doc.setFontSize(size);
    const textWidth = doc.getTextWidth(text);
    doc.text(text, (pageWidth - textWidth) / 2, y);
  };

  // Helper function to add right-aligned text (for Arabic)
  const addRightText = (text: string, y: number, size: number = 12) => {
    doc.setFontSize(size);
    doc.text(text, pageWidth - margin, y, { align: 'right' });
  };

  // Title
  doc.setFontSize(20);
  doc.setTextColor(0, 102, 153);
  addCenteredText('PharmaLife - Report', yPos);
  yPos += 10;

  // Subtitle with date
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  addCenteredText(`Period: ${data.selectedMonth}`, yPos);
  yPos += 5;
  addCenteredText(`Generated: ${new Date().toLocaleDateString('ar-EG')}`, yPos);
  yPos += 15;

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Report based on type
  if (data.reportType === 'overview' || data.reportType === 'all') {
    // Overview Section
    doc.setFontSize(16);
    doc.setTextColor(0, 102, 153);
    doc.text('Overview Statistics', margin, yPos);
    yPos += 10;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);

    const overviewData = [
      ['Total Branches', String(data.stats.totalBranches), 'Active Branches', String(data.stats.activeBranches)],
      ['Total Suppliers', String(data.stats.totalSuppliers), 'Active Suppliers', String(data.stats.activeSuppliers)],
      ['Total Employees', String(data.stats.totalEmployees), 'Total Sales', formatCurrency(data.stats.totalSales)],
    ];

    doc.autoTable({
      startY: yPos,
      head: [],
      body: overviewData,
      theme: 'grid',
      styles: { 
        fontSize: 10,
        cellPadding: 5,
        halign: 'center'
      },
      columnStyles: {
        0: { fillColor: [240, 248, 255], fontStyle: 'bold' },
        2: { fillColor: [240, 248, 255], fontStyle: 'bold' }
      },
      margin: { left: margin, right: margin }
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  if (data.reportType === 'branches' || data.reportType === 'all') {
    // Branches Section
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(16);
    doc.setTextColor(0, 102, 153);
    doc.text('Branches Report', margin, yPos);
    yPos += 10;

    const branchesData = data.branches
      .sort((a, b) => b.monthlySales - a.monthlySales)
      .map((branch, index) => [
        String(index + 1),
        branch.name,
        branch.manager,
        String(branch.employeesCount),
        formatCurrency(branch.monthlySales),
        branch.status === 'active' ? 'Active' : 'Inactive'
      ]);

    doc.autoTable({
      startY: yPos,
      head: [['#', 'Branch Name', 'Manager', 'Employees', 'Monthly Sales', 'Status']],
      body: branchesData,
      theme: 'striped',
      headStyles: { 
        fillColor: [0, 102, 153],
        fontSize: 10,
        fontStyle: 'bold'
      },
      styles: { 
        fontSize: 9,
        cellPadding: 4
      },
      margin: { left: margin, right: margin }
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  if (data.reportType === 'employees' || data.reportType === 'all') {
    // Employees Section
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(16);
    doc.setTextColor(0, 102, 153);
    doc.text('Employees Report', margin, yPos);
    yPos += 10;

    const employeesData = data.employees
      .sort((a, b) => (b.salary + b.allowances - b.deductions) - (a.salary + a.allowances - a.deductions))
      .map((emp, index) => [
        String(index + 1),
        emp.name,
        emp.position,
        formatCurrency(emp.salary),
        formatCurrency(emp.allowances),
        formatCurrency(emp.deductions),
        formatCurrency(emp.salary + emp.allowances - emp.deductions)
      ]);

    doc.autoTable({
      startY: yPos,
      head: [['#', 'Name', 'Position', 'Salary', 'Allowances', 'Deductions', 'Net']],
      body: employeesData,
      theme: 'striped',
      headStyles: { 
        fillColor: [0, 102, 153],
        fontSize: 9,
        fontStyle: 'bold'
      },
      styles: { 
        fontSize: 8,
        cellPadding: 3
      },
      margin: { left: margin, right: margin }
    });

    // Summary
    yPos = (doc as any).lastAutoTable.finalY + 10;
    
    const totalSalary = data.employees.reduce((sum, e) => sum + e.salary, 0);
    const totalAllowances = data.employees.reduce((sum, e) => sum + e.allowances, 0);
    const totalDeductions = data.employees.reduce((sum, e) => sum + e.deductions, 0);
    const netTotal = totalSalary + totalAllowances - totalDeductions;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Salaries: ${formatCurrency(totalSalary)}`, margin, yPos);
    yPos += 6;
    doc.text(`Total Allowances: ${formatCurrency(totalAllowances)}`, margin, yPos);
    yPos += 6;
    doc.text(`Total Deductions: ${formatCurrency(totalDeductions)}`, margin, yPos);
    yPos += 6;
    doc.setFontSize(12);
    doc.setTextColor(0, 102, 153);
    doc.text(`Net Total: ${formatCurrency(netTotal)}`, margin, yPos);
    
    yPos += 15;
  }

  if (data.reportType === 'sales' || data.reportType === 'all') {
    // Sales Section
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(16);
    doc.setTextColor(0, 102, 153);
    doc.text('Sales Report', margin, yPos);
    yPos += 10;

    const totalSales = data.branches.reduce((sum, b) => sum + b.monthlySales, 0);
    
    const salesData = data.branches
      .sort((a, b) => b.monthlySales - a.monthlySales)
      .map((branch, index) => {
        const percentage = ((branch.monthlySales / totalSales) * 100).toFixed(1);
        return [
          String(index + 1),
          branch.name,
          formatCurrency(branch.monthlySales),
          `${percentage}%`
        ];
      });

    doc.autoTable({
      startY: yPos,
      head: [['#', 'Branch', 'Sales', 'Percentage']],
      body: salesData,
      theme: 'striped',
      headStyles: { 
        fillColor: [0, 102, 153],
        fontSize: 10,
        fontStyle: 'bold'
      },
      styles: { 
        fontSize: 9,
        cellPadding: 4
      },
      margin: { left: margin, right: margin }
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(14);
    doc.setTextColor(0, 102, 153);
    doc.text(`Total Sales: ${formatCurrency(totalSales)}`, margin, yPos);
  }

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount} - PharmaLife Management System`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  const fileName = `PharmaLife_Report_${data.reportType}_${data.selectedMonth}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
