import { UserPreferences } from '../../types/UserPreferences';
import userPreferencesFactory from './userPreferencesFactory';
import gtmCommunicatorFactory from '../interfaces/gtmCommunicatorFactory';
import optimizelyCommunicatorFactory from '../interfaces/optimizelyCommunicatorFactory';
import auditCommunicatorFactory from '../interfaces/auditCommunicatorFactory';

const subscribedUserPreferencesFactory = (window): UserPreferences => {
  const userPreferences = userPreferencesFactory();
  userPreferences.subscribe(gtmCommunicatorFactory(window));
  userPreferences.subscribe(optimizelyCommunicatorFactory(window));
  userPreferences.subscribe(auditCommunicatorFactory());
  return userPreferences;
};

export default subscribedUserPreferencesFactory;
