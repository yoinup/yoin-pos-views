minispade.register('yoin-ember/models/user', function() {Yn.UserLoginType = {
	phone: "PhoneChannel",
	facebook: "FbChannel",
	email: "appuser"
};


var embedded = Yn.embedded;
Yn.User = DS.Model.extend({
  name: DS.attr('string'),
  email: DS.attr('string'),
  avatar: DS.attr('string'),
  status: DS.attr('string'),
  friendsCount: DS.attr('number', {key: 'friends_count'}),
  city: DS.belongsTo('Yn.City', {key: 'city'}),

  phoneChannels: DS.hasMany('Yn.PhoneChannel', {key: 'phone_channels', embedded: embedded}),
  fbChannel: DS.belongsTo('Yn.FbChannel', {key: 'fb_channel', embedded: embedded})

});

// Explicit name to avoid ember-data bugs
Yn.User.reopenClass({
  url: "user",

  /* A complex object is needed in order to manage all the login
   * possibilities of the system. If the login is successful,
   * the adapter authHeader attribute will be set with the base64
   * representation of the login option
   * the adapter will set the Authentication header before sending
   * any request to the server API
   */
  login: function(loginObject, successCallback, errorCallback) {

    var headerLabel, encryptedKey, dataPkg;

		dataPkg = loginObject;

    if (loginObject.type === Yn.UserLoginType.phone ) {

      encryptedKey = Base64.encode("phone=%@,uuid=%@".fmt(loginObject.phone, loginObject.uuid));

    } else if (loginObject.type === Yn.UserLoginType.facebook) {

      encryptedKey = Base64.encode("fb_id=%@,access_token=%@".fmt(loginObject.fb_id, loginObject.access_token));

    } else if (loginObject.type === Yn.UserLoginType.email) {

      encryptedKey = Base64.encode("email=%@,password=%@".fmt(loginObject.email, loginObject.password));

    } else {
      console.error("Invalid login type");
      return;
    }

		headerLabel = "%@ %@".fmt(loginObject.type, encryptedKey);

    var errorResponse = function(response) {

        Yn.store.get('adapter').set('authHeader', null);
        if ( !!errorCallback ) {
          errorCallback(response);
        }

    };


    $.ajax({
      url: Yn.ENDPOINTS.get('USER_CHECK'),
      type: "POST",
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(dataPkg),
      success: function(response) {

        // Login successful
        if (!!response.id) {

          // Set authHader with the values validated by the server
          Yn.store.get('adapter').set('authHeader', headerLabel);
          Yn.store.load(Yn.User, response);
          if ( !!successCallback ) {
            var user = Yn.User.find(response.id);
            successCallback(user);
          }
        } else {

          errorResponse(response);


        }

      }, 
      error: function(response) {

        errorResponse(response);

      }
    });
  },

  register: function(registerObject, successCallback, errorCallback) {

		var dataPkg = registerObject;

    $.ajax({
      url: Yn.ENDPOINTS.get('USER_CREATE'),
      type: "POST",
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(dataPkg),
      success: function(response) {
        Yn.store.load(Yn.User, response);
        if (!!successCallback) {
          var user = Yn.User.find(response.id);
          successCallback(user);
        }
      },
      error: function(response) {
        if (response.status === 601) {
          console.error("Could not create channel");
        }
        if (!!errorCallback) {
          errorCallback(response);
        }
      }
    });
  }
});

});