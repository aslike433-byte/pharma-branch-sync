import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Branch, Employee, Supplier, License } from './database/types';

// @ts-ignore - no types available
import ArabicReshaper from 'arabic-reshaper';

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

// Process Arabic text: reshape connected letters + reverse for RTL
const ar = (text: string): string => {
  if (!text) return text;
  // Check if text contains Arabic characters
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  if (!hasArabic) return text;
  
  // Split text into Arabic and non-Arabic segments
  const segments = text.split(/(\s+)/);
  const processed = segments.map(segment => {
    if (/[\u0600-\u06FF]/.test(segment)) {
      return ArabicReshaper.convertArabic(segment);
    }
    return segment;
  });
  
  // Reverse the entire string for RTL display
  return processed.reverse().join('');
};

const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

const formatCurrency = (num: number): string => {
  return `${formatNumber(num)} ${ar('ج.م')}`;
};

const getMonthName = (monthValue: string): string => {
  const months: Record<string, string> = {
    '2024-01': 'يناير 2024',
    '2024-02': 'فبراير 2024',
    '2024-03': 'مارس 2024',
    '2024-04': 'أبريل 2024',
    '2024-05': 'مايو 2024',
    '2024-06': 'يونيو 2024',
    '2024-07': 'يوليو 2024',
    '2024-08': 'أغسطس 2024',
    '2024-09': 'سبتمبر 2024',
    '2024-10': 'أكتوبر 2024',
    '2024-11': 'نوفمبر 2024',
    '2024-12': 'ديسمبر 2024',
    '2023-12': 'ديسمبر 2023',
    '2023-11': 'نوفمبر 2023',
    '2025-01': 'يناير 2025',
  };
  return months[monthValue] || monthValue;
};

const getReportTypeName = (type: string): string => {
  const types: Record<string, string> = {
    'overview': 'نظرة عامة',
    'branches': 'الفروع',
    'employees': 'الموظفين',
    'sales': 'المبيعات',
    'licenses': 'التراخيص',
    'all': 'تقرير شامل',
  };
  return types[type] || type;
};

const getLicenseTypeName = (type: string): string => {
  const types: Record<string, string> = {
    'pharmacy': 'ترخيص صيدلية',
    'employee': 'ترخيص موظف',
    'maintenance': 'ترخيص صيانة',
    'health': 'ترخيص صحي',
  };
  return types[type] || type;
};

const getLicenseStatusName = (status: string): string => {
  const statuses: Record<string, string> = {
    'valid': 'سارية',
    'expiring': 'تنتهي قريباً',
    'expired': 'منتهية',
  };
  return statuses[status] || status;
};

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-GB');
  } catch {
    return dateString;
  }
};

// Load Arabic font from Google Fonts CDN
const loadArabicFont = async (): Promise<string> => {
  const fontUrl = 'https://fonts.gstatic.com/s/amiri/v27/J7aRnpd8CGxBHqUpvrIw74NL.ttf';
  const response = await fetch(fontUrl);
  const arrayBuffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
};

export const exportReportToPDF = async (data: ReportData): Promise<void> => {
  const fontBase64 = await loadArabicFont();

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Register Arabic font
  doc.addFileToVFS('Amiri-Regular.ttf', fontBase64);
  doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
  doc.setFont('Amiri');

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPos = 25;

  const addCenteredText = (text: string, y: number, size: number = 12) => {
    doc.setFontSize(size);
    doc.text(ar(text), pageWidth / 2, y, { align: 'center' });
  };

  // Header
  doc.setFillColor(47, 127, 51);
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('PharmaLife', pageWidth / 2, 18, { align: 'center' });

  doc.setFontSize(14);
  addCenteredText('نظام إدارة الصيدليات', 28);

  yPos = 45;

  // Report info box
  doc.setDrawColor(47, 127, 51);
  doc.setFillColor(240, 248, 240);
  doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 25, 3, 3, 'FD');

  doc.setTextColor(47, 127, 51);
  doc.setFontSize(11);

  doc.text(ar(`نوع التقرير: ${getReportTypeName(data.reportType)}`), pageWidth - margin - 5, yPos + 10, { align: 'right' });
  doc.text(ar(`الفترة: ${getMonthName(data.selectedMonth)}`), pageWidth / 2, yPos + 10, { align: 'center' });
  doc.text(new Date().toLocaleDateString('en-GB'), margin + 5, yPos + 10);

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(ar(`تم الإنشاء: ${new Date().toLocaleString('en-GB')}`), pageWidth - margin - 5, yPos + 18, { align: 'right' });

  yPos = 80;
  doc.setTextColor(0, 0, 0);

  // Common table styles with Arabic font
  const tableStyles = {
    fontSize: 9,
    cellPadding: 4,
    overflow: 'linebreak' as const,
    halign: 'right' as const,
    font: 'Amiri',
    fontStyle: 'normal' as const,
  };

  const headStyles = {
    fillColor: [47, 127, 51] as [number, number, number],
    textColor: [255, 255, 255] as [number, number, number],
    fontSize: 10,
    fontStyle: 'normal' as const,
    halign: 'right' as const,
    font: 'Amiri',
  };

  // Overview Report
  if (data.reportType === 'overview' || data.reportType === 'all') {
    doc.setFontSize(16);
    doc.setTextColor(47, 127, 51);
    doc.text(ar('إحصائيات عامة'), pageWidth - margin, yPos, { align: 'right' });
    yPos += 8;

    const overviewData = [
      [String(data.stats.activeBranches), ar('الفروع النشطة'), String(data.stats.totalBranches), ar('إجمالي الفروع')],
      [String(data.stats.activeSuppliers), ar('الموردين النشطين'), String(data.stats.totalSuppliers), ar('إجمالي الموردين')],
      [formatCurrency(data.stats.totalSales), ar('إجمالي المبيعات'), String(data.stats.totalEmployees), ar('إجمالي الموظفين')],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [],
      body: overviewData,
      theme: 'grid',
      styles: { ...tableStyles, halign: 'center' },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { fillColor: [240, 248, 240], fontStyle: 'normal', cellWidth: 45 },
        2: { cellWidth: 55 },
        3: { fillColor: [240, 248, 240], fontStyle: 'normal', cellWidth: 45 },
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
      doc.setTextColor(47, 127, 51);
      doc.text(ar('حالة التراخيص'), pageWidth - margin, yPos, { align: 'right' });
      yPos += 8;

      autoTable(doc, {
        startY: yPos,
        head: [[ar('النسبة'), ar('العدد'), ar('الحالة')]],
        body: [
          [`${((validLicenses / data.licenses.length) * 100).toFixed(1)}%`, String(validLicenses), ar('سارية')],
          [`${((expiringLicenses / data.licenses.length) * 100).toFixed(1)}%`, String(expiringLicenses), ar('تنتهي قريباً')],
          [`${((expiredLicenses / data.licenses.length) * 100).toFixed(1)}%`, String(expiredLicenses), ar('منتهية')],
        ],
        theme: 'striped',
        headStyles,
        styles: tableStyles,
        margin: { left: margin, right: margin },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 40 },
          2: { cellWidth: 60 },
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
    doc.setTextColor(47, 127, 51);
    doc.text(ar('تقرير الفروع'), pageWidth - margin, yPos, { align: 'right' });
    yPos += 8;

    const branchesData = data.branches
      .sort((a, b) => b.monthlySales - a.monthlySales)
      .map((branch, index) => [
        ar(branch.status === 'active' ? 'نشط' : 'غير نشط'),
        formatCurrency(branch.monthlySales),
        String(branch.employeesCount),
        ar(branch.manager),
        ar(branch.name),
        String(index + 1),
      ]);

    autoTable(doc, {
      startY: yPos,
      head: [[ar('الحالة'), ar('المبيعات الشهرية'), ar('الموظفين'), ar('المدير'), ar('اسم الفرع'), '#']],
      body: branchesData,
      theme: 'striped',
      headStyles,
      styles: tableStyles,
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 40 },
        2: { cellWidth: 20 },
        3: { cellWidth: 35 },
        4: { cellWidth: 40 },
        5: { cellWidth: 10 },
      },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    const totalEmployees = data.branches.reduce((sum, b) => sum + b.employeesCount, 0);
    const avgEmployees = data.branches.length > 0 ? (totalEmployees / data.branches.length).toFixed(1) : '0';
    const totalBranchSales = data.branches.reduce((sum, b) => sum + b.monthlySales, 0);

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(ar(`إجمالي الموظفين: ${totalEmployees}`), pageWidth - margin, yPos, { align: 'right' });
    doc.text(ar(`المتوسط لكل فرع: ${avgEmployees}`), pageWidth - margin - 70, yPos, { align: 'right' });
    yPos += 6;
    doc.setTextColor(47, 127, 51);
    doc.setFontSize(12);
    doc.text(ar(`إجمالي المبيعات: ${formatCurrency(totalBranchSales)}`), pageWidth - margin, yPos, { align: 'right' });

    yPos += 15;
  }

  // Employees Report
  if (data.reportType === 'employees' || data.reportType === 'all') {
    if (yPos > 180) {
      doc.addPage();
      yPos = 25;
    }

    doc.setFontSize(16);
    doc.setTextColor(47, 127, 51);
    doc.text(ar('تقرير الموظفين'), pageWidth - margin, yPos, { align: 'right' });
    yPos += 8;

    const employeesData = data.employees
      .sort((a, b) => (b.salary + b.allowances - b.deductions) - (a.salary + a.allowances - a.deductions))
      .map((emp, index) => [
        formatCurrency(emp.salary + emp.allowances - emp.deductions),
        formatCurrency(emp.deductions),
        formatCurrency(emp.allowances),
        formatCurrency(emp.salary),
        ar(emp.position),
        ar(emp.name),
        String(index + 1),
      ]);

    autoTable(doc, {
      startY: yPos,
      head: [[ar('الصافي'), ar('الخصومات'), ar('البدلات'), ar('الراتب'), ar('المنصب'), ar('الاسم'), '#']],
      body: employeesData,
      theme: 'striped',
      headStyles: { ...headStyles, fontSize: 9 },
      styles: { ...tableStyles, fontSize: 8 },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 28 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 28 },
        4: { cellWidth: 28 },
        5: { cellWidth: 30 },
        6: { cellWidth: 8 },
      },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    const totalSalary = data.employees.reduce((sum, e) => sum + e.salary, 0);
    const totalAllowances = data.employees.reduce((sum, e) => sum + e.allowances, 0);
    const totalDeductions = data.employees.reduce((sum, e) => sum + e.deductions, 0);
    const netTotal = totalSalary + totalAllowances - totalDeductions;

    doc.setFillColor(245, 245, 245);
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 35, 3, 3, 'F');

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    yPos += 8;
    doc.text(ar(`إجمالي الرواتب: ${formatCurrency(totalSalary)}`), pageWidth - margin - 5, yPos, { align: 'right' });
    doc.text(ar(`إجمالي البدلات: ${formatCurrency(totalAllowances)}`), pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
    doc.text(ar(`إجمالي الخصومات: ${formatCurrency(totalDeductions)}`), pageWidth - margin - 5, yPos, { align: 'right' });
    yPos += 10;
    doc.setFontSize(13);
    doc.setTextColor(47, 127, 51);
    doc.text(ar(`صافي الرواتب: ${formatCurrency(netTotal)}`), pageWidth / 2, yPos, { align: 'center' });

    yPos += 20;
  }

  // Sales Report
  if (data.reportType === 'sales' || data.reportType === 'all') {
    if (yPos > 200) {
      doc.addPage();
      yPos = 25;
    }

    doc.setFontSize(16);
    doc.setTextColor(47, 127, 51);
    doc.text(ar('تقرير المبيعات'), pageWidth - margin, yPos, { align: 'right' });
    yPos += 8;

    const totalSales = data.branches.reduce((sum, b) => sum + b.monthlySales, 0);

    const salesData = data.branches
      .sort((a, b) => b.monthlySales - a.monthlySales)
      .map((branch, index) => {
        const percentage = totalSales > 0 ? ((branch.monthlySales / totalSales) * 100).toFixed(1) : '0';
        return [
          `${percentage}%`,
          formatCurrency(branch.monthlySales),
          ar(branch.name),
          String(index + 1),
        ];
      });

    autoTable(doc, {
      startY: yPos,
      head: [[ar('النسبة'), ar('المبيعات'), ar('الفرع'), '#']],
      body: salesData,
      theme: 'striped',
      headStyles,
      styles: tableStyles,
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 50 },
        2: { cellWidth: 60 },
        3: { cellWidth: 15 },
      },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    doc.setFillColor(47, 127, 51);
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 20, 3, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(ar(`إجمالي المبيعات: ${formatCurrency(totalSales)}`), pageWidth / 2, yPos + 13, { align: 'center' });
  }

  // Licenses Report
  if (data.reportType === 'licenses' || data.reportType === 'all') {
    if (yPos > 180) {
      doc.addPage();
      yPos = 25;
    }

    doc.setFontSize(16);
    doc.setTextColor(47, 127, 51);
    doc.text(ar('تقرير التراخيص'), pageWidth - margin, yPos, { align: 'right' });
    yPos += 8;

    const branchMap = new Map(data.branches.map(b => [b.id, b.name]));

    const licensesData = data.licenses
      .sort((a, b) => {
        const statusOrder = { 'expired': 0, 'expiring': 1, 'valid': 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      })
      .map((license, index) => [
        ar(getLicenseStatusName(license.status)),
        formatDate(license.expiryDate),
        ar(branchMap.get(license.branchId) || 'غير محدد'),
        license.licenseNumber,
        ar(getLicenseTypeName(license.type)),
        ar(license.name),
        String(index + 1),
      ]);

    autoTable(doc, {
      startY: yPos,
      head: [[ar('الحالة'), ar('تاريخ الانتهاء'), ar('الفرع'), ar('الرقم'), ar('النوع'), ar('اسم الترخيص'), '#']],
      body: licensesData,
      theme: 'striped',
      headStyles: { ...headStyles, fontSize: 8 },
      styles: { ...tableStyles, fontSize: 7 },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 22 },
        1: { cellWidth: 22 },
        2: { cellWidth: 28 },
        3: { cellWidth: 22 },
        4: { cellWidth: 28 },
        5: { cellWidth: 30 },
        6: { cellWidth: 8 },
      },
      didParseCell: (cellData) => {
        if (cellData.column.index === 0 && cellData.section === 'body') {
          const status = cellData.cell.raw as string;
          if (status === ar('سارية')) {
            cellData.cell.styles.textColor = [34, 139, 34];
          } else if (status === ar('تنتهي قريباً')) {
            cellData.cell.styles.textColor = [255, 140, 0];
          } else if (status === ar('منتهية')) {
            cellData.cell.styles.textColor = [220, 20, 60];
          }
        }
      },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    const validLicenses = data.licenses.filter(l => l.status === 'valid').length;
    const expiringLicenses = data.licenses.filter(l => l.status === 'expiring').length;
    const expiredLicenses = data.licenses.filter(l => l.status === 'expired').length;

    doc.setFillColor(245, 245, 245);
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 40, 3, 3, 'F');

    doc.setFontSize(12);
    doc.setTextColor(47, 127, 51);
    yPos += 10;
    doc.text(ar('ملخص التراخيص'), pageWidth - margin - 5, yPos, { align: 'right' });

    yPos += 10;
    doc.setFontSize(10);

    doc.setTextColor(34, 139, 34);
    doc.text(ar(`سارية: ${validLicenses}`), pageWidth - margin - 10, yPos, { align: 'right' });

    doc.setTextColor(255, 140, 0);
    doc.text(ar(`تنتهي قريباً: ${expiringLicenses}`), pageWidth / 2, yPos, { align: 'center' });

    doc.setTextColor(220, 20, 60);
    doc.text(ar(`منتهية: ${expiredLicenses}`), margin + 30, yPos);

    yPos += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(ar(`إجمالي التراخيص: ${data.licenses.length}`), pageWidth - margin - 10, yPos, { align: 'right' });
  }

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      ar(`صفحة ${i} من ${pageCount}`),
      pageWidth - margin,
      pageHeight - 8,
      { align: 'right' }
    );
    doc.text(
      ar('نظام إدارة الصيدليات') + ' - PharmaLife',
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
    doc.text(
      new Date().toLocaleDateString('en-GB'),
      margin,
      pageHeight - 8
    );
  }

  const reportName = getReportTypeName(data.reportType);
  const fileName = `PharmaLife_${reportName}_${data.selectedMonth}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
