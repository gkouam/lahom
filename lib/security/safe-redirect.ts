// Where to send someone after sign-in. Only same-site paths are allowed: a value
// such as "https://evil.example" or "javascript:..." would otherwise be followed
// by router.push, which treats it as an external URL and hands it to the browser.
export function safeCallbackPath(raw: string | null | undefined, fallback = '/dashboard'): string {
  if (!raw) return fallback
  let value = raw.trim()
  try {
    // Values arrive URL-decoded from searchParams; decode once more defensively.
    value = decodeURIComponent(value)
  } catch {
    return fallback
  }
  // Must be a path on this site: starts with one "/", not "//" or "/\".
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return fallback
  // No control characters or backslashes anywhere (browsers treat "\" like "/").
  if (/[\u0000-\u001F\u007F\\]/.test(value)) return fallback
  return value
}
