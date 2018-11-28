import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | t-exists', function(hooks) {
  setupRenderingTest(hooks);

  test('Check if language exists', async function(assert) {
    this.set('inputValue', 'ru');

    await render(hbs`{{t-exists inputValue}}`);

    assert.equal(this.element.textContent.trim(), 'false');
  });
});
