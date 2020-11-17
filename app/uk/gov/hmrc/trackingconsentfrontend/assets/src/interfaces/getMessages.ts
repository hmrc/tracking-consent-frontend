// @ts-ignore
import messagesEn from '../../../../../../../../conf/messages.en';
// @ts-ignore
import messagesCy from '../../../../../../../../conf/messages.cy';

import getLanguage from "./getLanguage";
import { CY } from "../constants/languages";

const getMessages = () => {
  const language = getLanguage()

  return language === CY ? messagesCy : messagesEn
}

export default getMessages
