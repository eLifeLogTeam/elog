/**
 * eLifeLog API demo: File Manager View
 * 
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.admin.Setup', {
 *     	fullscreen:true
 *     });
 * 
 */
Ext.define('Elog.view.panel.admin.Setup', {
    extend: 'Elog.view.panel.Base',
    requires: [ ],
    xtype: 'elogSetup',
    config : {
    	layout: {
	        type: 'hbox',
	        align: 'stretch'
	    },
	    defaults: {
	        flex: 1
	    },
	    items: [{
	    	id: 'idElogSetupLayout',
	    	xtype: 'tabpanel',
	    	tabBar: {
	    		docked: 'bottom',
	    		layout: {
	    			pack: 'center'
	    		}
	    	},
	    	items: [{
	    		title: 'User',
	            iconCls: 'add',
	            id: 'idElogFileUploaderView',
	            items: [{
                    text: 'Login',
                    leaf: true,
                    id: 'idElogLogInPanel',
                    viewfullname: 'Elog.view.panel.admin.LogInPanel'
                }]
	    	},{
	    		title: 'Settings',
	            iconCls: 'settings',
	            id: 'idElogFileExplorerView',
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
			    }]
	    	}]
	    }]
    }
});