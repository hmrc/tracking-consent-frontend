const confirmation = messages => `
<p class="cbanner-govuk-body cbanner-cookie-banner__confirmation-message-text">
    ${messages['banner.saveConfirmation.paragraph1.beforeLink']}
    <a class="cbanner-govuk-link" href="${messages['banner.saveConfirmation.paragraph1.link.url']}">
        ${messages['banner.saveConfirmation.paragraph1.link.text']}
    </a>
    ${messages['banner.saveConfirmation.paragraph1.afterLink']}
</p>
<p class="cbanner-govuk-body cbanner-cookie-banner__hide-button-container">
    <button class="cbanner-govuk-link cbanner-cookie-banner__hide-button" role="button">
            ${messages['banner.saveConfirmation.hideButton']}
    </button>
</p>`

export default confirmation
