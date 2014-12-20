/**
 * elog.api.FileManager
 * 
 * @author Pil Ho Kim
 * 
 * Manage the file content
 * 
 * History:
 * 2011/02/17 - First version
 *
 */
Ext.define('Elog.api.media.Base', {
    // These are all detected automatically
    // No need to use @extends, @alternateClassName, @mixin, @alias, @singleton
    extend: 'Elog.api.Base',
    config: {
    },
	
    constructor: function(cfg) {
    	this.callParent(cfg);
    	this.initConfig(cfg);

    	return this;
    },
    
    
    /**
     * Get data from the media list 
     * 
     * @param {Object} cfg
     * @param {String} cfg.mediaType The list of media concatenated with ';'. Ex) image;gps;viconrevue
     */
    getData: function(cfg) {
    	// Get preview data
    	oMediaManager = this;
    	this.getServerQuery({
    		command: this.getCommands().getData,
    		params: {
    			mediaType: cfg.mediaType,
                timeFrom: cfg.timeFrom, 
                timeTo: cfg.timeTo
    		},    		
    		onSuccess: function(oResult) {
    			if (typeof oResult.count !== "undefined") {
    				oMediaManager.attachResult(oResult);
    				
    				if (parseInt(oResult.count) > 0) {
    					if (typeof cfg.onSuccess != "undefined") {
	    					cfg.onSuccess(oResult);
	    				}	
    				}
    			}
    			else {
    				if (typeof cfg.onFail != "undefined") {
    					cfg.onFail(oResult);
    				}
    			}
            },            
            onFail: function(oResult) {
            	oMediaManager.logError('Network connection error');
            	if (typeof cfg.onFail != "undefined") {
					cfg.onFail(oResult);
				}
            }
    	});
    },
    
    /**
     * Get timestamps from the media list 
     * 
     * @param {Object} cfg
     * @param {String} cfg.mediaType The list of media concatenated with ';'. Ex) image;gps;viconrevue
     */
    getTimestamps: function(cfg) {
    	// Get preview data
    	oMediaManager = this;
    	this.getServerQuery({
    		command: this.getCommands().getTimestamps,
    		params: {
    			mediaType: cfg.mediaType,
                timeFrom: cfg.timeFrom, 
                timeTo: cfg.timeTo
    		},    		
    		onSuccess: function(oResult) {
    			if (typeof oResult.count !== "undefined") {
    				oMediaManager.attachResult(oResult);
    				
    				if (parseInt(oResult.count) > 0) {
    					if (typeof cfg.onSuccess != "undefined") {
	    					cfg.onSuccess(oResult);
	    				}	
    				}
    			}
    			else {
    				if (typeof cfg.onFail != "undefined") {
    					cfg.onFail(oResult);
    				}
    			}
            },            
            onFail: function(oResult) {
            	oMediaManager.logError('Network connection error');
            	if (typeof cfg.onFail != "undefined") {
					cfg.onFail(oResult);
				}
            }
    	});
    },
    
    /**
     * Get the list of media 
     * 
     * @param {Object} cfg
     */
    getMediaList: function(cfg) {
    	// Get preview data
    	oMediaManager = this;
    	this.getServerQuery({
    		command: this.getCommands().getList,
    		params: cfg.hasOwnProperty('params') ? cfg.params : cfg,   		
    		onSuccess: function(oResult) {
    			if (typeof oResult.result !== "undefined") {
    				oMediaManager.attachResult(oResult.result);
    			}
    			
    			if (oResult.root.results != 'false') {
                	// Set waiting
    				if (typeof cfg.onSuccess != "undefined") {
    					cfg.onSuccess(oResult);
    				}
                }
                else {
                	oMediaManager.logError('No preview is available: '+cfg.sourceFile);
                	if (typeof cfg.onFail != "undefined") {
    					cfg.onFail(oResult);
    				}
                }
            },            
            onFail: function(oResult) {
            	oMediaManager.logError('Network connection error');
            	if (typeof cfg.onFail != "undefined") {
					cfg.onFail(oResult);
				}
            }
    	});
    },
    
    /**
     * Get the list of media by timestamps
     * 
     * @param {Object} cfg
     */
    getMediaListbyTimestamps: function(cfg) {
    	// Get preview data
    	oMediaManager = this;
    	this.getServerQuery({
    		command: this.getCommands().getListbyTimestamps,
    		params: {
    			mediaType: cfg.mediaType,
    			timestamps: cfg.timestamps,
    			timespan: '15' // Allow 15 seconds expanded search nearby collected GPS point
    		},    		
    		onSuccess: function(oResult) {
    			if (typeof oResult.result !== "undefined") {
    				oMediaManager.attachResult(oResult.result);
    			}
    			
    			if (oResult.root.results != 'false') {
                	// Set waiting
    				if (typeof cfg.onSuccess != "undefined") {
    					cfg.onSuccess(oResult);
    				}
                }
                else {
                	oMediaManager.logError('No preview is available: '+cfg.sourceFile);
                	if (typeof cfg.onFail != "undefined") {
    					cfg.onFail(oResult);
    				}
                }
            },            
            onFail: function(oResult) {
            	oMediaManager.logError('Network connection error');
            	if (typeof cfg.onFail != "undefined") {
					cfg.onFail(oResult);
				}
            }
    	});
    },
    
    /**
     * Run command
     * 
     * @param {Object} cfg
     */
    runCommand: function(cfg) {
    	// Get preview data
    	oMediaManager = this;
    	this.getServerQuery({
    		command: cfg.command,
    		params: cfg.params,    		
    		onSuccess: function(oResult) {
    			if (typeof oResult.result !== "undefined") {
    				oMediaManager.attachResult(oResult.result);
    			}
    			
    			if (oResult.root.results != 'false') {
                	// Set waiting
    				if (typeof cfg.onSuccess != "undefined") {
    					cfg.onSuccess(oResult);
    				}
                }
                else {
                	oMediaManager.logError('Running command failed: '+cfg);
                	if (typeof cfg.onFail != "undefined") {
    					cfg.onFail(oResult);
    				}
                }
            },            
            onFail: function(oResult) {
            	oMediaManager.logError('Network connection error');
            	if (typeof cfg.onFail != "undefined") {
					cfg.onFail(oResult);
				}
            }
    	});
    },
});