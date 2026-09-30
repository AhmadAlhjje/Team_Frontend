import { beforeEach, describe, expect, it, vi } from 'vitest';

const revalidateTag = vi.fn();
vi.mock('next/cache', () => ({ revalidateTag: (...args: unknown[]) => revalidateTag(...args) }));

const SECRET = 'test-secret-0123456789abcdef0123456789';

function request(body: unknown, secret?: string) {
  return new Request('http://localhost/api/revalidate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(secret ? { 'x-revalidate-secret': secret } : {}) },
    body: JSON.stringify(body),
  });
}

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    revalidateTag.mockReset();
    process.env.REVALIDATE_SECRET = SECRET;
  });

  it('rejects requests without the right secret', async () => {
    const { POST } = await import('./route');
    expect((await POST(request({ tags: ['projects'] }))).status).toBe(401);
    expect((await POST(request({ tags: ['projects'] }, 'wrong-secret'))).status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('revalidates only known tags, once each, with immediate expiry', async () => {
    const { POST } = await import('./route');
    const response = await POST(request({ tags: ['projects', 'team', 'projects', 'users', 42] }, SECRET));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ revalidated: ['projects', 'team'] });
    expect(revalidateTag).toHaveBeenCalledTimes(2);
    expect(revalidateTag).toHaveBeenCalledWith('projects', { expire: 0 });
  });

  it('returns 400 when no valid tag is provided and 503 when not configured', async () => {
    const { POST } = await import('./route');
    expect((await POST(request({ tags: ['nope'] }, SECRET))).status).toBe(400);

    delete process.env.REVALIDATE_SECRET;
    expect((await POST(request({ tags: ['projects'] }, SECRET))).status).toBe(503);
  });
});
