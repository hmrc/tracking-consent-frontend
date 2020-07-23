import '../common/createNonce'
import '../../styles/service-page.scss'
import renderBanner from '../ui/renderBanner'
import pageHandler from '../common/pageHandler'
import {DEFAULT_CONTAINER_ID} from '../constants/gtm'
import subscribedUserPreferencesFactory from '../domain/subscribedUserPreferencesFactory'

pageHandler(document, subscribedUserPreferencesFactory(window), renderBanner, DEFAULT_CONTAINER_ID)
