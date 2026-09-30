import { describe, expect, it } from 'vitest';

import { type ContactValues, toContactPayload, validateContact } from './contact';

const messages = {
  required: 'required',
  email: 'email',
  phone: 'phone',
  messageTooShort: 'short',
  tooLong: 'long',
};

const valid: ContactValues = {
  name: 'Visitor',
  email: 'visitor@example.com',
  phone: '',
  company: '',
  projectType: '',
  budget: '',
  message: 'We need a booking app for our restaurant.',
};

describe('validateContact', () => {
  it('accepts a valid submission', () => {
    expect(validateContact(valid, messages)).toEqual({});
  });

  it('reports each invalid field', () => {
    expect(
      validateContact({ ...valid, name: ' ', email: 'nope', phone: 'call me', message: 'too short' }, messages),
    ).toEqual({ name: 'required', email: 'email', phone: 'phone', message: 'short' });
  });

  it('enforces maximum lengths', () => {
    expect(validateContact({ ...valid, company: 'x'.repeat(151) }, messages)).toEqual({ company: 'long' });
    expect(validateContact({ ...valid, message: 'x'.repeat(5001) }, messages)).toEqual({ message: 'long' });
  });
});

describe('toContactPayload', () => {
  it('trims values, omits empty optional fields and passes bot signals', () => {
    expect(toContactPayload({ ...valid, name: '  Visitor ', company: '  ' }, '', 12_345.6)).toEqual({
      name: 'Visitor',
      email: 'visitor@example.com',
      phone: undefined,
      company: undefined,
      projectType: undefined,
      budget: undefined,
      message: valid.message,
      website: '',
      elapsedMs: 12_346,
    });
  });
});
