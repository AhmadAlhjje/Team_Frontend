# Team Platform — Website

الموقع العام للفريق: **Next.js 16 (App Router) + React 19 + Tailwind CSS 4**.
صفحات مولّدة مسبقاً (Static/ISR) تُحدَّث فوراً عند تعديل المحتوى من لوحة التحكم.

> قبل أي تعديل اقرأ [`ROLE.md`](./ROLE.md).

|             |                                          |
| ----------- | ---------------------------------------- |
| Development | `http://localhost:3000`                  |
| يحتاج       | Backend API يعمل (`NEXT_PUBLIC_API_URL`) |
| Node.js     | 20.9+                                    |

## التشغيل (Development)

```bash
npm install
cp .env.example .env.local
#   NEXT_PUBLIC_API_URL=http://localhost:4000
#   NEXT_PUBLIC_SITE_URL=http://localhost:3000
#   REVALIDATE_SECRET=<نفس قيمة الـ backend>
npm run dev
```

للحصول على محتوى للمعاينة شغّل في الـ backend: `npm run db:seed && npm run db:seed:demo`.

## البناء و Production

```bash
npm ci
npm run build      # الـ API يجب أن يكون متاحاً لتوليد الصفحات بمحتواها
npm start          # PORT=3000 افتراضياً
```

إذا لم يكن الـ API متاحاً أثناء البناء، ينجح البناء بصفحات فارغة المحتوى وتُحدَّث تلقائياً عند أول revalidation.

## الأوامر

| الأمر               | الوظيفة                             |
| ------------------- | ----------------------------------- |
| `npm run dev`       | خادم التطوير (Turbopack) على 3000   |
| `npm run build`     | بناء Production                     |
| `npm start`         | تشغيل البناء (`PORT` لتغيير المنفذ) |
| `npm run lint`      | ESLint                              |
| `npm run typecheck` | توليد أنواع الـ routes + TypeScript |
| `npm test`          | Vitest                              |
| `npm run format`    | Prettier                            |

## متغيرات البيئة

| المتغير                      | إلزامي  | الوصف                                              |
| ---------------------------- | ------- | -------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`        | ✅      | رابط الـ API العام (نموذج التواصل + الصور)         |
| `NEXT_PUBLIC_SITE_URL`       | ✅      | رابط الموقع (canonical، sitemap، OG)               |
| `REVALIDATE_SECRET`          | موصى به | يطابق الـ backend؛ يفعّل التحديث الفوري            |
| `API_INTERNAL_URL`           |         | رابط داخلي للـ API عند تشاركهما الشبكة             |
| `CONTENT_REVALIDATE_SECONDS` |         | إعادة التحقق الاحتياطية (افتراضياً 3600)           |
| `NEXT_PUBLIC_IMAGE_ORIGINS`  |         | مصادر صور إضافية للتحسين (CDN)                     |
| `NEXT_PUBLIC_ALLOW_INDEXING` |         | `false` على staging                                |
| `NEXT_PUBLIC_SITE_NAME`      |         | اسم احتياطي إذا تعذر الوصول للـ API أثناء البناء   |
| `IMAGES_ALLOW_LOCAL_IP`      |         | تحسين صور من IP خاص في Production (شبكات خاصة فقط) |

`NEXT_PUBLIC_*` تُدمج وقت البناء: أعد البناء بعد تغييرها.

## الصفحات

`/` · `/about` · `/team` · `/services` · `/projects` · `/projects/[slug]` · `/achievements` · `/contact` · `/sitemap.xml` · `/robots.txt`

## التوثيق

| الملف                                            | المحتوى                                          |
| ------------------------------------------------ | ------------------------------------------------ |
| [`ROLE.md`](./ROLE.md)                           | القواعد والمعمارية                               |
| [`docs/architecture.md`](./docs/architecture.md) | التوجيه، جلب البيانات، الـ cache والتحديث الفوري |
| [`docs/seo.md`](./docs/seo.md)                   | Metadata، sitemap، JSON-LD، قائمة فحص            |
| [`docs/performance.md`](./docs/performance.md)   | قرارات الأداء ونتائج Lighthouse                  |
| [`docs/design-system.md`](./docs/design-system.md) | الهوية البصرية: الشعار، الألوان، الخط، المكونات، الحركة |
| [`docs/i18n.md`](./docs/i18n.md)                 | تفعيل الإنجليزية وترجمة المحتوى                  |
| [`docs/deployment.md`](./docs/deployment.md)     | Vercel و VPS                                     |

## حل المشاكل

| المشكلة                                                          | الحل                                                                                                                |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `Missing required environment variable NEXT_PUBLIC_…` عند البناء | أضف المتغير (إلزامي في Production)                                                                                  |
| الصفحات فارغة بعد البناء                                         | الـ API لم يكن متاحاً أثناء البناء؛ تأكد من `API_INTERNAL_URL`/`NEXT_PUBLIC_API_URL` ثم أعد البناء أو انتظر التحديث |
| التعديلات لا تظهر فوراً                                          | `REVALIDATE_SECRET` مختلف بين الموقع والـ backend، أو `FRONTEND_REVALIDATE_URL` خاطئ                                |
| نموذج التواصل: خطأ اتصال                                         | أضف رابط الموقع إلى `CORS_ORIGINS` في الـ backend                                                                   |
| صور الـ API لا تظهر (400 من `/_next/image`)                      | الـ API على IP خاص: `IMAGES_ALLOW_LOCAL_IP=true` (شبكة خاصة فقط) أو استخدم نطاقاً عاماً                             |
| `Invalid src prop` لصورة                                         | لن يحدث مع `SmartImage`؛ لا تستخدم `next/image` مباشرة لروابط من الـ API                                            |
