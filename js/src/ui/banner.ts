import getTrackingConsentBaseUrl from '../common/getTrackingConsentBaseUrl';

const banner = (messages) => {
  const trackingConsentSettingsPageUrl = `${getTrackingConsentBaseUrl()}${messages['banner.view.cookies.url']}`;
  return `<div class="cbanner-govuk-cookie-banner__message cbanner-govuk-width-container">
    <div class="cbanner-govuk-grid-row">
      <div class="cbanner-govuk-grid-column-two-thirds">
        <h2 class="cbanner-govuk-cookie-banner__heading cbanner-govuk-heading-m">${messages['banner.title']}</h2>
        <div class="cbanner-govuk-cookie-banner__content">
          <p class="cbanner-govuk-body">${messages['banner.essential.cookies']} </p>
          <p class="cbanner-govuk-body">${messages['banner.additional.cookies']} </p>
        </div>
      </div>
    </div>
    <div class="cbanner-govuk-button-group">
      <button value="accept" type="submit" name="cookies" class="cbanner-govuk-button" data-module="cbanner-govuk-button">
        ${messages['banner.accept.additional.cookies']}
      </button>
      <button value="reject" type="submit" name="cookies" class="cbanner-govuk-button" data-module="cbanner-govuk-button">
        ${messages['banner.reject.additional.cookies']}
      </button>
      <a class="cbanner-govuk-link" href="${trackingConsentSettingsPageUrl}">${messages['banner.view.cookies']}</a>
    </div>
  </div>`;
};

export default banner;
