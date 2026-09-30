import { describe, expect, it } from 'vitest';

import { formatDateRange, formatMonthYear, initials, monogram, telUrl, whatsappUrl } from './format';
import { completeRows } from './grid';
import { splitHighlights, stripHighlights } from './highlight';
import { isOptimizableImage } from './images';
import { parseRichText, toPlainExcerpt } from './rich-text';

describe('parseRichText', () => {
  it('splits paragraphs on blank lines and detects bullet lists', () => {
    const blocks = parseRichText('First paragraph\ncontinued.\r\n\r\n- one\n- two\n\n• three');
    expect(blocks).toEqual([
      { type: 'paragraph', text: 'First paragraph\ncontinued.' },
      { type: 'list', items: ['one', 'two'] },
      { type: 'list', items: ['three'] },
    ]);
  });

  it('starts a list right after an introductory line', () => {
    expect(parseRichText('الحل:\n- نقطة أولى\n- نقطة ثانية\nخاتمة')).toEqual([
      { type: 'paragraph', text: 'الحل:' },
      { type: 'list', items: ['نقطة أولى', 'نقطة ثانية'] },
      { type: 'paragraph', text: 'خاتمة' },
    ]);
  });

  it('never interprets HTML (it stays plain text)', () => {
    expect(parseRichText('<script>alert(1)</script>')).toEqual([
      { type: 'paragraph', text: '<script>alert(1)</script>' },
    ]);
  });

  it('handles empty values', () => {
    expect(parseRichText(null)).toEqual([]);
    expect(parseRichText('   \n\n  ')).toEqual([]);
  });
});

describe('toPlainExcerpt', () => {
  it('collapses whitespace and truncates on a word boundary', () => {
    const text = 'word '.repeat(60);
    const excerpt = toPlainExcerpt(text, 50);
    expect(excerpt.length).toBeLessThanOrEqual(50);
    expect(excerpt.endsWith('…')).toBe(true);
    expect(toPlainExcerpt('short\n text')).toBe('short text');
  });
});

describe('formatting', () => {
  it('formats dates with Latin digits in Arabic', () => {
    expect(formatMonthYear('2025-01-15', 'ar')).toMatch(/2025/);
  });

  it('formats project timelines', () => {
    expect(formatDateRange(null, null, 'en', 'Present')).toBeNull();
    expect(formatDateRange('2025-01-01', null, 'en', 'Present')).toBe('January 2025 – Present');
    expect(formatDateRange('2025-01-01', '2025-01-20', 'en', 'Present')).toBe('January 2025');
    expect(formatDateRange(null, '2025-03-01', 'en', 'Present')).toBe('March 2025');
  });

  it('builds contact links from human-formatted numbers', () => {
    expect(whatsappUrl('+963 (900) 000-111')).toBe('https://wa.me/963900000111');
    expect(telUrl('+963 900 000 111')).toBe('tel:+963900000111');
  });

  it('computes initials', () => {
    expect(initials('Ahmad Ali Hassan')).toBe('AA');
    expect(initials('wafeer')).toBe('W');
  });

  it('uses one letter for Arabic monograms and initials otherwise', () => {
    expect(monogram('  سامي الخطيب')).toBe('س');
    expect(monogram('Lina Haddad')).toBe('LH');
  });
});

describe('completeRows', () => {
  const project = (slug: string) => ({ slug });
  const all = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map(project);

  it('tops up featured projects to complete rows, without duplicates', () => {
    const featured = [project('c'), project('e'), project('g'), project('a')];
    expect(completeRows(featured, all, { perRow: 3, max: 6 }).map((item) => item.slug)).toEqual([
      'c',
      'e',
      'g',
      'a',
      'b',
      'd',
    ]);
  });

  it('shows the latest projects when none is featured, and never more than max', () => {
    expect(completeRows([], all, { perRow: 3, max: 6 })).toHaveLength(6);
    expect(completeRows([project('a')], [project('a')], { perRow: 3, max: 6 })).toHaveLength(1);
  });
});

describe('highlights', () => {
  it('splits words wrapped in asterisks', () => {
    expect(splitHighlights('نبني منتجات *متينة* تحل مشاكل *حقيقية*.')).toEqual([
      { text: 'نبني منتجات ', highlight: false },
      { text: 'متينة', highlight: true },
      { text: ' تحل مشاكل ', highlight: false },
      { text: 'حقيقية', highlight: true },
      { text: '.', highlight: false },
    ]);
  });

  it('keeps unmatched asterisks as plain text', () => {
    expect(splitHighlights('5 * 3')).toEqual([{ text: '5 * 3', highlight: false }]);
    expect(stripHighlights('a *b* c*')).toBe('a b c*');
  });
});

describe('isOptimizableImage', () => {
  const origins = [new URL('https://api.example.com')];

  it('optimizes local and allowed-origin images only', () => {
    expect(isOptimizableImage('/og.png', origins)).toBe(true);
    expect(isOptimizableImage('https://api.example.com/uploads/a.webp', origins)).toBe(true);
    expect(isOptimizableImage('https://other.example.com/a.png', origins)).toBe(false);
    expect(isOptimizableImage('http://api.example.com/uploads/a.webp', origins)).toBe(false);
    expect(isOptimizableImage('//evil.example/a.png', origins)).toBe(false);
    expect(isOptimizableImage('not a url', origins)).toBe(false);
  });
});
