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
 *     	Ext.create('Elog.view.ui.ext.CEPListView', {
 *     });
 * 
 */

Ext.define('Elog.view.ui.ext.CEPListView', {
    extend: 'Elog.view.ui.ext.SensorKeyValueDataView',
    requires: [
    	'Ext.JSON',
    	'Elog.store.CEPPatternListStore',
    	'Elog.model.CEPPatternModel',
    ],
    mixins: ['Elog.view.ui.Mixin'],
    xtype: 'elogCEPListView',
    config : {
    	itemTpl: new Ext.XTemplate(
    		'<div class="elogCEPListTable">',	
    			'<div id="elogCEPListRow">',
    				'<div id="elogCEPListRight">',
	    				'<div id="elogCEPListTable">',
	    					'<div id="elogCEPListRow">',
	    						'<div id="elogCEPListRight" style="color:#3D3B80">{sensorName}</div>',
	    					'</div>',
	    				'</div>',
	    			'</div>',
	    		'</div>',
    		'</div>'
		),
    	// store: 'CEPListStore',
    	scrollable : {
    		direction : 'vertical',
    		directionLock: true
    	},
	    items: [
	    /*
	    {
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
	    		}
	    	}
		},
		
		startTimestamp: null,
		endTimestamp: null,
		dataArray: null,
		pauseEventFire: false,
		// Skip data without "status" property
		skipDataWithoutStatus: true,
		defaultStore: 'Elog.store.CEPPatternListStore',
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
				
				oViewer.getDataArray().forEach(function(oData) {
					oViewer.getStore().addData(oData);
				});
			}
			else {
				oViewer.getStore().removeAll();
				// oViewer.getStore().addData(oViewer.getDataArray());
				oViewer.getDataArray().forEach(function(oData) {
					oViewer.getStore().addData(oData);
				});
			}
			*/
			
			oViewer.getStore().sync();
			oViewer.refresh();
        };
        
    	return true; 
    },
    
    getPatternDatabySensorName: function(oPatternSensorName) {
    	var oViewer = this;
    	
    	// Find a pattern from sensorName
		var oPatternData = null;
				    		
		if (oViewer.getStore() != null && oViewer.getStore().getData() != null) {
			oViewer.getStore().getData().each(function(oData) {
				if (oPatternData == null) {
					if (oData.get("sensorName") === oPatternSensorName) {
						oPatternData = oData;
					}
				}
			});
		}
		
		return oPatternData;
    },
    
    removePatternDatabySensorName: function(oPatternSensorName) {
    	var oViewer = this;
    	
    	// Find a pattern from sensorName
		var oPatternDataId = null;
				    		
		oViewer.getStore().getData().each(function(oData, oDataId) {
			if (oPatternDataId == null) {
				if (oData.get("sensorName") === oPatternSensorName) {
					oPatternDataId = oDataId;
				}
			}
		});
		
		if (oPatternDataId != null) {
			oViewer.getStore().removeAt(oPatternDataId);
			oViewer.getStore().sync();
			oViewer.refresh();
		}
    },
});