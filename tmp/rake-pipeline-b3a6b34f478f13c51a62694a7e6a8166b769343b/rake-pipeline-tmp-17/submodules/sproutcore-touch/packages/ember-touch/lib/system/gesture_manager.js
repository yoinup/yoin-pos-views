minispade.register('ember-touch/system/gesture_manager', function() {// ==========================================================================
// Project:  Ember Touch 
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = Em.get;
var set = Em.set;

/**
  @class

  Manages multiplegesture recognizers that are associated with a view.
  This class is instantiated automatically by Em.View and you wouldn't
  interact with it yourself.

  Em.GestureManager mainly acts as a composite for the multiple gesture
  recognizers associated with a view. Whenever it gets a touch event, it
  relays it to the gestures. The other main resposibility of
  Em.GestureManager is to handle re-dispatching of events to the view.

  @extends Em.Object
*/
Em.GestureManager = Em.Object.extend({

  /**
    An array containing all the gesture recognizers associated with a
    view. This is set automatically by Em.View.

    @default null
    @type Array
  */
  gestures: null,
  view: null,

  /**
    Relays touchStart events to all the gesture recognizers to the
    specified view

    @return Boolen
  */
  touchStart: function(evt, view) {
    return this._invokeEvent('touchStart',evt);
  },

  /**
    Relays touchMove events to all the gesture recognizers to the
    specified view

    @return Boolen
  */
  touchMove: function(evt, view) {
    return this._invokeEvent('touchMove',evt);
  },

  /**
    Relays touchEnd events to all the gesture recognizers to the
    specified view

    @return Boolen
  */
  touchEnd: function(evt, view) {
    return this._invokeEvent('touchEnd',evt);
  },

  /**
    Relays touchCancel events to all the gesture recognizers to the
    specified view

    @return Boolen
  */
  touchCancel: function(evt, view) {
    return this._invokeEvent('touchCancel',evt);
  },

  /**
    Relays an event to the gesture recognizers. Used internally
    by the touch event listeners. Propagates the event to the parentViews.

    @private
    @return Boolean
  */
  _invokeEvent: function(eventName, eventObject) {

    var gestures = this.get('gestures'),
        l =  gestures.length,
        handler,
        result = true;

    // view can response directly to touch events
    handler = this.view[eventName];
    if (Em.typeOf(handler) === 'function') {
      handler.call(this.view, eventObject);
    }

    if ( l > 0 ) {

      //appGestureManager allow to pass touchEvents at the App Level  
      var gesturesCanReceiveTouchEvent = Em.AppGestureManager.get('isBlocked')? Em.AppGestureManager.shouldReceiveTouch(this.view) : true;
      if ( gesturesCanReceiveTouchEvent ) {

        var gesture,
            gestureDelegate,
            isValid,
            i;

        for (i=0; i < l; i++) {
          gesture = gestures[i];
          handler = gesture[eventName];

          if (Em.typeOf(handler) === 'function') {

            gestureDelegate = gesture.get('delegate');

            if ( !gesture.get('isEnabled') ) {
              isValid = false;
            //gestureDelegate allow to pass touchEvents depending on gesture state  
            } else if ( !gestureDelegate ) {
              isValid = true;
            } else {

              isValid = this._applyDelegateRules( gestureDelegate,  gesture, this.view, eventObject );
              if ( isValid === undefined ) {
                isValid = gestureDelegate.shouldReceiveTouch( gesture, this.view, eventObject );
              }

            }

            if ( isValid ) {
              result = handler.call(gesture, eventObject);
            }

          }
        }

      }

    }
    
    // browser delivers the event to the DOM element
    // bubble the event to the parentView
    var parentView = this.view.get('parentView');
    if ( parentView ) {
      var manager = parentView.get('eventManager');
      if ( manager ) { manager._invokeEvent(eventName, eventObject); }
      
    }

    return result;

  },

  _applyDelegateRules: function(gestureDelegate, gesture, view, event) {

    var rules = gestureDelegate.rules,
        length = rules.length;

    if ( length > 0 ) {

      var i,
          result;

      for (i=0;i<length;i++) {
        result = rules[i].shouldReceiveTouch(gesture, view, event);
        if ( result !== undefined ) {
          return result;
        }
      }
    }

    return undefined;

  }

});

});