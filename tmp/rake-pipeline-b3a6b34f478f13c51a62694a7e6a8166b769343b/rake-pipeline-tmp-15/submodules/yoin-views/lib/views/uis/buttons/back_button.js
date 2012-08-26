minispade.register('yoin-views/views/uis/buttons/back_button', function() {Yn.BackButtonView = Em.View.extend(Yn.Btap, {

  action: 'back',
  classNames: ['back-button'],

  didInsertElement: function() {
    this._super();
    this.$().text(I18n.t('back'));
  }

});

});