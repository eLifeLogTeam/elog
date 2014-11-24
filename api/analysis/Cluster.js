/**
 * Data clustering class
 * 
 * 
 * * TODO: Speed up figue.agglomerate performance. It works well for small size (< 10000 records) but too slow for big data
 * * TODO: Check http://harthur.github.com/clusterfck/ for comparison
 * 
 */

/**
 * Copy javascript object
 * 
 * Excerpted from http://stackoverflow.com/questions/728360/copying-an-object-in-javascript
 * @param {} obj
 * @return {}
 */
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

Ext.define('Elog.api.analysis.Cluster', {
    extend: 'Elog.api.Base',
    config: {
    	data: null,
    	labels: null,
    	vectors: null,
    	mediaTypes: null
    },
	
    constructor: function(cfg) {
    	this.callParent(cfg);
    	this.initConfig(cfg);

    	return this;
    },
    
    /**
     * Process the data to retrieve timestamped entities
     * 
     * @param oChilds
     * @param oID
     * @param oLabels
     * @param oVectors
     * @returns {Object} label & vector
     */
   getTimeClusterItems : function(oChilds, oID, oLabels, oVectors) {
	   var oEmlCluster = this;
    	oChilds.forEach(function(oChild) {
    		if (oChild.children) {
    			var oResult = oEmlCluster.getTimeClusterItems(oChild.children, (oChild.id) ? oChild.id : null, oLabels, oVectors);
    			
    			oLabels.concat(oResult["label"]);
    			oVectors.concat(oResult["vector"]);
    		}
    		
    		if (oID) {
    			if (oChild.name.search('timestamp') != -1) {
    				var iUnixTimestamp = parseInt(oChild.data.m_sTargetData);
    				
    				if (iUnixTimestamp) {
    					oLabels.push(oID);
    					oVectors.push([iUnixTimestamp]);
    				}
    			}
    		} 
    	});
    	
    	return {
    		"label":oLabels, 
    		"vector" : oVectors
    	};
    },


    /**
     * Collects timestamps of all nodes
     * 
     * @param {Object} oChilds
     * @param {Object} oID
     * @param {Object} oLabels
     * @param {Object} oVectors
     * @returns {Object}
     */
   getEnodeTimes : function(oChilds, oID, oLabels, oVectors) {
	   var oEmlCluster = this;
    	oChilds.forEach(function(oChild) {
    		if (oChild.children) {
    			var oResult = oEmlCluster.getEnodeTimes(oChild.children, (oChild.id) ? oChild.id : null, oLabels, oVectors);
    			
    			oLabels.concat(oResult["label"]);
    			oVectors.concat(oResult["vector"]);
    		}
    		
    		if (oID) {
    			var iUnixTimestamp = Math.round(new Date(oChild.data.m_iTargetUpdateLog.replace(' ','T')+'Z').getTime() / 1000);
    				
    			if (iUnixTimestamp) {
    				oLabels.push(oID);
    				oVectors.push([iUnixTimestamp]);
    			}
    		} 
    	});
    	
    	return {
    		"label":oLabels, 
    		"vector" : oVectors
    	};
    },

    
   /**
    * Agglomerate (hierarchical clustering) events
    * 
    * @param {Object} oEvents
    * @returns {Object} cluster
    */
   parseEvents : function(oEvents) {
	   if (this.getLabels() == null) {
		   this.setLabels(new Array());
	   }
	   if (this.getVectors() == null) {
		   this.setVectors(new Array());
	   }
	   if (this.getMediaTypes() == null) {
		   this.setMediaTypes(new Array());
	   }
        
	   var oLabels = this.getLabels();
	   var oVectors = this.getVectors();
	   var oMediaTypes = this.getMediaTypes();
	   
	   var oClusterResult;
	   var oClusters = null;
	   var oParser = this;
	   
		// Display on the time line
		if (typeof oEvents.count !== "undefined") {
	   		oMediaTypes = Object.keys(oEvents.results);
	   		if ($.isArray(oMediaTypes)) {
	   			oMediaTypes.forEach(function(oMediaType, i) {
		   			var oLabel = new Array();
		   			var oVector = new Array();
		   			
	   				oTables = Object.keys(oEvents.results[oMediaType]);
	   				// Search "root" object from table result object
			 		if ($.isArray(oTables)) {
			    		oTables.forEach(function(oMedia, j) {
			    			if ($.isArray(oEvents.results[oMediaType][oMedia])) {
			    				oEvents.results[oMediaType][oMedia].forEach(function(oEvent, k) {
			    					// oStartDate = new Date(oEvent.lastRecordingTime.replace(/-/g, '/').substring(0, 19));
			    					if (typeof oEvent.utcTimestamp != "undefined") {
			    						oStartDate = new Date(parseInt(oEvent.utcTimestamp)*1000);
			    					}
			    					else {
			    						oStartDate = new Date(parseInt(oEvent.unixtimestamp)*1000);
			    					}
			    					
			    					if (oStartDate) {
			    						// oLabels.push(oMedia);
			    						oLabel.push(k);
			    						oVector.push([Math.round(oStartDate/1000)]);
			    						oMediaTypes.push(oMediaType);
			    					}
			    				});
			    			}
			    		});
			    	}
			    	
			        oClusterResult = figue.agglomerate(
			    		oLabel, 
			    		oVector, 
			    		figue.EUCLIDIAN_DISTANCE,
			    		figue.SINGLE_LINKAGE
			        );
			        
			        var oCluster = oParser.getResultinSimileTimeline(
			        	oClusterResult, 
		        		{
			        		"color" : oParser.getColorLUT()[i],
			        		"mediaType" : oMediaType,
			        		"minDuration" : 60, // Display the duration over 120 seconds,
			        		"granularity" : 120 // Hierarchical classification granulrarity in seconds. A child is clustered if its duration is smaller than the parent by this amount
			        	}
		        	);
			        
			        oLabels = oLabels.concat(oLabel);
			        oVectors = oVectors.concat(oVector);
			        
			        if (oClusters == null) {
			        	oClusters = oCluster;
			        }
			        else {
			        	oClusters["events"] = oClusters["events"].concat(oCluster["events"]);
			        }
	   			});
	   		}
		   		
	   	}
		else {
			oTables = Object.keys(oEvents);
	 		if ($.isArray(oTables)) {
	    		oTables.forEach(function(oMedia, i) {
	    			if ($.isArray(oEvents[oMedia])) {
	    				oEvents[oMedia].forEach(function(oEvent, j) {
	    					// oStartDate = new Date(oEvent.lastRecordingTime.replace(/-/g, '/').substring(0, 19));
	    					// oStartDate = new Date(parseInt(oEvent.utcTimestamp)*1000);
	    					if (typeof oEvent.utcTimestamp != "undefined") {
	    						oStartDate = new Date(parseInt(oEvent.utcTimestamp)*1000);
	    					}
	    					else {
	    						oStartDate = new Date(parseInt(oEvent.unixtimestamp)*1000);
	    					}
	    					
	    					if (oStartDate) {
	    						// oLabels.push(oMedia);
	    						oLabels.push(j);
	    						oVectors.push([Math.round(oStartDate/1000)]);
	    						oMediaTypes.push('1');
	    					}
	    				});
	    			}
	    		});
	    	}
	    	
	    	// TODO: Right now, we don't label different media types here. 
		   // TODO: We may perform agglomerate separately and merge them with different in different colors.
	        oClusterResult = figue.agglomerate(
	    		oLabels, 
	    		oVectors, 
	    		figue.EUCLIDIAN_DISTANCE,
	    		figue.SINGLE_LINKAGE
	        );
	        
	        oClusters = this.getResultinSimileTimeline(
	        	oClusterResult, 
	    		{
	        		"color" : this.getColorLUT()[0],
	        		"mediaType" : "1" // No media type is assigned
	        	}
	    	);
	   }
	    
        this.setData({
        	"label": oLabels,
        	"vector": oVectors,
        	"cluster": oClusters,
        	"mediaTypes": oMediaTypes
        });
        
        return oClusters;
    },

    /**
     * Parse GPS clusters
     * 
     * @param {Object} oEvents
     * @param {Array} oEvents.points
     * @param {Number} oEvents.distance Distance from the GPS recording starting point, ex) "0.03273230853088945"
     * @param {Number} oEvents.elevation Elevation in metersm, ex) "150.563".
     * @param {String} oEvents.eml_event_timestamp GPS timestamp, ex) "2010-11-14 13:40:36.000000"
     * @param {Number} oEvents.id GPS point ID, ex) 1.
     * @param {Number} oEvents.latitude GPS latitude value, ex) 46.0692877
     * @param {Number} oEvents.longitude GPS longitude value, ex) 11.1239102
     *  
     */
    parseGpsClusters : function(oEvents) {
 	   if (this.getLabels() == null) {
 		   this.setLabels(new Array());
 	   }
 	   if (this.getVectors() == null) {
 		   this.setVectors(new Array());
 	   }
         
 	   var oLabels = this.getLabels();
 	   var oVectors = this.getVectors();
 	   var oGpsPoints = oEvents.points;

     	// Display on the time line
     	if ($.isArray(oGpsPoints)) {
     		oGpsPoints.forEach(function(oPoint, i) {
     			// Check data validity
     			if (typeof oPoint.eml_event_timestamp == "undefined") return false;
     			
     			oStartDate = new Date(oPoint.eml_event_timestamp.replace(/-/g, '/').substring(0, 19));
     					
				if (oStartDate) {
					// TODO: Here we use the path id as the label. If not works, then just use the above i, the array index
					// oLabels.push(oPoint.id);
					oLabels.push({
						timestamp: oStartDate,
						pathId: oPoint.id
					});
					
					// Convert the point value to integer
					oVectors.push([parseFloat(oPoint.latitude), parseFloat(oPoint.longitude)]);
				}
     		});
     	}
         
     	/**
     	 * Return format of oRoot calculated using figue.agglomerate
     	 * 
     	 * @param {Object} oRoot
     	 * @param {Array} oRoot.centroid Array[2]
     	 * @param {Number} oRoot.depth, ex) 10
     	 * @param {Number} oRoot.dist, ex) 3.106070507847663
     	 * @param {Number} oRoot.label, ex) -1
     	 * @param {Object} oRoot.left child figue.Node type object. Same like this
     	 * @param {Object} oRoot.right child figue.Node type object. Same like this
     	 * @param {Object} oRoot.size Containing child count
     	 * 
     	 */
         var oRoot = figue.agglomerate(
     		oLabels, 
     		oVectors, 
     		figue.EUCLIDIAN_DISTANCE,
     		figue.SINGLE_LINKAGE
         );
         
         if (oRoot) {
        	 return oRoot;
         }
         else {
        	 this.logError('Nothing to agglomerate.');
        	 return false;
         }
         
         return true;
     },
     
    /**
     * Parse JSON data object
     * 
     * @param {Object} oEmlCluster
     * @param {Object} oJSON
     * @returns {Object} cluster
     */
    parseJson : function(oJSON) { 
    	this.setLabels(new Array());
    	this.setVectors(new Array());
        
    	var oLabels = this.getLabels();
    	var oVectors = this.getVectors();
    	
    	if (oJSON.children) {
    		oResult = this.getEnodeTimes(
    			oJSON.children, 
    			(oJSON.children.id) ? oJSON.children.id : null,
    			oLabels, oVectors
        	);
    		
    		/*
    		oResult = oEmlCluster.getTimeClusterItems(
    			oEmlCluster, oJSON.children, 
    			(oJSON.children.id) ? oJSON.children.id : null,
    			oLabels, oVectors
        	);
        	*/
    		
    		oLabels = oResult["label"];
    		oVectors = oResult["vector"];
        }
        
        var oClusterResult = figue.agglomerate(
    		oLabels, 
    		oVectors , 
    		figue.EUCLIDIAN_DISTANCE,
    		figue.SINGLE_LINKAGE
        );
        
        var oCluster = this.getResultinSimileTimeline(
        	oClusterResult, 
    		{
        		"color" : this.getColorLUT()[0],
        		"mediaType" : "1" // Single media type
        	}
    	);
        
        this.setData({
        	"label": oLabels,
        	"vector": oVectors,
        	"cluster": oCluster
        });
        
        return oCluster;
    },

    /**
     * Cluster events and prepare the result for Simile timeline 
     * 
     * @param {Object} oCluster
     * @returns {Object}
     * 
     */
    getResultinSimileTimeline : function(oCluster, oMetaData) { 
    	var oSimileTimeData = new Array();
    	var oRootNode = this.parseClusterforSimile(oCluster, oSimileTimeData, oMetaData);
    	
    	return {"events" : oSimileTimeData};
    },
    
    /**
     * Parse clustered results and prepared the data in Simile data format
     * 
     * @param {Object} oCluster
     * @param {Object} oSimileTimeData
     * @return {Object} 
     * 
     * TODO: Change NodeID to NodeId. May need to check calling routines
     */
    parseClusterforSimile : function (oCluster, oSimileTimeData, oMetaData) {
    	var oStart;
    	var oEnd;
    	var oNodeId;
    	var oStartTime;
    	var oEndTime;
    	
    	if (oCluster === undefined) return;
    	
    	if (oCluster.isLeaf()) {
    		oStart = oCluster.centroid[0];
    		oEnd = oCluster.centroid[0];
    		oNodeId = oCluster.label;
    		
    		if ((typeof oMetaData["minDuration"] == 'undefined') ||
    			((typeof oMetaData["minDuration"] !== 'undefined') &&
    			(parseInt(oEnd) - parseInt(oStart) > parseInt(oMetaData["minDuration"])))) {
    		
	    		oStartTime = new Date();
	    		oEndTime = new Date();
	    		
	    		oStartTime.setTime(parseInt(oStart)*1000);
	    		oEndTime.setTime(parseInt(oEnd)*1000);
	    		
	    		oMetaData["start"] = oStart;
	    		oMetaData["end"] = oEnd;
	    		oMetaData["duration"] = oEnd - oStart;
	    		
 	    		oSimileTimeData.push({
	    			"start": oStartTime.toString(),
	    			"end": oEndTime.toString(),
	    			"durationEvent": false,
	    			"color": (typeof oMetaData["color"] != 'undefined') ? oMetaData["color"] : this.getColorLUT()[0],
	    			"node_id": oNodeId,
	    			"meta_data": oMetaData
	    		});
			}
    	} else {
    		var oLeftMetaData = clone(oMetaData);
    		var oRightMetaData = clone(oMetaData);
    		
    		var oLeftCluster = this.parseClusterforSimile(oCluster.left, oSimileTimeData, oLeftMetaData);
    		var oRightCluster = this.parseClusterforSimile(oCluster.right, oSimileTimeData, oRightMetaData);
    		
    		oStart = Math.min.apply(null, [
    			oLeftCluster.oStart,
    			oLeftCluster.oEnd,
    			oRightCluster.oStart,
    			oRightCluster.oEnd
    		]); 
    		oEnd = Math.max.apply(null, [
     			oLeftCluster.oStart,
    			oLeftCluster.oEnd,
    			oRightCluster.oStart,
    			oRightCluster.oEnd
    		]); 
    		
    		if (oStart > oEnd) {
    			tmpValue = oStart;
    			oStart = oEnd;
    			oEnd = tmpValue;
    		}
    		
    		if ((typeof oMetaData["minDuration"] == 'undefined') ||
    			((typeof oMetaData["minDuration"] !== 'undefined') &&
    			(parseInt(oEnd) - parseInt(oStart) > parseInt(oMetaData["minDuration"])))) {
				oStartTime = new Date();
	    		oEndTime = new Date();
	    		
	    		oStartTime.setTime(parseInt(oStart)*1000);
	    		oEndTime.setTime(parseInt(oEnd)*1000);
	    		
	    		oNodeId = oLeftCluster.oNodeId+','+oRightCluster.oNodeId;
	    		
	    		var oParentMetaData = clone(oMetaData);
	    		
	    		oParentMetaData["start"] = oStart;
	    		oParentMetaData["end"] = oEnd;
	    		oParentMetaData["duration"] = oEnd - oStart;
	    		
	    		// Search over child data. Be aware that this routine is a recursive call 
	    		// first it gets into the leaf node and routines at this point are called when
	    		// getting back to the root. Thus oSimileTimeData includes child nodes, not parent nodes.
	    		var bFound = true;
	    		oSimileTimeData.forEach(function(oData) {
	    			var oChildMetaData = oData["meta_data"];
	    			if (oChildMetaData["start"] >= oParentMetaData["start"] &&
	    				oChildMetaData["end"] <= oParentMetaData["end"] &&
	    				(oParentMetaData["duration"] - oChildMetaData["duration"]) < oParentMetaData["granularity"]) {
	    				bFound = false;
    				}
	    		});
	    		// Compare the duration 
	    		
	    		if (bFound === true) {
	    			oSimileTimeData.push({
		    			"start": oStartTime.toString(),
		    			"end": oEndTime.toString(),
		    			"durationEvent": true,
		    			"color": (typeof oParentMetaData["color"] != 'undefined') ? oParentMetaData["color"] : this.getColorLUT()[0],
		    			"node_id": oNodeId,
		    			"meta_data": oParentMetaData
		    		});
	    		}
    		}
    	};
    	
    	return {
    		"oStart": oStart,
    		"oEnd": oEnd,
    		"oNodeId": oNodeId
    	};
    }
});