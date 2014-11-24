/**
 * This is the chart base class for panel style elemens.
 * 
 */
Ext.define('Elog.view.ui.panel.chart.Base', {
    // extend: 'Ext.Container',
    extend: 'Elog.view.ui.panel.Base',
    requires: [
    /*
    	'Ext.chart.Chart',
    	'Ext.chart.series.Line',
    	'Ext.chart.axis.Numeric',
    	'Ext.chart.axis.Time',
    	'Ext.chart.interactions.CrossZoom'
    */
    ],
    config : {
		cls: 'card1',
		layout: 'fit',
		items: [{
			xtype: 'toobar',
			top: 0,
			right: 0,
			zIndex: 50,
			style: {
				background: 'none'
			},
			items: [{
				xtype: 'space'	
			}]
		},{
			xtype: 'chart',
			store: 'USD2EUR',
			background: 'white',
			interactions: [{
				type: 'crosszoom',
				zoomOnPanGesture: false
			}],
			series: [{
				xtype: 'line',
				xField: 'time',
				yField: 'value',
				style: {
//					fill: Kitchensink.view.ColorPatterns.getBaseColors(0),
//					stroke: Kitchensink.view.ColorPatterns.getBaseColors(0),
					fillOpacity: 0.6,
					miterLimit: 3,
					lineCap: 'miter',
					lineWidth: 2
				}
			}],
			axes: [{
				type: 'numeric',
				position: 'left',
				fields: ['value'],
				title: {
					text: 'USD to Euro',
					fontSize: 20
				}
			},{
				type: 'time',
				dateFormat: 'Y-m-d',
				visibleRange: [0,1],
				position: 'bottom',
				fields: 'time',
				title: {
					text: 'Date',
					fontSize: 20
				}
			}]
		}],
    	listeners: {
    		initialize: function() {
    			this.callSuper();
    			var toolbar = Ext.ComponetQuery.query('toolbar', this)[0];
    			var interaction = Ext.ComponentQuery.query('interaction', this)[0];
    			
    			if (toolbar && interaction) {
    				toolbar.add(interaction.getUndoBUtton());
    			}
    		},
    		
    		destroy: function() {
    			// Destroy html element
    			/*
    			var elem = this.getDivObject();
    			if (elem) {
    				elem.parentNode.removeChild(elem);
    			}
    			*/
    		},
    		
    		// For Ext Panel, internal DIV object can only be initialized after 'painted' event.
    		// Other events like 'initialize', 'render' and 'show' will not fire  for Ext.Panel objects.
    		painted: function (oContainer, opts) {
    			this.onPainted(oContainer, opts);
	    	},
	    	
	    	/**
	    	 * TODO: We should work on this to be automatically called by MainView.js
	    	 */
	    	resize: function(oContainer, opts) {
	    		// var oObject = document.getElementById(this.getDivId());
	    	}
    	}
    }
});