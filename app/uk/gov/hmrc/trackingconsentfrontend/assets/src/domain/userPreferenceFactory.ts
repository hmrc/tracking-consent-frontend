// @ts-ignore
import Cookies from 'js-cookie'
import cookieTypes from '../constants/cookieTypes'
import fromEntries from '../common/fromEntries'
import {COOKIE_CONSENT, COOKIE_VERSION} from '../constants/cookies'


const userPreferenceFactory = (preferenceCommunicator) => {
  function storePreferences (preferences) {
    Cookies.set(COOKIE_CONSENT, {
      version: '2020-03-01',
      dateSet: new Date().getTime(),
      preferences: preferences
    }, { sameSite: 'strict', expires: 3650 })
  }

  const userAcceptsAll = () => {
    storePreferences({
      acceptAll: true
    })
    preferenceCommunicator.sendPreferences(self)
  }

  const setPreferences = preferencesIn => {
    storePreferences({
      usage: preferencesIn.usage,
      campaigns: preferencesIn.campaigns,
      settings: preferencesIn.settings
    })
    preferenceCommunicator.sendPreferences(self)
  }

  const isPreferenceStrictlyBoolean = ([, value]) => typeof value === 'boolean'

  const getSanitisedPreferences = preferences => {
    const entries: [string, boolean][] = cookieTypes.map(cookieType => {
      const { [cookieType]: value } = preferences

      return [cookieType, value]
    }, [])

    return entries.filter(isPreferenceStrictlyBoolean)
  }

  const allThePreferences = () => fromEntries(cookieTypes.map(cookieType => [cookieType, true]))

  const getPreferences = () => {
    const cookie = Cookies.getJSON(COOKIE_CONSENT)
    if (cookie === null || cookie === undefined || cookie.preferences === undefined) {
      return undefined
    }

    const { version } = cookie
    if (version !== COOKIE_VERSION) {
      return undefined
    }

    const { preferences } = cookie
    if (preferences.acceptAll === true) {
      return allThePreferences()
    }

    const sanitisedPreferences = getSanitisedPreferences(preferences)

    return sanitisedPreferences.length > 0 ? fromEntries(sanitisedPreferences) : undefined
  }

  const getUserHasSavedCookiePreferences = () => getPreferences() !== undefined

  const sendPreferences = () => preferenceCommunicator.sendPreferences(self)

  const self = {
    userAcceptsAll,
    setPreferences,
    getUserHasSavedCookiePreferences,
    getPreferences,
    sendPreferences
  }

  return self
}

export default userPreferenceFactory
