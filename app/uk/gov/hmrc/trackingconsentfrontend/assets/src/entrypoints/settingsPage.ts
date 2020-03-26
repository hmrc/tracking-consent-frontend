import '../../styles/settings.scss'
import settingsFormHandler from '../ui/settingsFormHandler'
import userPreferenceFactory from '../domain/userPreferenceFactory'

settingsFormHandler(document, userPreferenceFactory())
