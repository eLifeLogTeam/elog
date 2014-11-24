/**
 * eLifeLog API demo: File Manager View
 * 
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.data.DataManagerPanel', {
 *     	fullscreen:true
 *     });
 * 
 */
Ext.define('Elog.view.panel.data.DataManagerPanel', {
    extend: 'Elog.view.panel.Base',
    requires: [
       'Elog.view.panel.data.FilePreviewPanel',
       'Elog.view.panel.data.FileImportPanel',
       'Elog.view.panel.data.FileExplorer',
       'Elog.view.panel.data.FileUploader'
    ],
    xtype: 'elogDataManager',
    config : {
    	layout: {
	        type: 'hbox',
	        align: 'stretch'
	    },
	    defaults: {
	        flex: 1
	    },
	    items: [{
	    	id: 'idElogDataManagerLayout',
	    	xtype: 'tabpanel',
	    	tabBar: {
	    		docked: 'bottom',
	    		layout: {
	    			pack: 'center'
	    		}
	    	},
	    	items: [{
	    		title: 'File',
	            iconCls: 'home',
	            id: 'idElogFileExplorerView',
	    		xtype: 'elogFileExplorer'
	    	},{
	    		title: 'Preview',
	            iconCls: 'user',
	            id: 'idElogFilePreviewPanel',
	        	xtype: 'elogFilePreviewPanel'
		    },{
	    		title: 'Upload',
	            iconCls: 'add',
	            id: 'idElogFileUploaderView',
	    		xtype: 'elogFileUploader'
	    	}]
	    },{
	    	title: 'Import',
	    	iconCls: 'file_add-icon',
            id: 'idElogFileImportPanel',
            xtype: 'elogFileImportPanel'
	    }]
    }
});