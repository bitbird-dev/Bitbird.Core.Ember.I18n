import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import {
  Message,
  Success,
  Info,
  Warn,
  Error
} from 'bitbird-core-ember-i18n/utils/message'

export default Mixin.create({
  i18n: service(),

  /**
   * Optional convenience pattern to use for allow shorter keys in method calls. {0} will be replaced by the final key.
   * Example: a pattern 'app.models.{0}' combined with sendSuccess('save.success') with would result in a localization key 'app.models.save.success'
   */
  messageKeyPattern: null,

  sendSuccess: function(message, title, errors, isSticky, icon, i18nHash, buttons) {
    let messageObj = Success.create({
      title: this._translate(title, i18nHash),
      message: this._translate(message, i18nHash),
      errors: errors,
      isSticky: isSticky,
      icon: icon,
      buttons: buttons
    });

    if(buttons) {
      buttons.forEach(function(item) {
        item.value = messageObj
      });
    }

    this.send('message', messageObj);
    return messageObj;
  },

  sendWarn: function(message, title, errors, isSticky, icon, i18nHash, buttons) {
    let messageObj = Warn.create({
      title: this._translate(title, i18nHash),
      message: this._translate(message, i18nHash),
      errors: errors,
      isSticky: isSticky,
      icon: icon,
      buttons: buttons
    });

    if(buttons) {
      buttons.forEach(function(item) {
        item.value = messageObj
      });
    }

    this.send('message', messageObj);
    return messageObj;
  },

  sendError: function(message, title, errors, isSticky, icon, i18nHash, buttons) {
    let messageObj = Error.create({
      title: this._translate(title, i18nHash),
      message: this._translate(message, i18nHash),
      errors: errors,
      isSticky: isSticky,
      icon: icon,
      buttons: buttons
    });

    if(buttons) {
      buttons.forEach(function(item) {
        item.value = messageObj
      });
    }

    this.send('message', messageObj);
    return messageObj;
  },

  sendInfo: function(message, title, errors, isSticky, icon, i18nHash, buttons) {
    let messageObj = Info.create({
      title: this._translate(title, i18nHash),
      message: this._translate(message, i18nHash),
      errors: errors,
      isSticky: isSticky,
      icon: icon,
      buttons: buttons
    });

    if(buttons) {
      buttons.forEach(function(item) {
        item.value = messageObj
      });
    }

    this.send('message', messageObj);
    return messageObj;
  },

  sendMessage: function(message, title, errors, isSticky, icon, i18nHash, buttons) {
    let t=this._translate(title, i18nHash),
      m=this._translate(message, i18nHash);

    let messageObj = Message.create({
      title: t,
      message: m,
      errors: errors,
      isSticky: isSticky,
      icon: icon,
      buttons: buttons
    });

    if(buttons) {
      buttons.forEach(function(item) {
        item.value = messageObj
      });
    }

    this.send('message', messageObj);
    return messageObj;
  },

  _translate: function (key, i18nHash) {
    let i18n = this.get('i18n');

    let messageKeyPattern = this.get('messageKeyPattern');

    if(!messageKeyPattern) {
      if(i18nHash) {
        return i18n.t(key, i18nHash);
      }
      return i18n.t(key);
    }

    return i18n.t(messageKeyPattern.replace('{0}', key || 'undefined'));
  }
});
