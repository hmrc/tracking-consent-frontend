import { Communicator } from '../../types/Communicator'
import { UserPreferences } from '../../types/UserPreferences'

const optimizelyCommunicatorFactory = (window: Window): Communicator => ({
  sendPreferences: (userPreferences: UserPreferences) => {

    const setOptimizelyOptOut = (isOptOut: Boolean) => {
      window.optimizely.push({ 'type': 'optOut', isOptOut })
    }

    const setupOptimizelyIfConfigured = () => {
      const regex = /^(\/|(https:)?\/\/www\.tax\.service\.gov\.uk\/|(https:)?\/\/www\.(qa|dev|staging)\.tax\.service\.gov\.uk\/|(http:)?\/\/localhost:12345\/)tracking-consent/
      const isTruthy = x => !!x
      const scriptTags = Array.from(document.getElementsByTagName('script'))
      const trackingConsentScripts = scriptTags
        .filter(scriptTag => (scriptTag.getAttribute('src') || '')
          .match(regex))
      const optimizelyIDs = trackingConsentScripts
        .map(scriptTag => scriptTag.getAttribute('data-optimizely-id'))
        .filter(isTruthy)
      const firstTrackingConsentScriptTag = trackingConsentScripts[0]

      optimizelyIDs.forEach(optimizelyId => {
        if (!optimizelyId || !optimizelyId.match(/^\d{11}$/)) {
          console.error('Optimizely ID is malformed', optimizelyId)
        } else {
          const script = document.createElement('script')
          script.setAttribute('src', `https://cdn.optimizely.com/js/${optimizelyId}.js`)
          firstTrackingConsentScriptTag.after(script)
        }
      })
    }

    window.optimizely = window.optimizely || []
    const preferences = userPreferences.getPreferences() || {}
    if (preferences.measurement === true) {
      setOptimizelyOptOut(false)
      setupOptimizelyIfConfigured()
    } else {
      setOptimizelyOptOut(true)
    }
  }
})

export default optimizelyCommunicatorFactory
