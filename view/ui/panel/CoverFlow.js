/**
 * This is the UI panel class to draw a line chart.
 * 
 */
 
Ext.define('elogSensorCoverFlowModel', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			'eml_event_timestamp',
			'key_value',
			'mediaUrl',
			'sensor',
			'sensor_key',
			'unixtimestamp',
			'image'
		]
	}	
});

Ext.create('Ext.data.Store', {
	storeId: 'sensorCoverFlowStore',
	model: 'elogSensorCoverFlowModel',
	sorters: 'unixtimestamp',
});

Ext.define('Elog.view.ui.panel.CoverFlow', {
    // extend: 'Ext.Container',
    extend: 'Ext.ux.Cover',
    mixins: ['Elog.view.ui.Mixin'],
    requires: [
       'Ext.ux.Cover',
    ],
    xtype: 'elogCoverFlow',
    config : {
    	images: [],
    	cls: 'ux-background',
		
        /**
         * Status to display image metadata
         */
        showMetadata: true,
        width: '100%',
		height: '50%',
		// height: '100%',
		thumbnailWidth: '128', // in px
    	xtype: 'cover',
		zIndex: 200,
		store: 'sensorCoverFlowStore',
		dataArray: null,
		centered: true,
    	itemCls: 'my-cover-item',
    	// XXX Image URL should be named image, not as mediaUrl
        itemTpl : [
            '<div>',
                '<div class="image"><tpl if="image"><img src=\'{image}\'></tpl></div>',
                '<div class="timestamp">{[values.eml_event_timestamp.substring(0,23)]}</div>',
            '</div>'
        ],
	    items: [{
	        text: 'Loading...'
	    }],
        // selectedIndex: 2,
        listeners:{
        	scope: this,
            itemdoubletap: function(){
                // console.log('itemdbltap', arguments);
            },
            itemtap: function(cover, idx){
                // console.log('itemtap', arguments);
            },
            initialize: function () {
	    	    // Detect the local timezone
	    	    // this.setValue();
	    	},
	    	select: function(oList, oRecord, eOpts) {
	    		// this.fireEvent('itemselect', oRecord);
	    		oList.setCurrentUnixTimestamp(oRecord.getData().unixtimestamp);
	    		oList.fireElogEvent({
					eventName: 'timechange', 
					eventConfig: {
						unixTimestamp: oRecord.getData().unixtimestamp,
						caller: oList,
					}
				});
				
				// Reload the full image
				var me = oList;
				var itemIndex = oRecord.getData().xindex;
				
				oList.loadFullImage(itemIndex);
	    	},
        },
    },
    
    loadFullImage: function(itemIndex) {
    	// Reload the full image
		var me = this;
        var container = me.container;
		var item = container.getViewItems()[itemIndex];
		
		var oSelectedRecord = me.getStore().getAt(itemIndex);
		var oSelectedRecordData = oSelectedRecord.getData();
		
		// if (oSelectedRecordData.image.match("/width\":\""+this.getThumbnailWidth()+"\",/gi")) {
		if (oSelectedRecordData.image.match(/width\":\"[0-9]+\",/gi)) {
			// Update URL to load the full size image
			oSelectedRecordData.image =  oSelectedRecordData.image.replace(/width\":\"[0-9]+\",/gi, "width\":null,");
			oSelectedRecord.setData(oSelectedRecordData);
            
			// Bypassing setter because sometimes we pass the same record (different data)
            // container.updateRecord(oRecord, oRecord);
            container.updateListItem(oSelectedRecord, item);
            me.resizeItem(item);
		}
    },
    
    scrollToSelectedUnixTimestamp : function(selectedUnixTimestamp) {
    	var oViewer = this;
    	var oStartItem = null;
    	
    	if (this.getDataArray() == null) return;
    	
    	this.getDataArray().forEach(function(oData, i) {
    		if (Number(oData.unixtimestamp) >= selectedUnixTimestamp && oStartItem == null) {
    			oStartItem = i;
				oViewer.select(oViewer.getStore().getAt(i), false, true);
				
				// applySelectedIndex is Cover supported API
				oViewer.applySelectedIndex(i);
				
				oViewer.loadFullImage(i);
			}
		});    
		
		if (oStartItem == null) {
			oViewer.select(oViewer.getStore().getAt(oViewer.getDataArray().length-1), false, true);
			
			// applySelectedIndex is Cover supported API
			oViewer.applySelectedIndex(oViewer.getDataArray().length-1);
				
			oViewer.loadFullImage(oViewer.getDataArray().length-1);
		}
    },
    
    onTimeChange : function(oEventConfig) {
		var oUnixTimestamp = oEventConfig.unixTimestamp;
        if (parseInt(this.getCurrentUnixTimestamp()) != oUnixTimestamp) {
	    	this.setCurrentUnixTimestamp(oUnixTimestamp);
	        
	        var oViewer = this;
	    	var oStartItem = null;
	    	
	    	return oViewer.scrollToSelectedUnixTimestamp(oUnixTimestamp);
        }
    },
    
    /**
     * laodData. Created for the compatibility
     * @param {} data
     */
    loadData: function(data) {
    	this.onProcessImageList(data);
    },

    /**
     * Process the query result to retrieve the image list
     * 
     * @param {Object} data
     */
    onProcessImageList : function(oResult) {
    	var oViewer = this;
    	
        this.setDataArray(new Array());
    	var oBaseUtil = new Elog.api.Base();
		if (typeof oResult.root !== 'undefined') {
			oResult.root.forEach(function(oData, i) {
				oData.unixtimestamp = parseInt(oData.unixtimestamp);
				oData.mediaUrl = oData.mediaUrl;
				// oData.image = encodeURI(oData.mediaUrl);
				
				if (typeof oData.image == "undefined") {
					oData.image = oData.mediaUrl;
				}
				oViewer.setDataArray(oViewer.getDataArray().concat(oData));
			});
			
			// Adding causes the stack of data
			// It should replace.
			oViewer.getStore().removeAll();
			oViewer.getStore().addData(oViewer.getDataArray());
			
			oViewer.getStore().sync();
			oViewer.refresh();
        }
    }
});