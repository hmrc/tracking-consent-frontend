const preferenceCommunicatorFactory = (window) => ({
  sendPreferences: (userPreferences) => {
    window.dataLayer = window.dataLayer || []
    const preferences = userPreferences.getPreferences() || {}
    if (preferences.measurement === true) {
      window.dataLayer.push({event: 'hmrc-measurement-allowed'})
    }
    if (preferences.marketing === true) {
      window.dataLayer.push({event: 'hmrc-marketing-allowed'})
    }
    if (preferences.settings === true) {
      window.dataLayer.push({event: 'hmrc-settings-allowed'})
    }
  }
})

export default preferenceCommunicatorFactory