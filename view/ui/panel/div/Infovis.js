/**
 * Infovis viewer
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.ui.panel.div.Infovis', {
 *     	fullscreen:true
 *     });
 */
Ext.define('Elog.view.ui.panel.div.Infovis', {
    extend: 'Elog.view.ui.panel.div.Base',
    xtype: 'elogInfovis',
    config : {
		name: 'idInfovis',
    	hyperTree: null,
    	limit: 5,
    	depth: 2,
    	data: null,
    	listeners: {
    		resize: function(oContainer, opts) {
    			this.onResize();
    		}
    	}
    },
	
    init: function() {
        //init Hypertree
    	var oInfovis = this;
    	var oHyperTree = new $jit.Hypertree({
          //id of the visualization container
          injectInto: oInfovis.getDivId(),
          //Enable zooming and panning  
          //by scrolling and DnD  
          Navigation: {  
            enable: true,  
            panning: true,  
            zooming: 10 //zoom speed. higher is more sensible  
          }, 
          //canvas width and height
          width: oInfovis.element.getWidth(),
          height: oInfovis.element.getHeight(),
          //Change node and edge styles such as
          //color, width and dimensions.
          Node: {
              dim: 6,
              color: "#f00"
        	  // color: '#ddeeff'
          },
          Edge: {
              lineWidth: 1.5,
              color: "#088"
          },
          Margin: {  
    		  top: 25,  
    		  left: 25,  
    		  right: 25,  
    		  bottom: 25  
          }, 
          onBeforeCompute: function(node){
              // Log.write("centering");
          },
          //Add tooltips  
          Tips: {  
        	  enable: true,  
        	  onShow: function(tip, node) {  
        		  var data = node.data;  
    			  var html = "";
    			  
    			  if("m_sTargetData" in data) {  
    				  html += "<div class=\"tip-title\">" + data.m_sTargetData + "</div>";   
    			  }
    			  if("m_sRelationshipData" in data) {  
    				  html += "<b>Relation:</b> " + data.m_sRelationshipData;  
    			  }  
    			  
    			  tip.innerHTML = html;
        	  }  
          },
          //Attach event handlers and add text to the
          //labels. This method is only triggered on label
          //creation
          onCreateLabel: function(domElement, node){
        	  if (node.data && node.data.m_sTargetData) {
        		  domElement.innerHTML = '<center>'+node.name+'<br>'+node.data.m_sTargetData+'</center>';
        	  }
        	  else {
        		  domElement.innerHTML = '<center>'+node.name+'</center>';
        	  }
              
              $jit.util.addEvent(domElement, 'click', function () {
            	  oInfovis.getHyperTree().onClick(node.id, {
                      onComplete: function() {
                    	  oInfovis.getHyperTree().controller.onComplete();
                      }
                  });
              });
          },
          onBeforePlotLine: function(adj) {
        	  if (adj.nodeFrom.selected && adj.nodeTo.selected) {  
                  adj.data.$color = "#eed";  
                  adj.data.$lineWidth = 3;  
              }  
              else {  
                  delete adj.data.$color;  
                  delete adj.data.$lineWidth;  
              }  
          },
          //Change node styles when labels are placed
          //or moved.
          onPlaceLabel: function(domElement, node){
              var style = domElement.style;
              style.display = '';
              style.cursor = 'pointer';
              if (node._depth < 1) {
                  style.fontSize = "0.7em";
                  style.color = "#ddd";
              } else if (node._depth == 1) {
            	  style.fontSize = "0.6em";
                  style.color = "#555";
              } else if (node._depth == 2){
            	  style.fontSize = "0.6em";
                  style.color = "#ddd";
              } else {
                  style.display = 'none';
              }

              var left = parseInt(style.left);
              var w = domElement.offsetWidth;
              style.left = (left - w / 2) + 'px';
          },
          onComplete: function(){
          },
          Events: {
              enable: true,
              onClick: function(oNode, eventInfo, e) {
            	  if (oNode !== undefined && oNode != false) {
            		  oInfovis.fireEvent('selectnode', oNode);
            	  }
              }
          }
        });
    	
    	this.setHyperTree(oHyperTree);
    	
    	return this.getHyperTree();
    },

    clear : function() {
    	if (this.getHyperTree()) {
    		var oData = {};
    		this.getHyperTree().loadJSON(oData);
    		this.getHyperTree().refresh();
    		this.getHyperTree().controller.onComplete();
    	}
    },

    /// Inherited class may override this function to invoke the action on the node click event
    onAfterCompute : function() {
    },
    
    /**
     * Load E-model query result. Add some effects and animation
     * 
     */
    loadEmlQueryResult: function (oJson) {
    	// oEmlGraph.LoadData(oEmlGraph, oJson);
    	this.loadData(oJson);
    	
    	// Fade the node and its connections 
    	oNode = this.getHyperTree().graph.getNode("root");
    	oNode.setData('alpha', 0, 'end');  
    	oNode.eachAdjacency(function(adj) {  
    		adj.setData('alpha', 0, 'end');  
        });  
    	this.getHyperTree().fx.animate({  
        	modes: ['node-property:alpha',  
        	        'edge-property:alpha'],  
        	duration: 500  
        }); 
    },
    
    /**
     * Load E-model data into the Graph
     * 
     * @param {Object} oJson
     */
    loadData : function (oJson){ 
    	this.setData(oJson);

    	//load JSON data.
    	oHyperTree = this.getHyperTree();
    	if (oHyperTree == false) return false;
        
        oHyperTree.loadJSON(this.getData());
        oHyperTree.refresh();
        oHyperTree.controller.onComplete();
        
        oHyperTree.op.removeNode('root', {  
        	type: 'fade:seq',  
        	duration: 1000,  
        	hideLabels: false,  
        	transition: $jit.Trans.Quart.easeOut  
    	}); 
        
        // Analyze data
        // oEmlGraph.AnalyzeData(oEmlGraph, oJson);
        this.fireEvent('dataload', oJson);
    },

    /**
     * Expands the graph by adding search results to the selected node.
     * 
     * @param {Object} oEmlGraph
     * @param {Object} oNode
     * @param {Object} oJson
     * 
     */
    addNode : function (oNode, oJson) { 
    	var oJsonRoot = {
    		"id": oNode.id,
    		"name": oNode.name,
    		"children": (oNode.children === undefined) ? oJson : oNode.children.push(oJson)
    	};
    	
    	this.getHyperTree().op.sum(oJsonRoot,{
    		type: "fade:seq",
    		fps: 30,
    		duration: 1000,
    		hideLabels: true,
    		onComplete: function() {
    			
    		}
    	});
    	
    	// oEmlGraph.oHyperTree.refresh();
        // oEmlGraph.oHyperTree.controller.onComplete();
        // oEmlGraph.oHyperTree.onClick(oNode.id);
        
        // Process timeline data
        // Perform hierarchical clustering
        /*
        if (oEmlGraph.onShowTimelineCallBack) {
        	var oCluster = new CEC_API_Cluster();
            var oClusterData = oCluster.parseJSON(oCluster, oJson);
            
            oEmlGraph.onShowTimelineCallBack(oEmlGraph, oClusterData);
        }
        */
    },

    /**
     * Show only selected nodes from the timeline
     * 
     * @param {Object} oEmlGraph
     * @param {Object} sSelectedNodes
     * 
     */
    selectData : function (sSelectedNodes) { 
    	var oSelectedNodes = null;
    	if (typeof sSelectedNodes == "object") {
    		oSelectedNodes = sSelectedNodes.split(",");
    	}
    	else {
    		oSelectedNodes = new Array();
    		oSelectedNodes.push(sSelectedNodes);
    	}
    	
    	//load JSON data
    	var oHyperTree = this.getHyperTree()
    	if (oHyperTree != null && this.getData()) {
    		var oJson = this.getData();
    		var oFilteredJSON = this.filterData(oJson, oSelectedNodes);
    			
    		if (oFilteredJSON === null) {
    			return this.clear();
    		}
    		
    		oHyperTree.loadJSON(oFilteredJSON);
    	    oHyperTree.refresh();
    	    oHyperTree.controller.onComplete();
    	}
    },

    /**
     * From the entire result graph, filter out selected nodes information
     * 
     * @param {Object} oEmlGraph
     * @param {Object} oJson
     * @param {Object} oSelectedNodes
     */
    filterData : function (oJson, oSelectedNodes) { 
    	//load JSON data.
    	var oFiltered = null;
    	var oChildren = new Array();
    	
    	if (oJson.id) {
    		if (oJson.id != "root") {
    			if (oSelectedNodes.indexOf(oJson.id) > -1) {
    				oFiltered = {
    					"id": oJson.id,
    					"name": oJson.name,
    					"data": oJson.data
    				};
    			}
    		}
    		else {
    			oFiltered = {
    				"id": oJson.id,
    				"name": oJson.name,
    				"data": oJson.data
    			};
    		}
    	}
    	
    	if (oJson.children) {
    		if (oSelectedNodes.indexOf(oJson.id) == -1) {
    			for (var i = 0; i < oJson.children.length; ++i) {
    				 var oChildFiltered = this.filterData(oJson.children[i], oSelectedNodes);
    				 if (oChildFiltered !== null) {
    					 if (oFiltered) {
    						 if (oFiltered.children == undefined) {
    							 oFiltered.children = new Array();
    						 }
    						 oFiltered.children.push(oChildFiltered);
    					 }
    				 }
    			}
    		}
    		else {
    			oFiltered.children = oJson.children;
    		}
    	}
    	
    	return oFiltered;
    },
    
	onResize: function() {
		if (this.getHyperTree()) {
			if (this.getData() !== null) {
				this.getHyperTree().canvas.resize(
					this.element.getWidth(),
					this.element.getHeight()
				);
			}
    	}
	}
});