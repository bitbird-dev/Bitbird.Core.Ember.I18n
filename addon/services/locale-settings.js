import Service from '@ember/service';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default Service.extend({
  i18n: inject(),
  i18nFetch: inject('i18n-fetch'),
  settings: inject(),

  init: function() {
    this._super(...arguments);
    this.get('i18n');

    this._onStorageEvent =  function (ea){
      if(ea && ea.key === 'session' && ea.oldValue !== ea.newValue) {
        this.notifyPropertyChange('locale');
      }
    };
  },

  /**
   * Defines if the initial (~the first) locale loaded
   */
  isInitialLocaleLoaded: false,

  /**
   * Defines if a new locale is currently being loaded
   */
  isLocaleLoading: false,

  /**
   * Sets the current locale and loads it from server if necessary
   */
  locale: computed({
    get() {
      return this.get('settings').getLocally('locale');
    },
    set(key, value) {
      this.set('isLocaleLoading', true);

      let self = this,
        settings = this.get('settings'),
        fetch = this.get('i18nFetch').fetch(value);

      fetch.then(function() {
        self.set('i18n.locale', value);
        settings.setLocally('locale', value);
        self.notifyPropertyChange('locale');
        self.set('isLocaleLoading', false);
        self.set('isInitialLocaleLoaded', true);
      });
      return fetch;
    }
  }),
});
