import pageHandler from "./pageHandler";
import subscribedUserPreferencesFactory from "../domain/subscribedUserPreferencesFactory";
import renderBanner from "../ui/renderBanner";

const trackingPageHandlerFactory = (containerId) => pageHandler(document, subscribedUserPreferencesFactory(window), renderBanner, containerId)

export default trackingPageHandlerFactory