/**
 * Map Gps cluster path viewer
 * 
 * This shows previous path records between two clusters on the map
 * 
 * @author Pil Ho Kim 
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.ui.map.gpscluster.GpsDataPath', {
 *     	fullscreen:true
 *     });
 * 
 *
 */
Ext.define('Elog.view.ui.map.gpscluster.GpsDataPath', {
    extend: 'Elog.view.ui.map.gpscluster.Path',
    xtype: 'elogGpsDataPath',

    requires: [
      
    ],
    config: {
    	/*
    	 * Sensor data
    	 */
    	sensorGpsData: [],
    	circleRadius: 5, // Map circle radius
    	searchPath: false,
    },
    
    /**
     * Initialize
     */
    init: function() {
    	this.callParent();
    },
	
	/**
	 * Load data. The result is the output of the oMedia.getSensorDatabyTimeSpan() call.
	 * 
	 * @param {JSONObject} oResult The output of the oMedia.getSensorDatabyTimeSpan
	 */
    loadData : function(oResult) {	
    	var oViewer = this;
    	var oApiBase = new Elog.api.Base();
							
    	// Initialize
        if (this.getStartMarker()) {
            this.getStartMarker().setMap(null);
            delete this.getStartMarker();
            this.setStartMarker(null);
        }
        if (this.getHereMarker()) {
            this.getHereMarker().setMap(null);
            delete this.getHereMarker();
            this.setHereMarker(null);
        }
        if (this.getEndMarker()) {
            this.getEndMarker().setMap(null);
            delete this.getEndMarker();
            this.setEndMarker(null);
        }
        
        // Clear existing circle objects        
        this.getCircles().forEach(function(oCircle, i) {
            oCircle.setMap(null);
            delete oCircle;
        });
        
        this.getCircles().splice(0, this.getCircles().length);
        
    	// Load Gps points 
		this.setSensorGpsData(new Array());
							
		if (typeof oResult.root !== 'undefined') {
			oResult.root.forEach(function(oData, i) {
				if (typeof oData.data !== 'undefined' &&
					oData.data != null &&
					oData.data.hasOwnProperty("sensor")) {
					// base64Decode
					// TODO: This should be modified to process any GPS sensor data
					/*
					if (oData.data.sensor == 'Samsung/GalaxyS4/GPSLocationEvent' ||
						oData.data.sensor == 'Apple/iPhone3S/GPSLocationEvent' ||
						oData.data.sensor == 'Apple/iPhone4S/GPSLocationEvent' ||
						oData.data.sensor == 'Garmin/Edge500/GPSLocationEvent') {
					*/
					if (oData.data.sensor.indexOf('GPSLocationEvent') > -1) {
						if (typeof oData.data != 'undefined' && oData.data.hasOwnProperty("latitude")) {
							
							if (oData.data.hasOwnProperty("altitude")) oData.data.altitude = oApiBase.base64Decode(oData.data.altitude);
							if (oData.data.hasOwnProperty("bearing")) oData.data.bearing = oApiBase.base64Decode(oData.data.bearing);
							if (oData.data.hasOwnProperty("elapsedRealtimeNanos")) oData.data.elapsedRealtimeNanos = oApiBase.base64Decode(oData.data.elapsedRealtimeNanos);
							if (oData.data.hasOwnProperty("latitude")) oData.data.latitude = oApiBase.base64Decode(oData.data.latitude);
							if (oData.data.hasOwnProperty("longitude")) oData.data.longitude = oApiBase.base64Decode(oData.data.longitude);
							if (oData.data.hasOwnProperty("provider")) oData.data.provider = oApiBase.base64Decode(oData.data.provider);
							if (oData.data.hasOwnProperty("unixtimestamp")) oData.data.providerTimestamp = oApiBase.base64Decode(oData.data.unixtimestamp);
							if (oData.data.hasOwnProperty("speed")) oData.data.speed = oApiBase.base64Decode(oData.data.speed);
							
							// Check data validation
							if (parseInt(oData.data.latitude) == 0) {
								return;
							}
							if (parseInt(oData.data.longitude) == 0) {
								return;
							}
							
							oViewer.setSensorGpsData(oViewer.getSensorGpsData().concat(oData.data));
						}	
					}
					// else if (oData.data.sensor == 'Esper/CEP/LocationChange') {
					else if (oData.data.sensor.indexOf('LocationChange') > -1) {
						if (typeof oData.data.newEvent != 'undefined' && oData.data.newEvent != null) {
							if (typeof oData.data.newEvent.latitude != 'undefined') {
								oViewer.setSensorGpsData(oViewer.getSensorGpsData().concat(oData.data.newEvent));
							}
						}	
					}					
				}
			});
        };
    	
        if (this.getSensorGpsData() != null) {
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
            var oLastCircle = null;
            var oDistance = 10000;
            
            // Change map oMapBounds by GPS data
            // Reference: http://stackoverflow.com/questions/1556921/google-map-api-v3-set-oMapBounds-and-center
            
            var oMapBounds = null; 
            
            this.getSensorGpsData().forEach(function(oData, i) {
            	// Check circle distance
            	var oCircleCenter = new google.maps.LatLng(oData.latitude, oData.longitude);
            	
            	if (oMapBounds == null) {
            		oMapBounds = new google.maps.LatLngBounds(oCircleCenter, oCircleCenter);
            	}
            	else {
            		oMapBounds.extend(oCircleCenter);
            	}
            	
            	if (oLastCircle != null) {
            		oDistance = google.maps.geometry.spherical.computeDistanceBetween(
						oCircleCenter, 
						oLastCircle.getCenter()
			        );
            	}
            	
		        if (oDistance > oViewer.getCircleRadius()) {
		        	var oCircle = new google.maps.Circle({
		                center: oCircleCenter,
		                clickable: true,
		                map: oGpsCluster.getMap(),
		                // TODO: This radius should be proportional to the zoom level
		                radius: oViewer.getCircleRadius(), // 10 meter
		                // radius: oViewer.getMetersbyPixel(30), // 10 pixel
		                zIndex: 100,
		                // TODO: Assign different color or size depending on including events
		                strokeWeight: oGpsCluster.getClusterStrokeWeight(),
		                fillColor: oGpsCluster.getClusterFillColor(),
		                strokeColor: oGpsCluster.getClusterStrokeColor(),
		                fillOpacity: 0.5,
		                // oMapBounds: oCluster.oMapBounds,
		                // labels: oCluster.labels,
		                // ids: oCluster.ids
		                labels: oData.eml_event_timestamp,
		                ids: [i]
		            });
		            
		            // Add additional information from the region
		            // oCircle.nodeId = i;
		            oCircle.nodeId = oGpsCluster.getCircles().length;
		            oCircle.childCount = 0;
		            // oCircle.unixTimestamp = Math.round(Number(oData.providerTimestamp) / 1000);
		            oCircle.unixTimestamp = Math.round(Number(oData.unixtimestamp));
		            
		            oGpsCluster.getCircles().push(oCircle);
		            
		            // Add event listener
		            google.maps.event.addListener(oCircle, 'click', function(oClickPoint) {
		            	 /**
		                  * @event regionclick
		                  * Fires when a region is selected
		                  * @param {Object} google.map.circle
		                  */
		            	oGpsCluster.fireEvent('regionclick', oCircle);
		            	
		                // Check boundary
		                if (!oCircle.getBounds().contains(oClickPoint.latLng)) {
		                    return;
		                }
		                
		                // Do something in case when a circle is clicked
		                oGpsCluster.fireElogEvent({
							eventName: 'timechange', 
							eventConfig: {
								unixTimestamp: oCircle.unixTimestamp,
								caller: oGpsCluster,
							}
						});
		            });
		            
	                google.maps.event.addListener(oCircle, 'mouseover', function(oClickPoint) {
	                	// Selectively fire the first unixtimestamp
                		/*
                		oGpsCluster.fireElogEvent({
							eventName: 'timechange', 
							eventConfig: {
								unixTimestamp: oCircle.unixTimestamp,
								caller: oGpsCluster,
							}
						});
						*/
	                });
	                
		            oLastCircle= oCircle;
            	}
	        });
	        
	        // Attach start&end marker
	        if (oGpsCluster.getCircles().length > 0) {
	        	if (oViewer.getStartMarker() == null) {
			        oViewer.setStartMarker(new google.maps.Marker({
			            position: this.getCircles()[0].getCenter(), 
			            map: oViewer.getMap(),
			            icon: oViewer.getStartMarkerImage(),
			            shadow: oViewer.getMarkerShadowImage()
			        }));
		        }
		        else {
		        	oViewer.getStartMarker().setPosition(oCircle.getCenter());
		        }
		        
		        if (this.getEndMarker() == null) {
		            this.setEndMarker(new google.maps.Marker({
		                position: this.getCircles()[this.getCircles().length-1].getCenter(), 
		                map: oViewer.getMap(),
		                icon: oViewer.getEndMarkerImage(),
		                shadow: oViewer.getMarkerShadowImage()
		            }));
		        }
		        else {
		            this.getEndMarker().setPosition(
		                this.getEndPos()
		            );
		        }
	        }
        }
    	
    	oViewer.getCircles().forEach(function(oCircle) {
    		    		
    		// Add event listener
            google.maps.event.addListener(oCircle, 'click', function(oClickPoint) {
            	if (!oCircle.getBounds().contains(oClickPoint.latLng)) {
                    return false;
                }
            	
            	oViewer.onSetCluster(oCircle);
            });
            
            google.maps.event.addListener(oCircle, 'mouseover', function(oClickPoint) {
            	if (oCircle.getBounds() == null) {
            		return false;
            	}
            	
            	if (!oCircle.getBounds().contains(oClickPoint.latLng)) {
                    return false;
                }
            	
				if (oViewer.getSearchPath()) {
					oViewer.onSearchPath(oCircle);
				}
            });
    	});
    	
    	// Extend map
    	if (oMapBounds != null) {
    		oGpsCluster.getMap().fitBounds(oMapBounds);
    	}
    },    
    
    // Overide function to be called
    onDisplayPath : function (oStartCircle, oEndCircle) {
    	var oViewer = this;
    	
    	// Clear existing paths
    	if (this.getMapPathes()) {
    		 this.getMapPathes().forEach(function(oMapPath, i) {
	            oMapPath.setMap(null);
	        });
	        this.getMapPathes().splice(0, this.getMapPathes().length);
    	}
        
    	// Draw pathes
    	var oPathPoints = Array();
		var oStartTimestamp = this.getSensorGpsData()[oStartCircle.nodeId].unixtimestamp;
		var oEndTimestamp =  this.getSensorGpsData()[oEndCircle.nodeId].unixtimestamp;
		var oCircleStartId = (oStartCircle.nodeId < oEndCircle.nodeId) ? oStartCircle.nodeId : oEndCircle.nodeId;
		var oCircleEndId = (oStartCircle.nodeId > oEndCircle.nodeId) ? oStartCircle.nodeId : oEndCircle.nodeId;
				
    	var i = 0;
    	for (i = oCircleStartId; i <= oCircleEndId; ++i) {
    		oPathPoints.push(this.getCircles()[i].getCenter());
    	}
    	    	
    	var oMapPath = new google.maps.Polyline({
            path: oPathPoints,
            strokeColor: oViewer.getRandomColor(),
            // strokeColor: oViewer.getPathColor(),
            strokeOpacity: 1,
            // strokeWeight: 2,
            strokeWeight: 5,
            // geodesic: true,
            zIndex: 200
        });
        
        // Set map attributes
        oMapPath.set('pathId', oViewer.getMapPathes().length);
        oMapPath.setMap(oViewer.getMap());
        
        // Specify the timestamp attribute
        oMapPath.set('startTimestamp', oStartTimestamp);
        oMapPath.set('endTimestamp', oEndTimestamp);
        
        // Set click event listener
        google.maps.event.addListener(
            oMapPath, 
            'click', 
            oViewer.onPathClick
        );
        
        oViewer.getMapPathes().push(oMapPath);

        return true;
    },

    onWaitClusters : function() {
    	oViewer = this;
    	oViewer.getCircles().forEach(function(oCircle, i) {
            oCircle.setOptions({
                clickable: false,
                strokeWeight: 0.1,
                fillOpacity: 0.1
            });
        });
    },

    onNormalClusters : function() {
    	oViewer = this;
    	oViewer.getCircle().forEach(function(oCircle, i) {
            oCircle.setOptions({
                clickable: true,
                strokeWeight: oViewer.getClusterStrokeWeight(),
                fillOpacity: 0.5
            });
        });
    },

    // Overide function to be called
    onDisplayPathFromStartCluster : function (oCircle) {
    	var oViewer = this;
        
    	this.setOnQuery(false);
    	
    	return true;
        
        // Blur clusters
        this.onWaitClusters();
        
        // Query pathes that include both start and end locations
        var oCirclesinPath = [];
        
        // Find all available pathes with other circles by
        // finding matching path ids
        this.getCircles().forEach(function(oEndCircle, i) {
        	if (oEndCircle.nodeId == oCircle.nodeId) return false;
        	
        	var oEndIds = oEndCircle.ids;
        	oCircle.ids.forEach(function(oStartId) {
        		if (oEndIds.indexOf(oStartId) > -1) {
        			// Check existing circles in the path
        			var oFound = false;
        			
        			oCirclesinPath.forEach(function(oSearchCircle) {
        				if (oSearchCircle.nodeId == oEndCircle.nodeId) {
        					oFound = true;
        				}
        			});
        			
        			if (oFound == false) {
        				oCirclesinPath.push({
            				circle: oEndCircle,
            				nodeId: oEndCircle.nodeId,
            				pathId: oStartId
            			});
        			}
        		}
        	});
        });
        
        // Specify available clusteres in pathes
        oCircle.setOptions({
            clickable: true,
            strokeWeight: oViewer.getClusterStrokeWeight(),
            fillOpacity: 0.5
        });
        
        oCirclesinPath.forEach(function(oFoundCircleinPath, i) {
        	var oFoundCircle = oFoundCircleinPath.circle;
        	oFoundCircle.setOptions({
                clickable: true,
                strokeWeight: oViewer.getClusterStrokeWeight(),
                fillOpacity: 0.5
            });
        });
        
        this.setOnQuery(false);
        oCircle.circlesInPath = oCirclesinPath;
        
        return;
    },
    
    onPathClick: function(oLocation) {
    	var iPathID = this.get('pathId');
        
        alert(iPathID);
    },
    
    onTimeChange : function(oEventConfig) {
		var oUnixTimestamp = oEventConfig.unixTimestamp;
        if (parseInt(this.getCurrentUnixTimestamp()) != oUnixTimestamp) {
        	this.setCurrentUnixTimestamp(oUnixTimestamp);
        
	        var oViewer = this;
	        var oSetHereCircle = false;
	        
	        return oViewer.onSetHereMarkerbyUnixTimestamp(oUnixTimestamp);
        }
    },
    
    setHereMarkerbyId: function(oId) {
    	var oViewer = this;
    	var oCircle = this.getCircles()[oId];
    	
    	if (oCircle == null) return;
    	
		oViewer.setHerePos(oCircle.getCenter());
        oViewer.setHereCircle(oCircle);
        oViewer.setHereCluster(oCircle.nodeId);
        
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
        	oViewer.getHereMarker().setPosition(oCircle.getCenter());
        }
    },
    
	onSetHereMarkerbyUnixTimestamp : function(oUnixTimestamp) {
        var oViewer = this;
        var oSetHereCircle = false;
        
        this.getCircles().forEach(function(oCircle, i) {
        	if (Number(oCircle.unixTimestamp) >= oUnixTimestamp && oSetHereCircle == false) {
        		oViewer.setHerePos(oCircle.getCenter());
		        oViewer.setHereCircle(oCircle);
		        oViewer.setHereCluster(oCircle.nodeId);
		        
		        if (oViewer.getHereMarker() == null) {
			        oViewer.setHereMarker(new google.maps.Marker({
			            position: oViewer.getHerePos(), 
			            map: oViewer.getMap(),
			            icon: oViewer.getHereMarkerImage(),
			            shadow: oViewer.getMarkerShadowImage(),
			            zIndex: 300
			        }));
			        
			        // oViewer.onDisplayPathFromHereCluster(oCircle);
		        }
		        else {
		        	oViewer.getHereMarker().setPosition(oCircle.getCenter());
		        }
		        oSetHereCircle = true;
        	}
        });
        
        if (oSetHereCircle == false) {
        	oViewer.setHereMarkerbyId(oViewer.getCircles().length-1);
        }
        
        return true;
    },
    
	onSetStartMarkerbyUnixtimestamp : function(oUnixTimestamp) {
        var oViewer = this;
        var oSetStartCircle = false;
        
        this.getCircles().forEach(function(oCircle, i) {
        	if (Number(oCircle.unixTimestamp) >= oUnixTimestamp && oSetStartCircle == false) {
        		oViewer.setStartPos(oCircle.getCenter());
		        oViewer.setStartCircle(oCircle);
		        oViewer.setStartCluster(oCircle.nodeId);
		        
		        if (oViewer.getStartMarker() == null) {
			        oViewer.setStartMarker(new google.maps.Marker({
			            position: oViewer.getStartPos(), 
			            map: oViewer.getMap(),
			            icon: oViewer.getStartMarkerImage(),
			            shadow: oViewer.getMarkerShadowImage()
			        }));
			        
			        oViewer.onDisplayPathFromStartCluster(oCircle);
		        }
		        else {
		        	oViewer.getStartMarker().setPosition(oCircle.getCenter());
		        }
		        oSetStartCircle = true;
        	}
        });
        
        return true;
    },

    /**
     * Operation for user region selection. 
     * 
     * TODO: we may allow multiple region selections, deselection, etc. here
     */
    onSetCluster : function(oCircle) {
        var oViewer = this;
        
        this.setStartPos(oCircle.getCenter());
        this.setStartCircle(oCircle);
        this.setStartCluster(oCircle.nodeId);
        
        if (this.getStartMarker() == null) {
	        
	        
	        this.setStartMarker(new google.maps.Marker({
	            position: this.getStartPos(), 
	            map: this.getMap(),
	            icon: this.getStartMarkerImage(),
	            shadow: this.getMarkerShadowImage()
	        }));
	        
	        this.onDisplayPathFromStartCluster(oCircle);
        }
        else {
        	this.getStartMarker().setPosition(oCircle.getCenter());
        }
        
        return true;
    },

    onSearchPath : function(oEndCircle) {
    	var oViewer = this;
    	
        // Check boundary
        if (this.getOnQuery()) {
            return false;
        }
        
        if (this.getStartMarker() == null) {
        	return false;
        }   
        
        this.setEndPos(oEndCircle.getCenter());
        this.setEndCircle(oEndCircle);
        
        var oViewer = this;
        if (this.getEndMarker() == null) {
            this.setEndMarker(new google.maps.Marker({
                position: oViewer.getEndPos(), 
                map: oViewer.getMap(),
                icon: oViewer.getEndMarkerImage(),
                shadow: oViewer.getMarkerShadowImage()
            }));
        }
        else {
            this.getEndMarker().setPosition(
                this.getEndPos()
            );
        }
        
        // If start flag exists, then run query
        if (this.getStartCircle()) {
        	this.onDisplayPath(this.getStartCircle(), oEndCircle);
        	
        	 // Here we fire the event
            // map path include startTimestamp and endTimestamp attributes 
            // that a caller may parse to retrieve related media objects
        	
        	// XXX: This creates an infinite loop
            this.fireEvent('pathselect', oViewer.getMapPathes());
        }
    }
});