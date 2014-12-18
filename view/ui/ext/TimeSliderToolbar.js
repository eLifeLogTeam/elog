/**
 * eLifeLog API: Time slider toolbar
 * 
 * ## How to use
 * In designing the selection field in user GUI, use this field for timezone selection.
 * For instance when designing a media metadata tagger, you may use this field as time zone selector.
 * 
 * ## Example
 *
 *     @example preview
 *     	Ext.create('Elog.view.ui.ext.TimeSliderToolbar', {
 *     });
 *     
 * TODO: Add play, puase, playspeed support (26 Sep 2014)
 * 
 */
Ext.define('Elog.view.ui.ext.TimeSliderToolbar', {
    extend: 'Ext.Toolbar',
    requires: [
       'Ext.Toolbar',
       'Elog.view.ui.ext.TimeSlider',
    ],
    mixins: ['Elog.view.ui.Mixin'],
    xtype: 'elogTimeSliderToolbar',
    config : {
        // docked: 'bottom',
        items: [
        /*
        { 
            xtype: 'button',
            width: '5%',
            id: 'idChildTimeSliderToolbarStartPause',
            iconCls: 'play_black1',
            handler: function() {
            	if (this.getIconCls() == 'play_black1') {
            		this.setIconCls('pause');
            	}
            	else {
            		this.setIconCls('play_black1');
            	}
            },
        },{ 
            xtype: 'selectfield',
            width: '5%',
            id: 'idChildTimeSliderToolbarPlaySpeed',
            iconCls: 'speedometer2',
            options: [
            	{text: '1s', value: '1'},
            	{text: '2s', value: '2'},
            	{text: '10s', value: '10'},
            	{text: '30s', value: '30'},
            	{text: '1m', value: '60'},
            	{text: '2m', value: '120'},
            	{text: '10m', value: '600'},
            	{text: '30m', value: '1800'},
            	{text: '1h', value: '3600'},
            	{text: '2h', value: '7200'},
            	{text: '10h', value: '36000'},
            	{text: '30h', value: '108000'},
            ]
        },*/{
        	id: 'idChildTimeSliderToolbarSetTimeRange',
        	align: 'left',
            width: '5%',
            iconCls: 'time',
            handler: function() {
            	var oApiBase = new Elog.api.Base();
            	var oChildTimeSliderToolbarSetTimeRange = this;
            	var oTimeSliderToolbar = this.getParent();
                
        		if (!this.overlay) {
        			this.overlay = Ext.Viewport.add({
        				xtype: 'panel',
        				modal: true,
        				caller: this,
        				hideOnMaskTap: true,
       					margin: 2,
       					// draggable: true,
        				showAnimation: {
        					type: 'popIn',
        					duration: 250,
        					easing: 'ease-out'
        				},
        				hideAnimation: {
        					type: 'popOut',
        					duration: 250,
        					easing: 'ease-out'
        				},
        				layout: {
					        type: 'vbox',
					        align: 'stretch'
						},
						defaults: {
					        flex: 1
					    },
        				centered: true,
        				// TODO: The calendar size should be also proportional for the desktop case. It may use the width fo the launchscreen
        				width: Ext.os.deviceType == 'Phone'? 260 : '79%',
        				height: Ext.os.deviceType == 'Phone' ? 220: '25%',
        				top: '75%',
        				left: '247px',
        				items: [{
        					xtype: 'calendar',
        					id: 'idChildTimeSliderToolbarTimeRangeSelector',
		                    viewConfig: {
		                        viewMode: 'month',
		                        weekStart: 1,
		                        value: (oApiBase.getCookie('elogStartTime')) ? (new Date(oApiBase.getCookie('elogStartTime'))) : new Date(2013,8-1,6,20,0,1),
		                        // When checking the source, viewConfig has only currentDate entity, not value
		                        currentDate: (oApiBase.getCookie('elogStartTime')) ? (new Date(oApiBase.getCookie('elogStartTime'))) : new Date(2013,8-1,6,20,0,1)
		                    },
		                    listeners: {
            					initialize: function( oCalendar, eOpts ) {
							    	// var oApiBase = new Elog.api.Base();
							    	
									if (typeof oApiBase.getCookie('elogStartTime') !== "undefined") {
										oCalendar.setValue(new Date(oApiBase.getCookie('elogStartTime')));
										oCalendar.getViewConfig.currentDate = new Date(oApiBase.getCookie('elogStartTime'));
							    	}
							    },
							    
								periodchange: function( oCalendar, minDate, maxDate, direction, eOpts ) {
									
								},
								
								selectionchange: function( oCalendar, newDate, oldDate, eOpts ) {
									var oSlider = oTimeSliderToolbar;
									// var oApiBase = new Elog.api.Base();
									
									var oStartTime = newDate;
									var oEndTime = new Date(oStartTime.toDateString());
									
									oEndTime.setHours(oEndTime.getHours()+23);
									oEndTime.setMinutes(59);
									oEndTime.setSeconds(59);
									
									var oChildTimeSliderToolbarStartTime = oSlider.getItems().get("idChildTimeSliderToolbarStartTime");
									var oChildTimeSliderToolbarTimeSlider = oSlider.getItems().get('idChildTimeSliderToolbarTimeSlider');
									var oChildTimeSliderToolbarEndTime = oSlider.getItems().get('idChildTimeSliderToolbarEndTime');
										
									oChildTimeSliderToolbarStartTime.setValue(oStartTime);
									oChildTimeSliderToolbarEndTime.setValue(oEndTime);
									oChildTimeSliderToolbarTimeSlider.setValue(oStartTime.getTime());
									
									oApiBase.setCookie("elogStartTime", oStartTime);
									oApiBase.setCookie("elogEndTime", oEndTime);
									
									oChildTimeSliderToolbarSetTimeRange.overlay.hide();
								},
		                    }
        				}]
        			});
        		}
        		
        		this.overlay.show();
        	},
        },{
            xtype: 'textfield',
            id: 'idChildTimeSliderToolbarStartTime',
            name: 'Start',
            label: '',
            // labelCls: 'timeSliderLabel',
            // cls: 'smallSizeTextFont',
        	labelWrap: true,
            // style: 'font: 12px Arial black',
            // value: new Date(2013,8-1,6,20,0,1), 
            value: new Date(2014,8-1,12,0,0,1), 
            width: '20%',
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
    		width: '35%',
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
	    			}
	    		},	    		
			}
	    },{
        	xtype: 'spacer',
        },{ 
            xtype: 'textfield',
            id: 'idChildTimeSliderToolbarEndTime',
            align: 'right',
            name: 'End',
            width: '20%',
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
			
    	// Initialize the value to the start time
    	oChildTimeSliderToolbarStartTime.setValue(oSlider.getStartTimestamp());
    	oChildTimeSliderToolbarEndTime.setValue(oSlider.getEndTimestamp());
    	
    	oChildTimeSliderToolbarTimeSlider.setMinValue(oSlider.getStartUnixtime()*1000);
    	oChildTimeSliderToolbarTimeSlider.setMaxValue(oSlider.getEndUnixtime()*1000);
    	oChildTimeSliderToolbarTimeSlider.setValue(oSlider.getStartUnixtime()*1000);
    },
});