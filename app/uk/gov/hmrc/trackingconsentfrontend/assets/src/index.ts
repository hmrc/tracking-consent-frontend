import '../styles/styles.scss'
import renderBanner from './ui/renderBanner'
import enableGtm from './enableGtm'

enableGtm()
document.addEventListener('DOMContentLoaded', () => {
  renderBanner()
})
