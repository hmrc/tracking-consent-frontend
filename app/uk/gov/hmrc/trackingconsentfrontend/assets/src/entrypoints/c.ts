import '../common/createNonce'
import '../../styles/service-page.scss'
import {C_CONTAINER_ID} from '../constants/gtm'
import trackingPageHandlerFactory from "../common/trackingPageHandlerFactory";

trackingPageHandlerFactory(C_CONTAINER_ID)
