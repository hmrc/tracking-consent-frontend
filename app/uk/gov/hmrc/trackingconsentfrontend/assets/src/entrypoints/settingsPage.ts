import settingsFormHandler from '../ui/settingsFormHandler'
import pageHandler from '../common/pageHandler'
import {DEFAULT_CONTAINER_ID} from '../constants/gtm'
import subscribedUserPreferencesFactory from '../domain/subscribedUserPreferencesFactory'

pageHandler(document, subscribedUserPreferencesFactory(window), settingsFormHandler, DEFAULT_CONTAINER_ID)