import settingsFormHandler from './settingsFormHandler'
import userPreferenceFactory from './userPreferenceFactory'

document.addEventListener('DOMContentLoaded', () => {
  settingsFormHandler(document, userPreferenceFactory())
})
