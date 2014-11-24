/**
 * eLifeLog API demo Database Manager View
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.data.DatabaseManagerView', {
 *     	fullscreen:true
 *     });
 * 
 */
Ext.define('Elog.view.panel.data.DatabaseManagerView', {
    extend: 'Ext.form.Panel',
    requires: [
       'Ext.form.Panel',
       'Ext.field.Url'
    ],
    xtype: 'elogDatabaseManagerView',
    config: {
    	title: 'E-model Database',
    	id: 'idUserForm', 
		// height: '600px',
		scrollable: {
	        direction: 'vertical',
	        directionLock: true
	    },
	    items: [{
	        xtype: 'fieldset',
	        title: 'Database',
	        defaults: {
	            // labelAlign: 'right'
	            labelWidth: '20%'
	        },
	        items: [{
	            xtype: 'textfield',
	            id: 'idUserDatabaseHost',
	            name: 'idUserDatabaseHost',
	            label: 'Database Host',
	            disabled: true,
	            value: '',
	            placeHolder: 'Put a database host address',
	            clearIcon: true
	        }, {
	            xtype: 'urlfield',
	            id: 'idUserDatabaseName',
	            name: 'idUserDatabaseName',
	            label: 'Database Name',
	            disabled: true,
	            placeHolder: 'Put a database name',
	            clearIcon: true
	        }]
	    }, {
	        layout: 'hbox',
	        defaults: {xtype: 'button', flex: 1, style: 'margin: .5em;'},
	        items: [{
	            text: 'Refresh',
	            id: 'idDatabaseManagerRefresh'
	        }, {
	            text: 'Fetch EML database',
	            id: 'idFetchEMLDatabase'
	        },{
	            text: 'Initialize EML database',
	            id: 'idInitializeEMLDatabase'
	        },{
	            text: 'Select All Tables',
	            id: 'idSelectAllTables'
	        }, {
	            text: 'Unselect All Tables',
	            id: 'idUnselectAllTables'
	        }]
	    }, {
	        xtype: 'fieldset',
	        id: 'idDatabaseManagerTablePane',
	        title: 'Tables',
	        instructions: 'Select tables to import into the E-model database',
	        items: []
	    }, {
	        layout: 'hbox',
	        defaults: {xtype: 'button', flex: 1, style: 'margin: .5em;'},
	        items: [{
	            text: 'Import tables into EML',
	            id: 'idImportTables'
	        },{
	            text: 'Reset',
	            id: 'idDatabaseManagerReset'
	        }]
	    }]
    }
});


