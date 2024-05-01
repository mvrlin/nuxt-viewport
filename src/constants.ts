import { type ViewportOptions } from './types'

export const COOKIE_EXPIRES_IN_DAYS = 365

export const DEFAULT_OPTIONS: ViewportOptions = {
  breakpoints: {
    desktop: 1024,
    desktopMedium: 1280,
    desktopWide: 1600,

    mobile: 320,
    mobileMedium: 375,
    mobileWide: 425,

    tablet: 768,
  },

  cookie: {
    expires: COOKIE_EXPIRES_IN_DAYS,
    name: 'viewport',
    path: '/',
    sameSite: 'Strict',
    secure: true,
  },

  defaultBreakpoints: {
    desktop: 'desktop',
    mobile: 'mobile',
    tablet: 'tablet',
  },

  fallbackBreakpoint: 'desktop',

  feature: 'minWidth',
}
