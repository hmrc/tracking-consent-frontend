import {
    COOKIE_SETTINGS_NOTICE_CLASS,
    GOV_UK_BODY_CLASS, GOV_UK_LINK_CLASS,
    COOKIE_SETTINGS_NOTICE_WRAPPER_CLASS
} from "../constants/cssClasses";
// @ts-ignore
import confirmationHtml from './cookieSettingsConfirmation.html'
import callIfNotNull from "../common/callIfNotNull";
import scrollToTop from "../common/scrollToTop";
import getReferrer from "../common/getReferrer";
import {GO_BACK_TO_PREVIOUS_PAGE} from "../constants/messages";
import getPathname from "../common/getPathname";
import focusIfNotNull from "../common/focusIfNotNull";

const getReferrerLink = (referrer): HTMLAnchorElement => {
    const link = document.createElement('a')
    link.className = GOV_UK_LINK_CLASS
    link.innerHTML = GO_BACK_TO_PREVIOUS_PAGE
    link.href = referrer
    return link
}

const getParagraph = (link): HTMLParagraphElement => {
    const paragraph = document.createElement('p')
    paragraph.className = GOV_UK_BODY_CLASS
    paragraph.appendChild(link)
    return paragraph
}

const insertReferrerLink = (notice: HTMLElement, referrer: string) => {
    const link = getReferrerLink(referrer)
    const paragraph = getParagraph(link)
    notice.appendChild(paragraph)
}

const insertReferrerLinkIfNecessary = (notice: HTMLElement) => {
    const referrer = getReferrer()
    if (referrer && referrer !== getPathname()) {
        insertReferrerLink(notice, referrer)
    }
}

const getConfirmation = (): HTMLElement => {
    const message = document.createElement('section')
    message.className = COOKIE_SETTINGS_NOTICE_CLASS
    message.tabIndex = -1
    message.setAttribute('role', 'region')
    message.setAttribute('aria-label', 'Notice')
    message.innerHTML = confirmationHtml
    insertReferrerLinkIfNecessary(message)
    return message
}

const queryConfirmation = (): HTMLElement | null => document.querySelector(`.${COOKIE_SETTINGS_NOTICE_CLASS}`)

const insertConfirmation = () => {
    const wrapper = document.querySelector(`.${COOKIE_SETTINGS_NOTICE_WRAPPER_CLASS}`)
    callIfNotNull(wrapper, element => element.insertBefore(getConfirmation(), element.firstChild))
}

const insertConfirmationIfNecessary = () => {
    let confirmation = queryConfirmation()
    if (confirmation === null) {
        insertConfirmation()
    }
}

const scrollToConfirmation = () => {
    focusIfNotNull(queryConfirmation())
    scrollToTop()
}

const renderSettingsSaveConfirmationMessage = () => {
    insertConfirmationIfNecessary()
    scrollToConfirmation()
}

export default renderSettingsSaveConfirmationMessage
