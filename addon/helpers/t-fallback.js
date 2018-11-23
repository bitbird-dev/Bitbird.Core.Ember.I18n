import { helper } from '@ember/component/helper';
import { inject } from '@ember/service';

export default helper.extend({
  i18n: inject.service(),

  compute(params) {
    if (!params || params.length !== 2) {
      // a key and a fallback value are expected
      return '';
    }
    let i18n=this.get('i18n');
    let key=params[0];
    if (i18n.exists(key)) {
      return i18n.t(key);
    }
    return params[1];
  }
});
