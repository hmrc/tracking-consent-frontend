import '../../styles/settings-page.scss'
import settingsFormHandler from '../ui/settingsFormHandler'
import userPreferenceFactory from '../domain/userPreferenceFactory'
import preferenceCommunicatorFactory from "../interfaces/preferenceCommunicatorFactory"
import enableGtm from '../interfaces/gtm'

const userPreference = userPreferenceFactory(preferenceCommunicatorFactory(window))

enableGtm()
userPreference.sendPreferences()
settingsFormHandler(document, userPreference)
