import { Resend } from 'resend'
import { renderEmail, paragraph, divider, esc, plain } from './templates'

let resend: Resend | null = null

const getResend = () => {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

const FROM_EMAIL = '"La\'Hom DFW" <noreply@send.lahomdfw.org>'
// Replies to transactional mail reach a real, monitored inbox (forwarded to the
// community leads) rather than the unattended noreply@ sending address.
const REPLY_TO = 'info@lahomdfw.org'
const APP_NAME = "La'Hom DFW"
const APP_NAME_HTML = 'La&#39;Hom DFW'

type SendResult = { success: boolean; data?: unknown; error?: unknown }

// Without an API key, development logs the message instead of sending it.
// In production that would hide a broken setup (people never get their
// verification link), so it reports a failure the caller can surface.
function notConfigured(what: string, detail: string): SendResult {
  if (process.env.NODE_ENV === 'production') {
    console.error(`RESEND_API_KEY missing: could not send ${what}`)
    return { success: false, error: 'Email is not configured' }
  }
  console.log(`Email not configured. ${what}: ${detail}`)
  return { success: true, data: null }
}

async function send(what: string, payload: Parameters<Resend['emails']['send']>[0]): Promise<SendResult> {
  const client = getResend()
  if (!client) return notConfigured(what, String(payload.to))
  try {
    const { data, error } = await client.emails.send(payload)
    if (error) {
      console.error(`Failed to send ${what}:`, error)
      return { success: false, error }
    }
    return { success: true, data }
  } catch (error) {
    console.error(`${what} error:`, error)
    return { success: false, error }
  }
}

// Member-facing emails are bilingual (English first, then French) because no
// per-user language preference is stored yet. Admin-facing mail stays English.
// Every user-supplied value goes through esc() in HTML and plain() in text.

export const emailService = {
  async sendVerificationEmail(email: string, name: string, verificationToken: string) {
    const link = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${encodeURIComponent(verificationToken)}`
    if (!getResend()) return notConfigured('verification email', link)
    return send('verification email', {
      from: FROM_EMAIL,
      replyTo: REPLY_TO,
      to: email,
      subject: `Verify your email · Vérifiez votre e-mail — ${APP_NAME}`,
      html: renderEmail({
        preheader: 'Confirm your email to activate your account · Confirmez votre e-mail pour activer votre compte',
        title: `Welcome, ${esc(name)}! · Bienvenue, ${esc(name)}&nbsp;!`,
        bodyHtml:
          paragraph(`Please verify your email address to finish setting up your ${APP_NAME_HTML} account. This link expires in 24 hours.`) +
          divider() +
          paragraph(`Veuillez vérifier votre adresse e-mail pour terminer la création de votre compte ${APP_NAME_HTML}. Ce lien expire dans 24&nbsp;heures.`),
        cta: { label: "Verify Email · Vérifier l'e-mail", url: link },
        footnoteHtml: `Or copy this link / Ou copiez ce lien&nbsp;: ${esc(link)}`,
      }),
      text: `Welcome, ${plain(name)}!\n\nPlease verify your email to finish setting up your ${APP_NAME} account (expires in 24 hours):\n${link}\n\n---\n\nBienvenue, ${plain(name)} !\n\nVeuillez vérifier votre adresse e-mail pour terminer la création de votre compte ${APP_NAME} (expire dans 24 heures) :\n${link}`,
    })
  },

  async sendPasswordResetEmail(email: string, name: string, resetToken: string) {
    const link = `${process.env.NEXTAUTH_URL}/reset-password?token=${encodeURIComponent(resetToken)}`
    if (!getResend()) return notConfigured('password reset email', link)
    return send('password reset email', {
      from: FROM_EMAIL,
      replyTo: REPLY_TO,
      to: email,
      subject: `Reset your password · Réinitialisez votre mot de passe — ${APP_NAME}`,
      html: renderEmail({
        preheader: 'Password reset link (expires in 1 hour) · Lien de réinitialisation (expire dans 1 heure)',
        title: 'Password reset · Réinitialisation du mot de passe',
        bodyHtml:
          paragraph(`Hi ${esc(name)}, we received a request to reset your password. This link expires in 1 hour. If you didn't request this, you can safely ignore this email.`) +
          divider() +
          paragraph(`Bonjour ${esc(name)}, nous avons reçu une demande de réinitialisation de votre mot de passe. Ce lien expire dans 1&nbsp;heure. Si vous n'êtes pas à l'origine de cette demande, ignorez simplement ce message.`),
        cta: { label: 'Reset Password · Réinitialiser', url: link },
        footnoteHtml: `Or copy this link / Ou copiez ce lien&nbsp;: ${esc(link)}`,
      }),
      text: `Password reset\n\nHi ${plain(name)}, reset your password here (expires in 1 hour):\n${link}\n\nIf you didn't request this, ignore this email.\n\n---\n\nRéinitialisation du mot de passe\n\nBonjour ${plain(name)}, réinitialisez votre mot de passe ici (expire dans 1 heure) :\n${link}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez ce message.`,
    })
  },

  async sendAdminNewRegistration(userName: string, userEmail: string) {
    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) {
      console.error('ADMIN_EMAIL not configured')
      return { success: false, error: 'Admin email not configured' }
    }
    const adminUrl = `${process.env.NEXTAUTH_URL}/admin/members`
    return send('admin registration notice', {
      from: FROM_EMAIL,
      replyTo: REPLY_TO,
      to: adminEmail,
      subject: `New member registration — ${plain(userName).slice(0, 80)}`,
      html: renderEmail({
        preheader: `${esc(userName)} registered and is awaiting approval`,
        title: 'New member registration',
        bodyHtml:
          paragraph('A new person has registered and is waiting for an officer to approve them:') +
          paragraph(`<strong>Name:</strong> ${esc(userName)}<br><strong>Email:</strong> ${esc(userEmail)}`),
        cta: { label: 'Review in the admin portal', url: adminUrl },
      }),
      text: `New member registration:\n\nName: ${plain(userName)}\nEmail: ${userEmail}\n\nReview at: ${adminUrl}`,
    })
  },

  async sendAccountApproved(email: string, name: string) {
    const loginUrl = `${process.env.NEXTAUTH_URL}/auth/signin`
    return send('approval email', {
      from: FROM_EMAIL,
      replyTo: REPLY_TO,
      to: email,
      subject: `Account approved · Compte approuvé — ${APP_NAME}`,
      html: renderEmail({
        preheader: 'Your account is approved — you can sign in now · Votre compte est approuvé — connectez-vous',
        title: `Welcome, ${esc(name)}! · Bienvenue, ${esc(name)}&nbsp;!`,
        bodyHtml:
          paragraph(`Great news: your account has been approved by a community officer. You now have full access to the ${APP_NAME_HTML} member portal.`) +
          divider() +
          paragraph(`Bonne nouvelle : votre compte a été approuvé par un responsable de la communauté. Vous avez maintenant pleinement accès à l'espace membre ${APP_NAME_HTML}.`),
        cta: { label: 'Sign In · Se connecter', url: loginUrl },
      }),
      text: `Welcome, ${plain(name)}!\n\nYour account has been approved. Sign in at: ${loginUrl}\n\n---\n\nBienvenue, ${plain(name)} !\n\nVotre compte a été approuvé. Connectez-vous sur : ${loginUrl}`,
    })
  },

  async sendAccountRejected(email: string, name: string) {
    return send('rejection email', {
      from: FROM_EMAIL,
      replyTo: REPLY_TO,
      to: email,
      subject: `About your registration · À propos de votre inscription — ${APP_NAME}`,
      html: renderEmail({
        preheader: 'An update on your registration · Des nouvelles de votre inscription',
        title: `Hello, ${esc(name)} · Bonjour, ${esc(name)}`,
        bodyHtml:
          paragraph(`Thank you for your interest in ${APP_NAME_HTML}. Our officers were not able to approve your member account at this time. If you think this is a mistake, or would like to know more, simply reply to this email.`) +
          divider() +
          paragraph(`Merci de votre intérêt pour ${APP_NAME_HTML}. Nos responsables n'ont pas pu approuver votre compte membre pour le moment. Si vous pensez qu'il s'agit d'une erreur, ou pour en savoir plus, répondez simplement à cet e-mail.`),
      }),
      text: `Hello, ${plain(name)}\n\nThank you for your interest in ${APP_NAME}. Our officers were not able to approve your member account at this time. If you think this is a mistake, reply to this email.\n\n---\n\nBonjour, ${plain(name)}\n\nMerci de votre intérêt pour ${APP_NAME}. Nos responsables n'ont pas pu approuver votre compte membre pour le moment. Si vous pensez qu'il s'agit d'une erreur, répondez à cet e-mail.`,
    })
  },

  async sendRegistrationReset(email: string, name: string) {
    const signupUrl = `${process.env.NEXTAUTH_URL}/auth/signup`
    return send('registration reset email', {
      from: FROM_EMAIL,
      replyTo: REPLY_TO,
      to: email,
      subject: `Please register again · Veuillez vous réinscrire — ${APP_NAME}`,
      html: renderEmail({
        preheader: 'Your registration was reset — sign up again in two minutes · Votre inscription a été réinitialisée',
        title: `Hello, ${esc(name)}! · Bonjour, ${esc(name)}&nbsp;!`,
        bodyHtml:
          paragraph(`Your earlier registration at ${APP_NAME_HTML} was reset by a community officer so you can start fresh, because the original sign-up ran into a technical issue on our side. Please register again; it only takes two minutes, and you'll receive a working verification email right away.`) +
          divider() +
          paragraph(`Votre inscription précédente à ${APP_NAME_HTML} a été réinitialisée par un responsable afin de repartir à zéro, car l'inscription initiale a rencontré un problème technique de notre côté. Veuillez vous réinscrire&nbsp;; cela ne prend que deux minutes et vous recevrez immédiatement un e-mail de vérification fonctionnel.`),
        cta: { label: "Register Again · S'inscrire à nouveau", url: signupUrl },
      }),
      text: `Hello, ${plain(name)}!\n\nYour earlier registration at ${APP_NAME} was reset by a community officer so you can start fresh. Please register again at: ${signupUrl}\n\n---\n\nBonjour, ${plain(name)} !\n\nVotre inscription précédente à ${APP_NAME} a été réinitialisée par un responsable afin de repartir à zéro. Veuillez vous réinscrire sur : ${signupUrl}`,
    })
  },

  /** Confirmation for the public contact form. Deliberately contains nothing the sender typed. */
  async sendJoinConfirmation(email: string) {
    return send('contact confirmation', {
      from: FROM_EMAIL,
      replyTo: REPLY_TO,
      to: email,
      subject: `We received your message · Message bien reçu — ${APP_NAME}`,
      html: renderEmail({
        preheader: 'A community officer will reply soon · Un responsable vous répondra bientôt',
        title: 'Thank you · Merci',
        bodyHtml:
          paragraph(`We received your message to ${APP_NAME_HTML}. A community officer will read it and reply to you soon. If you did not write to us, you can ignore this email.`) +
          divider() +
          paragraph(`Nous avons bien reçu votre message adressé à ${APP_NAME_HTML}. Un responsable de la communauté le lira et vous répondra bientôt. Si vous ne nous avez pas écrit, ignorez simplement cet e-mail.`),
      }),
      text: `Thank you. We received your message to ${APP_NAME}. A community officer will reply soon. If you did not write to us, ignore this email.\n\n---\n\nMerci. Nous avons bien reçu votre message adressé à ${APP_NAME}. Un responsable vous répondra bientôt. Si vous ne nous avez pas écrit, ignorez cet e-mail.`,
    })
  },

  /** Tells officers that the public contact form received a message. */
  async sendAdminNewMessage(m: { name: string; email: string; phone?: string | null; hometown?: string | null; message?: string | null }) {
    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) {
      console.error('ADMIN_EMAIL not configured')
      return { success: false, error: 'Admin email not configured' }
    }
    const inboxUrl = `${process.env.NEXTAUTH_URL}/admin/messages`
    const details = [
      `<strong>Name:</strong> ${esc(m.name)}`,
      `<strong>Email:</strong> ${esc(m.email)}`,
      m.phone ? `<strong>Phone:</strong> ${esc(m.phone)}` : '',
      m.hometown ? `<strong>Hometown:</strong> ${esc(m.hometown)}` : '',
    ].filter(Boolean).join('<br>')
    return send('admin message notice', {
      from: FROM_EMAIL,
      replyTo: m.email,
      to: adminEmail,
      subject: `New message from the website — ${plain(m.name).slice(0, 80)}`,
      html: renderEmail({
        preheader: 'Someone wrote to La&#39;Hom DFW through the website',
        title: 'New message from the website',
        bodyHtml:
          paragraph(details) +
          (m.message ? paragraph(esc(m.message).replace(/\n/g, '<br>')) : paragraph('<em>No message text.</em>')),
        cta: { label: 'Open the inbox', url: inboxUrl },
      }),
      text: `New message from the website\n\nName: ${plain(m.name)}\nEmail: ${m.email}${m.phone ? `\nPhone: ${m.phone}` : ''}${m.hometown ? `\nHometown: ${m.hometown}` : ''}\n\n${m.message || '(no message text)'}\n\nInbox: ${inboxUrl}`,
    })
  },

  /** Sent when an officer approves a website request: a link to create the member account. */
  async sendMemberInvite(email: string, name: string) {
    const signupUrl = `${process.env.NEXTAUTH_URL}/auth/signup?email=${encodeURIComponent(email)}`
    return send('member invitation', {
      from: FROM_EMAIL,
      replyTo: REPLY_TO,
      to: email,
      subject: `Create your member account · Créez votre compte membre — ${APP_NAME}`,
      html: renderEmail({
        preheader: 'You are invited to join the member portal · Vous êtes invité(e) à rejoindre l\'espace membre',
        title: `Welcome, ${esc(name)}! · Bienvenue, ${esc(name)}&nbsp;!`,
        bodyHtml:
          paragraph(`A community officer invites you to create your ${APP_NAME_HTML} member account. It takes two minutes: choose a password, confirm your email, and an officer will activate your access.`) +
          divider() +
          paragraph(`Un responsable de la communauté vous invite à créer votre compte membre ${APP_NAME_HTML}. Cela prend deux minutes : choisissez un mot de passe, confirmez votre e-mail, puis un responsable activera votre accès.`),
        cta: { label: 'Create my account · Créer mon compte', url: signupUrl },
      }),
      text: `Welcome, ${plain(name)}!\n\nCreate your ${APP_NAME} member account here: ${signupUrl}\n\n---\n\nBienvenue, ${plain(name)} !\n\nCréez votre compte membre ${APP_NAME} ici : ${signupUrl}`,
    })
  },
}
