import { Resend } from 'resend'
import { renderEmail, paragraph, divider } from './templates'

let resend: Resend | null = null

const getResend = () => {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

const FROM_EMAIL = 'Baham Dallas <noreply@send.lahomdfw.org>'
// Replies to transactional mail reach a real, monitored inbox (forwarded to the
// community leads) rather than the unattended noreply@ sending address.
const REPLY_TO = 'info@lahomdfw.org'
const APP_NAME = 'Baham Bamiléké Dallas'

// Member-facing emails are bilingual (English first, then French) because no
// per-user language preference is stored. Admin-facing mail stays English.

export const emailService = {
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
        replyTo: REPLY_TO,
        to: email,
        subject: 'Verify your email · Vérifiez votre e-mail — Baham Dallas',
        html: renderEmail({
          preheader: 'Confirm your email to activate your account · Confirmez votre e-mail pour activer votre compte',
          title: `Welcome, ${name}! · Bienvenue, ${name}&nbsp;!`,
          bodyHtml:
            paragraph(`Please verify your email address to finish setting up your ${APP_NAME} account. This link expires in 24 hours.`) +
            divider() +
            paragraph(`Veuillez vérifier votre adresse e-mail pour terminer la création de votre compte ${APP_NAME}. Ce lien expire dans 24&nbsp;heures.`),
          cta: { label: "Verify Email · Vérifier l'e-mail", url: verificationLink },
          footnoteHtml: `Or copy this link / Ou copiez ce lien&nbsp;: ${verificationLink}`,
        }),
        text: `Welcome, ${name}!\n\nPlease verify your email to finish setting up your ${APP_NAME} account (expires in 24 hours):\n${verificationLink}\n\n---\n\nBienvenue, ${name} !\n\nVeuillez vérifier votre adresse e-mail pour terminer la création de votre compte ${APP_NAME} (expire dans 24 heures) :\n${verificationLink}`,
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
        replyTo: REPLY_TO,
        to: email,
        subject: 'Reset your password · Réinitialisez votre mot de passe — Baham Dallas',
        html: renderEmail({
          preheader: 'Password reset link (expires in 1 hour) · Lien de réinitialisation (expire dans 1 heure)',
          title: 'Password reset · Réinitialisation du mot de passe',
          bodyHtml:
            paragraph(`Hi ${name}, we received a request to reset your password. This link expires in 1 hour. If you didn't request this, you can safely ignore this email.`) +
            divider() +
            paragraph(`Bonjour ${name}, nous avons reçu une demande de réinitialisation de votre mot de passe. Ce lien expire dans 1&nbsp;heure. Si vous n'êtes pas à l'origine de cette demande, ignorez simplement ce message.`),
          cta: { label: 'Reset Password · Réinitialiser', url: resetLink },
          footnoteHtml: `Or copy this link / Ou copiez ce lien&nbsp;: ${resetLink}`,
        }),
        text: `Password reset\n\nHi ${name}, reset your password here (expires in 1 hour):\n${resetLink}\n\nIf you didn't request this, ignore this email.\n\n---\n\nRéinitialisation du mot de passe\n\nBonjour ${name}, réinitialisez votre mot de passe ici (expire dans 1 heure) :\n${resetLink}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez ce message.`,
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

  async sendAdminNewRegistration(userName: string, userEmail: string) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL
      if (!adminEmail) {
        console.error('ADMIN_EMAIL not configured')
        return { success: false, error: 'Admin email not configured' }
      }

      const resendClient = getResend()
      if (!resendClient) {
        console.log('Email not configured. New registration:', userEmail)
        return { success: true, data: null }
      }

      const adminUrl = `${process.env.NEXTAUTH_URL}/admin/members`

      const { data, error } = await resendClient.emails.send({
        from: FROM_EMAIL,
        replyTo: REPLY_TO,
        to: adminEmail,
        subject: `New member registration — ${userName}`,
        html: renderEmail({
          preheader: `${userName} registered and is awaiting approval`,
          title: 'New member registration',
          bodyHtml:
            paragraph('A new user has registered and is awaiting your approval:') +
            paragraph(`<strong>Name:</strong> ${userName}<br><strong>Email:</strong> ${userEmail}`),
          cta: { label: 'Review in Admin Panel', url: adminUrl },
        }),
        text: `New member registration:\n\nName: ${userName}\nEmail: ${userEmail}\n\nReview at: ${adminUrl}`,
      })

      if (error) {
        console.error('Failed to send admin notification:', error)
        return { success: false, error }
      }
      return { success: true, data }
    } catch (error) {
      console.error('Admin notification email error:', error)
      return { success: false, error }
    }
  },

  async sendAccountApproved(email: string, name: string) {
    try {
      const resendClient = getResend()
      if (!resendClient) {
        console.log('Email not configured. Approval for:', email)
        return { success: true, data: null }
      }

      const loginUrl = `${process.env.NEXTAUTH_URL}/auth/signin`

      const { data, error } = await resendClient.emails.send({
        from: FROM_EMAIL,
        replyTo: REPLY_TO,
        to: email,
        subject: 'Account approved · Compte approuvé — Baham Dallas',
        html: renderEmail({
          preheader: 'Your account is approved — you can sign in now · Votre compte est approuvé — connectez-vous',
          title: `Welcome, ${name}! · Bienvenue, ${name}&nbsp;!`,
          bodyHtml:
            paragraph(`Great news — your account has been approved by a community admin. You now have full access to the ${APP_NAME} member portal.`) +
            divider() +
            paragraph(`Bonne nouvelle — votre compte a été approuvé par un administrateur de la communauté. Vous avez maintenant pleinement accès à l'espace membre ${APP_NAME}.`),
          cta: { label: 'Sign In · Se connecter', url: loginUrl },
        }),
        text: `Welcome, ${name}!\n\nYour account has been approved. Sign in at: ${loginUrl}\n\n---\n\nBienvenue, ${name} !\n\nVotre compte a été approuvé. Connectez-vous sur : ${loginUrl}`,
      })

      if (error) {
        console.error('Failed to send approval email:', error)
        return { success: false, error }
      }
      return { success: true, data }
    } catch (error) {
      console.error('Approval email error:', error)
      return { success: false, error }
    }
  },

  async sendRegistrationReset(email: string, name: string) {
    try {
      const resendClient = getResend()
      if (!resendClient) {
        console.log('Email not configured. Registration reset for:', email)
        return { success: true, data: null }
      }

      const signupUrl = `${process.env.NEXTAUTH_URL}/auth/signup`

      const { data, error } = await resendClient.emails.send({
        from: FROM_EMAIL,
        replyTo: REPLY_TO,
        to: email,
        subject: 'Please register again · Veuillez vous réinscrire — Baham Dallas',
        html: renderEmail({
          preheader: 'Your registration was reset — sign up again in two minutes · Votre inscription a été réinitialisée',
          title: `Hello, ${name}! · Bonjour, ${name}&nbsp;!`,
          bodyHtml:
            paragraph(`Your earlier registration at ${APP_NAME} was reset by a community administrator so you can start fresh — the original sign-up ran into a technical issue on our side. Please register again; it only takes two minutes, and you'll receive a working verification email right away.`) +
            divider() +
            paragraph(`Votre inscription précédente à ${APP_NAME} a été réinitialisée par un administrateur afin de repartir à zéro — l'inscription initiale a rencontré un problème technique de notre côté. Veuillez vous réinscrire&nbsp;; cela ne prend que deux minutes et vous recevrez immédiatement un e-mail de vérification fonctionnel.`),
          cta: { label: "Register Again · S'inscrire à nouveau", url: signupUrl },
        }),
        text: `Hello, ${name}!\n\nYour earlier registration at ${APP_NAME} was reset by a community administrator so you can start fresh. Please register again at: ${signupUrl}\n\n---\n\nBonjour, ${name} !\n\nVotre inscription précédente à ${APP_NAME} a été réinitialisée par un administrateur afin de repartir à zéro. Veuillez vous réinscrire sur : ${signupUrl}`,
      })

      if (error) {
        console.error('Failed to send registration reset email:', error)
        return { success: false, error }
      }
      return { success: true, data }
    } catch (error) {
      console.error('Registration reset email error:', error)
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
        replyTo: REPLY_TO,
        to: email,
        subject: 'We received your request · Demande bien reçue — Baham Dallas',
        html: renderEmail({
          preheader: 'A community leader will review your request soon · Un responsable examinera votre demande bientôt',
          title: `Thank you, ${name}! · Merci, ${name}&nbsp;!`,
          bodyHtml:
            paragraph('We received your membership request for the Baham Bamiléké Community of Dallas. A community leader will review it and reach out to you soon.') +
            divider() +
            paragraph("Nous avons bien reçu votre demande d'adhésion à la Communauté Baham Bamiléké de Dallas. Un responsable de la communauté l'examinera et vous contactera bientôt."),
        }),
        text: `Thank you, ${name}!\n\nWe received your membership request. A community leader will reach out soon.\n\n---\n\nMerci, ${name} !\n\nNous avons bien reçu votre demande d'adhésion. Un responsable vous contactera bientôt.`,
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
