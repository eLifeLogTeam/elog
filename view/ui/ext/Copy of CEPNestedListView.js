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
 *	@example preview
 *		Ext.create('Elog.view.ui.ext.CEPNestedListView', {
 *	});
 * 
 */
 
Ext.define('SensorListItem', {
	extend: 'Ext.data.Model',
	xtype: 'elogCEPNestedListModel',
	config: {
		idProperty: 'sensorName',
		identifier: 'uuid',
	    fields: [{
	    	name: 'sensorName',
	    	type: 'string'
	    },{
			name: 'inputSensors',
			type: 'string',
		},{
			name: 'query',
			type: 'string',
		},{
			name: 'eml_event_timestamp',
			type: 'string',
		},{
			name: 'iconDiv',
			type: 'string',
		}]
	}
});

Ext.define('Elog.view.ui.ext.CEPNestedListView', {
    // extend: 'Elog.view.ui.ext.SensorKeyValueDataView',
    extend: 'Ext.NestedList',
    requires: [
    	'Ext.JSON'
    ],
    mixins: ['Elog.view.ui.Mixin'],
    xtype: 'elogCEPNestedListView',
    config : {
    	// store: null,
    	displayField: 'sensorName',
    	scrollable : {
    		direction : 'vertical',
    		directionLock: true
    	},
	    items: [],
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
	    		}
	    	}
		},
		
		startTimestamp: null,
		endTimestamp: null,
		dataArray: null,
		pauseEventFire: false,
		// Skip data without "status" property
		skipDataWithoutStatus: false,
    },
	
	/**
	 * Load data. The result is the output of the oMedia.getSensorDatabyTimeSpan() call.
	 * 
	 * @param {JSONObject} oResult The output of the oMedia.getSensorDatabyTimeSpan
	 */
    loadData : function(oResult) {	
    	var oViewer = this;
    	// return;
    	// var oDataArray = new Array();
    	
    	this.setDataArray(new Array());
    	var oBaseUtil = new Elog.api.Base();
		if (typeof oResult.root !== 'undefined') {
			oResult.root.forEach(function(oData, i) {
				if (oViewer.getSkipDataWithoutStatus()) {
					if (oData.hasOwnProperty("query")) {
						oViewer.setDataArray(oViewer.getDataArray().concat(oData));
					}
				}
				else {
					oViewer.setDataArray(oViewer.getDataArray().concat(oData));
				}
			});
			
			// Adding causes the stack of data
			// It should replace.
			var newSensorDataArray = {
				sensorName: 'Sensors',
	    		childSensors: oViewer.getDataArray()
			};
			var newSensorStore = Ext.create('Ext.data.TreeStore', {
				model: 'SensorListItem',
				defaultRootProperty: 'childSensors',
				root: newSensorDataArray
			});
			oViewer.setStore(newSensorStore);
			
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
    	this.getDataArray().forEach(function(oData, i) {
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
		
//		oViewer.refresh();
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
		// oViewer.refresh();
    },
});