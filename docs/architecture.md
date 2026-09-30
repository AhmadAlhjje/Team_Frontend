# Website architecture

## التوجيه واللغة

```text
المتصفح: /projects/wafeer
  → proxy.ts (resolveLocaleRoute)
      /projects/wafeer  → rewrite → /ar/projects/wafeer   (العربية بدون بادئة في الرابط)
      /ar/projects/...  → redirect 308 → /projects/...     (رابط واحد موحد)
      /en/...           → يُخدم مباشرة عند تفعيل الإنجليزية
  → app/[locale]/(website)/projects/[slug]/page.tsx
```

- `app/[locale]/layout.tsx` هو الـ root layout: يحدد `lang` و `dir` من `localeDefinitions`.
- `(website)` route group يضيف الـ Header والـ Footer؛ يسمح لاحقاً بأقسام بتصميم مختلف (landing pages) دون تكرار.
- الـ proxy لا يعمل على `/api`, `/_next`, الملفات الثابتة، sitemap، robots.

## جلب البيانات

```text
page.tsx (Server Component)
  → lib/api/content.ts   getProjects(), getProject(slug), getSiteSettings() …
  → lib/api/client.ts    fetch(API/api/v1/…, { next: { tags, revalidate } })
  → Next.js Data Cache
```

- الطلبات المتطابقة في نفس الـ render (مثل `getSiteSettings()` في الـ layout والصفحة و `generateMetadata`) تُنفَّذ مرة واحدة.
- مهلة 10 ثوانٍ لكل طلب.
- `ApiNotFoundError` في صفحة المشروع → `notFound()` → 404 حقيقي.

## الـ Cache والتحديث الفوري

| الطبقة             | المدة                               | الإبطال                        |
| ------------------ | ----------------------------------- | ------------------------------ |
| صفحات HTML (ISR)   | حتى أقل revalidate في الصفحة (ساعة) | عند إبطال أي tag تستخدمه       |
| Data cache (fetch) | `CONTENT_REVALIDATE_SECONDS`        | `revalidateTag` من الـ webhook |
| الصور المحسّنة     | 30 يوماً                            | أسماء الملفات فريدة            |

```text
Admin يعدّل مشروعاً → backend → POST /api/revalidate { tags: ['projects', …] }
   → revalidateTag('projects', { expire: 0 })
   → الزيارة التالية لأي صفحة تستخدم المشاريع تُولَّد من جديد، ثم تُخدم static
```

`app/api/revalidate/route.ts` يقبل فقط tags معروفة، ويقارن السر بزمن ثابت (`timingSafeEqual`).

## المكونات

| النوع         | المكان                         | القاعدة                                                             |
| ------------- | ------------------------------ | ------------------------------------------------------------------- |
| UI primitives | `components/ui`                | بلا بيانات ولا منطق                                                 |
| Layout        | `components/layout`            | `SiteNav` هو مكون العميل الوحيد في الـ layout                       |
| أقسام الصفحات | `components/home`، `projects`… | Server Components تأخذ البيانات كـ props وتخفي نفسها إذا كانت فارغة |
| مشتركة        | `components/shared`            | `SmartImage`, `RichText`, `JsonLd`, `Breadcrumbs`…                  |
| منطق          | `hooks/`, `lib/`               | خارج الـ UI (مثل `useContactForm`, `validateContact`)               |

## المحتوى الفارغ

كل قسم يُخفى إذا لم يوجد محتوى حقيقي (فريق، إنجازات، آراء، عملاء، إحصائيات بقيمة صفر). الصفحات المستقلة تعرض رسالة «قريباً» بدل صفحة فارغة. لا يوجد أي محتوى تجريبي في الكود.

## نموذج التواصل

```text
ContactForm (client) → useContactForm
  → validateContact() (فوري، رسائل عربية)
  → POST NEXT_PUBLIC_API_URL/api/v1/contact  { …, website: honeypot, elapsedMs }
  → 201 نجاح | 400 أخطاء حقول | 429 rate limit | network error
```

الطلب يذهب مباشرة من المتصفح إلى الـ API ليطبق الـ rate limit على IP الزائر الحقيقي.

## الأخطاء

| الحالة                           | الملف                                  | النتيجة                           |
| -------------------------------- | -------------------------------------- | --------------------------------- |
| رابط غير موجود                   | `[...rest]/page.tsx` → `not-found.tsx` | 404 داخل تصميم الموقع + `noindex` |
| مشروع غير منشور                  | `notFound()`                           | 404                               |
| خطأ أثناء render                 | `(website)/error.tsx`                  | رسالة + «حاول مجدداً» (`retry`)   |
| فشل الـ root layout              | `global-error.tsx`                     | صفحة مستقلة بسيطة                 |
| الـ API متوقف أثناء revalidation | —                                      | تبقى آخر نسخة سليمة               |
