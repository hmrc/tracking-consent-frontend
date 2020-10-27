import '../common/createNonce'
import '../../styles/service-page.scss'
import { TRANSITIONAL_CONTAINER_ID } from '../constants/gtm'
import trackingPageHandlerFactory from "../common/trackingPageHandlerFactory";

trackingPageHandlerFactory(TRANSITIONAL_CONTAINER_ID)
