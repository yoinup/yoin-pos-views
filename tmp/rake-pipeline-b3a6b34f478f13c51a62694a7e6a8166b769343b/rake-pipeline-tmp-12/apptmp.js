minispade.register('app', function() {minispade.require('ember-touch');
minispade.require('ember-data');
minispade.require('ember-data-tastypie-adapter');
minispade.require('yoin-ember/init');
minispade.require('yoin-ember/system');
minispade.require('yoin-ember/analytics');
minispade.require('yoin-ember/local_store');
minispade.require('yoin-ember/data');

Yn.embedded = false;
minispade.require('yoin-ember/models');
minispade.require('yoin-ember/fixtures/initial');
minispade.require('yoin-views');
minispade.require('yoin-views-ipad');




Me = {};
minispade.require('app/utils/application');

});minispade.register('app/screens/login/application', function() {
App = Me.Application.create({

	run: function() {

		this._super();
		Yvi.LoginScreenView.create().appendTo('#app');

  }

});

});minispade.register('app/screens/login', function() {minispade.require('app/screens/login/application');


App.appReady();

});minispade.register('app/utils/application', function() {

Me.Application = Yn.Application.extend({

  loginFB: false,
    
	settings: {
		lang: 'en-GB',
		simulateRemoteResponse: true,
		simulateRemoteResponseLatency: 100
	},

  _initStore: function() {

		this.store = DS.Store.create({
			revision: 4,
			adapter: Yn.FixtureAdapter.create({
				simulateRemoteResponse: this.settings.simulateRemoteResponse,
				latency: this.settings.simulateRemoteResponseLatency
			})
		});

  },

  runIfPossible: function() {

    var self = this;
		if ( this.isAppReady && this.isReady ) {
      
      if ( this.loginFB === true ) {

        console.log( 'login with FB....'); 

        window.fbAsyncInit = function() {

            var fbAppId = "412824808756496";
            FB.init({appId: fbAppId, 
                     status: true, 
                     cookie: true,
                     oauth:true,
                     xfbml:true,
                     useCachedDialogs: false
            });

            FB.getLoginStatus( function(response) {
                //console.log(response);

                if (response.status === 'connected')  {

                  self.run();

                } else {

                  FB.login( function(response) {
                   if (response.authResponse) {
                    self.run();
                   } else {
                     console.log('User cancelled login or did not fully authorize.');
                   }

                  }, {scope: 'email'} );
                }
             });


        };        


        (function(d){
           var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
           if (d.getElementById(id)) {return;}
           js = d.createElement('script'); js.id = id; js.async = true;
           js.src = "//connect.facebook.net/en_US/all.js";         
           ref.parentNode.insertBefore(js, ref);
         }(document));        

      } else {

        self.run();

      }

    }

  },

  run: function() {

    App.store.findQuery(Yn.Category, {});
    App.store.findQuery(Yn.Product, {});
    App.store.findQuery(Yn.Brand, {});
    App.store.findQuery(Yn.Venue, {});
    App.store.findQuery(Yn.City, {});

    App.store.findQuery(Yn.User, {});
    App.store.findQuery(Yn.Like, {});
    App.store.findQuery(Yn.Comment, {});
    App.store.findQuery(Yn.Invitation, {});
    App.store.findQuery(Yn.Activity, {});

  }

});

});