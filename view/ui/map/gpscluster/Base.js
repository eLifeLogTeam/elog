/**
 * Map GPS cluster viewer
 * 
 * This shows clusters on the map
 * 
 * @author Pil Ho Kim 
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.ui.map.gpscluster.Base', {
 *     	fullscreen:true
 *     });
 * 
 *
 */
Ext.define('Elog.view.ui.map.gpscluster.Base', {
    extend: 'Elog.view.ui.map.Base',
    xtype: 'elogGpsCluster',
    
    /**
     * Fires whenever a user changed the region to search
     * 
     * @event showinfo
     * @param {Object} mapCenter Map center information: google.maps.LatLng class object
     * @param {Number} distance The index of the item within the Container
     */

    requires: [
       'Elog.store.LocationStore',
       'Elog.model.LocationModel',
       'Ext.data.proxy.LocalStorage',
       'Ext.util.DelayedTask'
    ],
    config: {
    	/**
    	 *  Save the gps point query result
    	 */
    	gpsPoints: null,
    	/**
    	 * Calculated clusters
    	 */
    	clusters: null,
    	/**
    	 * Circle array to display cluster areas
    	 */
    	circles: [],
    	/**
    	 * Google map information window to show information of a cluster when a circle is clicked.
    	 */
    	infoWindow: null,
        /**
         * Cluster stroke weight
         */
        clusterStrokeWeight : 2,
        /**
         * Cluster fill color
         */
        // clusterFillColor : "#00AAFF",
        clusterFillColor : "#00b3fe",
        /**
         * Cluster stroke color
         */
        // clusterStrokeColor : "#FFAA00",
    	// clusterStrokeColor : "#3479c4",
    	clusterStrokeColor : "#00b3fe",
    	/**
    	 * Google geocorder object for reverse-geocoding
    	 */
        geoCorder: null,
        /**
		 * Default max radius to search from the center. This is the circle radius
		 */
		maxRadius: 1, // Default to 1 km radius to search
		/**
		 * Default minimum radius to search from the center. This is the circle radius
		 */
		minRadius: 0.1, // Default to 1 km radius to search
        /**
         * Map marker
         */
        marker: null, 
        /**
         * Set Google map option
         */
        mapOptions: {
            zoom: 15
        },
        /**
		 * Store of searching locations
		 */
		searchLocationStore: null,
		searchLocationConfig: null,
		/**
		 * Configuration whether to show the address information
		 */
		showAddress: true,
    	hereCluster: null,
		hereMarker: null,
		hereMarkerImage: null,
		markerShadowImage: null,
		herePos: null,
		hereCircle: null,
		clusterTimeMatchingAccuracy: 2, // Find cluster that matches within 2 seconds with GPS records
    	showTimewithGeocoder: false,
    },
    
    /**
     * Initialize
     */
    init: function() {
    	this.setGeoCorder(new google.maps.Geocoder());
    	
    	this.setSearchLocationStore(Ext.create('Elog.store.LocationStore'));
    	
    	this.readLocationRange();
    	
    	/*
        this.setMapCenter(new google.maps.LatLng(
    		this.getSearchLocationConfig().latitude, 
    		this.getSearchLocationConfig().longitude)
        );
        */
        
    	var oApiBase = new Elog.api.Base();
    	if (typeof oApiBase.getCookie('elogMapCenterLat') !== "undefined" &&
    		typeof oApiBase.getCookie('elogMapCenterLng') !== "undefined") {
			this.setMapCenter(new google.maps.LatLng(
				oApiBase.getCookie('elogMapCenterLat'), 
				oApiBase.getCookie('elogMapCenterLng')
			));
    	}
    	
    	if (typeof this.getMap().getCenter() != "undefined") {
    		this.getMap().setCenter(this.getMapCenter());
    	}
    	
        if (this.getMapBoundary()) {
        	this.fireEvent('showinfo', {
            	radius: this.getMinRadius(),
        		maxRadius: this.getMaxRadius(),
        		mapCenter: this.getMapCenter(),
        		mapBounds: this.getMapBounds()
        	});
        }
        
        // Set the delayed query task
        // This routine will be called by the map events
        var oGpsCluster = this;
        this.setQueryTask(new Ext.create('Ext.util.DelayedTask', function() {
        	oGpsCluster.updateCluster(oGpsCluster);
        })); 
        
        // Create markers
    	this.setHereMarkerImage(new google.maps.MarkerImage(
    	//	"http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png",
    		(typeof this.getMapIconBaseUrl() === "undefined") ? 
    			window.location.origin+"/lab/elog/sdk/library/mapiconscollection-markers/"+"here.png" :
    			this.getMapIconBaseUrl()+"here.png",
    		new google.maps.Size(32, 37),
			new google.maps.Point(0,0),
			new google.maps.Point(16, 37)
    	));
    },

    /**
     * Load data to use the same function call name
     * 
     * @param {} oResult
     * @return {}
     */
    loadData: function(oResult) {
    	return this.onProcessGpsRegion(oResult);
    },
    
    /**
     * Process the GPS cluster information
     * 
     * Data sample: 
     * 	Ext.util.JSONP.callback({
     * 		"cluster":[
     * 			{"nodeId":"2330","count":"137","radiusKm":"0.815975","latitude_center":"46.065742","longitude_center":"11.129422","latitude_max":"46.067871","longitude_max":"11.132989","latitude_min":"46.062988","longitude_min":"11.125085"},
     * 			{"nodeId":"2329","count":"244","radiusKm":"0.77049","latitude_center":"46.060043","longitude_center":"11.122893","latitude_max":"46.064259","longitude_max":"11.126784","latitude_min":"46.05838","longitude_min":"11.121486"},
     * 			{"nodeId":"1459","count":"277","radiusKm":"0.755026","latitude_center":"46.06572","longitude_center":"11.12229","latitude_max":"46.067974","longitude_max":"11.126514","latitude_min":"46.063984","longitude_min":"11.118588"},
     * 			{"nodeId":"1752","count":"142","radiusKm":"0.615827","latitude_center":"46.070316","longitude_center":"11.124122","latitude_max":"46.07217","longitude_max":"11.126467","latitude_min":"46.067646","longitude_min":"11.121854"}
     * 		]
     * 	});
     *     		
     * @param {Object} oClusters Object
     * @param {Array} oClusters.cluster Cluster array
     * @param {Number} oClusters.cluster.nodeId Root directory
     * @param {Number} oClusters.cluster.childCount Child nodes count
     * @param {Number} oClusters.cluster.radiusKm Boundary radius in kilometers
     * @param {Object} oClusters.cluster.bounds google.maps.LatLngBounds class. See https://developers.google.com/maps/documentation/javascript/reference#LatLngBounds
     * 
     */
    onProcessGpsRegion : function(oResult) {
    	if (this.getHereMarker()) {
            this.getHereMarker().setMap(null);
            delete this.getHereMarker();
            this.setHereMarker(null);
        }
        
    	if (this.getGpsPoints() == null) {
    		this.setGpsPoints(oResult.gpspoints.root);
    	}
    	
    	if (this.getClusters() == null) {
    		this.setClusters(oResult.cluster);
    	}
    	
        if (this.getClusters().cluster) {
            // Clear existing circle objects       
            var oCircles = this.getCircles();
            if (oCircles) {
            	oCircles.forEach(function(oCircle, i) {
                    oCircle.setMap(null);
                    delete oCircle;
                });
                
                oCircles.splice(0, oCircles.length);
            }
                                    
            // Create circles
            var oGpsCluster = this;
            this.getClusters().cluster.forEach(function(oCluster, i) {
                // Create a new radius widget
            	
            	// Check radius
            	if (oCluster.radiusKm > oGpsCluster.getMaxRadius()) return false;
            	// if (oCluster.radiusKm < oGpsCluster.getMinRadius()) return false;
            	// Thiis is not to allow the overlapping clusters
            	if (oCluster.childMaxRadiusKm > oGpsCluster.getMinRadius()) return false;
            	
                var oCircle = new google.maps.Circle({
                    center: oCluster.bounds.getCenter(),
                    clickable: true,
                    map: oGpsCluster.getMap(),
                    radius: (oCluster.radiusKm * 1000 < 1) ? 1 : oCluster.radiusKm * 1000,
                    // radius: oGpsCluster.getMetersbyPixel(20),
                    zIndex: 100,
                    strokeWeight: oGpsCluster.getClusterStrokeWeight(),
                    // strokeWeight: oGpsCluster.getMetersbyPixel(5),
                    fillColor: oGpsCluster.getClusterFillColor(),
                    strokeColor: oGpsCluster.getClusterStrokeColor(),
                    fillOpacity: 0.5,
                    bounds: oCluster.bounds,
                    labels: oCluster.labels,
                    ids: oCluster.ids
                });
                
                // Add additional information from the region
                oCircle.nodeId = oCluster.nodeId;
                oCircle.childCount = oCluster.childCount;
                // oCircle.unixTimestamp = Math.round(Number(oCluster.unixtimestamp));
                
                oGpsCluster.getCircles().push(oCircle);
                
                // Add event listener
                google.maps.event.addListener(oCircle, 'click', function(oClickPoint) {
                	oGpsCluster.onCircleTap(oCircle, oClickPoint, null);
                	
                	// Selectively fire the first unixtimestamp
                	if (Array.isArray(oCircle.labels)) {
                		var oClusterUnixtime = (new Date(oCircle.labels[0].timestamp).getTime())/1000;
                		oGpsCluster.fireElogEvent({
							eventName: 'timechange', 
							eventConfig: {
								unixTimestamp: oClusterUnixtime,
								caller: oGpsCluster,
							}
						});
                	}
                });
                
                google.maps.event.addListener(oCircle, 'mouseover', function(oClickPoint) {
                	// Selectively fire the first unixtimestamp
                	/*
                	if (Array.isArray(oCircle.labels)) {
                		var oClusterUnixtime = (new Date(oCircle.labels[0].timestamp).getTime())/1000;
                		oGpsCluster.fireElogEvent({
							eventName: 'timechange', 
							eventConfig: {
								unixTimestamp: oClusterUnixtime,
								caller: oGpsCluster,
							}
						});
                	}
                	*/
                });
            });
        }
    },

    /**
     * Show circle address and time information
     * 
     * @param {} oCircle
     * @param {} oClickPoint This could be map mouse click event or else lngLng type variable.
     */
    onCircleTap : function(oCircle, oClickPoint, oSelectedUnixtime) {
    	var oGpsCluster = this;
    	
    	var oGpsPoint = null;
    	
    	// Check oClickPoint type
    	if (typeof oClickPoint.latLng !== "undefined") {
    		oGpsPoint = oClickPoint.latLng;
    	}
    	else {
    		oGpsPoint = oClickPoint;
    	}
    	
    	/**
         * @event regionclick
         * Fires when a region is selected
         * @param {Object} google.map.circle
         */
    	oGpsCluster.fireEvent('regionclick', oCircle);
    	
        // Check boundary
        if (!oCircle.getBounds().contains(oGpsPoint)) {
            return;
        }
        
        // Retrieve actual address
        if (oGpsCluster.getShowAddress()) {
        	var geocoder = new google.maps.Geocoder();
            var latlng = oCircle.getCenter();
            
            if (oGpsCluster.getInfoWindow() != null) {
                oGpsCluster.getInfoWindow().close();
            }
            
            if (oGpsCluster.getMarker() != null) {
                oGpsCluster.getMarker().setVisible(false);
                delete oGpsCluster.getMarker();
            }
            
            oGpsCluster.setInfoWindow(new google.maps.InfoWindow({
            	disableAutoPan: true
            }));
            
            geocoder.geocode(
                {
                    'latLng': latlng
                }, 
                function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            oGpsCluster.setMarker(new google.maps.Marker({
                                position: latlng, 
                                map: oGpsCluster.getMap()
                            })); 
                            
                            var oLabelContent = results[0].formatted_address;
                            
                            if (oGpsCluster.getShowTimewithGeocoder()) {
                            	if (Array.isArray(oCircle.labels)) {
	                            	oCircle.labels.forEach(function(oLabel) {
	                            		oLabelContent += "<br>{"+oLabel.timestamp+"}";
	                            	});
	                            }
                            }
                            
                            if (oSelectedUnixtime != null) {
                            	var oDateTime = new Date(oSelectedUnixtime*1000);
                            	oLabelContent += "<br>{"+oDateTime.toString()+"}";
                            }
                            
                            oGpsCluster.getInfoWindow().setContent(oLabelContent);
                            oGpsCluster.getInfoWindow().open(oGpsCluster.getMap(), oGpsCluster.getMarker());
                        }
                    } else {
                        alert("Geocoder failed due to: " + status);
                    }
                }
            );
        }
    },
    
    /**
     * Refresh the map cluster information
     * 
     * @param {Object} oGpsCluster
     */
    updateCluster : function(oGpsCluster) {
    	// Fire an event for a listener to read the data from the server
        if (oGpsCluster.getMapBoundary()) {
        	oGpsCluster.fireEvent('showinfo', {
            	minRadius: oGpsCluster.getMinRadius(),
        		maxRadius: oGpsCluster.getMaxRadius(),
        		mapCenter: oGpsCluster.getMapCenter(),
        		mapBounds: oGpsCluster.getMapBounds()
        	});
        }
    },
    
    /**
     * Set GPS cluster view
     * 
     * @param {Object} oGpsCluster
     * 
     */
    onGpsClusterViewerRefresh : function() {
        if (this.getGeoCoder()) delete this.getGeoCoder();
        
        this.setGeoCoder(new google.maps.Geocoder());

        // Read search configuration
        // var myMask = new Ext.LoadMask(Ext.get('idGPSClusterViewer'), {msg:"Loading..."});
        // myMask.show();
    },

    /**
     * Calculate map boundary information
     */
    getMapBoundary : function() {
    	this.setMapCenter(this.getMap().getCenter());
    	
    	if (typeof this.getMap().getBounds() == "undefined") return false;
    	
        this.setMapBounds(this.getMap().getBounds());
        
        var oLatDistance = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(this.getMapBounds().getNorthEast().lat(), this.getMapBounds().getNorthEast().lng()),
            new google.maps.LatLng(this.getMapBounds().getSouthWest().lat(), this.getMapBounds().getNorthEast().lng())
        );
        var oLngDistance = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(this.getMapBounds().getNorthEast().lat(), this.getMapBounds().getNorthEast().lng()),
            new google.maps.LatLng(this.getMapBounds().getNorthEast().lat(), this.getMapBounds().getSouthWest().lng())
        );
        
        // Cut in half and convert to Km from meter
        this.setMaxRadius((oLatDistance > oLngDistance) ? oLatDistance/2000 : oLngDistance/2000);
    	//  var oRadius = (-99.99/13)*this.oGoogleMap.zoom + (1499.98/13);
        this.setMinRadius(this.getMaxRadius() / 100); // This limit the cluster to 100 for each direction
        if (this.getMinRadius() > 100) this.setRadius(100); // Set the minimum radius 100 km
        
    	return true;
    },
    
    onTimeChange : function(oEventConfig) {
		var oUnixTimestamp = oEventConfig.unixTimestamp;
        if (parseInt(this.getCurrentUnixTimestamp()) != oUnixTimestamp) {
        	this.setCurrentUnixTimestamp(oUnixTimestamp);
        
	        var oViewer = this;
	        var oSetHereCircle = false;
	        
	        // Check oCluster.labels[i].timestamp
	        return oViewer.onSetHereMarkerbyUnixTimestamp(oUnixTimestamp);
        }
    },
    
	onSetHereMarkerbyUnixTimestamp : function(oUnixTimestamp) {
        var oViewer = this;
        var oSetHereCircle = false;
        var oLastClusterUnixtime = -1405843233;
        var oLastCircle = null;
        
        // One cluster may include multiple timestamps which may not be ordered by time.
        // So we should find the minimum distance between the selected unixtime and cluster unixtimestamps.
        this.getCircles().forEach(function(oCircle, i) {
        	// Check oCluster.labels[i].timestamp
        	if (Array.isArray(oCircle.labels)) {
        		oCircle.labels.forEach(function(oLabel) {
        			var oClusterUnixtime = (new Date(oLabel.timestamp).getTime())/1000;
        			
        			if (Math.abs(oClusterUnixtime - oUnixTimestamp) < 
        				Math.abs(oLastClusterUnixtime - oUnixTimestamp)) {
        				oLastClusterUnixtime = oClusterUnixtime;
        				oLastCircle = oCircle;
        				
				        oSetHereCircle = true;
        			}
        		});
        	}
        });
        
        if (oSetHereCircle !== false) {
        	oViewer.setHerePos(oLastCircle.getCenter());
	        oViewer.setHereCircle(oLastCircle);
	        oViewer.setHereCluster(oLastCircle.nodeId);
	        
	        if (oViewer.getHereMarker() == null) {
		        oViewer.setHereMarker(new google.maps.Marker({
		            position: oViewer.getHerePos(), 
		            map: oViewer.getMap(),
		            icon: oViewer.getHereMarkerImage(),
		            shadow: oViewer.getMarkerShadowImage(),
		            zIndex: 300
		        }));
	        }
	        else {
	        	oViewer.getHereMarker().setPosition(oLastCircle.getCenter());
	        }
	        
	        // oViewer.onCircleTap(oLastCircle, oLastCircle.getCenter(), oLastClusterUnixtime);
	        
	        // Set selected cluster info window
	        if (oViewer.getInfoWindow() != null) {
                oViewer.getInfoWindow().close();
            }
            oViewer.setInfoWindow(new google.maps.InfoWindow({
            	disableAutoPan: true
            }));
            
            oLabelContent = "";
            if (oLastClusterUnixtime != null) {
            	var oDateTime = new Date(oLastClusterUnixtime*1000);
            	oLabelContent = "{"+oDateTime.toString()+"}";
            }
            
            if (oViewer.getMarker() != null) {
                oViewer.getMarker().setVisible(false);
                delete oViewer.getMarker();
            }
            
            oViewer.setMarker(new google.maps.Marker({
                position: oLastCircle.getCenter(), 
                map: oViewer.getMap()
            })); 

            oViewer.getInfoWindow().setContent(oLabelContent);
            oViewer.getInfoWindow().open(oViewer.getMap(), oViewer.getMarker());
        }
        
        if ( oViewer.getHereMarker() != null) {
        	oViewer.getHereMarker().setVisible(oSetHereCircle);
        }
        
        return true;
    },
    
});