// @ts-ignore
import bannerHtml from './banner.html';
import renderConfirmationMessage from './renderConfirmationMessage';
import {
    COOKIE_BANNER_QUESTION_CLASS,
    COOKIE_BANNER_CLASS,
    ACCEPT_ALL_CLASS,
    GOV_UK_SKIP_LINK_CLASS, SKIP_LINK_CONTAINER_ID
} from '../constants/cssClasses';
import removeElement from '../common/removeElement';
import callIfNotNull from '../common/callIfNotNull';
import {UserPreferences} from "../../types/UserPreferences";

const renderBanner = (userPreference: UserPreferences) => {

    const handleAcceptAllClick = (event: Event) => {
        event.preventDefault()

        userPreference.userAcceptsAll()
        renderConfirmationMessage()
        hideQuestion()
    }

    const hideQuestion = () => {
        const question = document.querySelector(`.${COOKIE_BANNER_QUESTION_CLASS}`)
        callIfNotNull(question, element => removeElement(question))
    }

    const insertAtTopOfBody = (banner: HTMLElement) => {
        const parentNode = document.body
        parentNode.insertBefore(banner, parentNode.firstChild)
    }

    const insertAfterSkipLink = (banner: HTMLElement) => {
        const skipLink = document.querySelector(`#${SKIP_LINK_CONTAINER_ID}, .${GOV_UK_SKIP_LINK_CLASS}`)
        if (skipLink !== null) {
            skipLink.insertAdjacentElement('afterend', banner)
        } else {
            insertAtTopOfBody(banner)
        }
    }

    const insertBanner = () => {
        const banner = document.createElement('div')
        banner.className = COOKIE_BANNER_CLASS;
        banner.innerHTML = bannerHtml
        banner.setAttribute('role', 'region')
        banner.setAttribute('aria-label', 'Cookie Banner')
        const acceptAllButton = banner.querySelector(`.${ACCEPT_ALL_CLASS}`)
        callIfNotNull(acceptAllButton, element => element.addEventListener('click', handleAcceptAllClick))

        insertAfterSkipLink(banner)
    }

    if (!userPreference.getUserHasSavedCookiePreferences()) {
        insertBanner()
    }
}

export default renderBanner
