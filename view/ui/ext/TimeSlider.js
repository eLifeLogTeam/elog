/**
 * A slider UI designed for time selection.
 * 
 * ## Example
 *
 *     @example preview
 *     	Ext.create('Elog.view.ui.ext.TimeSlider', {
 *     });
 * 
 */
Ext.define('Elog.view.ui.ext.TimeSlider', {
    extend: 'Ext.field.Slider',
    requires: [
       'Ext.field.Slider'
    ],
    mixins: ['Elog.view.ui.Mixin'],
    xtype: 'elogTimeSlider',
    config : {
		label: new Date(2013,8-1,6,20,0,1).toString(),
        labelCls: 'timeSliderLabel',
        labelWrap: true,
        value: 0,
        width: '100%',
        minValue: new Date(2013,8-1,6,20,0,1).getTime(),
        maxValue: new Date(2013,8-1,6,20,09,59).getTime(),
        listeners: {
	    	initialize: function() {
	    		this.setTimeSliderConfig();
    		},
    		
    		/** 
    		 * 'change' event fires when dragging stops
    		 */
    		change: function() {
    			// fireEvent
    			this.fireElogEvent({
    				eventName: 'timechange', 
    				eventConfig: {
    					unixTimestamp: parseInt(parseFloat(this.getValue())/1000.),
    					caller: this,
    				}
    			});
    		},
    		/**
    		 * 'drag' event continuly fires during dragging
    		 */
        	drag: function() {
        		var oCurrentDate = new Date(parseInt(this.getValue()));
    			this.setLabel(oCurrentDate.toString());
    			this.fireElogEvent({
    				eventName: 'timechange', 
    				eventConfig: parseInt(parseFloat(this.getValue())/1000.),
    			});
    		},	    		
		}
    },
    
    onTimeChange : function(oEventConfig) {
		var oUnixTimestamp = oEventConfig.unixTimestamp;
    	if (parseInt(this.getCurrentUnixTimestamp()) != oUnixTimestamp) {
    		this.setCurrentUnixTimestamp(oUnixTimestamp);
        
	        var oViewer = this;
	        
	        oViewer.setValue(oUnixTimestamp*1000);
	        
	        var oCurrentDate = new Date(parseInt(oViewer.getValue()));
    		oViewer.setLabel(oCurrentDate.toString());
	        
	        return true;
    	}
    },
    
    onTimeRangeChange: function() {
    	this.setTimeSliderConfig();
    },
    
    setTimeSliderConfig: function() {
    	var oSlider = this;
    	oSlider.getTimeRangeFromCookie();
    	
    	oSlider.setMinValue(oSlider.getStartUnixtime());
    	oSlider.setMaxValue(oSlider.getEndUnixtime());
    	// Initialize the value to the start time
    	var oCurrentDate = new Date(parseInt(oSlider.getMinValue()));
    	oSlider.setLabel(oCurrentDate.toString());
    	oSlider.setValue(oSlider.getMinValue());
    },
});