import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import { Promise } from 'rsvp';
import { A } from '@ember/array';
import { observer } from '@ember/object';
import { warn } from '@ember/debug';
import DS from 'ember-data';

export default Service.extend({
  i18n: service(),
  ajax: service(),

  /**
   * Fetches the localization file for a given language code
   * @param locale
   */
  fetch(locale) {
    let self = this,
      env = getOwner(this).resolveRegistration('config:environment');

    if(env.i18n.autoFetchTranslationFiles !== false && env.i18n.loadedRemoteLocales.indexOf(locale) === -1) {
      env.i18n.loadedRemoteLocales.push(locale);
    } else {
      return new Promise(function(resolve, reject) {
        resolve();
        reject();
      });
    }

    let internalBasePath = env.APP.API.HOST + (env.APP.API.NAMESPACE ? '/' + env.APP.API.NAMESPACE : '');

    return Promise.all([
      self.get('ajax').request(internalBasePath + '/translations/' + locale + '.json')
        .then(function(obj) {
          self._addTranslations(locale, obj);
        }, function() {}),
      self.get('ajax').request(internalBasePath + '/translations/' + locale + '.json?auto=true')
        .then(function(obj) {
          self._addTranslations(locale, obj);
        }, function() {})
    ]);
  },

  _translations: A(),
  _translationsChanged: observer('_translations.length', function() {
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
      env = getOwner(this).resolveRegistration('config:environment');

    if(env.i18n.loadedRemoteLocales.indexOf(locale) === -1) return null;

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

    let ajaxPromise = this.get('ajax').request(path);
    ajaxPromise.then(
      function(translation) {
        self.get('_translations').removeObject(ajaxPromise);
        if(translateAsKey) {
          try {
            if(env.APP.autoTranslationPrefix) {
              translation.text += env.APP.autoTranslationPrefix;
            }

            translation[text] = translation.text;
            delete translation.text;
            self._addTranslations(locale, translation);
          } catch (ex) {
            warn(`Error while parsing '${translation.text}'`, null, { id: 0 });
            let obj = {};
            obj[text] = (env.APP.autoTranslationPrefix || '') + 'ERROR';
            self._addTranslations(locale, obj);
          }
        }
      }, function(){
        self.get('_translations').removeObject(ajaxPromise);
      }
    );

    this._translations.pushObject(ajaxPromise);

    let promise = new Promise(function(resolve, reject) {
      ajaxPromise.then(function(v) {
        for(let prop in v) {
          if(!v.hasOwnProperty(prop)) continue;
          let s = v[prop];
          if(s) s = s.toString();
          resolve(s);
          return;
        }
        resolve(null);
      }, function() {
        reject();
      });
    });

    let proxy = DS.PromiseObject.create({
      promise: promise
    });

    return proxy;

    /*return new Promise(function(resolve, reject) {
        ajaxPromise.then(function(v) {
          for(let prop in v) {
            if(!v.hasOwnProperty(prop)) continue;
            resolve(v[prop]);
            return;
          }
          resolve(null);
        }, function() {
          reject();
        });
    });*/

    //return promise;
  },

  _addTranslations(locale, json) {
    const i18n = this.get('i18n');

    i18n.addTranslations(locale, json);
  }
});

