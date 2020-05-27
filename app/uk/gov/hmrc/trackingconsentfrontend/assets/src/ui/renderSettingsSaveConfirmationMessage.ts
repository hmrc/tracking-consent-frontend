import {
    COOKIE_SETTINGS_NOTICE_CLASS,
    GOV_UK_BODY_CLASS, GOV_UK_LINK_CLASS,
    COOKIE_SETTINGS_NOTICE_WRAPPER_CLASS, COOKIE_SETTINGS_CONFIRMATION_CLASS
} from "../constants/cssClasses";
// @ts-ignore
import callIfNotNull from "../common/callIfNotNull";
import scrollToTop from "../common/scrollToTop";
import getReferrer from "../common/getReferrer";
// @ts-ignore
import messages from '../../../../../../../../conf/messages.en';
import getPathname from "../common/getPathname";
import focusIfNotNull from "../common/focusIfNotNull";
import cookieSettingsConfirmation from "./cookieSettingsConfirmation"

const getReferrerLink = (referrer): HTMLAnchorElement => {
    const link = document.createElement('a')
    link.className = GOV_UK_LINK_CLASS
    link.innerHTML = messages['cookieSettings.saveConfirmation.link.text']
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

const insertReferrerLinkIfNecessary = (message: HTMLElement) => {
    const referrer = getReferrer()
    if (referrer && referrer !== getPathname()) {
        const notice = message.querySelector(`.${COOKIE_SETTINGS_NOTICE_CLASS}`)
        callIfNotNull(notice, element => insertReferrerLink(element, referrer))
    }
}

const getConfirmation = (): HTMLElement => {
    const message = document.createElement('div')
    message.className = COOKIE_SETTINGS_CONFIRMATION_CLASS
    message.innerHTML = cookieSettingsConfirmation(messages)
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
