/**
 * eLifeLog API demo Eml Graph View
 * 
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.eml.EmlGraphView', {
 *     	fullscreen:true
 *     });
 * 
 */
Ext.define('Elog.view.panel.eml.EmlGraphView', {
    extend: 'Elog.view.panel.Base',
    requires: [
       'Ext.Panel',
       'Ext.form.Panel',
       'Ext.form.FieldSet',
       'Ext.field.Spinner',
       'Elog.view.ui.panel.div.timeline.SimileTimeline',
       'Elog.view.ui.panel.div.Infovis',
       'Elog.view.ui.panel.div.timeline.Timeglider'
    ],
    xtype: 'elogEmlGraphView',
    config: {
		title: 'EML Schema Manager',
		// cls: 'cards',
		layout: {
			align: 'stretch',
		    type: 'vbox'
		},
		defaults: {
		    flex: 1
		},
		items: [{
			// cls: 'cards',
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			flex: 5,
		    items: [{
		        flex: 3,
		        id: 'idElogInfovis',
		        xtype: 'elogInfovis'
			},{
		        id: 'idEmlGraphPatternSelector',
		        flex: 2,
		        layout: {
					type: 'vbox',
					align: 'stretch'
				},
		        items: [{
					id: 'idEmlGraphSearch',
			        xtype: 'searchfield',
			        docked: 'top',
			        margin: 5
				}, {
		        	id: 'idEmlGraphPatternSet',
		            xtype: 'fieldset',
		            title: 'EML Graph Query',
		            labelWidth: '20%',
		            flex: 1,
		            scrollable: {
			            direction: 'vertical',
			            directionLock: true
			        },
		            items: [{
		    			id	 	: 'idEmlSearchSlide',
		                xtype   : 'sliderfield',
		            	label   : 'Max Childs',
		                value   : 10,
		                minValue: 1,
		                maxValue: 50
		    		}, {
		    			id	 	: 'idEmlSearchDepth',
		                xtype   : 'spinnerfield',
		            	label   : 'Max Depth',
		                value   : 3,
		                minValue: 2,
		                maxValue: 5,
		                increment: 1,
		                cycle: true,
		                disableInput: true
		    		}, {
		    			id: 'idEmlSearchSelection',
		                xtype: 'fieldset',
		                title: 'Categories',
		                instructions: 'Associcated categories',
		                items: []
		            }, {
		    			id	 	: 'idEmlSearchOption',
		                xtype   : 'textareafield',
		            	label   : 'Options',
		                value   : ' ',
		                disabled: true
		    		}]
		        }]
		    }]    
		},{
		    flex: 2,
		    id: 'idElogSimileTimeline',
		    xtype: 'elogSimileTimeline',
		    sourceUrl: null,
            bandWidth: new Array({
    			width: '50%', 
    			intervalUnit: Timeline.DateTime.HOUR,
    			overview: false
    		},
    		{
    			width: '40%', 
    			intervalUnit: Timeline.DateTime.DAY,
    			overview: true
    		},
    		{
    			width: '10%', 
    			intervalUnit: Timeline.DateTime.MONTH,
    			overview: true
    		}),
    		timezone: '+2',
            bandAdjustMode: 'start'
    	}]
	}
});
