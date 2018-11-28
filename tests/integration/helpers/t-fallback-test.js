import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | t-fallback', function(hooks) {
  setupRenderingTest(hooks);

  test('check basic fallback', async function(assert) {
    await render(hbs`{{t-fallback 'my-special-key' 'Tomster'}}`);

    assert.equal(this.element.textContent.trim(), 'Tomster');
});
});
