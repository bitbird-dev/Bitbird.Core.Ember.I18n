'use strict';

module.exports = function(environment/*, appConfig */) {
  let env = {
    environment: environment
  };

  if(environment === 'test') {
    env.i18n = {
      defaultLocale: 'de',
      autoFetchTranslationFiles: false,
      loadedRemoteLocales: []
    };
  }

  return env;
};
