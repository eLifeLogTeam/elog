/**
 * elog.api.FileManager
 * 
 * Manage the file content
 * 
 */
Ext.define('Elog.api.media.FileManager', {
    extend: 'Elog.api.media.Base',
    config: {
    	
    },
	
    constructor: function(cfg) {
    	this.callParent(cfg);
    	this.initConfig(cfg);

    	return this;
    },
    
    /**
     * Check the file media type to be supported by the E-model system
     * 
     * @param {Object} cfg
     */
    isValidMedia : function(cfg) {
        oFileManager = this;
        this.getServerQuery({
    		command: this.getCommands().isValidMedia,
    		params: {
    			userKey: cfg.userKey,
                fileName: cfg.sourceFile, 
                mediaType: cfg.mediaType
    		},    		
    		onSuccess: function(oResult) {
    			if (typeof oResult.result !== "undefined") {
    				oFileManager.attachResult(oResult.result);
    			}
    			
    			if (oResult.root.results != 'false') {
                    // Get preview data
                	oFileManager.getPreview(cfg);
                }
                else {
                	oFileManager.logError('Media type is not supported: '+cfg.sourceFile);
                	cfg.onFail();
                }
            },            
            onFail: function(oResult) {
            	oFileManager.logError('Server connection failed. Check the internet connection');
            	cfg.onFail();
            }
    	});
    },

    /**
     * Get a selected file preview information
     * 
     * @param {Object} cfg
     */
    getPreview : function(cfg) {
        // Get preview data
    	oFileManager = this;
    	this.getServerQuery({
    		command: this.getCommands().getPreview,
    		params: {
                fileName: cfg.sourceFile, 
                mediaType: cfg.mediaType
    		},    		
    		onSuccess: function(oResult) {
    			if (typeof oResult.result !== "undefined") {
    				oFileManager.attachResult(oResult.result);
    			}
    			
    			if (oResult.root.results != 'false') {
                	// Set waiting
                	cfg.onGetPreview(oResult);
                }
                else {
                	oFileManager.logError('No preview is available: '+cfg.sourceFile);
                	cfg.onFail();
                }
            },            
            onFail: function(oResult) {
            	oFileManager.logError('Network connection error');
            	cfg.onFail();
            }
    	});
    },

    /**
     * Remove selected medai
     * 
     * @param {Object} cfg
     */
    removeMedia : function(cfg) {
    	if (cfg.sourceFile == '') return false;
    	
        oFileManager = this;
    	this.getServerQuery({
    		command: oFileManager.getCommands().removeMedia,
    		params: {
                fileName: cfg.sourceFile
    		},    		
    		onSuccess: function(oResult) {
    			if (typeof oResult.result !== "undefined") {
    				oFileManager.attachResult(oResult.result);
    			}
    			
    			if (oResult.root.results != 'false') {
                	// $('#'+oFileManager.oGUIInfo.processingresultid).html('Removed: '+oFileManager.oSourceFile);
            		if (typeof cfg.onSuccess !== "undefined") {
            			cfg.onSuccess(oResult);
            		}
            	}
                else {
                	// Set waiting
                	cfg.onFile();
                }
            },            
            onFail: function(oResult) {
            	oFileManager.logError('Network connection error');
            	cfg.onFail();
            }
    	});
    },

    /**
     * Import media
     * 
     * @param {Object} cfg
     */
    onLoadMedia : function(cfg) {
    	oFileManager = this;
    	if (cfg.isDir === false || cfg.isDir == "false") {
    		this.getServerQuery({
        		command: this.getCommands().loadMedia,
        		params: {
                    fileName: cfg.sourceFile,
    	            mediaType: cfg.mediaType,
    	            isDir: cfg.isDir,
    	            timeZone: cfg.mysqlTimeZone,
    	            timeOffset: cfg.timeOffset
        		},    		
        		onSuccess: function(oResult) {
        			if (typeof oResult.result !== "undefined") {
        				oFileManager.attachResult(oResult.result);
        			}
        			
        			cfg.onSuccess(oResult);
                },            
                onFail: function(oResult) {
                	oFileManager.logError('File importing error: '+cfg.sourceFile);
                	cfg.onFail();
                }
        	});
    	}
    	else {
    		// Register Job
    		this.getServerQuery({
        		command: this.getCommands().registerJob,
        		params: {
        			fileName: cfg.sourceFile,
    	            mediaType: cfg.mediaType
        		},    		
        		onSuccess: function(oResult) {
        			if (typeof oResult.result !== "undefined") {
        				oFileManager.attachResult(oResult.result);
        			}
        			
    				cfg.onDirSuccess(oResult);
    	        	
    	        	// Retrieve Job ID
    				cfg.jobId = parseInt(oResult.root.results);
    				
    				oFileManager.oProgressIntervalID = setTimeout(
    					"oFileManager.onProgressMonitor()", 
    					100
    				);
    				oFileManager.cfg = cfg;
    				
    				// Start job
    				oFileManager.onStartJob(cfg);
                },            
                onFail: function(oResult) {
                	oFileManager.logError('Network connection error');
                	cfg.onFail();
                }
        	});
    	}
    },

    /**
     * Start the batch job
     * 
     * @param {Object} cfg
     */
    onStartJob : function(cfg) {
    	this.oJobStarted = true;
    	oFileManager = this;
    	
    	this.getServerQuery({
    		command: this.getCommands().loadMedia,
    		params: {
    			fileName: cfg.sourceFile,
                mediaType: cfg.mediaType,
                isDir: cfg.isDir,
                requestJobId: cfg.jobId,
                timeZone: cfg.mysqlTimeZone,
                timeOffset: cfg.timeOffset
    		},    		
    		onSuccess: function(oResult) {
    			if (typeof oResult.result !== "undefined") {
    				oFileManager.attachResult(oResult.result);
    			}
    			
    			oFileManager.oJobStarted = false;
            	
            	// Kill Timer
    			if (oFileManager.oProgressIntervalID) {
    				// clearInterval(oFileManager.oProgressIntervalID);
    				clearTimeout(oFileManager.oProgressIntervalID);
    			}
    			
    			if (typeof cfg.onJobSuccess != "undefined") {
    				cfg.onJobSuccess(oResult);
    			}
            },            
            onFail: function(oResult) {
            	oFileManager.logError('Network connection error');
            	cfg.onFail();
            }
    	});
    },

    /**
     * Check the job progress from the server side
     */
    onProgressMonitor : function() {
    	oFileManager = this;
    	this.getServerQuery({
    		command: this.getCommands().getJobProgress,
    		params: {
    			requestJobId: oFileManager.cfg.jobId,
                updateLog: oFileManager.cfg.udpateLog
    		},    		
    		onSuccess: function(oResult) {
    			if (typeof oResult.result !== "undefined") {
    				oFileManager.attachResult(oResult.result);
    			}
    			
    			oFileManager.cfg.onProgressSuccess(oResult);
    			
    			if (oResult.root.results.m_fProgress < 99) {
                	oFileManager.oProgressIntervalID = setTimeout(
    					"oFileManager.onProgressMonitor()", 
    					100
    				);
    			}
    			else {
        			oFileManager.oJobStarted = false;
                	
                	// Kill Timer
        			if (oFileManager.oProgressIntervalID) {
        				// clearInterval(oFileManager.oProgressIntervalID);
        				clearTimeout(oFileManager.oProgressIntervalID);
        			}
        			
    				oFileManager.logStatus('Job completed: '+oResult.root.results.m_fProgress+'%');
    			}
            },            
            onFail: function(oResult) {
            	oFileManager.logError('Network connection error');
            	oFileManager.cfg.onFail();
            }
    	});
    },
    
    
    /**
     * Check the file media type to be supported by the E-model system
     * 
     * @param {Object} cfg
     */
    restoreTestData : function(cfg) {
        oFileManager = this;
        this.getServerQuery({
    		command: this.getCommands().restoreTestData,
    		params: {
    		},    		
    		onSuccess: function(oResult) {
    			if (typeof oResult.result !== "undefined") {
    				oFileManager.attachResult(oResult.result);
    				
    				if (cfg.onSuccess) {
    					cfg.onSuccess(oResult);
    				}
    			}
                else {
                	oFileManager.logError('Test data restoration failed');
                	cfg.onFail();
                }
            },            
            onFail: function(oResult) {
            	oFileManager.logError('Server connection failed. Check the internet connection');
            	cfg.onFail();
            }
    	});
    }
});