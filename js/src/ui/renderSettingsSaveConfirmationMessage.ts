import {
  COOKIE_SETTINGS_NOTICE_CLASS,
  COOKIE_SETTINGS_NOTICE_CONTENT_CLASS,
  GOV_UK_BODY_CLASS,
  COOKIE_SETTINGS_NOTICE_WRAPPER_CLASS,
  COOKIE_SETTINGS_CONFIRMATION_CLASS,
  GOV_UK_NOTIFICATION_LINK_CLASS,
} from '../constants/cssClasses';
import callIfNotNull from '../common/callIfNotNull';
import scrollToTop from '../common/scrollToTop';
import getReferrer from '../common/getReferrer';
import getPathname from '../common/getPathname';
import focusIfNotNull from '../common/focusIfNotNull';
import cookieSettingsConfirmation from './cookieSettingsConfirmation';
import getMessages from '../interfaces/getMessages';

const getReferrerLink = (referrer): HTMLAnchorElement => {
  const messages = getMessages();
  const link = document.createElement('a');
  link.className = GOV_UK_NOTIFICATION_LINK_CLASS;
  link.innerHTML = messages['cookieSettings.saveConfirmation.link.text'];
  link.href = referrer;
  return link;
};

const getParagraph = (link): HTMLParagraphElement => {
  const paragraph = document.createElement('p');
  paragraph.className = GOV_UK_BODY_CLASS;
  paragraph.appendChild(link);
  return paragraph;
};

const insertReferrerLink = (notice: HTMLElement, referrer: string) => {
  const link = getReferrerLink(referrer);
  const paragraph = getParagraph(link);
  notice.appendChild(paragraph);
};

const insertReferrerLinkIfNecessary = (message: HTMLElement) => {
  const referrer = getReferrer();
  if (referrer && referrer !== getPathname()) {
    const notice = message.querySelector(`.${COOKIE_SETTINGS_NOTICE_CONTENT_CLASS}`);
    callIfNotNull(notice, (element) => insertReferrerLink(element, referrer));
  }
};

const getConfirmation = (): HTMLElement => {
  const messages = getMessages();
  const confirmation = document.createElement('div');
  confirmation.className = COOKIE_SETTINGS_CONFIRMATION_CLASS;
  confirmation.innerHTML = cookieSettingsConfirmation(messages);
  insertReferrerLinkIfNecessary(confirmation);
  return confirmation;
};

const queryConfirmation = (): HTMLElement | null => document.querySelector(`.${COOKIE_SETTINGS_NOTICE_CLASS}`);

const insertConfirmation = () => {
  const wrapper = document.querySelector(`.${COOKIE_SETTINGS_NOTICE_WRAPPER_CLASS}`);
  callIfNotNull(wrapper, (element) => element.insertBefore(getConfirmation(), element.firstChild));
};

const insertConfirmationIfNecessary = () => {
  const confirmation = queryConfirmation();
  if (confirmation === null) {
    insertConfirmation();
  }
};

const scrollToConfirmation = () => {
  focusIfNotNull(queryConfirmation());
  scrollToTop();
};

const renderSettingsSaveConfirmationMessage = () => {
  insertConfirmationIfNecessary();
  scrollToConfirmation();
};

export default renderSettingsSaveConfirmationMessage;
