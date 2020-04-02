import { Preferences } from './Preferences'

export type UserPreferences = {
    userAcceptsAll: () => void,
    setPreferences: (Preferences) => void,
    getPreferences: () => Preferences | undefined,
    getUserHasSavedCookiePreferences: () => boolean,
    sendPreferences: () => void
}
