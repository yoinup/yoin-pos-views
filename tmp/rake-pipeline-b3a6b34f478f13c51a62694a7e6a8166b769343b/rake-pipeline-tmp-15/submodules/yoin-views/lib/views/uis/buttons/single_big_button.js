minispade.register('yoin-views/views/uis/buttons/single_big_button', function() {Yn.SingleBigButtonView = Em.View.extend(Yn.Btap, {

	classNames: ['large-button single'],
	
	action: null,
	
	content: null,
	
	didInsertElement: function() {
    this._super();
    this.$().text(this.content);
  }

});

/*{{view Yn.SingleBigButtonView class="is-grey button-text is-small is-font-black" contentI18n="login_twitter"}}*/
});