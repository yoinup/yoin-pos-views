minispade.register('yoin-ember/models/venue_user', function() {
Yn.VenueUser = DS.Model.extend({
  username: DS.attr('string'),
  name: DS.attr('string'),
  venue: DS.belongsTo('Yn.Venue', {key:"venue"})
});

// Explicit name to avoid ember-data bugs
Yn.VenueUser.reopenClass({
  url: "venue_user",

  login: function(username, password, successCallback, errorCallback) {
    var headerLabel, base64Key, dataPkg;

    base64Key = Base64.encode("username=%@,password=%@".fmt(username, password));
    headerLabel = "VenueUser %@".fmt(base64Key);
    dataPkg = {
        username: username,
        password: password
    };


    var errorResponse = function(response) {

        Yn.store.get('adapter').set('authHeader', null);
        if ( !!errorCallback ) {
          errorCallback(response);
        }

    };

    $.ajax({
      url: Yn.ENDPOINTS.get('VENUE_USER_CHECK'),
      type: "POST",
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(dataPkg),
      success: function(response) {
        if (!!response.id) {

          console.log('success \n ' +response);
          Yn.store.get('adapter').set('authHeader', headerLabel);
          Yn.store.load(Yn.VenueUser, response);
          if ( !!successCallback ) {
            var user = Yn.User.find(response.id);
            successCallback(user);
          }

        } else {

          console.log('error \n ' +response);
          errorResponse(response);

        }
      },
      error: function(response) {

        errorResponse(response);

      }



    });
  }
});

});