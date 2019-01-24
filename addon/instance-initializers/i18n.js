//import { getOwner } from '@ember/application';
//import  moment from 'moment';

export function initialize(appInstance) {
  let i18n = appInstance.lookup('service:i18n');
  let settings = appInstance.lookup('service:settings');
  let localeSettings = appInstance.lookup('service:localeSettings');
  let moment = appInstance.lookup('service:moment');

  let storedLocale = localeSettings.get('locale');
  if(!storedLocale) {
    try {
      storedLocale = calculateLocale(appInstance, i18n.get('locales'));
    } catch (Exception) {
      storedLocale = "de";
    }
  }

  moment.setLocale('de');
  i18n.set('locale', storedLocale);
  localeSettings.set('locale', storedLocale);
}

function calculateLocale(appInstance, locales) {
  let env = appInstance.resolveRegistration('config:environment'),
    language = navigator.language || navigator.userLanguage || navigator.languages[0];

  let match = locales.includes(language.toLowerCase());

  if(!match && language.length === 5) {
    language = language.substring(0,2);
    match = locales.includes(language.toLowerCase());
  }

  return match ? language : env.i18n.defaultLocale;
}

export default {
  name: 'i18n',
  initialize
};
