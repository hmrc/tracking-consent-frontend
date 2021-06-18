const cookieSettingsConfirmation = (messages) => `
<section class="cookie-settings__notice govuk-notification-banner govuk-notification-banner--success" role="alert" aria-labelledby="govuk-notification-banner-title" data-module="govuk-notification-banner" tabindex="-1">
  <div class="govuk-notification-banner__header">
    <h1 class="govuk-notification-banner__title" id="govuk-notification-banner-title">
      Success
    </h1>
  </div>
  <div class="govuk-notification-banner__content cookie-settings__notice-content">
    <h2 class="govuk-heading-m">${messages['cookieSettings.saveConfirmation.title']}</h2>
    <p class="govuk-body">${messages['cookieSettings.saveConfirmation.paragraph1']}</p>
</section>
`;

export default cookieSettingsConfirmation;
