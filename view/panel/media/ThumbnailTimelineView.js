/**
 * eLifeLog API demo: Image Thumbnail View
 * 
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.media.ThumbnailTimelineView', {
 *     	fullscreen:true
 *     });
 * 
 */
Ext.define('Elog.view.panel.media.ThumbnailTimelineView', {
    extend: 'Ext.Panel',
    mixins: ['Elog.view.ui.Mixin'],
    requires: [
       'Ext.Panel',
       'Elog.view.ui.panel.div.timeline.SimileTimeline',
       'Elog.view.ui.panel.div.canvas.image.Thumbnail',
    ],
    xtype: 'elogThumbnailTimelineView',
    config : {
	    cls: 'cards',
	    layout: {
	        type: 'vbox',
	        align: 'fit',
	    },
	    defaults: {
	        flex: 1
	    },
	    items: [{
	        id: 'idChildThumbnailTimelineSimileTimeline',
	        xtype: 'elogSimileTimeline',
	        bandAdjustMode: 'start',
	        // bandInfos: new Array('70%', '10%', '10%', '10%'),
	        timezone: '+2'
	    },{
	        id: 'idChildThumbnailTimelineThumbnail',
	        xtype: 'elogImageThumbnail',
	        thumbnailRowCount: 10
	    }]
    }
});
