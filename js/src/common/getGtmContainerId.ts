import {
  A_CONTAINER_ID,
  B_CONTAINER_ID,
  C_CONTAINER_ID,
  D_CONTAINER_ID,
  E_CONTAINER_ID,
  F_CONTAINER_ID,
  SDES_CONTAINER_ID,
  TRANSITIONAL_CONTAINER_ID,
} from '../constants/gtm';
import getConfigurationAttribute from './getConfigurationAttribute';

const gtmContainers = {
  transitional: TRANSITIONAL_CONTAINER_ID,
  a: A_CONTAINER_ID,
  b: B_CONTAINER_ID,
  c: C_CONTAINER_ID,
  d: D_CONTAINER_ID,
  e: E_CONTAINER_ID,
  f: F_CONTAINER_ID,
  sdes: SDES_CONTAINER_ID,
};

const getGtmContainerIdForName = (name: string): string | undefined => gtmContainers[name];

const getGtmContainerId = (): string | undefined => {
  const gtmContainer = getConfigurationAttribute('gtm-container');
  if (gtmContainer === undefined) {
    return undefined;
  }
  return getGtmContainerIdForName(gtmContainer);
};

export default getGtmContainerId;
