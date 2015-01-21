/**
 * Single image thumbnail viewer.
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.ui.panel.div.canvas.image.SingleImageThumbnail', {
 *     	fullscreen:true
 *     });
 */
Ext.define('Elog.view.ui.panel.div.canvas.image.SingleImageThumbnail', {
	extend: 'Elog.view.ui.panel.div.canvas.image.Thumbnail',
    xtype: 'elogSingleImageThumbnail',
    config : {
		name: 'idSingleImageThumbnail',
    	
        /**
         * The count of image to display in one row
         */
        thumbnailRowCount : 7,
        /**
         * Load images in serial to prevent heaving loading to server or skip the max concurrent connection limit
         * @type Boolean
         */
        serialImageLoading: false,
        /**
         * Serial image loading counter. Will be compared with this.getImages().length
         * @type Number
         */
        serialImageLoadingCounter: 0,
        pxBetweenTiles: 1,
        thumbnailOffset: 1,
        leftOffset: 1,
        totalRows: 0,
        bgColor: 0,
        tiledImagePath: null,
    //    zIndex: 7,
    },
	
    init: function() {
    	this.callParent();
    },

    /**
     * Retrieve image ID from the touch/mouse location
     * 
     * @param {Number} iOffsetX
     * @param {Number} iOffsetY
	 * @return {Number|Boolean} Returns the image ID or false when not found.
     */
    getCanvasIdbyOffset : function(iOffsetX, iOffsetY) {
        var oImage = null;
        
        if (this.getImages() == null) return false;
        
        for (var i = 0; i < this.getImages().length; ++i) {
            oImage = this.getImages()[i];
            
            if (iOffsetX >= oImage.contextx && iOffsetX <= oImage.contextx + oImage.width &&
                iOffsetY >= oImage.contexty && iOffsetY <= oImage.contexty + oImage.height) {
                return i;
            }
        }
        
        return false;
    },

    /**
     * Mark selected image
     * 
     * TODO: Bugs in selecting (0,0) and last row images
     */
    onCanvasSelectImage : function(iImageID) {
        if (iImageID < 0 || iImageID >= this.getImages().length) return;
        
        var oImage = this.getImages()[iImageID];
        if (!oImage) return;
        
        var iX;
        var iY;
            
        if (this.getSelectedImageId() !== false && this.getImages().length > this.getSelectedImageId()) {
            var oPrevSelectedImage = this.getImages()[this.getSelectedImageId()];
            
            var iX = oPrevSelectedImage.contextx;
            var iY = oPrevSelectedImage.contexty;
            
            this.getCanvasContext().lineWidth=1;
            this.getCanvasContext().strokeStyle="black";
            this.getCanvasContext().strokeRect(
        		iX-1, 
        		iY-1, 
        		this.getThumbnailWidth()+2, 
        		this.getThumbnailHeight()+2
    		);
        }
        
        this.setSelectedImageId(iImageID);
        
        if (typeof oImage.contextx != "undefined") {
            iX = oImage.contextx;
        }
        else return;
        
        if (typeof oImage.contexty != "undefined") {
            iY = oImage.contexty;
        }
        else return;
        
        this.getCanvasContext().lineWidth=1;
        this.getCanvasContext().strokeStyle="cyan"; 
        this.getCanvasContext().strokeRect(
    		iX-1, 
    		iY-1, 
    		this.getThumbnailWidth()+2, 
    		this.getThumbnailHeight()+2
		);
        
        // Fire event
        // this.fireEvent('selectimage', iImageID);
        
    },

    /**
     * Calculate image positions and size
     * 
     * @param {Number} iThumbnailWidth
     */
    calculateImagePosition : function(data) {
        var oControl = this;
        
        // Update the tweets in timeline
    	if (oControl.getCanvas() == null) {
            oControl.setCanvas(document.getElementById(oControl.getDivId())); 
            oControl.setCanvasContext(oControl.getCanvas().getContext("2d")); 
    	}
        
        oControl.getCanvas().width = data.imageWidth;
        oControl.getCanvas().height = data.imageHeight;
        
        oControl.setDefaultImageHeight(data.imageHeight);
		oControl.setDefaultImageWidth(data.imageWidth);
		
		oControl.setThumbnailWidth(data.thumbnailWidth);
        oControl.setThumbnailHeight(data.thumbnailHeight);
        
        // Assign canvas event handler
        this.getCanvas().caller = this;
        this.getCanvas().onmousemove = function(e) {
	        if (!e) var e = window.event;
	        
	        if (typeof this.caller != "undefined") {
	        	this.caller.onCanvasMove(e);
	        }
	    };
	    this.getCanvas().onclick = function(e) {
	        if (!e) var e = window.event;
	        
	        if (typeof this.caller != "undefined") {
	        	this.caller.onCanvasClick(e);
	        }
	    };
        
	    // Calculate the background area
	    var oLastImage = this.getImages()[this.getImages().length - 1];
	    this.setBackX(oLastImage.contextx + oLastImage.width);
	    this.setBackY(oLastImage.contexty);
	    this.setBackWidth(this.getCanvas().width - this.getBackX());
	    this.setBackHeight(this.getCanvas().height - this.getBackY());
    },
    
    /**
     * Forwarding
     * 
     * @param {} data
     * @return {}
     */
    onProcessImageList : function(data) {
    	return this.onProcessSingleImageThumbnailView(data);
    },
    
    /**
     * Process the query result to retrieve the image list
     * 
     * @param {Object} data
     */
    onProcessSingleImageThumbnailView : function(data) {
        if (data != null && data.hasOwnProperty("root")) {
            data = data.root;
            
            // Read configuration
            this.setSerialImageLoadingCounter(data.serialImageLoadingCounter);
       		this.setPxBetweenTiles(data.pxBetweenTiles);
	        this.setThumbnailOffset(data.thumbnailOffset);
	        this.setLeftOffset(data.leftOffset);
	        this.setTotalRows(data.totalRows);
	        this.setTiledImagePath(data.tiledImagePath);
        
            // Create image objects
            var oImage;
            var oStartUnixtimestamp = null;
            var oEndUnixtimestamp = null;
            var oControl = this;
            
            // Set image array
            oControl.setImages(data.images);
            
            oStartUnixtimestamp = data.images[0].unixtimestamp;
            oEndUnixtimestamp = data.images[data.images.length-1].unixtimestamp;
            
            // Load tiled image
            this.setImage(new Image());
            this.getImage().unixtimestamp = oStartUnixtimestamp;
            this.getImage().startUnixtimestamp = oStartUnixtimestamp;
            this.getImage().endUnixtimestamp = oEndUnixtimestamp;
            this.getImage().src = data.mediaUrl;
            
            this.getImage().onload = function() {
            	// Adjust convas
            	oControl.calculateImagePosition(data);
            	
            	oControl.getCanvasContext().drawImage(
            		this, 0, 0, data.imageWidth,data.imageHeight
                );
            };
        }
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
    		oImage.contextx, 
    		oImage.contexty, 
	        oImage.width,
	        oImage.height
	    );

	    // Draw image
	    this.getCanvasContext().drawImage(
    		this.getImage(), 
    		oImage.contextx, 
    		oImage.contexty,
    		oImage.width,
    		oImage.height,
	        oImage.contextx, 
    		oImage.contexty,
    		oImage.width,
    		oImage.height
	    );
	},
    
	/**
	 * Redraw the background
	 */
	redrawBackground : function() {
		var oImageViewer = this;
		
	    // Redraw the blank within thumbnail region
	    this.getCanvasContext().fillRect(
	        this.getBackX(),
	        this.getBackY(), 
	        this.getBackWidth(), 
	        this.getBackHeight()
	    );
	    
	    // Redraw outer thumbnail area
	    var iX1 = this.getThumbnailRowCount() * (this.getThumbnailWidth()+1);
	    var iWidth = this.getCanvas().width - iX1;
	    var iY1 = (this.getRowCount() + 1) * (this.getThumbnailHeight()+1);
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
});
