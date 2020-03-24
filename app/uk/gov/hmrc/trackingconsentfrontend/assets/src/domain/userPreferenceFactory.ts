// @ts-ignore
import Cookies from 'js-cookie'
import cookieTypes from '../constants/cookieTypes'
import fromEntries from '../common/fromEntries'
import { COOKIE_CONSENT } from '../constants/cookies'

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
}

const setPreferences = preferencesIn => {
  storePreferences({
    usage: preferencesIn.usage,
    campaigns: preferencesIn.campaigns,
    settings: preferencesIn.settings
  })
}

const sanitizePreferences = preferences => {
  const entries: [string, boolean][] = cookieTypes.reduce((accumulator, cookieType) => {
    const { [cookieType]: value } = preferences

    // If value is strictly not boolean, then do not assume either way
    // Otherwise, return boolean as-is
    return typeof value !== 'boolean' ? accumulator : [...accumulator, [cookieType, value]]
  }, [])

  return fromEntries(entries)
}

const allThePreferences = () => fromEntries(cookieTypes.map(cookieType => [cookieType, true]))

const getPreferences = () => {
  const cookie = Cookies.getJSON(COOKIE_CONSENT)
  if (cookie === null || cookie === undefined || cookie.preferences === undefined) {
    return undefined
  }

  // If user has 'Accepted All', then return all categories as true
  // regardless of whether new categories have been added since they
  // originally accepted all
  const { preferences } = cookie
  if (preferences.acceptAll === true) {
    return allThePreferences()
  }

  // Otherwise sanitize preferences
  return sanitizePreferences(preferences)
}

const getUserHasSavedCookiePreferences = () => getPreferences() !== undefined

const userPreferenceFactory = () => ({
  userAcceptsAll,
  setPreferences,
  getUserHasSavedCookiePreferences,
  getPreferences
})

export default userPreferenceFactory
