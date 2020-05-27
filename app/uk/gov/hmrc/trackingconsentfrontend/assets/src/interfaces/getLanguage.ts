import {CY, EN} from "../constants/languages"
import Cookies from 'js-cookie'
import {PLAY_LANG} from "../constants/cookies";

const getLanguage = () => {
  const language = Cookies.get(PLAY_LANG)

  return language === CY ? CY : EN
}

export default getLanguage
