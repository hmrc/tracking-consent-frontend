const castToArray = nodeList => Array.prototype.slice.apply(nodeList)

document.addEventListener('DOMContentLoaded', () => {
  castToArray(document.querySelectorAll('[data-module="cookie-settings"]')).forEach(cookieSettingsForm => {
    const onValue = cookieSettingsForm.getAttribute('data-on-value')
    const offValue = cookieSettingsForm.getAttribute('data-off-value')
    console.log('found a cookie settings form.', cookieSettingsForm, onValue, offValue)
  })
})
