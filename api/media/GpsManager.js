/**
 * GPS Manager is the class that controls all types of GPS-type media communication with the server
 * 
 * @author Pil Ho Kim
 *
 */
Ext.define('Elog.api.media.GpsManager', {
    // These are all detected automatically
    // No need to use @extends, @alternateClassName, @mixin, @alias, @singleton
    extend: 'Elog.api.media.Base',
    requires: [
       'Elog.api.analysis.Cluster'
	],
    config: {
    	/**
    	 * Server service call commands
    	 */
        commands : {
        	// TODO: This is not found in the server GPS class
        	getGpsRegionbyRadius: 'GetGpsRegionbyRadius'
        }
    },
    
    constructor: function(cfg) {
    	this.callParent(cfg);
    	this.initConfig(cfg);
	    
	    return this;
    },
    
    /**
     * Search GPS track history from the given geospatial location and radius
     * 
     * @param {Object} cfg
     * @param {Object} cfg.mapCenter google.maps.LatLng class object
     * @param {Number} cfg.distance Radius to search from the given latitude and longitude
     * @param {String} cfg.timeFrom Start time to search in unix timestamp in UTC
     * @param {String} cfg.timeTo End time to search in unix timestamp in UTC
     */
    getMediabyTimeSpan : function (cfg) {
    	oGpsManager = this;
        this.getServerQuery({
    		command: this.getCommands().gpsGetMediabyTimespan,
    		params: {
    			mediaType: 'gps',
    			latitude: ( cfg.mapCenter != null) ? cfg.mapCenter.lat() : null,
                longitude: ( cfg.mapCenter != null) ? cfg.mapCenter.lng() : null,
                distance: ( cfg.distance != null) ? cfg.distance : null,
                timeFrom: cfg.timeFrom,
                timeTo: cfg.timeTo,
            	maxCount: (cfg.hasOwnProperty("maxCount") ? cfg.maxCount : 1000),
    		},
    		onSuccess: function(oResult) {
    			if (typeof oResult.root == "undefined") {
    				oGpsManager.logError('Server connection failed. Check the internet connection');
                	if (typeof cfg.onFail !== "undefined") {
            			cfg.onFail(oResult);
            		}
                	return false;
    			}
    			
    			var oID = -1;
                delete oGPSLatLng;
                oGPSLatLng = new Array();

                // Backup the query result
                oGPSResult = oResult.root;
                
            	if (typeof cfg.onSuccess !== "undefined") {
        			cfg.onSuccess(oResult);
        		}
            },            
            onFail: function(oResult) {
            	oGpsManager.logError('Server connection failed. Check the internet connection');
            	if (typeof cfg.onFail !== "undefined") {
        			cfg.onFail(oResult);
        		}
            }
    	});
    },
    

    /**
     * Search GPS clsuters from the given geospatial location and radius
     * 
     * @param {Object} cfg
     * @param {Number} cfg.radius
     * @param {Number} cfg.mapCenter // google.maps.LatLng class object
     * @param {Number} cfg.mapBound // google.maps.LatLngBounds class object
     * @param {Number} cfg.maxRadius Radius to search from the given latitude and longitude
     * @param {Number} cfg.timeFrom Start time in UTC second
     * @param {Number} cfg.timeTo End time in UTC second
     * @param {Number} cfg.onSuccess Callback function to process the query result
     */
    getGpsCluster : function (cfg) {
    	oGpsManager = this;
    	
    	return this.getMediabyTimeSpan({
    		mediaType: 'gps',
    		mapCenter: cfg.mapCenter,
    		distance: cfg.maxRadius,
        	timeFrom: cfg.timeFrom, 
        	timeTo: cfg.timeTo,
            maxCount: (cfg.hasOwnProperty("maxCount") ? cfg.maxCount : 1000),
        	onSuccess: function(oResult) {
        		if (typeof oResult.root == "undefined") {
    				oGpsManager.logError('Server connection failed. Check the internet connection');
                	if (typeof cfg.onFail !== "undefined") {
            			cfg.onFail(oResult);
            		}
                	return false;
    			}
    			if (typeof cfg.onSuccess !== "undefined") {
    				// Cluster results
    				var oUtil = Ext.create('Elog.api.analysis.Cluster');
    		    	var oClusterRoot = oUtil.parseGpsClusters({
    		    		"points": oResult.root
    		    	});
    		    	
    		    	var oCluster = oGpsManager.getResultinGpsCluster({
    		        	 "root" : oClusterRoot
    		         });
    		         
    		    	if (oCluster) {
    		    		// Return clustered results with the original GPS data
    		    		cfg.onSuccess({
    		    			cluster: oCluster, 
    		    			gpspoints: oResult
    		    		});
    		    	}
    		    	else {
    		    		oGpsManager.logError('Clustering failed.');
    	            	if (typeof cfg.onFail !== "undefined") {
    	        			cfg.onFail(oResult);
    	        		}
    		    	}
        		}
        	},
        	onFail: function(oResult) {
        		oGpsManager.logError('Server connection failed. Check the internet connection');
            	if (typeof cfg.onFail !== "undefined") {
        			cfg.onFail(oResult);
        		}
        	}
        });
    },

    /**
     * Parse clusters for GPS processing
     * 
     * @param {Object} oCluster
     * @returns {Object}
     * 
     * // Return object should be like this
    	"cluster":[
    	 {
    	 	"region_id":"2330",
    	 	"count":"137",
    	 	"radius_km":"0.815975",
    	 	"latitude_center":"46.065742",
    	 	"longitude_center":"11.129422",
    	 	"latitude_max":"46.067871",
    	 	"longitude_max":"11.132989",
    	 	"latitude_min":"46.062988",
    	 	"longitude_min":"11.125085"
    	 },
    	 ...
    	 ]
     */
    getResultinGpsCluster : function(oCluster) { 
    	var oGpsData = new Array();
    	var oRootNode = this.parseClusterforGps({
    		"root" : oCluster.root,
           	"gpsData" : oGpsData
    	});
    	
    	if (oRootNode == false) return false;
    	
    	return {"cluster" : oGpsData};
    },
    
    /**
     * Parse clusters for GPS representation
     * 
     * Old code in SQL
     * 
	 *	CREATE TABLE oCacheSelectedGPSRegions
	 *	SELECT DISTINCTROW
	 *		ir.*
	 *	FROM
	 *	iphone_gps_region AS ir
	 *	INNER JOIN
	 *	(
	 *		SELECT 
	 *			MAX(it.radius_km) AS child_region_max_radius,
	 *			ih.parent_region_id,
	 *			ih.region_id
	 *		FROM
	 *		iphone_gps_region_hierarchy AS ih
	 *		INNER JOIN iphone_gps_region AS it ON (ih.region_id = it.region_id)
	 *		GROUP BY ih.parent_region_id
	 *	) AS iht ON (ir.region_id = iht.parent_region_id)
	 *	WHERE
	 *		(ir.radius_km BETWEEN fRadius AND fMaxRadius) AND
	 *		iht.child_region_max_radius < fRadius AND
	 *		IF(fMaxRadius > 1000, 1, 
	 *			(ir.latitude_center BETWEEN fLat_SW AND fLat_NE) AND 
	 *			(ir.longitude_center BETWEEN fLog_SW AND fLog_NE)
	 *		)
	 *	ORDER BY ir.radius_km DESC
	 *	LIMIT 100;
	 *	
     * @param {Object} oConfig
     * @param {Object} oConfig.root Root cluster
     * @param {Number} oConfig.radius Radius
     * @param {Number} oConfig.maxRaidus Maximum radius
     * @param {Object} oConfig.gpsData Gps points array
     * 
     * @return {Object} 
     * 	{
	 *		"root" : oCluster.root,
	 *		"radius" : oEvents.radius,
	 *		"maxRaidus" : oEvents.maxRadius,
	 *		"gpsData" : oGpsData
	 *	}
     */
    parseClusterforGps : function (oConfig) {
    	var oBounds;
    	var oNodeId;
    	var oChildCount = 0;
    	
    	var oCluster = oConfig.root;
    	var oGpsData = oConfig.gpsData;
    	var oChildMaxRadiusKm = 0;
    	
    	var oLabels = [];
    	var oIds = [];
    	
    	if (typeof oCluster == "undefined" || oConfig.root == null) return;
    	// Node ID returned by figue.agglomerate is not valid for the parent cluster.
    	// so use the gps data size as the ID of a cluster
    	oChildCount = oCluster.size;
		
    	if (typeof oCluster.isLeaf == "undefined") return false;
    	
    	if (oCluster.isLeaf()) {
    		var oPoint = oCluster.centroid;
    		
    		oBounds = new google.maps.LatLngBounds(
				new google.maps.LatLng(oPoint[0], oPoint[1]),
				new google.maps.LatLng(oPoint[0], oPoint[1])
    		);
    		
    		oChildMaxRadiusKm = 0;
    		if (oCluster.label != -1) {
    			oLabels.push(oCluster.label);
    			
    			if (oIds.indexOf(oCluster.label.pathId) == -1) {
    				oIds.push(oCluster.label.pathId);
    			}
    		}
    		
    	} else {
    		var oLeftCluster = this.parseClusterforGps({
        		"root" : oCluster.left,
               	"gpsData" : oGpsData
        	});
    		var oRightCluster = this.parseClusterforGps({
        		"root" : oCluster.right,
               	"gpsData" : oGpsData
        	});
    		
    		// Merge left and right boundaries
    		oBounds = oLeftCluster.bounds;
    		oBounds.union(oRightCluster.bounds);
    		
    		oLabels = oLabels.concat(oLeftCluster.labels);
    		oLabels = oLabels.concat(oRightCluster.labels);
    		
    		oLeftCluster.ids.forEach(function(oId) {
    			if (oIds.indexOf(oId) == -1) {
    				oIds.push(oId);
    			}
    		});
    		oRightCluster.ids.forEach(function(oId) {
    			if (oIds.indexOf(oId) == -1) {
    				oIds.push(oId);
    			}
    		});
    		
    		oChildMaxRadiusKm = (oLeftCluster.radiusKm > oRightCluster.radiusKm) ?
				oLeftCluster.radiusKm : oRightCluster.radiusKm;
    	};
    	
    	// Cut in half and convert it to Kilometers
    	var oRadius = google.maps.geometry.spherical.computeDistanceBetween(
			oBounds.getNorthEast(), 
			oBounds.getSouthWest()
        )/2000.;
    	
    	oNodeId = oGpsData.length;
    	oGpsData.push({
    		"nodeId": oNodeId,
    		"childCount": oChildCount,
    		"radiusKm": oRadius, 
    		"bounds": oBounds,
    		"childMaxRadiusKm" : oChildMaxRadiusKm,
    		"labels": oLabels,
    		"ids": oIds
		});
    	
    	return {
    		"nodeId": oNodeId,
    		"childCount": oChildCount,
    		"radiusKm": oRadius, 
    		"bounds": oBounds,
    		"childMaxRadiusKm" : oChildMaxRadiusKm,
    		"labels": oLabels,
    		"ids": oIds
    	};
    },
    
    /**
     * Search GPS track history from the given geospatial location and radius
     * 
     * @param {Object} cfg
     * @param {Number} cfg.radius
     * @param {Number} cfg.mapCenter // google.maps.LatLng class object
     * @param {Number} cfg.mapBound // google.maps.LatLngBounds class object
     * @param {Number} cfg.maxRadius Radius to search from the given latitude and longitude
     * @param {Number} cfg.timeFrom Start time in UTC second
     * @param {Number} cfg.timeTo End time in UTC second
     * @param {Number} cfg.onSuccess Callback function to process the query result
     */
    getGpsRegionbyRadius : function (cfg) {
    	oGpsManager = this;
        this.getServerQuery({
    		command: this.getCommands().getGpsRegionbyRadius,
    		params: {
    			radius: cfg.radius,
                maxRadius: cfg.maxRadius,
                lat1: cfg.mapCenter.lat(),
                log1: cfg.mapCenter.lng(),
                lat2: cfg.mapBound.getNorthEast().lat(),
                log2: cfg.mapBound.getNorthEast().lng(),
                lat3: cfg.mapBound.getSouthWest().lat(),
                log3: cfg.mapBound.getSouthWest().lng(),
                timeFrom: cfg.timeFrom,
                timeTo: cfg.timeTo
    		},    		
    		onSuccess: function(oResult) {
    			if (typeof oResult.root == "undefined") {
    				oGpsManager.logError('Server connection failed. Check the internet connection');
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
            	oGpsManager.logError('Server connection failed. Check the internet connection');
            	if (typeof cfg.onFail !== "undefined") {
        			cfg.onFail(oResult);
        		}
            }
    	});
    },
    
    /**
     * Get a circle radius of a given map bound. A circle fits into the bound.
     * 
     * @param {} oMapBounds
     */
    getRadiusinKm : function (oMapBounds) {
    	if (typeof oMapBounds.getCenter() == "undefined") return null;
    	if (typeof oMapBounds.getNorthEast() == "undefined") return null;
    	
    	var center = oMapBounds.getCenter();
		var ne = oMapBounds.getNorthEast();
		
		// r = radius of the earth in statute miles
		var r = 3963.0;  
		
		// Convert lat or lng from decimal degrees into radians (divide by 57.2958)
		var lat1 = center.lat() / 57.2958; 
		var lon1 = center.lng() / 57.2958;
		var lat2 = ne.lat() / 57.2958;
		var lon2 = ne.lng() / 57.2958;
		
		// distance = circle radius from center to Northeast corner of bounds
		var dis = r * Math.acos(Math.sin(lat1) * Math.sin(lat2) + 
		  Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));
		  
		// Convert mile to kilometer
		var disinKm = dis * 1.60934;
		
		return disinKm;
    },
});

