/**
 * This is the UI base class for DIV style elemens.
 * 
 * ## How to use
 * An inherited class should define the *init* function to create a HTML DIV object.
 * It can call *this.getDivObject()* to directly access the element to draw 
 * or if it needs the ID of a div object, then call *this.getDivId()*. 
 * 
 * For instance, assuming that you are developing your own DIV object or external library to 
 * create a DIV object, it will mostly require the DIV ID or the instance of DIV object, then
 * call *this.getDivId()* for the object ID and *this.getDivObject()* for object instance.
 * It should be noted that *this.getDivObject()* should be called after *initdiv* event introduced below.
 * 
 * Working samples may help you better. Please check the source code of {@link Elog.view.ui.panel.div.Infovis Infovis} 
 * as an example of using the external DIV library.
 * 
 * ## Events
 * ### initdiv
 * This object fires the *initdiv* event to notice that an object is prepared to use. Be aware that the function 
 * to process *initdiv* event should be placed in the external controller that can monitor events. 
 * Mostly it would be the MainController within the Sencha architecture. Or else you may define own initdiv processing
 * function and let it be called by the controller. See the source code of {@link ElogDemo.controller.MainController MainController}.
 * 
 */
Ext.define('Elog.view.ui.panel.div.Base', {
    // extend: 'Ext.Container',
    extend: 'Elog.view.ui.panel.Base',
    config : {
		html: null,
		/**
		 * Default DIV element ID name. The actual ID will include additional randomly generated number to prevent dupliated ID.
		 * If no name is assigned, then it will be 'idDiv' with some random numbers, ex) idDid3211
		 */
		name: null,
		divId: null,
		/**
		 * Default Div style. It can be replaced by the inheritor.
		 */
		divStyle: 'width:100%;height:100%;background-color:#000000;',
		
		divClass: null,
		divObject: null,
    	listeners: {
    		destroy: function() {
    			// Destroy html element
    			var elem = this.getDivObject();
    			if (elem) {
    				elem.parentNode.removeChild(elem);
    			}
    		},
    		
    		// For Ext Panel, internal DIV object can only be initialized after 'painted' event.
    		// Other events like 'initialize', 'render' and 'show' will not fire  for Ext.Panel objects.
    		painted: function (oContainer, opts) {
    			this.onPainted(oContainer, opts);
	    	},
	    	
	    	/**
	    	 * TODO: We should work on this to be automatically called by MainView.js
	    	 */
	    	resize: function(oContainer, opts) {
	    		var oObject = document.getElementById(this.getDivId());
	    	}
    	}
    },
    
    onPainted : function(oContainer, opts) {
    	// Check if the object is already created
    	if (this.getDivObject() != null) return true;
    	
    	this.setDivId(
			(this.getName() ? this.getName() : 'idDiv')+Math.floor((Math.random()*10000)+1)
		);
		
    	this.createObject();
		
		// this.setInformationId(informationId);
        this.setDivObject(document.getElementById(this.getDivId()));
        
        // attach listeners
        this.attachListeners();
        
        // Callback function to be overwritten by the class inheritor
        if (typeof this.init !== "undefined") {
        	this.init();
        }
        
        /**
         * TODO: This does not work once after the element is created and then destroyed
         * which is page changing in the menu. When an element is destroyed, its associcated
         * controller looks automatically removing it from the reference. 
         * One solution is keeping the created element of loading the associcated controller dynamically
         * or dynamically add the listener at the main controller onChangeCard event.
         */
        var oResult = this.fireEvent('initdiv', this);
    },
    
    createObject: function() {
    	this.setHtml(
			'<div id="' + (this.getDivId() ? this.getDivId() : '') + '"' +
			(this.getDivClass() ? ' class="'+this.getDivClass()+'"' : '') +
			' style="'+this.getDivStyle()+'"></div>'
		);
    }
});