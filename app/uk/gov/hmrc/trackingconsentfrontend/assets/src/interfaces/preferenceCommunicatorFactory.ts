const preferenceCommunicatorFactory = (window) => ({
  sendPreferences: (userPreferences) => {
    window.dataLayer = window.dataLayer || []
    const preferences = userPreferences.getPreferences() || {}
    if (preferences.usage === true) {
      window.dataLayer.push({event: 'hmrc-usage-allowed'})
    }
    if (preferences.campaigns === true) {
      window.dataLayer.push({event: 'hmrc-campaigns-allowed'})
    }
    if (preferences.settings === true) {
      window.dataLayer.push({event: 'hmrc-settings-allowed'})
    }
  }
})

export default preferenceCommunicatorFactory