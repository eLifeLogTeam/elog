/**
 * eLifeLog API: Media type select field UI
 * 
 * This is the extension of [Sencha Touch Select field](http://docs.sencha.com/touch/2-0/#!/api/Ext.field.Select) 
 * for the media type selection in eLog libraries. This icludes the list of all media types that are currently supported by eLog libraries.
 * 
 * ## How to use
 * In designing the selection field in user GUI, use this field for media type selection.
 * For instance when designing the user uploading interface, you may use this field as media type selector.
 * 
 * ## Example
 *
 *     @example preview
 *     	Ext.create('Elog.view.ui.ext.MediaTypeSelectField', {
 *     });
 */
Ext.define('Elog.view.ui.ext.MediaTypeSelectField', {
    extend: 'Ext.field.Select',
    requires: [
       'Ext.field.Select',
       'Elog.api.utility.Base'
    ],
    mixins: ['Elog.view.ui.Mixin'],
    xtype: 'elogMediaTypeSelectField',
    config : {
		label: 'Media Type',
		/**
		 * Supported media types and extensions to process. 
		 * An actual media type is determined by the server. 
		 * Thus extensions in this option may not match with 
		 * the result from the server.
		 */
		options : [{
        	text: "Android",
            value: "android",
            extensions: ["zip","gz"]
        },{
        	text: "Autographer",
            value: "autographer", 
            extensions: ["txt"]
        },{
        	text: "General GPS",
            value: "gps", 
            extensions: ["gpx", "gdb"]
        },{
        	text: "Garmin GPS",
        	value: "tcx", 
            extensions: ["tcx"]
        },{ 
        	text: "Image",
        	value: "image",
            extensions: ["jpg","png","gif","tiff","cr2","arw"]
        },{ 
        	text: "ViconRevue",
        	value: "viconrevue",
            extensions: ["csv"]
        },{ 
        	text: "Multimedia",
        	value: "video",
            extensions: ["avi", "mov", "mp4", "mpg", "wav", "mp3", "mts", "ogg" ]
        },{ 
        	text: "Generic",
        	value: "file",
            extensions: []
        }]
    },

    /**
     * A function to set the media type by the file name.
     * This file should be the full path of user's lifelog file.
     * The server will determine the file media type.
     * 
     * @param {String} sFile The full source file path of user's lifelog file
     */
    setFile: function (sFile) {
    	oMediaTypeSelectField = this;
    	this.getMediaTypebyExtension({
    		sourceFile: sFile,
    		onSuccess: function(sMediaType) {
    			oMediaTypeSelectField.setValue(sMediaType);
    		},
    		onFail: function() {
    			oMediaTypeSelectField.setValue("file");
    		}
    	});
    },
    
    /**
     * Query the media type of a file
     * 
     * @param {Object} cfg
     * @param {String} cfg.sourceFile The full source file path of user's lifelog file
     */
    getMediaTypebyExtension : function(cfg) {
    	oFileManager = this;
    	var oUtil = new Ext.create('Elog.api.utility.Base');
    	
    	oUtil.getServerQuery({
    		command: oUtil.getCommands().getValidMediaType,
    		params: {
                fileName: cfg.sourceFile
    		},    		
    		onSuccess: function(oResult) {
    			if (oResult.root.results != 'false') {
                    // Get preview data
                	cfg.onSuccess(oResult.root.results);
                }
                else {
                	// Set waiting
                	cfg.onFail("");
                }
            },            
            onFail: function(oResult) {
            	cfg.onFail("");
            }
    	});
        
	    return '';
	},
	
	/**
	 * Check the validity of a media
	 * 
	 * @param {String} sFileName The full source file path of user's lifelog file
	 */
    isValidMedia : function(sFileName) {
        // Get filename extension
        // var ext = sFileName.substr(sFileName.lastIndexOf('.') + 1).toLowerCase();
        // return this.getMediaTypebyExtension(ext); 
    	return this.getMediaTypebyExtension(sFileName); 
    }
});