const cookieSettingsConfirmation = (messages) => `
<div class="cookie-settings__notice govuk-notification-banner govuk-notification-banner--success" role="alertdialog" aria-labelledby="govuk-notification-banner-title" data-module="govuk-notification-banner" tabindex="-1">
  <div class="govuk-notification-banner__header">
    <h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">
      Success
    </h2>
  </div>
  <div class="govuk-notification-banner__content cookie-settings__notice-content">
    <h3 class="govuk-heading-m">${messages['cookieSettings.saveConfirmation.title']}</h3>
    <p class="govuk-body">${messages['cookieSettings.saveConfirmation.paragraph1']}</p>
</div>
`;

export default cookieSettingsConfirmation;
