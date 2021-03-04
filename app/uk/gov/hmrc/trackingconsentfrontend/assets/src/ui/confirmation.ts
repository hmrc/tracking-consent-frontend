import getTrackingConsentBaseUrl from '../common/getTrackingConsentBaseUrl';

const confirmation = (messages: any, acceptedOrRejectedMessage: string) => `
    <div class="cbanner-govuk-grid-row">
      <div class="cbanner-govuk-grid-column-two-thirds">
    
        <div class="cbanner-govuk-cookie-banner__content">
          <p>
            ${acceptedOrRejectedMessage}
            ${messages['banner.confirmation.before.link']}
            <a class="cbanner-govuk-link" href="${getTrackingConsentBaseUrl()}${messages['banner.confirmation.link.url']}">
              ${messages['banner.confirmation.link']}
            </a>            
            ${messages['banner.confirmation.after.link']}
        </div>
      </div>
    </div>
    
    <div class="cbanner-govuk-button-group">
      <button class="cbanner-govuk-button" data-module="cbanner-govuk-button">
        ${messages['banner.confirmation.hide']}
      </button>
    </div>`;

export default confirmation;
