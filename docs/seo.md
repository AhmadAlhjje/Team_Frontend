# SEO

## ما هو مطبق

| العنصر          | التطبيق                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Metadata        | `buildPageMetadata()` لكل صفحة: title (عنوان الصفحة ثم اسم الفريق)، description، canonical، hreflang، Open Graph، Twitter |
| صفحات المشاريع  | `seoTitle` / `seoDescription` / `ogImageUrl` من لوحة التحكم، مع fallback للعنوان والملخص والغلاف؛ `og:type=article`       |
| Canonical       | رابط واحد لكل صفحة؛ `/ar/*` يُحوَّل 308                                                                                   |
| Sitemap         | `/sitemap.xml` ديناميكي: الصفحات الثابتة + كل مشروع منشور مع `lastModified`؛ يُحدَّث مع tag `projects`                    |
| Robots          | `/robots.txt`: allow `/`، disallow `/api/` و `/admin`؛ `noindex` كامل عند `NEXT_PUBLIC_ALLOW_INDEXING=false`              |
| 404             | حالة 404 حقيقية + `noindex` (لا soft 404)                                                                                 |
| Structured data | Organization + WebSite (كل الصفحات)، BreadcrumbList، Person (الفريق)، CreativeWork (المشروع) — `@id` مترابطة              |
| HTML            | `lang`/`dir`، `h1` واحد، عناوين مرتبة، عناصر دلالية، breadcrumbs مرئية                                                    |
| الروابط         | نظيفة `kebab-case`، روابط داخلية: مشروع ↔ خدمات ↔ فريق ↔ مشاريع مشابهة                                                    |
| السرعة          | Static/ISR، Lighthouse SEO = 100، CLS = 0                                                                                 |

## عند إضافة صفحة جديدة

1. `generateMetadata` باستخدام `buildPageMetadata({ locale, settings, path, title, description })`.
2. `PageIntro` مع `breadcrumbTrail(...)` (يضيف BreadcrumbList تلقائياً).
3. أضف الرابط إلى `STATIC_PAGES` في `app/sitemap.ts` وإلى التنقل عند الحاجة.
4. JSON-LD فقط إذا كان هناك نوع schema.org مطابق فعلاً للمحتوى.

## نصائح للمحتوى (من لوحة التحكم)

- عنوان SEO ≈ 50–60 حرفاً، الوصف ≈ 140–155 حرفاً، فريد لكل مشروع.
- صورة المشاركة 1200×630.
- وصف مختصر واضح لكل مشروع يذكر نوعه والمشكلة التي يحلها.
- `alt` لكل صورة من صور المشروع.
- لا حشو كلمات مفتاحية؛ المحتوى الحقيقي والتفصيلي هو ما يتصدر.

## قائمة فحص قبل الإطلاق

- [ ] `NEXT_PUBLIC_SITE_URL` = النطاق النهائي بـ https
- [ ] `NEXT_PUBLIC_ALLOW_INDEXING` غير مضبوط على `false` في Production (ومضبوط على staging)
- [ ] صورة مشاركة افتراضية مرفوعة من الإعدادات
- [ ] اسم الفريق والوصف الافتراضي مكتوبان في الإعدادات
- [ ] إرسال `https://example.com/sitemap.xml` في Google Search Console
- [ ] فحص صفحة مشروع في Rich Results Test
