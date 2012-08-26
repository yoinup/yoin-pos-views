minispade.register('yoin-views/views/utils/mixins/i18n', function() {Yn.I18n = Em.Mixin.create({

  didInsertElement: function() {
    this._super();
    this.$().text( I18n.t( this.get('elementId') ) );

  }

});



});