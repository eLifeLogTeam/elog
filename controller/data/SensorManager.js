/**
 * Elog controller: SensorManager
 * 
 */
Ext.define('Elog.controller.data.SensorManager', {
	extend: 'Elog.controller.data.UIManager',
    requires: [
       'Elog.controller.data.UIManager',
       'Elog.api.media.SensorCEPManager',
       'Elog.view.panel.media.sensor.CEPEditor',
       'Elog.view.panel.media.sensor.KeyValueMapView',
       'Elog.api.media.GpsManager',
       'Elog.api.utility.Base',
       'Ext.util.Droppable'
    ],
	config: {
		/**
		 * Including views are optional since necessary components are accessed through refs
		 */
		views: [
	        'Elog.view.panel.media.sensor.CEPEditor',
	        'Elog.view.panel.media.sensor.KeyValueMapView'
		],
		/**
		 * When designing your own SensorManager panel, replace or comment above views config 
		 * and update below IDs to work with your panel
		 */
		refs: {
			// Sensor key value viewer
            // keyValueMapView: '#idElogKeyValueMapView',
            keyValueMapView: '#idElogKeyValueMapView',
            childGpsDataPath: '#idChildGpsDataPath',
            childSensorKeyValueDataView: '#idChildSensorKeyValueDataView',
            
            // UI CEP Editor
            cepEditor: '#idElogCEPEditor',
            cepEditorTabPanel: '#idElogCEPEditorTabPanel',
            childCEPEditorTab: '#idChildCEPEditorTab',
            childCEPEditorSensorKeyViewTab: '#idChildCEPEditorSensorKeyViewTab',
            
            childCEPEditorCEPNestedList: '#idChildCEPNestedList',
            childCEPEditorListRefresh: '#idChildCEPEditorListRefresh',
            childCEPEditorListAdd: '#idChildCEPEditorListAdd',
            
            childCEPEditorSensorKeyView: '#idChildCEPEditorSensorKeyView',
            childCEPEditor: '#idChildCEPEditor',
            childCEPEditorPatternRun: '#idChildCEPEditorPatternRun',
            childCEPEditorPatternSave: '#idChildCEPEditorPatternSave',
            childCEPEditorWindowToolbar: '#idChildCEPEditorWindowToolbar',
            childCEPEditorPatternRunList: '#idChildCEPEditorPatternRunList',
            
            childCEPEditorGpsDataPath: '#idChildCEPEditorGpsDataPath',
            childCEPEditorSensorKeyValueDataView: '#idChildCEPEditorSensorKeyValueDataView',
        },

		control: {
            keyValueMapView: {
                initialize: 'onInitKeyValueMapView'
            },
            childGpsDataPath: {
                showinfo: 'onChildKeyValueMapViewShowInfo',
                pathselect: 'onChildKeyValueMapViewSelect'
            },
            childSensorKeyValueDataView: {
            	itemselect: 'onChildSensorKeyValueDataViewItemSelect',
            	timechange: 'onTimeChange'
            },
            
            // UI CEP Editor
            cepEditor: {
                initialize: 'onInitCEPEditor'
            },
            cepEditorTabPanel: {
            	activeitemchange: 'onCEPEditorTabChange',
            },
            childCEPEditorCEPNestedList: {
                showinfo: 'onChildCEPNestedListShowInfo',
            	itemselect: 'onChildCEPNestedListItemSelect'
            },
            childCEPEditorListRefresh: {
        		tap: 'onChildCEPNestedListRefreshTap'
            },
            childCEPEditorListAdd: {
            	// tap: 'onChildCEPNestedListAddTap'
            },
            childCEPEditorPatternRun: {
            	tap: 'onChildCEPEditorPatternRunTap'
            },
            childCEPEditorPatternSave: {
            	tap: 'onChildCEPEditorPatternSaveTap'
            },
            childCEPEditorGpsDataPath: {
                showinfo: 'onChildCEPEditorKeyValueMapViewShowInfo',
                pathselect: 'onChildCEPEditorKeyValueMapViewSelect'
            },
            childCEPEditorSensorKeyValueDataView: {
            //	itemselect: 'onChildCEPEditorSensorKeyValueDataViewItemSelect',
            	timechange: 'onTimeChange',
            },
            
		},
	},
	
	onTimeChange: function(oEventConfig) {
		var oUnixTimestamp = oEventConfig.unixTimestamp;
    	var oController = this;
    	
    	oController.putTimeChangeListener(oController.getChildTimeSliderToolbar());
    	
    	// UI KeyValueMapView
    	oController.putTimeChangeListener(oController.getChildGpsDataPath());
    	oController.putTimeChangeListener(oController.getChildSensorKeyValueDataView());
    
    	// UI CEPEditor
    	oController.putTimeChangeListener(oController.getChildCEPEditorGpsDataPath());
    	oController.putTimeChangeListener(oController.getChildCEPEditorSensorKeyValueDataView());
    	
    	// Distribute event to all UIs under control.
    	oController.getTimeChangeListeners().forEach(function(oTimeChangeListener) {
    		if (typeof oTimeChangeListener.onTimeChange != "undefined" &&
    			oTimeChangeListener.getItemId() != oEventConfig.caller.getItemId()) {
    			oTimeChangeListener.onTimeChange(oEventConfig);
    		}
    	});
    },
	
    onTimeRangeChange: function() {
    	var oController = this;
    	
    	// Distribute event to all UIs under control.
    	oController.getTimeRangeChangeListeners().forEach(function(oTimeRangeChangeListener) {
    		if (typeof oTimeRangeChangeListener.onTimeRangeChange != "undefined") {
    			oTimeRangeChangeListener.onTimeRangeChange();
    		}
    	});
    },
	
    /**
     * Initialize path information
     * 
     * @param {Object} oEvent
     * @param {Number} oEvent.radius
     * @param {Number} oEvent.maxRaidus
     * @param {Object} oEvent.mapCenter Google map center
     * @param {Object} oEvent.mapBound Google map boundary
     * @param {Object} opts
     */
    onInitKeyValueMapView: function (oEvent, opts) {
    	var oController = this;
    	
    	// Set search call function
    	oController.setCurrentSearchFunction({
    		'function' : oController.onInitKeyValueMapView,
    		'args' : oEvent
    	});
    	
    	// Add event listener
		var oTimeFrom = new Date(oController.getStartTime().getValue());
		var oTimeTo = new Date(oController.getEndTime().getValue());
		
    	// var oMedia = Ext.create('Elog.api.media.SensorKeyValueManager');
		var oManager = oController.getSensorManager();
		
    	return oManager.getSensorDatabyTimeSpan({
    		mediaType: 'android',
    		// sensors: 'LocationChange,WifiConnection,StepMovingStatus,GpsMovingSpeed',
        	// sensors: 'GPSLocationEvent,LocationChange,WifiConnection,GpsMovingSpeed',
        	// sensors: 'LocationChange,WifiConnection,GpsMovingSpeed',
        	// sensors: 'AddressChange,LocationChange',
        	// sensors: 'AddressChange,GPSLocationEvent',
        	// sensors: 'AddressChange,GPSLocationEvent,AddressLoopEvent',
        	// sensors: 'AddressChange,GPSLocationEvent,AddressLoopEvent,WifiConnection',
        	// XXX Rename sensor names dueo to the sensor naming policy change 12 Jul 2014
			// sensors: 'Esper/CEP/AddressChange,Samsung/GalaxyS4/GPSLocationEvent,Esper/CEP/AddressLoopEvent,Esper/CEP/WifiConnection',
			// sensors: 'Esper/CEP/AddressChange,Apple/iPhone3S/GPSLocationEvent,Apple/iPhone4S/GPSLocationEvent,Garmin/Edge500/GPSLocationEvent,Samsung/GalaxyS4/GPSLocationEvent,Esper/CEP/AddressLoopEvent,Esper/CEP/WifiConnection',
        	// sensors: '%GPSLocationEvent,Esper/CEP/AddressChange,Esper/CEP/AddressLoopEvent,Esper/CEP/WifiConnection',
        	sensors: '%GPSLocationEvent,Esper%',
        	// sensors: 'AddressLoopEvent,GPSLocationEvent',
        	timeFrom: Math.round(oTimeFrom.getTime()/1000),
        	timeTo: Math.round(oTimeTo.getTime()/1000),
        	samplingSecond: 10,
        	onSuccess: function(oResult) {
        		oController.attachResult(oResult.result);
        		
        		var oSensorKeyValueDataView = oController.getChildSensorKeyValueDataView();
    			var result = oSensorKeyValueDataView.loadData(oResult);
    			
    			var oGpsDataPath = oController.getChildGpsDataPath();
    			var result = oGpsDataPath.loadData(oResult);
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
    },
    
    /**
     * Refresh path information
     * 
     * @param {Object} oEvent
     * @param {Number} oEvent.radius
     * @param {Number} oEvent.maxRaidus
     * @param {Object} oEvent.mapCenter Google map center
     * @param {Object} oEvent.mapBound Google map boundary
     * @param {Object} opts
     */
    onChildKeyValueMapViewShowInfo: function (oEvent, opts) {
    	var oController = this;
    	return;
    	
    	var oUtil = Ext.create('Elog.api.analysis.Cluster');
    	var oGpsCluster = oController.getChildGpsPath();
    	
		var oGpsController = Ext.create('Elog.api.media.GpsManager');
		var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
    	return oGpsController.getGpsCluster({
    		mediaType: 'gps',
    		minRadius: oEvent.minRadius,
    		maxRadius: oEvent.maxRadius,
            mapCenter: oEvent.mapCenter,
            mapBounds: oEvent.mapBounds,
            timeFrom: Math.round(oTimeFrom.getTime()/1000),
            timeTo: Math.round(oTimeTo.getTime()/1000),
        	onSuccess: function(oResult) {
        		if (typeof oResult.result !== "undefined") {
        			oController.attachResult(oResult.result);
        		}
        		
        		if (oResult) {
        			oGpsCluster.onProcessGpsRegion(oResult);
        		}
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
    },
    
    /**
     * Child gps path selection event handler
     * 
     * @param {Object} oRegion google.map.circle object. It embeds additioanl bounds property
     * @param {Object} oRegion.bounds google.map.bounds object
     */
    onChildKeyValueMapViewSelect: function(oPathes) {
    	var oMedia = Ext.create('Elog.api.media.Base');
		var oController = this;
		
		// TODO: Below should be the call by the region and time, not like below.
		oPathes.forEach(function(oPath) {
			var timeFrom = Math.round(Number(oPath.startTimestamp)/1000);
    		var timeTo = Math.round(Number(oPath.endTimestamp)/1000);
			
			var oSensorKeyValueDataView = oController.getChildSensorKeyValueDataView();
			// var result = oSensorKeyValueDataView.selectTimeRange(timeFrom, timeTo);
			var result = oSensorKeyValueDataView.scrollToSelectedUnixTimestamp(timeFrom);			
		});
		
    	return true;
    },
    
    onChildSensorKeyValueDataViewItemSelect: function (oRecord) {
    	var oController = this;
    	
    	var oChildGpsDataPath = oController.getChildGpsDataPath();
		var result = oChildGpsDataPath.onSetHereMarkerbyUnixTimestamp(Number(oRecord.data.unixtimestamp));
    	
    	return true;
    },
    
    // UI CEP Editor
    
    /**
     * Initialize path information
     * 
     * @param {Object} oEvent
     * @param {Number} oEvent.radius
     * @param {Number} oEvent.maxRaidus
     * @param {Object} oEvent.mapCenter Google map center
     * @param {Object} oEvent.mapBound Google map boundary
     * @param {Object} opts
     */
    onInitCEPEditor: function (oEvent, opts) {
    	var oController = this;
    	// Set search call function
    	oController.setCurrentSearchFunction({
    		'function' : oController.onInitCEPEditor,
    		'args' : oEvent
    	});
    	
    	var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
		var oManager = oController.getSensorManager();
		
    	var oGetCEPSensorDatabyTimeSpanResult = oManager.getCEPSensorDatabyTimeSpan({
    		mediaType: 'esper',
            timeFrom: Math.round(oTimeFrom.getTime()/1000),
            timeTo: Math.round(oTimeTo.getTime()/1000),
        	onSuccess: function(oResult) {
        		oController.attachResult(oResult.result);
        		
        		var oCEPNestedList = oController.getChildCEPEditorCEPNestedList();
    			var result = oCEPNestedList.loadData(oResult);
    			
				var oChildCEPEditor = oController.getChildCEPEditor();
				
				if (oChildCEPEditor.getAceCEPEditor() != null) {
					var oAceEditor = oChildCEPEditor.getAceCEPEditor();
				//	oAceEditor.insert("/* Import library header */\nimport org.elifelog.cep.*;\n\n/**\n * CEP sequence\n * Date: " + (new Date()).toString() + "\n */\n\n");
					oAceEditor.insert("/* Import library header */\nimport org.elifelog.cep.*;\n\n");
				}
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
    },
    
    /**
     * Switch run function by the tab
     * 
     * @param {} oCEPEditor
     * @param {} value
     * @param {} oldValue
     * @param {} eOpts
     */
    onCEPEditorTabChange: function(oCEPEditor, value, oldValue, eOpts) {
    	var oController = this;
    	var oChildCEPEditorTab = oController.getChildCEPEditorTab();
    	var oChildCEPEditorSensorKeyViewTab = oController.getChildCEPEditorSensorKeyViewTab();
    	
    	if (value == oChildCEPEditorTab) {
    		// Set search call function
	    	oController.setCurrentSearchFunction({
	    		'function' : oController.onInitCEPEditor,
	    		'args' : oCEPEditor
	    	});
    	}
    	else {
    		// Set search call function
	    	oController.setCurrentSearchFunction({
	    		'function' : oController.onChildCEPResultRefresh,
	    		'args' : oCEPEditor
	    	});
    	}
    },
    
    onChildCEPNestedListRefreshTap: function(oEvent, opts) {
    	return this.onInitCEPEditor(oEvent, opts);
    },
    
    /**
     * Run CEP query 
     * 
     * @param {} oEvent
     * @param {} opts
     * @return {}
     */
    onChildCEPEditorPatternRunTap: function(oEvent, opts) {
    	var oController = this;
    	var oChildCEPEditor = oController.getChildCEPEditor();
    	var oChildCEPEditorPatternRunList = oController.getChildCEPEditorPatternRunList();
    	
    	var oCEPPattern = null;
    	
    	if (oChildCEPEditorPatternRunList.getStore() == null) return;
    	if (oChildCEPEditorPatternRunList.getStore().getData() == null) return;
    	
    	oCEPPattern = '/* Import library header */\nimport org.elifelog.cep.*;\n\n';
		
    	var oPatternList = oChildCEPEditorPatternRunList.getStore().getData();
    	var oSelectedSensors = [];
    	oPatternList.each(function(oPatternData){
    		if (oPatternData.get('query') != null && oPatternData.get('query').length > 10) {
    			oCEPPattern += '\n'+oPatternData.get('query')+'\n';
    			oSelectedSensors.push(oPatternData.get('sensorName'));
    		}
    	});
    	
    	var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
    	if (oCEPPattern != null) {
    		var oManager = this.getSensorManager();
			var oController = this;
			
	    	var oRunCEPResult = oManager.runCEP({
	    		mediaType: 'esper',
	    		pattern: oCEPPattern,
	            timeFrom: Math.round(oTimeFrom.getTime()/1000),
	            timeTo: Math.round(oTimeTo.getTime()/1000),
	        	onSuccess: function(oResult) {
	        		oController.attachResult(oResult.result);
	        		
	        		// Refresh CEP event viewer	
			    	return oManager.getSensorDatabyTimeSpan({
			    		mediaType: 'android',
			    		// sensors: '%GPSLocationEvent,Esper/CEP/AddressChange,Esper/CEP/AddressLoopEvent,Esper/CEP/WifiConnection',
			        	// List up selected sensors above. Here we first search GPSLocationEvent to update UI map
			        	sensors: '%GPSLocationEvent'+((oSelectedSensors.length > 0) ? ','+oSelectedSensors.join() : ',Esper%'),
			        	timeFrom: Math.round(oTimeFrom.getTime()/1000),
			        	timeTo: Math.round(oTimeTo.getTime()/1000),
            			samplingSecond: 10,
			        	onSuccess: function(oResult) {
			        		oController.attachResult(oResult.result);
			        		
			        		var oSensorKeyValueDataView = oController.getChildCEPEditorSensorKeyValueDataView();
			    			var result = oSensorKeyValueDataView.loadData(oResult);
			    			
			    			var oGpsDataPath = oController.getChildCEPEditorGpsDataPath();
			    			var result = oGpsDataPath.loadData(oResult);
			        	},
			        	onFail: function(oResult) {
			        		oController.attachResult(oResult.result);
			        		oController.updateInstruction();
			        	}
			        });
	        	},
	        	onFail: function(oResult) {
	        		oController.attachResult(oResult.result);
	        		oController.updateInstruction();
	        	}
	        });
    	}
    },
    
    /**
     * Save CEP query.
     * 
     * XXX This should work only for one CEP query. The sequence of CEP should be recorded as a pattern. Study further on this pattern format.
     * 
     * @param {} oEvent
     * @param {} opts
     * @return {}
     */
    onChildCEPEditorPatternSaveTap: function(oEvent, opts) {
    	var oController = this;
    	var oChildCEPEditor = oController.getChildCEPEditor();
    	
		var oTimeFrom = new Date(oController.getStartTime().getValue());
		var oTimeTo = new Date(oController.getEndTime().getValue());
		
    	if (oChildCEPEditor.getAceCEPEditor() != null) {
    		var oPatternDefinition = oChildCEPEditor.getPatternDefinition();
			var oManager = this.getSensorManager();
			
	    	var oResult = oManager.registerCEP({
	    		mediaType: 'esper',
	    		sensorName: oPatternDefinition.sensorName,
	    		inputSensors: oInputSensors.join(),
	    		query: oQuery,
	            timeFrom: Math.round(oTimeFrom.getTime()/1000),
	            timeTo: Math.round(oTimeTo.getTime()/1000),
	        	onSuccess: function(oResult) {
	        		oController.attachResult(oResult.result);
	        		if (typeof oResult.result !== "undefined") {
	        			oController.attachResult(oResult.result);
	        		}
	        		
	        		if (oResult) {
	        			return true;
	        		}
	        	},
	        	onFail: function(oResult) {
	        		oController.attachResult(oResult.result);
	        		oController.updateInstruction();
	        	}
	        });
    	}
    },
    
    /**
     * Refresh CEP list
     * 
     * @param {Object} oEvent
     * @param {Number} oEvent.radius
     * @param {Number} oEvent.maxRaidus
     * @param {Object} oEvent.mapCenter Google map center
     * @param {Object} oEvent.mapBound Google map boundary
     * @param {Object} opts
     */
    onChildCEPNestedListShowInfo: function (oEvent, opts) {
    	var oController = this;
    	return;
    },
    
    onChildCEPNestedListItemSelect: function (oRecord) {
    	var oController = this;
    	
    	// var oChildGpsDataPath = oController.getChildGpsDataPath();
		// var result = oChildGpsDataPath.onSetHereMarkerbyUnixTimestamp(Number(oRecord.data.unixtimestamp));
    	
    	return true;
    },
    
    /**
     * Refresh path information
     * 
     * @param {Object} oEvent
     * @param {Number} oEvent.radius
     * @param {Number} oEvent.maxRaidus
     * @param {Object} oEvent.mapCenter Google map center
     * @param {Object} oEvent.mapBound Google map boundary
     * @param {Object} opts
     */
    onChildCEPEditorKeyValueMapViewShowInfo: function (oEvent, opts) {
    	var oController = this;
    	return;
    	
    	var oUtil = Ext.create('Elog.api.analysis.Cluster');
    	var oGpsCluster = oController.getChildGpsPath();
    	
		var oGpsController = Ext.create('Elog.api.media.GpsManager');
		var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
    	return oGpsController.getGpsCluster({
    		mediaType: 'gps',
    		minRadius: oEvent.minRadius,
    		maxRadius: oEvent.maxRadius,
            mapCenter: oEvent.mapCenter,
            mapBounds: oEvent.mapBounds,
            timeFrom: Math.round(oTimeFrom.getTime()/1000),
            timeTo: Math.round(oTimeTo.getTime()/1000),
        	onSuccess: function(oResult) {
        		if (typeof oResult.result !== "undefined") {
        			oController.attachResult(oResult.result);
        		}
        		
        		if (oResult) {
        			oGpsCluster.onProcessGpsRegion(oResult);
        		}
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
    },
    
    /**
     * Child gps path selection event handler
     * 
     * @param {Object} oRegion google.map.circle object. It embeds additioanl bounds property
     * @param {Object} oRegion.bounds google.map.bounds object
     */
    onChildCEPEditorKeyValueMapViewSelect: function(oPathes) {
    	var oMedia = Ext.create('Elog.api.media.Base');
		var oController = this;
		
		// TODO: Below should be the call by the region and time, not like below.
		oPathes.forEach(function(oPath) {
			var timeFrom = Math.round(Number(oPath.startTimestamp)/1000);
    		var timeTo = Math.round(Number(oPath.endTimestamp)/1000);
			
			var oSensorKeyValueDataView = oController.getChildCEPEditorSensorKeyValueDataView();
			// var result = oSensorKeyValueDataView.selectTimeRange(timeFrom, timeTo);
			var result = oSensorKeyValueDataView.scrollToSelectedUnixTimestamp(timeFrom);			
		});
		
    	return true;
    },
    
    onChildCEPEditorSensorKeyValueDataViewItemSelect: function (oRecord) {
    	var oController = this;
    	
    	var oChildGpsDataPath = oController.getChildCEPEditorGpsDataPath();
		var result = oChildGpsDataPath.onSetHereMarkerbyUnixTimestamp(Number(oRecord.data.unixtimestamp));
    	
    	return true;
    },
    
    /**
     * Update CEP result 
     * 
     * @param {} oEvent
     * @param {} opts
     * @return {}
     */
    onChildCEPResultRefresh: function(oEvent, opts) {
    	var oController = this;
    	var oChildCEPEditor = oController.getChildCEPEditor();
    	var oChildCEPEditorPatternRunList = oController.getChildCEPEditorPatternRunList();
    	
    	var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		var oManager = this.getSensorManager();
		
    	var oCEPPattern = null;
    	
    	if (oChildCEPEditorPatternRunList.getStore() == null) return;
    	if (oChildCEPEditorPatternRunList.getStore().getData() == null) return;
    	
    	var oPatternList = oChildCEPEditorPatternRunList.getStore().getData();
    	var oSelectedSensors = [];
    	oPatternList.each(function(oPatternData){
    		if (oPatternData.get('query') != null && oPatternData.get('query').length > 10) {
    			oSelectedSensors.push(oPatternData.get('sensorName'));
    		}
    	});
    	
		// Refresh CEP event viewer	
    	var oResult = oManager.getSensorDatabyTimeSpan({
    		mediaType: 'android',
    		sensors: '%GPSLocationEvent'+((oSelectedSensors.length > 0) ? ','+oSelectedSensors.join() : ',Esper%'),
        	timeFrom: Math.round(oTimeFrom.getTime()/1000),
        	timeTo: Math.round(oTimeTo.getTime()/1000),
			samplingSecond: 10,
        	onSuccess: function(oResult) {
        		oController.attachResult(oResult.result);
        		
        		var oSensorKeyValueDataView = oController.getChildCEPEditorSensorKeyValueDataView();
    			var result = oSensorKeyValueDataView.loadData(oResult);
    			
    			var oGpsDataPath = oController.getChildCEPEditorGpsDataPath();
    			var result = oGpsDataPath.loadData(oResult);
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
    },
    
});