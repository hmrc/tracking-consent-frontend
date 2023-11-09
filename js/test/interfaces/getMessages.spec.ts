/* global spyOn */
import getMessages from '../../src/interfaces/getMessages';
import * as getLanguage from '../../src/interfaces/getLanguage';

describe('getMessages', () => {
  let getLanguageSpy;
  beforeEach(() => {
    getLanguageSpy = spyOn(getLanguage, 'default').and.returnValue('en');
  });

  it('should return English messages by default', () => {
    const messages = getMessages();

    expect(messages['cookieSettings.title']).toEqual('Cookie settings on HMRC services – GOV.UK');
  });

  it('should return Welsh messages if appropriate', () => {
    getLanguageSpy.and.returnValue('cy');

    const messages = getMessages();

    expect(messages['cookieSettings.title']).toEqual('Gosodiadau cwcis ar wasanaethau CThEF – GOV.UK');
  });
});
