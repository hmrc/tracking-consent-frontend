import callIfNotNull from '../common/callIfNotNull';
import { UserPreferences } from '../../types/UserPreferences';
import fromEntries from '../common/fromEntries';
import cookieTypes from '../constants/cookieTypes';
import renderSettingsSaveConfirmationMessage from './renderSettingsSaveConfirmationMessage';

const setAsChecked = (element) => {
  // eslint-disable-next-line no-param-reassign
  element.checked = true;
};

const hydrateForm = (userPreferences: UserPreferences) => (form: HTMLFormElement) => {
  const onValue = form.getAttribute('data-on-value');
  const offValue = form.getAttribute('data-off-value');
  const preferences = userPreferences.getPreferences();

  if (!onValue) {
    throw new Error('Could not initiate form without on value being set');
  }
  if (!offValue) {
    throw new Error('Could not initiate form without off value being set');
  }

  const mapPreferencesToForm = () => {
    cookieTypes.forEach((cookieType) => {
      const radioValue = preferences[cookieType] ? onValue : offValue;

      const input: HTMLInputElement | null = form.querySelector(`input[name=${cookieType}][value=${radioValue}]`);
      callIfNotNull(input, setAsChecked);
    });
  };

  const mapFormToPreferences = () => {
    const entries: [string, boolean][] = cookieTypes.reduce((accumulator, cookieType) => {
      const onInput: HTMLInputElement | null = form.querySelector(`input[name=${cookieType}][value=${onValue}]`);
      const offInput: HTMLInputElement | null = form.querySelector(`input[name=${cookieType}][value=${offValue}]`);

      // If form inputs are missing or user has not specified consent either way,
      // do not set a preference, otherwise the preference is determined by
      // checking whether the on input is checked
      return onInput === null || offInput === null || (!onInput.checked && !offInput.checked)
        ? accumulator
        : [...accumulator, [cookieType, onInput.checked]];
    }, []);

    return fromEntries(entries);
  };

  const submitHandler = (event: InputEvent) => {
    event.preventDefault();

    userPreferences.setPreferences(mapFormToPreferences());
    renderSettingsSaveConfirmationMessage();
  };

  mapPreferencesToForm();
  form.addEventListener('submit', submitHandler);
};

const hideUnsupportedBrowserContent = () => {
  document.body.className = `${document.body.className} cookie-settings__body--browser-supported`;
};

const settingsFormHandler: (UserPreferences) => void = (userPreferences) => {
  hideUnsupportedBrowserContent();
  const cookieSettingsForm = document.querySelector('[data-module="cookie-settings"]');
  callIfNotNull(cookieSettingsForm, hydrateForm(userPreferences));
};

export default settingsFormHandler;
