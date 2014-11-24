/**
 * eLifeLog API demo: File Explorer Panel
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.data.FileExplorer', {
 *     	fullscreen:true
 *     });
 */
Ext.define('Elog.view.panel.data.FileExplorer', {
    extend: 'Elog.view.panel.Base',
    requires: [
       'Elog.view.ui.panel.div.FileTreeView',
       'Elog.view.ui.ext.Fileup',
       'Elog.view.panel.data.FileUploader'
    ],
    xtype: 'elogFileExplorer',
    config : {
    	// height: '100%',
    	layout: {
	        type: 'hbox',
	        align: 'stretch'
	    },
	    defaults: {
	        flex: 1
	    },
    	scrollable: {
    		direction: 'vertical'
        },
    	items: [{
    		id: 'idChildElogFileTreeView',
    		xtype: 'elogFileTreeView',
	    	scrollable: {
	    		direction: 'vertical'
	        }
	    },{
            xtype: 'toolbar',
            docked : 'top',
      	    id : 'idElogFileExplorerToolbar',
      	    items: [{
      	    	xtype: 'spacer'
      	    },{
      	    	text: 'Restore',
      	    	id: 'idElogFileExplorerRestoreButton'
      	    }]
        }]
    }
});