import settingsFormHandler from '../ui/settingsFormHandler'
import pageHandler from '../common/pageHandler'
import subscribedUserPreferencesFactory from '../domain/subscribedUserPreferencesFactory'

pageHandler(document, subscribedUserPreferencesFactory(window), settingsFormHandler)
