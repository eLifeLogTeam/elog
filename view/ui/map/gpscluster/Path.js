/**
 * Map GPS cluster path view
 * 
 * This shows previous path records between two clusters on the map
 * 
 * @author Pil Ho Kim 
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.ui.map.gpscluster.Path', {
 *     	fullscreen:true
 *     });
 * 
 *
 */
Ext.define('Elog.view.ui.map.gpscluster.Path', {
    extend: 'Elog.view.ui.map.gpscluster.Base',
    xtype: 'elogGpsClusterPath',

    requires: [
      
    ],
    config: {
    	/**
    	 * Pathes included in the query results
    	 */
    	allPathes: [],
		/**
		 * Pathes displayed on the map
		 */
    	mapPathes: [],
    	startCluster: null,
    	endCluster: null,
    	endClusters: [],
		startMarker: null,
		startMarkerImage: null,
		endMarker: null,
		endMarkerImage: null,
		markerShadowImage: null,
		pathColor : '#660000',
		startPos: null,
		startCircle: null,
		onQuery: false,
		endPos: null,
		endCircle: null,
		/**
		 * Configuration whether to show the full path that connects two regions.
		 * If false, then the path ends at both region. If true, it shows the full path route.
		 */
		showFullPath: false,
		/**
		 * Disable reverse geo-coding by default
		 */
		showAddress: false,
		searchPath: false,
    },
    
    /**
     * Initialize
     */
    init: function() {
    	this.callParent();
    	
    	 // Load resources
    	/*
        this.setStartMarkerImage(new google.maps.MarkerImage('resources/images/map_marker_yellow_a.png',
            // This marker is 20 pixels wide by 32 pixels tall.
            new google.maps.Size(32, 32),
            // The origin for this image is 0,0.
            new google.maps.Point(0,0),
            // The anchor for this image is the base of the flagpole at 0,32.
            new google.maps.Point(16, 32)));
        this.setEndMarkerImage(new google.maps.MarkerImage('resources/images/map_marker_green_b.png',
            // This marker is 20 pixels wide by 32 pixels tall.
            new google.maps.Size(32, 32),
            // The origin for this image is 0,0.
            new google.maps.Point(0,0),
            // The anchor for this image is the base of the flagpole at 0,32.
            new google.maps.Point(16, 32)));
        this.setMarkerShadowImage(google.maps.MarkerImage('resources/images/map_marker_shadow.png',
            // The shadow image is larger in the horizontal dimension
            // while the position and offset are the same as for the main image.
            new google.maps.Size(59, 32),
            new google.maps.Point(0,0),
            new google.maps.Point(16, 32)));
        */
    	
        // Create markers
    	this.setStartMarkerImage(new google.maps.MarkerImage(
    	//	"http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png",
    		(typeof this.getMapIconBaseUrl() === "undefined") ? 
    			window.location.origin+"/lab/elog/sdk/library/mapiconscollection-markers/"+"start-race-2.png" :
    			this.getMapIconBaseUrl()+"start-race-2.png",
    		// this.getMapIconBaseUrl()+"start-race-2.png",
    		new google.maps.Size(32, 37),
			new google.maps.Point(0,0),
			new google.maps.Point(16, 37)
    	));
    	this.setEndMarkerImage(new google.maps.MarkerImage(
    	//	"http://www.google.com/intl/en_us/mapfiles/ms/micons/yellow-dot.png",
    		(typeof this.getMapIconBaseUrl() === "undefined") ? 
    			window.location.origin+"/lab/elog/sdk/library/mapiconscollection-markers/"+"finish2.png" :
    			this.getMapIconBaseUrl()+"finish2.png",
    		// this.getMapIconBaseUrl()+"finish2.png",
    		new google.maps.Size(32, 37),
			new google.maps.Point(0,0),
			new google.maps.Point(16, 37)
    	));
    	
    	var oMapViewer = this;
    	var oApiBase = new Elog.api.Base();
    	
    	google.maps.event.addListener(oMapViewer.getMap(), 'zoom_changed', function() {
        	if (oMapViewer.getQueryTask()) {
        		oMapViewer.getQueryTask().delay(oMapViewer.getQueryTaskDelay());
        		
        		oApiBase.setCookie("elogMapZoomLevel", oMapViewer.getMap().getZoom());
        	}
        	
        	// Resize circle
        	// Find all available pathes with other circles by
	        // finding matching path ids
	        oMapViewer.getCircles().forEach(function(oCircle, i) {
	        	oCircle.setRadius(oMapViewer.getMetersbyPixel(10));
	        //	oCircle.setRadius(oMapViewer.getMetersbyPixel(30));
	        });
        	
    	});
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
    onProcessGpsRegion : function(oClusters) {
    	var oGpsPath = this;
    	
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
        
    	// XXX: When using Ext.Base.callParent method, arguments should be transferred as array
    	this.callParent([oClusters]);
    	
    	// Calculate pathes
    	this.getGpsPoints().forEach(function(oPoint) {
    		if ($.isArray(oGpsPath.getAllPathes()[oPoint.id]) == false) {
    			oGpsPath.getAllPathes()[oPoint.id] = [];
    		}
    		oGpsPath.getAllPathes()[oPoint.id].push(oPoint);
    	});
    	
    	oGpsPath.getCircles().forEach(function(oCircle) {
    		/*
    		google.maps.event.addListener(oCircle, 'rightclick', function(oClickPoint) {
    			if (!oCircle.getBounds().contains(oClickPoint.latLng)) {
                    return false;
                }
    			
    			oGpsPath.queryPath(oGpsPath);
	        });
    		*/
    		
    		// Add event listener
            google.maps.event.addListener(oCircle, 'click', function(oClickPoint) {
            	if (oCircle.getBounds() == null) return false;
            	
            	if (!oCircle.getBounds().contains(oClickPoint.latLng)) {
                    return false;
                }
            	
            	oGpsPath.onSetCluster(oCircle);
            	
            	oGpsPath.fireElogEvent({
					eventName: 'timechange', 
					eventConfig: {
						unixTimestamp: oCircle.unixTimestamp,
						caller: oGpsPath,
					}
				});
				
            });
            
            google.maps.event.addListener(oCircle, 'mouseover', function(oClickPoint) {
            	if (!oCircle.getBounds().contains(oClickPoint.latLng)) {
                    return false;
                }
            	
                /*
                oGpsPath.fireElogEvent({
					eventName: 'timechange', 
					eventConfig: {
						unixTimestamp: oCircle.unixTimestamp,
						caller: oGpsPath,
					}
				});
				*/
				
				if (oGpsPath.getSearchPath()) {
					oGpsPath.onSearchPath(oCircle);
				}
            });
    	});
    	
    	// Extract path information
    },

    // Overide function to be called
    onDisplayPath : function (oStartCircle, oEndCircle) {
    	var oGpsPath = this;

    	/*
    	if (typeof oGpsPath.onCallBackPathSelection !== 'undefined') {
        	oGpsPath.onCallBackPathSelection();
        }
        */
    	
    	var oFound = false;
    	var oFoundPathIds = [];
    	if (typeof oStartCircle.circlesInPath !== "undefined") {
    		oStartCircle.circlesInPath.forEach(function(oCircleinPath) {
    			if (oCircleinPath.nodeId == oEndCircle.nodeId) {
    				oFound = true;
    				
    				// Find all pathes between two regions
    				oStartCircle.ids.forEach(function(oPathId) {
    					if (oEndCircle.ids.indexOf(oPathId) > -1) {
    						oFoundPathIds.push(oPathId);
    					}
    				});
    			}
    		});
    	}
    	
    	if (oFound == false) return false;
    	
        // Clear existing paths
    	if (this.getMapPathes()) {
    		 this.getMapPathes().forEach(function(oMapPath, i) {
	            oMapPath.setMap(null);
	        });
	        this.getMapPathes().splice(0, this.getMapPathes().length);
    	}
        
        // Draw pathes
    	oFoundPathIds.forEach(function(oPathId) {
        	var oPathPoints = Array();
			var oStartTimestamp = null;
			var oEndTimestamp = null;
			var oPointTimestamp;
        	
    		oGpsPath.getAllPathes()[oPathId].forEach(function(oPoint) {
    			oPointTimestamp = new Date(oPoint.eml_event_timestamp.replace(/-/g, '/').substring(0, 19));
				
    			// Check whether to display all path points
    			if (oGpsPath.getShowFullPath()) {
    				if (oStartTimestamp == null) {
    					oStartTimestamp =oPointTimestamp;
					}
					else {
						if (oPointTimestamp.valueOf() < oStartTimestamp.valueOf()) {
							oStartTimestamp = oPointTimestamp;
						}
					}
					
					if (oEndTimestamp == null) {
						oEndTimestamp = oPointTimestamp;
					}
					else {
						if (oPointTimestamp.valueOf() > oEndTimestamp.valueOf()) {
							oEndTimestamp = oPointTimestamp;
						}
					}
					
    				oPathPoints.push( 
            	        new google.maps.LatLng(oPoint.latitude, oPoint.longitude)
            	    );
    			}
    			else {
    				// Find the timestamp of a given path between two clusters
    				var oStartMinTimestamp = null;
    				var oStartMaxTimestamp = null;
    				var oEndMinTimestamp = null;
    				var oEndMaxTimestamp = null;
    				
    				oStartCircle.labels.forEach(function(oLabel) {
    					if (oLabel.pathId == oPathId) {
    						if (oStartMinTimestamp == null) {
    							oStartMinTimestamp = oLabel.timestamp;
    						}
    						else {
    							if (oLabel.timestamp.valueOf() < oStartMinTimestamp.valueOf()) {
    								oStartMinTimestamp = oLabel.timestamp;
    							}
    						}
    						
    						if (oStartMaxTimestamp == null) {
    							oStartMaxTimestamp = oLabel.timestamp;
    						}
    						else {
    							if (oLabel.timestamp.valueOf() > oStartMaxTimestamp.valueOf()) {
    								oStartMaxTimestamp = oLabel.timestamp;
    							}
    						}
    					}
    				});
    				
    				oEndCircle.labels.forEach(function(oLabel) {
    					if (oLabel.pathId == oPathId) {
    						if (oEndMinTimestamp == null) {
    							oEndMinTimestamp = oLabel.timestamp;
    						}
    						else {
    							if (oLabel.timestamp.valueOf() < oEndMinTimestamp.valueOf()) {
    								oEndMinTimestamp = oLabel.timestamp;
    							}
    						}
    						
    						if (oEndMaxTimestamp == null) {
    							oEndMaxTimestamp = oLabel.timestamp;
    						}
    						else {
    							if (oLabel.timestamp.valueOf() > oEndMaxTimestamp.valueOf()) {
    								oEndMaxTimestamp = oLabel.timestamp;
    							}
    						}
    					}
    				});
    		        
    				// Check which region is the actual starting position
    				if (oStartMinTimestamp.valueOf() < oEndMinTimestamp.valueOf()) {
    					oStartTimestamp = oStartMinTimestamp;
    					oEndTimestamp = oEndMaxTimestamp;
    				}
    				else {
    					// In this case, the actual start and end regions are reversed
    					// But we don't actually changed the order 
    					// because it may indicate a user first went to there and 
    					// then later got back from there.
    					oStartTimestamp = oEndMinTimestamp;
    					oEndTimestamp = oStartMaxTimestamp;
    				}
    				
    				// Now only display the path within the timestamp
    				
    				if (oPointTimestamp.valueOf() >= oStartTimestamp &&
						oPointTimestamp.valueOf() <= oEndTimestamp) {
    					oPathPoints.push( 
	            	        new google.maps.LatLng(oPoint.latitude, oPoint.longitude)
	            	    );
    				}
    			}
        	});
        	
        	var oMapPath = new google.maps.Polyline({
                path: oPathPoints,
                strokeColor: oGpsPath.getRandomColor(),
                // strokeColor: oGpsPath.getPathColor(),
                strokeOpacity: 1,
                // 2 pixel-wide
                strokeWeight: 2,
                // geodesic: true,
                zIndex: 200
            });
            
            // Set map attributes
            oMapPath.set('pathId', oPathId);
            oMapPath.setMap(oGpsPath.getMap());
            
            // Specify the timestamp attribute
            oMapPath.set('startTimestamp', oStartTimestamp);
            oMapPath.set('endTimestamp', oEndTimestamp);
            
            // Set click event listener
            google.maps.event.addListener(
                oMapPath, 
                'click', 
                oGpsPath.onPathClick
            );
            
            oGpsPath.getMapPathes().push(oMapPath);
        });    

        return true;
    },

    onWaitClusters : function() {
    	oGpsPath = this;
    	oGpsPath.getCircles().forEach(function(oCircle, i) {
            oCircle.setOptions({
                clickable: false,
                strokeWeight: 0.1,
                fillOpacity: 0.1
            });
        });
    },

    onNormalClusters : function() {
    	oGpsPath = this;
    	oGpsPath.getCircle().forEach(function(oCircle, i) {
            oCircle.setOptions({
                clickable: true,
                strokeWeight: oGpsPath.getClusterStrokeWeight(),
                fillOpacity: 0.5
            });
        });
    },

    // Overide function to be called
    onDisplayPathPathFromStartCluster : function (oCircle) {
    	var oGpsPath = this;
        
    	this.setOnQuery(true);
        
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
            strokeWeight: oGpsPath.getClusterStrokeWeight(),
            fillOpacity: 0.5
        });
        
        oCirclesinPath.forEach(function(oFoundCircleinPath, i) {
        	var oFoundCircle = oFoundCircleinPath.circle;
        	oFoundCircle.setOptions({
                clickable: true,
                strokeWeight: oGpsPath.getClusterStrokeWeight(),
                fillOpacity: 0.5
            });
        });
        
        this.setOnQuery(false);
        oCircle.circlesInPath = oCirclesinPath;
        
        /*
        var oID = -1;
        
        // Clear existing paths
        this.getPathArray().forEach(function(oMapPath, i) {
            oMapPath.setMap(null);
        });
        this.getPathArray().splice(0, this.getPathArray().length);
        
        // Clear array
        this.getPathIds().forEach(function(sPathId, i) {
        	oGpsPath.getMapPathes()[sPathId].splice(
                0, 
                oGpsPath.getMapPathes()[sPathId].length
            );
        });
        this.getMapPathes().splice(
            0, 
            this.getMapPathes().length
        );
        this.getPathIds().splice(0, this.getPathIds().length);
        
        if (typeof oResult === "undefined") return;
        else if (typeof oResult.root === "undefined") return;
        
        // else if (oResult.root.length < 1) return;
        
        // Clear clusters
        var oLoopCount = 0;
        var oiBackup;
        var oNewMapCircles = [];
        this.getCircles().forEach(function(oCircle, i) {
            var oFound = false;
            
            // Initialize circle property
            if (typeof oCircle.oPathes === "undefined") {
                oCircle.oPathes = [];
            }
            else oCircle.oPathes.splice(0, oCircle.oPathes.length);
            
            oCircle.oIsStartCluster = false;
            oCircle.oIsEndCluster = false;
            
            if (oCircle.nodeId == oGpsPath.getStartCluster()) {
                oCircle.oIsStartCluster = true;
                oCircle.oIsEndCluster = false;
                
                oNewMapCircles.push(oCircle);
                oFound = true;
            }

            // Read data
            if (typeof oResult.root.length !== "undefined") {
                oResult.root.forEach(function(data, i) {
                    if (oCircle.nodeId == data.end_nodeId) {
                        oFound = true;
                        
                        // Record the path information
                        oCircle.oIsStartCluster = false;
                        oCircle.oIsEndCluster = true;
                        
                        oCircle.oPathes.push({
                            start_nodeId: data.start_nodeId,
                            end_nodeId: data.end_nodeId,
                            path_id: data.path_id,
                            path_start_gps_UTC_timestamp: data.path_start_gps_UTC_timestamp,
                            path_end_gps_UTC_timestamp: data.path_end_gps_UTC_timestamp,
                            time_interval: data.time_interval
                        });
                        
                        oNewMapCircles.push(oCircle);
                    }
                });
            }
            
            if (oFound == false) {
                oCircle.setMap(null);
                // oGpsPath.oMapCircles.splice(i, 1);
            }
            
            oLoopCount = oLoopCount + 1;
            oiBackup = i;
        });
        
        // Clear circles;
        this.getCircles.splice(0, this.getCircles().length);
        this.setCircles(oNewMapCircles);
        
        this.setOnQuery(false);
        this.onNormalClusters();
    	*/
        
        return;
    },
    
    onPathClick: function(oLocation) {
    	var iPathID = this.get('pathId');
        
        alert(iPathID);
    },

    /**
     * Operation for user region selection. 
     * 
     * TODO: we may allow multiple region selections, deselection, etc. here
     */
    onSetCluster : function(oCircle) {
        var oGpsPath = this;
        
        if (this.getStartMarker() == null) {
            this.setStartPos(oCircle.getCenter());
            this.setStartCircle(oCircle);
            this.setStartCluster(oCircle.nodeId);
            
            this.setStartMarker(new google.maps.Marker({
                position: this.getStartPos(), 
                map: this.getMap(),
                icon: this.getStartMarkerImage(),
            //    shadow: this.getMarkerShadowImage()
            }));
            
            this.onDisplayPathPathFromStartCluster(oCircle);
        }
        else if (oCircle.nodeId != this.getStartCircle().nodeId) {
            this.setEndPos(oCircle.getCenter());
            this.setEndCircle(oCircle);
            
            if (this.getEndMarker() == null) {
                this.setEndMarker(new google.maps.Marker({
                    position: this.getEndPos(), 
                    map: this.getMap(),
                    icon: this.getEndMarkerImage(),
                //    shadow: this.getMarkerShadowImage()
                }));
            }  
            else {
                // Remove oEndMarker
                this.getEndMarker().setPosition(this.getEndPos());
            }
            
            // If defined, run callback function
            /*
            if (typeof this.onCallBackPathSelection !== 'undefined') {
                this.onCallBackPathSelection(this);
            }
            */
            
            // Here we fire the event
            // map path include startTimestamp and endTimestamp attributes 
            // that a caller may parse to retrieve related media objects
            this.fireEvent('pathselect', oGpsPath.getMapPathes());
        }
    },

    onSearchPath : function(oEndCircle) {
        // Check boundary
        if (this.getOnQuery()) {
            return false;
        }
        
        if (this.getStartMarker() == null) {
        	return false;
        }   
        
        this.setEndPos(oEndCircle.getCenter());
        this.setEndCircle(oEndCircle);
        
        var oGpsPath = this;
        if (this.getEndMarker() == null) {
            this.setEndMarker(new google.maps.Marker({
                position: oGpsPath.getEndPos(), 
                map: oGpsPath.getMap(),
                icon: oGpsPath.getEndMarkerImage(),
            //    shadow: oGpsPath.getMarkerShadowImage()
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
        }
    },
    

    getRandomColor : function()
    {
        var rint = Math.round(0xffffff * Math.random());
        
        return ('#0' + rint.toString(16)).replace(/^#0([0-9a-f]{6})$/i, '#$1');
    }

});