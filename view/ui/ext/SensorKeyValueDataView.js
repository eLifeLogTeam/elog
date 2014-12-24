/**
 * eLifeLog API: Sensor key value data view UI
 * 
 * This is the extension of [Sencha Touch List field](http://docs.sencha.com/touch/2.3.1/#!/api/Ext.dataview.List).
 * 
 * ## How to use
 * Call loadData to fill up the sensor key value data.
 * 
 * ## Example
 *
 *     @example preview
 *     	Ext.create('Elog.view.ui.ext.SensorKeyValueDataView', {
 *     });
 * 
 */
 
/*
Ext.define('elogSensorKeyValueModel', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			'sensor',
			'eml_event_timestamp',
			'unixtimestamp',
			'newEvent',
			'oldEvent',
			'reportStatus',
			'status',
			'iconDiv'
		]
	}	
});

Ext.create('Ext.data.Store', {
	storeId: 'sensorKeyValueStore',
	model: 'elogSensorKeyValueModel',
	sorters: 'eml_event_timestamp'
});
*/

Ext.define('Elog.view.ui.ext.SensorKeyValueDataView', {
    extend: 'Ext.List',
    requires: [
    	'Ext.JSON',
    	'Elog.store.SensorKeyValueStore',
    	'Elog.model.SensorKeyValueModel'
    ],
    mixins: ['Elog.view.ui.Mixin'],
    xtype: 'elogSensorKeyValueDataView',
    config : {
    	itemTpl: new Ext.XTemplate(
    		'<div class="elogSKVTable">',	
    			'<div id="elogSKVRow">',
    				'<div id="{iconDiv}" style="width: 50px">&nbsp;</div>',
    			//	'<div id="elogSKVLeft" style="width: 50px">{[values.eml_event_timestamp.substring(0,23)]}</div>',
    				'<div id="elogSKVLeft" style="width: 50px">{[(new Date(parseInt(values.unixtimestamp)*1000))]}</div>',
    				'<div id="elogSKVRight">',
	    				'<div id="elogSKVTable">',
	    					'<div id="elogSKVRow">',
	    						'<div id="elogSKVMiddle" style="color:#3D3B80">Sensor</div>',
	    						'<div id="elogSKVRight" style="color:#3D3B80">{sensor}</div>',
	    					'</div>',
	    					'<div id="elogSKVRow">', 
	    						'<div id="elogSKVMiddle">Status</div>',
	    						'<div id="elogSKVRight">{status}</div>',
	    					'</div>',
	    				'</div>',
	    			'</div>',
	    		'</div>',
    		'</div>'
    		/*
		    ,{
		        // XTemplate configuration:
		        disableFormats: true,
		        // member functions:
		        getLineClass: function(curIndex, totalCount){
		        	if (curIndex == 0) {
		        		return 'elogSKVIconStart';
		        	}
		        	else if (curIndex == totalCount-1) {
		        		return 'elogSKVIconEnd';
		        	}
		        	
		           	return 'elogSKVIcon';
		        }
		    } */
		),
    	// store: 'sensorKeyValueStore',
    	scrollable : {
    		direction : 'vertical',
    		directionLock: true
    	},
	    items: [
	    /*{
	        xtype: 'button',
	        scrollDock: 'bottom',
	        docked: 'bottom',
	        text: 'Load More...'
	    } */
	    ],
	    listeners: {
	    	initialize: function () {
	    	    // Detect the local timezone
	    	    // this.setValue();
	    	},
	    	select: function(oList, oRecord, eOpts) {
	    		if (this.getPauseEventFire()) {
	    			this.setPauseEventFire(false);
	    		}
	    		else {
	    			this.fireEvent('itemselect', oRecord);
	    			
	    			if (oRecord.data != null && oRecord.data.hasOwnProperty("unixtimestamp")) {
	    				this.fireElogEvent({
	    					eventName: 'timechange', 
	    					eventConfig: {
	    						unixTimestamp: oRecord.data.unixtimestamp,
	    						caller: this,
	    					}
	    				});
	    			}
	    		}
	    	}
		},
		
		startTimestamp: null,
		endTimestamp: null,
		dataArray: null,
		pauseEventFire: false,
		// Skip data without "status" property
		skipDataWithoutStatus: true,
		// Default store name
		defaultStore: 'Elog.store.SensorKeyValueStore',
    },
	
	/**
	 * Load data. The result is the output of the oMedia.getSensorDatabyTimeSpan() call.
	 * 
	 * @param {JSONObject} oResult The output of the oMedia.getSensorDatabyTimeSpan
	 */
    loadData : function(oResult) {	
    	var oViewer = this;
    	// var oDataArray = new Array();
    	
    	this.setDataArray(new Array());
    	var oBaseUtil = new Elog.api.Base();
		if (typeof oResult.root !== 'undefined') {
			oResult.root.forEach(function(oData, i) {
				if (typeof oData.data !== 'undefined' && oData.data != null) {
					if (oViewer.getSkipDataWithoutStatus()) {
						if (oData.data.hasOwnProperty("status")) {
							oViewer.setDataArray(oViewer.getDataArray().concat(oData.data));
						}
					}
					else {
						oViewer.setDataArray(oViewer.getDataArray().concat(oData.data));
					}						
				}
			});
			
			// Update iconDiv
			if (oViewer.getDataArray().length > 2) {
				oViewer.getDataArray()[0].iconDiv = "elogSKVIconStart";
				oViewer.getDataArray()[oViewer.getDataArray().length-1].iconDiv = "elogSKVIconEnd";
			}
			
			// Adding causes the stack of data
			// It should replace.
			/*
			var newSensorStore = Ext.create(
				oViewer.getDefaultStore(), 
				oViewer.getDataArray()
			);
			*/
			var newSensorStore = Ext.create(
				oViewer.getDefaultStore(), 
				{
					data: oViewer.getDataArray(),
				}
			);
			
			oViewer.setStore(newSensorStore);
			
			/*
			if (oViewer.getStore() == null) {
				var newSensorStore = Ext.create(
					oViewer.getDefaultStore(), 
					oViewer.getDataArray()
				);
				oViewer.setStore(newSensorStore);
				// When adding raw data, it should use addData not add.
				oViewer.getDataArray().forEach(function(oData) {
					oViewer.getStore().addData(oData);
				});
			}
			else {
				oViewer.getStore().removeAll();
				oViewer.getDataArray().forEach(function(oData) {
					oViewer.getStore().addData(oData);
				});
				// oViewer.getStore().setData(oViewer.getDataArray());
			}
			*/
			
			oViewer.getStore().sync();
			oViewer.refresh();
        };
        
    	return true; 
    },
    
    scrollToItemId: function (oItemId) {
    	var oViewer = this;
    	
    	var oStartItem = oViewer.getItemAt(oItemId);
    	if (oStartItem != null) {
    		oViewer.scrollToRecord(oViewer.getStore().getAt(oItemId), true, false);
    		/*
    		 * This routine is natively supported by Sencha Touch 2.3 
			var itemId = oStartItem.getItemId(),
	            y;
	
	        if (itemId) {
	            y = Ext.get(itemId).dom.offsetTop;
	
	            oViewer.getScrollable().getScroller().scrollTo(0, y, true);
	        }
	        */
		}
    },
    
    scrollToSelectedUnixTimestamp : function(selectedUnixTimestamp) {
    	var oViewer = this;
    	
    	// oViewer.setStartTimestamp(selectedUnixTimestamp);
    	
    	var oStartItem = null;
    	if (oViewer.getDataArray() == null) return;
    	
    	oViewer.getDataArray().forEach(function(oData, i) {
    		if (Number(oData.unixtimestamp) >= selectedUnixTimestamp && oStartItem == null) {
    			oStartItem = i;
    		//	oViewer.scrollToItemId(i);	
    		//	oViewer.select(oViewer.getStore().getAt(i), false, true);
				oViewer.select(oViewer.getStore().getAt(i), false, true);
				oViewer.scrollToRecord(oViewer.getStore().getAt(i), true, false);
			}
		});    
		
		if (oStartItem == null) {
			oViewer.select(oViewer.getStore().getAt(oViewer.getDataArray().length-1), false, true);
			oViewer.scrollToRecord(oViewer.getStore().getAt(oViewer.getDataArray().length-1), true, false);
			// oViewer.scrollToItemId(oViewer.getDataArray().length()-1);	
		}
    },
    
    onTimeChange : function(oEventConfig) {
		var oUnixTimestamp = oEventConfig.unixTimestamp;
        if (parseInt(this.getCurrentUnixTimestamp()) != oUnixTimestamp) {
	    	this.setCurrentUnixTimestamp(oUnixTimestamp);
	        
	        var oViewer = this;
	        var oSetHereCircle = false;
	        
	        return oViewer.scrollToSelectedUnixTimestamp(oUnixTimestamp);
        }
    },
    
    selectTimeRange : function(timeFrom, timeTo) {
    	var oViewer = this;
    	
    	oViewer.setStartTimestamp(timeFrom);
    	oViewer.setEndTimestamp(timeTo);
    	
    	var iStartRecord = null;
    	var iEndRecord = null;
    	
    	oViewer.getDataArray().forEach(function(oData, i) {
    		if (Number(oData.unixtimestamp) >= timeFrom) {
    			if (iStartRecord == null) iStartRecord = i;
			}
			
			if (Number(oData.unixtimestamp) >= timeTo) {
    			if (iEndRecord == null) iEndRecord = i;
			}
		});
    	
		oViewer.setPauseEventFire(true);
		oViewer.selectRange(iStartRecord, iEndRecord);
		
		oViewer.setActiveItem(iStartRecord);
		oViewer.scrollToSelectedItem();
		
		oViewer.refresh();
    },
    
    setTimeRange : function(timeFrom, timeTo) {
    	var oViewer = this;
    	
    	oViewer.setStartTimestamp(timeFrom);
    	oViewer.setEndTimestamp(timeTo);
    	
    	oViewer.getStore().removeAll();
    	
    	var oDataArray = new Array();
    	this.getDataArray().forEach(function(oData, i) {
    		if (Number(oData.unixtimestamp) >= timeFrom &&
    			Number(oData.unixtimestamp) <= timeTo) {
    			oDataArray = oDataArray.concat(oData);		
			}
		});
    	
		oViewer.getStore().add(oViewer.getDataArray());
		
		oViewer.getStore().sync();
		oViewer.refresh();
    },
    
    insertPattern : function(oPatternData) {
    	var oViewer = this;
    	
		if (oViewer.getStore() == null) {
			var newSensorStore = Ext.create(
				oViewer.getDefaultStore(), 
				oViewer.getDataArray()
			);
			
			oViewer.setStore(newSensorStore);
		}
		
    	oViewer.getStore().add(oPatternData);
		oViewer.getStore().sync();
		oViewer.refresh();
    },
							
});