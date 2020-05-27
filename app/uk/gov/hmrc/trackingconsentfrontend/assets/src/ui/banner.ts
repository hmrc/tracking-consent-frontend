const banner = messages => `<div class="cbanner-govuk-width-container cbanner-cookie-banner__question">
    <div class="cbanner-govuk-grid-row">
        <div class="cbanner-govuk-grid-column-full">
            <h2 class="cbanner-govuk-heading-m">${messages['banner.title']}</h2>
            <p class="cbanner-govuk-body">
                ${messages['banner.paragraph1.beforeLink']} 
                <a class="cbanner-govuk-link" href="${messages['banner.paragraph1.link.url']}">
                    ${messages['banner.paragraph1.link.text']}
                </a>
                ${messages['banner.paragraph1.afterLink']}
            <div>
                <div class="cbanner-cookie-banner__button-column cbanner-govuk-grid-column-full cbanner-govuk-grid-column-one-half-from-desktop">
                    <button class="cbanner-govuk-button cbanner-cookie-banner__accept-all-button" type="submit">
                        ${messages['banner.acceptAllButton']}
                    </button>
                </div>
                <div class="cbanner-cookie-banner__button-column cbanner-govuk-grid-column-full cbanner-govuk-grid-column-one-half-from-desktop">
                    <a href="/tracking-consent/cookie-settings" class="cbanner-govuk-button cbanner-cookie-banner__set-cookie-preferences-button" draggable="false" role="button">
                        ${messages['banner.setCookiePreferencesButton']}
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
`

export default banner