/**
 * CoverFlow view.
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.media.CoverFlowView', {
 *     	fullscreen:true
 *     });
 * 
 */
Ext.define('Elog.view.panel.media.CoverFlowView', {
	extend: 'Ext.Panel',
    requires: [
       'Ext.Panel',
       'Elog.view.ui.panel.CoverFlow',
    ],
    xtype: 'elogCoverFlowView',
    config : {
    	layout: {
	        type: 'hbox',
	        align: 'stretch'
	    },
	    defaults: {
	        flex: 1
	    },
	    items: [{
    		id: 'idChildCoverFlowViewCoverFlow',
    		xtype: 'elogCoverFlow',
    	}]
    }
});
