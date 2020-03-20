import castToArray from './castToArray'

const settingsFormHandler = (document, userPreferences) => {
  document.addEventListener('DOMContentLoaded', () => {
    userPreferences.getPreferences()
    castToArray(document.querySelectorAll('[data-module="cookie-settings"]')).forEach(cookieSettingsForm => {
      const onValue = cookieSettingsForm.getAttribute('data-on-value')
      const offValue = cookieSettingsForm.getAttribute('data-off-value')
      const currentSettings = userPreferences.getPreferences()
      if (currentSettings) {
        Object.keys(currentSettings).forEach(setting => {
          const isOn = currentSettings[setting]
          cookieSettingsForm.querySelectorAll('input[name=' + setting + '][value=' + (isOn ? onValue : offValue) + ']').forEach(option => {
            option.checked = true
          })
        })
      }

      cookieSettingsForm.addEventListener('submit', (e) => {
        e.preventDefault()
        userPreferences.setPreferences({
          usage: !!cookieSettingsForm.querySelector('input[name=usage][value=' + onValue + ']').checked,
          campaigns: !!cookieSettingsForm.querySelector('input[name=campaigns][value=' + onValue + ']').checked,
          settings: !!cookieSettingsForm.querySelector('input[name=settings][value=' + onValue + ']').checked
        })
      })
    })
  })
}

export default settingsFormHandler
