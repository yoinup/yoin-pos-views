minispade.register('ember-data-tastypie-adapter', function() {minispade.require("ember-data-tastypie-adapter/tastypie_adapter");

});minispade.register('ember-data-tastypie-adapter/tastypie_adapter', function() {DS.DjangoTastypieAdapter = DS.RESTAdapter.extend({
  /*
   * Set this parameter if you are planning to do cross-site
   * requests to the destination domain. Remember trailing slash
   */

  serverDomain: "",

  /*
   * This is the default Tastypie url found in the documentation.
   * You may change it if necessary when creating the adapter
   */
  tastypieApiUrl: "api/v1/",

  
  /*
   * Bulk commits are not supported at this time by the adapter.
   * Changing this setting will not work
   */
  bulkCommit: false,

  /**
   * Transforms the association fields to Resource URI django-tastypie format
   */
  _urlifyData: function(type, model, raw){
    var self = this;
    var value;
    
    var jsonData = model.toJSON({ associations: true });
   
    var associations = Em.get(type, 'associationsByName');

    associations.forEach(function(key, meta){

      if (meta.kind === "belongsTo") {
        key = meta.options.key || Em.get(model, 'namingConvention').foreignKey(key);
        value = jsonData[key];
        if (!!value) {
          jsonData[key] = self.getItemUrl(type, meta, value);
        }

      } else if (meta.kind === "hasMany") {
        key = meta.options.key || Em.get(model, 'namingConvention').keyToJSONKey(key);
        value = jsonData[key] || [];
        $.each(value, function(i, item) {
          value[i] = self.getItemUrl(type, meta, item);
        });
        }
    });

    return (raw) ? jsonData : JSON.stringify(jsonData);
  },

  /**
   * Transforms the association fields from Resource URI django-tastypie format to IDs
   */
  _deurlifyData: function(type, jsonObject) {
    var meta,
      value;

    var deurlify = function(value) {
      if (!!value) {
        return value.split('/').reverse()[1];
      }
    };

    var associations = Em.get(type, 'associationsByName');

    associations.forEach(function(key, meta) {
      meta = type.metaForProperty(key);

      if (meta.kind === "belongsTo") {
        key = meta.options.key || type.prototype.get('namingConvention').foreignKey(key);
        value = jsonObject[key];
        if (!!value) {
          jsonObject[key] = (meta.options.embedded) ? value : deurlify(value);
        }
      } else if (meta.kind === "hasMany") {
        key = meta.options.key || type.prototype.get('namingConvention').keyToJSONKey(key);
        if (!!jsonObject[key]) {
          jsonObject[key].forEach(function(item, i, collection) {
            collection[i] = (meta.options.embedded) ? item : deurlify(item);
          });
        }
      }
    });
    return jsonObject;
  },

  /*
   * Create a record in the Django server. POST actions must
   * be enabled in the Resource
   */
  createRecord: function(store, type, model) {
    var self = this;
    var root = this.rootForType(type);

    var data = this._urlifyData(type, model);

    this.ajax(root, "POST", {
      data: data,
      success: function(json) {
        json = self._deurlifyData(type, json);
        store.didCreateRecord(model, json);
      },
      error: function(error) {
      }
    });
  },

  /*
   * Edit a record in the Django server. PUT actions must
   * be enabled in the Resource
   */
  updateRecord: function(store, type, model) {
    var self = this;

    var id = Em.get(model, 'id');
    var root = this.rootForType(type);

    var data = this._urlifyData(type, model);

    var url = [root, id].join("/");

    this.ajax(url, "PUT", {
      data: data,
      success: function(json) {
        json = self._deurlifyData(type, json);
        store.didUpdateRecord(model, json);
      },
      error: function(error) {
      }
    });
  },

  /*
   * Delete a record in the Django server. DELETE actions
   * must be enabled in the Resource
   */
  deleteRecord: function(store, type, model) {
    var id = Em.get(model, 'id');
    var root = this.rootForType(type);

    var url = [root, id].join("/");

    this.ajax(url, "DELETE", {
      success: function(json) {
        store.didDeleteRecord(model);
      }
    });
  },

  find: function(store, type, id) {
    var self = this;

    // FindMany array through subset of resources
    if (id instanceof Array) {
      id = "set/" + id.join(";");
    }

    var root = this.rootForType(type);
    var url = [root, id].join("/");

    this.ajax(url, "GET", {
      success: function(json) {

        // Loads collection for findMany
        if (json.hasOwnProperty("objects")) {
          json["objects"].forEach(function(item, i, collection) {
            collection[i] = self._deurlifyData(type, item);
          });
          store.loadMany(type, json["objects"]);
        // Loads unique element with find by id
        } else {
          json = self._deurlifyData(type, json);
          store.load(type, json);
        }
      }
    });
  },

  findMany: function() {
    this.find.apply(this, arguments);
  },

  findAll: function(store, type) {
    var self = this;
    var root = this.rootForType(type);

    this.ajax(root, "GET", {
      success: function(json) {
        json["objects"].forEach(function(item, i, collection) {
          collection[i] = self._deurlifyData(type, item);
        });
        store.loadMany(type, json["objects"]);
      }
    });
  },

  findQuery: function(store, type, query, recordArray){
    var self = this;
    var root = this.rootForType(type);

    this.ajax(root, "GET", {
      data: query,
      success: function(json) {
        json["objects"].forEach(function(item, i, collection) {
          collection[i] = self._deurlifyData(type, item);
        });
        recordArray.load(json["objects"]);
      }
    });
  },

  getItemUrl: function(type, meta, id){
    var url;
    Em.assert("tastypieApiUrl parameters is mandatory.", !!this.tastypieApiUrl);
    url = this.rootForType(meta.type);
    return ["", this.tastypieApiUrl.slice(0,-1), url, id, ""].join('/');
  },

  getTastypieUrl: function(url){
    Em.assert("tastypieApiUrl parameters is mandatory.", !!this.tastypieApiUrl);
    return this.serverDomain + this.tastypieApiUrl + url + "/";
 
  },

  ajax: function(url, type, hash) {
    hash.url = this.getTastypieUrl(url);
    hash.type = type;
    hash.dataType = "json";
    hash.contentType = 'application/json';
    jQuery.ajax(hash);
  },

  /**
    * django-tastypie does not pluralize names for lists
    */
  pluralize: function(name) {
    return name;
  }
});

});minispade.register('yoin-ember/analytics', function() {minispade.require('yoin-ember/analytics/analytics');
minispade.require('yoin-ember/analytics/console');
minispade.require('yoin-ember/analytics/flurry');
minispade.require('yoin-ember/analytics/null');
minispade.require('yoin-ember/analytics/manager');

});minispade.register('yoin-ember/analytics/analytics', function() {Yn.Analytics = Em.Object.extend({

	logEvent: function(name, params) {

	}

});

});minispade.register('yoin-ember/analytics/console', function() {Yn.AnalyticsConsole = Yn.Analytics.extend({

	logEvent: function(name, params) {

    var result = (params) ? Ember.String.fmt("%@ - %@", [name, params] ) : name;
		console.log( result );
	}

});

});minispade.register('yoin-ember/analytics/flurry', function() {Yn.AnalyticsFlurry = Yn.Analytics.extend({

	init: function () {
		this._super();
		this.manager = window.plugins.FlurryPlugin;
	},

	logEvent: function(name, params) {
		this.manager.logEvent(name, params);
	}

});

});minispade.register('yoin-ember/analytics/manager', function() {Yn.AnalyticsManager = Yn.Analytics.extend({

	analytics: null,
	
	init: function () {
		this._super();

		if ( !this.analytics ) {

			this.analytics = Yn.AnalyticsNull.create();

		}



	},

	logEvent: function(name, params) {

			this.analytics.logEvent(name, params);

	}

});

});minispade.register('yoin-ember/analytics/null', function() {Yn.AnalyticsNull = Yn.Analytics.extend({

	logEvent: function(name, params) {

	}

});

});minispade.register('yoin-ember/data', function() {minispade.require('yoin-ember/data/adapter');
minispade.require('yoin-ember/data/fixture_adapter');
minispade.require('yoin-ember/data/store');
minispade.require('yoin-ember/data/cache');

});minispade.register('yoin-ember/data/adapter', function() {
var get = Ember.get, set = Ember.set, getPath = Ember.getPath;

/*
 * The DjangoTastypie Adapter extends the default RESTAdapter
 * from Ember.js in order to work with a REST interface provided
 * by django-tastypie.
 *
 * Some details of implementation of that library that differ
 * from the Rails oriented RESTAdapter are:
 * - Sent data must be stringified.
 * - Sent data must include a CONTENT_TYPE='application/json' header
 * - There are no plurals for collection of objects
 * - Returned objects are not inside a json[root] object
 * - Bulk Commits are not supported by default
 *
 */

Yn.DjangoTastypieAdapter = DS.DjangoTastypieAdapter.extend({

  /*
   * API credential to be inserted in the ajax requests
   */
  authHeader: null,


  init: function() {
    this._super();

  },

  /*
   * Create a record in the Django server. POST actions must
   * be enabled in the Resource
   */
  createRecord: function(store, type, model) {
    var self = this;

    var root = this.rootForType(type);

    var data = this._urlifyData(type, model);

    this.ajax(root, "POST", {
      data: data,
      success: function(json) {
        json = self._deurlifyData(type, json);
        store.didCreateRecord(model, json);
      },
      error: function(error) {

        model.fire('didCreateError', error);

      }
    });
  },

  /*
   * Edit a record in the Django server. PUT actions must
   * be enabled in the Resource
   */
  updateRecord: function(store, type, model) {
    var self = this;
    
    var id = get(model, 'id');
    var root = this.rootForType(type);

    var data = this._urlifyData(type, model);

    var url = [root, id].join("/");

    this.ajax(url, "PUT", {
      data: data,
      success: function(json) {
        json = self._deurlifyData(type, json);
        store.didUpdateRecord(model, json);
      },
      error: function(error) {
        model.fire('didUpdateError', error);
      }
    });
  },

  deleteRecord: function(store, type, model) {

    var id = Em.get(model, 'id'),
        root = this.rootForType(type),
        url = [root, id].join("/");

    this.ajax(url, "DELETE", {
      success: function(json) {
        store.didDeleteRecord(model);
      },
      error: function(error) {
        model.fire('didDeleteError', error);
      }
    });
  },

  /*
   * A temporal error manager for ember-data in findQueries
   */
  findQuery: function(store, type, query, recordArray){
    var self = this;
    var root = this.rootForType(type);

    this.ajax(root, "GET", {
      data: query,
      success: function(json) {
        json["objects"].forEach(function(item, i, collection) {
          collection[i] = self._deurlifyData(type, item);
        });
        recordArray.load(json["objects"]);
      },
      error: function(xhr) {
        recordArray.set('isError', true);
      }
    });
  },

  ajax: function(url, type, hash) {

    hash.cache = false;

    // If there is a locale defined, send the Accept-Language header
    if (typeof I18n !== "undefined" && !!I18n.defaultLocale) {
      hash.headers = jQuery.extend(hash.headers, {"Accept-Language": I18n.defaultLocale});
    }

    // If the user is logged in. Send his credentials
    if (!!this.get('authHeader')) {
      hash.headers = jQuery.extend(hash.headers, {
        "Authorization": this.get('authHeader')
      });
    }

    this._super(url, type, hash);
  }

});

});minispade.register('yoin-ember/data/cache', function() {Yn.cacheStore = {

  save: function(destinationKey, content) {
    var attributes,
      associations,
      jsonObject,
      jsonArray;

    jsonArray = [];

    if (!!content) {
      content.forEach(function(item, index, collection) {

        jsonArray.push(item.toJSON({ associations: true}));
        
      });
    }

    localStorage.setItem(destinationKey, JSON.stringify(jsonArray));
  },

  load: function(type) {
    var array;
    var json = localStorage.getItem(type.toString());
    
    if (!!json) {
      array = DS.RecordArray.create({ type: type, content: Ember.A([]), store: Yn.store });
      Yn.store.registerRecordArray(array, type);
      Yn.store.loadMany(type, JSON.parse(json) );
      Yn.store.typeMapFor(type).findAllCache =  array;
      array.set('isLoaded', true);
      return array;
    }
  }
};

});minispade.register('yoin-ember/data/fixture_adapter', function() {var get = Ember.get;

Yn.FixtureAdapter = DS.Adapter.extend({

  simulateRemoteResponse: true,

  latency: 50,

  fixturesForType: function(type) {
    return type.FIXTURES ? Ember.A(type.FIXTURES) : null;
  },

  queryFixtures: function(fixtures, type, query) {

    var order, limit;

    if (query.hasOwnProperty('order_by')){
      order = query.order_by;
    }
    delete query.order_by;

    if (query.hasOwnProperty('limit')){
      limit = query.limit;
    }
    delete query.limit;

    $.each(query, function(key, value){
      fixtures = fixtures.filter(function(item){
        if (item.hasOwnProperty(key)) {
          if (item[key] == value) { return true; }
        } else {
        // SPECIAL CASES
          if (!!type.FILTERS && type.FILTERS.hasOwnProperty(key)){
            return type.FILTERS[key](item, value);
          }
        }
      });
    });

    // TODO Sort final result
    if (!!order){
      
      // Reverse sorting using '-' ?
      var reverse = 1;
      if (order.charAt(0) == '-'){
          order = order.slice(1);
          reverse = -1;
      }

      var compare = function(a, b){
        if (a[order] < b[order]) return -1*reverse;
        if (a[order] > b[order]) return 1*reverse;
        return 0;
      };

      fixtures.sort(compare);
    }


    // limit
    if (!!limit) {

      fixtures = fixtures.slice(0, limit);

    }

    return fixtures;
  },

  mockJSON: function(type, record) {
    return record.toJSON({associations: true});
  },

  generateIdForRecord: function(store, record) {
    return Ember.guidFor(record);
  },

  find: function(store, type, id) {
    var fixtures = this.fixturesForType(type);

    if (fixtures) {
      fixtures = fixtures.findProperty('id', id.toString() );
    }

    Ember.assert("Unable to find fixtures for model type "+type.toString(), !!fixtures);

    this.simulateRemoteCall(function() {
      store.load(type, fixtures);
    }, store, type);
  },

  findMany: function(store, type, ids) {
    var fixtures = this.fixturesForType(type);

    if (fixtures) {
      fixtures = fixtures.filter(function(item) {
        return ids.indexOf(item.id) !== -1;
      });
    }

    Ember.assert("Unable to find fixtures for model type "+type.toString(), !!fixtures);

    this.simulateRemoteCall(function() {
      store.loadMany(type, fixtures);
    }, store, type);
  },

  findAll: function(store, type) {
    var fixtures = this.fixturesForType(type);

    Ember.assert("Unable to find fixtures for model type "+type.toString(), !!fixtures);

    this.simulateRemoteCall(function() {
      store.loadMany(type, fixtures);
    }, store, type);
  },

  findQuery: function(store, type, query, array) {
    var fixtures = this.fixturesForType(type);

    fixtures = this.queryFixtures(fixtures, type, query);

    Ember.assert("Unable to find fixtures for model type "+type.toString(), !!fixtures);

    this.simulateRemoteCall(function() {
      array.load(fixtures);
    }, store, type);
  },

  createRecord: function(store, type, record) {
    var fixture = this.mockJSON(type, record);

    fixture.id = this.generateIdForRecord(store, record);

    this.simulateRemoteCall(function() {
      store.didCreateRecord(record, fixture);
    }, store, type, record);
  },

  updateRecord: function(store, type, record) {
    var fixture = this.mockJSON(type, record);

    this.simulateRemoteCall(function() {
      store.didUpdateRecord(record, fixture);
    }, store, type, record);
  },

  deleteRecord: function(store, type, record) {
    this.simulateRemoteCall(function() {
      store.didDeleteRecord(record);
    }, store, type, record);
  },

  /*
@private
*/
  simulateRemoteCall: function(callback, store, type, record) {
    if (get(this, 'simulateRemoteResponse')) {
      setTimeout(callback, get(this, 'latency'));
    } else {
      callback();
    }
  }
});


});minispade.register('yoin-ember/data/store', function() {
Yn.Store = DS.Store.extend({
  revision: 4,

  serverDomain: "",

  init: function() {
    this._super();
    this.adapter.serverDomain = this.serverDomain;
	Yn.ENDPOINTS.set('store', this);
    Yn.store = this;
  },

  adapter: Yn.DjangoTastypieAdapter.create({

  }),

  cleanRecordCache: function(type) {

    var typeMaps = this.get('typeMaps');
    var guidForType = Ember.guidFor(type);
    typeMaps[guidForType] = {
      idToCid: {},
      clientIds: [],
      cidToHash: {},
      recordArrays: []
    };
    this.set('typeMaps', typeMaps);
    //this.set('typeMaps', {});

  }

});

});minispade.register('yoin-ember/fixtures/initial', function() {Yn.Category.FIXTURES = [
  {"id": "1", "name": "Restaurantes", "order": 2, "icon": "l", "resource_uri": "1", "subcategory": 0}, 
  {"id": "2", "name": "Cafe", "order": 3, "icon": "d", "resource_uri": "2", "subcategory": 0}, 
  {"id": "3", "name": "Ropa", "order": 4, "icon": "j", "resource_uri": "3", "subcategory": 0}, 
  {"id": "5", "name": "Promo", "order": 1, "icon": "R", "resource_uri": "5", "subcategory": 1}, 
  {"id": "6", "name": "Tarjeta Regalo", "order": 6, "icon": "K", "resource_uri": "6", "subcategory": 2}, 
  {"id": "4", "name": "Bebida", "order": 5, "icon": "n", "resource_uri": "4", "subcategory": 0}
];

Yn.City.FIXTURES = [
  {"id": "9", "lat": 51.508129, "lon": -0.128005, "name": "London", "is_default": true},
  {"id": "10", "lat": 51.508129, "lon": -0.128005, "name": "Madrid", "is_default": false},
  {"id": "11", "lat": 51.508129, "lon": -0.128005, "name": "Barcelona", "is_default": false},
  {"id": "12", "lat": 51.508129, "lon": -0.128005, "name": "Sevilla", "is_default": false},
  {"id": "13", "lat": 51.508129, "lon": -0.128005, "name": "Paris", "is_default": false}
];


Yn.Brand.FIXTURES = [
  {"id": "21", "name": "Casio London", "picture": "./assets/fixtures/logos/casio_london.png", "resource_uri": "21"},
  {"id": "20", "name": "Tattershall Castle", "picture": "./assets/fixtures/logos/tattershall_castle.png", "resource_uri": "20"},
  {"id": "19", "name": "The archduke", "picture": "./assets/fixtures/logos/the_archduke.png", "resource_uri": "19"},
  {"id": "18", "name": "Yacht London", "picture": "./assets/fixtures/logos/yacht_london.png", "resource_uri": "18"},
  {"id": "17", "name": "Mishkin's", "picture": "./assets/fixtures/logos/mishkins.png", "resource_uri": "17"},
  {"id": "16", "name": "Joe Allen", "picture": "./assets/fixtures/logos/joe_allen.png", "resource_uri": "16"},
  {"id": "15", "name": "Pizza Express", "picture": "./assets/fixtures/logos/pizza_express.png", "resource_uri": "15"},
  {"id": "14", "name": "Armani", "picture": "./assets/fixtures/logos/armani.png", "resource_uri": "14"},
  {"id": "13", "name": "Costa Cafe", "picture": "./assets/fixtures/logos/costa_cafe.png", "resource_uri": "13"},
  {"id": "6", "name": "Zara", "picture": "./assets/fixtures/logos/zara.png", "resource_uri": "6"},
  {"id": "4", "name": "Starbucks", "picture": "./assets/fixtures/logos/starbucks.png", "resource_uri": "4"},
  {"id": "2", "name": "Burger King", "picture": "./assets/fixtures/logos/burguer_king.png", "resource_uri": "2"},
  {"id": "12", "name": "Mcdonalds", "picture": "./assets/fixtures/logos/macdonalds.png", "resource_uri": "12"}
];


Yn.Venue.FIXTURES = [
  {"distance": 3, "users":["15", "13", "16"], "address": "85 Gloucester Road South Kensington", "brand": "2", "city": "9", "id": "236", "lat": 51.494439, "lon": -0.182407, "name": "Burger King", "products": ["4"], "resource_uri": "236", "zip_code": "SW7 4SS"}, 
  {"distance": 30, "users":["15", "13", "16"], "address": "142-144 Wardour Street City of Westminster, W1F 8, United Kingdom", "brand": "2", "city": "9", "id": "235", "lat": 51.514175, "lon": -0.134597, "name": "Burger King", "products": ["4"], "resource_uri": "235", "zip_code": "W1F 8"},
  {"distance": 50, "users":["15", "13", "16"], "address": "85 Gloucester Road South Kensington, London SW7 4SS, United ", "brand": "6", "city": "9", "id": "248", "lat": 51.494439, "lon": -0.182407, "name": "Zara", "products": ["31"], "resource_uri": "248", "zip_code": "SW7 4SS"},
  {"distance": 3, "users":["15", "13", "16"], "address": "Tattershall Castle\u200e Whitehall Police Station Victoria Embankment, Whitehall, Lon", "brand": "20", "city": "9", "id": "283", "lat": 51.505104, "lon": -0.126668, "name": "Tattershall Castle", "products": ["32", "27"], "resource_uri": "283", "zip_code": "UK SW1A"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "65 Sloane Avenue Chelsea, UK SW3 3, United Kingdom", "brand": "4", "city": "9", "id": "243", "lat": 51.491976, "lon": -0.164972, "name": "Starbucks", "products": ["12", "33", "13"], "resource_uri": "243", "zip_code": "UK SW3 3"}, 
  {"distance": 3, "users":["15", "13", "16"], "address": "52-56 Long Acre Covent Garden", "brand": "6", "city": "9", "id": "249", "lat": 51.511358, "lon": -0.123103, "name": "Zara", "products": ["19"], "resource_uri": "249", "zip_code": "WC2E 9JR"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "138 Camden High Street London ", "brand": "2", "city": "9", "id": "237", "lat": 51.537766, "lon": -0.141676, "name": "Burger King", "products": ["4", "36"], "resource_uri": "237", "zip_code": "NW1 0LU"}, 
  {"distance": 3, "users":["15", "13", "16"], "address": "134 Tottenham Court Road", "brand": "12", "city": "9", "id": "269", "lat": 51.524375, "lon": -0.137906, "name": "Mcdonalds", "products": ["38"], "resource_uri": "269", "zip_code": "W1T 5BA"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "Temple Pier Victoria Embankment", "brand": "18", "city": "9", "id": "281", "lat": 51.51027, "lon": -0.116707, "name": "Yacht London", "products": ["25", "42"], "resource_uri": "281", "zip_code": "WC2R 2PN"}, 
  {"distance": 3, "users":["15", "13", "16"], "address": "51 Great Russell Street London, Greater London WC1B 3BA, United Kingdom", "brand": "4", "city": "9", "id": "242", "lat": 51.518328, "lon": -0.125884, "name": "Starbucks", "products": ["39"], "resource_uri": "242", "zip_code": "WC1B 3BA"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "Unit 25 the Concourse", "brand": "12", "city": "9", "id": "267", "lat": 51.517142, "lon": -0.082633, "name": "Mcdonalds", "products": ["4"], "resource_uri": "267", "zip_code": "EC2M 7PY"}, 
  {"distance": 3, "users":["15", "13", "16"], "address": "302-304 Pentonville Road", "brand": "12", "city": "9", "id": "266", "lat": 51.53093, "lon": -0.122207, "name": "Mcdonalds", "products": ["4"], "resource_uri": "266", "zip_code": "N1 9XD"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "115 New Bond Street Mayfair, London W1S 1DP, United Kingdom", "brand": "14", "city": "9", "id": "274", "lat": 51.513035, "lon": -0.145344, "name": "Armani ", "products": ["41"], "resource_uri": "274", "zip_code": "W1S 1DP"}, 
  {"distance": 3, "users":["15", "13", "16"], "address": "191 Brompton Road", "brand": "14", "city": "9", "id": "275", "lat": 51.498012, "lon": -0.166425, "name": "Armani", "products": ["41", "21"], "resource_uri": "275", "zip_code": " SW3 1NE"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "13 New Row", "brand": "13", "city": "9", "id": "273", "lat": 51.511194, "lon": -0.126074, "name": "Costa Cafe", "products": ["40", "20"], "resource_uri": "273", "zip_code": "WC2N 4LF"}, 
  {"distance": 3, "users":["15", "13", "16"], "address": "118 King's Cross Road King's Cross", "brand": "13", "city": "9", "id": "272", "lat": 51.528529, "lon": -0.115695, "name": "Costa Cafe", "products": ["40"], "resource_uri": "272", "zip_code": "WC1X 9DS"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "39 Old Compton Street London Chinatown", "brand": "13", "city": "9", "id": "271", "lat": 51.512046, "lon": -0.129753, "name": "Costa Cafe", "products": ["20"], "resource_uri": "271", "zip_code": "W1D 5JX"}, 
  {"distance": 3, "users":["15", "13", "16"], "address": "8/10 Oxford Street Westminster", "brand": "12", "city": "9", "id": "265", "lat": 51.516383, "lon": -0.131045, "name": "Mcdonalds", "products": ["4"], "resource_uri": "265", "zip_code": "W1D 1AW"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "65 Duke Of York Square Chelsea", "brand": "6", "city": "9", "id": "247", "lat": 51.491443, "lon": -0.159392, "name": "Zara", "products": ["19"], "resource_uri": "247", "zip_code": "SW3 4LY"}, 
  {"distance": 3, "users":["15", "13", "16"], "address": "175 Tottenham Court Road Bloomsbury, London W1T 7NU, United Kingdom", "brand": "4", "city": "9", "id": "241", "lat": 51.522389, "lon": -0.135629, "name": "Starbucks", "products": ["12", "13"], "resource_uri": "241", "zip_code": "W1T 7NU"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "153 Concert Hall Approach", "brand": "19", "city": "9", "id": "282", "lat": 51.505017, "lon": -0.116069, "name": "The archduke", "products": ["26"], "resource_uri": "282", "zip_code": "SE1 8XU"}, 
  {"distance": 3, "users":["15", "13", "16"], "address": "Unit 5B (The Market), Covent Garden", "brand": "21", "city": "9", "id": "284", "lat": 51.512061, "lon": -0.122965, "name": "Casio London", "products": ["28"], "resource_uri": "284", "zip_code": "WC2E 8RA"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "Pizza Express Restaurants\u200e 147 Strand London, Greater", "brand": "15", "city": "9", "id": "276", "lat": 51.51157, "lon": -0.118355, "name": "Pizza Express", "products": ["22"], "resource_uri": "276", "zip_code": "WC2R 1JA"},
  {"distance": 3, "users":["15", "13", "16"], "address": "13 Exeter Street London", "brand": "16", "city": "9", "id": "279", "lat": 51.511652, "lon": -0.120356, "name": "Joe Allen", "products": ["23"], "resource_uri": "279", "zip_code": "WC2E 7DT"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "25 Catherine St., London, Greater London ", "brand": "17", "city": "9", "id": "280", "lat": 51.512567, "lon": -0.120512, "name": "Mishkin's", "products": ["24"], "resource_uri": "280", "zip_code": "WC2B 5JS"},
  {"distance": 3, "users":["15", "13", "16"], "address": "68/69 St Martins Lane, Westminster", "brand": "12", "city": "9", "id": "270", "lat": 51.511504, "lon": -0.127075, "name": "Mcdonalds", "products": ["30", "34", "43", "37", "38"], "resource_uri": "270", "zip_code": "WC2N 4JS"}, 
  {"distance": 50, "users":["15", "13", "16"], "address": "241 City Road, Islington", "brand": "12", "city": "9", "id": "268", "lat": 51.529169, "lon": -0.095226, "name": "Mcdonalds", "products": ["30"], "resource_uri": "268", "zip_code": "EC1V 1JQ"}, 
  {"distance": 3, "users":["15", "13", "16"], "address": "9-12 Bow Street City of Westminster, ", "brand": "15", "city": "9", "id": "277", "lat": 51.513515, "lon": -0.122804, "name": "Pizza Express", "products": ["22"], "resource_uri": "277", "zip_code": "WC2E 7AH"},
  {"distance": 50, "users":["15", "13", "16"], "address": "80-81 Saint Martin's Lane London, City of London, Greater London ,", "brand": "15", "city": "9", "id": "278", "lat": 51.511366, "lon": -0.127283, "name": "Pizza Express", "products": ["22"], "resource_uri": "278", "zip_code": "WC2N 4AA"}
];


Yn.VenueUser.FIXTURES = [];

Yn.Product.FIXTURES = [
  {"has_voted": true, "like_count": 1, "comment_count": 1, "brand": "14", "category": "6", "description": "", "icon": "K", "id": "41", "name": "Armani GiftCard", "picture": "./assets/fixtures/products/yoin_card_10.png", "price": 10.0, "resource_uri": "41"}, 
  {"has_voted": true, "like_count": 0, "comment_count": 1, "brand": "16", "category": "1", "description": "", "icon": "l", "id": "23", "name": "Joe Allen", "picture": "./assets/fixtures/products/restaurant.png", "price": 25.0,  "resource_uri": "23"}, 
  {"has_voted": true, "like_count": 5, "comment_count": 1, "brand": "12", "category": "1", "description": "", "icon": "f", "id": "37", "name": "Mcdonalds Burguer", "picture": "./assets/fixtures/products/mcdonalds_hamburguesa.png", "price": 5.0,  "resource_uri": "37"}, 
  {"has_voted": true, "like_count": 4, "comment_count": 1, "brand": "12", "category": "5", "description": "", "icon": "R", "id": "30", "name": "2x1 Mcdonalds Big Mac", "picture": "./assets/fixtures/products/mcdonalds_big_mac.png", "price": 5.0,  "resource_uri": "30"}, 
  {"has_voted": true, "like_count": 3, "comment_count": 1, "brand": "18", "category": "6", "description": "", "icon": "K", "id": "42", "name": "Yacht London Giftcard", "picture": "./assets/fixtures/products/yoin_card_10.png", "price": 10.0, "resource_uri": "42"}, 
  {"has_voted": true, "like_count": 2, "comment_count": 1, "brand": "20", "category": "6", "description": "", "icon": "K", "id": "32", "name": "Tattershall Gift Card", "picture": "./assets/fixtures/products/yoin_card_10.png", "price": 10.0,  "resource_uri": "32"}, 
  {"has_voted": true, "like_count": 1, "comment_count": 1, "brand": "2", "category": "1", "description": "", "icon": "w", "id": "6", "name": "Brownie", "picture": "./assets/fixtures/products/brownie.png", "price": 12.0,  "resource_uri": "6"}, 
  {"has_voted": true, "like_count": 2, "comment_count": 1, "brand": "15", "category": "1", "description": "", "icon": "l", "id": "22", "name": "30 % Pizza Express", "picture": "./assets/fixtures/products/30_pizza_express.png", "price": 7.0,  "resource_uri": "22"}, 
  {"has_voted": true, "like_count": 8, "comment_count": 1, "brand": "6", "category": "5", "description": "", "icon": "R", "id": "19", "name": "10\u00a3 off Purse Zara", "picture": "./assets/fixtures/products/purse_zara.png", "price": 20.0,  "resource_uri": "19"},
  {"has_voted": true, "like_count": 1, "comment_count": 1, "brand": "13", "category": "5", "description": "", "icon": "d", "id": "35", "name": "Costa Cafe", "picture": "./assets/fixtures/products/coffe_costa_cafe.png", "price": 4.0,  "resource_uri": "35"}, 
  {"has_voted": true, "like_count": 9, "comment_count": 1, "brand": "6", "category": "3", "description": "", "icon": "j", "id": "31", "name": "Suit jacket Zara", "picture": "./assets/fixtures/products/suit_jacket_zara.png", "price": 29.0, "resource_uri": "31"}, 
  {"has_voted": true, "like_count": 3, "comment_count": 1, "brand": "2", "category": "1", "description": "", "icon": "w", "id": "36", "name": "Burguer King Ice Cream", "picture": "./assets/fixtures/products/burguer_king_helado.png", "price": 2.0,  "resource_uri": "36"}, 
  {"has_voted": true, "like_count": 3, "comment_count": 1, "brand": "4", "category": "5", "description": "", "icon": "R", "id": "12", "name": "50% Coffe Starbucks", "picture": "./assets/fixtures/products/starbucks_cafe.png", "price": 10.0,  "resource_uri": "12"}, 
  {"has_voted": true, "like_count": 7, "comment_count": 1, "brand": "21", "category": "3", "description": "", "icon": "j", "id": "28", "name": "Casio watch", "picture": "./assets/fixtures/products/watch_casio_london.png", "price": 55.0,  "resource_uri": "28"}, 
  {"has_voted": true, "like_count": 9, "comment_count": 1, "brand": "20", "category": "4", "description": "", "icon": "n", "id": "27", "name": "Tattershall Castle Drink", "picture": "./assets/fixtures/products/drinks.png", "price": 12.0,  "resource_uri": "27"}, 
  {"has_voted": true, "like_count": 6, "comment_count": 1, "brand": "17", "category": "1", "description": "", "icon": "l", "id": "24", "name": "Mishkin's ", "picture": "./assets/fixtures/products/restaurant.png", "price": 20.0,  "resource_uri": "24"}, 
  {"has_voted": true, "like_count": 1, "comment_count": 1, "brand": "13", "category": "2", "description": "", "icon": "d", "id": "20", "name": "Coffe Costa Cafe", "picture": "./assets/fixtures/products/coffe_costa_cafe.png", "price": 4.0,  "resource_uri": "20"}, 
  {"has_voted": true, "like_count": 3, "comment_count": 1, "brand": "14", "category": "3", "description": "", "icon": "j", "id": "21", "name": "Armani Jeans", "picture": "./assets/fixtures/products/armani_jeans.png", "price": 120.0,  "resource_uri": "21"}, 
  {"has_voted": true, "like_count": 6, "comment_count": 1, "brand": "12", "category": "6", "description": "", "icon": "K", "id": "38", "name": "Mcdonalds Giftcard", "picture": "./assets/fixtures/products/yoin_card_10.png", "price": 10.0,  "resource_uri": "38"}, 
  {"has_voted": true, "like_count": 5, "comment_count": 1, "brand": "18", "category": "4", "description": "", "icon": "R", "id": "25", "name": "2x1 Yacht London", "picture": "./assets/fixtures/products/restaurant.png", "price": 10.0,  "resource_uri": "25"}, 
  {"has_voted": true, "like_count": 4, "comment_count": 1, "brand": "19", "category": "4", "description": "", "icon": "l", "id": "26", "name": "The Archduke's Menu", "picture": "./assets/fixtures/products/restaurant.png", "price": 9.0,  "resource_uri": "26"}, 
  {"has_voted": true, "like_count": 3, "comment_count": 1, "brand": "4", "category": "6", "description": "lala", "icon": "K", "id": "39", "name": "Starbucks Giftcard", "picture": "./assets/fixtures/products/yoin_card_10.png", "price": 10.0,  "resource_uri": "39"}, 
  {"has_voted": true, "like_count": 2, "comment_count": 1, "brand": "4", "category": "5", "description": "", "icon": "R", "id": "33", "name": "10% off Mocha Coffe", "picture": "./assets/fixtures/products/starbucks_mocha.png", "price": 5.0,  "resource_uri": "33"}, 
  {"has_voted": true, "like_count": 7, "comment_count": 1, "brand": "13", "category": "6", "description": "m", "icon": "K", "id": "40", "name": "Costa Cafe Giftcard", "picture": "./assets/fixtures/products/yoin_card_10.png", "price": 10.0,  "resource_uri": "40"},
  {"has_voted": true, "like_count": 9, "comment_count": 1, "brand": "4", "category": "2", "description": "", "icon": "d", "id": "13", "name": "Mocha Coffe", "picture": "./assets/fixtures/products/starbucks_mocha.png", "price": 10.0,  "resource_uri": "13"}, 
  {"has_voted": true, "like_count": 8, "comment_count": 1, "brand": "12", "category": "5", "description": "", "icon": "w", "id": "34", "name": "Brownie Mcdonalds", "picture": "./assets/fixtures/products/brownie.png", "price": 4.0,  "resource_uri": "34"}, 
  {"has_voted": true, "like_count": 2, "comment_count": 1, "brand": "2", "category": "5", "description": "", "icon": "R", "id": "4", "name": "Free Whopper", "picture": "./assets/fixtures/products/40_burger_king_menu.png", "price": 10.0,  "resource_uri": "4"}, 
  {"has_voted": true, "like_count": 1, "comment_count": 1, "brand": "12", "category": "2", "description": "", "icon": "d", "id": "43", "name": "Mcdonalds Coffe", "picture": "./assets/fixtures/products/mcdonalds_coffe.png", "price": 5.0,  "resource_uri": "43"}
];

Yn.User.FIXTURES = [
  {"city": "9", "id": "17", "name": "Keny West", "avatar": "./assets/images/ella.jpg", "status": "Disponible"}, 
  {"city": null, "id": "15", "name": "Empty1", "avatar": "http://flickholdr.com/48/48/jayz/bw", "status": "Disponible"},
  {"city": "9", "id": "3", "name": "Ale Lopez", "avatar": "http://flickholdr.com/48/48/jayz/bw", "status": "Disponible"}, 
  {"city": "9", "id": "11", "name": "Diego Escalante", "avatar": "http://flickholdr.com/48/48/jayz/bw", "status": "Disponible"},
  {"city": "9", "id": "16", "name": "Carlos Lagares", "avatar": "http://flickholdr.com/48/48/jayz/bw", "status": "Disponible"}, 
  {"city": "9", "id": "5", "name": "Edipotrebol", "avatar": "http://flickholdr.com/48/48/jayz/bw", "status": "Disponible"},
  {"city": "9", "id": "14", "name": "Empty2", "avatar": "http://flickholdr.com/48/48/jayz/bw", "status": "Disponible"},
  {"city": "9", "id": "2", "name": "Pepe Cano", "avatar": "http://flickholdr.com/48/48/jayz/bw", "status": "Disponible"}
];

var date = "Sat, 31 Dec 2011 00:08:16 GMT";

Yn.Invitation.FIXTURES = [
  {"id": "1", "consumed": false, "created_at": date, "dateConsumed": null,  "from_user": "17", "product": "41", "to_user": "16", "transaction_id": "000056-0011", "venue_user": null},
  {"id": "2", "consumed": false, "created_at": date, "dateConsumed": null,  "from_user": "16", "product": "43", "to_user": "17", "transaction_id": "000057-0011", "venue_user": null},
  {"id": "3", "consumed": false, "created_at": date, "dateConsumed": null,  "from_user": "16", "product": "41", "to_user": "17", "transaction_id": "000058-0011", "venue_user": null}
];


//var date = new Date("Sat, 31 Dec 2011 00:08:16 GMT");

Yn.Like.FIXTURES = [
  { "id": "1", "user": "17", "created_at": date, "product": null, "venue": "236" },
  { "id": "2", "user": "17", "created_at": date, "product": "20", "venue": null },
  { "id": "3", "user": "17", "created_at": date, "product": "23", "venue": null }
];

Yn.Comment.FIXTURES = [
  { "id": "1", "user": "17", "created_at": date, "product": "24", "venue": null, "description": " Hola hoal ahoala hoala hola jola" },
  { "id": "2", "user": "17", "created_at": date, "product": null, "venue": "236", "description": " Hola hoal ahoala hoala hola jola" },
  { "id": "3", "user": "17", "created_at": date, "product": null, "venue": "235", "description": " Hola hoal ahoala hoala hola jola" }
];


Yn.Activity.FIXTURES = [
  { "id": "1", "like": "1", "comment": null, "invitation":null },
  { "id": "2", "like": "2", "comment": null, "invitation":null },
  { "id": "3", "like": "3", "comment": null, "invitation":null },
  { "id": "4", "like": null, "comment": "1", "invitation":null },
  { "id": "5", "like": null, "comment": "2", "invitation":null },
  { "id": "6", "like": null, "comment": "3", "invitation":null },
  { "id": "7", "like": null, "comment": null, "invitation":"1" },
  { "id": "8", "like": null, "comment": null, "invitation":"2" }
];

});minispade.register('yoin-ember/init', function() {minispade.require('yoin-ember/init/model');
minispade.require('yoin-ember/init/namespace');
minispade.require('yoin-ember/init/env');
minispade.require('yoin-ember/init/state_manager');
minispade.require('yoin-ember/init/endpoints');

});minispade.register('yoin-ember/init/endpoints', function() {// Extra end points not used by ember-data
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

});minispade.register('yoin-ember/init/env', function() {Yn.Env = {};

Yn.Env.OnClickAndTouch = 'ontouchstart' in window && 'onclick' in window;

});minispade.register('yoin-ember/init/model', function() {
DS.Model.reopen({

  didCreateError: Ember.K,
  didUpdateError: Ember.K,
  didDeleteError: Ember.K

});

});minispade.register('yoin-ember/init/namespace', function() {Yn = Ember.Namespace.create();
Yn.Moments = {};
Yn.embedded = true;

});minispade.register('yoin-ember/init/state_manager', function() {
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

});minispade.register('yoin-ember/local_store', function() {minispade.require('yoin-ember/local_store/null');
minispade.require('yoin-ember/local_store/storage');

});minispade.register('yoin-ember/local_store/null', function() {
// Using LocalStore in our App must not be compulsory
Yn.LocalStoreNull = Em.Object.extend({

  has: function(key) {
    return false;
  },

  get: function(key) {
    return undefined;
  },

  set: function(key, value) {
  },

  del: function(key) {
  }

});


});minispade.register('yoin-ember/local_store/storage', function() {//https://github.com/twilio/BankersBox ( do redis style )
// 
// wrap the localStorage api 
// Allow to set/get JSON objects
//
// TODO: secure HASH for get-set
Yn.LocalStoreStorage = Em.Object.extend({

  has: function(key) {
    return localStorage.hasOwnProperty(key);
  },

  get: function(key) {

    var resultString = localStorage.getItem(key),
        result;

    try {
      result = JSON.parse(resultString);
    }
    catch(e) {
      result = resultString;
    }

    return result;
  },

  set: function(key, value) {

    if( typeof value === 'object' ) {
      value = JSON.stringify(value);
    }

    localStorage.setItem(key, value);
  },

  del: function(key) {
    delete localStorage[key];
  }

});

});minispade.register('yoin-ember', function() {minispade.require('yoin-ember/init');
minispade.require('yoin-ember/system');
minispade.require('yoin-ember/analytics');
minispade.require('yoin-ember/local_store');
minispade.require('yoin-ember/data');
minispade.require('yoin-ember/models');

});minispade.register('yoin-ember/models', function() {minispade.require('yoin-ember/models/channels/fb_channel');
minispade.require('yoin-ember/models/channels/phone_channel');
minispade.require('yoin-ember/models/activity_base');
minispade.require('yoin-ember/models/city');
minispade.require('yoin-ember/models/category');
minispade.require('yoin-ember/models/product');
minispade.require('yoin-ember/models/brand');
minispade.require('yoin-ember/models/venue');
minispade.require('yoin-ember/models/user');
minispade.require('yoin-ember/models/friend');
minispade.require('yoin-ember/models/venue_user');
minispade.require('yoin-ember/models/invitation');
minispade.require('yoin-ember/models/like');
minispade.require('yoin-ember/models/comment');
minispade.require('yoin-ember/models/activity');
minispade.require('yoin-ember/models/checkin');

});minispade.register('yoin-ember/models/activity', function() {
var embedded = Yn.embedded;
Yn.Activity = DS.Model.extend({
  invitation: DS.belongsTo('Yn.Invitation', {key: 'invitation', embedded: embedded}),
  like: DS.belongsTo('Yn.Like', {key: 'like', embedded: embedded}),
  comment: DS.belongsTo('Yn.Comment', {key: 'comment', embedded: embedded}),

  isComment: Em.computed(function() {
    return !!this.get('comment');
  }).property('comment'),

  isLike: Em.computed(function() {
    return !!this.get('like');
  }).property('like'),

  isInvitation: Em.computed(function() {
    return !!this.get('invitation');
  }).property('invitation')

});


Yn.Activity.reopenClass({
  url: "activity"
});

});minispade.register('yoin-ember/models/activity_base', function() {
Yn.ActivityBase = DS.Model.extend({
  user: DS.belongsTo('Yn.User', {key: 'user'}),
  product: DS.belongsTo('Yn.Product', {key: 'product'}),
  venue: DS.belongsTo('Yn.Venue', {key: 'venue'}),
  createdAt: DS.attr('date', {key: 'created_at'} )

});

});minispade.register('yoin-ember/models/brand', function() {
Yn.Brand = DS.Model.extend({
  name: DS.attr('string'),
  picture: DS.attr('string')
});

// Explicit name to avoid ember-data bugs
Yn.Brand.reopenClass({
  url: "brand"
});

});minispade.register('yoin-ember/models/category', function() {
Yn.Category = DS.Model.extend({
  name: DS.attr('string'),
  icon: DS.attr('string'),
  subcategory: DS.attr('number'),
  order: DS.attr('number')
});

// Explicit name to avoid ember-data bugs
Yn.Category.reopenClass({
  url: "category"
});

});minispade.register('yoin-ember/models/channels/fb_channel', function() {
Yn.FbChannel = DS.Model.extend({

  isValidated: DS.attr('boolean', {key: 'is_validated'}),
  name: DS.attr('string'),
  email: DS.attr('string'),
  fbId: DS.attr('string', {key: 'fb_id'})


});

Yn.FbChannel.reopenClass({
  url: "fb_channel"
});

});minispade.register('yoin-ember/models/channels/phone_channel', function() {
Yn.PhoneChannel = DS.Model.extend({
  isValidated: DS.attr('boolean', {key: 'is_validated'}),
  phone: DS.attr('string')

});

Yn.PhoneChannel.reopenClass({
  url: "phone_channel"
});

});minispade.register('yoin-ember/models/checkin', function() {Yn.Checkin = DS.Model.extend({
	lat: DS.attr('number'),
	lon: DS.attr('number')
});

Yn.Checkin.reopenClass({
  url: "checkin"
});

});minispade.register('yoin-ember/models/city', function() {
Yn.City = DS.Model.extend({
  name: DS.attr('string'),
  lat: DS.attr('number'),
  lon: DS.attr('number'),
  isDefault: DS.attr('boolean', {key: 'is_default'} )

});

// Explicit name to avoid ember-data bugs
Yn.City.reopenClass({
  url: "city"
});

});minispade.register('yoin-ember/models/comment', function() {Yn.Comment = Yn.ActivityBase.extend({

  comment: DS.attr('string')

});

Yn.Comment.reopenClass({
  url: "comment"
});

});minispade.register('yoin-ember/models/friend', function() {
var embedded = Yn.embedded;
Yn.Friend = DS.Model.extend({
  user: DS.belongsTo('Yn.User', {key:"user", embedded: embedded})
});


Yn.Friend.reopenClass({
  url: "friend"

});

});minispade.register('yoin-ember/models/invitation', function() {
/* TODO
 * venue_user --> en vez de venueuser ?
 * venue (opcional)
 */
Yn.Invitation = DS.Model.extend({

  createdAt: DS.attr('date', {key: 'created_at'}),

  product: DS.belongsTo('Yn.Product', {key: 'product'}),

  fromUser: DS.belongsTo('Yn.User', {key: 'from_user'}),
  toUser: DS.belongsTo('Yn.User', {key: 'to_user'}),

  msg: DS.attr('string'),

  consumed: DS.attr('boolean'),
  dateConsumed: DS.attr('date'),
  venueUser: DS.belongsTo('Yn.VenueUser', {key: 'venue_user'}),
  

  // optional to create invitation to a Non Yn.User
  type: DS.attr('string'),
  fbId: DS.attr('string', {key: 'fb_id'}),
  phone: DS.attr('string')


});

Yn.Invitation.reopenClass({
  url: "invitation"
});

});minispade.register('yoin-ember/models/like', function() {
Yn.Like = Yn.ActivityBase.extend({

});

Yn.Like.reopenClass({
  url: "like"
});

});minispade.register('yoin-ember/models/product', function() {
Yn.Product = DS.Model.extend({
  name: DS.attr('string'),
  icon: DS.attr('string'),
  picture: DS.attr('string'),
  description: DS.attr('string'),
  price: DS.attr('number'),


  category: DS.belongsTo('Yn.Category', {key: "category"}),
  brand: DS.belongsTo('Yn.Brand', {key:"brand"}),

  commentCount: DS.attr('number', {key: 'comment_count'}),
  likeCount: DS.attr('number', {key: 'like_count'}),

  hasVoted: DS.attr('boolean', {key: 'has_voted'} ),

  hasLikes: Em.computed(function() {
    return this.get('likeCount') > 0;
  }).property('likeCount'),

  hasComments: Em.computed(function() {
    return this.get('commentCount') > 0;
  }).property('commentCount')

});

Yn.Product.reopenClass({
  url: "product"
});

});minispade.register('yoin-ember/models/user', function() {Yn.UserLoginType = {
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

});minispade.register('yoin-ember/models/venue', function() {Yn.Venue = DS.Model.extend({
  code: DS.attr('string'),
  name: DS.attr('string'),
  address: DS.attr('string'),
  zip: DS.attr('string', {key: 'zip_code'}),

  lat: DS.attr('number'),
  lon: DS.attr('number'),

  distance: DS.attr('number'),

  brand: DS.belongsTo('Yn.Brand', {key: "brand"}),
  city: DS.belongsTo('Yn.City', {key: "city"}),
  products: DS.hasMany('Yn.Product', {key:"products"}),
  nearUsers: DS.hasMany('Yn.User', {key:"near_users"}),


  commentCount: DS.attr('number', {key: 'comment_count'}),
  likeCount: DS.attr('number', {key: 'like_count'}),

  hasVoted: DS.attr('boolean', {key: 'has_voted'}),

  hasLikes: Em.computed(function() {
    return this.get('likeCount') > 0;
  }).property('likeCount'),

  hasComments: Em.computed(function() {
    return this.get('commentCount') > 0;
  }).property('commentCount')

});

// Explicit name to avoid ember-data bugs
Yn.Venue.reopenClass({
  url: "venue"
});

});minispade.register('yoin-ember/models/venue_user', function() {
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

});minispade.register('yoin-ember/moments/en-gb', function() {
Yn.Moments['en-gb'] = {
    months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
    monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
    weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
    weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
    longDateFormat : {
        LT : "h:mm A",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd, D MMMM YYYY LT"
    },
    calendar : {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[last] dddd [at] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : "in %s",
        past : "%s ago",
        s : "a few seconds",
        m : "a minute",
        mm : "%d minutes",
        h : "an hour",
        hh : "%d hours",
        d : "a day",
        dd : "%d days",
        M : "a month",
        MM : "%d months",
        y : "a year",
        yy : "%d years"
    },
    ordinal : function (number) {
        var b = number % 10;
        return (~~ (number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
    }
};

});minispade.register('yoin-ember/moments/es', function() {Yn.Moments['es'] = {
		months : "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split("_"),
		monthsShort : "Ene._Feb._Mar._Abr._May._Jun._Jul._Ago._Sep._Oct._Nov._Dic.".split("_"),
		weekdays : "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),
		weekdaysShort : "Dom._Lun._Mar._Mié._Jue._Vie._Sáb.".split("_"),
		longDateFormat : {
				LT : "H:mm",
				L : "DD/MM/YYYY",
				LL : "D MMMM YYYY",
				LLL : "D MMMM YYYY LT",
				LLLL : "dddd D MMMM YYYY LT"
		},
		calendar : {
				sameDay : function () {
						return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
				},
				nextDay : function () {
						return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
				},
				nextWeek : function () {
						return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
				},
				lastDay : function () {
						return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
				},
				lastWeek : function () {
						return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
				},
				sameElse : 'L'
		},
		relativeTime : {
				future : "en %s",
				past : "hace %s",
				s : "unos segundos",
				m : "un minuto",
				mm : "%d minutos",
				h : "una hora",
				hh : "%d horas",
				d : "un día",
				dd : "%d días",
				M : "un mes",
				MM : "%d meses",
				y : "un año",
				yy : "%d años"
		},
		ordinal : function (number) {
				return 'º';
		}
};


});minispade.register('yoin-ember/system', function() {minispade.require('yoin-ember/system/application');

});minispade.register('yoin-ember/system/application', function() {
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

});minispade.register('yoin-views-ipad/langs/en-gb', function() {
I18n.translations["en-GB"] = {

};

});minispade.register('yoin-views-ipad/langs/es-es', function() {
I18n.translations["es-ES"] = {

};

});minispade.register('yoin-views-ipad', function() {
// TODO: namespace repated with yoin-iphone-view
Yvi = {};
minispade.require('yoin-views-ipad/utils/application');
minispade.require('yoin-views-ipad/views/screens/login');

});minispade.register('yoin-views-ipad/utils/application', function() {
Yn.Application.reopen({

	moduleLang: Em.computed(function(){
		return 'yoin-views-ipad/langs/';
	}).property()

});

});minispade.register('yoin-views-ipad/views/screens/login', function() {Yvi.LoginScreenView = Em.View.extend({
	classNames: ['screen'],
	templateName: 'login_screen'

});

});minispade.register('yoin-views/init/view', function() {
// TODO: check that is cacheable
Em.View.reopen({

	contextView: Em.computed(function() {

    var view = this,
        is=false; 

    while ( !is && view) {
      view = view.get('parentView');
      is = Yn.Context.detect(view);
    }

		return (is) ? view : undefined;

	}).property()

});

});minispade.register('yoin-views', function() {minispade.require('yoin-views/views/helpers/humanize');
minispade.require('yoin-views/views/helpers/i18n');
minispade.require('yoin-views/views/helpers/view');
minispade.require('yoin-views/views/states/is_loading');
minispade.require('yoin-views/views/states/is_selected');
minispade.require('yoin-views/views/states/is_multiple_items');
minispade.require('yoin-views/views/states/is_opaque');
minispade.require('yoin-views/views/states/is_scroll_visible');
minispade.require('yoin-views/views/utils/mixins/context');
minispade.require('yoin-views/views/utils/mixins/context_manager');
minispade.require('yoin-views/views/utils/mixins/icon');
minispade.require('yoin-views/views/utils/mixins/i18n');
minispade.require('yoin-views/views/utils/mixins/btap');
minispade.require('yoin-views/views/utils/mixins/scroll_wrapper');
minispade.require('yoin-views/views/utils/scroller');
minispade.require('yoin-views/views/utils/scroll_wrapper');
minispade.require('yoin-views/views/utils/bound');
minispade.require('yoin-views/views/utils/unbound');
minispade.require('yoin-views/views/utils/btap');
minispade.require('yoin-views/views/utils/i18n');
minispade.require('yoin-views/views/utils/icon');
minispade.require('yoin-views/views/handlebars/i18nbtap');
minispade.require('yoin-views/views/handlebars/iconbtap');
minispade.require('yoin-views/views/handlebars/is_selected');
minispade.require('yoin-views/views/api/mixins/modal');
minispade.require('yoin-views/views/api/modal');
minispade.require('yoin-views/views/api/swipe');
minispade.require('yoin-views/views/api/navigation');
minispade.require('yoin-views/views/api/flip');
minispade.require('yoin-views/views/forms/mixins/form_action_content');
minispade.require('yoin-views/views/forms/mixins/input');
minispade.require('yoin-views/views/forms/input');
minispade.require('yoin-views/views/uis/mixins/header');
minispade.require('yoin-views/views/uis/mixins/name_state');
minispade.require('yoin-views/views/uis/header');
minispade.require('yoin-views/views/uis/header_title');
minispade.require('yoin-views/views/uis/carousel_circles');
minispade.require('yoin-views/views/uis/spinner');
minispade.require('yoin-views/views/uis/images/product_image');
minispade.require('yoin-views/views/uis/images/square_image');
minispade.require('yoin-views/views/uis/popups/popup');
minispade.require('yoin-views/views/uis/popups/confirm_popup');
minispade.require('yoin-views/views/uis/buttons/map_button');
minispade.require('yoin-views/views/uis/buttons/back_button');
minispade.require('yoin-views/views/uis/buttons/invite_button');
minispade.require('yoin-views/views/uis/buttons/switch_button');
minispade.require('yoin-views/views/uis/buttons/logo_switch_button');
minispade.require('yoin-views/views/uis/buttons/toggle_circle_button');
minispade.require('yoin-views/views/uis/buttons/social_big_button');
minispade.require('yoin-views/views/uis/buttons/social_small_button');
minispade.require('yoin-views/views/uis/buttons/single_big_button');
minispade.require('yoin-views/views/uis/buttons/activity_button');
minispade.require('yoin-views/views/uis/buttons/main_button');
minispade.require('yoin-views/views/uis/buttons/adaptative_button');
minispade.require('yoin-views/views/uis/buttons/menu_tabs_button');
minispade.require('yoin-views/init/view');

});minispade.register('yoin-views/views/api/flip', function() {Yn.FlipView = Em.ContainerView.extend({

  classNames: ['flip'],
  classNameBindings: ['isBack'],
    
  isBack: false,

  frontView: null,
  backView: null,

  childViews: ['child'],

  child: Em.ContainerView.extend({
    classNames: ['flip-transform'],

    didInsertElement: function() {
      this._super();


      var itemViewClass, 
          view;

      itemViewClass = this.getPath('parentView.frontView');

      if (Em.typeOf(itemViewClass) === "string") {
        itemViewClass = Em.getPath(itemViewClass);
      }

			view = this.createChildView(itemViewClass, {});
			this.get('childViews').pushObject(view);

      itemViewClass = this.getPath('parentView.backView');

      if (Em.typeOf(itemViewClass) === "string") {
        itemViewClass = Em.getPath(itemViewClass);
      }

			view = this.createChildView(itemViewClass, {});
			this.get('childViews').pushObject(view);



    }


  })

});

});minispade.register('yoin-views/views/api/mixins/modal', function() {Yn.Modal = Em.Mixin.create({

  isHidden: true,
  classNameBindings: ['isHidden'],
  classNames: ['modal'],


  didInsertElement: function() {

    this._super();
    //this.set('isHidden', true);

  },

  transitionEnd: function() {

    //console.log('transitionEnd....');

  }

});

});minispade.register('yoin-views/views/api/modal', function() {Yn.ModalView = Em.View.extend(Yn.Modal, {

});

});minispade.register('yoin-views/views/api/navigation', function() {var get = Ember.get , set = Ember.set, setPath = Ember.setPath, getPath = Ember.getPath;

Yn.Navigated = Em.Mixin.create({

  classNameBindings: ['isOneLevel', 'isTwoLevel', 'isThreeLevel', 'isFourLevel', 'isFiveLevel', 'isSixLevel'],
  classNames: ['navigated'],
  position: 0,

  isOneLevel: Em.computed(function() {

    return this.get('position') === 0;

  }).property('position'),

  isTwoLevel: Em.computed(function() {

    return this.get('position') === 1;

  }).property('position'),

  isThreeLevel: Em.computed(function() {

    return this.get('position') === 2;

  }).property('position'),

  isFourLevel: Em.computed(function() {

    return this.get('position') === 3;

  }).property('position'),

  isFiveLevel: Em.computed(function() {

    return this.get('position') === 4;

  }).property('position'),

  isSixLevel: Em.computed(function() {

    return this.get('position') === 5;

  }).property('position')


});


Yn.NavigationView = Em.ContainerView.extend({

  classNames: ['navigation'],
  isMoving: false,

  width: null,

  translatePosition: null,
  position: -1,

  backState: null,

  initViewClass: null,

  views: Ember.A([]),

  didInsertElement: function() {

    var width = this.$().width( );
    this.set('width', width);

    // insert initViewClass
    var initViewClass = this.get('initViewClass');
    if ( !!initViewClass ) {

      if (Em.typeOf(initViewClass) === "string") {
        initViewClass = Em.getPath(initViewClass);
      }

      //console.log('calling push views');
      var view = initViewClass.create({});
      this.pushView(view);
    }

  },

  didInsertStackChild: function(view){

    // bug: didInsertElement get fired twice for some weird reason
    if ( !view.navigatedDidInsertElementFired ) {

      //console.log('executing----> didinsertElement');
      view.navigatedDidInsertElementFired = true;

      if ( !this.views.contains( view ) ) {
        this.views.pushObject(view);
        view.set('position', this.get('position') ); 
        this._move(true);
      }

    }
  },

  pushView: function(newView, backState) {

    if ( !this.get('isMoving') ) {

      this.set('position', this.get('position')+1 );
      newView.navigationBackState = backState;

      if ( !Yn.Navigated.detect(newView)  ) {
        Em.mixin(newView, Yn.Navigated);
      }

      this.set('isMoving', true );

      var childs = this.get('childViews');
      
      var self = this;
      childs.pushObject(newView);

      newView.on('didInsertElement', function() {
        //console.log('didinsertElement');
        self.didInsertStackChild(this);
      });

      if ( childs.get('length') === 3 ) {
        var view = childs.shiftObject();
        view.navigatedDidInsertElementFired = false;
      }

    }

  },

  _move: function(forward, callback) {

    this.set('isMovingForward', forward);
    var translatePosition = this.get('translatePosition');
    if ( translatePosition === null ) {
       translatePosition = 0;
       this.set('isMoving', false);
    } else {
      var width = this.get('width');
      translatePosition += (forward) ? width*(-1): width;

      //this.get('element').style.webkitTransform = 'translate3d('+translatePosition+'px,0,0)';
    }

    this.set('translatePosition', translatePosition);

  },

  transitionEnd: function() {

    if ( this.get('isMoving') ) {

      var childs =  this.get('childViews');

      if ( !this.get('isMovingForward') ) {


        this.views.popObject();
        var view = childs.popObject();
        view.navigatedDidInsertElementFired = false;

        var length = this.views.get('length'); 
        if ( length > 1 && childs.get('length') === 1 ) {
          //console.log('unshifting backview');
          var backView = this.views[length-2];
          childs.unshiftObject( backView );

        }

      }

      this.set('isMoving', false);

    }

  },

  popView: function() {
    
    var childs = this.get('childViews'),
        length = childs.get('length');

    this.backState = childs[length-1].navigationBackState;

    if ( !this.get('isMoving') ) {

      this.set('position', this.get('position')-1 );
      this.set('isMoving', true );
      this._move(false);
    }

  }

});

});minispade.register('yoin-views/views/api/swipe', function() {var get = Ember.get , set = Ember.set, setPath = Ember.setPath, getPath = Ember.getPath;

Yn.SwipeView = Ember.ContainerView.extend({
  
  itemViewClass: Em.View,

  contentIndex: 0,
  duration: 500,

	swipeOptions: {
		direction: Em.OneGestureDirection.Left | Em.OneGestureDirection.Right,
		cancelPeriod: 100,
		simultaneously: true,
		swipeThreshold: 20,
		initThreshold: 10
	},

  selected: null,
  content: null,

  //--- private properties
  isMoving: false,
  translatePosition: 0,

	activeIndex: null,
	activeLeftCss: null,


  init: function(){

    this._super();

		var itemViewClass = this.get('itemViewClass');

		if (Em.typeOf(itemViewClass) === "string") {
			itemViewClass = Em.getPath(itemViewClass);
			set(this, 'itemViewClass', itemViewClass);
		}

		var content = get(this, 'content');
    if (Em.typeOf(content) === "string") {
      content = Em.getPath(content);
      set(this, 'content', content);
    }


		var self = this;
			
		['-100%', '0%', '100%'].forEach(function(item) {

			var view = self.createChildView(itemViewClass, {});
			self.get('childViews').pushObject(view);
			view.on('didInsertElement', function() {
				view.$().css("left", item); 
			});

		});

  },

  didInsertElement: function() {

    this._super();
    this.set('width', this.$().width() );

  },

	_reorderContent: function() {

		var content = this.get('content');
		var selected = this.get('selected');

		if ( !!content && !!selected ) {

			var i = content.get('length'), 
				isSelectedInContent = false;

			// content.some does not work, why?
			while( !isSelectedInContent && i-- ) {
				isSelectedInContent = (content.objectAt(i) === selected);
			}

			if ( isSelectedInContent ) {

				if ( !this.get('isMoving') ) {

					this.set('contentIndex', i );
					this.set('activeIndex', 1 );
					this.set('activeLeftCss', 0);
					this.set('translatePosition', 0);

					var contentIndex = this.get('contentIndex'),
							index = this.get('activeIndex'),
							tmpIndex,
							tmpContentIndex,
							child = this.get('childViews');

					tmpContentIndex = this._getContentIndex(false); 
					tmpIndex = this._getIndex(false); 
					child[tmpIndex].set('content', content.objectAt(tmpContentIndex) );

					child[index].set('content', content.objectAt(contentIndex) );

					tmpContentIndex = this._getContentIndex(true); 
					tmpIndex = this._getIndex(true); 
					child[tmpIndex].set('content', content.objectAt(tmpContentIndex) );


				} else {

					this.set('isMoving', false);

				}

			}

		}

	},



	swipeEnd: function(recognizer) {

			
    var length = this.getPath('content.length');

		if ( length > 1 ) {

			var self = this;
			if ( recognizer.swipeDirection === Em.OneGestureDirection.Left ) {

          this._move(false);

			} else if ( recognizer.swipeDirection === Em.OneGestureDirection.Right ) {
          this._move(true);
			}

		}

	},

  transitionEnd: function() {


    if ( this.get('onTransition') ) {

      this.set('onTransition', false);

      var self = this;
      var left, leftIndex, rightIndex, leftContentIndex, rightContentIndex, contentIndex;

      var activeLeftCss = self.get('activeLeftCss');

      var child = self.get('childViews');
      var content = self.get('content');

      leftIndex = self._getIndex(false);

      rightIndex = self._getIndex(true);


      leftContentIndex = self._getContentIndex(false);
      contentIndex = self.get('contentIndex');
      rightContentIndex = self._getContentIndex(true);

      left = (activeLeftCss-1)*100+'%';
      child[leftIndex].$().css("left", left); 

      left = (activeLeftCss+1)*100+'%';
      child[rightIndex].$().css("left", left); 

      child[leftIndex].set('content', content.objectAt(leftContentIndex) );
      child[rightIndex].set('content', content.objectAt(rightContentIndex) );


      //self.set('translatePosition', translatePosition); --> to _move


      //console.log( content.objectAt(contentIndex) );
      self.set('selected', content.objectAt(contentIndex) );

    }


  },

  _move: function(next, fn) {

    if ( !this.get('isMoving') ) {

				// it will be updated on setup content index
				this.set('isMoving', true );
				this.set('onTransition', true );

        var self = this;

				var activeLeftCss= this.get('activeLeftCss');
				activeLeftCss = ( next )  ? activeLeftCss+1 : activeLeftCss-1;
				this.set('activeLeftCss', activeLeftCss);

				this.set('contentIndex', this._getContentIndex(next) );
				this.set('activeIndex', this._getIndex(next) );

				var width = this.get('width');
				var translatePosition = this.get('translatePosition');


				translatePosition += (next) ? width*(-1): width;

        this.get('element').style.webkitTransform = 'translate3d('+translatePosition+'px,0,0)';
        this.set('translatePosition', translatePosition);
      
		}

  },

  _getIndex: function( next ) {

		var result = this.get('activeIndex');
    result +=(next) ? 1:-1; 

    if ( result < 0 ) { 
      result = 2;
    } else if ( result > 2 ) { 
      result = 0;
    }

    return result;
  },

  _getContentIndex: function( next ) {

    var length = this.getPath('content.length');
		var result = this.get('contentIndex');
    result +=(next) ? 1:-1; 

    if ( result < 0 ) { 
      result = length-1;
    } else if ( result > length-1 ) { 
      result = 0;
    }

    return result;
  },


	_contentChanged: Ember.observer( function() {

		this._reorderContent();

	}, 'content'),

	_selectedChanged: Ember.observer( function() {

		this._reorderContent();

	}, 'selected')



});

});minispade.register('yoin-views/views/forms/input', function() {
Yn.InputView = Em.View.extend(Yn.Input, {

});

});minispade.register('yoin-views/views/forms/mixins/form_action_content', function() {
// This approach is pending to be modified based on App evolution
// We could find forms based on other property/requirements
Yn.FormActionContent = Em.Mixin.create({

  actionContent:  Ember.computed(function() {

    var result = {},
      view;

    var inputs = this.get('inputs');
    if (Em.typeOf(inputs) === "string") {
			inputs = inputs.split(' ');
		}

    if ( inputs ) {

			// TODO; performance optimization
      Em.ArrayUtils.forEach(inputs, function(viewId) {

        //console.log( view.get('inputName') + '   ' + view.get('value') );
        view = Em.View.views[viewId];
        result[ view.get('inputName') ] = view.get('value');

      });

    }

    return result;

  }).property().volatile()

});

});minispade.register('yoin-views/views/forms/mixins/input', function() {
// defines a type of ModalView which will be used on different App view instances
Yn.Input = Ember.Mixin.create({
  value: "",
  tagName: 'input',
  type: 'text',

	attributeBindings: ['placeholder', 'type'],

  didInsertElement: function() {
    this._updateElementValue();
  },


  change: function(event) {
    this._elementValueDidChange();
  },


  focusIn: function(event) {

    Em.run.next(function() {
      window.scrollTo(0, 0);
    });

  },


  focusOut: function(event) {

    this._elementValueDidChange();
    // TODO: move to scroll, when keyboard dissapeared scroll to top
    Em.run.next(function() {
      window.scrollTo(0, 0);
		});
  },

  _updateElementValue: Ember.observer(function() {

    this.$().val( this.get('value') );

  }, 'value'),


  _elementValueDidChange: function() {

    this.set('value', this.$().val() );

  }

});


});minispade.register('yoin-views/views/handlebars/i18nbtap', function() {
// this view has been created to be used on Handlebars template (
// waiting view helper to accept mixin )
Yn.I18nBtapView = Em.View.extend(Yn.I18n, Yn.Btap, {

});

});minispade.register('yoin-views/views/handlebars/iconbtap', function() {
// this view has been created to be used on Handlebars template (
// waiting view helper to accept mixin )
Yn.IconBtapView = Em.View.extend(Yn.Icon, Yn.Btap, {

});

});minispade.register('yoin-views/views/handlebars/is_selected', function() {
// this view has been created to be used on Handlebars template (
// waiting view helper to accept mixin )
Yn.IsSelectedView = Em.View.extend( Yn.IsSelected, {

});

});minispade.register('yoin-views/views/helpers/humanize', function() {
Ember.Handlebars.registerHelper('humanize', function(options){

  var dateBinding,
      date;

  dateBinding = options.hash.dateBinding;

  if ( dateBinding !== undefined ) {

    date = Em.Handlebars.getPath(this, dateBinding);

  } else {

    date = options.hash.date;

  }
  
  // console.log( date );
  // to DO extend format output
  return moment( date ).fromNow();

});

});minispade.register('yoin-views/views/helpers/i18n', function() {// i18n helper for Handlebars
Ember.Handlebars.registerHelper('I18n', function(key, options){

  var isPluralize = false,
      pluralizeBinding,
      result,
      pluralize;

  if (options === undefined ) {
    options = key;
    key = options.hash.key;

    if (key === undefined && options.hash.keyBinding !== undefined ) {
      key = Em.Handlebars.getPath(this, options.hash.keyBinding);
    }

  }

  pluralizeBinding = options.hash.pluralizeBinding;

  if ( pluralizeBinding !== undefined ) {

    pluralize = Em.Handlebars.getPath(this, pluralizeBinding);

  } else {

    pluralize = options.hash.pluralize;

  }


  if ( pluralize !== undefined ) {
    // boolean
    if ( pluralize === true || pluralize === false ) {

      isPluralize = pluralize;

    // integer 
    } else if ( pluralize % 1 === 0 ){

      // distinct than 0 is plural
      isPluralize = ( pluralize !== 1 );

    }

  }

  if ( isPluralize ) {
    key+='_pl';
  }

  result = I18n.t(key);
  if ( options.hash.toUpperCase === true ) {
		//camelize
    result = result.toUpperCase();

  } else if ( options.hash.toLowerCase === true ) {

    result = result.toLowerCase();

	}

  return result;
});

});minispade.register('yoin-views/views/helpers/view', function() {
Ember.Handlebars.ViewHelper.reopen({

  viewClassFromHTMLOptions: function(viewClass, options, thisContext) {

		var mixins = [],
				result;

		if (options.hash.mixins) {

      var mixinIds = options.hash.mixins.split(' '),
          mixin;

      Em.ArrayUtils.forEach(mixinIds, function(mixinId) {

				//console.log('inserting mixinId ' + mixinId);
        mixin = Em.getPath(mixinId);
        Ember.assert("You must pass available mixins to 'mixin property' ", !!mixin);
        Ember.assert("'mixin property' must point to Ember.Mixin instances ", ( mixin instanceof Ember.Mixin ) );
        mixins.push(mixin);

      });

			delete options.hash.mixins;

		}


    result = this._super(viewClass, options, thisContext);


		if ( mixins.length > 0 ) {
      result.reopen.apply(result, mixins);
    }

		return result;

  },


  helper: function(thisContext, path, options) {

    for (var prop in options.hash) {

      if (/I18n$/.test(prop)) {

				var newProperty = prop.replace(/I18n$/, "");
				options.hash[newProperty] = I18n.t( options.hash[prop] );
/*
				console.log( prop + ' ' +  options.hash[prop] );
				console.log( newProperty + ' ' +  options.hash[newProperty] );
				console.log ( options.hash );
*/

				delete options.hash[prop];

      } 


    }

		this._super(thisContext, path, options);

	}

});

});minispade.register('yoin-views/views/states/is_loading', function() {// you must setup isLoading = true when resource is being loaded
Yn.IsLoading = Ember.Mixin.create({

  classNameBindings: ['isLoading'],
  isLoading: true,

  didInsertElement: function() {

    this._super();
    var self = this;
    this.$().load( function(el){
      self.set('isLoading', false);
    });

  }

});

});minispade.register('yoin-views/views/states/is_multiple_items', function() {Yn.IsMultipleItems = Em.Mixin.create({

  classNameBindings: ['isOneItem', 'isTwoItems', 'isThreeItems', 'isFourItems', 'isFiveItems'],


  init: function() {
		this._super();
	  this._changedContent();
	
	},
	
	_changedContent: Ember.observer(function() {

		var content  = this.get('content');
		if ( content ) {
      var length = content.get('length');

			this.set('isOneItem',  length === 1  );
			this.set('isTwoItems',  length === 2 );
			this.set('isThreeItems',  length === 3 );
			this.set('isFourItems',  length === 4 );
			this.set('isFiveItems',  length === 5 );
		}

	}, 'content')

});

});minispade.register('yoin-views/views/states/is_opaque', function() {
Yn.IsOpaque = Ember.Mixin.create({
  classNameBindings: ['isOpaque']

});

});minispade.register('yoin-views/views/states/is_scroll_visible', function() {Yn.IsScrollVisible = Em.Mixin.create({

  scrollVisibleId: null,
  isScrollVisible: false,

  didInsertElement: function() {

    this._super();

    var scroll = $(this.scrollVisibleId);

    var self = this,
      height = self.$().height();

    var wrapper = scroll.parent();
    var limit = wrapper.offset().top + wrapper.height();


    var destroyCheck = function() {
      scroll.unbind('touchmove',check);
    };

    var check = function() {

      var elemTop = self.$().offset().top;

      //console.log( Em.String.fmt('checking:  top (%@)  docViewBottom (%@)', [elemTop, limit]) );

      if (  (elemTop <= limit) ) {

        destroyCheck();
        self.set('isScrollVisible', true);
        self.appear();

      }
                              
    };

    scroll.bind('touchmove',check);

    // check before first touch move
    check();

  },

  appear: function() {

  }


});

});minispade.register('yoin-views/views/states/is_selected', function() {
Yn.IsSelected = Ember.Mixin.create({

  classNameBindings: ['isSelected'],

  isSelected: Em.computed(function(){
    return ( this.get('content') === this.get('selected') );
  }).property('selected', 'content')

});

});minispade.register('yoin-views/views/uis/buttons/activity_button', function() {Yn.ActivityButtonView = Em.View.extend({
  classNames: ['activity-button'],
  templateName: 'activity_button'

});

});minispade.register('yoin-views/views/uis/buttons/adaptative_button', function() {Yn.AdaptativeButtonView = Em.View.extend(Yn.Btap, {

	classNames: ['rectangle-button-adaptative'],
	
	action: null,
	
	content: null,
	
	didInsertElement: function() {
    this._super();
    this.$().text(this.content);
  }

});

/*{{view Yn.AdaptativeButtonView class="is-grey button-text is-small is-font-black" contentI18n="login_twitter"}}*/

});minispade.register('yoin-views/views/uis/buttons/back_button', function() {Yn.BackButtonView = Em.View.extend(Yn.Btap, {

  action: 'back',
  classNames: ['back-button'],

  didInsertElement: function() {
    this._super();
    this.$().text(I18n.t('back'));
  }

});

});minispade.register('yoin-views/views/uis/buttons/invite_button', function() {Yn.InviteButtonView = Em.View.extend(Yn.Btap, {

  classNames: ['invite-button'],
  content: null,
  templateName: 'invite_button'


});

});minispade.register('yoin-views/views/uis/buttons/logo_switch_button', function() {
Yn.LogoSwitchButtonView = Em.View.extend( Yn.Btap, {
  classNames: ['logo-switch-button', 'icon-after'],
  classNameBindings: ['isOn'],
  enabledEvent: null,
  disabledEvent: null,

  isOn: false,

	swipeOptions: {
    direction: Em.OneGestureDirection.Left | Em.OneGestureDirection.Right,
    cancelPeriod: 100,
    swipeThreshold: 6,
    initThreshold: 3
	},

	swipeEnd: function(recognizer) {

    var currentValue = this.get('isOn');
    var direction = recognizer.swipeDirection;

    if ( ( direction === Em.OneGestureDirection.Left && currentValue) ||
         ( direction === Em.OneGestureDirection.Right && !currentValue) ){ 

      this.change(!currentValue);

    }

  },

  bTap: function() {

    var currentValue = this.get('isOn');
    this.change(!currentValue);

  },

  change: function( enabled ) {

    var eventName = enabled ? 'checkin' : 'checkout';
    this.get('manager').send(eventName);

  }

});

});minispade.register('yoin-views/views/uis/buttons/main_button', function() {Yn.MainButtonView = Em.View.extend(Yn.Btap, {

	classNames: ['main-button'],
	
	action: null,
	
	content: null,
	
	templateName: 'main_button'

});

/*{{view Yn.MainButtonView class="is-blue" contentI18n="login_twitter"}}*/
});minispade.register('yoin-views/views/uis/buttons/map_button', function() {
Yn.MapButtonView = Em.View.extend(Yn.Btap, {
	classNames: ['map-button'],
  action: 'fireMap'

});

});minispade.register('yoin-views/views/uis/buttons/menu_tabs_button', function() {//Menu
Yn.MenuTabsButtonView = Em.View.extend(Yn.IsMultipleItems, {

	classNames: ['tabs'],
	
	content: null,
	
	/*Em.A([ {'name': 'back', 'action': 'back'}, 
		{'name': 'save', 'action': 'save'}, 
		{'name': 'register', 'action': 'register'} ]),*/
	
	selected: null,
	
	eventName: 'tabFire',
	
	templateName: 'menu_tabs_button',
	
	isSingleButton: Em.computed(function() {
		
		return this.get('content').get('length') === 1;
		
	}).property('content'),
	
	firstButton: Em.computed(function() {
	
		return this.get('content').get('firstObject');

	}).property('content'),
	
	lastButton: Em.computed(function() {
	
		return this.get('content').get('lastObject');

	}).property('content'),
	
	middleButtons: Em.computed(function() {
		
		var result = Em.A([]),
				menuItems = this.get('content'),
				length = menuItems.get('length'); 
		
		menuItems.forEach( function (item, index) {
			
			if ( (index !== 0) && (index !== length-1 ) ) {
				result.pushObject(item);
			}
			
		});
		
		return result;
	}).property('content')

});


//Menu item
Yn.MenuTabButtonView = Em.View.extend(Yn.Btap, Yn.IsSelected, {

	classNames: ['tab'],
	
	action: null,
	actionContent:null,
	
	content: null,
	
	selected: null,
	
	didInsertElement: function() {
    this._super();
    this.set('action', this.getPath('parentView.eventName'));
    this.$().text(I18n.t(this.content));
  }

	/*,	
	bTap: function() {
		this.setPath('parentView.selected', this.get('content') );
	}
	*/
});

});minispade.register('yoin-views/views/uis/buttons/single_big_button', function() {Yn.SingleBigButtonView = Em.View.extend(Yn.Btap, {

	classNames: ['large-button single'],
	
	action: null,
	
	content: null,
	
	didInsertElement: function() {
    this._super();
    this.$().text(this.content);
  }

});

/*{{view Yn.SingleBigButtonView class="is-grey button-text is-small is-font-black" contentI18n="login_twitter"}}*/
});minispade.register('yoin-views/views/uis/buttons/social_big_button', function() {Yn.SocialBigButtonView = Em.View.extend(Yn.Btap, {

	classNames: ['large-button is-social'],
	
	action: null,
	
	content: null,
	
	templateName: 'social_big_button'

});

/*{{view Yn.SocialBigButtonView class="facebook" contentI18n="login_facebook"}}*/



});minispade.register('yoin-views/views/uis/buttons/social_small_button', function() {Yn.SocialSmallButtonView = Em.View.extend(Yn.Btap, {

	classNames: ['rectangle-button', 'is-social'],
	
	action: null,
	
	content: null,
	
	templateName: 'social_small_button'

});

/*{{view Yn.SocialSmallButtonView class="twitter" contentI18n="twitter"}}*/
});minispade.register('yoin-views/views/uis/buttons/switch_button', function() {
Yn.SwitchButtonView = Em.ContainerView.extend({

  classNames: ['switch-button'],
  classNameBindings: ['isDisabled'],

  childViews: ['left','right','button'],

  isOn: false,
  isDisabled: false,

  left: Em.View.extend({
    classNames: ['sb-label', 'sb-label-left']
  }),

  right: Em.View.extend({
    classNames: ['sb-label', 'sb-label-right']
  }),

  button: Em.ContainerView.extend({

    classNames: ['sb-inner'],
    childViews: ['child'],

    child: Em.View.extend({

      classNames: ['sb-inner-button'],
      percent:null,

      // twoWayBinding
      isOnBinding: 'parentView.parentView.isOn',

      isEnabled: Em.computed(function() {

        return !this.getPath('parentView.parentView.isDisabled');
        //return true;

      }).property('parentView.parentView.isDisabled'),

      _leftChanged: Em.observer(function() {

        var percent = this.get('percent');
        //console.log( 'percent ' + this.get('percent') );
        if ( percent !== null && this.leftView) {

          var handlePercent = this.width / this.switchButtonWidth * 100,
            aPercent = percent && handlePercent + ( 100 - handlePercent ) * percent / 100,
            bPercent = percent === 100 ? 0 : Math.min( handlePercent + 100 - aPercent, 100 );

          this.$().css( "left", percent+"%");
          this.leftView.$().css("width", aPercent+"%");
          this.rightView.$().css("width", bPercent+"%");
        } 

      }, 'percent' ),

      _isOnChanged: Em.observer(function() {


        var percent = this.get('isOn') ? 100 : 0;
        this.set('percent', percent);

      }, 'isOn' ),


      panOptions: {
        isEnabledBinding: 'isEnabled',
        
        //isEnabled: true,
        initThreshold: 10
      },

      didInsertElement: function(){

        this._super();

        this.switchButtonView = this.getPath('parentView.parentView');
        this.switchButtonWidth = this.switchButtonView.$().width();
        this.width = this.$().width();

        this.leftView = this.switchButtonView.left;
        this.rightView = this.switchButtonView.right;

        this._isOnChanged();
        this._leftChanged();

      },

      panChange: function(recognizer) {

        var changed = (100*recognizer.get('translation').x)/this.switchButtonWidth;
        var percent = this.get('percent') + changed;  
        if ( percent > 100 ) { 
          percent = 100;
        } else if ( percent < 0 ) { 
          percent = 0;
        }
        this.set('percent', percent);

      },
      panEnd: function(recognizer) {

        this._panFinished(recognizer);

      },
      panCancel: function(recognizer) {

        this._panFinished(recognizer);

      },

      _panFinished: function(recognizer) {

        // on gesture finished, isOn property must be setup based on nearest value of percent property
        var percent = ( this.get('percent') > 50 ) ? 100 : 0;

        this.set('isOn', percent === 100 );
        this.set('percent', percent);


      }

    })

  })

});

});minispade.register('yoin-views/views/uis/buttons/toggle_circle_button', function() {Yn.ToggleCircleButtonView = Em.ContainerView.extend(Yn.Btap, {

  classNames: ['toogle-circle-button'],
  classNameBindings: ['isSelected'],

  selected: null,
  content: null,

  childViews: ['child'],

  child: Em.View.extend({
    classNames: ['toogle-circle-button-inner']
  }),
  
  actionContentBinding: Em.Binding.oneWay('content'),

  isSelected: Em.computed(function(){

    return this.get('selected') === this.get('content');

  }).property('selected', 'content')


});

});minispade.register('yoin-views/views/uis/carousel_circles', function() {Yn.CarouselCirclesView = Em.CollectionView.extend( Yn.IsMultipleItems, {

  classNames: ['carousel-circles'],
	selected: null,
	content: null,

	isVisible: Em.computed(function(){

		return ( this.getPath('content.length') > 1 );

	}).property('content.length'),

  itemViewClass: Em.View.extend(Yn.IsSelected, {

    classNames: ['carousel-circle'],
		selectedBinding: Em.Binding.oneWay('parentView.selected')

  })

});


});minispade.register('yoin-views/views/uis/header', function() {Yn.HeaderView = Em.View.extend( Yn.Header, {

});

});minispade.register('yoin-views/views/uis/header_title', function() {Yn.HeaderTitleView = Yn.UnboundView.extend({

  classNames: ['header-title', 'l-fit'],
  item:null

});

});minispade.register('yoin-views/views/uis/images/product_image', function() {Yn.ProductImageView = Em.View.extend(Yn.IsLoading, {

  tagName: 'img',
  classNames: ['l-fit', 'product_image'],
  attributeBindings: ['src'],

  picture: null,


  _pictureChanged: Ember.observer(function() {

    this.set('isLoading', true);

    var picture = this.get('picture');
    if ( picture ) {
      var src = 'assets/images/products/';
      src += picture;
      src += '.png';
      this.set('src',src); 
    }

  }, 'picture') 

});

});minispade.register('yoin-views/views/uis/images/square_image', function() {// assign a Brand or User to the content and it will render the image
Yn.SquareImageView = Em.ContainerView.extend({

  classNameBindings: ['isLoading'],
  isLoading: true,

  classNames:['square-image', 'is-up-effect'],
  childViews: ['child'],

  content: null,

  child: Em.View.extend({
    classNames: ['square-image-bg']

  }),

  didInsertElement: function() {

    this._super();
    this.setBackgroundImage();

  },

  _pictureChanged: Ember.observer(function() {

    this.setBackgroundImage();

  }, 'content.isLoaded'),

  setBackgroundImage: function() {

    var content = this.get('content'),
        src;

    if ( !!content ) {

      var type = content.get('constructor');
      if ( type === Yn.Brand ) {

        src = content.get('picture');
        var s = content.store.serverDomain;
        if ( s ) {
          src = s.substring(0, s.length-1)+src;
        }

      } else if ( type === Yn.User ) {

        src = content.get('avatar');

      }

      if ( !!src ) {

        var self = this;
        $('<img/>').attr('src', src).load(function() {

          if ( !self.get('isDestroying' ) && !self.get('isDestroyed') ) {
            self.$().css('background-image', 'url(' + src + ')' );
            self.set('isLoading', false);
          }
                                         
        });

      }

    }

  }

});

});minispade.register('yoin-views/views/uis/mixins/header', function() {Yn.Header = Em.Mixin.create({
  classNames: ['header', 'icon']
});

});minispade.register('yoin-views/views/uis/mixins/name_state', function() {Yn.NameStateMixin = Em.Mixin.create({

  classNameBindings: ['is_smaller_seven', 'is_smaller_thirteen', 'is_smaller_seventeen', 'is_higher_sixteen'],

  _namehanged: Ember.observer(function() {
    this._updateClassNames();
  }, 'name'),

  _updateClassNames: function() {

    var name = this.get('name');
    if ( name ) {

      
      var length = name.length;
      if (length < 7 ) {
        this.set('is_smaller_seven', true);
        this.set('is_smaller_thirteen', false);
        this.set('is_smaller_seventeen', false);
        this.set('is_higher_sixteen', false);
      } else if ( length < 13 ) {
        this.set('is_smaller_seven', false);
        this.set('is_smaller_thirteen', true);
        this.set('is_smaller_seventeen', false);
        this.set('is_higher_sixteen', false);
      } else if ( length < 17 ) {
        this.set('is_smaller_seven', false);
        this.set('is_smaller_thirteen', false);
        this.set('is_smaller_seventeen', true);
        this.set('is_higher_sixteen', false);
      } else {
        this.set('is_smaller_seven', false);
        this.set('is_smaller_thirteen', false);
        this.set('is_smaller_seventeen', false);
        this.set('is_higher_sixteen', true);
      }
    }

  }

});


});minispade.register('yoin-views/views/uis/popups/confirm_popup', function() {
Yn.ConfirmPopupView = Em.ContainerView.extend({

  childViews: ['child'],
  classNames: ['confirm-popup'],
  classNameBindings: ['hidden'],

  hidden:true,

  headerText:null,
  messageText:null,
  cancelText: null,
  okText: null,

  cancel: Ember.K,
  ok: Ember.K,

  transitionEnd: function() {

    if ( this.get('hidden') ) {
      this.destroy();
    }

  },

  didInsertElement: function() {
    this._super();

    var self = this;

    var button1 = self.getPath('child.footer.cancel');
    var button2 = self.getPath('child.footer.ok');

    Em.AppGestureManager.block(this, function(view) {
      return view === button1 || view === button2;
    });

    //TODO: because childs has not still been inserted in DOM
    Em.run.next(function(){

      var height = self.$().outerHeight();
      var width = self.$().outerWidth();
      self.$().css({'margin-top': (-1/2)*height+'px','margin-left':(-1/2)*width+'px'});
      self.set('hidden', false);

    });

  },

  hideAndDestroy: function() {

    this.set('hidden', true);
    Em.AppGestureManager.unblock(this);

  },


  child: Em.ContainerView.extend({

    classNames: ['cp-container'],
    childViews: ['header', 'message', 'footer'],

    header: Yn.UnboundView.extend({

      classNames: ['cp-header'],

      item: Em.computed( function() {
        return this.getPath('parentView.parentView.headerText');
      }).property()

    }),

    message: Yn.UnboundView.extend({

      classNames: ['cp-message'],

      item: Em.computed( function() {
        return this.getPath('parentView.parentView.messageText');
      }).property()


    }),

    footer: Em.ContainerView.extend({

      classNames: ['cp-footer'],
      childViews: ['cancel', 'ok'],

      cancel: Yn.UnboundView.extend(Yn.Btap, {

        classNames: ['cp-cancel', 'cp-button'],


        didInsertElement: function() {
          this.rootView = this.getPath('parentView.parentView.parentView');
          this._super();
        },


        item: Em.computed( function() {
          return this.rootView.get('cancelText');
        }).property(),

        bTap: function() {

          this.rootView.cancel();

        }

      }),

      ok: Yn.UnboundView.extend(Yn.Btap, {

        classNames: ['cp-ok', 'cp-button'],

        didInsertElement: function() {
          this.rootView = this.getPath('parentView.parentView.parentView');
          this._super();
        },

        item: Em.computed( function() {
          return this.rootView.get('okText');
        }).property(),

        bTap: function() {

          this.rootView.ok();

        }

      })

    })
  })

});


});minispade.register('yoin-views/views/uis/popups/popup', function() {
Yn.PopupView = Em.ContainerView.extend(Yn.Btap, {
  classNames:['alert', 'popup'],

	gestureDelegate: null,

  didInsertElement: function() {

    var self = this; 

    var manager = this.get('manager');
    if (Em.typeOf(manager) === "string") {

      manager = Em.getPath(manager);
      this.set('manager', manager);

    }

    Em.run.next(function() { 
      self.get('gestureDelegate').set('popUpView', self );
    });

  },

	bTap: function() {
		this.get('manager').send('tap');
	},

	destroy: function() {

		this.get('gestureDelegate').set('popUpView', null );
		this._super();

	}

});

});minispade.register('yoin-views/views/uis/spinner', function() {Yn.SpinnerView = Em.View.extend({
  classNames: ['spinner'],
  classNameBindings: ['isLoading'],

  templateName: 'spinner'


});

});minispade.register('yoin-views/views/utils/bound', function() {
Yn.BoundView = Em.View.extend({

  item: null,

  render: function(buffer) {
    buffer.push( this.get('item') );
  },


  _itemDidChange: Ember.observer(function() {
    this.rerender();
  }, 'item')

});

});minispade.register('yoin-views/views/utils/btap', function() {Yn.BtapView = Em.View.extend( Yn.Btap,{

});

});minispade.register('yoin-views/views/utils/i18n', function() {
Yn.I18nView = Em.View.extend(Yn.I18n, {

});



});minispade.register('yoin-views/views/utils/icon', function() {Yn.IconView = Em.View.extend(Yn.Icon, {

});


});minispade.register('yoin-views/views/utils/mixins/btap', function() {Yn.Btap = Ember.Mixin.create( Yn.ContextManager, {

	action: null,
	actionContent: null,

	bTap: function() {
		
		this.manager.send( this.get('action'), this.get('actionContent') );

  },

  tapEnd: function(recognizer) {
    this.bTap();
  }

});

});minispade.register('yoin-views/views/utils/mixins/context', function() {Yn.Context = Em.Mixin.create({

});

});minispade.register('yoin-views/views/utils/mixins/context_manager', function() {// uses manager property if defined
// otherwise use manager of the parent Context View
Yn.ContextManager = Em.Mixin.create({

	manager: null,

  didInsertElement: function() {

      this._super();
      var manager = this.get('manager');

      if ( !manager ) {

        var context = this.get('contextView');
        if ( !!context ) {
          manager = context.get('manager');
        }

      }

      if ( Em.typeOf(manager) === "string" ) {
        manager = Em.getPath(manager);
      }

      this.manager = manager;

  }


});

});minispade.register('yoin-views/views/utils/mixins/i18n', function() {Yn.I18n = Em.Mixin.create({

  didInsertElement: function() {
    this._super();
    this.$().text( I18n.t( this.get('elementId') ) );

  }

});



});minispade.register('yoin-views/views/utils/mixins/icon', function() {Yn.Icon = Ember.Mixin.create({

  classNames: ['icon'],
  attributeBindings: ['icon'],

  icon: null

});

});minispade.register('yoin-views/views/utils/mixins/scroll_wrapper', function() {Yn.ScrollWrapper = Ember.Mixin.create({
	heights: [],
	enableLogging: false,

	classNames: ['scroll-wrapper'],

	shouldSetUpDimensions: false,

	init: function( ) {
		this._super();

		if ( this.get('shouldSetUpDimensions') ) {
			this.setUpProperties();
		}
	},

	didInsertElement: function() {

		this._super();

		if ( this.get('shouldSetUpDimensions') ) {
			this.setUpDimensions();
		}

		var id = this.get('elementId');
		//this.iScroll = new iScroll(id, { checkDOMChanges:false, hScrollbar:false, vScrollbar:false });

	},

	setUpProperties: function() {

		var heights = this.get('heights');
		if ( Em.typeOf(heights) === "string" ) {
			this.heights = this.heights.split(' ');
		}

	},


	setUpDimensions: function() {

		var elementHeight, elementHeights = 0, self = this;

		this.heights.forEach( function(item) {

			//elementsHeight+= $('#'+item).height();
			
			elementHeight = (typeof item === 'number')?item:$('#'+item).outerHeight();

			Em.assert('scroll wrapper mixin (' + item + ') not found ', !!elementHeight);

			elementHeights+=elementHeight;

			if ( self.enableLogging ) {
				console.log('item ' + item + ' elementHeight ' + elementHeight + ' total ' + elementHeights  );
			}
			
		});


		// innerHeight: works in safari browser and phonegap ios app
		// TODO: move to window.mkHeight prototype
		//var height = window.innerHeight-elementHeights;
		var height = 460-elementHeights;

		this.$().height(height); 

	},

	refreshScroll: function() {

/*
		var iScroll = this.iScroll;

		if ( iScroll ) {
			// because it could be not in the DOM
			Em.run.next(function() {


				Em.run.next(function() {
					iScroll.refresh();
					iScroll.scrollTo(0, 0, 0);
				});

			});

		}
*/
	},

	_contentChanged: Ember.observer(function() {
	
		this.refreshScroll();

	}, 'content.[]'),


	destroy: function() {

		var iScroll = this.iScroll;
    if ( iScroll ) {
      iScroll.destroy();
      iScroll = null;
    }

		this._super();

	}

});

});minispade.register('yoin-views/views/utils/scroll_wrapper', function() {Yn.ScrollWrapperView = Em.View.extend(Yn.ScrollWrapper, {


});

});minispade.register('yoin-views/views/utils/scroller', function() {Yn.ScrollerView = Em.View.extend( Yn.ContextManager, {
	classNames: ['scroller'],

	isAtBottom: false,
	check: true,
	holdPeriod: 200,

  // property check if content was already refreshed
	// used to allow showRefreshBottonView
	isRefreshed: null,
	length: null,

	_height: null,
	_top: null,
	_innerHeight: null,
	_inner: null,

	showBottomView: Em.computed(function() {

		return !this.get('isRefreshed') && this.get('isAtBottom');

	}).property('isAtBottom', 'isRefreshed'),
	

	didInsertElement: function() {
		this._super();
		this.refresh();

	},

  didBottomRefresh: function() {
		

  },

	refresh: function() {

		if ( !this.get('isDestroyed') || !this.get('isDestroying') ) {
			//http://www.jquery4u.com/events/jquery-detect-scroll-bottom-read-tc/#.UBGPNkTmovc
			this._height = this.$().height();
			this._offsetTop = this.$().offset().top;

			this._inner = $("> .scroller-container", this.$() );

			//{{#view class="scroller-container" }} 
			// <div class="scroller-container"> --> childViews not working
			this._innerOuterHeight = this._inner.outerHeight(); 
		}

	},

	_isRefreshedChanged: Em.observer(function() {

		if ( this.get('isRefreshed') ) {

			// update after a period to closeshowBottomView 
			var self = this;
			Ember.run.later(function() { 
				self.set('isRefreshed', false);
			}, 500);

		}

	},'isRefreshed'),

	_lengthChanged: Em.observer(function() {

		//console.log('length changed  ' + this.get('length') );

		var self = this;
		// wait to render new content, any better way to do it?
		//Ember.run.schedule ??
		Em.run.next(function() {
			Em.run.next(function() {
				self.refresh();
			});

		});

	},'length'),

  mouseWheel: function(event) { 
		this._check();
	},

  touchMove: function(event) {
		this._check();
	},

	_check: function() {

		if ( this.check ) {
			var isAtBottom =  Math.ceil(this._height - this._inner.offset().top + this._offsetTop) >= this._innerOuterHeight; 
			this.set('isAtBottom', isAtBottom);
		}

	},

  _showBottomViewChanged: Em.observer(function() {

    if ( this.get('showBottomView') ) {

      var self = this;
      this._endTimeout = window.setTimeout( function() {
        self._endFired();
      }, this.holdPeriod);

    } else {

      this._disableEndFired();

    }

  }, 'showBottomView' ),

  _endFired: function() {

    this._disableEndFired();
    this.didBottomRefresh();

  },

  _disableEndFired: function() {

    if ( this._endTimeout ) {
      window.clearTimeout(this._endTimeout);
      this._endTimeout = null;
    }

  },

  destroy: function() {

    this._disableEndFired();
    this._super();

  }

});

});minispade.register('yoin-views/views/utils/unbound', function() {Yn.UnboundView = Em.View.extend({

  item: null,

  didInsertElement: function() {
    this._super();
    this.$().text( this.get('item') );

  }

});

});