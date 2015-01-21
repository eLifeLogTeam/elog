/**
 * Elog controller: UIManager
 * 
 * TODO: renaming elog events as like elogTimeChange 
 * TODO: Test direct event listening between UI elements are doable.
 */
Ext.define('Elog.controller.data.UIManager', {
	extend: 'Elog.controller.Base',
    requires: [
       'Elog.controller.Base',
       'Elog.api.media.GpsManager',
       'Ext.util.Droppable'
    ],
	config: {
		/**
		 * Including views are optional since necessary components are accessed through refs
		 */
		views: [
	        // 'Elog.view.panel.media.sensor.CEPEditor',
		],
		/**
		 * When designing your own UIManager panel, replace or comment above views config 
		 * and update below IDs to work with your panel
		 */
		refs: {
			// Common time slider bar
			childTimeSliderToolbar: '#idChildTimeSliderToolbar',
			childTimeSliderToolbarSetTimeRange: '#idChildTimeSliderToolbarSetTimeRange',
            childTimeSliderToolbarTimeSliderToolbar: '#idChildTimeSliderToolbarTimeSliderToolbar',
            
            startTime: '#idChildTimeSliderToolbarStartTime',
            childTimeSliderToolbarStartTime: '#idChildTimeSliderToolbarStartTime',
            endTime: '#idChildTimeSliderToolbarEndTime',
            childTimeSliderToolbarEndTime: '#idChildTimeSliderToolbarEndTime',
            childTimeSliderToolbarSearch: '#idChildTimeSliderToolbarSearch',
            childTimeSliderToolbarSelectedTime: '#idChildTimeSliderToolbarSelectedTime',
			
			// Timesearch
            setTimeRange: '#idElogSetTimeRange',
            timeRangeSelector: '#idElogTimeRangeSelector',
            timeRangeSelectorTimelineViewer: '#idElogTimeRangeSelectorTimelineViewer',
            selectAllTimeRange: '#idElogSelectAllTimeRange',
        },

		control: {
            childTimeSliderToolbar: {
            	timechange: 'onTimeChange',
            	timerangechange: 'onTimeRangeChange',
            },
            
            childTimeSliderToolbarStartTime: {
            	timerangechange: 'onTimeRangeChange',
            },
            
            childTimeSliderToolbarEndTime: {
            	timerangechange: 'onTimeRangeChange',
            },
            
            childTimeSliderToolbarSearch: {
            	tap: 'onRunSearch',
            },
		},
        routes: {
            'demo/:id': 'showViewById',
            'menu/:id': 'showMenuById',
            '': 'showMenuById'
        },

        /**
         * @cfg {Ext.data.Model} currentDemo The Demo that is currently loaded. This is set whenever showViewById
         * is called and used by functions like onSourceTap to fetch the source code for the current demo.
         */
        currentDemo: undefined,
        
        /**
         * 
         * @cfg The current demo should set this function to be called when the search time range is changed 
         * to perform the data call again. 
         */
        currentSearchFunction: undefined,
        
        currentSetupFunction: undefined,
        
        before: {
        	showViewById: 'onAuthenticate'
        },
		
		sensorCEPManager: null,
		selectedSensors: null,
		timeChangeListeners: [],
		timeRangeChangeListeners: [],
	},

	getSensorManager: function() {
		if (this.getSensorCEPManager() == null) {
			this.setSensorCEPManager(new Ext.create('Elog.api.media.SensorCEPManager'));
		}
		
		return this.getSensorCEPManager();
	},
	
	/**
	 * Rerun the time search
	 */
	onRunSearch: function() {
		// Check existence
    	this.refreshCurrentView();
	},
    
    /**
     * Refresh the current view. This destroys the current view and redraw it.
     * TODO: Refresh should clear existing data
     */
    refreshCurrentView: function () {
    	if (typeof this.getCurrentSearchFunction() != 'undefined') {
    		this.getCurrentSearchFunction()['function'].call(
    			this,
				this.getCurrentSearchFunction()['args']
			);
    	}
    },
    
    /**
     * This routine should be reimplemented in the inherited class.
     * 
     * @param {} oUnixTimestamp
     */
    onTimeChange: function(oEventConfig) {
		var oUnixTimestamp = oEventConfig.unixTimestamp;
    	var oController = this;
    	
    	// Distribute event to all UIs under control.
    	oController.getTimeChangeListeners().forEach(function(oTimeChangeListener) {
    		if (typeof oTimeChangeListener.onTimeChange != "undefined" &&
    			oTimeChangeListener.getItemId() != oEventConfig.caller.getItemId()) {
    			oTimeChangeListener.onTimeChange(oEventConfig);
    		}
    	});
    },
    
    putTimeChangeListener: function(oListener) {
    	var oController = this;
    	var oFound = false;
    	
    	if (oListener == null) return;
    	// Distribute event to all UIs under control.
    	oController.getTimeChangeListeners().forEach(function(oTimeChangeListener) {
    		if (oTimeChangeListener.getItemId() == oListener.getItemId()) {
    			oFound = true;
    		}
    	});
    	
    	if (oFound == true) return;
    	
    	if (typeof oListener.onTimeChange == "undefined") return;
    	
    	oController.getTimeChangeListeners().push(oListener);
    },
    
    /**
     * idChildTimeSliderToolbar is common to all UI. So this does not need to be reimplemented in the inherited class
     */
    onTimeRangeChange: function() {
    	var oController = this;
    	
    	if (typeof oController.getChildTimeSliderToolbar() !== "undefined") {
    		oController.putTimeRangeChangeListener(oController.getChildTimeSliderToolbar());
    	}
    	
    	// Distribute event to all UIs under control.
    	oController.getTimeRangeChangeListeners().forEach(function(oTimeRangeChangeListener) {
    		if (typeof oTimeRangeChangeListener.onTimeRangeChange != "undefined") {
    			oTimeRangeChangeListener.onTimeRangeChange();
    		}
    	});
    },
    
    putTimeRangeChangeListener: function(oListener) {
    	var oController = this;
    	var oFound = false;
    	
    	if (oListener == null) return;
    	
    	// Distribute event to all UIs under control.
    	oController.getTimeRangeChangeListeners().forEach(function(oTimeChangeListener) {
    		if (oTimeChangeListener.constructor.name == oListener.constructor.name) {
    			oFound = true;
    		}
    	});
    	
    	if (oFound == true) return;
    	
    	if (typeof oListener.onTimeChange == "undefined") return;
    	
    	oController.getTimeRangeChangeListeners().push(oListener);
    },
    
    /**
     * Refresh the current view. This destroys the current view and redraw it.
     * TODO: Refresh should clear existing data
     */
    refreshCurrentView: function () {
    	if (typeof this.getCurrentSearchFunction() != 'undefined') {
    		this.getCurrentSearchFunction()['function'].call(
    			this,
				this.getCurrentSearchFunction()['args']
			);
    	}
    },
    
    onAuthenticate: function(action) {
    	var oUserManager = Ext.create('Elog.api.admin.UserManager');
    	
    	if (oUserManager.isLoggedIn()) {
             action.resume();
        }
        else {
         	Ext.Msg.alert('Warning', 'Please sign in to access your lifelogs.', Ext.emptyFn);
		}
         /*
         else {
             this.showLogin();
         }
         */
    },
    
});