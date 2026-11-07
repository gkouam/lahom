import { z } from 'zod'

// Simple email normalization (no external dependency)
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

// Simple HTML escape (no external dependency). Not applied on input any more;
// kept for callers that build HTML by hand.
export function escapeInput(val: string): string {
  return val
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

export const schemas = {
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email too long')
    .transform(val => normalizeEmail(val)),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password too long')
    // Any symbol counts as the special character (#, -, _, ., space, etc.).
    .regex(/[a-z]/, 'Password needs a lowercase letter')
    .regex(/[A-Z]/, 'Password needs an uppercase letter')
    .regex(/\d/, 'Password needs a number')
    .regex(/[^A-Za-z0-9]/, 'Password needs a symbol, such as ! # - or _'),

  // Stored as typed. React escapes it on screen and the email templates escape
  // it in HTML (lib/email/templates.ts esc()). Escaping on input corrupted names
  // with apostrophes, such as N'Guessan, into "N&#x27;Guessan".
  name: z
    .string()
    .trim()
    .min(2, 'Name too short')
    .max(100, 'Name too long'),

  phone: z
    .string()
    .max(20, 'Phone number too long')
    .optional(),

  hometown: z
    .string()
    .trim()
    .max(100, 'Hometown too long')
    .optional(),

  // Public contact form. Values are stored as typed and escaped when shown.
  membershipRequest: z.object({
    email: z.string().trim().email('Invalid email').max(255).transform(val => normalizeEmail(val)),
    name: z.string().trim().min(2, 'Name too short').max(100, 'Name too long'),
    phone: z.string().trim().max(20).optional(),
    hometown: z.string().trim().max(100).optional(),
    message: z.string().trim().max(1000, 'Message too long').optional(),
  }),
}

export const sanitizeHtml = (html: string): string => {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

export const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#x27;', '/': '&#x2F;',
  }
  return text.replace(/[&<>"'/]/g, char => map[char])
}

export const validateInput = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } => {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}
