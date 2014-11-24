/**
 * Extended Ext.Panel child base class to support lifelog data management.
 * 'Elog.view.ui.panel.Base' child classes should be independent to the content which is reuseable for general purposes.
 * 
 * This supports additional touch interactions.
 * 
 * @author pilhokim
 * 
 */
Ext.define('Elog.view.ui.panel.Base', {
    // extend: 'Ext.Container',
    extend: 'Ext.Panel',
    xtype: 'elogPanelBase',
    mixins: [
         'Elog.view.ui.Mixin'
    ],
    config: {
    	// XXX Below URLs were in elog base class
    	pictosIconBaseUrl: window.location.origin+"/lab/elog/sdk/sencha-touch/resources/themes/images/default/pictos/",
		externalIconBaseUrl: window.location.origin+"/lab/elog/sdk/library/buttoniconcollection/",
		mapIconBaseUrl: window.location.origin+"/lab/elog/sdk/library/mapiconscollection-markers/",
	
    	zIndex: 5 // Change this back to 5 less than default '6' to prevent floating panel overlapping
    },
    /**
     * Chek attached listeners and then add the monitor for those events
     * 
     * fn call arguments are function(event, node, options, eOpts)
     * 
     * Details can be found at http://docs.sencha.com/touch/2-0/#!/api/Ext.Component-event-initialize
     * and http://docs.sencha.com/touch/2-0/#!/api/Ext.mixin.Observable-method-on
     * 
     * @returns
     */
    attachListeners: function() {
    	var oListeners = {};
    	
    	if (typeof this.onDoubleTap != "undefined") oListeners.doubletap = {
    		element: 'innerElement',
    		fn : this.onDoubleTap
    	}
    	if (typeof this.onDrag != "undefined") oListeners.drag = {
    		element: 'innerElement',
    		fn : this.onDrag
    	}
    	if (typeof this.onDragStart != "undefined") oListeners.dragstart = {
    		element: 'innerElement',
    		fn : this.onDragStart
    	}
    	if (typeof this.onDragEnd != "undefined") oListeners.dragend = {
    		element: 'innerElement',
    		fn : this.onDragEnd
    	}
    	if (typeof this.onLongPress != "undefined") oListeners.longpress = {
    		element: 'innerElement',
    		fn : this.onLongPress
    	}
    	if (typeof this.onPinch != "undefined") oListeners.pinch = {
    		element: 'innerElement',
    		fn : this.onPinch
    	}
    	if (typeof this.onPinchEnd != "undefined") oListeners.pinchend = {
    		element: 'innerElement',
    		fn : this.onPinchEnd
    	}
    	if (typeof this.onPinchStart != "undefined") oListeners.pinchstart = {
    		element: 'innerElement',
    		fn : this.onPinchStart
    	}
    	if (typeof this.onRotate != "undefined") oListeners.rotate = {
    		element: 'innerElement',
    		fn : this.onRotate
    	}
    	if (typeof this.onRotateStart != "undefined") oListeners.rotatestart = {
    		element: 'innerElement',
    		fn : this.onRotateStart
    	}
    	if (typeof this.onRotateEnd != "undefined") oListeners.rotateend = {
    		element: 'innerElement',
    		fn : this.onRotateEnd
    	}
    	if (typeof this.onSingleTap != "undefined") oListeners.singletap = {
    		element: 'innerElement',
    		fn : this.onSingleTap
    	}
    	if (typeof this.onSwipe != "undefined") oListeners.swipe = {
    		element: 'innerElement',
    		fn : this.onSwipe
    	}
    	if (typeof this.onTap != "undefined") oListeners.tap = {
    		element: 'innerElement',
    		fn : this.onTap
    	}
    	if (typeof this.onTapHold != "undefined") oListeners.taphold = {
    		element: 'innerElement',
    		fn : this.onTapHold
    	}
    	
    	if (Ext.feature.has.Touch) {
    		if (typeof this.onTouchMove != "undefined") oListeners.touchmove = {
	    		element: 'innerElement',
	    		fn : this.onTouchMove
	    	}
	    	if (typeof this.onTouchStart != "undefined") oListeners.touchstart = {
	    		element: 'innerElement',
	    		fn : this.onTouchStart
	    	}
    	}
    	else {
    		if (typeof this.onTouchMove != "undefined") {
    			// See http://docs.sencha.com/touch/2-0/#!/api/Ext.feature.has-property-Touch
    			this.logStatus('The current device does not support touch events');
    			
    		}
	    	if (typeof this.onTouchStart != "undefined") {
	    		// See http://docs.sencha.com/touch/2-0/#!/api/Ext.feature.has-property-Touch
    			this.logStatus('The current device does not support touch events');
	    	}
    	}
    	
    	// Attach listeners
    	this.on(oListeners);
    }
});