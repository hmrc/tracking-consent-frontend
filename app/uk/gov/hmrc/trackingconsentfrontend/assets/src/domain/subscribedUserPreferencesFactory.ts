import { UserPreferences } from '../../types/UserPreferences'
import userPreferencesFactory from './userPreferencesFactory'
import gtmCommunicatorFactory from '../interfaces/gtmCommunicatorFactory'
import optimizelyCommunicatorFactory from '../interfaces/optimizelyCommunicatorFactory'

const subscribedUserPreferencesFactory = (window): UserPreferences => {
  const userPreferences = userPreferencesFactory()
  userPreferences.subscribe(gtmCommunicatorFactory(window))
  userPreferences.subscribe(optimizelyCommunicatorFactory(window))
  return userPreferences
}

export default subscribedUserPreferencesFactory
