import callIfNotNull from '../common/callIfNotNull'
import { UserPreferences } from '../../types/UserPreferences'
import fromEntries from '../common/fromEntries'

const cookieTypes = ['usage', 'campaigns', 'settings']

const setAsChecked = element => {
  element.checked = true
}

const hydrateForm = (userPreferences: UserPreferences) => (form: HTMLFormElement) => {
  const onValue = form.getAttribute('data-on-value')
  const offValue = form.getAttribute('data-off-value')
  const preferences = userPreferences.getPreferences()

  if (!onValue) {
    throw new Error('Could not initiate form without on value being set')
  }
  if (!offValue) {
    throw new Error('Could not initiate form without off value being set')
  }

  const mapPreferencesToForm = () => {
    if (!preferences) {
      return
    }
    cookieTypes.forEach(cookieType => {
      const preference = preferences[cookieType]
      if (preference !== undefined) {
        const radioValue = preference ? onValue : offValue

        const input: HTMLInputElement | null = form.querySelector(`input[name=${cookieType}][value=${radioValue}]`)
        callIfNotNull(input, setAsChecked)
      }
    })
  }

  const mapFormToPreferences = () => {
    const entries: [string, boolean][] = cookieTypes.reduce((accumulator, cookieType) => {
      const onInput: HTMLInputElement | null = form.querySelector(`input[name=${cookieType}][value=${onValue}`)
      const offInput: HTMLInputElement | null = form.querySelector(`input[name=${cookieType}][value=${offValue}`)

      // If form inputs are missing or user has not specified consent either way, do not set a preference,
      // Otherwise the preference is determined by checking whether the on input is checked
      return onInput === null || offInput === null || (!onInput.checked && !offInput.checked)
        ? accumulator
        : [...accumulator, [cookieType, onInput.checked]]
    }, [])

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
  document.addEventListener('DOMContentLoaded', () => {
    const cookieSettingsForm = document.querySelector('[data-module="cookie-settings"]')
    callIfNotNull(cookieSettingsForm, hydrateForm(userPreferences))
  })
}

export default settingsFormHandler
