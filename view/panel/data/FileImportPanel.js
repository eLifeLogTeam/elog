/**
 * eLifeLog API demo: File Import Panel
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.data.FileImportPanel', {
 *     	fullscreen:true
 *     });
 */
Ext.define('Elog.view.panel.data.FileImportPanel', {
    extend: 'Elog.view.panel.Base',
    requires: [
       'Ext.Panel',
       'Elog.view.ui.panel.div.ProgressBar',
       'Elog.view.ui.ext.TimeZoneSelectField',
       'Elog.view.ui.ext.MediaTypeSelectField',
       'Ext.form.Toggle'
    ],
    xtype: 'elogFileImportPanel',
    config : {
    	layout: {
	        type: 'vbox',
	        align: 'stretch'
		},
		defaults: {
	        flex: 1
	    },
        items: [{
            id: 'idElogMediaControl',
        	height: 40,
        	docked: 'top',
            layout: {
        		type: 'hbox',
        		pack: 'center',
	       		align: 'center'
        	},
			defaults: {
		        flex: 1
		    },
        	items: [{
                text: 'Import file',
                xtype: 'button',
                id: 'idElogLoadMedia',
                margin: 2
            }, {
                text: 'Import directory',
                xtype: 'button',
                id: 'idElogLoadMediaFromDirectory',
                margin: 2
            }, {
                text: 'Copy time',
                id: 'idElogFileCopyTime',
                xtype: 'button',
                margin: 2
            }]
        }, {
            xtype: 'fieldset',
            docked: 'top',
            // title: 'Media Format',
            // instructions: 'Recognized/Selected Media format.',
            defaults: {
                // labelAlign: 'right'
                labelWidth: '25%'
            },
            items: [{
            	id: 'idElogArchiveFile',
                name: 'idElogArchiveFile',
			    xtype: 'togglefield',
			    label: 'Archive',
			    value: true
            },{
                xtype: 'elogMediaTypeSelectField',
                id: 'idElogMediaType',
                name: 'idElogMediaType',
                label: 'Media Type'
            },{
                xtype: 'textfield',
                id: 'idElogMediaTimestamp',
                name: 'idElogMediaTimestamp',
                label: 'Time',
                disabled: true
            },{
            	id: 'idElogTimeZone',
                xtype: 'elogTimeZoneSelectField'
            }]
        }, {
            xtype: 'fieldset',
            docked: 'top',
            // title: 'Media Format',
            // instructions: 'Recognized/Selected Media format.',
            defaults: {
                // labelAlign: 'right'
                labelWidth: '25%'
            },
            items: [{
                xtype: 'textfield',
                id: 'idElogMediaTimestampModified',
                label: 'Modified Time'
            }, {
                xtype: 'sliderfield',
                id: 'idElogTimeRange',
                label: 'GPS Search',
                value: 240,
                minValue: 0,
                maxValue: 2400,
                disabled: true
            }]
        },
        /*
        {
			id: 'idElogMapPreview',
			xtype: 'map',
			// height: '300px',
			zoom: 14,
			// border: 5,
            margin: 5,
			mapOptions: {
				mapTypeId: google.maps.MapTypeId.HYBRID,
				mapTypeId: 
    	        center: new google.maps.LatLng(46.06543,11.137562)
			},
			width: '99%'
			// This option makes the map shrink to disappear
			// centered: true 
        } */
        {
			id: 'idElogMapPreview',
			xtype: 'elogGpsDataPath',
			width: '99%'
        }
        ]
    }
});