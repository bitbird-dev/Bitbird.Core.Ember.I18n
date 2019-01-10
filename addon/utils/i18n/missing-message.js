import { getOwner } from '@ember/application';

export default function(locale, key, context) {
  let fallbackKey = undefined,
    env = getOwner(this).resolveRegistration('config:environment');

  if(env.i18n.autoFetchMissingTranslations === false) {
    return key || fallbackKey;
  }

  if(context.get) {
    fallbackKey = context.get('fallbackKey');
  }

  let fetcher = getOwner(this).lookup("service:i18n-fetch");

  return fetcher.translate(locale, key, null, true, fallbackKey);
}
