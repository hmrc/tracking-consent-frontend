import '../common/createNonce'
import '../../styles/service-page.scss'
import {B_CONTAINER_ID} from '../constants/gtm'
import trackingPageHandlerFactory from "../common/trackingPageHandlerFactory";

trackingPageHandlerFactory(B_CONTAINER_ID)
