const cookieSettingsConfirmation = (messages) => `
<section class="cookie-settings__notice" aria-label="Notice" aria-live="polite" role="region" tabindex="-1">
    <h2 class="govuk-heading-m">${messages['cookieSettings.saveConfirmation.title']}</h2>
    <p class="govuk-body">${messages['cookieSettings.saveConfirmation.paragraph1']}</p>
</section>
`;

export default cookieSettingsConfirmation;
