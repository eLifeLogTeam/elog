/**
 * eLifeLog API: Media type checkbox panel UI
 * 
 * This is the extension of [Sencha Touch Checkbox panel](http://docs.sencha.com/touch/2-0/#!/api/Ext.panel.Checkbox) 
 * for the media type selection in eLog libraries. This icludes the list of all media types that are currently supported by eLog libraries.
 * 
 * ## How to use
 * In designing the selection panel in user GUI, use this panel for media type selection.
 * For instance when designing the user uploading interface, you may use this panel as media type selector.
 * 
 * ## Example
 *
 *     @example preview
 *     	Ext.create('Elog.view.ui.ext.MediaTypeCheckboxPanel', {
 *     });
 */
Ext.define('Elog.view.ui.ext.MediaTypeCheckboxPanel', {
    extend: 'Ext.form.Panel',
    requires: [
       'Ext.field.Checkbox',
       'Elog.api.utility.Base'
    ],
    mixins: ['Elog.view.ui.Mixin'],
    xtype: 'elogMediaTypeCheckboxPanel',
    config : {
		// label: 'Media Type',
		/**
		 * Supported media types and extensions to process. 
		 * An actual media type is determined by the server. 
		 * Thus extensions in this option may not match with 
		 * the result from the server.
		 */
		items : [{
			xtype: 'fieldset',
			title: 'Select media types',
        	items: [{
        		xtype: 'checkboxfield',
	        	name: 'All',
	        	label: 'All',
	            value: 'all', 
	            checked: true,
	            extensions: [],
	            listeners: {
	            	check: function () {
	            		if (Ext.getCmp('idElogLoginFieldset')) {
	            			Ext.getCmp('idElogLoginFieldset').hide();
	            		}
	            	},
	            	uncheck: function() {
	            		if (Ext.getCmp('idElogLoginFieldset')) {
	            			Ext.getCmp('idElogLoginFieldset').show();
	            		}
	            	}
	            }
        	}]
        },{
        	xtype: 'fieldset',
	    	title: 'Or select each',
        	id: 'idElogLoginFieldset',
        	hidden: true,
	    	items: [{
	        	xtype: "checkboxfield",
	        	name: "Android",
	        	label: "Android",
	            value: "android",
	            extensions: ["zip","gz"]
	        },{
	        	xtype: "checkboxfield",
	        	name: "Autographer",
	        	label: "Autographer",
	            value: "autographer", 
	            extensions: ["txt"]
	        },{
	        	xtype: "checkboxfield",
	        	name: "Garmin GPS",
	        	label: "Garmin GPS",
	            value: "tcx", 
	            extensions: ["tcx"]
	        },{ 
	        	xtype: "checkboxfield",
	        	name: "Image",
	        	label: "Image",
	            value: "image",
	            extensions: ["jpg","png","gif","tiff","cr2","arw"]
	        },{ 
	        	xtype: "checkboxfield",
	        	name: "ViconRevue",
	        	label: "ViconRevue",
	            value: "viconrevue",
	            extensions: ["csv"]
	        },{ 
	        	xtype: "checkboxfield",
	        	name: "Multimedia",
	        	label: "Multimedia",
	            value: "video",
	            extensions: ["avi", "mov", "mp4", "mpg", "wav", "mp3", "mts", "ogg" ]
	        },{ 
	        	xtype: "checkboxfield",
	        	name: "Generic",
	        	label: "Generic",
	            value: "file",
	            extensions: []
	        }]
        }]
    }
});