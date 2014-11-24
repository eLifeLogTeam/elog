/**
 * Map based UI base class. This is the extension of Ext.map class
 * 
 * Any inherited class should define init function to initialize the object. 
 * This is due to the delay to prepare the Google map object that occures after the real initialize event.
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.ui.map.Base', {
 *     	fullscreen:true
 *     });
 *     
 * @author pilhokim
 * 
 */
Ext.define('Elog.view.ui.map.Base', {
    // extend: 'Ext.Container',
    extend: 'Ext.Map',
    mixins: ['Elog.view.ui.Mixin'],
    xtype: 'elogMap',
    config : {
    	// XXX Below URLs were in elog base class
    	mapIconBaseUrl: window.location.origin+"/lab/elog/sdk/library/mapiconscollection-markers/",
	
    	/**
		 * Map center location 
		 */
		mapCenter: new google.maps.LatLng(46.069, 11.124),
		/**
		 * Map boundary information
		 */
		mapBounds: null,
    	/**
    	 * Delayed data query task. This routine will be called by the map events
    	 * Define this function in the init() routine, 
    	 * 	
    	 * Ex)
    	 * 	var oMapViewer = this;
    	 * 	this.setQueryTask(new Ext.create('Ext.util.DelayedTask', function() {
    	 * 		oMapViewer.updateSomething(oMapViewer);
    	 * 	}));
    	 */
    	queryTask : null,
    	/**
    	 * Task delay in milliseconds. 
    	 * This is used to prevent too much frequent updates during the map operation like center change or zoom in&out
    	 */
    	queryTaskDelay: 500, 
    	/**
    	 * Use Openstreetmap image
    	 * @type Boolean
    	 */
    	useOSM: true,
    	/**
    	 * Show search box
    	 * @type Boolean
    	 */
    	showSearchBox: false,
		/**
		 * Initial Google map options
		 */
        mapOptions: {
            zoom: 13,
            // mapTypeId: google.maps.MapTypeId.HYBRID,
            mapTypeId: "OMQ",
            center: new google.maps.LatLng(46.069, 11.124)
//            center: new google.maps.LatLng(37.51197293833795, 127.0826341645508)
        },
	    listeners: {
			initialize: function() {
				
				// Excerpted from http://harrywood.co.uk/maps/examples/google-maps/apiv3.view.html
				// Define OSM map type pointing at the OpenStreetMap tile server
	            this.getMap().mapTypes.set("OSM", new google.maps.ImageMapType({
	                getTileUrl: function(coord, zoom) {
	                    return "http://tile.openstreetmap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
	                },
	                tileSize: new google.maps.Size(256, 256),
	                name: "OpenStreetMap",
	                maxZoom: 18
	            }));
	            // Expand the map type for other tile servers
	            // OpenCycleMap
	            this.getMap().mapTypes.set("OCM", new google.maps.ImageMapType({
	                getTileUrl: function(coord, zoom) {
	                    return "http://tile.opencyclemap.org/cycle/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
	                },
	                tileSize: new google.maps.Size(256, 256),
	                name: "OpenCycleMap",
	                maxZoom: 18
	            }));
	            // OpenCycleMap Transport
	            this.getMap().mapTypes.set("OTM", new google.maps.ImageMapType({
	                getTileUrl: function(coord, zoom) {
	                    return "http://tile.opencyclemap.org/transport/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
	                },
	                tileSize: new google.maps.Size(256, 256),
	                name: "OpenCycleMapTransport",
	                maxZoom: 18
	            }));
	            // MapQuest
	            this.getMap().mapTypes.set("OMQ", new google.maps.ImageMapType({
	                getTileUrl: function(coord, zoom) {
	                    return "http://otile1.mqcdn.com/tiles/1.0.0/osm/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
	                },
	                tileSize: new google.maps.Size(256, 256),
	                name: "MapQuest",
	                maxZoom: 18
	            }));
	            
	            this.setMapConfiguration();
				
			},
        	painted: function() {
        		this.onPainted();
        	}
        }
    },
    
    setMapConfiguration: function() {
    	var oMapConfig = new Object(null);
    	var oApiBase = new Elog.api.Base();
		
    	if (this.getUseOSM()) {
			// oMapConfig.mapTypeId = "OSM";
			oMapConfig.mapTypeId = "OMQ";
		}
		else oMapConfig.mapTypeId = google.maps.MapTypeId.HYBRID;
		
		if (typeof oApiBase.getCookie('elogMapZoomLevel') !== "undefined") {
			oMapConfig.zoom = parseInt(oApiBase.getCookie('elogMapZoomLevel'));
    	}
    	else oMapConfig.zoom = 13;
    	
    	if (typeof oApiBase.getCookie('elogMapCenterLat') !== "undefined" &&
    		typeof oApiBase.getCookie('elogMapCenterLng') !== "undefined") {
			oMapConfig.center = new google.maps.LatLng(
				oApiBase.getCookie('elogMapCenterLat'), 
				oApiBase.getCookie('elogMapCenterLng')
			);
    	}
    	else oMapConfig.center = new google.maps.LatLng(46.069, 11.124);
    	
    	// Set search box configuration
    	// TODO Later implement this function. Refer https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
    	if (this.getShowSearchBox()) {
    		
    	}
    	
    	this.setMapOptions(oMapConfig);
    },
    
    onPainted: function() {
    	var oMap = this.getMap();
    	
    	if (oMap) {
    		var oApiBase = new Elog.api.Base();
    		// If the map is successfully created, then perform the initialization.
    		if (typeof this.init != "undefined") {
    			this.init();
    		}
    		
            // Set map zoom event listener
    		// Query task should be set in this.init() function
            oMapViewer = this;
            google.maps.event.addListener(oMapViewer.getMap(), 'zoom_changed', function() {
            	if (oMapViewer.getQueryTask()) {
            		oMapViewer.getQueryTask().delay(oMapViewer.getQueryTaskDelay());
            		
            		oApiBase.setCookie("elogMapZoomLevel", oMapViewer.getMap().getZoom());
            	}
        	});
            google.maps.event.addListener(oMapViewer.getMap(), 'bounds_changed', function() {
            	if (oMapViewer.getQueryTask()) {
            		oMapViewer.getQueryTask().delay(oMapViewer.getQueryTaskDelay());
            	}
        	});
            google.maps.event.addListener(oMapViewer.getMap(), 'center_changed', function() {
            	if (oMapViewer.getQueryTask()) {
            		oMapViewer.getQueryTask().delay(oMapViewer.getQueryTaskDelay());
            		
            		if (typeof oMapViewer.getMap().getCenter() != "undefined") {
            			if (oMapViewer.getMap().getCenter().lat() != null)
	            			oApiBase.setCookie("elogMapCenterLat", oMapViewer.getMap().getCenter().lat());
	            		if (oMapViewer.getMap().getCenter().lng() != null)
	            			oApiBase.setCookie("elogMapCenterLng", oMapViewer.getMap().getCenter().lng());
            		}
            	}
        	});
            google.maps.event.addListener(oMapViewer.getMap(), 'idle', function() {
            	if (oMapViewer.getQueryTask()) {
            		oMapViewer.getQueryTask().delay(oMapViewer.getQueryTaskDelay());
            	}
        	});
    	}
    },
    
    /**
     * Read the location query from the store
     */
    readLocationRange : function () {
    	 /* Save initial data */
        if (this.getSearchLocationStore().getCount() < 1) {
            var oDefaultLocationConfig = {
                'latitude': 46.069,
                'longitude': 11.124,
                'range': 1 // 1 km
            };
            
            this.getSearchLocationStore().add(oDefaultLocationConfig);
            this.getSearchLocationStore().sync();
            
            this.setSearchLocationConfig(oDefaultLocationConfig);
        }
        else {
        	this.setSearchLocationConfig(this.getSearchLocationStore().getAt(0).data);
        }
    },

    /**
     * Add user location query back to the store
     */
    addLocationRange : function (oUserLocationConfig) {
        this.clearLocationRange();
        
        /* Save initial data */
        this.getSearchLocationStore().add(oUserLocationConfig);
        this.getSearchLocationStore().sync();
        
        this.setSearchLocationConfig(oUserLocationConfig);
    },

    clearLocationRange : function () {
        /* Save initial data */
        this.getSearchLocationStore().data.clear();
    },
    
    /**
     * Get a real-world distance mapped to the given pixel width (ex. 10 pixel)
     * 
     * @param {int} oPixel
     */
    getMetersbyPixel: function (oPixel) {
    	var oMapViewer = this;
        
        // var oDistance = oPixel / oMapViewer.getMap().getProjection().metersToEquatorPixels(1);
    	
    	// Excerpted from http://gis.stackexchange.com/questions/7430/what-ratio-scales-do-google-maps-zoom-levels-correspond-to
    	// Below result value maps to the real-world distance for 256 pixel-width tile converting it to meters by dividing 1000
    	var result = 591657550.500000 / Math.pow( 2, oMapViewer.getMap().getZoom()-1) / 256.0  / 1000 * parseFloat(oPixel);
    
        var oDistance = parseInt(result);
        
        if (oDistance < 1) oDistance = 1;
        
        return oDistance;
    },
});