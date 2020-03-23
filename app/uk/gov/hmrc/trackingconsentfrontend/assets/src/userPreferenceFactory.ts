// @ts-ignore
import Cookies from 'js-cookie'

function storePreferences (preferences) {
  Cookies.set('userConsent', JSON.stringify({
    version: '2020-03-01',
    dateSet: new Date().getTime(),
    preferences: preferences
  }), { sameSite: 'strict', expires: 3650 })
}

const userAcceptsAll = () => {
  storePreferences({
    acceptAll: true
  })
}

const setPreferences = preferencesIn => {
  storePreferences({
    usage: preferencesIn.usage,
    campaigns: preferencesIn.campaigns,
    settings: preferencesIn.settings
  })
}

const getPreferences = () => {
  const rawCookie = Cookies.get('userConsent')
  if (rawCookie) {
    const parsedCookie = rawCookie ? JSON.parse(rawCookie) : undefined
    const pref = parsedCookie.preferences
    if (pref.acceptAll) {
      return {
        usage: true,
        campaigns: true,
        settings: true
      }
    }
    return {
      usage: !!pref.usage,
      campaigns: !!pref.campaigns,
      settings: !!pref.settings
    }
  } else {
    return undefined
  }
}

const getUserHasSavedCookiePreferences = () => getPreferences() !== undefined

const userPreferenceFactory = () => ({
  userAcceptsAll,
  setPreferences,
  getUserHasSavedCookiePreferences,
  getPreferences
})

export default userPreferenceFactory
