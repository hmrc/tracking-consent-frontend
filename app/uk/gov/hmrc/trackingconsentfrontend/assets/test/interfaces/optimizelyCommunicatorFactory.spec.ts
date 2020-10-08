import optimizelyCommunicatorFactory from '../../src/interfaces/optimizelyCommunicatorFactory'

describe('sendPreferences', () => {
  let testScope

  const getScripts = () => Array.from(document.getElementsByTagName('script'))
  const getScriptSrcs = () => getScripts().map(e => e.getAttribute('src'))
  const exampleTCScriptURL = '/tracking-consent/tracking.js'

  const setupScriptWithID = (id, scriptSrc: string) => {
    const originalScripts = getScripts()
    const head = document.getElementsByTagName('head')[0]
    const scriptTagWithAttr = document.createElement('script')
    if (scriptSrc) {
      scriptTagWithAttr.setAttribute('src', scriptSrc)
    }
    if (id) {
      scriptTagWithAttr.setAttribute('data-optimizely-id', id)
    }
    head.appendChild(scriptTagWithAttr)

    return {
      trigger: () => {
        testScope.userPreferences.getPreferences.mockReturnValue({
          measurement: true,
          marketing: false,
          settings: false
        })
        testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences)
      },
      cleanup: () => {
        getScripts()
          .forEach(script => {
            if (!originalScripts.includes(script)) {
              (script.parentNode || document.createElement('div')).removeChild(script)
            }
          })
      }
    }
  }

  beforeEach(() => {
    testScope = { window: {} }
    testScope.preferenceCommunicator = optimizelyCommunicatorFactory(testScope.window)
    testScope.userPreferences = { getPreferences: jest.fn() }
    testScope.userPreferences.getPreferences.mockReturnValue({
      measurement: false,
      marketing: false,
      settings: false
    })
    jest.spyOn(console, 'error')
  })

  it('should set optOut to true when measurement is set to false', () => {
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences)
    expect(testScope.window.optimizely).toEqual([
      { type: 'optOut', isOptOut: true }
    ])
  })

  it('should set optOut to false when measurement setting is set to true', () => {
    testScope.userPreferences.getPreferences.mockReturnValue({
      measurement: true,
      marketing: false,
      settings: false
    })
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences)
    expect(testScope.window.optimizely).toEqual([
      { type: 'optOut', isOptOut: false }
    ])
  })

  it('should add to existing optimizely array where it already exists', () => {
    testScope.window.optimizely = [{ event: 'some-prior-event' }]
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences)
    expect(testScope.window.optimizely).toEqual([
      { event: 'some-prior-event' },
      { type: 'optOut', isOptOut: true }
    ])
  })

  it('should not replace the existing Optimizely array when adding events', () => {
    testScope.window.optimizely = []
    const originalOptimizely = testScope.window.optimizely
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences)
    expect(testScope.window.optimizely).toStrictEqual(originalOptimizely)
  })

  it('should ignore any measurement values which are not boolean true', () => {
    testScope.userPreferences.getPreferences.mockReturnValue({
      measurement: 'yes',
      marketing: 'no',
      settings: 'maybe'
    })
    testScope.preferenceCommunicator.sendPreferences((testScope.userPreferences))
    expect(testScope.window.optimizely).toEqual([
      { type: 'optOut', isOptOut: true }
    ])
  })

  it('should set opt out to true when no preferences are stored', () => {
    testScope.userPreferences.getPreferences.mockReturnValue(undefined)
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences)

    expect(testScope.window.optimizely).toEqual([
      { type: 'optOut', isOptOut: true }
    ])
  })

  it('should setup optimizely when configured', () => {
    const control = setupScriptWithID('12345678901', exampleTCScriptURL)
    control.trigger()

    expect(getScriptSrcs())
      .toEqual([
        exampleTCScriptURL,
        'https://cdn.optimizely.com/js/12345678901.js'
      ])
    expect(console.error).not.toHaveBeenCalled()

    control.cleanup()
  })

  it('should setup optimizely when configured', () => {
    const control = setupScriptWithID('98765432109', exampleTCScriptURL)
    control.trigger()

    expect(getScriptSrcs())
      .toEqual([
        exampleTCScriptURL,
        'https://cdn.optimizely.com/js/98765432109.js'
      ])
    expect(console.error).not.toHaveBeenCalled()

    control.cleanup()
  })

  it('should not setup optimizely when configured on the wrong script', () => {
    const nonTrackingConsentScriptSrc = 'https://code.jquery.com/jquery-3.5.1.min.js'
    const control = setupScriptWithID('98765432109', nonTrackingConsentScriptSrc)
    control.trigger()

    expect(getScriptSrcs())
      .toEqual([
        nonTrackingConsentScriptSrc
      ])
    expect(console.error).not.toHaveBeenCalled()

    control.cleanup()
  })

  it('should not setup optimizely when configured on an inline script', () => {
    const control = setupScriptWithID('98765432109', '')
    control.trigger()

    expect(getScriptSrcs())
      .toEqual([
        null // the inline script
      ])
    expect(console.error).not.toHaveBeenCalled()

    control.cleanup()
  })

  it('should not setup optimizely when no id is present', () => {
    const control = setupScriptWithID(null, exampleTCScriptURL)
    control.trigger()

    expect(getScriptSrcs())
      .toEqual([
        exampleTCScriptURL
      ])
    expect(console.error).not.toHaveBeenCalled()

    control.cleanup()
  })

  it('should fail when invalid ID is passed', () => {
    const control = setupScriptWithID('a8765432109', exampleTCScriptURL)
    control.trigger()

    expect(console.error).toHaveBeenCalledWith('Optimizely ID is malformed', 'a8765432109')
    expect(getScriptSrcs())
      .toEqual([
        exampleTCScriptURL
      ])

    control.cleanup()
  })
})
