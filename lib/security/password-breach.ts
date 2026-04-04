import crypto from 'crypto'

export async function isPasswordBreached(password: string): Promise<{
  breached: boolean
  count?: number
  error?: string
}> {
  try {
    const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase()
    const prefix = hash.substring(0, 5)
    const suffix = hash.substring(5)

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { 'User-Agent': 'BahamDallas-Security-Check' },
    })

    if (!response.ok) {
      return { breached: false, error: 'Unable to check password breach database' }
    }

    const text = await response.text()
    const hashes = text.split('\n')

    for (const line of hashes) {
      const [hashSuffix, countStr] = line.split(':')
      if (hashSuffix === suffix) {
        return { breached: true, count: parseInt(countStr.trim(), 10) }
      }
    }

    return { breached: false }
  } catch (error) {
    console.error('Password breach check error:', error)
    return { breached: false, error: 'Failed to check password breach database' }
  }
}

export async function checkPasswordSecurity(password: string): Promise<{
  secure: boolean
  warnings: string[]
}> {
  const warnings: string[] = []

  const breachCheck = await isPasswordBreached(password)
  if (breachCheck.breached) {
    warnings.push(
      `This password has been exposed in ${breachCheck.count?.toLocaleString()} data breaches. Please choose a different password.`
    )
  }

  const commonPasswords = [
    'password', '12345678', 'qwerty', 'abc123', 'monkey',
    'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou',
  ]

  if (commonPasswords.some((common) => password.toLowerCase().includes(common))) {
    warnings.push('Password contains a common pattern. Please use a more unique password.')
  }

  return { secure: warnings.length === 0, warnings }
}
