import { Communicator } from '../../types/Communicator';
import { UserPreferences } from '../../types/UserPreferences';

const optimizelyCommunicatorFactory = (window: Window): Communicator => ({
  sendPreferences: (userPreferences: UserPreferences) => {
    const setOptimizelyOptOut = (isOptOut: Boolean) => {
      window.optimizely.push({ type: 'optOut', isOptOut });
    };

    // eslint-disable-next-line no-param-reassign
    window.optimizely = window.optimizely || [];
    const preferences = userPreferences.getPreferences() || {};
    if (preferences.measurement === true) {
      setOptimizelyOptOut(false);
    } else {
      setOptimizelyOptOut(true);
    }
  },
});

export default optimizelyCommunicatorFactory;
