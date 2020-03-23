// @ts-ignore
import Cookies from 'js-cookie'

function storePreferences (preferences) {
  Cookies.set('userConsent', JSON.stringify({
    version: '2020-03-01',
    dateSet: new Date().getTime(),
    preferences: preferences
  }), { sameSite: 'strict', expires: 3650 })
}

const userPreferenceFactory = () => ({
  userAcceptsAll: () => {
    storePreferences({
      acceptAll: true
    })
  },
  setPreferences: (preferencesIn) => {
    storePreferences({
      usage: preferencesIn.usage,
      campaigns: preferencesIn.campaigns,
      settings: preferencesIn.settings
    })
  },
  getPreferences: () => {
    const rawCookie = Cookies.get('userConsent')
    if (rawCookie) {
      const parsedCookie = JSON.parse(rawCookie)
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
})

export default userPreferenceFactory
