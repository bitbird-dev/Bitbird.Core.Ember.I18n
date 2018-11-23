import { request } from "ic-ajax";
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import Ember from 'ember';
const { RSVP: { Promise } } = Ember;

export default Ember.Service.extend({
  i18n: service(),

  /**
   * Fetches the localization file for a given language code
   * @param locale
   */
  fetch(locale) {
    let self = this,
      env = Ember.getOwner(this).resolveRegistration('config:environment');

    if(env.APP.loadedRemoteLocales.indexOf(locale) === -1) {
      env.APP.loadedRemoteLocales.push(locale);
    } else {
      return new Promise(function(resolve, reject) {
        resolve();
        reject();
      });
    }

    let internalBasePath = env.APP.API.HOST + (env.APP.API.NAMESPACE ? '/' + env.APP.API.NAMESPACE : '');

    return Promise.all([
      request(internalBasePath + '/translations/' + locale + '.json')
        .then(function(obj) {
          self._addTranslations(locale, obj);
        }),
      request(internalBasePath + '/translations/' + locale + '.json?auto=true')
        .then(function(obj) {
          self._addTranslations(locale, obj);
        })
    ])
  },

  _translations: Ember.A(),
  _translationsChanged: Ember.observer('_translations.length', function() {
    let self = this,
      i18n = this.get('i18n');

    later(function() {
      if(self.get('_translations.length') === 0) {
        i18n.notifyPropertyChange('locale');
      }
    }, 1000);
  }),

  translate(to, text, from, translateAsKey, fallbackText) {
    let self = this,
      i18n = this.get('i18n'),
      locale = i18n.get('locale'),
      env = Ember.getOwner(this).resolveRegistration('config:environment');

    if(env.APP.loadedRemoteLocales.indexOf(locale) === -1) return null;

    from = from || 'auto';

    //todo: Move paths into connection service
    let internalBasePath = env.APP.API.HOST + (env.APP.API.NAMESPACE ? '/' + env.APP.API.NAMESPACE : '');
    let textToTranslate = text;
    if(fallbackText && fallbackText.length) {
      textToTranslate = fallbackText;
    }
    let path = internalBasePath + '/translations/translate/' + from + '/' + to + '?text=' + textToTranslate;
    if(translateAsKey)
    {
      path += '&translateAsKey=' + translateAsKey;
    }

    let promise = request(path);
    promise.then(
      function(translation) {
        self.get('_translations').removeObject(promise);
        if(translateAsKey) {
          try {
            if(env.APP.autoTranslationPrefix) {
              translation.text += env.APP.autoTranslationPrefix;
            }

            translation[text] = translation.text;
            delete translation.text;
            self._addTranslations(locale, translation);
          } catch (ex) {
            Ember.warn(`Error while parsing '${translation.text}'`, null, { id: 0 });
            let obj = {};
            obj[text] = (env.APP.autoTranslationPrefix || '') + 'ERROR';
            self._addTranslations(locale, obj);
          }
        }
      }, function(){
        self.get('_translations').removeObject(promise);
      }
    );

    this._translations.pushObject(promise);

    return promise;
  },

  _addTranslations(locale, json) {
    const i18n = this.get('i18n');

    i18n.addTranslations(locale, json);
  }
});

