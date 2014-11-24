/**
 * A radius widget that add a circle to a map and centers on a marker.
 *
 * Excerpted from [the Google map cicle resizer example](http://code.google.com/apis/maps/articles/mvcfun.html).
 * 
 * @constructor Build the google radius widget
 */
function RadiusWidget(cfg) {
	this.cfg = cfg;
	
    var circle = new google.maps.Circle({
        clickable: false,
        strokeWeight: 2,
        zIndex: 100
    });
	
	    // Set the distance property value, default to 50km.
	this.set('distance', 1);
	
	// Bind the RadiusWidget bounds property to the circle bounds property.
	this.bindTo('bounds', circle);
	
	// Bind the circle center to the RadiusWidget center property
	circle.bindTo('center', this);
	
	// Bind the circle map to the RadiusWidget map
	circle.bindTo('map', this);
	
	// Bind the circle radius property to the RadiusWidget radius property
	circle.bindTo('radius', this);

    this.addSizer_(); 
}

RadiusWidget.prototype = new google.maps.MVCObject();

/**
 * Update the radius when the distance has changed.
 */
RadiusWidget.prototype.distance_changed = function() {
    this.set('radius', this.get('distance') * 1000);
};

/**
 * Add the sizer marker to the map.
 *
 * @private
 */
RadiusWidget.prototype.addSizer_ = function() {
    var sizer = new google.maps.Marker({
        draggable: true,
        animation: 'drop',
	    title: 'Drag me!'
	});
	
	sizer.bindTo('map', this);
	sizer.bindTo('position', this, 'sizer_position');
	
	var me = this;
	google.maps.event.addListener(sizer, 'drag', function() {
	    // Set the circle distance (radius)
	    me.setDistance();
	});
	
	google.maps.event.addListener(sizer, 'dragend', function() {
		if (typeof me.cfg.caller != "undefined") {
			me.cfg.caller.onDisplayInfo();
		}
    });
};

/**
 * Update the center of the circle and position the sizer back on the line.
 *
 * Position is bound to the DistanceWidget so this is expected to change when
 * the position of the distance widget is changed.
 */
RadiusWidget.prototype.center_changed = function() {
    var bounds = this.get('bounds');

	// Bounds might not always be set so check that it exists first.
	if (bounds) {
	    var lng = bounds.getNorthEast().lng();
	    
	    // Put the sizer at center, right on the circle.
	    var position = new google.maps.LatLng(this.get('center').lat(), lng);
	    this.set('sizer_position', position);
    }
};

/**
 * Calculates the distance between two latlng locations in km.
 * @see http://www.movable-type.co.uk/scripts/latlong.html
 *
 * @param {Object} google.maps.LatLng p1 The first lat lng point.
 * @param {Object} google.maps.LatLng p2 The second lat lng point.
 * @return {Number} The distance between the two points in km.
 * @private
 */
RadiusWidget.prototype.distanceBetweenPoints_ = function(p1, p2) {
    if (!p1 || !p2) {
        return 0;
    }
    
    var R = 6371; // Radius of the Earth in km
    var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
    var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    
    return d;
};


/**
 * Set the distance of the circle based on the position of the sizer.
 */
RadiusWidget.prototype.setDistance = function() {
    // As the sizer is being dragged, its position changes.  Because the
	// RadiusWidget's sizer_position is bound to the sizer's position, it will
	// change as well.
	var pos = this.get('sizer_position');
	var center = this.get('center');
	var distance = this.distanceBetweenPoints_(center, pos);
	
	// Set the distance property for any objects that are bound to it
	this.set('distance', distance);
};

/**
 * Distance widget class: Extension of google.maps.MVCObject()
 * 
 * Note: Need to include Google map Javascript API
 * 
 * @param cfg
 * @returns
 */
function DistanceWidget(cfg) {
    this.set('map', cfg.map);
    this.set('position', cfg.map.getCenter());
    
    if (typeof cfg.caller != "undefined") {
    	cfg.caller.setCenterMarker(new google.maps.Marker({
            draggable: true,
            title: 'Move me!'
        }));
    }
    
    
    // Bind the marker map property to the DistanceWidget map property
    cfg.caller.getCenterMarker().bindTo('map', this);
    
    // Bind the marker position property to the DistanceWidget position
    // property
    cfg.caller.getCenterMarker().bindTo('position', this);
    
    // Create a new radius widget
    var radiusWidget = new RadiusWidget(cfg);
    
    // Bind the radiusWidget map to the DistanceWidget map
    radiusWidget.bindTo('map', this);
    
    // Bind the radiusWidget center to the DistanceWidget position
    radiusWidget.bindTo('center', this, 'position');
    
    // Bind to the radiusWidgets' distance property
    this.bindTo('distance', radiusWidget);
    
    // Bind to the radiusWidgets' bounds property
    this.bindTo('bounds', radiusWidget);
    
    google.maps.event.addListener(cfg.caller.getCenterMarker(), 'dragend', function() {
        // Set the circle distance (radius)
    	if (typeof cfg.caller != "undefined") {
    		 cfg.caller.onDisplayInfo(this);
    	}
    });
}
DistanceWidget.prototype = new google.maps.MVCObject();


/**
 * Map Region Selector class.
 * 
 * This attaches the region selector to google map.
 * A radius widget will appear that displays a circle on a map with a marker to adjust its radius.
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.ui.map.MapRegionSelector', {
 *     	fullscreen:true
 *     });
 * 
 *
 */
Ext.define('Elog.view.ui.map.MapRegionSelector', {
    extend: 'Elog.view.ui.map.Base',
    xtype: 'elogMapRegionSelector',
    
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
       'Ext.data.proxy.LocalStorage'
    ],
    config: {
    	/**
    	 * Circle object to mark the covered areas. Later may support the rectangle region selector
    	 */
    	circle: null,
    	/**
    	 * Circle object stroke line weight in pixels
    	 */
    	circleStrokeWeight: 2,
    	/**
    	 * Status to use the location of a user
    	 */
    	getLocation: true,
    	// XXX: Bug: If useCurrentLocation is set, then map creation failed
        // useCurrentLocation: true,
    	
    	/**
    	 * Google geocorder object for reverse-geocoding
    	 */
        geoCorder: null,
        /**
         * Distance widget object
         */
        distanceWidget: null,
        /**
         * Array to backup GPS query results
         */
		gpsResult: null,
		/**
		 * Array to store GPS LatLng objects in Google Map form
		 */
		gpsLatLng: [],
		/**
		 * Array to store path information
		 */
		pathArray: [],
		/**
		 * Center marker object
		 */
		centerMarker: null,
		/**
		 * Status to show/hide the search bar. Not implemented
		 */
		isSearchHide: false,
		/**
		 * Default range to search from the center. This is the circle radius
		 */
		range: 1, // Default to 1 km radius to search
		/**
		 * Store of searching locations
		 */
		searchLocationStore: null,
		/**
		 * Current location search value
		 */
		searchLocationConfig: null,
		/**
		 * Initial Google map options
		 */
        mapOptions: {
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.HYBRID,
            center: new google.maps.LatLng(46.069, 11.124)
//            center: new google.maps.LatLng(37.51197293833795, 127.0826341645508)
        }
    },
    
    /**
     * Initialize
     */
    init: function() {
    	this.setGeoCorder(new google.maps.Geocoder());
    	
    	this.setSearchLocationStore(Ext.create('Elog.store.LocationStore'));
    	
    	this.readLocationRange();
        this.setMapCenter(new google.maps.LatLng(
    		this.getSearchLocationConfig().latitude, 
    		this.getSearchLocationConfig().longitude)
        );
        
        // this.setMapCenter(new google.maps.LatLng(46.069, 11.124));
//        var oMapCenter = new google.maps.LatLng(37.51197293833795, 127.0826341645508);
        
//        var oSearchDistance = 1; // 1 km
//        var oSearchDistance = oSearchLocationConfig.range; // 1 km
                                                  
        this.getMap().setCenter(this.getMapCenter());
        if (this.getDistanceWidget() == null) {
            this.setDistanceWidget(new DistanceWidget({
            	map: this.getMap(),
            	caller: this // It will transfer the pointer to the this.onDisplayInfo function
            }));
        }
                                                
        google.maps.event.addListener(this.getDistanceWidget(), 'distance_changed', function() {
                // displayInfo(oDistanceWidget);
        });

        google.maps.event.addListener(this.getDistanceWidget(), 'position_changed', function() {
                // displayInfo(oDistanceWidget);
        });
            
//        GetTimeSpanbyGPSLocation(46.069, 11.124, oSearchDistance);
//        GetTimeSpanbyGPSLocation(37.51197293833795, 127.0826341645508, oSearchDistance);
    },

    /**
     * Search the map with a given keyword and center to there if found
     */
    searchMap : function(sAddressKeyword) {
    	if (this.getGeoCoder() == null) {
    		this.setGeoCoder(new google.maps.Geocoder());
    	}
    	
    	var oMap = this;
        this.getGeoCoder().geocode( { 'address': sAddressKeyword}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
            	oMap.getMap().setCenter(results[0].geometry.location);
            	oMap.getCenterMarker().setPosition(results[0].geometry.location);
            	oMap.onDisplayInfo();
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    },
    
    /**
     * Generate random color to paint each path
     */
    random_color : function ()
    {
        var rint = Math.round(0xffffff * Math.random());
        
        return ('#0' + rint.toString(16)).replace(/^#0([0-9a-f]{6})$/i, '#$1');
    },

    /**
     * Remove all pathes on the map
     */
    clearPath : function () {
        for (var i = 0; i < this.getPathArray().length; ++i) {
            var oMapPath = this.getPathArray()[i];
            oMapPath.setMap(null);
        }
        
        delete this.getPathArray();
        this.setPathArray(new Array());
    },

    /**
     * Draw the results from the path query
     */
    onDisplayInfo : function () {
    /*
       var info = document.getElementById('info');
             info.innerHTML = 'Position: ' + widget.get('position') + ', distance: ' +
        widget.get('distance');
     */        
        this.clearPath();
        
        var oDistanceWidget = this.getDistanceWidget();
        
        // SaveLocationInformation
        this.addLocationRange([{
            "latitude":oDistanceWidget.get('position').lat(),
            "longitude":oDistanceWidget.get('position').lng(),
            "range":oDistanceWidget.get('distance')
        }]); 
        
        // Fire an event for a listener to read the data from the server
        this.fireEvent('showinfo', {
    		mapCenter: oDistanceWidget.get('position'),
    		distance: oDistanceWidget.get('distance')
    	});
    },
    
    /**
     * Load data time span data searched by the GPS location
     * 
     * @param {Object} cfg
     * @param {Number} cfg.latitude
     * @param {Number} cfg.longitude
     * @param {Number} cfg.distance Radius to search from the given latitude and longitude
     */
    onProcessGpsData : function (oResult) {
    	var oID = -1;
    	var oLatLng = new Array();
    	
	    delete this.getGpsLatLng();
	    this.setGpsLatLng(new Array());
	
	    // Backup the query result
	    this.setGpsResult(oResult.root);
	    
	    if (oResult) {
	        for (var key = 0; key < oResult.root.length; ++key) {
	            if (oID != oResult.root[key].id) {
	                if (oID != -1) {
	                    var oColor = this.random_color();
	                    var oMapPath = new google.maps.Polyline({
	                        path: oLatLng,
	                        strokeColor: oColor,
	                        strokeOpacity: 1.0,
	                        strokeWeight: 2,
	                        // geodesic: true,
	                        zIndex: 200
	                    });
	                    
	                    // Set map attributes
	                    oMapPath.set('m_iPathID', oID);
	
	                    oMapPath.setMap(this.getMap());
	                    // Set click event listener
	                    google.maps.event.addListener(oMapPath, 'click', function(oLocation) {
	                    	var iPathID = this.get('m_iPathID');
	                        
	                        alert(iPathID);
	                    });
	               
	                    this.getPathArray().push(oMapPath);
	                }
	                delete oLatLng;
	                oLatLng = new Array();
	                oID = oResult.root[key].id;
	            }
	            oLatLng.push(new google.maps.LatLng(oResult.root[key].latitude, oResult.root[key].longitude));
	            this.getGpsLatLng().push(oLatLng[oLatLng.length-1]);
	        }
	
	        if (oID != -1) {
	            var oColor = this.random_color();
	            var oMapPath = new google.maps.Polyline({
	               path: oLatLng,
	               strokeColor: oColor,
	               strokeOpacity: 1.0,
	               strokeWeight: 2
	            });
	            
	            // Set map attributes
	            oMapPath.set('m_iPathID', oID);
	            oMapPath.setMap(this.getMap());
	            // Set click event listener
	            google.maps.event.addListener(oMapPath, 'click', function(oLocation) {
	            	var iPathID = this.get('m_iPathID');
	                
	                alert(iPathID);
	            });
	
	            this.getPathArray().push(oMapPath);
	        }
	    }
    }
});