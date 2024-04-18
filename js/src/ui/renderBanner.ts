// @ts-ignore
import bannerTemplate from './banner';
import renderConfirmationMessage from './renderConfirmationMessage';
import {
  COOKIE_BANNER_MESSAGE_CLASS,
  COOKIE_BANNER_CLASS,
  GOV_UK_SKIP_LINK_CLASS,
  SKIP_LINK_CONTAINER_ID,
  LEGACY_COOKIE_BANNER_ID,
  COOKIE_BANNER_BUTTON_CLASS,
  GOV_UK_NONE_PRINT_CLASS,
} from '../constants/cssClasses';
import removeElement from '../common/removeElement';
import callIfNotNull from '../common/callIfNotNull';
import { UserPreferences } from '../../types/UserPreferences';
import getMessages from '../interfaces/getMessages';

const renderBanner = (userPreference: UserPreferences) => {
  if (window.getComputedStyle(document.documentElement).getPropertyValue('font-size') === '10px') {
    // hmrc services using assets-frontend still have a root font size of 10px (rather than 16px)
    document.body.classList.add('root-font-size-10px');
  }

  const messages = getMessages();

  const hideQuestion = () => {
    const question = document.querySelector(`.${COOKIE_BANNER_MESSAGE_CLASS}`);
    callIfNotNull(question, () => removeElement(question));
  };

  const handleAcceptAdditionalClick = (event: Event) => {
    event.preventDefault();

    userPreference.userAcceptsAdditional();
    hideQuestion();
    renderConfirmationMessage(messages['banner.confirmation.accepted']);
  };

  const handleRejectAdditionalClick = (event: Event) => {
    event.preventDefault();

    userPreference.userRejectsAdditional();
    hideQuestion();
    renderConfirmationMessage(messages['banner.confirmation.rejected']);
  };

  const insertAtTopOfBody = (banner: HTMLElement) => {
    const parentNode = document.body;
    parentNode.insertBefore(banner, parentNode.firstChild);
  };

  const insertBeforeSkipLink = (banner: HTMLElement) => {
    const skipLink = document.querySelector(`#${SKIP_LINK_CONTAINER_ID}, .${GOV_UK_SKIP_LINK_CLASS}`);
    if (skipLink !== null) {
      skipLink.insertAdjacentElement('beforebegin', banner);
    } else {
      insertAtTopOfBody(banner);
    }
  };

  const insertBanner = () => {
    const banner = document.createElement('div');
    banner.className = `${COOKIE_BANNER_CLASS} ${GOV_UK_NONE_PRINT_CLASS}`;
    banner.innerHTML = bannerTemplate(messages);
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', messages['banner.title']);
    banner.setAttribute('data-nosnippet', '');

    const acceptAdditionalButton = banner.querySelector(`.${COOKIE_BANNER_CLASS} .${COOKIE_BANNER_BUTTON_CLASS}[value=accept]`);
    callIfNotNull(acceptAdditionalButton, (element) => element.addEventListener('click', handleAcceptAdditionalClick));

    const rejectAdditionalButton = banner.querySelector(`.${COOKIE_BANNER_CLASS} .${COOKIE_BANNER_BUTTON_CLASS}[value=reject]`);
    callIfNotNull(rejectAdditionalButton, (element) => element.addEventListener('click', handleRejectAdditionalClick));

    insertBeforeSkipLink(banner);
  };

  const removeLegacyCookieBanner = () => {
    const legacyBanner = document.querySelector(`#${LEGACY_COOKIE_BANNER_ID}`);

    callIfNotNull(legacyBanner, removeElement);
  };

  removeLegacyCookieBanner();
  if (!userPreference.getUserHasSavedCookiePreferences()) {
    insertBanner();
  }
};

export default renderBanner;
