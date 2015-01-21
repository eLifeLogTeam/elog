/**
 * A time slider showing the current selected time with the fixed start time and end time duration.
 * 
 * ## Example
 *
 *     @example preview
 *     	Ext.create('Elog.view.ui.ext.DaySliderToolbar', {
 *     });
 *     
 * 
 */
Ext.define('Elog.view.ui.ext.DaySliderToolbar', {
    extend: 'Ext.Toolbar',
    requires: [
       'Ext.Toolbar',
       'Elog.view.ui.ext.SensorStatisticsDataView'
    ],
    mixins: ['Elog.view.ui.Mixin'],
    xtype: 'elogDaySliderToolbar',
    config : {
        // docked: 'bottom',
        items: [{
        	id: 'idChildTimeSliderToolbarSetTimeRange',
        	align: 'left',
            width: '5%',
            iconCls: 'time',
            handler: function() {
            	var oApiBase = new Elog.api.Base();
            	var oChildTimeSliderToolbarSetTimeRange = this;
            	var oTimeSliderToolbar = this.getParent();
                
            	var oMenus = Ext.Viewport.getMenus();
            	if (oMenus.hasOwnProperty('bottom') && oMenus['bottom'] != null) {
	            	Ext.Viewport.toggleMenu('bottom');
            	}
        	},
        },{
            xtype: 'textfield',
            id: 'idChildTimeSliderToolbarStartTime',
            name: 'Start',
            label: '',
            // labelCls: 'TimeSliderLabel',
            // cls: 'smallSizeTextFont',
        	labelWrap: true,
            // style: 'font: 12px Arial black',
            // value: new Date(2013,8-1,6,20,0,1), 
            value: new Date(2014,8-1,12,0,0,1), 
            width: '1%',
            hidden: true,
            listeners: {
            	initialize: function () {
            		var oApiBase = new Elog.api.Base();
            		if (typeof oApiBase.getCookie('elogStartTime') !== "undefined") {
            			this.setValue(oApiBase.getCookie('elogStartTime'));
                	}
                	else {
                		oApiBase.setCookie("elogStartTime", this.getValue());
                	}
            	},
            	change: function(oStartTime) {
            		var oApiBase = new Elog.api.Base();
            		oApiBase.setCookie("elogStartTime", this.getValue());
            		
            		// Fire event. Receiver should read the cookie value.
            		// this.getParent().fireEvent('timerangechange', this);
            		
            		if (typeof oStartTime.getParent() !== "undefined") {
            			oStartTime.getParent().fireElogEvent({
		    				eventName: 'timerangechange', 
		    				eventConfig: {
		    					unixTimestamp: oStartTime,
		    					caller: oStartTime.getParent(),
		    				}
		    			});
            		}
            	}
            }
        },{
        	xtype: 'spacer',
        },{
    		id: 'idChildTimeSliderToolbarTimeSlider',
            xtype: 'sliderfield',
            value: 0,
            // minValue: new Date(2013,8-1,6,20,0,1).getTime(),
	        // maxValue: new Date(2013,8-1,6,20,09,59).getTime(),
    		minValue: new Date(2014,8-1,12,0,0,1).getTime(),
	        maxValue: new Date(2014,8-1,12,23,59,59).getTime(),
    		width: '40%',
	        listeners: {
		    	initialize: function() {
		    		var oApiBase = new Elog.api.Base();
            		if (typeof oApiBase.getCookie('elogStartTime') !== "undefined") {
            			var oStartTimestamp = new Date(oApiBase.getCookie('elogStartTime'));
						var oStartUnixtime = parseInt(oStartTimestamp.getTime());
						var oEndTimestamp = new Date(oApiBase.getCookie('elogEndTime'));
						var oEndUnixtime = parseInt(oEndTimestamp.getTime());
			
						// Use millisecond resolution for the slider
            			this.setMinValue(oStartUnixtime);
            			this.setMaxValue(oEndUnixtime);
                		this.setValue(oStartUnixtime);
                	}
                	else {
                		oApiBase.setCookie("elogStartTime", this.getValue());
                	}
	    		},
	    		
	    		/** 
	    		 * 'change' event fires when dragging stops
	    		 */
	    		change: function(oTimeSlider) {
	    			// fireEvent
	    			if (typeof oTimeSlider.getParent() !== "undefined") {
	    				var oSlider = oTimeSlider.getParent();
	    				
	    				// Convert millisecond to second
	    				var oUnixTimestamp = parseInt(parseFloat(oTimeSlider.getValue())/1000.);
	    				oSlider.setCurrentUnixTimestamp(oUnixTimestamp);
	    				oSlider.fireElogEvent({
		    				eventName: 'timechange', 
		    				eventConfig: {
		    					unixTimestamp: oUnixTimestamp,
		    					caller: oSlider,
		    				}
		    			});
		    			
		    			var oChildTimeSliderToolbarSelectedTime = Ext.getCmp('idChildTimeSliderToolbarSelectedTime');
		    			if (typeof oChildTimeSliderToolbarSelectedTime !== "undefined") {
		    				var oSelectedTime = new Date(oUnixTimestamp*1000);
		    				oChildTimeSliderToolbarSelectedTime.setValue(oSelectedTime);
		    			}
	    			}
	    		},
	    		/**
	    		 * 'drag' event continuly fires during dragging
	    		 */
	        	drag: function(oTimeSlider) {
	        		var oCurrentDate = new Date(parseInt(oTimeSlider.getValue()));
	    			// oTimeSlider.setLabel(oCurrentDate.toString());
	    			
	    			if (typeof oTimeSlider.getParent() !== "undefined") {
	    				var oSlider = oTimeSlider.getParent();
	    				
	    				// Convert millisecond to second
	    				var oUnixTimestamp = parseInt(parseFloat(oTimeSlider.getValue())/1000.);
	    				oSlider.fireElogEvent({
		    				eventName: 'timechange', 
		    				eventConfig: {
		    					unixTimestamp: oUnixTimestamp,
		    					caller: oSlider,
		    				}
		    			});
		    			
		    			var oChildTimeSliderToolbarSelectedTime = Ext.getCmp('idChildTimeSliderToolbarSelectedTime');
		    			if (typeof oChildTimeSliderToolbarSelectedTime !== "undefined") {
		    				var oSelectedTime = new Date(oUnixTimestamp*1000);
		    				oChildTimeSliderToolbarSelectedTime.setValue(oSelectedTime);
		    			}
	    			}
	    		},	    		
			}
	    },{ 
            xtype: 'textfield',
            id: 'idChildTimeSliderToolbarSelectedTime',
            align: 'right',
            name: 'End',
            width: '45%',
            label: '',
            // labelCls: 'smallSizeTextFont',
            // cls: 'smallSizeTextFont',
        	labelWrap: true,
            // style: 'font: 12px Arial black',
            // value: new Date(2013,8-1,6,20,09,59), 
            value: new Date(2014,8-1,12,23,59,59)
        },{
        	xtype: 'spacer',
        },{ 
            xtype: 'textfield',
            id: 'idChildTimeSliderToolbarEndTime',
            align: 'right',
            name: 'End',
            width: '1%',
            hidden: true,
            label: '',
            // labelCls: 'smallSizeTextFont',
            // cls: 'smallSizeTextFont',
        	labelWrap: true,
            // style: 'font: 12px Arial black',
            // value: new Date(2013,8-1,6,20,09,59), 
            value: new Date(2014,8-1,12,23,59,59), 
            listeners: {
            	initialize: function (oEndTime) {
        			var oApiBase = new Elog.api.Base();
            		if (typeof oApiBase.getCookie('elogEndTime') !== "undefined") {
            			oEndTime.setValue(oApiBase.getCookie('elogEndTime'));
            		}
                	else {
                		oApiBase.setCookie("elogEndTime", this.getValue());
                	}
            	},
            	change: function(oEndTime) {
        			var oApiBase = new Elog.api.Base();
        			oApiBase.setCookie("elogEndTime", oEndTime.getValue());
        			
            		// Fire event. Receiver should read the cookie value.
            		// this.fireEvent('timerangechange', this);
            		if (typeof oEndTime.getParent() !== "undefined") {
            			oEndTime.getParent().fireElogEvent({
		    				eventName: 'timerangechange', 
		    				eventConfig: {
		    					unixTimestamp: oEndTime,
		    					caller: oEndTime.getParent(),
		    				}
		    			});
            		}
        		}
            }
        },{ 
            xtype: 'button',
            align: 'right',
            width: '7%',
            id: 'idChildTimeSliderToolbarSearch',
            iconCls: 'search',
        }]   
    },
    
    listeners: {
    	// XXX This function is not called.
    	initialize: function() {
    		this.setTimeSliderToolbarConfig();
    	},
    },
    
    getStartTime: function() {
    	var oSlider = this;
    	
		var oChildTimeSliderToolbarStartTime = oSlider.getItems().get("idChildTimeSliderToolbarStartTime");
		
		return oChildTimeSliderToolbarStartTime.getValue();
    },
    
    getEndTime: function() {
    	var oSlider = this;
    	
		var oChildTimeSliderToolbarEndTime = oSlider.getItems().get("idChildTimeSliderToolbarEndTime");
		
		return oChildTimeSliderToolbarEndTime.getValue();
    },
    
    getValue: function() {
    	var oSlider = this;
    	
		var oChildTimeSliderToolbarTimeSlider = oSlider.getItems().get('idChildTimeSliderToolbarTimeSlider');
		
		return oChildTimeSliderToolbarTimeSlider.getValue();
    },
    
    /**
     * 
     * @param {} oNewTime Unixtimestamp
     * @return {}
     */
    setValue: function(oNewTime) {
    	var oSlider = this;
    	
		var oChildTimeSliderToolbarTimeSlider = oSlider.getItems().get('idChildTimeSliderToolbarTimeSlider');
		
		return oChildTimeSliderToolbarTimeSlider.setValue(oNewTime);
    },
    
    onTimeChange : function(oEventConfig) {
		var oUnixTimestamp = oEventConfig.unixTimestamp;
    	var oSlider = this;
    	
    	if (parseInt(oSlider.getCurrentUnixTimestamp()) != oUnixTimestamp) {
    		oSlider.setCurrentUnixTimestamp(oUnixTimestamp);
        
    		oSlider.setValue(oUnixTimestamp*1000);
    	}
    },
    
    onTimeRangeChange: function() {
    	this.setTimeSliderToolbarConfig();
    },
    
    setTimeSliderToolbarConfig: function() {
    	var oSlider = this;
    	oSlider.getTimeRangeFromCookie();
    	
		var oChildTimeSliderToolbarStartTime = oSlider.getItems().get('idChildTimeSliderToolbarStartTime');
		var oChildTimeSliderToolbarEndTime = oSlider.getItems().get('idChildTimeSliderToolbarEndTime');
		var oChildTimeSliderToolbarTimeSlider = oSlider.getItems().get('idChildTimeSliderToolbarTimeSlider');
		var oChildTimeSliderToolbarSelectedTime = oSlider.getItems().get('idChildTimeSliderToolbarSelectedTime');
							
    	// Initialize the value to the start time
    	oChildTimeSliderToolbarStartTime.setValue(oSlider.getStartTimestamp());
    	oChildTimeSliderToolbarEndTime.setValue(oSlider.getEndTimestamp());
    	oChildTimeSliderToolbarSelectedTime.setValue(oSlider.getStartTimestamp());
    	
    	oChildTimeSliderToolbarTimeSlider.setMinValue(oSlider.getStartUnixtime()*1000);
    	oChildTimeSliderToolbarTimeSlider.setMaxValue(oSlider.getEndUnixtime()*1000);
    	oChildTimeSliderToolbarTimeSlider.setValue(oSlider.getStartUnixtime()*1000);
    },
});