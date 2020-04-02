import '../../styles/service-page.scss'
import renderBanner from '../ui/renderBanner'
import pageHandler from "../common/pageHandler";
import userPreferenceFactory from "../domain/userPreferenceFactory";
import preferenceCommunicatorFactory from "../interfaces/preferenceCommunicatorFactory";

pageHandler(userPreferenceFactory(preferenceCommunicatorFactory(window)), renderBanner)
