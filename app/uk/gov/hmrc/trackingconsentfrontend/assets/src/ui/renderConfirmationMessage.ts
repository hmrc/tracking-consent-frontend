// @ts-ignore
import confirmationHtml from './confirmation.html';
import { COOKIE_BANNER_CONFIRMATION_CLASS, COOKIE_BANNER_CLASS, HIDE_BUTTON_CLASS } from '../constants/cssClasses';
import removeElement from '../common/removeElement';
import callIfNotNull from '../common/callIfNotNull';

const handleHideClick = event => {
    event.preventDefault()

    const banner = document.querySelector(`.${COOKIE_BANNER_CLASS}`)
    callIfNotNull(banner, element => removeElement(element))
}

const renderConfirmationMessage = () => {
    const message = document.createElement('div')
    message.className = COOKIE_BANNER_CONFIRMATION_CLASS
    message.innerHTML = confirmationHtml

    const hideButton = message.querySelector(`.${HIDE_BUTTON_CLASS}`)
    callIfNotNull(hideButton, element => element.addEventListener('click', handleHideClick))

    const cookieBanner = document.querySelector(`.${COOKIE_BANNER_CLASS}`)
    callIfNotNull(cookieBanner, element => element.insertBefore(message, element.firstChild))
}

export default renderConfirmationMessage
