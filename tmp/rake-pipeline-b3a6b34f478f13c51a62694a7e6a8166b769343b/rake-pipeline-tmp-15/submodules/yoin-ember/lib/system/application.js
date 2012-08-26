minispade.register('yoin-ember/system/application', function() {
Yn.Application = Em.Application.extend({

	isReady: false,
	isAppReady: false,
	isNative: false,

	analytics: null,
  settings: null,
  store: null,


	moduleLang: null,



  customEvents: {
    
    webkitTransitionEnd:  'transitionEnd',
    scroll:  'scroll',
    mousewheel: 'mouseWheel'
  
  },


  init: function() {
    this._super();
    this.loadLang();
    this._initStore();
  },

	// document ready
	ready: function() {
		this._super();
   
    var bodyElement = document.body;

    //http://stackoverflow.com/questions/8071603/safari-ipad-1-how-to-disable-zoom-centering-on-double-tap-but-keep-pinch-zoom 
    bodyElement.addEventListener('touchstart', function(event) {

      if ( event.target.tagName !== 'INPUT' ) {
        //event.preventDefault();
      }

		}, false);	

		this.isReady = true;
		this.runIfPossible();

	}, 

	// must be called when the application is ready to run 
  appReady: function() {

		this.isAppReady =  true;
		this.runIfPossible();

  }, 

  runIfPossible: function() {

		if ( this.isAppReady && this.isReady ) {

      this.run();

    }

  },

  loadLang: function() {


		if ( !I18n.translations ) {
			I18n.translations = {};
		}
    var lang = this.settings.lang; 
		
		var moduleLang = this.get('moduleLang');
		//console.log('******module Langs' + moduleLang);
minispade.require(moduleLang + lang.toLowerCase() );
    I18n.defaultLocale = lang;

    if ( moment ) {

      var momentLang =( I18n.defaultLocale === "en-GB" ) ? 'en-gb' : 'es';
minispade.require('yoin-ember/moments/'+ momentLang );

      moment.lang(momentLang, Yn.Moments[momentLang] );
      moment.lang( momentLang );

    }



  },

  _initStore: function() {

    this.store = Yn.Store.create({
      serverDomain: this.settings.server
    });

  },

  run: function() {

    var isNative = (window.DeviceInfo && DeviceInfo.uuid !== undefined) || 
        (window.device && device.uuid !== undefined);

    isNative = (!!isNative);

    this.isNative = isNative;

		var analytics = (isNative) ? Yn.AnalyticsFlurry.create() : Yn.AnalyticsNull.create();
		this.analytics = Yn.AnalyticsManager.create({
			analytics: analytics
		});

  }

});

});