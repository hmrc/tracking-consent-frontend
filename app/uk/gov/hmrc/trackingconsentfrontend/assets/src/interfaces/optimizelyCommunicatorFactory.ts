import { Communicator } from '../../types/Communicator';
import { UserPreferences } from '../../types/UserPreferences';
import isFeatureEnabled from './isFeatureEnabled';
import featureNames from '../constants/featureNames';

const optimizelyCommunicatorFactory = (window: Window): Communicator => ({
  sendPreferences: (userPreferences: UserPreferences) => {
    const setOptimizelyOptOut = (isOptOut: Boolean) => {
      window.optimizely.push({ type: 'optOut', isOptOut });
    };

    if (isFeatureEnabled(featureNames.enableTrackingConsent)) {
      // eslint-disable-next-line no-param-reassign
      window.optimizely = window.optimizely || [];
      const preferences = userPreferences.getPreferences() || {};
      setOptimizelyOptOut(preferences.measurement !== true);
    }
  },
});

export default optimizelyCommunicatorFactory;
