/**
 * elog.api.GPSTimeRangeViewer
 * 
 * @author Pil Ho Kim
 * 
 * Load GPS data within a selected time region to display on the Google map
 * 
 * History:
 * 2011/01/12 - First version
 *
 */
Ext.define('Elog.api.media.GPSTimeRangeViewer', {
    // These are all detected automatically
    // No need to use @extends, @alternateClassName, @mixin, @alias, @singleton
    extend: 'Elog.api.Base',
    config: {
    	mapMarkers : [],
	    maxMarkerCount : 20
    },
    
    constructor: function(cfg) {
    	this.callParent(cfg);
    	this.initConfig(cfg);
    	
	    this.oMap = cfg.oGoogleMap.getMap();
	    this.oTimeZone = cfg.oTimeZone;
	    
	    if (typeof this.oMap != "undefined") {
	        this.oGoogleMap = this.oMap;
	        // Set map attributes
	        this.oMap.oGPSTimeRangeViewer = this;
	    }
	    
	    return this;
    },
    
    /**
     * Get random color
     */
    getRandomColor : function()
    {
        var rint = Math.round(0xffffff * Math.random());
        
        return ('#0' + rint.toString(16)).replace(/^#0([0-9a-f]{6})$/i, '#$1');
    },

    /**
     * Progress GPS query data
     * 
     * @param {Object} data
     */
    onProcessGPSTimeRegion : function(data) {
    	var oGPSTimeRangeViewer = this;
 //       if (data && data.root && !!data.root.length) {
 //           data = data.root[0];
        if (data && data.root) {
            data = data.root;
            
            if (data.results == 'false') return false;
            
            // Clear existing marker objects        
            this.getMapMarkers().forEach(function(oMarker, i) {
                oMarker.setMap(null);
                delete oMarker;
            });
            this.getMapMarkers().splice(0, this.getMapMarkers().length);
                                    
            // Apply Douglas-Peucker to reduce the number of points
            oPoints = new Array();
            if (typeof data.results.root != 'object') return;
            
            var oUnixTimestampAverage = 0;
            var oGpsCount = 0;
            var oMovingMode = "walk";
            
            data.results.root.forEach(function(oData, i) {
                // Create a new radius widget
            	var oPoint = new google.maps.LatLng(
                    oData.latitude, 
                    oData.longitude
                );
            	oPoint.eml_event_timestamp = oData.eml_event_timestamp;
            	
            	if (oData.hasOwnProperty("unixtimestamp")) {
            		oPoint.unixtimestamp = oData.unixtimestamp;
            		oUnixTimestampAverage += parseInt(oPoint.unixtimestamp);
            		oGpsCount += 1;
            	}
            	
        		oPoints.push(oPoint);
            });
            
            if (oGpsCount > 0) {
            	oUnixTimestampAverage = parseInt(oUnixTimestampAverage/oGpsCount);
            	
            	// Calculate the speed and determine the moving mode
            	var oMovingDistance = 0;
            	var oOldData;
            	
            	oPoints.forEach(function(oData, i) {
            		if (i == 0) {
            			oOldData = oData;
            		}
            		else {
            			oDistance = google.maps.geometry.spherical.computeDistanceBetween(oOldData, oData);
            	
				        // Accumulate distance in meters
            			oMovingDistance += oDistance;
            		}
            	});
            	
            	// Calculate average speed in km/h
            	oMovingSpeed = oMovingDistance / (parseInt(oPoints[oPoints.length-1].unixtimestamp) - parseInt(oPoints[0].unixtimestamp))/ 2000 * 3600;
            	if (oMovingSpeed > 10) {
            		oMovingMode = "drive";
            	}
            }
            
        	if (data.results.root.length > this.getMaxMarkerCount()) {
            	oPoints = this.computeGDouglasPeucker (oPoints, 1);
            }
            
            // Create markers
        	var gpsStartIcon = new google.maps.MarkerImage(
        	//	"http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png",
        		oGPSTimeRangeViewer.getMapIconBaseUrl()+"start-race-2.png",
        		new google.maps.Size(32, 37),
    			new google.maps.Point(0,0),
    			new google.maps.Point(16, 37)
        	);
        	var gpsEndIcon = new google.maps.MarkerImage(
        	//	"http://www.google.com/intl/en_us/mapfiles/ms/micons/yellow-dot.png",
        		oGPSTimeRangeViewer.getMapIconBaseUrl()+"finish2.png",
        		new google.maps.Size(32, 37),
    			new google.maps.Point(0,0),
    			new google.maps.Point(16, 37)
        	);
        	var gpsPointIcon = new google.maps.MarkerImage(
        	//	"http://www.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png",
        		(oMovingMode == "drive") ? 
        			oGPSTimeRangeViewer.getMapIconBaseUrl()+"car.png" :
        			oGPSTimeRangeViewer.getMapIconBaseUrl()+"hiking_noboundary.png",
        		new google.maps.Size(32, 37),
    			new google.maps.Point(0,0),
    			new google.maps.Point(16, 37)
        	);
        	var gpsCameraIcon = new google.maps.MarkerImage(
        	//	"http://www.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png",
        		oGPSTimeRangeViewer.getMapIconBaseUrl()+"photo_cyan.png",
        		new google.maps.Size(32, 37),
    			new google.maps.Point(0,0),
    			new google.maps.Point(16, 37)
        	);
        	
        	var oSelectedTime = new Date(oUnixTimestampAverage*1000);
	    	var oSelectedUnixTime = oSelectedTime.getTime();
	    	
	    	var oMatchingUnixTime = oPoints[0].unixtimestamp*1000;
	    	var oMarkerID = -1;
	    	
        	oPoints.forEach(function(oData, i) {
                // Create a new radius widget
        		if (i == 0) oIcon = gpsStartIcon;
        		else if (i == oPoints.length-1) oIcon = gpsEndIcon;
        		else oIcon = gpsPointIcon;
        		
                var oMarker = new google.maps.Marker({
                    position: oData,
                    clickable: true,
                    map: oGPSTimeRangeViewer.oGoogleMap,
                    zIndex: 
                    	(i == 0 || i == oPoints.length-1) ? 
                    		((i == 0) ? 200 : 199) : 
                    		100,
                    title: oData.eml_event_timestamp,
                    icon: oIcon
                });
                
                oGPSTimeRangeViewer.getMapMarkers().push(oMarker);
                
                // Create a new radius widget
		    	var oUnixTime = oData.unixtimestamp*1000;
		    		
		    	if (Math.abs(oSelectedUnixTime - oMatchingUnixTime) >= Math.abs(oSelectedUnixTime - oUnixTime)) {
		    		oMatchingUnixTime = oUnixTime;
		    		oMarkerID = i;
		    	}
            });
            
            if (oPoints.length > 3 && oGpsCount > 3) {
            	
            	// If found and the time gap is less than 60 seconds threshold
		    	if (Math.abs(oSelectedUnixTime - oMatchingUnixTime) < 60 && oMarkerID >= 0) {
		    		// Change the marker icon
		    		oGPSTimeRangeViewer.getMapMarkers()[oMarkerID].setIcon(gpsCameraIcon);
		    		/*
		    		this.oGoogleMap.setCenter(
		    			oGPSTimeRangeViewer.getMapMarkers()[oMarkerID].getPosition()
		            ); */
		    	}
            }
	    	
        	var oMapPath = new google.maps.Polyline({
                path: oPoints,
                strokeColor: oGPSTimeRangeViewer.getRandomColor(),
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map: oGPSTimeRangeViewer.oGoogleMap,
                // geodesic: true,
                // zIndex: 150
            });
            
            // Set click event listener
            // google.maps.event.addListener(oMapPath, 'click', onPathClick);
            
            // Set center
            oGPSTimeRangeViewer.oGoogleMap.setCenter(
        		new google.maps.LatLng(data.oAvgLat, data.oAvgLng)
            );
            
            // Pan to bound
            oMaxPoint = new google.maps.LatLng(data.oMaxLat, data.oMaxLng);
            oMinPoint = new google.maps.LatLng(data.oMinLat, data.oMinLng);
            
            oLatLngBounds = new google.maps.LatLngBounds(oMaxPoint, oMinPoint);
            oGPSTimeRangeViewer.oGoogleMap.panToBounds(oLatLngBounds);
        }
    },

    /**
     * Set the map center to the selected time
     * 
     * @param {Object} oGPSTimeRangeViewer
     * @param {Object} oCurrentTimestamp
     */
    setCurrentMapTime : function(oCurrentTimestamp) {
    	var redIcon = new google.maps.MarkerImage(
    		//"http://www.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png",
    		this.getMapIconBaseUrl()+"photo_cyan.png",
    		new google.maps.Size(32, 37),
    		new google.maps.Point(0,0),
    		new google.maps.Point(16, 37)
    	);
    		
    	var oMatchingUnixTime = 0;
    	var oSelectedTime = new Date(Date.parse(oCurrentTimestamp));
    	var oSelectedUnixTime = oSelectedTime.getTime();
    	var oMarkerID = -1;
    	
    	this.getMapMarkers().forEach(function(oMarker, i) {
            // Create a new radius widget
    		var oTimestamp = new Date(Date.parse(oMarker.getTitle()));
    		var oUnixTime = oTimestamp.getTime();
    		
    		if (Math.abs(oSelectedUnixTime - oMatchingUnixTime) < Math.abs(oSelectedUnixTime - oUnixTime)) {
    			oMatchingUnixTime = oUnixTime;
    			oMarkerID = i;
    		}
        });
    	
    	// If found and the time gap is less than 60 seconds threshold
    	if (Math.abs(oSelectedUnixTime - oMatchingUnixTime) < 60 && oMarkerID >= 0) {
    		// Change the marker icon
    		oMapMarkers[oMarkerID].setIcon(redIcon);
    		
    		this.oGoogleMap.setCenter(
    			oMapMarkers[oMarkerID].getPosition()
            );
    	}
    },

    /**
     * Clear all map objects
     * 
     * @param {Object} oGPSTimeRangeViewer
     */
    clear : function() {
        // Clear existing marker objects        
        this.getMapMarkers().forEach(function(oMarker, i) {
            oMarker.setMap(null);
            delete oMarker;
        });
        this.getMapMarkers().splice(0, this.getMapMarkers().length);
      
        // Set center
        this.oGoogleMap.setCenter(
    		new google.maps.LatLng(0, 0)
        );
    },

    /**
     * Retrieve geospatial information from the selected time region and time zone
     * 
     * @param {Date} oStartTime
     * @param {Date} oEndTime
     * @param {String} oTimeZone
     * 
     */
    onGPSTimeRangeViewerRefresh : function(oStartUnixtime, oEndUnixtime, oTimeZone) {
    	this.oStartUnixtime = oStartUnixtime;
    	this.oEndUnixtime = oEndUnixtime;
    	oGPSTimeRangeViewer = this;
    	
    	// Register Job
		this.getServerQuery({
    		command: this.getCommands().gpsLoadTimeRange,
    		params: {
    			timeFrom: oStartUnixtime.valueOf()/1000,
                timeTo: oEndUnixtime.valueOf()/1000,
                mediaType: "gps",
                timeZone: oTimeZone
    		},    		
    		onSuccess: function(data) {
    			if (data.root !== undefined) {
            		if (data.root.isbase64encoded == 'true') {
                		sJson = oGPSTimeRangeViewer.base64Decode(data.root.results);
                    	oJson = $.parseJSON(sJson);
                    	data.root.results = oJson;
                    }
            		
            		if (data.root.results == 'false') {
            			oGPSTimeRangeViewer.clear();
            		}
            		else {
            			oGPSTimeRangeViewer.onProcessGPSTimeRegion(data);
            		}
            	}
            },            
            onFail: function(oResult) {
            	
            }
    	});
    },
    
    /**
     * Stack-based Douglas Peucker line simplification routine 
     * returned is a reduced GLatLng array 
     * After code by  Dr. Gary J. Robinson,
     * Environmental Systems Science Centre,
     * University of Reading, Reading, UK
     */
    computeGDouglasPeucker : function (source, kink)
	 /* source[] Input coordinates in GLatLngs 	*/
	 /* kink	in metres, kinks above this depth kept  */
	 /* kink depth is the height of the triangle abc where a-b and b-c are two consecutive line segments */
	 {
	     var	n_source, n_stack, n_dest, start, end, i, sig;    
	     var dev_sqr, max_dev_sqr, band_sqr;
	     var x12, y12, d12, x13, y13, d13, x23, y23, d23;
	     var F = ((Math.PI / 180.0) * 0.5 );
	     var index = new Array(); /* aray of indexes of source points to include in the reduced line */
 		 var sig_start = new Array(); /* indices of start & end of working section */
	     var sig_end = new Array();	
	
	     /* check for simple cases */
	
	     if ( source.length < 3 ) 
	         return(source);    /* one or two points */
	
	     /* more complex case. initialize stack */
	 		
	 	n_source = source.length;
	     band_sqr = kink * 360.0 / (2.0 * Math.PI * 6378137.0);	/* Now in degrees */
	     band_sqr *= band_sqr;
	     n_dest = 0;
	     sig_start[0] = 0;
	     sig_end[0] = n_source-1;
	     n_stack = 1;
	
	     /* while the stack is not empty  ... */
	     while ( n_stack > 0 ){
	     
	         /* ... pop the top-most entries off the stacks */
	
	         start = sig_start[n_stack-1];
	         end = sig_end[n_stack-1];
	         n_stack--;
	
	         if ( (end - start) > 1 ){  /* any intermediate points ? */        
	                     
	                 /* ... yes, so find most deviant intermediate point to
	                        either side of line joining start & end points */                                   
	             
	             x12 = (source[end].lng() - source[start].lng());
	             y12 = (source[end].lat() - source[start].lat());
	             if (Math.abs(x12) > 180.0) 
	                 x12 = 360.0 - Math.abs(x12);
	             x12 *= Math.cos(F * (source[end].lat() + source[start].lat()));/* use avg lat to reduce lng */
	             d12 = (x12*x12) + (y12*y12);
	
	             for ( i = start + 1, sig = start, max_dev_sqr = -1.0; i < end; i++ ){                                    
	
	                 x13 = (source[i].lng() - source[start].lng());
	                 y13 = (source[i].lat() - source[start].lat());
	                 if (Math.abs(x13) > 180.0) 
	                     x13 = 360.0 - Math.abs(x13);
	                 x13 *= Math.cos (F * (source[i].lat() + source[start].lat()));
	                 d13 = (x13*x13) + (y13*y13);
	
	                 x23 = (source[i].lng() - source[end].lng());
	                 y23 = (source[i].lat() - source[end].lat());
	                 if (Math.abs(x23) > 180.0) 
	                     x23 = 360.0 - Math.abs(x23);
	                 x23 *= Math.cos(F * (source[i].lat() + source[end].lat()));
	                 d23 = (x23*x23) + (y23*y23);
	                                 
	                 if ( d13 >= ( d12 + d23 ) )
	                     dev_sqr = d23;
	                 else if ( d23 >= ( d12 + d13 ) )
	                     dev_sqr = d13;
	                 else
	                     dev_sqr = (x13 * y12 - y13 * x12) * (x13 * y12 - y13 * x12) / d12;// solve triangle
	
	                 if ( dev_sqr > max_dev_sqr  ){
	                     sig = i;
	                     max_dev_sqr = dev_sqr;
	                 }
	             }
	
	             if ( max_dev_sqr < band_sqr ){   /* is there a sig. intermediate point ? */
	                 /* ... no, so transfer current start point */
	                 index[n_dest] = start;
	                 n_dest++;
	             }
	             else{
	                 /* ... yes, so push two sub-sections on stack for further processing */
	                 n_stack++;
	                 sig_start[n_stack-1] = sig;
	                 sig_end[n_stack-1] = end;
	                 n_stack++;
	                 sig_start[n_stack-1] = start;
	                 sig_end[n_stack-1] = sig;
	             }
	         }
	         else{
	                 /* ... no intermediate points, so transfer current start point */
	                 index[n_dest] = start;
	                 n_dest++;
	         }
	     }
	
	     /* transfer last point */
	     index[n_dest] = n_source-1;
	     n_dest++;
	
	     /* make return array */
	     var r = new Array();
	     for(var i=0; i < n_dest; i++)
	         r.push(source[index[i]]);
	     return r;
	 }
});