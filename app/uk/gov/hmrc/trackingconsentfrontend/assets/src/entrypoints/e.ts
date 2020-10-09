import '../common/createNonce'
import '../../styles/service-page.scss'
import {E_CONTAINER_ID} from '../constants/gtm'
import trackingPageHandlerFactory from "../common/trackingPageHandlerFactory";

trackingPageHandlerFactory(E_CONTAINER_ID)
