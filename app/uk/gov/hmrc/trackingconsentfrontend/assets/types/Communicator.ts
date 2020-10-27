import { UserPreferences } from './UserPreferences'

export type Communicator = {
  sendPreferences: (userPreferences: UserPreferences, event: string) => void
}
