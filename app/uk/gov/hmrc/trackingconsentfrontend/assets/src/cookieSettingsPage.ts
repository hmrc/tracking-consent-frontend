import userPreferenceFactory from './userPreferenceFactory'
const castToArray = nodeList => Array.prototype.slice.apply(nodeList)

document.addEventListener('DOMContentLoaded', () => {
  castToArray(document.querySelectorAll('[data-module="cookie-settings"]')).forEach(cookieSettingsForm => {
    const onValue = cookieSettingsForm.getAttribute('data-on-value')
    const offValue = cookieSettingsForm.getAttribute('data-off-value')
    const currentSettings = userPreferenceFactory().getPreferences()
    if (currentSettings) {
      Object.keys(currentSettings).forEach(setting => {
        const isOn = currentSettings[setting]
        cookieSettingsForm.querySelectorAll('input[name=' + setting + '][value=' + (isOn ? onValue : offValue) + ']').forEach(option => {
          option.checked = true
        })
      })
    }
  })
})
