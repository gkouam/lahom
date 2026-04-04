import { Resend } from 'resend'

let resend: Resend | null = null

const getResend = () => {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

const FROM_EMAIL = 'Baham Dallas <noreply@send.lahomdfw.org>'
const APP_NAME = 'Baham Bamiléké Dallas'

export const emailService = {
  async sendWelcomeEmail(email: string, name: string) {
    try {
      const resendClient = getResend()
      if (!resendClient) {
        console.error('Email service not configured')
        return { success: false, error: 'Email service not configured' }
      }

      const { data, error } = await resendClient.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: `Welcome to ${APP_NAME}!`,
        html: `
          <h1>Welcome, ${name}!</h1>
          <p>Thank you for joining the ${APP_NAME} community.</p>
          <p>Together we preserve our Baham heritage and strengthen our community in the Dallas–Fort Worth metroplex.</p>
          <p><strong>"Nkam si lah" — Unity is Strength</strong></p>
        `,
        text: `Welcome, ${name}!\n\nThank you for joining the ${APP_NAME} community.\n\nTogether we preserve our Baham heritage and strengthen our community in the Dallas–Fort Worth metroplex.\n\n"Nkam si lah" — Unity is Strength`,
      })

      if (error) {
        console.error('Failed to send welcome email:', error)
        return { success: false, error }
      }
      return { success: true, data }
    } catch (error) {
      console.error('Welcome email error:', error)
      return { success: false, error }
    }
  },

  async sendVerificationEmail(email: string, name: string, verificationToken: string) {
    try {
      const verificationLink = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${verificationToken}`

      const resendClient = getResend()
      if (!resendClient) {
        console.log('Email not configured. Verification link:', verificationLink)
        return { success: true, data: null }
      }

      const { data, error } = await resendClient.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Verify your email — Baham Bamiléké Dallas',
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
            <h1 style="color: #1A1A1A;">Welcome to Baham Bamiléké Dallas, ${name}!</h1>
            <p>Please verify your email address by clicking the button below:</p>
            <p style="text-align: center; margin: 32px 0;">
              <a href="${verificationLink}" style="background-color: #D4A017; color: #1A1A1A; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Verify Email</a>
            </p>
            <p style="font-size: 14px; color: #666;">Or copy this link: ${verificationLink}</p>
            <p style="font-size: 14px; color: #666;">This link expires in 24 hours.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
            <p style="font-size: 12px; color: #999;">"Nkam si lah" — Unity is Strength</p>
          </div>
        `,
        text: `Welcome to Baham Bamiléké Dallas, ${name}!\n\nPlease verify your email: ${verificationLink}\n\nThis link expires in 24 hours.`,
      })

      if (error) {
        console.error('Failed to send verification email:', error)
        return { success: false, error }
      }
      return { success: true, data }
    } catch (error) {
      console.error('Verification email error:', error)
      return { success: false, error }
    }
  },

  async sendPasswordResetEmail(email: string, name: string, resetToken: string) {
    try {
      const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`

      const resendClient = getResend()
      if (!resendClient) {
        console.log('Email not configured. Reset link:', resetLink)
        return { success: true, data: null }
      }

      const { data, error } = await resendClient.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Reset your password — Baham Bamiléké Dallas',
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
            <h1 style="color: #1A1A1A;">Password Reset</h1>
            <p>Hi ${name}, we received a request to reset your password.</p>
            <p style="text-align: center; margin: 32px 0;">
              <a href="${resetLink}" style="background-color: #D4A017; color: #1A1A1A; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Reset Password</a>
            </p>
            <p style="font-size: 14px; color: #666;">Or copy this link: ${resetLink}</p>
            <p style="font-size: 14px; color: #666;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
          </div>
        `,
        text: `Password Reset\n\nHi ${name}, reset your password here: ${resetLink}\n\nThis link expires in 1 hour.`,
      })

      if (error) {
        console.error('Failed to send password reset email:', error)
        return { success: false, error }
      }
      return { success: true, data }
    } catch (error) {
      console.error('Password reset email error:', error)
      return { success: false, error }
    }
  },

  async sendJoinConfirmation(email: string, name: string) {
    try {
      const resendClient = getResend()
      if (!resendClient) {
        console.log('Email not configured. Join confirmation for:', email)
        return { success: true, data: null }
      }

      const { data, error } = await resendClient.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Thank you for your interest — Baham Bamiléké Dallas',
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
            <h1 style="color: #1A1A1A;">Thank you, ${name}!</h1>
            <p>We received your membership request for the Baham Bamiléké Community of Dallas.</p>
            <p>A community leader will review your request and reach out to you soon.</p>
            <p><strong>"Nkam si lah" — Unity is Strength</strong></p>
          </div>
        `,
        text: `Thank you, ${name}!\n\nWe received your membership request. A community leader will reach out soon.\n\n"Nkam si lah" — Unity is Strength`,
      })

      if (error) {
        console.error('Failed to send join confirmation:', error)
        return { success: false, error }
      }
      return { success: true, data }
    } catch (error) {
      console.error('Join confirmation email error:', error)
      return { success: false, error }
    }
  },
}
