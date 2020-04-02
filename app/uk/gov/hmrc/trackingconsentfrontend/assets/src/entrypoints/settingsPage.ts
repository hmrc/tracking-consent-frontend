import '../../styles/settings-page.scss'
import settingsFormHandler from '../ui/settingsFormHandler'
import pageHandler from "../common/pageHandler";
import userPreferenceFactory from "../domain/userPreferenceFactory";
import preferenceCommunicatorFactory from "../interfaces/preferenceCommunicatorFactory";

pageHandler(userPreferenceFactory(preferenceCommunicatorFactory(window)), settingsFormHandler)