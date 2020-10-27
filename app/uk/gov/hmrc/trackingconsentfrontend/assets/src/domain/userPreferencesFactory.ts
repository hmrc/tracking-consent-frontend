import Cookies from 'js-cookie'
import cookieTypes from '../constants/cookieTypes'
import fromEntries from '../common/fromEntries'
import { COOKIE_CONSENT, COOKIE_VERSION } from '../constants/cookies'
import { UserPreferences } from '../../types/UserPreferences'
import { Communicator } from '../../types/Communicator'
import { Preferences } from '../../types/Preferences'
import { CONSENT_UPDATED_EVENT } from "../constants/events";

const userPreferencesFactory = (): UserPreferences => {

  const subscribers: Communicator[] = []

  const subscribe = (preferenceCommunicator: Communicator) => {
    subscribers.push(preferenceCommunicator)
  }

  const storePreferences = (preferences: Preferences) => {
    Cookies.set(
      COOKIE_CONSENT,
      {
        version: '2020.1',
        datetimeSet: new Date().toISOString(),
        preferences
      },
      { sameSite: 'strict', expires: 3650 }
    )
  }

  const userAcceptsAll = () => {
    storePreferences({
      acceptAll: true
    })
    sendPreferences(CONSENT_UPDATED_EVENT)
  }

  const setPreferences = (preferencesIn: Preferences) => {
    storePreferences({
      measurement: preferencesIn.measurement,
      marketing: preferencesIn.marketing,
      settings: preferencesIn.settings
    })
    sendPreferences(CONSENT_UPDATED_EVENT)
  }

  const isPreferenceStrictlyBoolean = ([, value]) => typeof value === 'boolean'

  const getSanitisedPreferences = (preferences: any) => {
    const entries: [string, boolean][] = cookieTypes.map((cookieType: string) => {
      const { [cookieType]: value } = preferences

      return [cookieType, value]
    }, [])

    return entries.filter(isPreferenceStrictlyBoolean)
  }

  const allThePreferences = () => fromEntries(cookieTypes.map((cookieType: string) => [cookieType, true]))

  const getPreferences = (): Preferences | undefined => {
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

  const sendPreferences = (event: string) => {
    subscribers.forEach((subscriber: Communicator) => subscriber.sendPreferences(self, event))
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
