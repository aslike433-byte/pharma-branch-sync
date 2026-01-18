# دليل إعداد المشروع للتطوير المحلي

## المتطلبات الأساسية

### 1. تثبيت Node.js
قم بتثبيت Node.js (الإصدار 18 أو أحدث):
- **Windows/Mac**: حمّل من [nodejs.org](https://nodejs.org/)
- **باستخدام nvm** (موصى به):
```bash
# تثبيت nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# تثبيت Node.js
nvm install 18
nvm use 18
```

### 2. التحقق من التثبيت
```bash
node --version  # يجب أن يظهر v18.x.x أو أحدث
npm --version   # يجب أن يظهر 9.x.x أو أحدث
```

---

## خطوات الإعداد

### الخطوة 1: استنساخ المستودع
```bash
# استنساخ المشروع من GitHub
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# الدخول لمجلد المشروع
cd YOUR_REPO_NAME
```

### الخطوة 2: تثبيت المكتبات
```bash
npm install
```

### الخطوة 3: تشغيل المشروع
```bash
npm run dev
```

سيعمل المشروع على: **http://localhost:8080**

---

## هيكل المشروع

```
├── public/                 # الملفات الثابتة
│   ├── favicon.ico
│   └── placeholder.svg
│
├── src/
│   ├── components/         # المكونات
│   │   ├── ui/            # مكونات shadcn/ui
│   │   ├── layout/        # Header, BottomNavigation
│   │   ├── dashboard/     # مكونات لوحة التحكم
│   │   ├── modals/        # النوافذ المنبثقة
│   │   ├── charts/        # الرسوم البيانية
│   │   └── alerts/        # نظام التنبيهات
│   │
│   ├── pages/             # صفحات التطبيق
│   │   ├── Dashboard.tsx  # لوحة التحكم
│   │   ├── Inventory.tsx  # المخزون
│   │   ├── Orders.tsx     # الطلبات
│   │   ├── Suppliers.tsx  # الموردين
│   │   ├── Branches.tsx   # الفروع
│   │   ├── Licenses.tsx   # التراخيص
│   │   ├── Payroll.tsx    # الرواتب
│   │   ├── Reports.tsx    # التقارير
│   │   ├── Settings.tsx   # الإعدادات
│   │   └── Login.tsx      # تسجيل الدخول
│   │
│   ├── hooks/             # React Hooks
│   │   ├── useDatabase.ts # إدارة قاعدة البيانات
│   │   ├── useLicenseAlerts.ts # تنبيهات التراخيص
│   │   └── useTheme.ts    # إدارة السمة
│   │
│   ├── lib/               # المكتبات والأدوات
│   │   ├── database/      # نظام قاعدة البيانات
│   │   ├── pdfExport.ts   # تصدير PDF
│   │   ├── projectExport.ts # تصدير ZIP
│   │   └── utils.ts       # أدوات مساعدة
│   │
│   ├── App.tsx            # المكون الرئيسي
│   ├── main.tsx           # نقطة الدخول
│   └── index.css          # الأنماط العامة
│
├── index.html             # صفحة HTML الرئيسية
├── vite.config.ts         # إعدادات Vite
├── tailwind.config.ts     # إعدادات Tailwind
├── tsconfig.json          # إعدادات TypeScript
└── package.json           # المكتبات والسكريبتات
```

---

## الأوامر المتاحة

| الأمر | الوصف |
|-------|-------|
| `npm run dev` | تشغيل خادم التطوير |
| `npm run build` | بناء المشروع للإنتاج |
| `npm run preview` | معاينة نسخة الإنتاج |
| `npm run lint` | فحص الكود |

---

## التقنيات المستخدمة

| التقنية | الوصف |
|---------|-------|
| **React 18** | مكتبة واجهات المستخدم |
| **TypeScript** | لغة البرمجة |
| **Vite** | أداة البناء والتطوير |
| **Tailwind CSS** | إطار التنسيق |
| **shadcn/ui** | مكونات UI جاهزة |
| **React Router** | التوجيه بين الصفحات |
| **Recharts** | الرسوم البيانية |
| **React Query** | إدارة حالة البيانات |
| **Lucide Icons** | الأيقونات |

---

## تخزين البيانات

يستخدم التطبيق **localStorage** لتخزين البيانات محلياً:

- `pharma_products` - المنتجات
- `pharma_suppliers` - الموردين
- `pharma_orders` - الطلبات
- `pharma_branches` - الفروع
- `pharma_employees` - الموظفين
- `pharma_licenses` - التراخيص

### تصدير البيانات
يمكنك تصدير البيانات من صفحة الإعدادات:
- **تصدير JSON**: نسخة احتياطية من البيانات
- **تصدير ZIP**: المشروع كاملاً مع البيانات

### استيراد البيانات
لاستيراد بيانات من نسخة احتياطية:
1. افتح Developer Tools (F12)
2. اذهب إلى Console
3. نفذ:
```javascript
localStorage.setItem('pharma_products', JSON.stringify(yourData));
```

---

## حل المشاكل الشائعة

### المشكلة: خطأ عند تثبيت المكتبات
```bash
# احذف node_modules وأعد التثبيت
rm -rf node_modules package-lock.json
npm install
```

### المشكلة: المنفذ 8080 مستخدم
```bash
# غيّر المنفذ في vite.config.ts أو استخدم
npm run dev -- --port 3000
```

### المشكلة: البيانات لا تظهر
- تأكد من أن localStorage يعمل في المتصفح
- جرب إضافة بيانات تجريبية من واجهة التطبيق

---

## نصائح للتطوير

1. **استخدم VS Code** مع الإضافات:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript Vue Plugin (Volar)

2. **React DevTools**: لتتبع حالة المكونات

3. **تفعيل Hot Reload**: يعمل تلقائياً مع Vite

---

## المساهمة

1. أنشئ فرع جديد: `git checkout -b feature/my-feature`
2. نفذ تغييراتك
3. أرسل commit: `git commit -m 'Add my feature'`
4. ادفع للفرع: `git push origin feature/my-feature`
5. افتح Pull Request

---

## الدعم

للمساعدة أو الاستفسارات، يمكنك:
- فتح Issue في GitHub
- التواصل عبر Lovable

---

**تم إنشاء هذا الدليل بواسطة Lovable** ✨
