/**
 * Elog controller: UIGpsManager
 * 
 */
Ext.define('Elog.controller.data.UIGpsManager', {
	extend: 'Elog.controller.data.UIManager',
    requires: [
       'Elog.controller.data.UIManager',
       'Elog.api.media.GpsManager',
       'Ext.util.Droppable',
       'Elog.view.panel.media.GpsClusterView',
       'Elog.view.panel.media.GpsDataPathView',
    ],
	config: {
		/**
		 * Including views are optional since necessary components are accessed through refs
		 */
		views: [
	        // 'Elog.view.panel.media.sensor.CEPEditor',
		],
		/**
		 * When designing your own UIGpsManager panel, replace or comment above views config 
		 * and update below IDs to work with your panel
		 */
		refs: {
			// UI ElogGpsCluster
			gpsCluster: '#idElogGpsCluster',
			childGpsClusterViewTimeSliderToolbar: '#idChildGpsClusterViewTimeSliderToolbar',
			childGpsClusterViewGpsCluster: '#idChildGpsClusterViewGpsCluster',
			
			// UI ElogGpsDataPath
			gpsDataPath: '#idElogGpsDataPath',
			childGpsDataPathViewGpsDataPath: '#idChildGpsDataPathViewGpsDataPath',
			
			// Map
            mapRegionSelector: '#idElogMapRegionSelector',
            gpsCluster: '#idElogGpsCluster',
            gpsClusterPath: '#idElogGpsClusterPath',
		},

		control: {
			// UI Gps Cluster
			gpsCluster: {
            	initialize: 'onInitGpsClusterView',
            },
            childGpsClusterViewGpsCluster: {
            	timechange: 'onTimeChange',
            },
			
            // UI Gps Data Path
            gpsDataPath: {
            	initialize: 'onInitGpsDataPathView',
            },
		},
	},
	
	
    onTimeChange: function(oEventConfig) {
		var oUnixTimestamp = oEventConfig.unixTimestamp;
    	var oController = this;
    	
    	oController.putTimeChangeListener(oController.getChildTimeSliderToolbar());
    	
    	// Add listener
    	// UI ElogGpsCluster
    	oController.putTimeChangeListener(oController.getChildGpsClusterViewTimeSliderToolbar());
  		oController.putTimeChangeListener(oController.getChildGpsClusterViewGpsCluster());
    	
    	// UI ElogGpsDataPath
  		oController.putTimeChangeListener(oController.getChildGpsDataPathViewGpsDataPath());
    	  	
    	// Distribute event to all UIs under control.
    	oController.getTimeChangeListeners().forEach(function(oTimeChangeListener) {
    		if (typeof oTimeChangeListener.onTimeChange != "undefined" &&
    			oTimeChangeListener.getItemId() != oEventConfig.caller.getItemId()) {
    			oTimeChangeListener.onTimeChange(oEventConfig);
    		}
    	});
    },
	
    /**
     * Initialize GPS cluster information
     * 
     * @param {Object} oEvent
     * @param {Number} oEvent.radius
     * @param {Number} oEvent.maxRaidus
     * @param {Object} oEvent.mapCenter Google map center
     * @param {Object} oEvent.mapBound Google map boundary
     * @param {Object} opts
     */
    onInitGpsClusterView: function (oEvent, opts) {
    	// Set search call function
    	this.setCurrentSearchFunction({
    		'function' : this.onInitGpsClusterView,
    		'args' : oEvent
    	});
    	
    	// Add listener
    	var oController = this;
    	
    	oController.putTimeChangeListener(oController.getChildGpsClusterViewGpsCluster());
    	
    	var oGpsCluster = oController.getChildGpsClusterViewGpsCluster();
		
		var oGpsController = Ext.create('Elog.api.media.GpsManager');
    	
    	var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
		// Calculate the map boundary
		oGpsCluster.getMapBoundary();
		
    	return oGpsController.getGpsCluster({
    		mediaType: 'gps',
    		/*
    		minRadius: (typeof oGpsCluster.getMap() != "undefined") ? 0.02 : 0, // 0.02km --> 20 meters
    		maxRadius: (typeof oGpsCluster.getMap().getBounds() != "undefined") ? oGpsController.getRadiusinKm(oGpsCluster.getMap().getBounds()) : 1000,
            mapCenter: (typeof oGpsCluster.getMap().getCenter() != "undefined") ? oGpsCluster.getMap().getCenter() : null,
            mapBounds: (typeof oGpsCluster.getMap().getBounds() != "undefined") ? oGpsCluster.getMap().getBounds() : null,
            */
            minRadius: oGpsCluster.getMinRadius(),
    		maxRadius: oGpsCluster.getMaxRadius(),
            mapCenter: oGpsCluster.getMapCenter(),
            mapBounds: oGpsCluster.getMapBounds(),
            timeFrom: oTimeFrom,
            timeTo: oTimeTo,
            samplingSecond: 10,
        	onSuccess: function(oResult) {
        		if (typeof oResult.result !== "undefined") {
        			oController.attachResult(oResult.result);
        		}
        		
        		if (oResult) {
        			// oGpsCluster.onProcessGpsRegion(oResult);
        			var result = oGpsCluster.loadData(oResult);
        		}
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
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
    onInitGpsDataPathView: function (oEvent, opts) {
    	// Set search call function
    	this.setCurrentSearchFunction({
    		'function' : this.onInitGpsDataPathView,
    		'args' : oEvent
    	});
    	
    	// Add listener
    	var oController = this;
    	
    	oController.putTimeChangeListener(oController.getChildGpsDataPathViewGpsDataPath());
    	
    	var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
    	// var oMedia = Ext.create('Elog.api.media.SensorKeyValueManager');
		var oManager = this.getSensorManager();
		
    	return oManager.getSensorDatabyTimeSpan({
    		// TODO Below media type should be 'sensor' not 'android'
    		mediaType: 'android',
    		sensors: '%GPSLocationEvent',
        	timeFrom: Math.round(oTimeFrom.getTime()/1000),
        	timeTo: Math.round(oTimeTo.getTime()/1000),
            samplingSecond: 10,
			maxCount: 1000,
        	onSuccess: function(oResult) {
        		oController.attachResult(oResult.result);
        		
    			var oGpsDataPath = oController.getChildGpsDataPathViewGpsDataPath();
    			var result = oGpsDataPath.loadData(oResult);
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
    },
});