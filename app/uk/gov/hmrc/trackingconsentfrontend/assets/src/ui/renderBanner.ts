// @ts-ignore
import bannerHtml from './banner.html';
import renderConfirmationMessage from './renderConfirmationMessage';
import { COOKIE_BANNER_QUESTION_CLASS, COOKIE_BANNER_CLASS, ACCEPT_ALL_CLASS } from '../constants/cssClasses';
import removeElement from '../common/removeElement';
import callIfNotNull from '../common/callIfNotNull';

const handleAcceptAllClick = userPreference => event => {
    event.preventDefault()

    userPreference.userAcceptsAll()
    renderConfirmationMessage()
    hideQuestion()
}

const hideQuestion = () => {
    const question = document.querySelector(`.${COOKIE_BANNER_QUESTION_CLASS}`)
    callIfNotNull(question, element => removeElement(question))
}

const insertBanner = (userPreference) => {
    const banner = document.createElement('div')
    banner.className = COOKIE_BANNER_CLASS;
    banner.innerHTML = bannerHtml
    const acceptAllButton = banner.querySelector(`.${ACCEPT_ALL_CLASS}`)
    callIfNotNull(acceptAllButton, element => element.addEventListener('click', handleAcceptAllClick(userPreference)))

    const parentNode = document.body
    parentNode.insertBefore(banner, parentNode.firstChild)
}

const renderBanner = (userPreference) => {
    if (!userPreference.getUserHasSavedCookiePreferences()) {
        insertBanner(userPreference)
    }
}

export default renderBanner
