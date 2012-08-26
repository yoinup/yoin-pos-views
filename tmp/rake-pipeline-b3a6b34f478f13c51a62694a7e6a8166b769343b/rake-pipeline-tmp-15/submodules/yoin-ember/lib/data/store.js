minispade.register('yoin-ember/data/store', function() {
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

});