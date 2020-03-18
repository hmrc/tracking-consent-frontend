// @ts-ignore
import bannerHtml from './banner.html';

const renderBanner = (userPreference) => {
    const banner = document.createElement('div')
    banner.className = banner.className + ' cookie-banner';
    banner.innerHTML = bannerHtml
    banner.querySelectorAll('.acceptAll').forEach(acceptAllButton => {
        acceptAllButton.addEventListener('click', e => {
            e.preventDefault()
            userPreference.userAcceptsAll()
        })
    })
    const parentNode = document.body
    parentNode.insertBefore(banner, parentNode.firstChild)
}

export default renderBanner
