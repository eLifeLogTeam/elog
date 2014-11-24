/**
 * # CHAP Timeline wrapper class
 * 
 * A wrapper class for ChapTimeline (http://almende.github.com/chap-links-library/js/timeline/doc/)
 * 
 * This is a HTML5 compatible mobile friendly fast drawing timeline interface.
 * 
 * An example to call the eLog server data:
 * 	this.loadSource('http://elog.disi.unitn.it/lab/elog6/server/index.php?keyword=filename&limit=10&depth=3&user_key=your_key&elog_command=API.EML.QueryGraph&callback=Ext.data.JsonP.callback1&_dc=1343134493326');
 *
 * ## Events
 * * select This occurs when any event in the timeline is selected.
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.ui.panel.div.timeline.ChapTimeline', {
 *     	fullscreen:true
 *     });
 */
Ext.define('Elog.view.ui.panel.div.timeline.ChapTimeline', {
	extend: 'Elog.view.ui.panel.div.timeline.Base',
    xtype: 'elogChapTimeline',
    require: [
      'Elog.api.analysis.Cluster',
      'Elog.api.Base'
  	],
    config : {
		name: 'idChapTimeline',
		divStyle: 'width: 100%; height: 100%; border: 1px solid #aaa',
		
		/**
		 * ChapTimeline object
		 */ 
    	chapTimeline: null,
    	
    	chapTimelineInit: {
        	width: '100%',
        	height: 'auto',
        	style: 'box'
    	}
    },
	
	init: function () {
		// Resize the height of a HTML DIV element
	    var oElement = this.getDivObject();
	    if (oElement == null) return false;
	    // Set height
	    oElement.style.height = this.element.getHeight() + "px";
	    
	    this.setChapTimeline(
    		new links.Timeline(this.getDivObject())
		);
	    
	    this.getChapTimeline().draw([], this.getChapTimelineInit());
	},

    /**
     * Load source data
     */
    loadSourceData : function(oData, sSourceUrl) {
    	this.onLoadSource(oData);
    },
    
    /**
     * Timeline query
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
            		"name": "ChapTimeline",
            		"children": oJson
            	};
            	
    			oData = oCluster.parseJson(oJsonRoot);
    		}
    	}
        */
        
        var oChapTimeline = this;
        var oChapTimelineData = new Array();
        
        // Convert the format to be compatible with ChapTimeline JSON format
        oData.events.forEach(function(oEvent, i) {
        	var oStartTime = new Date(oEvent.start);
        	var oEndTime = null;
        	if (oEvent.durationEvent == true) {
        		var oEndTime = new Date(oEvent.end);
        	}
        	
        	if (oEndTime == null) {
        		oChapTimelineData.push({
            		start: oStartTime,
            		content: oStartTime,
            		serverEvent: oEvent
            	});
        	}
        	else {
        		oChapTimelineData.push({
            		start: oStartTime,
            		end: oEndTime,
            		content: oStartTime,
            		serverEvent: oEvent
            	});
        	}
	    });
        
        this.getChapTimeline().setData(oChapTimelineData);
        // this.getChapTimeline().draw(oChapTimelineData, this.getChapTimelineInit());
        
        // Set listener
        // We may register further events types 
        // See http://almende.github.com/chap-links-library/js/timeline/doc/#Events
        // One problem is that we can't find a way to make this event function independent 
        // since the event caller and relationships with its caller is not clear
        links.events.addListener( this.getChapTimeline(), 'select', function() {
        	var sel = oChapTimeline.getChapTimeline().getSelection();
    		if (sel.length) {
    			if (sel[0].row != undefined) {
    				var row = sel[0].row;
    				oChapTimeline.fireEvent('select', row);
    			}
    		}
        });
    }
});