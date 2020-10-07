import '../common/createNonce'
import '../../styles/service-page.scss'
import {SDES_CONTAINER_ID} from '../constants/gtm'
import trackingPageHandlerFactory from "../common/trackingPageHandlerFactory";

trackingPageHandlerFactory(SDES_CONTAINER_ID)
