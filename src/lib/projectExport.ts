import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// قائمة الملفات الأساسية للمشروع
const projectFiles = {
  // Configuration files
  'package.json': `{
  "name": "pharmalife-app",
  "private": true,
  "version": "1.0.4",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}`,
  'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})`,
  'tailwind.config.ts': `import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config`,
  'index.html': `<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PharmaLife - إدارة الصيدليات</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
};

export async function exportProjectAsZip() {
  const zip = new JSZip();

  // إضافة ملفات التكوين
  for (const [filename, content] of Object.entries(projectFiles)) {
    zip.file(filename, content);
  }

  // إنشاء مجلد src
  const srcFolder = zip.folder('src');
  
  // إضافة البيانات من localStorage
  const localStorageData = {
    products: JSON.parse(localStorage.getItem('pharmalife_products') || '[]'),
    suppliers: JSON.parse(localStorage.getItem('pharmalife_suppliers') || '[]'),
    orders: JSON.parse(localStorage.getItem('pharmalife_orders') || '[]'),
    branches: JSON.parse(localStorage.getItem('pharmalife_branches') || '[]'),
    employees: JSON.parse(localStorage.getItem('pharmalife_employees') || '[]'),
    licenses: JSON.parse(localStorage.getItem('pharmalife_licenses') || '[]'),
  };

  // إضافة ملف البيانات
  const dataFolder = zip.folder('data');
  dataFolder?.file('database-backup.json', JSON.stringify(localStorageData, null, 2));

  // إضافة ملف README
  zip.file('README.md', `# PharmaLife App

## نظام إدارة الصيدليات المتكامل

### المميزات:
- إدارة المخزون والمنتجات
- إدارة الموردين والطلبات
- إدارة الفروع والموظفين
- إدارة التراخيص والتنبيهات
- التقارير والإحصائيات
- النسخ الاحتياطي والاستعادة

### البيانات:
تم تصدير البيانات في مجلد \`data/database-backup.json\`

### التثبيت:
\`\`\`bash
npm install
npm run dev
\`\`\`

### الإصدار: 1.0.4
`);

  // إضافة معلومات التصدير
  const exportInfo = {
    exportDate: new Date().toISOString(),
    appVersion: '1.0.4',
    exportedBy: 'PharmaLife App',
    dataIncluded: Object.keys(localStorageData),
    totalProducts: localStorageData.products.length,
    totalSuppliers: localStorageData.suppliers.length,
    totalOrders: localStorageData.orders.length,
    totalBranches: localStorageData.branches.length,
    totalEmployees: localStorageData.employees.length,
    totalLicenses: localStorageData.licenses.length,
  };
  
  zip.file('export-info.json', JSON.stringify(exportInfo, null, 2));

  // إنشاء وتحميل الملف
  const content = await zip.generateAsync({ type: 'blob' });
  const date = new Date().toISOString().split('T')[0];
  saveAs(content, `pharmalife-project-${date}.zip`);

  return exportInfo;
}
