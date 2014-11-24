/**
 * Elog controller: UITimelineManager
 * 
 */
Ext.define('Elog.controller.data.UITimelineManager', {
	extend: 'Elog.controller.data.UIManager',
    requires: [
       'Elog.controller.data.UIManager',
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
		 * When designing your own UITimelineManager panel, replace or comment above views config 
		 * and update below IDs to work with your panel
		 */
		refs: {
			

        },

		control: {
            
		},
	},
    
    /**
     * Simile timeline initialization handler to query initial data to display
     * 
     * @param {Object} oEvent
     * @param {Object} opts
     * @return {Object|Boolean}
     */
    onInitSimileTimeline: function (oEvent, opts) {
    	// Set search call function
    	this.setCurrentSearchFunction({
    		'function' : this.onInitSimileTimeline,
    		'args' : oEvent
    	});
    	
    	var oUtil = Ext.create('Elog.api.analysis.Cluster');
    	var oMedia = Ext.create('Elog.api.media.Base');
		var oController = this;
		
		var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
    	return oMedia.getMediaList({
    		mediaType: 'image',
        	timeFrom: Math.round(oTimeFrom.getTime()/1000), 
        	timeTo: Math.round(oTimeTo.getTime()/1000),
        	onSuccess: function(oResult) {
        		oController.attachResult(oResult.result);
        		
        		var oSimilleTimeline = oController.getSimileTimeline();
    			var oTimeResult = oUtil.parseEvents(oResult);
        		
        		// Set link between two viewer
        		oSimilleTimeline.onLoadSource(oTimeResult);
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
    },
    
    /**
     * Simile tmieline information bubble show event handler
     * 
     * @param {Object} oEvent
     * @param {Object} opts
     */
    onSimileTimelineShowBubble : function (oEvent, opts) {
    	var oController = this;
    	var oThumbnailView = oController.getChildImageThumbnailView();
		var oMedia = Ext.create('Elog.api.media.Base');
		var oTimeFrom = oEvent.evt._start;
		var oTimeTo = oEvent.evt._end;
		
		oController.logStatus('Selected timeline: ['+oTimeFrom+']-['+oTimeTo+']');
		oController.updateInstruction();
    },
    
    /**
     * TimeGlider initialization handler to query initial data to display
     * 
     * @param {Object} oEvent
     * @param {Object} opts
     * @return {Object|Boolean}
     */
    onInitTimeGlider: function (oEvent, opts) {
    	// Set search call function
    	this.setCurrentSearchFunction({
    		'function' : this.onInitTimeGlider,
    		'args' : oEvent
    	});
    	
    	var oTimeGlider = this.getTimeGlider();
    	
    	// Original example
    	/*
    	if (oTimeGlider) {
    		oTimeGlider.loadSourceUrl('library/timeglider/json_tests/idaho.json');
    	}
    	*/
    	
    	// E-log example
    	var oUtil = Ext.create('Elog.api.analysis.Cluster');
    	var oMedia = Ext.create('Elog.api.media.Base');
		var oController = this;
		
		var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
    	return oMedia.getMediaList({
    		mediaType: 'image',
        	timeFrom: Math.round(oTimeFrom.getTime()/1000), 
        	timeTo: Math.round(oTimeTo.getTime()/1000),
        	onSuccess: function(oResult) {
        		oController.attachResult(oResult.result);
        		
        		var oTimeResult = oUtil.parseEvents(oResult);
        		
        		// Set link between two viewer
    			oTimeGlider.onLoadSource(oTimeResult);
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
    },
    
    /**
     * ChapTimeline initialization event handler to query initial data to display
     * 
     * @param {Object} oEvent
     * @param {Object} opts
     * @return {Object|Boolean}
     */
    onInitChapTimeline: function (oEvent, opts) {
    	// Set search call function
    	this.setCurrentSearchFunction({
    		'function' : this.onInitChapTimeline,
    		'args' : oEvent
    	});
    	
    	var oTimeline = this.getChapTimeline();
    	
    	// This is the default example
    	/*
    	if (oTimeline) {
    		// oTimeline.loadSourceUrl('library/timeglider/json_tests/idaho.json');
    	}
    	*/
    	
    	// E-log example
    	var oUtil = Ext.create('Elog.api.analysis.Cluster');
    	var oMedia = Ext.create('Elog.api.media.Base');
		var oController = this;
		
		var oTimeFrom = new Date(this.getStartTime().getValue());
		var oTimeTo = new Date(this.getEndTime().getValue());
		
    	return oMedia.getMediaList({
    		mediaType: 'image',
        	timeFrom: Math.round(oTimeFrom.getTime()/1000), 
        	timeTo: Math.round(oTimeTo.getTime()/1000),
        	onSuccess: function(oResult) {
        		oController.attachResult(oResult.result);
        		
        		var oTimeResult = oUtil.parseEvents(oResult);
        		
        		// Set link between two viewer
        		oTimeline.onLoadSource(oTimeResult);
        	},
        	onFail: function(oResult) {
        		oController.attachResult(oResult.result);
        		oController.updateInstruction();
        	}
        });
    },
    
    
});