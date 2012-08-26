minispade.register('yoin-ember/init/state_manager', function() {
var getPath = Ember.getPath, fmt = Ember.String.fmt;

Yn.StateManager = Em.StateManager.extend({

	logName: '',

  send: function(event, context) {

    var eventName = fmt("%@.%@.%@", [this.logName, getPath(this, 'currentState.name'), event]),
      value;

    if ( context && context instanceof DS.Model ) {

      var id = context.get('id');
      if ( !!id ) {
        value = id;
      }

    }

    // TODO it fails on class design
    App.analytics.logEvent(eventName, value);
		this._super(event, context);

  }

});

});