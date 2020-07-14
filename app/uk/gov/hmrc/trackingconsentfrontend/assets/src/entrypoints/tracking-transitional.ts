import '../../styles/service-page.scss'
import renderBanner from '../ui/renderBanner'
import pageHandler from '../common/pageHandler'
import {TRANSITIONAL_CONTAINER_ID} from '../constants/gtm'
import subscribedUserPreferencesFactory from '../domain/subscribedUserPreferencesFactory'

pageHandler(document, subscribedUserPreferencesFactory(window), renderBanner, TRANSITIONAL_CONTAINER_ID)
