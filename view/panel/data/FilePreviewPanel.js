/**
 * eLifeLog API demo: File Preview Panel
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.data.FilePreviewPanel', {
 *     	fullscreen:true
 *     });
 */
Ext.define('Elog.view.panel.data.FilePreviewPanel', {
    extend: 'Elog.view.panel.Base',
    requires: [
       'Ext.Panel',
       'Ext.form.FieldSet',
       'Ext.field.Select',
       'Ext.field.Search',
       'Ext.field.Slider',
       'Ext.Map'
    ],
    xtype: 'elogFilePreviewPanel',
    config : {
    	height: '100%',
    	scrollable: {
    		direction: 'vertical'
        },
    	items: [{
            xtype: 'fieldset',
            // title: 'Data',
            // instructions: 'Select the source data from the left.',
            defaults: {
                // labelAlign: 'right'
                labelWidth: '25%'
            },
            items: [{
                xtype: 'textfield',
                id: 'idElogSelectedFile',
                name: 'idElogSelectedFile',
                disabled: true,
                label: 'Source',
                placeHolder: 'Selected source',
                clearIcon: true
            }, {
                xtype: 'selectfield',
                id: 'idElogSourceType',
                name: 'idElogSourceType',
                disabled: true,
                label: 'Type',
                options: [{
                    text: 'File',
                    value: false
                }, {
                    text: 'Directory',
                    value: true
                }]
            },{
            	xtype: 'fieldset',
            	title: 'Preview',
                id: 'idElogFilePreviewWindow',
                items: [{
                	id: 'idElogFilePreviewWindowItem',
                	xtype: 'component',
                	html: 'Preview content'
                }]
            }]
        },{
            xtype: 'toolbar',
            docked : 'top',
      	    id : 'idElogFileManagerToolbar',
      	    items: [{
      	    	text: 'Back',
      	    	id: 'idElogFileManagerBackButton',
      	    	disabled: true
      	    }, {
      	    	xtype: 'spacer'
      	    },{
      	    	text: 'Delete',
      	    	id: 'idElogFileManagerDeleteButton'
      	    }]
        }]
    }
});