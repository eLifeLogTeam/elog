/**
 * Image thumbnail viewer.
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.ui.panel.div.canvas.image.Thumbnail', {
 *     	fullscreen:true
 *     });
 */
Ext.define('Elog.view.ui.panel.div.canvas.image.FaceThumbnail', {
	extend: 'Elog.view.ui.panel.div.canvas.image.Thumbnail',
    xtype: 'elogFaceThumbnail',
    config : {
		name: 'idFaceThumbnail',
		sensorFaceData: [],
    },
	
    init: function() {
    	this.callParent();
    },
    
    loadData : function (oResult) {
    	this.onProcessSensorData(oResult);	
    },
    
    onProcessSensorData: function(oResult) {
   		var oViewer = this;
    	var oApiBase = new Elog.api.Base();
		
    	// Load face image data 
		this.setSensorFaceData(new Array());
							
		if (typeof oResult.root !== 'undefined') {
			oResult.root.forEach(function(oData, i) {
				if (typeof oData.data !== 'undefined' &&
					typeof oData.data.sensor !== 'undefined') {
					// base64Decode
					// TODO: This should be modified to process any GPS sensor data
					
					if (oData.data.sensor.indexOf('Opencv/DetectFace/Image') > -1) {
						if (typeof oData.data != 'undefined') {
							
							for (var propt in oData.data) {
								if (propt != "eml_event_timestamp" &&
									propt != "sensor" &&
									propt != "unixtimestamp" &&
									propt != "iconDiv") {
									oData.data[propt] = oApiBase.base64Decode(oData.data[propt]);
								}
							}
							
							oViewer.setSensorFaceData(oViewer.getSensorFaceData().concat(oData.data));
						}	
					}					
				}
			});
        };
        
	    data = oViewer.getSensorFaceData();
        
        // Create image objects
        var oImage;
        var oStartUnixtimestamp = null;
        var oEndUnixtimestamp = null;
        
        this.setImages(new Array());
        // this.redrawBackground();
        
        for (var i = 0; i < data.length; ++i) {
            // Check existing image object
            if (this.getImages().length > i) {
                oImage = this.getImages()[i];
            } else {
                oImage = new Image();
                this.getImages().push(oImage);
            }
            
            var oParams = {
            	"mediaType" : "image",
            	"userKey" : this.getCookie('user_key'),
            	"isFullPath" : true,
            	"filePath" : data[i].imageFilePath,
	    		"fileName" : data[i].imageFilePath,
	    		"unixTimestamp" : data[i].unixtimestamp,
            };
            
            var oConfig = {
            	"command" : "Media.base.GetMedia",
            	"userKey" : this.getCookie('user_key'),
            	"params" : oParams
            };
            
            // var oMediaUrl = this.getServerQueryUrl(oConfig);
            
            oMediaUrl = this.getCookie('server_url');
			oMediaUrl += '?'; 
			oMediaUrl += 'command=Media.base.GetMedia';
			oMediaUrl += '&userKey='+this.getCookie('user_key');
			oMediaUrl += '&params='+Ext.JSON.encode(oParams);
			oMediaUrl += '&callback=Ext.data.JsonP.callback3';
	    	
            oImage.src = oMediaUrl;
            
            for (var propt in data[i]) {
				if (propt != "eml_event_timestamp" &&
					propt != "sensor" &&
					propt != "unixtimestamp" &&
					propt != "iconDiv"
				) {
					oImage[propt] = data[i][propt];
				}
			}
							
            if (typeof data[i].lastRecordingTime != "undefined") {
            	oImage.timestamp = data[i].lastRecordingTime;
			} else {
				oImage.timestamp = data[i].eml_event_timestamp;
			}
			
            if (typeof data[i].utcTimestamp != "undefined") {
            	oImage.unixtimestamp = data[i].utcTimestamp;
			} else {
				oImage.unixtimestamp = data[i].unixtimestamp;
			}
			
			if (oStartUnixtimestamp == null) oStartUnixtimestamp = oImage.unixtimestamp;
        }
        
        // Discard unused memory
        if (data.length < this.getImages().length) {
        	var oRemoveCount = this.getImages().length - data.length;
        	for (i = 0; i < oRemoveCount; ++i) {
        		this.getImages().pop();
        	}
        }
        
        if (oEndUnixtimestamp == null) oEndUnixtimestamp = oImage.unixtimestamp;

        // this.calculateImagePosition(this.getThumbnailWidth());
                        
        // Draw image objects
        // Here we set the limit on the start and end timestamp from the data
        var oControl = this;
        
        // oControl.redrawBackground();
        
        // for (var i = 0; i < this.getImages().length; ++i) {
        // for (var i = 0; i < data.length; ++i) {
        for (var i = 0; i < this.getImages().length; ++i) {
            oImage = this.getImages()[i];
            
            oImage.onload = function() {
                // Draw image
            	/**
            	 * TODO: Here is the place to adjust width/height ratio for thumbnail display
            	 */
            	
            	if (typeof this.contextx === "undefined") {
            		oControl.setDefaultImageHeight(this.naturalHeight);
            		oControl.setDefaultImageWidth(this.naturalWidth);
            		
            		oControl.setThumbnailWidth(
			    		parseInt((oControl.getCanvas().width - (oControl.getThumbnailRowCount()+1)*5) / oControl.getThumbnailRowCount())
					);
			        oControl.setThumbnailHeight(
			    		parseInt(oControl.getThumbnailWidth() * oControl.getDefaultImageHeight() / oControl.getDefaultImageWidth())
					);
					
            		oControl.calculateImagePosition(oControl.getThumbnailWidth());
            	}
            	
            	// Draw face boundary?
            	oControl.getCanvasContext().drawImage(
            		this,
            		parseInt(this.contextx), 
                    parseInt(this.contexty),
                    oControl.getThumbnailWidth(),
                    oControl.getThumbnailHeight()
                );
                
                // Let's draw path
                // ex) "{2.8125,54.1667,29.6875,29.6875}"
                var oFaceRectPercentArray = Ext.JSON.decode(this.faceRectPercentArray);
                
                var oSourceImage = this;
                oFaceRectPercentArray.forEach(function(oRect) {
                	var oFaceRect = [
	                	parseInt(oSourceImage.contextx)+parseInt(parseFloat(oControl.getThumbnailWidth())*oRect["x"]/100.), 
						parseInt(oSourceImage.contexty)+parseInt(parseFloat(oControl.getThumbnailHeight())*oRect["y"]/100.), 
						parseInt(parseFloat(oControl.getThumbnailWidth())*oRect["width"]/100.), 
						parseInt(parseFloat(oControl.getThumbnailHeight())*oRect["height"]/100.)
	                ];
	                
	                oControl.getCanvasContext().beginPath();
					oControl.getCanvasContext().rect(
						oFaceRect[0], oFaceRect[1],	oFaceRect[2], oFaceRect[3]
					);
					
					// oControl.getCanvasContext().fillStyle = 'yellow';
					// oControl.getCanvasContext().fill();
					oControl.getCanvasContext().lineWidth = 2;
					oControl.getCanvasContext().strokeStyle = 'yellow';
					oControl.getCanvasContext().stroke();
                });
                
                // var oRect = this.rectPercent.substring(1, this.rectPercent.length-2).split(",");
            };
        }
    },
    
    /**
     * Process the query result to retrieve the image list
     * 
     * @param {Object} data
     */
    onProcessImageList : function(data) {
        if (data && data.root && !!data.root.length) {
            data = data.root;
            
            // Create image objects
            var oImage;
            var oStartUnixtimestamp = null;
            var oEndUnixtimestamp = null;
            for (var i = 0; i < data.length; ++i) {
                // Check existing image object
                if (this.getImages().length > i) {
                    oImage = this.getImages()[i];
                } else {
                    oImage = new Image();
                    this.getImages().push(oImage);
                }
                
                // Set image source
                oImage.src = data[i].mediaUrl;
                
                if (typeof data[i].lastRecordingTime != "undefined") {
                	oImage.timestamp = data[i].lastRecordingTime;
				} else {
					oImage.timestamp = data[i].eml_event_timestamp;
				}
				
                if (typeof data[i].utcTimestamp != "undefined") {
                	oImage.unixtimestamp = data[i].utcTimestamp;
				} else {
					oImage.unixtimestamp = data[i].unixtimestamp;
				}
				
				if (oStartUnixtimestamp == null) oStartUnixtimestamp = oImage.unixtimestamp;
            }
            
            if (oEndUnixtimestamp == null) oEndUnixtimestamp = oImage.unixtimestamp;

            // this.calculateImagePosition(this.getThumbnailWidth());
                            
            // Draw image objects
            // Here we set the limit on the start and end timestamp from the data
            var oControl = this;
            
            // oControl.redrawBackground();
            
            // for (var i = 0; i < this.getImages().length; ++i) {
            // for (var i = 0; i < data.length; ++i) {
            for (var i = 0; i < this.getImages().length; ++i) {
                oImage = this.getImages()[i];
                
                oImage.onload = function() {
                    // Draw image
                	/**
                	 * TODO: Here is the place to adjust width/height ratio for thumbnail display
                	 */
                	
                	if (typeof this.contextx === "undefined") {
                		oControl.setDefaultImageHeight(this.naturalHeight);
                		oControl.setDefaultImageWidth(this.naturalWidth);
                		
                		oControl.setThumbnailWidth(
				    		parseInt((oControl.getCanvas().width - (oControl.getThumbnailRowCount()+1)*5) / oControl.getThumbnailRowCount())
						);
				        oControl.setThumbnailHeight(
				    		parseInt(oControl.getThumbnailWidth() * oControl.getDefaultImageHeight() / oControl.getDefaultImageWidth())
						);
						
                		oControl.calculateImagePosition(oControl.getThumbnailWidth());
                	}
                	
                	oControl.getCanvasContext().drawImage(
                		this,
                		parseInt(this.contextx), 
                        parseInt(this.contexty),
                        oControl.getThumbnailWidth(),
                        oControl.getThumbnailHeight()
                    );
                };
            }
        }
    },
});
