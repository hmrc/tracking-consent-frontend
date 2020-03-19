// @ts-ignore
import Cookies from 'js-cookie'

const userPreferenceFactory = () => ({
  userAcceptsAll: () => {
    Cookies.set('userConsent', JSON.stringify({
      version: '2020-03-01',
      dateSet: new Date().getTime(),
      preferences: {
        acceptAll: true
      }
    }), { sameSite: 'strict', expires: 3650 })
  },
  getPreferences: () => {
    const rawCookie = Cookies.get('userConsent')
    // const parsedCookie = rawCookie ? JSON.parse(rawCookie) : undefined
    return rawCookie ? {
      usage: true,
      campaigns: true,
      settings: true
    } : undefined
  }
})

export default userPreferenceFactory
