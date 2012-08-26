minispade.register('yoin-ember/init/endpoints', function() {// Extra end points not used by ember-data
Yn.ENDPOINTS = Em.Object.create({

  store: null,

  _ROOT: Em.computed(function() {
    var adapter = this.get('store').get('adapter');
    return adapter.get('serverDomain') + adapter.get('tastypieApiUrl');
  }).property('store'),

  USER_CHECK: Em.computed(function() {
    return this.get('_ROOT') + 'user/check/';
  }).property('_ROOT'),

  VENUE_USER_CHECK: Em.computed(function() {
    return this.get('_ROOT') + 'venue_user/check/';
  }).property('_ROOT'),

  USER_CREATE: Em.computed(function() {
    return this.get('_ROOT') + 'user/';
  }).property('_ROOT')
});

});