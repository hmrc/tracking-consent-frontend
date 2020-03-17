// @ts-ignore
import Cookies from 'js-cookie'

const userPreferenceFactory = () => ({
  userAcceptsAll: () => {
    Cookies.set('userConsent', JSON.stringify({
      version: '2020-01-01',
      dateSet: new Date().getTime(),
      preferences: {
        acceptAll: true
      }
    }), { secure: true, sameSite: 'strict' })
  }
})

export default userPreferenceFactory
