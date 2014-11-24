/**
 * Elog controller: GraphManager
 * 
 * 
 */
Ext.define('Elog.controller.eml.EmlGraphManager', {
	extend: 'Elog.controller.Base',
    requires: [
       'Elog.controller.Base',
       'Elog.api.eml.EmlGraph',
       'Elog.view.panel.eml.EmlGraphView',
       'Elog.api.analysis.Cluster'
    ],
	config: {
		/**
		 * Including views are optional since necessary components are accessed through refs
		 */
		views: [
	        'Elog.view.panel.eml.EmlGraphView'
		],
		/**
		 * When designing your own GraphManager panel, replace or comment above views config 
		 * and update below IDs to work with your panel
		 */
		refs: {
			emlGraphView: '#idEmlGraphView',
			emlGraphPatternSelector: '#idEmlGraphPatternSelector',
			emlGraphEmlGraphPatternSet: '#idEmlGraphPatternSet',
			emlSearchSlide: '#idEmlSearchSlide',
			emlSearchDepth: '#idEmlSearchDepth',
			emlSearchOption: '#idEmlSearchOption',
			emlSearchSelection: '#idEmlSearchSelection',
			emlEventTimelineView: '#idEmlEventTimelineView',
			emlGraphTimeline: '#idEmlGraphTimeline',
			emlGraphToolbar: '#idEmlGraphToolbar',
			emlGraphSearch: '#idEmlGraphSearch',
			emlGraphInformation: '#idEmlGraphInformation',
			SimileTimeline: '#idElogSimileTimeline',
			infovis: '#idElogInfovis'
		},

		control: {
			emlGraphView: {
				activate: 'onEmlGraphViewInitialize'
				// , show: 'onEmlInitializeGraphView'
				// ,resize: 'onEmlGraphViewResize'
			},
			emlSearchSlide: {
		    	drag: 'onEmlSearchSlideDrag',
		    	change: 'onEmlSearchSlideChange'
		    },
		    emlSearchDepth: {
		    	change: 'onEmlSearchDepthChange',
		    	spin: 'onEmlSearchDepthSpin'
		    },
		    emlGraphSearch: {
		    	tap: 'onEmlGraphSearch',
		    	action: 'onEmlGraphSearch'
		    },
		    emlGraphTimeline: {
		    	// show: 'onEmlGraphTimelineShow',
		    	initdiv: 'onEmlGraphTimelineShow'
		    },
		    SimileTimeline: {
		    	initdiv: 'onSimileTimelineInitialize',
		    	showbubble: 'onSimileTimelineShowBubble'
		    },
		    infovis: {
		    	initdiv: 'onInfovisInitialize',
		    	selectnode: 'onInfovisSelectNode',
		    	dataload: 'onInfovisDataLoad'
		    }
		},
		
		emlGraph: null
	},
	
	onEmlGraphViewInitialize: function(oEmlGraph, e) {
		return this;
	},
	/*
	onEmlGraphViewResize: function(oEmlGraph, e) {
		this.m_GraphTimelineViewer.onResize(e);
        
        // Adjust height
        var iWidth = this.getEmlGraphViewer().getWidth();
        var iHeight = this.getEmlGraphViewer().getHeight();
        
        // Create people list viewer
        this.getEmlGraph().Resize(iWidth, iHeight);
	},
	*/
	onEmlSearchSlideDrag: function (oSlider, oThumb, oValue) {
		var iLimit = oValue;
    	var iDepth = this.getEmlSearchDepth().getValue();
    	
		this.getEmlSearchOption().setValue('Search Limit: '+iLimit+'\n'+'Depth Limit: '+iDepth);
	},
	
	onEmlSearchSlideChange: function (oSlider, oThumb, oNewValue, oOldValue ) {
		var iLimit = oNewValue;
    	var iDepth = this.getEmlSearchDepth().getValue();
    	
		this.getEmlSearchOption().setValue('Search Limit: '+iLimit+'\n'+'Depth Limit: '+iDepth);
    },
	
	onEmlSearchDepthChange: function (oSpinner, oNewValue, oOldValue ) {
		var iLimit = this.getEmlSearchSlide().getValue();
    	var iDepth = oNewValue;
    	
    	this.getEmlSearchSlide().setValue('Search Limit: '+iLimit+'\n'+'Depth Limit: '+iDepth);
	},
	
	onEmlSearchDepthSpin: function (oSpinner, oValue, oDirection ) {
		var iLimit = this.getEmlSearchSlide().getValue();
    	var iDepth = oValue;
    	
    	this.getEmlSearchSlide().setValue('Search Limit: '+iLimit+'\n'+'Depth Limit: '+iDepth);
	},
	
	onEmlGraphSearch: function () {
		var iLimit = this.getEmlSearchSlide().getValue()[0];
    	var sKeyword = this.getEmlGraphSearch().getValue();
    	var iDepth = this.getEmlSearchDepth().getValue();
    	
    	var oController = this;
    	var oInfovis = this.getInfovis();
    	if (sKeyword.length > 0) {
    		this.getEmlGraph().queryData({
    			params: {
    				keyword: sKeyword,
    				limit: iLimit,
    				depth: iDepth
    			},
    			onSuccess: function(oResult) {
    				oController.attachResult(oResult);
    				
    				// oInfovis will fire an event to update timeline
    				oInfovis.loadEmlQueryResult(oResult.oJsonRoot);
    				
                	oController.updateInstruction();
    			},
    			onFail: function(oResult) {
    				oInfovis.clear();
    				
    				oController.attachResult(oResult);
    				oController.updateInstruction();
    			}
    		});	
    		
    	}
	},
	
	onSimileTimelineInitialize: function (oEvent, opts) {
		// Asynchronous call back assignment
        // TODO: Need to check which initialization routine runs first
        // or else this should move to onInfovisInitialize
        var oGraphTimelineViewer = this.getSimileTimeline();
        var oInfovis = this.getInfovis();
        
	    // Load data
	    if (oGraphTimelineViewer.getSourceUrl() != null) {
	    	oGraphTimelineViewer.loadSource(oTimeline.getSourceUrl());
	    }
	},
	
	onSimileTimelineShowBubble: function(oEvent, opts) {
		var oInfovis = this.getInfovis();
		
		if (oInfovis != null) {
			oInfovis.selectData(oEvent.evt.getProperty('node_id'));
		}
	},
	
	onInfovisInitialize: function (oEvent, opts) {
		if (this.getEmlGraph() == null) {
            this.setEmlGraph(new Ext.create('Elog.api.eml.EmlGraph'));
            
            // Perform initial query
            // this.getEmlGraph().QueryData(this.getEmlGraph(), 'elog201105151', 10);
            
            // Set value caller
            var oController = this;
            this.getEmlGraph().getLimit = function() {
            	// Default Max child nodes count
            	return oController.getEmlSearchSlide().getValue();
            }

            /// Should be overiden by a caller to use onSelectNode
            this.getEmlGraph().getDepth = function() {
            	// Default walk distance
            	return oController.getEmlSearchDepth().getValue();
            }
        }
    	
    	this.getEmlGraph().setInfovis(this.getInfovis());
	},
	
    /**
     * Expand the search from the selected node
     * 
     * @param {Object} oEmlGraph
     * @param {Object} oNode
     * 
     */
	onInfovisSelectNode: function (oNode, opts) {
		var oName = oNode.name;
		// Retrieve the e-node ID to span the search over connected other e-nodes.
		if (oNode.data.m_iTargetEvent === undefined) return false;
		var oManager = this;
		var oInfovis = this.getInfovis();
    	if (typeof this.getEmlGraph() != "undefined") {
    		this.getEmlGraph().walkGraph({
				targetEvent: oNode.data.m_iTargetEvent,
				limit: oInfovis.getLimit(),
				depth: oInfovis.getDepth(),
				onSuccess: function(oResult) {
	    			if (typeof oResult.oJson != "undefined") {
		                oInfovis.addNode(oNode, oResult.oJson);
		            }
	    			else {
	    				oManager.logStatus('A selected node has no connected neighborhood. Possibly query failed');
	    				oManager.updateInstruction();
	    			}
				},
				onFail: function() {
					oManager.logError('Server node query expansion failed.');
    				oManager.updateInstruction();
				}
			});
    	}
    	
    	// May add function to modify the timeline
	},
	
	/**
	 * Update timeline when infovis loads a new data
	 */
	onInfovisDataLoad: function (oJson) {
		// Process timeline data
        // Perform hierarchical clustering
        var oCluster = new Ext.create('Elog.api.analysis.Cluster');
        var oClusterData = oCluster.parseJson(oJson);
		var oGraphTimelineViewer = this.getSimileTimeline();
		
		if (oGraphTimelineViewer) {
			oGraphTimelineViewer.loadSourceData(oClusterData, '');
		}
	}
});