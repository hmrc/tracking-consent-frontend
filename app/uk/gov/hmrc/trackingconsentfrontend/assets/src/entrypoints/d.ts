import '../common/createNonce'
import '../../styles/service-page.scss'
import {D_CONTAINER_ID} from '../constants/gtm'
import trackingPageHandlerFactory from "../common/trackingPageHandlerFactory";

trackingPageHandlerFactory(D_CONTAINER_ID)
