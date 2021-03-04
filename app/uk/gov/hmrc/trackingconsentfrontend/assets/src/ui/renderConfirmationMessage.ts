import {
  COOKIE_BANNER_MESSAGE_CLASS,
  COOKIE_BANNER_CLASS,
  COOKIE_BANNER_GOV_UK_WIDTH_CONTAINER_CLASS, COOKIE_BANNER_BUTTON_CLASS,
} from '../constants/cssClasses';
import removeElement from '../common/removeElement';
import callIfNotNull from '../common/callIfNotNull';
import confirmation from './confirmation';
import getMessages from '../interfaces/getMessages';

const renderConfirmationMessage = (acceptedOrRejectedMessage: string) => {
  const messages = getMessages();

  const handleHideClick = (event: Event) => {
    event.preventDefault();

    const banner = document.querySelector(`.${COOKIE_BANNER_CLASS}`);
    callIfNotNull(banner, (element) => removeElement(element));
  };

  const getConfirmationMessage = (): HTMLDivElement => {
    const message = document.createElement('div');
    message.className = `${COOKIE_BANNER_MESSAGE_CLASS} ${COOKIE_BANNER_GOV_UK_WIDTH_CONTAINER_CLASS}`;
    message.tabIndex = -1;
    message.innerHTML = confirmation(messages, acceptedOrRejectedMessage);

    const hideButton = message.querySelector(`.${COOKIE_BANNER_MESSAGE_CLASS} .${COOKIE_BANNER_BUTTON_CLASS}`);
    callIfNotNull(hideButton, (element) => element.addEventListener('click', handleHideClick));

    return message;
  };

  const insertConfirmationMessage = (message: HTMLDivElement) => {
    const cookieBanner = document.querySelector(`.${COOKIE_BANNER_CLASS}`);
    callIfNotNull(cookieBanner, (element) => element.insertBefore(message, element.firstChild));
  };

  const message = getConfirmationMessage();
  insertConfirmationMessage(message);
  message.focus();
};

export default renderConfirmationMessage;
