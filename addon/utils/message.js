import EmberObject from '@ember/object';

const Message = EmberObject.extend({
  title: null,
  message: null,
  type: 'info',
  errors: null,

  buttons: null,

  isSticky: false,
  //Font awesome icon name without fa- prefix
  icon: null,

  issuedAt: null,
  isProcessed: false,
  ttl: 5000
});

const Success = Message.extend({
  title: 'Alles erledigt',
  message: null,
  type: 'success'
});

const Warn = Message.extend({
  title: 'Achtung',
  message: null,
  type: 'warn'
});

const Error = Message.extend({
  title: 'Fehler',
  message: null,
  type: 'error'
});

const Info = Message.extend({
  title: 'Information',
  message: null,
  type: 'info'
});

export {
  Message,
  Success,
  Warn,
  Error,
  Info
}
