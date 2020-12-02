import { Preferences } from './Preferences';
import { Communicator } from './Communicator';

export type UserPreferences = {
    userAcceptsAll: () => void,
    setPreferences: (Preferences) => void,
    getPreferences: () => Preferences | undefined,
    getUserHasSavedCookiePreferences: () => boolean,
    sendPreferences: (event: string) => void,
    subscribe: (communicator: Communicator) => void
}
