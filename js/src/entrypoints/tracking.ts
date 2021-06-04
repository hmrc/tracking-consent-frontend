import '../common/createNonce';
import '../../styles/service-page.scss';
import pageHandler from '../common/pageHandler';
import subscribedUserPreferencesFactory from '../domain/subscribedUserPreferencesFactory';
import renderBanner from '../ui/renderBanner';

pageHandler(document, subscribedUserPreferencesFactory(window), renderBanner);
