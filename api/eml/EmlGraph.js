/**
 * elog.api.EMLGraph
 * 
 * @author Pil Ho Kim
 * 
 * EML schema viewer APIs
 * 
 * History:
 * 2011/02/17 - First version
 *
 */
Ext.define('Elog.api.eml.EmlGraph', {
    // These are all detected automatically
    // No need to use @extends, @alternateClassName, @mixin, @alias, @singleton
    extend: 'Elog.api.Base',
    requires: [
       'Elog.api.Base',
       'Elog.api.analysis.Cluster'
    ],
    config: {
    	infovis: null
    },
	
    constructor: function(cfg) {
    	this.callParent(cfg);
    	this.initConfig(cfg);

    	return this;
    },
    
    initialize: function(cfg) {
		// this.config.oEmlSearchSelection = cfg.idEMLSearchSelection;
		// this.initialize(cfg);
    },

    getHyperTree: function() {
    	if (typeof this.getInfovis().getHyperTree() == undefined) {
    		this.logError('Hyper tree is not set');
    		return false;
    	}
    	
    	return this.getInfovis().getHyperTree();
    },

    /**
     * Perform the graph search using a keyword
     * 
     *  @param {Object} oEmlGraph
     *  @param {String} sKeyword
     *  @param {Number} iLimit
     *  @param {Number} iDepth 
     */
    queryData : function (cfg) {
    	var oEmlGraph = this;
    	this.getServerQuery({
    		command: this.getCommands().queryGraph,
    		params: {
    			keyword: cfg.params.keyword,
    	        limit: cfg.params.limit,
    	        depth: cfg.params.depth,
    		},    		
    		onSuccess: function(oResult) {
    			oEmlGraph.attachResult(oResult);
				if (oResult.root.results != false) {
                    if (oResult.root.isbase64encoded == 'true') {
                    	sJson = oEmlGraph.base64Decode(oResult.root.results);
                    	oJson = $.parseJSON(sJson);
                    	
                    	var sKeyword = cfg.params.keyword;
                    	if (sKeyword == '') sKeyword = 'root';
                    	
                    	var oJsonRoot = {
                    		"id": "root",
                    		"name": sKeyword,
                    		"children": oJson
                    	};
                    	
                    	oResult.oJsonRoot = oJsonRoot;
                    	
                    	if (typeof cfg.onSuccess != "undefined") {
            				cfg.onSuccess(oResult);
            			}
                    }
                    else {
                    	oEmlGraph.logError('Results returned by the server is not encoded.');
                    	if (typeof cfg.onFail != "undefined") {
                    		cfg.onFail(oResult);
                    	}
                    }
                }
				else {
					oEmlGraph.logStatus('Search found no result.');
					if (typeof cfg.onFail != "undefined") {
	            		cfg.onFail(oResult);
	            	}
				}
            },            
            onFail: function(oResult) {
            	oEmlGraph.logError('Server connection failed. Check the internet connection');
            	if (typeof cfg.onFail != "undefined") {
            		cfg.onFail(oResult);
            	}
            }
    	});
    },

    /**
     * Walk E-model graph from the selected node
     * 
     * @param {Object} cfg
     * @param {Function} cfg.onSuccess
     * @param {Function} cfg.onFail
     * 
     */
    walkGraph: function (cfg) {
    	var oEmlGraph = this;
    	this.getServerQuery({
    		command: this.getCommands().walkGraph,
    		params: {
    			startEnodeId: cfg.targetEvent,
		        limit: cfg.limit,
		        depth: cfg.depth
    		},    		
    		onSuccess: function(oResult) {
				if (oResult.root.results != 'false') {
	                if (oResult.root.isbase64encoded == 'true') {
	                	sJson = oEmlGraph.base64Decode(oResult.root.results);
	                	oJson = $.parseJSON(sJson);
                    	oResult.oJson = oJson;
                    	
	                	if (typeof cfg.onSuccess != "undefined") {
		    				cfg.onSuccess(oResult);
		                }
		            }
	                else {
	                	oEmlGraph.logStatus('Search found no result.');
						if (typeof cfg.onFail != "undefined") {
		            		cfg.onFail(oResult);
		            	}
	                }
    			}
            },            
            onFail: function(oResult) {
            	oEmlGraph.logError('Server connection failed. Check the internet connection');
            	if (typeof cfg.onFail != "undefined") {
            		cfg.onFail(oResult);
            	}
            }
    	});
    }
});

