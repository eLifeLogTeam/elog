/**
 * Image UI base class
 * 
 * ## How to use
 * Use this class as the base of any canvas-based Image type object. This class is specialized for drawing image
 * contents on the canvas object.
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.ui.panel.div.canvas.image.Base', {
 *     	sourceUrl: 'resources/images/lifelog_sample.png'
 *     });
 */
Ext.define('Elog.view.ui.panel.div.canvas.image.Base', {
    extend: 'Elog.view.ui.panel.div.canvas.Base',
    xtype: 'elogImageBase',
    config : {
		sourceUrl: null,
		timestamp: null,
		image: null,
		keepRatio: true, 
		displayOffset: 5,
		displayRegion: null,
		/**
		 * Status to show the image metadata
		 */
		showMetadata: true
    },
    
	initialize: function() {
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
	},
    
	init: function() {
		this.callParent();
	},
	
    /**
     * Load the image data from the URL source
     */
    loadSource : function(sSourceUrl) {
        this.setSourceUrl(sSourceUrl);
        
        if (this.getCanvas() == null) {
        	this.setCanvas(this.getDivElement());
        	this.setCanvasContext(this.getCanvas().getContext("2d")); 
        }

        this.getCanvas().width = this.element.getWidth();
        this.getCanvas().height = this.element.getHeight();
        
    	this.setImage(new Image());
	    
	    // Set image source
	    this.getImage().src = sSourceUrl;
	    var oImageViewer = this;
	    
	    this.getImage().onload = function() {
	    	oImageViewer.setDisplayRegion(oImageViewer.calculateDisplayRegion({
	    		image: this,
	    		canvas: oImageViewer.getCanvas(),
	    		keepRatio: oImageViewer.getKeepRatio(),
	    		offset: oImageViewer.getDisplayOffset()
	    	}));
		    
	        // Draw image
	    	var oRegion = oImageViewer.getDisplayRegion();
	    	oImageViewer.getCanvasContext().drawImage(
				this, oRegion.x, oRegion.y, oRegion.width, oRegion.height
	        );
	    	
	    	// Display metadata
	    	if (oImageViewer.getShowMetadata()) {
		    	oImageViewer.displayMetadata({
	    			canvas: oImageViewer.getCanvas(),
	    			data: sSourceUrl,
	    			offset: oImageViewer.getDisplayOffset(),
	    			region: oRegion
	    		});
	    	}
	    };
    },
    

    /**
     * Load the image data from the server by timestamp
     */
    loadMediaByTimestamp : function(sTimestamp) {
        this.setSourceUrl(sSourceUrl);
        
        if (this.getCanvas() == null) {
        	this.setCanvas(this.getDivElement());
        	this.setCanvasContext(this.getCanvas().getContext("2d")); 
        }

        this.getCanvas().width = this.element.getWidth();
        this.getCanvas().height = this.element.getHeight();
        
    	this.setImage(new Image());
	    
	    // Set image source
	    this.getImage().src = sSourceUrl;
	    var oImageViewer = this;
	    
	    this.getImage().onload = function() {
	    	oImageViewer.setDisplayRegion(oImageViewer.calculateDisplayRegion({
	    		image: this,
	    		canvas: oImageViewer.getCanvas(),
	    		keepRatio: oImageViewer.getKeepRatio(),
	    		offset: oImageViewer.getDisplayOffset()
	    	}));
		    
	        // Draw image
	    	var oRegion = oImageViewer.getDisplayRegion();
	    	oImageViewer.getCanvasContext().drawImage(
				this, oRegion.x, oRegion.y, oRegion.width, oRegion.height
	        );
	    	
	    	// Display metadata
	    	if (oImageViewer.getShowMetadata()) {
		    	oImageViewer.displayMetadata({
	    			canvas: oImageViewer.getCanvas(),
	    			data: sSourceUrl,
	    			offset: oImageViewer.getDisplayOffset(),
	    			region: oRegion
	    		});
	    	}
	    };
    },
    
    /**
     * Calculate the image position by the option
     * 
     * @param {Object} cfg
     * @param {Object} cfg.image Javascript Image object
     * @param {Object} cfg.canvas Javascript Canvas object
     * @param {Boolean} cfg.keepRatio Boolean to keep the ratio or not. If false, then the image is stretch to fill up the canvas
     * @param {Number} cfg.offset Offset value from the canvas boundary
     */
    calculateDisplayRegion : function(cfg) {
    	var oImage = cfg.image, oCanvas = cfg.canvas, oKeepRatio = cfg.keepRatio, oOffset = cfg.offset;
    	var oX, oY, oWidth, oHeight;
	    
	    // Check display image ratio
	    if (oKeepRatio == true) {
	    	if (parseFloat(oImage.height) / parseFloat(oImage.width) < 
	    		parseFloat(oCanvas.height) / parseFloat(oCanvas.width)) {
	    		// Fill width
	    		oWidth = parseInt(oCanvas.width - 2*oOffset);
		    	oHeight = parseInt(oWidth*oImage.height/oImage.width);
		    	
		    	oX = oOffset;
		    	oY = parseInt((oCanvas.height - oHeight)/2);
	    	}
	    	else {
	    		// Fill height
	    		oHeight = parseInt(oCanvas.height - 2*oOffset);
	    		oWidth = parseInt(oHeight*oImage.width/oImage.height);
		    	
		    	oY = oOffset;
		    	oX = parseInt((oCanvas.width - oWidth)/2);
	    	}		    	
	    }
	    else {
	    	// Stretch the image
	    	oWidth = oCanvas.width - 2*oOffset;
	    	oHeight = oCanvas().height - 2*oOffset;
	    }
	    
	    return {
	    	x : oX,
	    	y : oY,
	    	width: oWidth,
	    	height: oHeight
	    };
    },

    /**
	 * Display image metadata 
	 * 
	 * @param {Object} cfg
     * @param {Object} cfg.canvas Javascript Canvas object
     * @param {String} cfg.data Metadata to display
     * @param {Number} cfg.offset Offset value from the canvas boundary
     * @param {Object} cfg.region An objct composed of {x, y, width, height}. May use the return object of calculateDisplayRegion
     * 
     */
	displayMetadata : function(cfg) {
		var oCanvas = cfg.canvas;
		var oContext = oCanvas.getContext("2d");
		var oData = cfg.data;
		var oOffset = cfg.offset;
	    
	    // Backup styles
	    var oFillStyle = oContext.fillStyle;
	    var oStrokeStyle = oContext.strokeStyle;
	    
	    oContext.lineWidth=1;
	    //oContext.fillStyle="#0000ff";
	    oContext.fillStyle="yellow";
	    oContext.strokeStyle="black";
	    // oContext.strokeWidth="1px";
	    // oContext.font = "bold 12pt arial";
	    oContext.font = "bold 20px sans-serif";
	    
	    // oContext.fillStyle="#ff0000";
	    // oContext.shadowColor="#888888";
	    // oContext.shadowOffsetX=2;
	    // oContext.shadowOffsetY=2;
	    //oContext.shadowBlur=10;
	    
	    var oTextWidth = oContext.measureText(oData).width;
	    var textPt;
	    
	    if (typeof cfg.region != "undefined") {
	    	textPt = {
	    		x: cfg.region.x + cfg.region.width - oTextWidth - 3 - oOffset,
	    		y: cfg.region.y + cfg.region.height - 15 - oOffset
    		};
	    	
	    }
	    else {
	    	textPt = {
	    		x: oCanvas.width - oTextWidth - 3 - oOffset,
	    		y: oCanvas.height - 15 - oOffset
    		};
	    }

    	oContext.fillText(oData, textPt.x, textPt.y);
    	oContext.strokeText(oData, textPt.x, textPt.y);
	    
	    // Recover styles
	    oContext.fillStyle = oFillStyle;
	    oContext.strokeStyle = oStrokeStyle;
	},
	
	/**
	 * Display text. Simpler method than displayMetadata
	 * 
	 * @param {String} sText Text to display
     */
	displayText : function(sText) {
		this.displayMetadata({
			canvas: this.getCanvas(),
			data: sText,
			offset: this.getDisplayOffset(),
			region: this.getDisplayRegion() 
		});
	}
});