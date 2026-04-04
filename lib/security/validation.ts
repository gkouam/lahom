import { z } from 'zod'
import validator from 'validator'

export const schemas = {
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email too long')
    .transform(val => validator.normalizeEmail(val) || val),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number and special character'
    ),

  name: z
    .string()
    .min(2, 'Name too short')
    .max(100, 'Name too long')
    .transform(val => validator.escape(val)),

  phone: z
    .string()
    .max(20, 'Phone number too long')
    .optional(),

  hometown: z
    .string()
    .max(100, 'Hometown too long')
    .transform(val => validator.escape(val))
    .optional(),

  membershipRequest: z.object({
    email: z.string().email('Invalid email'),
    name: z.string().min(2, 'Name too short').max(100, 'Name too long'),
    phone: z.string().max(20).optional(),
    hometown: z.string().max(100).optional(),
    message: z.string().max(1000).optional(),
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
