import type { Preferences } from './Preferences';
import type { Communicator } from './Communicator';

export type UserPreferences = {
  userAcceptsAll: () => void,
  setPreferences: (Preferences) => void,
  getPreferences: () => Preferences,
  getUserHasSavedCookiePreferences: () => boolean,
  sendPreferences: (event: string) => void,
  subscribe: (communicator: Communicator) => void
};
