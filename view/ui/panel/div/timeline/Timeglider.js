/**
 * A wrapper class for Timeglider (http://timeglider.com/jquery/)
 * 
 * An example to call the eLog server data:
 * 	this.loadSource('http://elog.disi.unitn.it/lab/elog6/server/index.php?keyword=filename&limit=10&depth=3&user_key=your_key&elog_command=API.EML.QueryGraph&callback=Ext.data.JsonP.callback1&_dc=1343134493326');
 *
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.ui.panel.div.timeline.Timeglider', {
 *     	fullscreen:true
 *     });
 */
Ext.define('Elog.view.ui.panel.div.timeline.Timeglider', {
	extend: 'Elog.view.ui.panel.div.timeline.Base',
    xtype: 'elogTimeglider',
    require: [
      'Elog.api.analysis.Cluster',
      'Elog.api.Base'
  	],
    config : {
		name: 'idTimeglider',
		divStyle: 'width: 100%; height: 100%; border: 1px solid #aaa',
		
		/**
		 * Timeglider object
		 */ 
    	timeglider: null,
    	
    	timegliderInit: {
    		// Timeglider configuration to set the minimum zoom level 
    		// min_zoom: 18,
    		// Timeglider configuration to set the maximum zoom level 
    		// max_zoom: 55,
        	/**
        	 * Set the default time zone
        	 */
        	timezone: '+01:00',
        	/**
        	 * Show center line
        	 */
        	show_centerline: true,
        	/**
        	 * Timeglider data source
        	 */
        	data_source: null,
        	show_footer: true,
        	display_zoom_level: true,
        	icon_folder: 'library/timeglider/js/timeglider/icons/'
    	}
    },
	
	init: function () {
		// Resize the height of a HTML DIV element
	    var oElement = this.getDivObject();
	    if (oElement == null) return false;
	    // Set height
	    oElement.style.height = this.element.getHeight() + "px";
	    
	    /*
	    if (this.getTimegliderInit().data_source == null) {
	    	var oInit = this.getTimegliderInit();
	    	
	    	// oInit.data_source = 'http://elog.disi.unitn.it/lab/elog6/library/timeglider/json_tests/idaho.json';
	    	oInit.data_source = 'library/timeglider/json_tests/idaho.json';
	    	this.setTimegliderInit(oInit);
	    }
	    */
	    	
	    var tg_actor = {};	
	    
	    if (this.getTimeglider() != null) {
	    	this.getTimeglider().remove();
	    }
	    
	    this.setTimeglider($("#"+this.getDivId()).timeline(
			this.getTimegliderInit()
		));
		
		this.getTimeglider().resizable({
			stop:function(){ 
				$(this).data("timeline").resize();
			}
		});
	
		tg_actor = this.getTimeglider().data("timeline");
		
		timeglider.methods = {
			zoomIn:function() { tg_actor.zoom("in"); }
		};
		
		// test to bring up filter by default, on load
		setTimeout(function() {
			$(".tg-timeline-legend-bt").trigger("click");
		}, 2000);
		
		
		$("#tags-button").bind("click", function() {
			var txt = $("#tags-input").val();
			tg_actor.filterBy("tags", txt);
		});
	    
	    // Set call back function
		/*
	    var oCaller = this;
	    Timeline.OriginalEventPainter.prototype._showBubble = function(x, y, evt) {
	    	oCaller.fireEvent('showbubble', {
	    		x: x,
	    		y: y,
	    		evt: evt
	    	});
	    }
	    */
		
	},
	
	/**
     * Load source data from URL. 
     * 
     * This URL should return JSON data objects which is directly compatible with 
     * TimeGlider data format.
     * 
     */
    loadSourceUrl : function(sSourceUrl) {
    	 // Below routines are found at TG_Mediator.js#loadTimelineData
        var oMediator = this.getTimeglider().data('timeline').getMediator();
        
        if (oMediator) {
        	return oMediator.loadTimelineData(sSourceUrl);
        }
        
        return false;
    },
    
    /**
     * Load source data
     */
    loadSourceData : function(oData, sSourceUrl) {
    	this.onLoadSource(oData);
    },
    
    /**
     * Timeline query
     * 
     * @param {Object} oData
     * @param {Object} oData.events Events data
     */
    onLoadSource : function(oData) {
    	// Check base64 encoding status
    	/*
    	if (typeof oData.root != "undefind") {
    		if (oData.root[0].isbase64encoded) {
    			var oBase = new Ext.create('Elog.api.analysis.Cluster');
    			var oCluster = new Ext.create('Elog.api.analysis.Cluster');
    			
    			var sJson = oBase.base64Decode(oData.root[0].results);
                var oJson = $.parseJSON(sJson);

            	var oJsonRoot = {
            		"id": "root",
            		"name": "Timeglider",
            		"children": oJson
            	};
            	
    			oData = oCluster.parseJson(oJsonRoot);
    		}
    	}
        */
        
        var oTimeglider = this;
        var oTimegliderData = new Array({
        	id: 'eLogTimelineQueryResult',
        	title: 'eLog Timeline Query Result',
        	description: 'E-model graph query results',
        	timezone: '+02:00',
        	// initial_zoom: '39',
        	events: []
        });
        
        // Convert the format to be compatible with Timeglider JSON format
        oData.events.forEach(function(oEvent, i) {
        	var oStartTime = new Date(oEvent.start);
        	var oEndTime = null;
        	if (oEvent.durationEvent == true) {
        		var oEndTime = new Date(oEvent.end);
        	}
        	
        	oTimegliderData[0].events.push({
        		id: oEvent.node_id,
        		// title: '',
        		// description: '',
        		// high_threshold: 50,
        		// importance: "50",
        		icon:"square_black.png",
        		// click_callback: 'oTimeglider.onClick',
        		startdate: oTimeglider.formatDate(oStartTime),
        		enddate: (oEndTime == null) ? '' : oTimeglider.formatDate(oEndTime),
        		serverEvent: oEvent
        	});
	    });
        
        // Below routines are found at TG_Mediator.js#loadTimelineData
        var oMediator = oTimeglider.getTimeglider().data('timeline').getMediator();
        
        if (oMediator) {
        	oMediator.parseTimelineData(oTimegliderData);
        }
    },
    
    onClick: function() {
    	 var startDate = $(this).attr("startdate");
         var endDate = $(this).attr("enddate");
    },
    
    formatDate: function(oDateTime) {
    	var oDate = oDateTime.getFullYear()+'-'+(oDateTime.getMonth()+1)+'-'+oDateTime.getDate();
    	var oTime = oDateTime.toTimeString().match( /^([0-9]{2}:[0-9]{2}:[0-9]{2})/ )[0];
    	
    	return oDate+' '+oTime;
    }
});