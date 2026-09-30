# Deployment

## Vercel

1. استورد المستودع واختر المجلد `frontend` كـ Root Directory.
2. متغيرات البيئة: `NEXT_PUBLIC_API_URL`، `NEXT_PUBLIC_SITE_URL`، `REVALIDATE_SECRET`.
3. في الـ backend: `CORS_ORIGINS=https://your-site.com`، `FRONTEND_REVALIDATE_URL=https://your-site.com/api/revalidate`، ونفس `REVALIDATE_SECRET`.
4. تأكد أن الـ API متاح من الإنترنت أثناء البناء (لتوليد الصفحات بمحتواها).

الـ Data Cache و ISR مدعومان تلقائياً.

## VPS

```bash
cd /srv/team-platform/frontend
npm ci
cp .env.example .env.production   # NEXT_PUBLIC_* + REVALIDATE_SECRET (+ API_INTERNAL_URL=http://127.0.0.1:4000)
npm run build
PORT=3000 npm start               # أو PM2: pm2 start npm --name team-web -- start
```

Nginx:

```nginx
server {
  server_name example.com;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

ثم `certbot --nginx -d example.com`.

- الـ cache (ISR) يُخزَّن في `.next/cache` على القرص؛ يبقى بعد إعادة التشغيل.
- عند تشغيل أكثر من نسخة يلزم cache handler مشترك (غير مطلوب لنسخة واحدة).
- `API_INTERNAL_URL` يجعل طلبات الخادم للـ API داخلية (أسرع، بلا خروج للإنترنت).

## تحديث الموقع

```bash
git pull && npm ci && npm run build && pm2 restart team-web
```

تعديلات المحتوى لا تحتاج إعادة بناء: تظهر فوراً عبر الـ webhook.

## بيئة Staging

`NEXT_PUBLIC_ALLOW_INDEXING=false` → `noindex` في كل الصفحات و `Disallow: /` في robots.txt.
