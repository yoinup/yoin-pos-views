minispade.register('yoin-ember/data/fixture_adapter', function() {var get = Ember.get;

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


});