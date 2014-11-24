/**
 * This is the base class for [CANVAS](http://en.wikipedia.org/wiki/Canvas_element) typed object.
 * 
 * ## How to use
 * Use this class as the base of any [CANVAS](http://en.wikipedia.org/wiki/Canvas_element) type object. 
 * The default canvas background color is black. It internally inherits {@link Elog.view.ui.panel.div.Base DIV base} 
 * class. So you can use any functions and events from there. In other words, you should start playing 
 * with the canvas object once after the *initdiv* event.
 * 
 * TODO: Check the performance in case using http://docs.sencha.com/touch/2-1/#!/api/Ext.draw.sprite.Image here
 */
Ext.define('Elog.view.ui.panel.div.canvas.Base', {
    extend: 'Elog.view.ui.panel.div.Base',
    config : {
    	/**
    	 * Canvas object. To access the canvas call *this.getCanvas()*
    	 */
    	canvas: null,
    	/**
         * The context object of the canvas. To access this object, call *this.getCanvasContext()*.
         */
        canvasContext : null,
        
        /**
         * Be aware that this canvas DIV style is different with the parent style.
         * In case of canvas, width and height should be manually specified by the caller.
         * 
         * If you want to change the style, then call *this.setCanvasStyle('yourcanvasstyle')*.
         */
        canvasStyle: 'background-color:#000000;',
        thumbnailWidth: "128", // in pixel
    },
    
    initialize: function() {
    	if (Ext.feature.has.Canvas == false) {
    		this.logError('The current device does not support HTML5 Canvas elements');
    		return false;
    	}
    	
    	return true;
    },
    
    init: function() {
    	this.setCanvas(this.getDivObject());
    	this.setCanvasContext(this.getCanvas().getContext("2d")); 
    },
    
    // Override createObject function
    createObject : function() {
    	this.setHtml(
			'<div style="'+this.getDivStyle()+'"><canvas id="' + (this.getDivId() ? this.getDivId() : '') + '"' +
			(this.getDivClass() ? ' class="'+this.getDivClass()+'"' : '') +
			' style="'+this.getCanvasStyle()+'"></canvas></div>'
		);
    },
    
    clearCanvas: function() {
    	var ctx = this.getCanvas().getContext("2d"); 
    	// Store the current transformation matrix
		ctx.save();
		
		// Use the identity matrix while clearing the canvas
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, this.getCanvas().width, this.getCanvas().height);
		
		// Restore the transform
		ctx.restore();
    }
});