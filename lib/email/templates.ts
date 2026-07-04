// Shared branded shell for all transactional email.
// Email-client constraints: inline styles only, tables for the kente strip
// and CTA button (survive Outlook/Gmail), no images (nothing breaks when
// remote content is blocked), system fonts with Georgia for headings.

const C = {
  night: '#1A1208',
  gold: '#D4A017',
  goldInk: '#9A7410',
  forest: '#2D6A4F',
  wine: '#A4243B',
  clay: '#8B4F22',
  ivory: '#FDF8EF',
  ink: '#2C1810',
  muted: '#6D5C4A',
  line: '#EDE4D3',
}

export interface EmailCta {
  label: string
  url: string
}

export interface RenderEmailOptions {
  /** Hidden inbox-preview line (shown next to the subject in most clients). */
  preheader: string
  /** Heading inside the card. Keep short; may carry both languages with a separator. */
  title: string
  /** Pre-built paragraphs (use paragraph()/divider() helpers). */
  bodyHtml: string
  cta?: EmailCta
  /** Small grey note under the CTA (e.g. raw link + expiry). */
  footnoteHtml?: string
}

export function paragraph(text: string): string {
  return `<p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:${C.ink};margin:0 0 14px;">${text}</p>`
}

/** Thin divider between the English and French blocks. */
export function divider(): string {
  return `<hr style="border:none;border-top:1px solid ${C.line};margin:20px 0;">`
}

export function renderEmail(opts: RenderEmailOptions): string {
  const cta = opts.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px auto 6px;"><tr>
        <td style="border-radius:10px;background-color:${C.gold};">
          <a href="${opts.cta.url}" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:${C.night};text-decoration:none;border-radius:10px;">${opts.cta.label}</a>
        </td>
      </tr></table>`
    : ''

  const footnote = opts.footnoteHtml
    ? `<p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${C.muted};margin:16px 0 0;word-break:break-all;">${opts.footnoteHtml}</p>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background-color:${C.ivory};">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${opts.preheader}</div>
  <div style="background-color:${C.ivory};padding:28px 12px;">
    <div style="max-width:560px;margin:0 auto;">

      <!-- Header -->
      <div style="background-color:${C.night};border-radius:12px 12px 0 0;padding:20px 24px;text-align:center;">
        <span style="font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:bold;color:${C.gold};">Baham Bamil&eacute;k&eacute; Dallas</span>
      </div>

      <!-- Kente strip -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr>
        <td style="height:4px;background-color:${C.gold};font-size:0;line-height:0;">&nbsp;</td>
        <td style="height:4px;background-color:${C.forest};font-size:0;line-height:0;">&nbsp;</td>
        <td style="height:4px;background-color:${C.wine};font-size:0;line-height:0;">&nbsp;</td>
        <td style="height:4px;background-color:${C.clay};font-size:0;line-height:0;">&nbsp;</td>
      </tr></table>

      <!-- Body card -->
      <div style="background-color:#ffffff;border:1px solid ${C.line};border-top:none;padding:28px 26px 24px;">
        <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:21px;line-height:1.3;color:${C.ink};margin:0 0 16px;">${opts.title}</h1>
        ${opts.bodyHtml}
        ${cta}
        ${footnote}
      </div>

      <!-- Footer -->
      <div style="background-color:#ffffff;border:1px solid ${C.line};border-top:1px solid ${C.line};border-radius:0 0 12px 12px;padding:16px 24px;text-align:center;">
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${C.muted};margin:0 0 6px;">
          Baham Bamil&eacute;k&eacute; Community of Dallas &middot; <a href="https://lahomdfw.org" style="color:${C.goldInk};text-decoration:none;font-weight:bold;">lahomdfw.org</a>
        </p>
        <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:${C.muted};margin:0 0 6px;">
          You're receiving this because you have an account or requested membership at lahomdfw.org.<br>
          Vous recevez ce message car vous avez un compte ou avez demand&eacute; &agrave; adh&eacute;rer sur lahomdfw.org.
        </p>
        <p style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:12px;color:${C.goldInk};margin:0;">
          &laquo;&nbsp;Nkam si lah&nbsp;&raquo; &mdash; Unity is Strength &middot; L'Union fait la Force
        </p>
      </div>

    </div>
  </div>
</body>
</html>`
}
