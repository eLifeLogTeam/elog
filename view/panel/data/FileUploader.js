/**
 * eLifeLog API demo: File Upload Panel
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.data.FileUploader', {
 *     	fullscreen:true
 *     });
 *     
 * TODO: Later, support mobile photo selection at here.
 */ 
Ext.define('Elog.view.panel.data.FileUploader', {
    extend: 'Elog.view.panel.Base',
    requires: [
       'Elog.view.ui.panel.div.FileTreeView',
       'Elog.view.ui.ext.Fileup',
       'Ext.Label'
    ],
    xtype: 'elogFileUploader',
    config : {
    	dropControl: null,
    	// height: '100%',
    	layout: {
	        type: 'vbox',
	        align: 'stretch'
	    },
	    defaults: {
	        flex: 1
	    },
    	items: [{
    		layout: {
		        type: 'vbox',
		        align: 'stretch'
    		},
		    defaults: {
		        flex: 1
		    },
		    // style: 'background-color: white;',
		    items: [{
	    		// xtype: 'elogPanelBase',
	    		margin: 5,
			    height: 30,
			    docked: 'top',
	    		layout: {
			        type: 'hbox',
			        align: 'stretch'
	    		},	    		
			    defaults: {
			        flex: 1
			    },
			    // style: 'background-color: white;',
			    items: [{
		    		xtype: 'label',
		    		html: ' Files to upload'
			    }, {
			    	// TODO: Later do not use this but native one with dynamically created file form
			    	// TODO: Reference: http://stackoverflow.com/questions/6728750/html5-file-uploading-with-multiple-progress-bars
			        id: 'idChildElogFileUploader',
			        docked: 'right',
			        width: '150px',
			        xtype: 'fileupload',
			        iconCls: 'download',
			        iconMask: true,
			        text: 'Files',
			        padding: 1,
			        actionUrl: 'http://elog.disi.unitn.it/lab/elog8/library/fileup/demo/getfile.php',// Url of getfile.php
			        returnBase64Data: true
	    		}]
		    }, {
		        id: 'idChildElogFileUploadListView',
		        xtype: 'list',
		        // height: '200px',
		   		margin: 5,
		        store: {
			    	fields: ['name', 'size', 'type'],
			        data: [
			        /*
			        	{name: 'Jamie',  age: 100},
			            {name: 'Rob',   age: 21},
			            {name: 'Tommy', age: 24},
			            {name: 'Jacky', age: 24},
			            {name: 'Ed',   age: 26}
			        */
			        ]
			    },
			    itemTpl: '<div>{name} ({size} bytes) {type}</div>',
			    listeners: {
					drop: function(droppable, draggable, e) {
						if (!e) { 
							e = window.event;
						}
	   				}
				}
			}]
		}, {
    		layout: {
		        type: 'vbox',
		        align: 'stretch'
    		},
    		defaults: {
		        flex: 1
		    },
		    // style: 'background-color: white;',
		    items: [{
	    		xtype: 'label',
	    		margin: 5,
	    		html: ' Select the server folder to save',
	    		height: 30,
	    		docked: 'top'
		    }, {
	    		id: 'idChildElogFileUploadTreeView',
	    		xtype: 'elogFileTreeView',
	    		margin: 5,
	    		scrollable: {
		    		direction: 'vertical'
		        }
		    }, {
	    		id: 'idChildElogFileUploadSubmit',
	    		xtype: 'button',
	    		// padding: 10,
	    		margin: 10,
	    		docked: 'bottom',
	    		height: 30,
	    		text: 'Upload',
	    		iconCls: 'action',
	   			iconMask: true
		    }]
		}]
    }
});	