/**
 * eLifeLog API demo: Time range selector
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.data.TimeRangeSelector', {
 *     	fullscreen:true
 *     });
 */
Ext.define('Elog.view.panel.data.TimeRangeSelector', {
    extend: 'Elog.view.panel.Base',
    requires: [
       'Elog.view.ui.panel.div.timeline.SimileTimeline',
       'Elog.view.ui.ext.MediaTypeCheckboxPanel'
    ],
    xtype: 'elogTimeRangeSelector',
    config : {
    	layout: {
	        type: 'vbox',
	        align: 'stretch'
		},
		defaults: {
	        flex: 1
	    },
        items: [{
			docked: 'top',
			xtype: 'titlebar',
			title: 'Select a time range bar below or select All on the right',
			// Insert media selector
			items: [{
            	text: 'Sources',
                align: 'left',
                id: 'idElogSetSources',
            	handler: function() {
            		if (!this.overlay) {
            			this.overlay = Ext.Viewport.add({
            				xtype: 'panel',
            				modal: true,
            				hideOnMaskTap: true,
           					margin: 2,
            				showAnimation: {
            					type: 'popIn',
            					duration: 250,
            					easing: 'ease-out'
            				},
            				hideAnimation: {
            					type: 'popOut',
            					duration: 250,
            					easing: 'ease-out'
            				},
            				layout: {
						        type: 'vbox',
						        align: 'stretch'
							},
							defaults: {
						        flex: 1
						    },
            				centered: true,
            				width: Ext.os.deviceType == 'Phone'? 200 : '40%',
            				height: Ext.os.deviceType == 'Phone' ? 220: '50%',
            				items: [{
            					xtype: 'elogMediaTypeCheckboxPanel',
            					id: 'idElogMediaTypeCheckBoxPanel'
            				}]
            			});
            		}
            		
            		this.overlay.show();
            	}
            },{
            	text: 'All',
                align: 'right',
                id: 'idElogSelectAllTimeRange'
            }]
		},{
			xtype: 'elogSimileTimeline',
			id: 'idElogTimeRangeSelectorTimelineViewer'
		}]
    }
});