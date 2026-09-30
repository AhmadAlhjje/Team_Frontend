import { describe, expect, it } from 'vitest';

import { localizePath, resolveLocaleRoute } from './routing';

describe('localizePath', () => {
  it('keeps default-locale URLs unprefixed', () => {
    expect(localizePath('/projects', 'ar')).toBe('/projects');
    expect(localizePath('/', 'ar')).toBe('/');
    expect(localizePath('about', 'ar')).toBe('/about');
  });

  it('prefixes other locales', () => {
    expect(localizePath('/projects/wafeer', 'en')).toBe('/en/projects/wafeer');
    expect(localizePath('/', 'en')).toBe('/en');
  });
});

describe('resolveLocaleRoute', () => {
  it('rewrites unprefixed paths to the default locale', () => {
    expect(resolveLocaleRoute('/')).toEqual({ action: 'rewrite', pathname: '/ar' });
    expect(resolveLocaleRoute('/projects/wafeer')).toEqual({ action: 'rewrite', pathname: '/ar/projects/wafeer' });
  });

  it('redirects explicit default-locale URLs to the canonical unprefixed URL', () => {
    expect(resolveLocaleRoute('/ar')).toEqual({ action: 'redirect', pathname: '/' });
    expect(resolveLocaleRoute('/ar/team')).toEqual({ action: 'redirect', pathname: '/team' });
  });

  it('treats disabled locales as normal paths (they 404 under the default locale)', () => {
    expect(resolveLocaleRoute('/en/about')).toEqual({ action: 'rewrite', pathname: '/ar/en/about' });
  });

  it('does not confuse paths that merely start with a locale code', () => {
    expect(resolveLocaleRoute('/arabic-apps')).toEqual({ action: 'rewrite', pathname: '/ar/arabic-apps' });
  });
});
