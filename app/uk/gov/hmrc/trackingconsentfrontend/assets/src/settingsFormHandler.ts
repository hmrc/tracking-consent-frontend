import callIfNotNull from './common/callIfNotNull'
import { UserPreferences } from '../types/UserPreferences'
import fromEntries from './common/fromEntries'

const cookieTypes = ['usage', 'campaigns', 'settings']

const setAsChecked = element => {
  element.checked = true
}

const hydrateForm = (userPreferences: UserPreferences) => (form: HTMLFormElement) => {
  const onValue = form.getAttribute('data-on-value') || ''
  const offValue = form.getAttribute('data-off-value') || ''
  const preferences = userPreferences.getPreferences()

  const mapPreferencesToForm = () => {
    if (!preferences) {
      return
    }
    cookieTypes.forEach(cookieType => {
      const radioValue = preferences[cookieType] ? onValue : offValue

      const input: HTMLInputElement | null = form.querySelector(`input[name=${cookieType}][value=${radioValue}]`)
      callIfNotNull(input, setAsChecked)
    })
  }

  const mapFormToPreferences = () => {
    const entries: [string, boolean][] = cookieTypes.map(cookieType => {
      const input: HTMLInputElement | null = form.querySelector(`input[name=${cookieType}][value=${onValue}`)
      return [cookieType, input !== null ? input.checked : false]
    })

    return fromEntries(entries)
  }

  const submitHandler = (event: InputEvent) => {
    event.preventDefault()

    userPreferences.setPreferences(mapFormToPreferences())
  }

  mapPreferencesToForm()
  form.addEventListener('submit', submitHandler)
}

const settingsFormHandler: (HTMLDocument, UserPreferences) => void = (document, userPreferences) => {
  const cookieSettingsForm = document.querySelector('[data-module="cookie-settings"]')
  callIfNotNull(cookieSettingsForm, hydrateForm(userPreferences))
}

export default settingsFormHandler
