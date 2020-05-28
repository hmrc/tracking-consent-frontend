// @ts-ignore
import applicationConfig from '../../../../../../../../conf/application.conf';

const getWelshLanguageEnabled = () => {
  return applicationConfig['features.welsh-language-support'] === 'true'
}

export default getWelshLanguageEnabled
