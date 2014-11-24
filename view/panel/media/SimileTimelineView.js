/**
 * eLifeLog API demo: Simile Timeline View
 * 
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.media.SimilelTimelineView', {
 *     	fullscreen:true
 *     });
 * 
 */
Ext.define('Elog.view.panel.media.SimileTimelineView', {
    extend: 'Ext.Panel',
    mixins: ['Elog.view.ui.Mixin'],
    requires: [
       'Ext.Panel',
       'Elog.view.ui.panel.div.timeline.SimileTimeline',
    ],
    xtype: 'elogSimileTimelineView',
    config : {
	    cls: 'cards',
	    layout: {
	        type: 'vbox',
	        align: 'stretch',
	    },
	    defaults: {
	        flex: 1
	    },
	    items: [{
	        id: 'idChildSimilelTimelineViewSimileTimeline',
	        xtype: 'elogSimileTimeline',
	        bandAdjustMode: 'start',
	        timezone: '+2',
	    }]
    }
});
