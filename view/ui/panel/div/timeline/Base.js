/**
 * Simile Timeline viewer
 * 
 * @author pilhokim
 * 
 */
Ext.define('Elog.view.ui.panel.div.timeline.Base', {
    extend: 'Elog.view.ui.panel.div.Base',
    config : {
		sourceUrl: null
    },
    
    /**
     * Timeline query. This routine should be unified for all timeline child classes
     */
    loadSource : function(sSourceUrl) {
    	if (sSourceUrl == null) return false;
    	
        this.setSourceUrl(sSourceUrl);
        
        var oTimelineViewer = this;
        // Timeline.loadJson does not support JSONP. So it is replaced with $.ajax
        // July 7th, 2011, Pil Ho
        
        $.ajax({
            url: sSourceUrl,
            dataType: 'jsonp',
            success: function(json) {
                if (json.events !== "undefined" && json.events !== "") {
                	oTimelineViewer.onLoadSource(json);
                }
            }
        });
    },
    
    /**
     * Callback function to be called by an inherited class
     */
    onLoadSource: function(json) {
    	
    }
});