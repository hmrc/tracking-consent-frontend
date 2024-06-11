/* global spyOn */
import auditCommunicatorFactory from '../../src/interfaces/auditCommunicatorFactory';
import * as post from '../../src/common/post';
import { CONSENT_UPDATED_EVENT } from '../../src/constants/events';
// @ts-ignore
import fixture from '../fixtures/servicePageWithBannerMinimal.html';
import * as getTrackingConsentBaseUrl from '../../src/common/getTrackingConsentBaseUrl';

describe('auditCommunicator', () => {
  let testScope;
  let postSpy;
  let getTrackingConsentBaseUrlSpy;
  beforeEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = fixture;

    testScope = {};
    testScope.communicator = auditCommunicatorFactory();
    testScope.userPreferences = { getPreferences: jest.fn() };
    testScope.userPreferences.getPreferences.mockReturnValue({
      measurement: false,
      settings: false,
    });
    getTrackingConsentBaseUrlSpy = spyOn(getTrackingConsentBaseUrl, 'default').and.returnValue('https://my-example.com:1234');
    postSpy = spyOn(post, 'default');
  });

  it('should send the cookie preferences to the audit endpoint', () => {
    testScope.communicator.sendPreferences(testScope.userPreferences, CONSENT_UPDATED_EVENT);

    expect(postSpy).toHaveBeenCalledWith(
      'https://my-example.com:1234/tracking-consent/audit',
      { measurement: false, settings: false },
    );
  });

  it('should not send the cookie preferences to the audit endpoint if event is anything else', () => {
    testScope.communicator.sendPreferences(testScope.userPreferences, 'OTHER_EVENT');

    expect(postSpy).not.toHaveBeenCalled();
  });

  it('should send the cookie preferences to the local audit endpoint', () => {
    testScope.communicator.sendPreferences(testScope.userPreferences, CONSENT_UPDATED_EVENT);

    expect(postSpy).toHaveBeenCalledWith(
      'https://my-example.com:1234/tracking-consent/audit',
      { measurement: false, settings: false },
    );
  });

  it('should send the cookie preferences to the non-local audit endpoint', () => {
    getTrackingConsentBaseUrlSpy.and.returnValue('https://www.tax.service.gov.uk');

    testScope.communicator.sendPreferences(testScope.userPreferences, CONSENT_UPDATED_EVENT);

    expect(postSpy).toHaveBeenCalledWith(
      'https://www.tax.service.gov.uk/tracking-consent/audit',
      { measurement: false, settings: false },
    );
  });

  it('should send different cookie preferences to the audit endpoint', () => {
    testScope.userPreferences.getPreferences.mockReturnValue({
      measurement: false,
      settings: true,
    });
    testScope.communicator.sendPreferences(testScope.userPreferences, CONSENT_UPDATED_EVENT);

    expect(postSpy).toHaveBeenCalledWith('https://my-example.com:1234/tracking-consent/audit', {
      measurement: false,
      settings: true,
    });
  });

  it('should not send the cookie preferences if undefined', () => {
    testScope.userPreferences.getPreferences.mockReturnValue(undefined);

    testScope.communicator.sendPreferences(testScope.userPreferences, CONSENT_UPDATED_EVENT);

    expect(postSpy).not.toHaveBeenCalled();
  });
});
