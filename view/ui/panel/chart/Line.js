/**
 * This is the UI panel class to draw a line chart.
 * 
 */
Ext.define('Elog.view.ui.panel.chart.Line', {
    // extend: 'Ext.Container',
    extend: 'Elog.view.ui.panel.chart.Base',
    config : {
		listeners: {
    		// Other events like 'initialize', 'render' and 'show' will not fire  for Ext.Panel objects.
    		painted: function (oContainer, opts) {
    			// this.onPainted(oContainer, opts);
	    	}
    	}
    }
});