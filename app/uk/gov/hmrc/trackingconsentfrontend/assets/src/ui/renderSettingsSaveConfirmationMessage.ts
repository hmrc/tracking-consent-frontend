import {COOKIE_SETTINGS_CONFIRMATION_CLASS, COOKIE_SETTINGS_WRAPPER_CLASS, GOV_UK_LINK} from "../constants/cssClasses";
// @ts-ignore
import confirmationHtml from './cookieSettingsConfirmation.html'
import callIfNotNull from "../common/callIfNotNull";
import scrollToTop from "../common/scrollToTop";
import getReferrer from "../common/getReferrer";
import {GO_BACK_TO_PREVIOUS_PAGE} from "../constants/messages";

const insertReferrerLink = (notice, referrer) => {
    const link = document.createElement('a')
    link.className = GOV_UK_LINK
    link.innerHTML = GO_BACK_TO_PREVIOUS_PAGE
    link.href = referrer
    notice.appendChild(link)
}

const insertReferrerLinkIfNecessary = (message) => {
    const referrer = getReferrer()
    if (referrer) {
        const notice = message.querySelector('.cookie-settings__notice')
        callIfNotNull(notice, element => insertReferrerLink(element, referrer))
    }
}

const getConfirmation = () => {
    const message = document.createElement('div')
    message.className = COOKIE_SETTINGS_CONFIRMATION_CLASS
    message.innerHTML = confirmationHtml
    insertReferrerLinkIfNecessary(message)
    return message
}

const insertConfirmationIfNecessary = () => {
    if (document.querySelector(`.${COOKIE_SETTINGS_CONFIRMATION_CLASS}`) === null) {
        const wrapper = document.querySelector(`.${COOKIE_SETTINGS_WRAPPER_CLASS}`)
        callIfNotNull(wrapper, element => element.insertBefore(getConfirmation(), element.firstChild))
    }
}

const renderSettingsSaveConfirmationMessage = () => {
    insertConfirmationIfNecessary()
    scrollToTop()
}

export default renderSettingsSaveConfirmationMessage
