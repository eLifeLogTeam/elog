/**
 * Image zoom viewer
 * 
 * @author Pil Ho Kim
 * 
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.ui.panel.div.canvas.image.ZoomViewer', {
 *     	fullscreen:true
 *     });
 *
 */
Ext.define('Elog.view.ui.panel.div.canvas.image.ZoomViewer', {
    // These are all detected automatically
    // No need to use @extends, @alternateClassName, @mixin, @alias, @singleton
    extend: 'Elog.view.ui.panel.div.canvas.image.Thumbnail',
    xtype: 'elogImageThumbnailZoomViewer',
    config: {
    	name: 'idImageThumbnailZoomViewer',
    	
        /**
         * Zoom thumbnail width
         */
        zoomThumbnailWidth : 640,
        /**
         * Zoom thumbnail height
         */
        zoomThumbnailHeight : 480,
//        m_iZoomThumbnailWidth : 320,
//        m_iZoomThumbnailHeight : 240,
        /**
         * A set of occluded images by the zoomed iamge
         */
        occlucedImages : [],
        
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
         * Image thumbnail display column count
         */
        columnCount: null,
        /**
         * Image thumbnail display row count
         */
        rowCount: null
	},
	/*
	init: function() {
		this.callParent();
	},
    */
    /**
     * Call back function to invoke the selection event
     * 
     * @param {Object} e
     */
    onCanvasClick : function(e) {
    	// Calculate image Id
	    var iImageId = this.getCanvasIdbyOffset(e.offsetX, e.offsetY);
	    
        // Calculate image ID
        if (typeof this.caller != "undefined" && iImageId != null) {
        	 this.caller.onCanvasSelectImage(iImageId);
        }
    },

	/**
	 * Process double click event
	 */
	onCanvasDblClick : function(e) {
	    // Calculate image Id
		var iImageId = this.getCanvasIdbyOffset(e.offsetX, e.offsetY);
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
	    var iImageId = this.getCanvasIdbyOffset(e.offsetX, e.offsetY);
	    
	    if (iImageId != false) this.onCanvasSelectImage(iImageId);
	},

	/**
	 * Draw the zoomed image.
	 * TODO: Change this part to use the layer concept to overlay the zoomed image part
	 * TODO: Calculate the zoom image size dynamically from the loaded image size similar to Image base class.
	 */
	onCanvasSelectImage : function(iImageId) {
		if (iImageId == false) {
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
	    
        // Load full size image
        if (oImage.src.match(/width\":\"[0-9]+\",/gi)) {
			// Update URL to load the full size image
			oImage.src =  oImage.src.replace(/width\":\"[0-9]+\",/gi, "width\":null,");
		}
		else if (oImage.src.match(/width\%22:[0-9]+,/gi)) {
			// Update URL to load the full size image
			oImage.src =  oImage.src.replace(/width\%22:[0-9]+,/gi, "width\":null,");
		}
		else if (oImage.src.match(/width%22:%22[0-9]+%22,/gi)) {
			oImage.src =  oImage.src.replace(/width%22:%22[0-9]+%22,/gi, "width%22:null,");
		}
		else {
			oImage.src = oImage.src;
		}
		
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
	    
	    // Call below to use lazy loading 
	    // this.pushtoImageQueue(oImage, iImageId);
	},


	/**
	 * Calculate image positions
	 */
	calculateImagePosition : function(iThumbnailWidth) {
	    // Call parent position calculation
		this.callParent();
	    
		// Additional calculation for Zoom image handling
		
	    // Assign canvas event handler
	    var oImageViewer = this;
	    
	    this.getCanvas().caller = this;
	    this.getCanvas().onclick = function(e) {
	        if (!e) var e = window.event;
	        
	        if (typeof this.caller != "undefined") {
	        	this.caller.onCanvasClick(e);
	        }
	    };
	    this.getCanvas().ondblclick = function(e) {
	        if (!e) var e = window.event;
	        
	        if (typeof this.caller != "undefined") {
	        	this.caller.onCanvasDblClick(e);
	        }
	    };
	    
	    this.getCanvas().onmousemove = function(e) {
	        if (!e) var e = window.event;
	        
	        if (typeof this.caller != "undefined") {
	        	if (this.caller.getCheckMouseMovement() == true) {
		        	this.caller.setIsMouseIn(true);
		        	this.caller.onCanvasMove(e);
		        }
	        }
	    }; 
	    
	    this.getCanvas().onmouseout = function(e) {
	        if (!e) var e = window.event;
	        
	        if (typeof this.caller != "undefined") {
	        	if (this.caller.getCheckMouseMovement() == true) {
		        	this.caller.setIsMouseIn(false);
		        	this.caller.setCurrentZoomImageId(-1);
		            
		            // Redraw images
		        	this.caller.redrawBackground();
		        }
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
	 * Push the event to update the image list. 
	 * This is used for lazy loading that loads the thumbnail first and 
	 * then read the full image data when necessary.
	 */
	pushtoImageQueue : function(oImage, iImageId) {
	    this.setImageQueueCount(this.getImageQueueCount() + 1);
	    setTimeout(this.onUpdateImageList(oImage, iImageId), 300);
	},

	/**
	 * Update the image list when the full image is loaded
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
	    if (oImage.src.match(/width\%22:[0-9]+,/gi)) {
			// Update URL to load the full size image
			this.getZoomImage().src = oImage.src.replace(/width\%22:[0-9]+,/gi, "width\":null,");
		}
		else {
			this.getZoomImage().src = oImage.src;
		}
	    
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
	}
});