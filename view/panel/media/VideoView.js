/**
 * Video view.
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.media.VideoView', {
 *     	fullscreen:true
 *     });
 * 
 */
Ext.define('Elog.view.panel.media.VideoView', {
	extend: 'Elog.view.ui.panel.Base',
    requires: [
       'Elog.view.ui.panel.Base',
       'Elog.view.ui.ext.Video',
       'Elog.view.ui.panel.CoverFlow',
    ],
    xtype: 'elogVideoView',
    config : {
	    layout: {
			type: 'vbox',
			align: 'stretch',
		},
        items: [
        {
    		id: 'idChildVideoViewVideo',
    	//	centered: true,
    	//	width: '100%',
    	//	height: '100%',
        	xtype: 'elogVideo',
    	//	zIndex: 200,
    		flex: 5,
	    },{
	        layout: {
		        type: 'hbox',
		        align: 'stretch'
		    },
		    flex: 2,
		    defaults: {
		        flex: 1
		    },
		    items: [{
	    		id: 'idChildVideoViewCoverFlow',
	    		xtype: 'elogCoverFlow',
	    		width: '100%',
				height: '100%',
				flat: true,
	    	}]
    	}
    	]
    }
});
