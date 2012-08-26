minispade.register('yoin-views/views/api/mixins/modal', function() {Yn.Modal = Em.Mixin.create({

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

});