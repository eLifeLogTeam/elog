/**
 * elog.api.ImageCanvasListViewer
 * 
 * @author Pil Ho Kim
 * 
 * Display list of image thumbnails on the canvas
 * 
 * {@img elog_canvasimagelistview.png alt "Canvas image list view example."}
 * 
 * History:
 * 2011/02/12 - First version
 * 
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.ui.panel.div.canvas.image.CanvasImageListViewer', {
 *     	fullscreen:true
 *     });
 *
 */
Ext.define('Elog.view.ui.panel.div.canvas.image.CanvasImageListViewer', {
    // These are all detected automatically
    // No need to use @extends, @alternateClassName, @mixin, @alias, @singleton
    extend: 'Elog.view.ui.panel.div.canvas.image.Base',
    xtype: 'elogCanvasImageListViewer',
    config: {
    	name: 'idCanvasImageListViewer',
    	
    	/**
    	 * Default image width
    	 */
    	defaultImageWidth : 640,
    	/**
    	 * Default image height
    	 */
    	defaultImageHeight : 480,
    	/**
    	 * Souce thumbnail width
    	 */
        sourceThumbnailWidth : 64,
        /**
         * Source thumbnail height
         */
        sourceThumbnailHeight : 48,
        /**
         * Zoom thumbnail width
         */
        zoomThumbnailWidth : 320,
        /**
         * Zoom thumbnail height
         */
        zoomThumbnailHeight : 240,
//        m_iZoomThumbnailWidth : 320,
//        m_iZoomThumbnailHeight : 240,
        /**
         * A set of occluded images by the zoomed iamge
         */
        occlucedImages : [],
        /**
         * Thumbnail width
         */
        thumbnailWidth : null, // Default and will be recalculated to fit into the actual canvas size
        /**
         * The count of images to display per row
         */
        thumbnailRowCount : 8,
        /**
         * Thumbnail height
         */
        thumbnailHeight : null, // Default and will be recalculated to fit into the actual canvas size
        /**
         * Current image ID
         */
        currentImageId : -1,
        /**
         * The set of image objects
         */
        images: [],
        /**
         * Canvas object
         */
        canvas : null,
        /**
         * Status of mouse pointer whether inside the canvas
         */
        isMouseIn : false,
        /**
         * Status whether to track the mouse pointer position
         */
        checkMouseMovement : true,
        /**
         * Status whether to replace the thumbnail with the zoomed image 
         */
        replaceZoomImage : true, // If true, replace thumbnail image with the zoomed one
        /**
         * Status whether to edit images. If true, doubleclick on the select mode will popup the image edit panel
         */
        editImage : false,
        /**
         * Panel object to edit an image
         */
        imageEditPanel : null,
        /**
         * Selected image ID
         */
        selectedImageId : null,
        /**
         * Zoomed image object
         */
        zoomImage : null,
        /**
         * Image queue count
         */
        imageQueueCount : 0,
        /**
         * Set current zoomed image ID
         */
        currentZoomImageId : -1,
        
        /**
         * Background area X position
         */
        backX : 0,
        /**
         * Background area Y position
         */
        backY : 0,
        /**
         * Background area width
         */
        backWidth : 0,
        /**
         * Background area height
         */
        backHeight : 0,
        /**
         * Status to show meta information or not
         */
        showMetaInformation : false,
        /**
         * Image thumbnail display column count
         */
        columnCount: null,
        /**
         * Image thumbnail display row count
         */
        rowCount: null
	},
	
	init: function() {
		// Extend the Image object type to check the overlap with the zoom
	    Image.prototype.isOverlap = function(iX1, iY1, iX2, iY2) {
	        if (this.contextx && this.contexty) {
	            var iOX1 = this.contextx;
	            var iOY1 = this.contexty;
	            var iOX2 = iOX1 + this.width;
	            var iOY2 = iOY1 + this.height;
	            
	            return !(iOX1 > iX2 || 
	                   iOX2 < iX1 || 
	                   iOY1 > iY2 ||
	                   iOY2 < iY1);
	        }
	        
	        return false;
	    }
	
		this.setThumbnailWidth(this.getDefaultImageWidth()/10); // Default and will be recalculated to fit into the actual canvas size
	    this.setThumbnailHeight(
    		parseInt(this.getThumbnailWidth() * this.getDefaultImageHeight() / this.getDefaultImageWidth())
		); // Default and will be recalculated to fit into the actual canvas size
	},
	
	/**
	 * Retrieve image ID from the touch/mouse location
	 * 
	 * @param {Object} oImageViewer
	 * @param {Number} iOffsetX
	 * @param {Number} iOffsetY
	 * @return {Number|Boolean} Returns the image ID or false when not found.
	 */
	getImageCanvasIdbyOffset : function(iOffsetX, iOffsetY) {
	    var oImageCanvas;
	    var iImageX;
	    var iImageY;
	    var oImage = null;
	    
	    if (this.getImages() == null) return false;
	    
	    for (var i = 0; i < this.getImages().length; ++i) {
	    	oImage = this.getImages()[i];
	    	
	        iImageX = parseInt(oImage.contextx);
	        iImageY = parseInt(oImage.contexty);
	        
	        if (iOffsetX >= iImageX && iOffsetX <= iImageX + this.getThumbnailWidth() &&
	            iOffsetY >= iImageY && iOffsetY <= iImageY + this.getThumbnailHeight()) {
	            return i;
	        }
	    };
	    
	    return false;
	},

    /**
     * Process click event
     */
	onCanvasClick : function(e) {
		// Calculate image Id
	    var iImageId = this.getImageCanvasIdbyOffset(e.offsetX, e.offsetY);
	    
//		    oImageViewer.UpdateGPSClusterInformationContent(oImageViewer, iImageId);
	    if (iImageId != null) {
	    	this.onCanvasSelectImage(iImageId);
	    }
	},

	/**
	 * Process double click event
	 */
	onCanvasDblClick : function(e) {
	    // Calculate image Id
		var iImageId = this.getImageCanvasIdbyOffset(e.offsetX, e.offsetY);
	    var oImage = this.getImages()[iImageId];
	    
	    if (typeof(oImage) == "undefined") return;
	    
	    if (this.getEditImage() == true &&
	        typeof(this.getImageEditPanel() != "undefined")) {
	        
	    	this.getImageEditPanel().oImageOption = {
	            src: oImage.src,
	            timestamp: oImage.timestamp,
	            localtimestamp: oImage.localtimestamp,
	            width: oImage.width,
	            height: oImage.height
	        };
	    
	    	this.getImageEditPanel().show('pop');
	    }
	},

	/**
	 * Process the move event
	 */
	onCanvasMove : function(e) {
	    // Calculate image Id
		// Calculate image Id
	    var iImageId = this.getImageCanvasIdbyOffset(e.offsetX, e.offsetY);
	    
	    if (iImageId !== false) this.onCanvasSelectImage(iImageId);
	},

	/**
	 * Redraw image list
	 */
	redrawImage : function(iImageId) {
	    if (iImageId < 0 || iImageId >= this.getImages().length) return;
	    
	    var oImage = this.getImages()[iImageId];
	    if (!oImage) return;
	    
	    // Remove background
	    this.getCanvasContext().fillRect(
    		oImage.contextx-5, 
    		oImage.contexty-5, 
	        this.getThumbnailWidth()+10, 
	        this.getThumbnailHeight()+10
	    );

	    // Draw image
	    this.getCanvasContext().drawImage(
    		oImage, 
    		oImage.contextx, 
    		oImage.contexty, 
	        this.getThumbnailWidth(), 
	        this.getThumbnailHeight()
	    );
	},

	/**
	 * Draw the zoomed image
	 */
	onCanvasSelectImage : function(iImageId) {
		if (iImageId === false) {
			return false;
		}
		
	    if (iImageId < 0 || iImageId >= this.getImages().length) {
	        this.setCurrentZoomImageId(-1);
	        return;
	    }
	    
	    if (this.getCanvas() == null) {
	    	this.setCanvas(this.getDivElement());
	    	this.setCanvasContext(this.getCanvas().getContext("2d")); 
	    }
	    
	    var oImage = this.getImages()[iImageId];
	    
	    // Redraw occluced images
	    this.redrawBackground();
	    
	    // Calcualate new zoom image position
	    var iX = (parseInt(oImage.contextx) + 
	        this.getThumbnailWidth() / 2)
	        - this.getZoomThumbnailWidth() / 2;
	    var iY = (parseInt(oImage.contexty) + 
	        this.getThumbnailHeight() / 2)
	        - this.getZoomThumbnailHeight() / 2;
	    
	    // Check the boundary
	    var iRightBoundary = this.getCanvas().width 
	        - this.getZoomThumbnailWidth() 
	        - 5;
	    iX = (iX < 5) ? 5 : iX;
	    iX = (iX > iRightBoundary) ? iRightBoundary : iX;
	    
	    var iBottomBoundary = this.getCanvas().height 
	        - this.getZoomThumbnailHeight() 
	        - 5;
	    iY = (iY < 5) ? 5 : iY;
	    iY = (iY > iBottomBoundary) ? iBottomBoundary : iY;
	      
	    // Calcualate new occluded images
	    var oImageViewer = this;
	    this.getImages().forEach(function(oImage, i) {
	        // include the boundary thickiness
	        if (oImage.isOverlap(
	            iX-1, 
	            iY-1, 
	            iX+oImageViewer.getZoomThumbnailWidth()+1,
	            iY+oImageViewer.getZoomThumbnailHeight()+1)) {
	            oImageViewer.getOcclucedImages().push(i);
	        }   
	    });     
	    this.setSelectedImageId(iImageId);
	    
	    // Draw image in zoom size
	    this.getCanvasContext().drawImage(
	        oImage, 
	        iX, 
	        iY,
	        this.getZoomThumbnailWidth(),
	        this.getZoomThumbnailHeight()
	    );
	    
	    // Draw the boundary
	    this.getCanvasContext().lineWidth=3;
	    this.getCanvasContext().strokeStyle="white"; 
	    this.getCanvasContext().strokeRect(
	        iX-1, 
	        iY-1, 
	        this.getZoomThumbnailWidth()+2,
	        this.getZoomThumbnailHeight()+2
	    );
	    
	    // Set zoom attribute
	    oImage.zoomx = iX;
	    oImage.zoomy = iY;

	    if (this.getShowMetaInformation() == true) {
	        this.displayMetadata(oImage);
	    }
	    
	    this.pushtoImageQueue(oImage, iImageId);
	},

	/**
	 * Display image metadata 
	 */
	displayMetadata : function(oZoomImage) {
	    var context = this.getCanvasContext();
	    
	    // Backup styles
	    var oFillStyle = context.fillStyle;
	    var oStrokeStyle = context.strokeStyle;
	    
	    context.lineWidth=1;
	    //context.fillStyle="#0000ff";
	    context.fillStyle="yellow";
	    context.strokeStyle="black";
	    // context.strokeWidth="1px";
	    context.font = "bold 12pt arial";
	    
	    // context.fillStyle="#ff0000";
	    // context.shadowColor="#888888";
	    context.shadowOffsetX=2;
	    context.shadowOffsetY=2;
	    //context.shadowBlur=10;
	    
	    var oTextWidth = context.measureText(oZoomImage.localtimestamp).width;
	    
	    context.fillText(
//	        oZoomImage.timestamp, 
	        oZoomImage.localtimestamp, 
	        oZoomImage.zoomx + (this.getZoomThumbnailWidth() - oTextWidth) - 3, 
	        oZoomImage.zoomy + this.getZoomThumbnailHeight()- 9
	    );
	    
	    context.strokeText(
//	        oZoomImage.timestamp, 
	        oZoomImage.localtimestamp, 
	        oZoomImage.zoomx+ (this.getZoomThumbnailWidth() - oTextWidth) - 3, 
	        oZoomImage.zoomy + this.getZoomThumbnailHeight() - 9
	    );

	    // Recover styles
	    context.fillStyle = oFillStyle;
	    context.strokeStyle = oStrokeStyle;

//	    context.fill();
//	    context.stroke();
	},

	/**
	 * Redraw the background
	 */
	redrawBackground : function() {
		var oImageViewer = this;
	    this.getOcclucedImages().forEach(function(oOccludedImageId, i) {
	        oImageViewer.redrawImage(oOccludedImageId);
	    });
	    
	    // Clear variables
	    this.getOcclucedImages().splice(0, this.getOcclucedImages().length);
	    
	    // Redraw the blank withing thumbnail region
	    this.getCanvasContext().fillRect(
	        this.getBackX(),
	        this.getBackY(), 
	        this.getBackWidth(), 
	        this.getBackHeight()
	    );
	    
	    // Redraw outer thumbnail area
	    var iX1 = this.getThumbnailRowCount() * (this.getThumbnailWidth()+5);
	    var iWidth = this.getCanvas().width - iX1;
	    var iY1 = (this.getRowCount() + 1) * (this.getThumbnailHeight()+5);
	    var iHeight = (this.getCanvas().height - iX1 > 0) ? 
	                    this.getCanvas().height - iX1 :
	                    0;
	    
	    this.getCanvasContext().fillRect(
	        iX1,
	        0, 
	        iWidth, 
	        this.getCanvas().height
	    );
	    
	    this.getCanvasContext().fillRect(
	        0, 
	        iY1,
	        this.getCanvas().width, 
	        this.getCanvas().height - iHeight
	    );
	},

	/**
	 * Calculate image positions
	 */
	calculateImagePosition : function(iThumbnailWidth) {
	    // Update the tweets in timeline
		if (this.getCanvas() == null) {
			this.setCanvas(this.getDivObject());
		    this.setCanvasContext(this.getCanvas().getContext("2d")); 
		}
	    
	    this.getCanvas().width = this.element.getWidth();
	    this.getCanvas().height = this.element.getHeight();
	    
	    this.getCanvas().caller = this;
	    
	    this.setThumbnailWidth(parseInt(
	        (this.getCanvas().width 
	        - (this.getThumbnailRowCount()+1)*5)
	        /this.getThumbnailRowCount()
	    ));
	    this.setThumbnailHeight(parseInt(
	        this.getThumbnailWidth() 
	        * this.getDefaultImageHeight()
	        /this.getDefaultImageWidth()
	    ));
	    
	    // Assign canvas event handler
	    var oImageViewer = this;
	    
	    this.getCanvas().onclick = function(e) {
    		if (!e) var e = window.event;
    		this.caller.onCanvasClick(e);
	    };
	    
	    this.getCanvas().ondblclick = function(e) {
	    	if (!e) var e = window.event;
	    	
	    	if (this.caller.getEditImage() == true) {
	    		this.caller.onCanvasDblClick(e);
	    	}
	    };
	    
	    this.getCanvas().onmousemove = function(e) {
	        if (!e) var e = window.event;
	        
	        if (this.caller.getCheckMouseMovement() == true) {
	        	this.caller.setIsMouseIn(true);
	        	this.caller.onCanvasMove(e);
	        }
	    }; 
	    
	    this.getCanvas().onmouseout = function(e) {
	        if (!e) var e = window.event;
	        
	        if (this.caller.getCheckMouseMovement() == true) {
	        	this.caller.setIsMouseIn(false);
	        	this.caller.setCurrentZoomImageId(-1);
	            
	            // Redraw images
	        	this.caller.redrawBackground();
	        }
	    };
	        
	    // Calculate width
	    var iColumnCount = 0;
	    var iRowCount = 0;
	    var iMaxColumnItem = this.getThumbnailRowCount();
	    if (iMaxColumnItem < 1) iMaxColumnItem = 1;
	        
	    this.getImages().forEach(function(oImage, i) {  
	    	oImage.width = oImageViewer.getThumbnailWidth();
	    	oImage.height = oImageViewer.getThumbnailHeight();
	    	oImage.contextx = (oImageViewer.getThumbnailWidth()+5)*iColumnCount+5;
	        oImage.contexty = (oImageViewer.getThumbnailHeight()+5)*iRowCount+5;
	        
	        ++iColumnCount;
	        if (iColumnCount >= iMaxColumnItem) {
	            iColumnCount = 0;
	            ++iRowCount;
	        }
	    });
	    
	    // Record column, row count
	    if (iColumnCount == 0) {
	        this.setColumnCount(iMaxColumnItem);
	        this.setRowCount(iRowCount-1);
	    }
	    else {
	        this.setColumnCount(iColumnCount);
	        this.setRowCount(iRowCount);
	    }
	    
	    // Adjust canvas height
	    var oNewHeight = (this.getThumbnailHeight()+5)*iRowCount+5;
	    
	    if (oNewHeight > this.getZoomThumbnailHeight() + 10) {
	        this.getCanvas().height = oNewHeight;
	    }
	    else {
	        this.getCanvas().height = this.getZoomThumbnailHeight() + 10;
	    }
	    
	    // Calculate the background area
	    var oLastImage = this.getImages()[this.getImages().length - 1];
	    this.setBackX(oLastImage.contextx + oLastImage.width);
	    this.setBackY(oLastImage.contexty);
	    this.setBackWidth(this.getCanvas().width - this.getBackX());
	    this.setBackHeight(this.getCanvas().height - this.getBackY());
	},

	/**
	 * Push the event to update the image list
	 */
	pushtoImageQueue : function(oImage, iImageId) {
	    this.setImageQueueCount(this.getImageQueueCount() + 1);
	    setTimeout(this.onUpdateImageList(oImage, iImageId), 300);
	},

	/**
	 * Update the image list
	 */
	onUpdateImageList : function(oImage, iImageId) {
	    if (this.getImageQueueCount() > 1) {
	        this.setImageQueueCount(this.getImageQueueCount() - 1);
	        return;
	    }
	    
	    if (iImageId < 0) return;
	    
	    // Then load the original quality image
	    this.setZoomImage(new Image());
	    
	    // Set image source
	    this.getZoomImage().timestamp = oImage.timestamp;
	    this.getZoomImage().localtimestamp = oImage.localtimestamp;
	    this.getZoomImage().contextx = oImage.contextx;
	    this.getZoomImage().contexty = oImage.contexty;
	    this.getZoomImage().zoomx = oImage.zoomx;
	    this.getZoomImage().zoomy = oImage.zoomy;
	    this.getZoomImage().imageid = iImageId;
	    
	    this.getCurrentZoomImageId(iImageId);
	    
	    this.getZoomImage().oImageViewer = this;
	    
	    // this.getZoomImage().oImageViewer = oImageViewer;
	    
	    // This should use the url given from the source
	    this.getZoomImage().src = oImage.src;
	    
	    // Right now, we download the entire image
	    // So keep this for later when downloading thumbnzil size iamge
	    /*
	    this.getZoomImage().src = oServerSetting['server_index_key']+
	            '&elog_command=GetImage&utctimestamp='+
	            oImageCanvas.timestamp;
	    */
	    
	    // Draw image objects
	    var oImageViewer = this;
	    this.getZoomImage().onload = function() {
	        if (oImageViewer.getZoomImage().imageid >= 0) {
	            if ((oImageViewer.getZoomImage().imageid) == 
	                (oImageViewer.getCurrentZoomImageId()) &&
	                (oImageViewer.getIsMouseIn() == true)) {
	                // Draw image
	            	oImageViewer.getCanvasContext().drawImage(
            			oImageViewer.getZoomImage(), 
	                    parseInt(oImageViewer.getZoomImage().zoomx), 
	                    parseInt(oImageViewer.getZoomImage().zoomy),
	                    oImageViewer.getZoomThumbnailWidth(),
	                    oImageViewer.getZoomThumbnailHeight()
	                );
	                
	                // Replace image
	                if (oImageViewer.getReplaceZoomImage()) {
	                	oImageViewer.getImages().splice(
                			oImageViewer.getZoomImage().imageid,
	                        1,
	                        oImageViewer.getZoomImage()
	                    );
	                    
	                	oImageViewer.getZoomImage().hasOriginal = true; // replaced with the original size image
	                }
	                
	                // Display metadata
	                if (oImageViewer.getShowMetaInformation() == true) {
	                    oImageViewer.displayMetadata(oImageViewer.getZoomImage());
	                }
	            }
	        }
	        else {
	            // Discard image
	            delete oImageViewer.getZoomImage();
	            oImageViewer.setZoomImage(null);
	        }
	        
	        // Clear queue
	        oImageViewer.setImageQueueCount(0);
	    };
	    
	    // Clear queue
	    oImageViewer.setImageQueueCount(0);
	},

	/**
	 * Draw the image list
	 */
	onProcessImageList : function(data) {
	    if ((typeof data) && (typeof data.root)) {
	        data = data.root;
	        
	        // Create image objects
	        var oImage;
	        
	        // Remove existing objects
	        if (this.getImages() != null) {
	        	this.getImages().forEach(function(oImage, i) {
		            delete oImage;
		        });
		        this.getImages().splice(0, this.getImages().length);
	        }
	        
	        for (var i = 0; i < data.length; ++i) {
	            // Check existing image object
	            if (this.getImages().length > i) {
	            	oImage = this.getImages()[i];
	            }
	            else {
	            	oImage = new Image();
	                this.getImages().push(oImage);
	            }
	            
	            // Set image source
	            this.getImages()[i].src = data[i].mediaUrl;
	            // this.getImages()[i].timestamp = data[i].lastRecordingTime;
	            // this.getImages()[i].unixtimestamp = data[i].utcTimestamp;
	            
	            if (typeof data[i].lastRecordingTime != "undefined") {
                	this.getImages()[i].timestamp = data[i].lastRecordingTime;
				}
				else {
					this.getImages()[i].timestamp = data[i].eml_event_timestamp;
				}
				
                if (typeof data[i].utcTimestamp != "undefined") {
                	this.getImages()[i].unixtimestamp = data[i].utcTimestamp;
				}
				else {
					this.getImages()[i].unixtimestamp = data[i].unixtimestamp;
				}
	        }

	        if (data.length > 0) {
	            this.calculateImagePosition(this.getThumbnailWidth());
	        }
	        
	        // Erase
	        if (typeof this.getCanvasContext != "undefined") {
	            this.getCanvasContext().fillRect(
	                0,
	                0, 
	                this.getCanvas().width, 
	                this.getCanvas().height
	            );
	        }
	        
	        // Draw image objects
	        var oImageViewer = this;
	        this.getImages().forEach(function(oImage, i) {
	        	oImage.onload = function() {
	                // Draw image
	            	oImageViewer.getCanvasContext().drawImage(
            			this, 
	                    parseInt(this.contextx), 
	                    parseInt(this.contexty),
	                    oImageViewer.getThumbnailWidth(),
	                    oImageViewer.getThumbnailHeight()
	                );
	            };
	        });
	    }
	}, 

	/**
	 * Refresh the canvas image list
	 */
	onImageCanvasListViewerRefresh : function() {
	    // ReadTimeRange();
	    /*
	    var oTimeConfig;
	        
	    if (oSearchTimeStore.getCount() > 0) {
	        oTimeConfig = oSearchTimeStore.getRange();
	    }
	    else oTimeConfig = oSearchTimeConfig;
	    */
		
	    // Read search configuration
	    
	    if (Ext.isArray(oTimeConfig)) {
	        var oStartDate = oTimeConfig[oTimeConfig.length-1].data.dateFrom;
	        var oEndDate = oTimeConfig[oTimeConfig.length-1].data.dateTo;
	        
	        var oStartUTCSecond = Math.round(
	                (oStartDate.getTime() + oStartDate.getTimezoneOffset()*60000)/1000
	            );
	        var oEndUTCSecond = Math.round(
	                (oEndDate.getTime() + oEndDate.getTimezoneOffset()*60000)/1000
	            );
	    }
	    else {
	        var oStartUTCSecond = '';
	        var oEndUTCSecond = ''; 
	    }
	        
	    var oImageViewer = this;
	    
	    // Load image list
	    $.ajax({
	        url: oServerSetting['server_index'],
	        dataType: 'jsonp',
	        data: ({
	            user_key: getCookie('api_key'),
	            elog_command: 'GetImageList',
	            serverurl: oServerSetting['server_index_key']+'&elog_command=GetImage&thumbnailsize='
	            +oImageViewer.getSourceThumbnailWidth()+
	            '&utctimestamp=',
	            timefrom: oStartUTCSecond,
	            timeto: oEndUTCSecond,
	            timezone: "+2:00"
	        }),
	        success: function(oData) {
	            oImageViewer.onProcessImageList(oData);
	        }
	    });
	},

	/**
	 * Query the image list by selected time range
	 * 
	 * @param {Date} oDataFrom
	 * @param {Date} oDataTo
	 */
	loadDatabyTimeDuration : function(oDataFrom, oDataTo) {
	    // Initialize data
	    this.getImages().splice(0, this.getImages().length);
	        
	    // Load image list
	    var oImageViewer = this;
	    $.ajax({
	        url: oServerSetting['server_index'],
	        data: ({
	            user_key: getCookie('api_key'),
	            elog_command: 'GetImageList',
	            serverurl: oServerSetting['server_index_key']+'&elog_command=GetImage&thumbnailsize='
	            +oImageViewer.m_iSourceThumbnailWidth+
	            '&utctimestamp=',
	            timefrom: oImageViewer.getDateString(oDataFrom),
	            timeto: oImageViewer.getDateString(oDataTo),
	            timezone: "+2:00"
	        }),
	        dataType: 'jsonp',
	        success: function(oData) {
	            oImageViewer.onProcessImageList(oData);
	        }
	    });
	},

	/**
	 * Get image list by GPS region Id
	 * 
	 * @param {Number} oRegionId
	 */
	loadSourcebyRegionCluster : function(oRegionId) {
	    // Initialize data
	    this.getImages().splice(0, this.getImages().length);
	    
	    // Load image list
	    var oImageViewer = this;
	    $.ajax({
	        url: oServerSetting['server_index'],
	        data: ({
	            user_key: getCookie('api_key'),
	            elog_command: 'GetImageListbyGPSRegionId',
	            serverurl: oServerSetting['server_index_key']+'&elog_command=GetImage&thumbnailsize='
	            +oImageViewer.m_iSourceThumbnailWidth+
	            '&utctimestamp=',
	            gpsregionid: oRegionId
	        }),
	        dataType: 'jsonp',
	        success: function(oData) {
	            oImageViewer.onProcessImageList(oData);
	        }
	    });
	}
});