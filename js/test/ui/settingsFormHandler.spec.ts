// @ts-ignore
/* global spyOn */
import { getByText, fireEvent } from '@testing-library/dom';
import settingsFormHandler from '../../src/ui/settingsFormHandler';
import userPreferencesFactory from '../../src/domain/userPreferencesFactory';
import castToArray from '../../src/common/castToArray';
// @ts-ignore
import fixture from '../fixtures/settingsForm.html';
import gtmCommunicatorFactory from '../../src/interfaces/gtmCommunicatorFactory';
import * as renderSettingsSaveConfirmationMessage from '../../src/ui/renderSettingsSaveConfirmationMessage';

describe('User Preference Factory', () => {
  let testScope;
  const assume = expect;

  beforeEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = fixture;
    testScope = {};
    const allOnOptions = castToArray(document.querySelectorAll('[value=on]'));
    const allOffOptions = castToArray(document.querySelectorAll('[value=off]'));
    assume(allOnOptions.length).toBe(2);
    assume(allOffOptions.length).toBe(2);
    allOnOptions.forEach((option) => {
      assume(option.checked).toBeFalsy();
    });
    allOffOptions.forEach((option) => {
      assume(option.checked).toBeFalsy();
    });

    testScope.preferenceCommunicator = gtmCommunicatorFactory(window);
    testScope.userPref = userPreferencesFactory();
  });

  describe('Initial state', () => {
    it('should initially include the content for unsupported browsers', () => {
      expect(document.querySelectorAll('.cookie-settings__body--browser-supported').length).toEqual(0);
    });

    it('should subsequently hide the content for unsupported browsers', () => {
      settingsFormHandler(testScope.userPref);

      expect(document.querySelectorAll('.cookie-settings__body--browser-supported').length).toEqual(1);
    });

    it('should select all for user who has allowed all', () => {
      spyOn(testScope.userPref, 'getPreferences').and.returnValue({
        measurement: true,
        settings: true,
      });
      settingsFormHandler(testScope.userPref);

      expect(document.querySelector('[name=measurement][value=on]:checked')).toBeTruthy();
      expect(document.querySelector('[name=settings][value=on]:checked')).toBeTruthy();

      expect(document.querySelector('[name=measurement][value=off]:checked')).toBeFalsy();
      expect(document.querySelector('[name=settings][value=off]:checked')).toBeFalsy();
    });
    it('should select all for user who has declined all', () => {
      spyOn(testScope.userPref, 'getPreferences').and.returnValue({
        measurement: false,
        settings: false,
      });
      settingsFormHandler(testScope.userPref);

      expect(document.querySelector('[name=measurement][value=on]:checked')).toBeFalsy();
      expect(document.querySelector('[name=settings][value=on]:checked')).toBeFalsy();

      expect(document.querySelector('[name=measurement][value=off]:checked')).toBeTruthy();
      expect(document.querySelector('[name=settings][value=off]:checked')).toBeTruthy();
    });
    it('should select specific items for user who stored a varied preference', () => {
      spyOn(testScope.userPref, 'getPreferences').and.returnValue({
        measurement: true,
        settings: true,
      });
      settingsFormHandler(testScope.userPref);

      expect(document.querySelector('[name=measurement][value=on]:checked')).toBeTruthy();
      expect(document.querySelector('[name=settings][value=on]:checked')).toBeTruthy();

      expect(document.querySelector('[name=measurement][value=off]:checked')).toBeFalsy();
      expect(document.querySelector('[name=settings][value=off]:checked')).toBeFalsy();
    });
  });
  describe('saving preferences', () => {
    beforeEach(() => {
      spyOn(testScope.userPref, 'setPreferences');
      spyOn(renderSettingsSaveConfirmationMessage, 'default');
    });

    it('should save when measurement only is granted', () => {
      settingsFormHandler(testScope.userPref);

      fireEvent.click(getByText(document.body, /Use cookies that measure my website use/));
      fireEvent.click(getByText(document.body, /Save changes/));

      expect(testScope.userPref.setPreferences).toHaveBeenCalledWith({
        measurement: true,
        settings: false,
      });
    });
    it('should save when settings only is granted', () => {
      settingsFormHandler(testScope.userPref);

      fireEvent.click(getByText(document.body, /Use cookies that remember my settings on the site/));
      fireEvent.click(getByText(document.body, /Save changes/));

      expect(testScope.userPref.setPreferences).toHaveBeenCalledWith({
        measurement: false,
        settings: true,
      });
    });
    it('should not store a value for items which don\'t appear in the form', () => {
      settingsFormHandler(testScope.userPref);

      document.querySelectorAll('input[type=radio]:not([name=settings])').forEach((elem) => {
        const { parentNode } = elem;
        if (parentNode) {
          parentNode.removeChild(elem);
        }
      });

      fireEvent.click(getByText(document.body, /Do not use cookies that remember my settings on the site/));
      fireEvent.click(getByText(document.body, /Save changes/));

      expect(testScope.userPref.setPreferences).toHaveBeenCalledWith({
        settings: false,
      });
    });

    it('should call renderSaveConfirmation', () => {
      settingsFormHandler(testScope.userPref);
      assume(renderSettingsSaveConfirmationMessage.default).not.toHaveBeenCalled();

      fireEvent.click(getByText(document.body, /Save changes/));

      expect(renderSettingsSaveConfirmationMessage.default).toHaveBeenCalledTimes(1);
    });
  });
  describe('Technical details', () => {
    it('should error if the form doesn\'t have on value', () => {
      const querySelector = document.querySelector('form[data-module=cookie-settings]');
      if (querySelector) {
        querySelector.removeAttribute('data-on-value');
      }

      expect(() => {
        settingsFormHandler(testScope.userPref);
      }).toThrowError(new Error('Could not initiate form without on value being set'));
    });
    it('should error if the form doesn\'t have off value', () => {
      const querySelector = document.querySelector('form[data-module=cookie-settings]');
      if (querySelector) {
        querySelector.removeAttribute('data-off-value');
      }

      expect(() => {
        settingsFormHandler(testScope.userPref);
      }).toThrowError(new Error('Could not initiate form without off value being set'));
    });
    it('should default to the error message for the on value', () => {
      const querySelector = document.querySelector('form[data-module=cookie-settings]');
      const querySelector2 = document.querySelector('form[data-module=cookie-settings]');
      if (querySelector) {
        querySelector.removeAttribute('data-off-value');
      }
      if (querySelector2) {
        querySelector2.removeAttribute('data-on-value');
      }

      expect(() => {
        settingsFormHandler(testScope.userPref);
      }).toThrowError(new Error('Could not initiate form without on value being set'));
    });
  });
});
