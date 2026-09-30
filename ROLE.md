# ROLE.md — Frontend (الموقع العام)

> **قبل تعديل أي جزء من المشروع، اقرأ ROLE.md الخاص بهذا المشروع.**
>
> لا يجوز تغيير الـ Architecture بشكل عشوائي. إذا كان هناك سبب قوي لتغييرها:
> افهم النظام الحالي ← ادرس التأثير ← اختر الحل الأبسط ← حدّث ROLE.md والـ Documentation.

---

## 1. هدف المشروع

`frontend/` هو **الواجهة الرسمية للفريق** — الموقع العام فقط. هدفه أن يفهم الزائر بسرعة:
من نحن ← ماذا نقدم ← ماذا نفذنا ← من الفريق ← لماذا نثق بهم ← كيف أتواصل معهم،
وأن يتحول الزائر إلى شخص يتواصل معنا.

الأولويات بالترتيب: **السرعة ← تجربة المستخدم ← SEO ← سهولة الاستخدام ← Accessibility ← الأمان ← الصيانة ← التوسع ← الشكل.**

- لا يتصل بقاعدة البيانات أبداً. كل المحتوى من الـ Backend API (`/api/v1`).
- لا يحتوي محتوى قابلاً للتعديل مكتوباً في الكود: المشاريع، الفريق، الخدمات، الإنجازات، الآراء، الأسئلة، الإعدادات كلها من الـ API.
- ما يوجد في الكود هو **نصوص الواجهة** فقط (أزرار، عناوين أقسام) في قواميس `lib/i18n/dictionaries`.

## 2. التقنيات

Next.js 16 (App Router، Turbopack) · React 19 · TypeScript strict · Tailwind CSS 4 · ESLint · Prettier · Vitest.
بدون مكتبات UI أو state management أو animation: كل شيء Server Components + CSS.

> Next.js 16 مختلف عما في بيانات التدريب: اقرأ `node_modules/next/dist/docs/` قبل استخدام API جديد (مثلاً `proxy.ts` بدل middleware، `params` كـ Promise، `retry` في error.tsx، `preload` بدل `priority`).

## 3. هيكل المجلدات

```text
frontend/
├── app/
│   ├── [locale]/                     ← كل الصفحات تحت اللغة (RTL/LTR جاهز)
│   │   ├── layout.tsx                ← <html lang dir>، الخط، metadata الافتراضية، JSON-LD للمنظمة
│   │   └── (website)/
│   │       ├── layout.tsx            ← Header + <main> + Footer
│   │       ├── page.tsx              ← الصفحة الرئيسية
│   │       ├── about/ team/ services/ projects/ projects/[slug]/ achievements/ contact/
│   │       ├── [...rest]/page.tsx    ← أي رابط مجهول → 404 داخل تصميم الموقع
│   │       ├── not-found.tsx
│   │       └── error.tsx
│   ├── api/revalidate/route.ts       ← webhook يستدعيه الـ backend بعد تعديل المحتوى
│   ├── sitemap.ts  robots.ts  manifest.ts  icon.svg  global-error.tsx
├── proxy.ts                          ← توجيه اللغة: /projects ↔ /ar/projects
├── assets/fonts/    ← IBM Plex Sans Arabic (woff2) + OFL.txt — مستضاف محلياً
├── components/
│   ├── brand/       ← BrandMark (رمز الهوية)
│   ├── ui/          ← عناصر أساسية بلا منطق (Container, Section, Eyebrow, ButtonLink, Badge)
│   ├── layout/      ← Header (+ SiteNav client), Footer, Logo, SkipLink
│   ├── home/        ← أقسام الصفحة الرئيسية + HeroArt
│   ├── projects/ team/ services/ achievements/ contact/
│   ├── shared/      ← JsonLd, Breadcrumbs, RichText, SmartImage, FaqList, CtaSection…
│   └── icons/       ← أيقونات SVG inline (بدون مكتبة)
├── lib/
│   ├── api/         ← client.ts (fetch + cache tags) و content.ts (دوال لكل endpoint)
│   ├── seo/         ← metadata.ts, json-ld.ts, breadcrumbs.ts
│   ├── i18n/        ← config, routing, dictionaries (ar/en), error-messages
│   ├── constants/   ← env.ts, cache.ts, navigation.ts
│   ├── validation/  ← contact.ts
│   ├── fonts.ts     ← تعريف الخطوط المحلية (next/font/local)
│   └── utils/       ← format, rich-text, highlight, grid, images, logger, secret, cn
├── hooks/           ← use-contact-form.ts (منطق النموذج خارج الـ UI)
├── types/api.ts     ← عقد الـ API العام (مطابق لـ DTOs الـ backend)
├── styles/globals.css
└── docs/
```

## 4. قواعد Next.js

### Server Components أولاً

- **كل مكون Server Component افتراضياً.** `"use client"` فقط عند الحاجة الحقيقية لـ state أو أحداث المتصفح.
- مكونات العميل الحالية (عمداً قليلة): `SiteNav` (قائمة الموبايل + الرابط النشط)، `ContactForm`، `error.tsx`، `global-error.tsx`.
- مكون عميل يأخذ نصوصه كـ props من الخادم — لا تستورد القاموس داخل مكون عميل.
- لا تجلب البيانات في مكونات العميل. الجلب في الصفحات (server) ثم تمرير البيانات.

### جلب البيانات والـ Cache

- الصفحات تستدعي دوال `lib/api/content.ts` فقط — **لا `fetch` مباشرة في الصفحات**.
- كل طلب يحمل `next.tags` (مثل `projects`) و `next.revalidate` (افتراضياً ساعة كشبكة أمان).
- الـ backend يستدعي `POST /api/revalidate` بعد أي تعديل → `revalidateTag(tag, { expire: 0 })` → الزيارة التالية تحصل على المحتوى الجديد.
- النتيجة: كل الصفحات Static/ISR (`●` في `next build`)، و MySQL لا تُستدعى مع كل زيارة.
- `withBuildFallback`: إذا كان الـ API غير متاح **أثناء البناء** تُبنى الصفحة بمحتوى فارغ بدل فشل البناء. أثناء التشغيل يُرمى الخطأ فيحتفظ Next.js بآخر نسخة سليمة.
- عند إضافة نوع محتوى جديد: أضف tag إلى `CACHE_TAGS` هنا **و** إلى `CacheTag` في `backend/src/modules/revalidation`.

### لا `loading.tsx` في الموقع العام (قرار مقصود)

كل الصفحات مولّدة مسبقاً، لذا شاشة التحميل لا تظهر تقريباً. وجودها يجعل الصفحات المولّدة عند الطلب "streamed"، فتُرسل حالة `200` قبل `notFound()` ← **soft 404** يضر الـ SEO. تم قياس ذلك وإزالتها. لوحة التحكم تستخدم skeletons لأنها ديناميكية وبلا SEO.

## 5. الاتصال بالـ API

| الاستخدام                  | الرابط                                                           |
| -------------------------- | ---------------------------------------------------------------- |
| جلب المحتوى (على الخادم)   | `API_INTERNAL_URL` إن وُجد، وإلا `NEXT_PUBLIC_API_URL`           |
| نموذج التواصل (في المتصفح) | `NEXT_PUBLIC_API_URL/api/v1/contact` (مسموح في CORS الـ backend) |

الأنواع في `types/api.ts` يجب أن تطابق DTOs الـ backend العامة. أي تغيير في استجابة الـ API يُحدَّث هنا في نفس التغيير.

## 6. قواعد SEO

- كل صفحة تصدّر `generateMetadata` عبر `buildPageMetadata()` ← title + description + canonical + Open Graph + Twitter.
- الـ canonical بدون بادئة للعربية (`/projects/wafeer`). `/ar/...` يُحوَّل 308 إلى الرابط الموحد.
- صفحة المشروع: `seoTitle`/`seoDescription`/`ogImageUrl` من لوحة التحكم مع fallback للعنوان/الملخص/الغلاف.
- `h1` واحد لكل صفحة، ترتيب عناوين منطقي، HTML دلالي (`header/main/nav/article/section/aside/footer`).
- JSON-LD مناسب للمحتوى فقط: Organization + WebSite (كل الصفحات)، BreadcrumbList (الصفحات الداخلية)، Person (الفريق)، CreativeWork (المشروع).
- `sitemap.xml` ديناميكي (الصفحات + كل مشروع منشور مع `lastModified`)، `robots.txt` يمنع `/api/` و `/admin`.
- `NEXT_PUBLIC_ALLOW_INDEXING=false` على بيئات staging → `noindex` + `Disallow: /`.
- روابط نظيفة `kebab-case`، لا query parameters للمشاريع، روابط داخلية بين المشاريع والخدمات والفريق.
- تفاصيل: `docs/seo.md`.

## 7. قواعد الأداء

- الهدف: LCP < 2.5s، CLS < 0.1، INP < 200ms. القياسات الحالية في `docs/performance.md`.
- لا JavaScript غير ضروري: أي `"use client"` جديد يحتاج مبرراً.
- لا مكتبات animation؛ الحركة CSS فقط (`.reveal` بـ scroll-driven animation، transform فقط، تحترم `prefers-reduced-motion`، لا تُطبَّق على عنوان الـ hero).
- الخط: IBM Plex Sans Arabic مستضاف محلياً من `assets/fonts` عبر `next/font/local` (`lib/fonts.ts`) — لا يعتمد البناء ولا `next dev` على الوصول إلى Google Fonts. وزنان فقط (400/700) وأربعة ملفات preload (العربية + اللاتينية التي تحتاجها كل صفحة للمسافات والأرقام).
- CSS مضمَّن في الـ HTML (`experimental.inlineCss`) لأن Tailwind صغير وأغلب الزوار جدد.
- لا طلبات مكررة: Next.js يدمج الطلبات المتطابقة في نفس الـ render.

## 8. قواعد الصور

- استخدم `SmartImage` (غلاف لـ `next/image`) دائماً، لا `<img>`.
- حدد `sizes` لكل صورة responsive، و `width/height` أو `fill` داخل حاوية بنسبة ثابتة (منع CLS).
- `preload` فقط لصورة الـ LCP (غلاف صفحة المشروع). الباقي lazy.
- الصور من الـ API محسّنة تلقائياً (AVIF/WebP). مصادر خارجية غير مسموحة تُعرض بدون تحسين بدل كسر الصفحة. أضف المصادر الموثوقة إلى `NEXT_PUBLIC_IMAGE_ORIGINS`.
- `alt` وصفي للصور ذات المعنى، و `alt=""` للصور الزخرفية المكررة للنص.

## 9. Accessibility

- Skip link، `lang`/`dir` صحيحان، focus ظاهر لكل عنصر تفاعلي، تنقل كامل بلوحة المفاتيح.
- قائمة الموبايل: `aria-expanded` و `aria-controls`، تُغلق بـ Escape وبعد التنقل.
- النماذج: label لكل حقل، `aria-invalid` + `aria-describedby` للأخطاء، التركيز على أول حقل خاطئ، رسالة نجاح `role="status"`.
- تباين ألوان WCAG AA (Lighthouse Accessibility = 100). الروابط داخل النص مسطّرة (لا تعتمد على اللون وحده).
- الأسئلة الشائعة بـ `<details>/<summary>` (بدون JS).

## 10. التصميم والهوية البصرية

الدليل الكامل: [`docs/design-system.md`](./docs/design-system.md). باختصار:

- **Dark theme** بهوية واحدة: أسطح ليلية (`canvas` `#070B14`، `surface` `#0D1424`، `raised`، `line`)، نصوص (`ink` للعناوين، `body` للفقرات، `muted` للثانوي — تباين ≥ 4.5:1 على كل الأسطح)، وتدرج العلامة **aqua → blue → iris** (`bg-brand` / `text-gradient`).
- Tailwind فقط، والألوان من tokens في `styles/globals.css` — لا ألوان `slate/white` مباشرة. الأدوات المشتركة: `card` و `card-interactive` و `icon-tile` و `bg-aurora` و `bg-grid`.
- التدرج واحد ومحدد الاستخدام: الأزرار الرئيسية، الكلمات المميزة في العناوين، الخطوط الرفيعة، حلقات الصور، أرقام الخطوات. لا يُستخدم للخلفيات الكبيرة أو نصوص الفقرات. أي نص فوق التدرج الساطع = `text-on-brand`.
- الشعار: `BrandMark` (مكعب من ثلاث قطع بألوان الهوية) + اسم الفريق من الإعدادات؛ الشعار المرفوع من لوحة التحكم (`logoUrl`) يحل محله.
- الشكل: زوايا دائرية ناعمة (أزرار pill، بطاقات `rounded-2xl/3xl`)، glass (`backdrop-blur`) فقط للهيدر والقائمة والشارات فوق الصور.
- الحركة: transform/opacity فقط، حركة دخول تنتهي خلال 5 ثوانٍ (WCAG 2.2.2)، hover و reveal عند التمرير، ولا حلقات لا نهائية. كل شيء يتوقف مع `prefers-reduced-motion`.
- **خصائص منطقية فقط** لدعم RTL/LTR: `ms/me/ps/pe/inset-s/inset-e/text-start/border-s`. ممنوع `ml/mr/pl/pr/left/right` للمسافات والاتجاهات والمواضع.
- الأيقونات الاتجاهية تُقلب في RTL (`rtl:-scale-x-100`، انظر `ArrowForwardIcon`).
- لا تجمع أصناف display متعارضة في نفس العنصر (`hidden` + `inline-flex`) — استخدم عنصراً مغلفاً.

## 11. i18n / RTL

- العربية لغة افتراضية بدون بادئة، الإنجليزية جاهزة (`dictionaries/en.ts`) ومعطلة حتى ترجمة المحتوى.
- `localizePath(path, locale)` لكل رابط داخلي — لا تكتب `/projects` مباشرة في مكون.
- تفعيل الإنجليزية: `docs/i18n.md`.

## 12. التسمية

- Components وClasses: `PascalCase`. متغيرات ودوال: `camelCase`. ملفات: `kebab-case.tsx`. روابط: `kebab-case`.
- أسماء واضحة كاملة (لا اختصارات).

## 13. Environment Variables

موثقة في `.env.example`. `NEXT_PUBLIC_*` تُدمج وقت البناء (إعادة build بعد التغيير).
اقرأها عبر `lib/constants/env.ts` فقط. في Production يفشل البناء إذا غاب `NEXT_PUBLIC_API_URL` أو `NEXT_PUBLIC_SITE_URL`.

## 14. النشر

VPS (`npm run build && npm start`) أو Vercel. تفاصيل: `docs/deployment.md`.

## 15. الاختبارات

`npm test` (Vitest): التوجيه، SEO/JSON-LD، التحقق من النموذج، webhook الـ revalidation، ومكوّن نموذج التواصل (jsdom).

## 16. ممنوعات

- ❌ الاتصال بقاعدة البيانات أو استيراد أي شيء من `backend/` أو `admin/`.
- ❌ محتوى قابل للتعديل مكتوب في الكود، أو أرقام/آراء/عملاء وهميون.
- ❌ `"use client"` بدون حاجة، مكتبات ثقيلة، animations تؤثر على LCP/CLS/INP.
- ❌ `fetch` مباشرة في الصفحات (استخدم `lib/api/content.ts`)، أو `cache: 'no-store'` للمحتوى العام.
- ❌ `<img>` بدل `SmartImage`، صور بدون أبعاد/`sizes`.
- ❌ `dangerouslySetInnerHTML` (إلا `JsonLd` الذي يهرّب `<`).
- ❌ query parameters لروابط المشاريع، أو روابط بدون `localizePath`.
- ❌ خصائص CSS فيزيائية (left/right) بدل المنطقية.
- ❌ `console.log` (استخدم `lib/utils/logger.ts`)، `any`.
