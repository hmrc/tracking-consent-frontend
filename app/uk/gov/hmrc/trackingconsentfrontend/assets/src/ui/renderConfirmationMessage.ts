// @ts-ignore
import confirmationHtml from './confirmation';
import {
    COOKIE_BANNER_CONFIRMATION_CLASS,
    COOKIE_BANNER_CLASS,
    HIDE_BUTTON_CLASS, COOKIE_BANNER_GOV_UK_WIDTH_CONTAINER_CLASS
} from '../constants/cssClasses';
import removeElement from '../common/removeElement';
import callIfNotNull from '../common/callIfNotNull';
import confirmation from "./confirmation";
// @ts-ignore
import messages from '../../../../../../../../conf/messages.en';

const handleHideClick = (event: Event) => {
    event.preventDefault()

    const banner = document.querySelector(`.${COOKIE_BANNER_CLASS}`)
    callIfNotNull(banner, element => removeElement(element))
}

const getConfirmationMessage = (): HTMLDivElement => {
    const message = document.createElement('div')
    message.className = `${COOKIE_BANNER_CONFIRMATION_CLASS} ${COOKIE_BANNER_GOV_UK_WIDTH_CONTAINER_CLASS}`
    message.tabIndex = -1
    message.innerHTML = confirmation(messages)

    const hideButton = message.querySelector(`.${HIDE_BUTTON_CLASS}`)
    callIfNotNull(hideButton, element => element.addEventListener('click', handleHideClick))

    return message
}

const insertConfirmationMessage = (message: HTMLDivElement) => {
    const cookieBanner = document.querySelector(`.${COOKIE_BANNER_CLASS}`)
    callIfNotNull(cookieBanner, element => element.insertBefore(message, element.firstChild))
}

const renderConfirmationMessage = () => {
    const message = getConfirmationMessage()
    insertConfirmationMessage(message)
    message.focus()
}

export default renderConfirmationMessage
