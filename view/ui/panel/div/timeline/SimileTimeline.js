/**
 * A wrapper class for Simile Timeline widget (http://www.simile-widgets.org/timeline/)
 * 
 * XXX: Original Timeline does not support touch inputs since it was developed long time ago.
 * XXX: Currently it is fetched using http://code.google.com/p/simile-widgets/issues/detail?id=278 
 * XXX: But it only support touchstart and touchmove events. And it is not working well to invoke the showbubble event
 * 
 * TODO: Later get back to this topic to support more natural touch interfaces. 
 * May use Elog.view.ui.panel.div.Base touch inputs as the wrapper class 
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.ui.panel.div.timeline.SimileTimeline', {
 *     	fullscreen:true
 *     });
 */
Ext.define('Elog.view.ui.panel.div.timeline.SimileTimeline', {
    extend: 'Elog.view.ui.panel.div.timeline.Base',
    xtype: 'elogSimileTimeline',
    config : {
		name: 'idEmlGraphTimeline',
		// divStyle: 'width: 100%; height: 100%; border: 1px solid #aaa',
		divClass: 'timeline-default',
    	eventSource: null,
    	timelineTheme: null,
    	// When loading the data, it automatically adjust the max min time span
    	autoTimespanAdjust: true,
    	/**
    	 * Control paramet to set the initial timeline displaying location
    	 * 
    	 * {'start', 'middle', 'end', 'manual'}
    	 * 
    	 * When this is set to 'manual', then use timeCenter value to set the center
    	 */
    	bandAdjustMode: 'start',
    	timeCenter: null,
    	/**
    	 * If the timezone is set (GMT+/-hour, ex. 'GMT+1:00'), it is fixed to there. Or else it uses the client time zone
    	 * @type 
    	 */
    	timeZone: null, 
    	bandWidth: null,
    	bandInfos: null,
    	timeline: null
    },
	
	init: function () {
		// Resize the height of a HTML DIV element
	    var oElement = this.getDivObject();
	    if (oElement == null) return false;
	    // Set height
	    oElement.style.height = this.element.getHeight() + "px";
	    
	    // Init timeline configuration
		this.setEventSource(new Timeline.DefaultEventSource());
	   
	    this.setTimelineTheme(Timeline.ClassicTheme.create());
	    this.getTimelineTheme().event.bubble.width = 250;
	    
	    // this.getTimelineTheme().timeline_start = new Date(Date.UTC(2010, 7, 1));
	    // this.getTimelineTheme().timeline_stop  = new Date(Date.UTC(2010, 12, 31));
	
	    // Disable loading _history__.html error
	    SimileAjax.History.enabled = false;
	    
	    if (this.getBandInfos() == null) {
	    	this.setBandInfos(new Array());
	    }
	    
	    if (this.getBandWidth() !== null) {
	    	if (typeof this.getBandWidth().length !== "undefined") {
	    		if (this.getBandWidth().length > 0 && typeof this.getBandWidth()[0].intervalUnit !== "undefined") {
	    			for (var i = 0; i < this.getBandWidth().length; ++i) {
	    	    		var oBand = this.getBandWidth()[i];
	    	    		var oBandInfo = Timeline.createBandInfo({
	    	                eventSource:    this.getEventSource(),
	    	                width:          oBand.width,
	    	                date:           "Oct 4 2010 11:00:00 GMT",
	    	                intervalUnit:   oBand.intervalUnit, 
	    	                intervalPixels: 100+i*1.5,
	    	                timeZone:       Number((this.getTimeZone() == null) ? this.getClientTimeZone('') : this.getTimeZone()),
	    	                theme:          this.getTimelineTheme(),
	    	                overview: 		oBand.overview
	    	            });
	    	    		
	    	    		this.getBandInfos().push(oBandInfo);
	    	    	}
	    		}
	    		else if (this.getBandWidth().length >= 2) {
	    			this.setBandInfos([
		   		        Timeline.createBandInfo({
		   		            eventSource:    this.getEventSource(),
		   		            width:          this.getBandWidth()[0],
		   		            date:           "Oct 4 2010 11:00:00 GMT",
		   		            intervalUnit:   Timeline.DateTime.SECOND, 
		   		            intervalPixels: 50,
		   		            timeZone:       Number((this.getTimeZone() == null) ? this.getClientTimeZone('') : this.getTimeZone()),
		   		            theme:          this.getTimelineTheme()
		   		        }),
		   		        Timeline.createBandInfo({
		   		            overview:       true,
		   		            eventSource:    this.getEventSource(),
		   		            width:          this.getBandWidth()[1], 
		   		            date:           "Oct 4 2010 11:00:00 GMT",
		   		            intervalUnit:   Timeline.DateTime.MINUTE, 
		   		            intervalPixels: 100,
		   		            timeZone:       Number((this.getTimeZone() == null) ? this.getClientTimeZone('') : this.getTimeZone()),
		   		            theme:          this.getTimelineTheme()
		   		        }),
		   		        Timeline.createBandInfo({
		   		            overview:       true,
		   		            eventSource:    this.getEventSource(),
		   		            width:          this.getBandWidth()[2], 
		   		            date:           "Oct 4 2010 11:00:00 GMT",
		   		            intervalUnit:   Timeline.DateTime.HOUR, 
		   		            intervalPixels: 150,
		   		            timeZone:       Number((this.getTimeZone() == null) ? this.getClientTimeZone('') : this.getTimeZone()),
		   		            theme:          this.getTimelineTheme()
		   		        }),
		   		        Timeline.createBandInfo({
		   		            overview:       true,
		   		            eventSource:    this.getEventSource(),
		   		            width:          this.getBandWidth()[2], 
		   		            date:           "Oct 4 2010 11:00:00 GMT",
		   		            intervalUnit:   Timeline.DateTime.DAY, 
		   		            intervalPixels: 200,
		   		            timeZone:       Number((this.getTimeZone() == null) ? this.getClientTimeZone('') : this.getTimeZone()),
		   		            theme:          this.getTimelineTheme()
		   		        })
		   	        ]);
	    		}
	    		else {
	    			this.logError('Band width info should contain more than 3 definitinos');
	    			return false;
	    		}
	    	}
	    	else {
	    		this.logError('Band width information should be an array');
	    		return false;
	    	}
	    }
	    else {
	        this.setBandInfos([
		        Timeline.createBandInfo({
		            eventSource:    this.getEventSource(),
		            width:          "70%", 
		            date:           "Oct 4 2010 11:00:00 GMT",
		            intervalUnit:   Timeline.DateTime.MINUTE, 
		            intervalPixels: 50,
		            timeZone:       Number((this.getTimeZone() == null) ? this.getClientTimeZone('') : this.getTimeZone()),
		            theme:          this.getTimelineTheme(),
		            zoomIndex:      7,
		            zoomSteps:      new Array(
		              {pixelsPerInterval: 100,  unit: Timeline.DateTime.SECOND},
		              {pixelsPerInterval:  50,  unit: Timeline.DateTime.SECOND},
		              {pixelsPerInterval: 500,  unit: Timeline.DateTime.MINUTE},
		              {pixelsPerInterval: 400,  unit: Timeline.DateTime.MINUTE},
		              {pixelsPerInterval: 300,  unit: Timeline.DateTime.MINUTE},
		              {pixelsPerInterval: 200,  unit: Timeline.DateTime.MINUTE},
		              {pixelsPerInterval: 100,  unit: Timeline.DateTime.MINUTE},
		              {pixelsPerInterval: 50,  unit: Timeline.DateTime.MINUTE} // DEFAULT zoomIndex
		            )
		        }),
   		        Timeline.createBandInfo({
   		            overview:       true,
   		            eventSource:    this.getEventSource(),
		            width:          "10%", 
   		            date:           "Oct 4 2010 11:00:00 GMT",
   		            intervalUnit:   Timeline.DateTime.HOUR, 
   		            intervalPixels: 200,
   		            timeZone:       Number((this.getTimeZone() == null) ? this.getClientTimeZone('') : this.getTimeZone()),
   		            theme:          this.getTimelineTheme()
   		        }),
   		        Timeline.createBandInfo({
   		            overview:       true,
   		            eventSource:    this.getEventSource(),
		            width:          "10%", 
   		            date:           "Oct 4 2010 11:00:00 GMT",
   		            intervalUnit:   Timeline.DateTime.DAY, 
   		            intervalPixels: 300,
   		            timeZone:       Number((this.getTimeZone() == null) ? this.getClientTimeZone('') : this.getTimeZone()),
   		            theme:          this.getTimelineTheme()
   		        }),
		        Timeline.createBandInfo({
		            overview:       true,
		            eventSource:    this.getEventSource(),
		            width:          "10%", 
		            date:           "Oct 4 2010 11:00:00 GMT",
		            intervalUnit:   Timeline.DateTime.MONTH, 
		            intervalPixels: 200,
		            timeZone:       Number((this.getTimeZone() == null) ? this.getClientTimeZone('') : this.getTimeZone()),
		            theme:          this.getTimelineTheme()
		        })
	        ]);
	        
	        /*
	         * this.setBandInfos([
		        Timeline.createBandInfo({
		            eventSource:    this.getEventSource(),
		            width:          "70%",
		            date:           "Oct 4 2010 11:00:00 GMT",
		            intervalUnit:   Timeline.DateTime.SECOND, 
		            intervalPixels: 50,
		            timeZone:       Number((this.getTimeZone() == null) ? this.getClientTimeZone('') : this.getTimeZone()),
		            theme:          this.getTimelineTheme()
		        }),
		        Timeline.createBandInfo({
		            overview:       true,
		            eventSource:    this.getEventSource(),
		            width:          "10%", 
		            date:           "Oct 4 2010 11:00:00 GMT",
		            intervalUnit:   Timeline.DateTime.MINUTE, 
		            intervalPixels: 100,
		            timeZone:       Number((this.getTimeZone() == null) ? this.getClientTimeZone('') : this.getTimeZone()),
		            theme:          this.getTimelineTheme()
		        }),
		        Timeline.createBandInfo({
		            overview:       true,
		            eventSource:    this.getEventSource(),
		            width:          "10%", 
		            date:           "Oct 4 2010 11:00:00 GMT",
		            intervalUnit:   Timeline.DateTime.HOUR, 
		            intervalPixels: 150,
		            timeZone:       Number((this.getTimeZone() == null) ? this.getClientTimeZone('') : this.getTimeZone()),
		            theme:          this.getTimelineTheme()
		        }),
		        Timeline.createBandInfo({
		            overview:       true,
		            eventSource:    this.getEventSource(),
		            width:          "10%", 
		            date:           "Oct 4 2010 11:00:00 GMT",
		            intervalUnit:   Timeline.DateTime.DAY, 
		            intervalPixels: 200,
		            timeZone:       Number((this.getTimeZone() == null) ? this.getClientTimeZone('') : this.getTimeZone()),
		            theme:          this.getTimelineTheme()
		        })
	        ]);
	         */
	    }
	    
	    for (i = 1; i < this.getBandInfos().length; ++i) {
	    	this.getBandInfos()[i].syncWith = i-1;
	    	this.getBandInfos()[i].highlight = true;
	    }   
	    
	    var oTimeline = Timeline.create(
    		oElement, 
	        this.getBandInfos()
	    );
	    this.setTimeline(oTimeline);
	                
	    // Set attributes
	    this.getTimeline().oViewer = this;
	    
	    // Change theme
	    var oTimelineObject = this.getDivObject();
	    
	    if (oTimelineObject == null) {
	    	this.logError('Html DIV element is not created');
	    	return false;
	    }
	    
	    oTimelineObject.className = (oTimelineObject.className.indexOf('dark-theme') != -1) ? 
    		oTimelineObject.className.replace('dark-theme', '') : 
			oTimelineObject.className += ' dark-theme';
	    
	    // Set call back function
	    var oCaller = this;
	    Timeline.OriginalEventPainter.prototype._showBubble = function(x, y, evt) {
	    	oCaller.fireEvent('showbubble', {
	    		x: x,
	    		y: y,
	    		evt: evt
	    	});
	    }
	    
	    if (this.getTimeCenter() != null) {
	    	this.setCenterTime(this.getTimeCenter());
	    }
	},

    /**
     * Process resize event
     */
    onResize : function(e) {
        alert(e);
    },

    /**
     * Set time band
     */
    setCenterTime : function(oTimeCenter) {
        var oTimelineShowTime = new Date(oTimeCenter);
        this.getTimeline()._bands.forEach(function(oBand, i) {
            oBand.setCenterVisibleDate(oTimelineShowTime);
            oBand.scrollToCenter(oTimelineShowTime);
        });
    },

    /**
     * Load source data
     */
    loadSourceData : function(oData, sSourceUrl) {
    	if (this.getEventSource() != null) {
    		this.getEventSource().clear();
    	}
    	else this.setEventSource(new Timeline.DefaultEventSource());
    	
    	var oEventSource = this.getEventSource();
        
        // Timeline.loadJson does not support JSONP. So it is replaced with $.ajax
        // July 7th, 2011, Pil Ho
        
        if (typeof oData.events == undefined) {
        	if (typeof oData.root != undefined) {
        		oData.events = oData.root;
        	}
        	else {
        		this.logError('Data does not include events or root entities');
        		return false;
        	}
        }
        
        this.onLoadSource(oData);
    },
    
    /**
     * Timeline query
     */
    onLoadSource : function(json) {
    	if (this.getEventSource() != null) {
    		this.getEventSource().clear();
    	}
    	else this.setEventSource(new Timeline.DefaultEventSource());
    	var oEventSource = this.getEventSource();
    	
        var oTimelineViewer = this;
	        
	    if (oTimelineViewer.getAutoTimespanAdjust() == true) {
	        var oStartTime = new Date("01/01/2100");
	        var oEndTime = new Date("01/01/1001");
	        
	        json.events.forEach(function(oEvent, i) {
	            oStartTime = (oStartTime > new Date(oEvent.start)) ? 
	                new Date(oEvent.start) : oStartTime;
	            
	            if (oEvent.durationEvent == true) {
	                oEndTime = (oEndTime > new Date(oEvent.end)) ? 
	                    oEndTime : new Date(oEvent.end);
	            }
	            else {
	                oEndTime = (oEndTime > new Date(oEvent.start)) ? 
	                    oEndTime : new Date(oEvent.start);
	            }
	        });
	        
	        if (oStartTime < oEndTime) {
	        	if (typeof oTimelineViewer.getTimeline()._bands != "undefined") {
	        		oTimelineViewer.getTimeline()._bands.forEach(function(oBand, i) {
		                oBand.setMinVisibleDate(oStartTime);
		                oBand.setMaxVisibleDate(oEndTime);
		            });
	        	}
	        }
	        
	        if (typeof oTimelineViewer.getTimeline()._bands != "undefined") {
	        	oTimelineViewer.getTimeline()._bands.forEach(function(oBand, i) {
		            if (oTimelineViewer.getBandAdjustMode() == "start") {
		                oBand.setCenterVisibleDate(oStartTime);
		                oBand.scrollToCenter(oStartTime);
		            }
		            else if (oTimelineViewer.getBandAdjustMode() == "middle") {
		            	// This is buggy, should be fixed later
		                oBand.setCenterVisibleDate(Date((oStartTime.getTime()+oEndTime.getTime())/2));
		                oBand.scrollToCenter(Date((oStartTime.getTime()+oEndTime.getTime())/2));
		            }
		            else if (oTimelineViewer.getBandAdjustMode() == "end") {
		                oBand.setCenterVisibleDate(oEndTime);
		                oBand.scrollToCenter(oEndTime);
		            }
		            else if (oTimelineViewer.getBandAdjustMode() == "manual" &&
	            		oTimelineViewer.getTimeCenter() != null ) {
		                oBand.setCenterVisibleDate(oTimelineViewer.getTimeCenter());
		                oBand.scrollToCenter(oTimelineViewer.getTimeCenter());
		            }
		        });
	        }
	    }
	    
        // Be careful to specify url as '.' or else it does not recognize the data
        oEventSource.clear();
        oEventSource.loadJSON(json, '.');
        
        oTimelineViewer.getTimeline().layout();
    },
    
    // Set interaction events since Simile timeline does not support touch devices
    // TODO: May work whether to directly modify Simile Timeline codes or encapsulate at here.
    onTap: function (event, node, options, eOpts) {
    	// alert(this.dump(event, 1));
    },
    
    /**
     * Get start time from the data
     */
    getStartTime : function() {
    	if (this.getEventSource()) {
    		return this.getEventSource().getEarliestDate();
    	}
    	
    	return false;
    },
    
    /**
     * Get end time from the data
     */
    getEndTime : function() {
    	if (this.getEventSource()) {
    		return this.getEventSource().getLatestDate();
    	}
    	
    	return false;
    },
    
    loadData: function(oResult) {
    	var oUtil = Ext.create('Elog.api.analysis.Cluster');
    	var oSimileResult = oUtil.parseEvents(oResult);
		
		// First load same data set for both timeline and thumbnail viewer
		this.onLoadSource(oSimileResult);
    },
    
    onTimeChange : function(oEventConfig) {
		var oUnixTimestamp = oEventConfig.unixTimestamp;
        var oViewer = this;
    	
	    if (parseInt(this.getCurrentUnixTimestamp()) != oUnixTimestamp) {
	    	this.setCurrentUnixTimestamp(oUnixTimestamp);
	        
	        var oCenterDate = new Date(oUnixTimestamp*1000);
	    	
	    	this.setCenterTime(oCenterDate.toString());
        }
    },
    
});