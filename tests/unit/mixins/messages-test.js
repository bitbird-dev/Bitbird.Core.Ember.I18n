import EmberObject from '@ember/object';
import MessagesMixin from 'bitbird-core-ember-i18n/mixins/messages';
import { module, test } from 'qunit';

module('Unit | Mixin | messages', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let MessagesObject = EmberObject.extend(MessagesMixin);
    let subject = MessagesObject.create();
    assert.ok(subject);
  });
});
