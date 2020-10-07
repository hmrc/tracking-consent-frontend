import '../common/createNonce'
import '../../styles/service-page.scss'
import {F_CONTAINER_ID} from '../constants/gtm'
import trackingPageHandlerFactory from "../common/trackingPageHandlerFactory";

trackingPageHandlerFactory(F_CONTAINER_ID)
