import settingsFormHandler from '../ui/settingsFormHandler'
import pageHandler from "../common/pageHandler";
import userPreferenceFactory from "../domain/userPreferenceFactory";
import preferenceCommunicatorFactory from "../interfaces/preferenceCommunicatorFactory";
import {DEFAULT_CONTAINER_ID} from "../constants/gtm";

pageHandler(document, userPreferenceFactory(preferenceCommunicatorFactory(window)), settingsFormHandler, DEFAULT_CONTAINER_ID)