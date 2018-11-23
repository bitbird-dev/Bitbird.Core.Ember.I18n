import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default Helper.extend({
  i18n: service(),

  compute(params) {
    return this.get('i18n').exists(params);
  }
});
