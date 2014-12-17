/**
 * CEPEditor manager in charge of server communication
 * 
 * @author Pil Ho Kim
 *
 */
Ext.define('Elog.api.media.SensorCEPManager', {
    // These are all detected automatically
    // No need to use @extends, @alternateClassName, @mixin, @alias, @singleton
    // extend: 'Elog.api.media.Base',
    extend: 'Elog.api.media.SensorKeyValueManager',
    requires: ['Ext.JSON'],
    config: {
    	/**
    	 * Server service call commands
    	 */
        commands : {
        	getSensorData: 'Media.esper.GetSensorData',
        	getSensorDatainNestedList: 'Media.esper.GetSensorDatainNestedList',
        	registerCEP: 'Media.esper.RegisterCEP',
        	runCEP: 'Media.esper.RunCEP'
        }
    },
    
    constructor: function(cfg) {
    	this.callParent(cfg);
    	this.initConfig(cfg);
	    
	    return this;
    },
    
    /**
     * Register CEP
     * 
     * @param {Object} cfg
     * @param {Object} sensors sensor names list
     * @param {String} cfg.timeFrom Start time to search in unix timestamp in UTC
     * @param {String} cfg.timeTo End time to search in unix timestamp in UTC
     */
    registerCEP : function (cfg) {
    	var oSensorCEPManager = this;
    	this.getServerQuery({
    		command: this.getCommands().registerCEP,
    		/*
    		params: {
    			mediaType: cfg.mediaType,
    			sensorName: cfg.sensorName,
                inputSensors: cfg.inputSensors,
                query: cfg.query,
    		},
    		*/
    		params: cfg,
    		onSuccess: function(oResult) {
    			if (typeof oResult.root == "undefined") {
    				oSensorCEPManager.logError('Server connection failed. Check the internet connection');
                	if (typeof cfg.onFail !== "undefined") {
            			cfg.onFail(oResult);
            		}
                	return false;
    			}
    			                
            	if (typeof cfg.onSuccess !== "undefined") {
        			cfg.onSuccess(oResult);
        		}
            },            
            onFail: function(oResult) {
            	oSensorCEPManager.logError('Server connection failed. Check the internet connection');
            	if (typeof cfg.onFail !== "undefined") {
        			cfg.onFail(oResult);
        		}
            }
    	});
    },
    
    
    
    /**
     * Search Sensor key value data
     * 
     * @param {Object} cfg
     * @param {Object} sensors sensor names list
     * @param {String} cfg.timeFrom Start time to search in unix timestamp in UTC
     * @param {String} cfg.timeTo End time to search in unix timestamp in UTC
     */
    /*
    getSensorDatabyTimeSpan: function (cfg) {
    	var oSensorKeyValueManager = this;
    	this.getServerQuery({
    		command: this.getCommands().getSensorData,
    		params: cfg,
    		onSuccess: function(oResult) {
    			if (typeof oResult.root == "undefined") {
    				oSensorKeyValueManager.logError('Server connection failed. Check the internet connection');
                	if (typeof cfg.onFail !== "undefined") {
            			cfg.onFail(oResult);
            		}
                	return false;
    			}
    			else {
    				if (Array.isArray(oResult.root) == false) {
    					if (oResult.root == "false") return false;
    					else return oResult.root;
    				}
    				else {
	    				oResult.root.forEach(function(oData, i) {
							if (typeof oData.data !== 'undefined') {
								var oString = oData.data.replace(/"/g,"'").replace(/\n/g,"");
								var oDataObject = Ext.JSON.decode(oString, true);
								
								if (oDataObject != null && oDataObject.hasOwnProperty("eml_event_timestamp")) {
									if (oDataObject.hasOwnProperty("newEvent") &&oDataObject.newEvent != null) { // Unlike oldEvent, newEvent property is always set but it could be null, July 1, 2014
										oDataObject.newEvent = oSensorKeyValueManager.getEventData(oDataObject.newEvent);
										
										//	oDataObject.newEvent.eml_event_timestamp = oDataObject.eml_event_timestamp;
										if (oDataObject.newEvent != null && oDataObject.hasOwnProperty("eml_event_timestamp") && oDataObject.eml_event_timestamp != null) {
											oDataObject.newEvent["eml_event_timestamp"] = oDataObject.eml_event_timestamp;
										}
									}
									
									if (typeof(oDataObject.oldEvent) != "undefined") oDataObject.oldEvent = oSensorKeyValueManager.getEventData(oDataObject.oldEvent);
									
									if (typeof(oDataObject.reportStatus) != "undefined") oDataObject.reportStatus = oSensorKeyValueManager.base64Decode(oDataObject.reportStatus.replace(/\n/g,""));
									if (typeof(oDataObject.status) != "undefined") oDataObject.status = oSensorKeyValueManager.base64Decode(oDataObject.status.replace(/\n/g,""));
									
									// Set data icon
									if (i == 0) oDataObject.iconDiv = "elogSKVIconStart";
									else if (i == oResult.root.length -1) oDataObject.iconDiv = "elogSKVIconEnd";
									else oDataObject.iconDiv = "elogSKVIcon";
									
									oData.data = oDataObject;						
								}
			    			}
						});
    				}
    			}
    			                
            	if (typeof cfg.onSuccess !== "undefined") {
        			cfg.onSuccess(oResult);
        		}
            },            
            onFail: function(oResult) {
            	oSensorKeyValueManager.logError('Server connection failed. Check the internet connection');
            	if (typeof cfg.onFail !== "undefined") {
        			cfg.onFail(oResult);
        		}
            }
    	});
    },
    */
    
    /**
     * Search Sensor key value data
     * 
     * @param {Object} cfg
     * @param {Object} sensors sensor names list
     * @param {String} cfg.timeFrom Start time to search in unix timestamp in UTC
     * @param {String} cfg.timeTo End time to search in unix timestamp in UTC
     */
    getCEPSensorDatabyTimeSpan : function (cfg) {
    	var oSensorCEPManager = this;
    	this.getServerQuery({
    		command: this.getCommands().getSensorDatainNestedList,
    		params: {
    			mediaType: cfg.mediaType,
    			sensors: (typeof cfg.sensors != "undefined") ? cfg.sensors : null,
                timeFrom: (typeof cfg.timeFrom != "undefined") ? cfg.timeFrom : null,
                timeTo: (typeof cfg.timeTo != "undefined") ? cfg.timeTo : null
    		},
    		onSuccess: function(oResult) {
    			if (typeof oResult.root == "undefined") {
    				oSensorCEPManager.logError('Server connection failed. Check the internet connection');
                	if (typeof cfg.onFail !== "undefined") {
            			cfg.onFail(oResult);
            		}
                	return false;
    			}
    			else {
    				if (Array.isArray(oResult.root) == false) {
    					if (oResult.root == "false") return false;
    					else return oResult.root;
    				}
    				else {
	    				oResult.root.forEach(function(oData, i) {
							if (oData != null && oData.hasOwnProperty("eml_event_timestamp")) {
								// Set data icon
								if (i == 0) oData.iconDiv = "elogCEPListIconStart";
								else if (i == oResult.root.length -1) oData.iconDiv = "elogCEPListIconEnd";
								else oData.iconDiv = "elogCEPListIcon";
			    			}
						});
    				}
    			}
    			                
            	if (typeof cfg.onSuccess !== "undefined") {
        			cfg.onSuccess(oResult);
        		}
            },            
            onFail: function(oResult) {
            	oSensorCEPManager.logError('Server connection failed. Check the internet connection');
            	if (typeof cfg.onFail !== "undefined") {
        			cfg.onFail(oResult);
        		}
            }
    	});
    },
    
    
    /**
     * Search Sensor key value data
     * 
     * @param {Object} cfg
     * @param {Object} sensors sensor names list
     * @param {String} cfg.timeFrom Start time to search in unix timestamp in UTC
     * @param {String} cfg.timeTo End time to search in unix timestamp in UTC
     */
    runCEP: function (cfg) {
    	var oSensorCEPManager = this;
    	
    	var oUtil = new Ext.create('Elog.api.utility.Base');
    	
        this.getServerQuery({
    		command: this.getCommands().runCEP,
    		params: {
    			mediaType: cfg.mediaType,
    			// pattern: oUtil.base64Decode(cfg.pattern),
    			pattern: cfg.pattern,
    			sensors: (typeof cfg.sensors != "undefined") ? cfg.sensors : null,
                timeFrom: (typeof cfg.timeFrom != "undefined") ? cfg.timeFrom : null,
                timeTo: (typeof cfg.timeTo != "undefined") ? cfg.timeTo : null
    		},
    		onSuccess: function(oResult) {
    			if (typeof oResult.root == "undefined") {
    				oSensorCEPManager.logError('Server connection failed. Check the internet connection');
                	if (typeof cfg.onFail !== "undefined") {
            			cfg.onFail(oResult);
            		}
                	return false;
    			}
    			else {
    				if (Array.isArray(oResult.root) == false) {
    					if (oResult.root == "false") return false;
    					else return oResult.root;
    				}
    				else {
	    				oResult.root.forEach(function(oData, i) {
							if (oData != null && oData.hasOwnProperty("eml_event_timestamp")) {
								// Set data icon
								if (i == 0) oData.iconDiv = "elogCEPListIconStart";
								else if (i == oResult.root.length -1) oData.iconDiv = "elogCEPListIconEnd";
								else oData.iconDiv = "elogCEPListIcon";
			    			}
						});
    				}
    			}
    			                
            	if (typeof cfg.onSuccess !== "undefined") {
        			cfg.onSuccess(oResult);
        		}
            },            
            onFail: function(oResult) {
            	oSensorCEPManager.logError('Server connection failed. Check the internet connection');
            	if (typeof cfg.onFail !== "undefined") {
        			cfg.onFail(oResult);
        		}
            }
    	});
    },
    
    getEventData : function (oEvent) {
    	if (oEvent == null || typeof oEvent !== 'string') return null;
    	
    	var oEventString = oEvent.replace(/\n/g,"");
    	var oEventString = this.base64Decode(oEventString);
    	var oEventString = oEventString.replace(/"/g,"'");
		var oEventObject = Ext.JSON.decode(oEventString, true);
		return oEventObject;
    },
});

