import { Communicator } from '../../types/Communicator'
import { UserPreferences } from '../../types/UserPreferences'

const optimizelyCommunicatorFactory = (window: Window): Communicator => ({
  sendPreferences: (userPreferences: UserPreferences) => {

    const setOptimizelyOptOut = (optOut: Boolean) => {
      window.optimizely.push({ 'type': 'optOut', 'isOptOut': optOut });
    }

    window.optimizely = window.optimizely || [];
    const preferences = userPreferences.getPreferences() || {}
    preferences.measurement === true ? setOptimizelyOptOut(false) : setOptimizelyOptOut(true)
  }
})

export default optimizelyCommunicatorFactory
