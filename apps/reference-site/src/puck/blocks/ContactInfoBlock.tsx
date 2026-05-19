import type { ComponentConfig } from '@puckeditor/core';

export type ContactInfoProps = {
  heading: string;
  showPhone: boolean;
  showEmail: boolean;
  showAddress: boolean;
  showHours: boolean;
};

// Note: This block reads from src/content/site.json and src/content/hours.json
// at render time. The owner edits those via Sveltia CMS at /admin/, so the data
// shown here is always consistent with the rest of the site.
//
// For the kit reference, we accept the data as props injected by the renderer.
// In your project, the renderer should resolve site/hours JSON before passing.

type ContactData = {
  site?: { phone?: string; email?: string; address?: string };
  hours?: { weeklyHours?: Array<{ day: string; open: string; close: string }> };
};

export const ContactInfoBlock: ComponentConfig<ContactInfoProps & { _data?: ContactData }> = {
  fields: {
    heading: { type: 'text', label: 'Section Heading' },
    showPhone: { type: 'radio', label: 'Show Phone', options: [{ label: 'Yes', value: true }, { label: 'No', value: false }] },
    showEmail: { type: 'radio', label: 'Show Email', options: [{ label: 'Yes', value: true }, { label: 'No', value: false }] },
    showAddress: { type: 'radio', label: 'Show Address', options: [{ label: 'Yes', value: true }, { label: 'No', value: false }] },
    showHours: { type: 'radio', label: 'Show Hours', options: [{ label: 'Yes', value: true }, { label: 'No', value: false }] },
  },
  defaultProps: {
    heading: 'Visit Us',
    showPhone: true,
    showEmail: true,
    showAddress: true,
    showHours: true,
  },
  render: ({ heading, showPhone, showEmail, showAddress, showHours, _data }) => {
    const site = _data?.site ?? {};
    const hours = _data?.hours?.weeklyHours ?? [];

    return (
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          {heading && (
            <h2 className="text-3xl font-semibold mb-8 text-center" style={{ fontFamily: 'var(--font-display)' }}>
              {heading}
            </h2>
          )}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {showPhone && site.phone && (
                <div>
                  <div className="text-sm uppercase tracking-wide" style={{ color: 'var(--color-gold-deep)' }}>Phone</div>
                  <a href={`tel:${site.phone}`} className="text-lg font-semibold">{site.phone}</a>
                </div>
              )}
              {showEmail && site.email && (
                <div>
                  <div className="text-sm uppercase tracking-wide" style={{ color: 'var(--color-gold-deep)' }}>Email</div>
                  <a href={`mailto:${site.email}`} className="text-lg font-semibold break-all">{site.email}</a>
                </div>
              )}
              {showAddress && site.address && (
                <div>
                  <div className="text-sm uppercase tracking-wide" style={{ color: 'var(--color-gold-deep)' }}>Address</div>
                  <div className="text-lg whitespace-pre-line">{site.address}</div>
                </div>
              )}
            </div>
            {showHours && hours.length > 0 && (
              <div>
                <div className="text-sm uppercase tracking-wide mb-2" style={{ color: 'var(--color-gold-deep)' }}>Hours</div>
                <ul className="space-y-1">
                  {hours.map((row, i) => (
                    <li key={i} className="flex justify-between">
                      <span className="font-medium">{row.day}</span>
                      <span style={{ color: 'var(--color-ink-soft)' }}>
                        {row.open === 'closed' ? 'Closed' : `${row.open}–${row.close}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  },
};
