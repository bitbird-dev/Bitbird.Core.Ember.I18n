import getOwner from "ember-getowner-polyfill";

export default function(locale, key, context) {
  let fallbackKey = undefined;
  if(context.get) {
    fallbackKey = context.get('fallbackKey');
  }

  let fetcher = getOwner(this).lookup("service:i18n-fetch");

  fetcher.translate(locale, key, null, true, fallbackKey);

  return '';
}
