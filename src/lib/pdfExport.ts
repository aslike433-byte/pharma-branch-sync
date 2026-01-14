import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Branch, Employee, Supplier, License } from './database/types';

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

const getMonthName = (monthValue: string): string => {
  const months: Record<string, string> = {
    '2024-01': 'يناير 2024',
    '2024-02': 'فبراير 2024',
    '2024-03': 'مارس 2024',
    '2023-12': 'ديسمبر 2023',
    '2023-11': 'نوفمبر 2023',
  };
  return months[monthValue] || monthValue;
};

const getReportTypeName = (type: string): string => {
  const types: Record<string, string> = {
    'overview': 'نظرة عامة',
    'branches': 'الفروع',
    'employees': 'الموظفين',
    'sales': 'المبيعات',
    'all': 'تقرير شامل',
  };
  return types[type] || type;
};

// Load Amiri Arabic font from CDN
const loadArabicFont = async (): Promise<string> => {
  const fontUrl = 'https://cdn.jsdelivr.net/npm/@fontsource/amiri@5.0.17/files/amiri-arabic-400-normal.woff';
  
  try {
    const response = await fetch(fontUrl);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to load Arabic font:', error);
    throw error;
  }
};

export const exportReportToPDF = async (data: ReportData): Promise<void> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Try to load Arabic font
  let useArabicFont = false;
  try {
    const fontBase64 = await loadArabicFont();
    doc.addFileToVFS('Amiri-Regular.ttf', fontBase64);
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    doc.setFont('Amiri');
    useArabicFont = true;
  } catch (error) {
    console.warn('Could not load Arabic font, using default font');
    doc.setFont('helvetica');
  }

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPos = 25;

  // Helper function to reverse Arabic text for RTL display
  const reverseArabic = (text: string): string => {
    if (!useArabicFont) return text;
    // Split by spaces, reverse word order for RTL
    return text.split(' ').reverse().join(' ');
  };

  // Helper function to add right-aligned text (for Arabic RTL)
  const addRightText = (text: string, y: number, size: number = 12) => {
    doc.setFontSize(size);
    doc.text(text, pageWidth - margin, y, { align: 'right' });
  };

  // Helper function to add centered text
  const addCenteredText = (text: string, y: number, size: number = 12) => {
    doc.setFontSize(size);
    doc.text(text, pageWidth / 2, y, { align: 'center' });
  };

  // Header with logo area and title
  doc.setFillColor(0, 102, 153);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  addCenteredText('PharmaLife', 18);
  
  doc.setFontSize(14);
  addCenteredText('Pharmacy Management System', 28);
  
  yPos = 45;

  // Report info box
  doc.setDrawColor(0, 102, 153);
  doc.setFillColor(240, 248, 255);
  doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 25, 3, 3, 'FD');
  
  doc.setTextColor(0, 102, 153);
  doc.setFontSize(12);
  
  // Report type and period
  const reportTypeLabel = `Report Type: ${getReportTypeName(data.reportType)}`;
  const periodLabel = `Period: ${getMonthName(data.selectedMonth)}`;
  const dateLabel = `Date: ${new Date().toLocaleDateString('en-GB')}`;
  
  doc.text(reportTypeLabel, margin + 5, yPos + 10);
  doc.text(periodLabel, pageWidth / 2, yPos + 10, { align: 'center' });
  doc.text(dateLabel, pageWidth - margin - 5, yPos + 10, { align: 'right' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleString('en-GB')}`, margin + 5, yPos + 18);
  
  yPos = 80;
  doc.setTextColor(0, 0, 0);

  // Common table styles
  const tableStyles = {
    fontSize: 9,
    cellPadding: 4,
    overflow: 'linebreak' as const,
    halign: 'center' as const,
  };

  const headStyles = {
    fillColor: [0, 102, 153] as [number, number, number],
    textColor: [255, 255, 255] as [number, number, number],
    fontSize: 10,
    fontStyle: 'bold' as const,
    halign: 'center' as const,
  };

  // Overview Report
  if (data.reportType === 'overview' || data.reportType === 'all') {
    doc.setFontSize(16);
    doc.setTextColor(0, 102, 153);
    doc.text('Overview Statistics', margin, yPos);
    yPos += 8;

    const overviewData = [
      ['Total Branches', String(data.stats.totalBranches), 'Active Branches', String(data.stats.activeBranches)],
      ['Total Suppliers', String(data.stats.totalSuppliers), 'Active Suppliers', String(data.stats.activeSuppliers)],
      ['Total Employees', String(data.stats.totalEmployees), 'Total Sales', formatCurrency(data.stats.totalSales)],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [],
      body: overviewData,
      theme: 'grid',
      styles: { ...tableStyles, halign: 'center' },
      columnStyles: {
        0: { fillColor: [240, 248, 255], fontStyle: 'bold', cellWidth: 45 },
        1: { cellWidth: 35 },
        2: { fillColor: [240, 248, 255], fontStyle: 'bold', cellWidth: 45 },
        3: { cellWidth: 55 },
      },
      margin: { left: margin, right: margin },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // License summary
    if (data.licenses.length > 0) {
      const validLicenses = data.licenses.filter(l => l.status === 'valid').length;
      const expiringLicenses = data.licenses.filter(l => l.status === 'expiring').length;
      const expiredLicenses = data.licenses.filter(l => l.status === 'expired').length;

      doc.setFontSize(14);
      doc.setTextColor(0, 102, 153);
      doc.text('License Status', margin, yPos);
      yPos += 8;

      autoTable(doc, {
        startY: yPos,
        head: [['Status', 'Count', 'Percentage']],
        body: [
          ['Valid', String(validLicenses), `${((validLicenses / data.licenses.length) * 100).toFixed(1)}%`],
          ['Expiring Soon', String(expiringLicenses), `${((expiringLicenses / data.licenses.length) * 100).toFixed(1)}%`],
          ['Expired', String(expiredLicenses), `${((expiredLicenses / data.licenses.length) * 100).toFixed(1)}%`],
        ],
        theme: 'striped',
        headStyles,
        styles: tableStyles,
        margin: { left: margin, right: margin },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 40 },
          2: { cellWidth: 40 },
        },
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;
    }
  }

  // Branches Report
  if (data.reportType === 'branches' || data.reportType === 'all') {
    if (yPos > 220) {
      doc.addPage();
      yPos = 25;
    }

    doc.setFontSize(16);
    doc.setTextColor(0, 102, 153);
    doc.text('Branches Report', margin, yPos);
    yPos += 8;

    const branchesData = data.branches
      .sort((a, b) => b.monthlySales - a.monthlySales)
      .map((branch, index) => [
        String(index + 1),
        branch.name,
        branch.manager,
        String(branch.employeesCount),
        formatCurrency(branch.monthlySales),
        branch.status === 'active' ? 'Active' : 'Inactive',
      ]);

    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Branch Name', 'Manager', 'Employees', 'Monthly Sales', 'Status']],
      body: branchesData,
      theme: 'striped',
      headStyles,
      styles: tableStyles,
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 40 },
        2: { cellWidth: 35 },
        3: { cellWidth: 25 },
        4: { cellWidth: 40 },
        5: { cellWidth: 25 },
      },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Branch summary
    const totalEmployees = data.branches.reduce((sum, b) => sum + b.employeesCount, 0);
    const avgEmployees = data.branches.length > 0 ? (totalEmployees / data.branches.length).toFixed(1) : 0;
    const totalBranchSales = data.branches.reduce((sum, b) => sum + b.monthlySales, 0);
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Employees: ${totalEmployees}`, margin, yPos);
    doc.text(`Average per Branch: ${avgEmployees}`, margin + 60, yPos);
    yPos += 6;
    doc.setTextColor(0, 102, 153);
    doc.setFontSize(12);
    doc.text(`Total Sales: ${formatCurrency(totalBranchSales)}`, margin, yPos);

    yPos += 15;
  }

  // Employees Report
  if (data.reportType === 'employees' || data.reportType === 'all') {
    if (yPos > 180) {
      doc.addPage();
      yPos = 25;
    }

    doc.setFontSize(16);
    doc.setTextColor(0, 102, 153);
    doc.text('Employees Report', margin, yPos);
    yPos += 8;

    const employeesData = data.employees
      .sort((a, b) => (b.salary + b.allowances - b.deductions) - (a.salary + a.allowances - a.deductions))
      .map((emp, index) => [
        String(index + 1),
        emp.name,
        emp.position,
        formatCurrency(emp.salary),
        formatCurrency(emp.allowances),
        formatCurrency(emp.deductions),
        formatCurrency(emp.salary + emp.allowances - emp.deductions),
      ]);

    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Name', 'Position', 'Salary', 'Allowances', 'Deductions', 'Net']],
      body: employeesData,
      theme: 'striped',
      headStyles: { ...headStyles, fontSize: 9 },
      styles: { ...tableStyles, fontSize: 8 },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 35 },
        2: { cellWidth: 30 },
        3: { cellWidth: 28 },
        4: { cellWidth: 28 },
        5: { cellWidth: 28 },
        6: { cellWidth: 28 },
      },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Salary summary
    const totalSalary = data.employees.reduce((sum, e) => sum + e.salary, 0);
    const totalAllowances = data.employees.reduce((sum, e) => sum + e.allowances, 0);
    const totalDeductions = data.employees.reduce((sum, e) => sum + e.deductions, 0);
    const netTotal = totalSalary + totalAllowances - totalDeductions;

    doc.setFillColor(245, 245, 245);
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 35, 3, 3, 'F');

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    yPos += 8;
    doc.text(`Total Salaries: ${formatCurrency(totalSalary)}`, margin + 5, yPos);
    doc.text(`Total Allowances: ${formatCurrency(totalAllowances)}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
    doc.text(`Total Deductions: ${formatCurrency(totalDeductions)}`, margin + 5, yPos);
    yPos += 10;
    doc.setFontSize(13);
    doc.setTextColor(0, 102, 153);
    doc.text(`Net Total: ${formatCurrency(netTotal)}`, pageWidth / 2, yPos, { align: 'center' });

    yPos += 20;
  }

  // Sales Report
  if (data.reportType === 'sales' || data.reportType === 'all') {
    if (yPos > 200) {
      doc.addPage();
      yPos = 25;
    }

    doc.setFontSize(16);
    doc.setTextColor(0, 102, 153);
    doc.text('Sales Report', margin, yPos);
    yPos += 8;

    const totalSales = data.branches.reduce((sum, b) => sum + b.monthlySales, 0);

    const salesData = data.branches
      .sort((a, b) => b.monthlySales - a.monthlySales)
      .map((branch, index) => {
        const percentage = totalSales > 0 ? ((branch.monthlySales / totalSales) * 100).toFixed(1) : '0';
        return [
          String(index + 1),
          branch.name,
          formatCurrency(branch.monthlySales),
          `${percentage}%`,
        ];
      });

    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Branch', 'Sales', 'Percentage']],
      body: salesData,
      theme: 'striped',
      headStyles,
      styles: tableStyles,
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 60 },
        2: { cellWidth: 50 },
        3: { cellWidth: 30 },
      },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Sales summary box
    doc.setFillColor(0, 102, 153);
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 20, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(`Total Sales: ${formatCurrency(totalSales)}`, pageWidth / 2, yPos + 13, { align: 'center' });
  }

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      margin,
      pageHeight - 8
    );
    doc.text(
      'PharmaLife Management System',
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
    doc.text(
      new Date().toLocaleDateString('en-GB'),
      pageWidth - margin,
      pageHeight - 8,
      { align: 'right' }
    );
  }

  // Save the PDF
  const fileName = `PharmaLife_${getReportTypeName(data.reportType)}_${data.selectedMonth}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
