import getCurrentScript from './getCurrentScript';

const getConfigurationAttribute = (attributeName: string): string | undefined => {
  const scriptTag = getCurrentScript();
  if (scriptTag === undefined) {
    return undefined;
  }
  const attributeValue = scriptTag.getAttribute(`data-${attributeName}`);
  if (attributeValue === null) {
    return undefined;
  }
  return attributeValue;
};

export default getConfigurationAttribute;
