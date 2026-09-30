// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ar } from '@/lib/i18n/dictionaries/ar';

import { ContactForm } from './contact-form';

const labels = ar.contact.form;
const endpoint = 'https://api.example.com/api/v1/contact';

function renderForm() {
  return render(<ContactForm endpoint={endpoint} labels={labels} projectTypes={['تطوير تطبيقات الويب']} />);
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(labels.name), 'زائر');
  await user.type(screen.getByLabelText(labels.email), 'visitor@example.com');
  await user.selectOptions(screen.getByLabelText(new RegExp(labels.projectType)), 'تطوير تطبيقات الويب');
  await user.type(screen.getByLabelText(labels.message), 'نريد منصة ويب لإدارة الطلبات في متجرنا.');
}

describe('ContactForm', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('shows accessible field errors and does not submit invalid data', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: labels.submit }));

    expect(screen.getByRole('alert')).toHaveTextContent(labels.errors.summary);
    const name = screen.getByLabelText(labels.name);
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveAccessibleDescription(labels.errors.required);
    expect(name).toHaveFocus();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('submits the payload with bot signals and shows the success state', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    renderForm();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: labels.submit }));

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(labels.successTitle));
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(endpoint);
    const body = JSON.parse(String(init.body));
    expect(body).toMatchObject({
      name: 'زائر',
      email: 'visitor@example.com',
      projectType: 'تطوير تطبيقات الويب',
      website: '',
    });
    expect(body.elapsedMs).toBeGreaterThanOrEqual(0);
    expect(body).not.toHaveProperty('phone');
  });

  it('explains rate limiting', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 429 })));
    const user = userEvent.setup();
    renderForm();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: labels.submit }));

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(labels.errors.rateLimited));
  });

  it('reports network failures without losing the typed data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    const user = userEvent.setup();
    renderForm();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: labels.submit }));

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(labels.errors.network));
    expect(screen.getByLabelText(labels.email)).toHaveValue('visitor@example.com');
  });
});
