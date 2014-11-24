/**
 * Image region selector.
 * 
 * Mostly used to select the region of interest (ex. blur human's face)
 * 
 * Required: This routine uses jQuery keyboard and mouse event listeners
 * 
 * @author Pil Ho Kim
 *
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.ui.panel.div.canvas.image.RegionSelector', {
 *     	fullscreen:true
 *     });
 */
Ext.define('Elog.view.ui.panel.div.canvas.image.RegionSelector', {
    // These are all detected automatically
    // No need to use @extends, @alternateClassName, @mixin, @alias, @singleton
    extend: 'Elog.view.ui.panel.div.canvas.image.Base',
    xtype: 'elogImageRegionSelector',
    config: {
    	name: 'idRegionSelector',
    	/**
    	 * Region selecting starting point
    	 */
        startPt : {
        	x: 0,
        	y: 0
        },
        /**
         * Region selection finishing point
         */
    	endPt: {
    		x : 0,
    		y: 0
    	},
    	/**
    	 * Selected region area
    	 */
    	selectedRegion: {
    		x: 0,
    		y: 0,
    		width: 0,
    		height: 0
    	},
    	/**
    	 * Flag to support click-and-drag to select the region
    	 */
    	dragging : false,
    	/**
    	 * Flag to show selected region information in real time
    	 */
    	showSelectInfo: true
    },
    
    /**
     * Initialization. Set mouse interaction activities
     */
    init: function(cfg) {
    	this.callParent(cfg);
    	this.initConfig(cfg);
    	
    	var oRegionSelector = this;
	    // Set mouse event listeners        
        $('#'+this.getDivId()).hover(
	        function() {
	        	$(this).css('cursor','crosshair');
	        }, 
	        function() {
	        	$(this).css('cursor','auto');
	    	}
	    );
	    
        /*
        $('#'+this.getDivId()).mousedown(function(e) {
        	oRegionSelector.onRegionStart(e);
        });
                                    
        $('#'+this.getDivId()).mousemove(function(e) {
        	oRegionSelector.onRegionChange(e);
        });
        
        $('#'+this.getDivId()).mouseup(function(e) {
        	this.setDragging(false);
        	// oRegionSelector.onRegionEnd(e);
        });
        
        $('#'+this.getDivId()).mouseout(function(e) {
           
        });
	    */
        
	    return this;
    },

    // Clear selection
    /*
    onTap: function (event, node, options, eOpts) {
    	// alert(this.dump(event, 1));
    	this.onRegionCancel(event.event);
    },
*/
    
    // onTapHold: function (event, node, options, eOpts) {
	onDragStart: function (event, node, options, eOpts) {
    	    	// alert(this.dump(event, 1));
    	this.onRegionStart(event.event);
    },
    
	onDrag: function (event, node, options, eOpts) {
    	this.onRegionChange(event.event);
    },
    
    onDragEnd: function (event, node, options, eOpts) {
    	this.setDragging(false);
    	// onRegionEnd is not working well.
    	// this.onRegionEnd(event.event);
    },
    
    onRegionCancel: function (e) {
    	this.setDragging(false);
    	
    	this.setStartPt({x:0, y:0});
    	this.setEndPt({x:0, y:0});
    	
    	var oImageRegion = this.getDisplayRegion();
      	 
    	this.getCanvasContext().drawImage(
			this.getImage(), oImageRegion.x, oImageRegion.y, oImageRegion.width, oImageRegion.height
        );
    },
    
    onRegionStart: function (e) {
    	this.setDragging(true);
    	
    	// XXX: offsetX and offsetY are not available in Mobile Safair for iPad (Aug. 4th, 2012)
    	// XXX: So use layerX and layerY
        this.setStartPt({
        	x: e.layerX,
        	y: e.layerY
        });
    },
    
    onRegionChange: function (e) {
    	var oImageRegion = this.getDisplayRegion();
   	 
    	this.getCanvasContext().drawImage(
			this.getImage(), oImageRegion.x, oImageRegion.y, oImageRegion.width, oImageRegion.height
        );
	 
        if (this.getShowSelectInfo()) {
        	this.displayText(
    			'[x : '
        			+(e.layerX-oImageRegion.x)+', y : '
        			+(e.layerY-oImageRegion.y)
    			+']'
			);
        }
        
       if (this.getDragging() == true) {
    	   this.setEndPt({
        	   x: e.layerX,
        	   y: e.layerY
           });
           
    	   this.setCropShape(); 
           //changeCursor('crosshair', oRegionSelector);
       }
    },
    
    onRegionEnd: function (e) {        
        this.setDragging(false);
        
        this.setEndPt({
        	x: e.layerX,
        	y: e.layerY
        });
        this.setCropShape();
    },
    
    /**
     * Remove mouse point monitors
     */
    destory: function(e) {
    	// Detach mouse event listeners
        $('#'+this.getDivId()).hover(
	        function() {}, 
	        function() {}
	    );	    
        $('#'+this.getDivId()).mousedown(function(e) {});
        $('#'+this.getDivId()).mousemove(function(e) {});
        $('#'+this.getDivId()).mouseup(function(e) {});
    },
    
    /**
     * Calculate possible region to select from user inputs
     */
    calculateSelectedRegion: function() {
    	var oImageRegion = this.getDisplayRegion();

    	// First adjust point
    	this.setStartPt({
    		x: (this.getStartPt().x < oImageRegion.x) ?
				oImageRegion.x :
				(this.getStartPt().x > oImageRegion.x + oImageRegion.width) ?
					oImageRegion.x + oImageRegion.width :
					this.getStartPt().x,
			y: (this.getStartPt().y < oImageRegion.y) ?
				oImageRegion.y :
				(this.getStartPt().y > oImageRegion.y + oImageRegion.height) ?
					oImageRegion.y + oImageRegion.height :
					this.getStartPt().y
    	})
    	
    	this.setEndPt({
    		x: (this.getEndPt().x < oImageRegion.x) ?
				oImageRegion.x :
				(this.getEndPt().x > oImageRegion.x + oImageRegion.width) ?
					oImageRegion.x + oImageRegion.width :
					this.getEndPt().x,
			y: (this.getEndPt().y < oImageRegion.y) ?
				oImageRegion.y :
					(this.getEndPt().y > oImageRegion.y + oImageRegion.height) ?
						oImageRegion.y + oImageRegion.height :
						this.getEndPt().y
    	})
    	
    	this.setSelectedRegion({
    		x : (this.getStartPt().x < this.getEndPt().x) ?
				this.getStartPt().x : this.getEndPt().x,
			y : (this.getStartPt().y < this.getEndPt().y) ?
				this.getStartPt().y : this.getEndPt().y,
			width: (this.getStartPt().x - this.getEndPt().x < 0) ?
				this.getEndPt().x - this.getStartPt().x :
				this.getStartPt().x - this.getEndPt().x,
			height: (this.getStartPt().y - this.getEndPt().y < 0) ?
				this.getEndPt().y - this.getStartPt().y :
				this.getStartPt().y - this.getEndPt().y
    	});
    	
    	return this.getSelectedRegion();    	
    },
    
    /**
     * Display the region to be blurred
     * 
     * @param {Object} oSelectedRegion
     * @param {Number} oSelectedRegion.x
     * @param {Number} oSelectedRegion.y
     * @param {Number} oSelectedRegion.width
     * @param {Number} oSelectedRegion.height
     */
    setCropShape : function(oSelectedRegion) {
    	if (this.getCanvas()) {
            var cs = this.getCanvasContext();
            
            cs.clearRect(0,0,cs.width,cs.height); // clear canvas 
            
            // Draw source image into sourceContainer  
            // cs.drawImage(this.getImage(),0,0); 
            
            this.setSelectedRegion(this.calculateSelectedRegion({
	    		image: this.getImage(),
	    		canvas: this.getCanvas(),
	    		keepRatio: this.getKeepRatio(),
	    		offset: this.getDisplayOffset()
	    	}));
		    
	        // Draw image
            var oImageRegion = this.getDisplayRegion();
            this.getCanvasContext().drawImage(
				this.getImage(), oImageRegion.x, oImageRegion.y, oImageRegion.width, oImageRegion.height
	        );
            
            var oSelectedRegion = this.calculateSelectedRegion();
            
            cs.fillStyle = "rgba(200, 0, 0, 0.5)";
            cs.fillRect (oSelectedRegion.x, oSelectedRegion.y, oSelectedRegion.width, oSelectedRegion.height);
            
            if (this.getShowSelectInfo()) {
            	this.displayText(
        			'[x1 : '
            			+(oSelectedRegion.x-oImageRegion.x)+', y1 : '
            			+(oSelectedRegion.y-oImageRegion.y)+']-[x2 : '
            			+((oSelectedRegion.x-oImageRegion.x)+oSelectedRegion.width)+', y2 : '
            			+((oSelectedRegion.y-oImageRegion.y)+oSelectedRegion.height)
        			+']'
    			);
            }
        }
    }
});