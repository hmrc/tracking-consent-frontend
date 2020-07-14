// @ts-ignore
import Cookies from 'js-cookie'
import cookieTypes from '../constants/cookieTypes'
import fromEntries from '../common/fromEntries'
import {COOKIE_CONSENT, COOKIE_VERSION} from '../constants/cookies'
import { UserPreferences } from '../../types/UserPreferences'
import { Communicator } from '../../types/Communicator'

const userPreferencesFactory = (): UserPreferences => {

  const subscribers: Communicator[] = []

  const subscribe = (preferenceCommunicator) => {
    subscribers.push(preferenceCommunicator)
  }

  const storePreferences = (preferences) => {
    Cookies.set(COOKIE_CONSENT, {
      version: '2020.1',
      datetimeSet: new Date().toISOString(),
      preferences: preferences
    }, { sameSite: 'strict', expires: 3650 })
  }

  const userAcceptsAll = () => {
    storePreferences({
      acceptAll: true
    })
    sendPreferences()
  }

  const setPreferences = preferencesIn => {
    storePreferences({
      measurement: preferencesIn.measurement,
      marketing: preferencesIn.marketing,
      settings: preferencesIn.settings
    })
    sendPreferences()
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

  const sendPreferences = () => {
    subscribers.forEach(subscriber => subscriber.sendPreferences(self))
  }

  const self = {
    userAcceptsAll,
    setPreferences,
    getUserHasSavedCookiePreferences,
    getPreferences,
    sendPreferences,
    subscribe
  }

  return self
}

export default userPreferencesFactory
