import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | locale-settings', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:locale-settings');
    assert.ok(service);
  });
});

