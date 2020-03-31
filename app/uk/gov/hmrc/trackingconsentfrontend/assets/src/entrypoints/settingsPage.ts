import '../../styles/settings-page.scss'
import settingsFormHandler from '../ui/settingsFormHandler'
import userPreferenceFactory from '../domain/userPreferenceFactory'

settingsFormHandler(document, userPreferenceFactory())
