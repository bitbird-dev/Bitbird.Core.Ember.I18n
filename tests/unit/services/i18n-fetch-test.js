import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | i18n-fetch', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:i18n-fetch');
    assert.ok(service);
  });
});

