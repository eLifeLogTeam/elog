/**
 * eLifeLog API: Sensor statistics data view UI
 * 
 * This is the extension of [Sencha Touch List field](http://docs.sencha.com/touch/2.3.1/#!/api/Ext.dataview.List).
 * 
 * ## How to use
 * Call loadData to fill up the sensor statistics data.
 * 
 * ## Example
 *
 *     @example preview
 *     	Ext.create('Elog.view.ui.ext.SensorStatisticsDataView', {
 *     });
 * 
 */
Ext.define('Elog.view.ui.ext.SensorStatisticsDataView', {
    extend: 'Elog.view.ui.ext.SensorKeyValueDataView',
    requires: [
    	'Ext.JSON',
    	'Elog.store.SensorStatisticsStore',
    	'Elog.model.SensorStatisticsModel'
    ],
    mixins: ['Elog.view.ui.Mixin'],
    xtype: 'elogSensorStatisticsDataView',
    config : {
    	itemTpl: new Ext.XTemplate(
    		'<div class="elogSKVTable">',	
    			'<div id="elogSKVRow">',
    				'<div id="{iconDiv}" style="width: 50px">&nbsp;</div>',
    				// '<div id="elogSKVLeft" style="width: 50px">{sa_startTimestamp}</div>',
    				'<div id="elogSKVLeft">{[values.sa_startTimestamp.substring(0,10)]}<p>[{[values.sa_startTimestamp.substring(11,19)]} - {[values.sa_endTimestamp.substring(11,19)]}]</div>',
    				'<div id="elogSKVRight">',
	    				'<div id="elogSKVTable">',
	    					'<div id="elogSKVRow">',
	    						'<div id="elogSKVMiddle" style="color:#3D3B80">Sensor</div>',
	    						'<div id="elogSKVRight" style="color:#3D3B80">{sensor}</div>',
	    					'</div>',
	    					'<div id="elogSKVRow">', 
	    						'<div id="elogSKVMiddle"></div>',
	    						'<div id="elogSKVRight"><img src="{imageDataURI}", width="100%"></div>',
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
    	// store: 'sensorStatisticsStore',
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
		defaultStore: 'Elog.store.SensorStatisticsStore',
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
				// Select image data only
				if (typeof oData.imageDataURI !== 'undefined' && oData.imageDataURI != null) {
					oData.iconDiv = "elogSKVIcon";
					oViewer.setDataArray(oViewer.getDataArray().concat(oData));
				}
			});
			
			// Update iconDiv
			if (oViewer.getDataArray().length > 2) {
				oViewer.getDataArray()[0].iconDiv = "elogSKVIconStart";
				oViewer.getDataArray()[oViewer.getDataArray().length-1].iconDiv = "elogSKVIconEnd";
			}
			
			var newSensorStore = Ext.create(
				oViewer.getDefaultStore(), 
				{
					data: oViewer.getDataArray(),
				}
			);
			
			oViewer.setStore(newSensorStore);
			oViewer.getStore().sync();
			oViewer.refresh();
        };
        
    	return true; 
    },			
});