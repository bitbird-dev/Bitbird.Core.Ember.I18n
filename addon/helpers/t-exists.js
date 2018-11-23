import { helper } from '@ember/component/helper';
import { inject } from '@ember/service';

export default helper.extend({
  i18n: inject.service(),

  compute(params) {
    return this.get('i18n').exists(params);
  }
});
