// @ts-ignore
import bannerHtml from './banner.html';

const renderBanner = () => {
    const banner = document.createElement('div')
    banner.className = banner.className + ' cookie-banner';
    banner.innerHTML = bannerHtml
    const parentNode = document.body
    parentNode.insertBefore(banner, parentNode.firstChild)
}

export default renderBanner
