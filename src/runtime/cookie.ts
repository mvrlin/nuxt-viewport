export type CookieOptions = {
  domain?: string

  /**
   * Expiration date, or a number of days from now.
   */
  expires?: Date | number | string

  path?: string
  sameSite?: 'Lax' | 'None' | 'Strict'
  secure?: boolean
}

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000

/**
 * Writes a cookie in the browser.
 * @param name - Cookie name.
 * @param value - Cookie value.
 * @param options - Cookie options.
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}) {
  if (typeof document === 'undefined') {
    return
  }

  const { domain, expires, path = '/', sameSite, secure } = options
  const parts = [`${name}=${encodeURIComponent(value)}`]

  if (expires !== undefined && expires !== '') {
    const expiresAt = typeof expires === 'number'
      ? new Date(Date.now() + expires * MILLISECONDS_IN_DAY)
      : new Date(expires)

    if (!Number.isNaN(expiresAt.getTime())) {
      parts.push(`expires=${expiresAt.toUTCString()}`)
    }
  }

  parts.push(`path=${path}`)

  if (domain) {
    parts.push(`domain=${domain}`)
  }

  if (sameSite) {
    parts.push(`SameSite=${sameSite}`)
  }

  if (secure) {
    parts.push('secure')
  }

  document.cookie = parts.join('; ')
}
