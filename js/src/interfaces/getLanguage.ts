import { CY, EN } from '../constants/languages';
import getConfigurationAttribute from '../common/getConfigurationAttribute';

const getLanguage = () => {
  const language = getConfigurationAttribute('language');

  return language === CY ? CY : EN;
};

export default getLanguage;
