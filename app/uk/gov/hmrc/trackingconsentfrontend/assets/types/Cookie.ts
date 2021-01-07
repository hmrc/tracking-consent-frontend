import type { Preferences } from './Preferences';

export type Cookie = {
  version: string,
  datetimeSet: string,
  preferences: Preferences
};
