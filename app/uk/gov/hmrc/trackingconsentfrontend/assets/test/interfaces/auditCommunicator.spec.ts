/* global spyOn */
import auditCommunicatorFactory from '../../src/interfaces/auditCommunicatorFactory'
import * as post from '../../src/common/post'
import { CONSENT_UPDATED_EVENT } from '../../src/constants/events'
// @ts-ignore
import fixture from '../fixtures/servicePageWithBannerMinimal.html'

describe('auditCommunicator', () => {
  let testScope
  let postSpy
  beforeEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = fixture

    testScope = {}
    testScope.communicator = auditCommunicatorFactory()
    testScope.userPreferences = { getPreferences: jest.fn() }
    testScope.userPreferences.getPreferences.mockReturnValue({
      measurement: false,
      marketing: false,
      settings: false
    })
    postSpy = spyOn(post, 'default')
    delete window.location
    // @ts-ignore
    window.location = {
      host: 'www.tax.service.gov.uk'
    }
  })

  it('should send the cookie preferences to the audit endpoint', () => {
    testScope.communicator.sendPreferences(testScope.userPreferences, CONSENT_UPDATED_EVENT)

    expect(postSpy).toHaveBeenCalledWith('/tracking-consent/audit',
      { marketing: false, measurement: false, settings: false })
  })

  it('should not send the cookie preferences to the audit endpoint if event is anything else', () => {
    testScope.communicator.sendPreferences(testScope.userPreferences, 'OTHER_EVENT')

    expect(postSpy).not.toHaveBeenCalled()
  })

  it('should send the cookie preferences to the local audit endpoint', () => {
    // @ts-ignore
    window.location = {
      host: 'localhost:9000'
    }

    testScope.communicator.sendPreferences(testScope.userPreferences, CONSENT_UPDATED_EVENT)

    expect(postSpy).toHaveBeenCalledWith('http://localhost:12345/tracking-consent/audit',
      { marketing: false, measurement: false, settings: false }
    )
  })

  it('should send different cookie preferences to the audit endpoint', () => {
    testScope.userPreferences.getPreferences.mockReturnValue({
      measurement: false,
      marketing: true,
      settings: false
    })
    testScope.communicator.sendPreferences(testScope.userPreferences, CONSENT_UPDATED_EVENT)

    expect(postSpy).toHaveBeenCalledWith('/tracking-consent/audit', {
      measurement: false,
      marketing: true,
      settings: false
    })
  })

  it('should not send the cookie preferences if undefined', () => {
    testScope.userPreferences.getPreferences.mockReturnValue(undefined)

    testScope.communicator.sendPreferences(testScope.userPreferences, CONSENT_UPDATED_EVENT)

    expect(postSpy).not.toHaveBeenCalled()
  })
})
