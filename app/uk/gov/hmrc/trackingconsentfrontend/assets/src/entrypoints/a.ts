import '../common/createNonce'
import '../../styles/service-page.scss'
import { A_CONTAINER_ID } from '../constants/gtm'
import trackingPageHandlerFactory from "../common/trackingPageHandlerFactory";

trackingPageHandlerFactory(A_CONTAINER_ID)
