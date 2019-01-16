import { getOwner } from '@ember/application';

export default function(locale, key, context) {
  let fallbackKey = undefined,
    env = getOwner(this).resolveRegistration('config:environment'),

    //lookup works and reolve registration doesn't?
    //Why?
    //because localeSettings is a property/member of application??
    settings = getOwner(this).lookup('service:localeSettings');  

  if(settings.get('isLocaleLoading')){
    return '';
  }

  if(env.i18n.autoFetchMissingTranslations === false) {
    return key || fallbackKey;
  }

  if(context.get) {
    fallbackKey = context.get('fallbackKey');
  }

  let fetcher = getOwner(this).lookup("service:i18n-fetch");
  let promise = fetcher.translate(locale, key, null, true, fallbackKey);

  //Prevents rendering of "<DS.PromiseObject...>" while not resolved
  promise.toString = function() {
    return '';
  };

  return promise;
}
