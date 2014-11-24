/**
 * CEP editor
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.media.sensor.CEPEditorGrid', {
 *     	fullscreen:true
 *     });
 * 
 * TODO: Make the sensor list in nested form to call all possible subsequent sensor patterns
 */
Ext.define('Elog.view.panel.media.sensor.CEPEditorGrid', {
    extend: 'Elog.view.panel.media.sensor.Base',
    requires: [
       'Ext.Panel',
       'Elog.view.ui.map.gpscluster.GpsDataPath',
       'Ext.dataview.DataView',
       'Ext.dataview.List',
       'Ext.field.TextArea',
       'Elog.view.ui.panel.div.AceCEPEditor',
       'Elog.view.ui.ext.TimeSlider',
       'Elog.view.ui.ext.CEPListView',
    ],
    xtype: 'elogCEPEditorGrid',
    config : {
	    cls: 'cards',
	    layout: {
	        type: 'vbox',
	        align: 'stretch',
	    },
	    defaults: {
	        flex: 1
	    },
	    items: [{
	        layout: {
		        type: 'hbox',
		        align: 'stretch',
		    },
		    defaults: {
		        flex: 1
		    },
	        items: [{
	        	layout: {
			        type: 'vbox',
			        align: 'stretch',
			    },
			    defaults: {
			        flex: 1
			    },
	        	items: [{
			        xtype: 'toolbar',
			        docked: 'top',
			        defaults: {
			        	iconMask: true,
			        },
			        items: [{
			        	id: 'idChildCEPEditorGridListRefresh',
			        	iconCls: 'refresh',
			        	text: 'Reload',
			        	title: 'Reload CEP rules',
			        },{
			        	id: 'idChildCEPEditorGridListPatternNew',
			        	iconCls: 'compose',
			        	text: 'New',
			        	hidden: true,
			        	title: 'Compose a new pattern',
			        	handler: function() {
			        		var oChildCEPNestedList = Ext.getCmp('idChildCEPNestedList');
				    		var oSelectedSensor = oChildCEPNestedList.getTitle();
			        		var oChildCEPEditorGrid = Ext.getCmp('idChildCEPEditorGrid');
				    		var oChildCEPEditorGridWindowToolbar = Ext.getCmp('idChildCEPEditorGridWindowToolbar');
								
					    	if (oChildCEPEditorGrid.getAceCEPEditorGrid() != null) {
					    		var oAceEditor = oChildCEPEditorGrid.getAceCEPEditorGrid();
					    		var oPatternSensorName = oChildCEPNestedList.getTitle();
					    		
					    		// Find a pattern from sensorName
					    		var oPatternData = oChildCEPNestedList.getPatternDatabySensorName(oPatternSensorName);
					    		
					    		if (oPatternData.get("query") != null) {
					    			// Add to the list
									oAceEditor.insert("\n/**\n * CEP Pattern: "+oPatternData.get("sensorName")+"\n * Date: " + (new Date()).toString() + "\n */\n"+oPatternData.get("query")+"\n");
								}
								else return;
					    	}
			        	},
			        },{
			        	id: 'idChildCEPEditorGridListPatternCompose',
			        	iconCls: 'compose',
			        	text: 'Edit',
			        	hidden: true,
			        	title: 'Edit pattern',
			        	handler: function() {
			        		var oChildCEPNestedList = Ext.getCmp('idChildCEPNestedList');
				    		var oChildCEPEditorGrid = Ext.getCmp('idChildCEPEditorGrid');
				    		var oChildCEPEditorGridWindowToolbar = Ext.getCmp('idChildCEPEditorGridWindowToolbar');
							
					    	var oSelectedSensor = oChildCEPNestedList.getTitle();
			        		
					    	if (oChildCEPEditorGrid.getAceCEPEditorGrid() != null) {
					    		var oAceEditor = oChildCEPEditorGrid.getAceCEPEditorGrid();
					    		var oPatternSensorName = oChildCEPNestedList.getTitle();
					    		
					    		// Find a pattern from sensorName
					    		var oPatternData = oChildCEPNestedList.getPatternDatabySensorName(oPatternSensorName);
					    		
					    		if (oPatternData.get("query") != null) {
									oAceEditor.insert("\n/**\n * CEP Pattern: "+oPatternData.get("sensorName")+"\n * Date: " + (new Date()).toString() + "\n */\n"+oPatternData.get("query")+"\n");
								}
								else return;
								
								oChildCEPEditorGridWindowToolbar.setTitle(oSelectedSensor);
					    	}
			        	},
			        },{
			        	xtype: 'spacer'
			        },{
			        	id: 'idChildCEPEditorGridListPatternAdd',
			        	iconCls: 'arrow_right',
			        	title: 'Add the rule to the editor',
			        	hidden: true,
			        	handler: function() {
			        		var oChildCEPNestedList = Ext.getCmp('idChildCEPNestedList');
				    		var oChildCEPEditorGrid = Ext.getCmp('idChildCEPEditorGrid');
				    		var oChildCEPEditorGridPatternRunList = Ext.getCmp('idChildCEPEditorGridPatternRunList');
							
				    		var oPatternSensorName = oChildCEPNestedList.getTitle();
				    		
				    		// Find a pattern from sensorName
				    		var oPatternData = oChildCEPNestedList.getPatternDatabySensorName(oPatternSensorName);
				    		
				    		if (oPatternData.get("query") != null) {
				    			// Add to the list
								oChildCEPEditorGridPatternRunList.insertPattern(oPatternData);
							}
							else return;
			        	}
			        }]
			    },{
			        id: 'idChildCEPNestedList',
			        xtype: 'elogCEPNestedListView',
				    listeners: {
				    	itemselect: function(oRecord) {
				    		var oSelectedSensor = this.getTitle();
				    		var oCEPEditorGridListPatternNew = Ext.getCmp('idChildCEPEditorGridListPatternNew');
				    		var oCEPEditorGridListPatternCompose = Ext.getCmp('idChildCEPEditorListPatternCompose');
				    		var oCEPEditorGridListPatternAdd = Ext.getCmp('idChildCEPEditorGridListPatternAdd');
				    		
				    		// New pattern toolbar will be shown if not the top item
				    		if (oSelectedSensor !== "Sensors") {
				    			oCEPEditorGridListPatternNew.show();
				    		}
				    		else {
				    			oCEPEditorGridListPatternNew.hide();
				    		}
				    		
				    		if (oRecord.get("query") != null) {
				    			oCEPEditorGridListPatternCompose.show();
				    			oCEPEditorGridListPatternAdd.show();
				    		}
				    		else {
				    			oCEPEditorGridListPatternCompose.hide();
				    			oCEPEditorGridListPatternAdd.hide();
				    		}
				    	}
					},
			    }]
	        },{
		        xtype: 'tabpanel',
		        activeTab: 0,
		        ui: 'light',
		        tabBar: {
		        	ui: Ext.filterPlatform('blackberry') || Ext.filterPlatform('ie10') ? 'dark' : 'light',
		        	layout: {
		        		pack: 'center',
		        		align: 'center'
		        	},
		        	docked: 'bottom'
		        },
	            items: [{
	            	iconCls: 'info',
	            	title: 'Editor',
	            	id: 'idChildCEPEditorGridWindow',
	            	layout: {
				        type: 'vbox',
				        align: 'stretch',
				    },
				    defaults: {
				        flex: 1
				    },
		        	items: [{
				        xtype: 'toolbar',
				        id: 'idChildCEPEditorGridWindowToolbar',
				        docked: 'top',
				        defaults: {
				        	iconMask: true,
				        	ui: 'plain'
				        },
				        items: [{
				        	iconCls: 'add',
				        	id: 'idChildCEPEditorGridSave'
				        }]
				    },{
		            	id: 'idChildCEPEditorGrid',
		            	xtype: 'elogAceCEPEditorGrid',
		            }]
	            },{
	            	iconCls: 'settings',
	            	title: 'Run',
	            	layout: {
				        type: 'vbox',
				        align: 'stretch',
				    },
				    defaults: {
				        flex: 1
				    },
		        	items: [{
				        xtype: 'toolbar',
				        id: 'idChildCEPEditorGridRunPatternToolbar',
				        docked: 'top',
				        defaults: {
				        	iconMask: true,
				        	ui: 'plain'
				        },
				        // TODO Put more icons to add, delete, insert or reorder patterns
				        items: [{
				        	id: 'idChildCEPEditorGridRunPatternSave',
				        	iconCls: 'save',
				        	text: 'Save',
			        		hidden: true,
				        	handler: function() {
				        		alert('save clicked');
				        	}
				        },{
				        	id: 'idChildCEPEditorGridRunPatternDelete',
				        	iconCls: 'minus',
				        	text: 'Delete',
			        		hidden: true,
				        	handler: function() {
				        		alert('Delete clicked');
				        	}
				        },{
				        	xtype: 'spacer'
				        },{
				        	id: 'idChildCEPEditorGridPatternRun',
				        	iconCls: 'search',
				        	text: 'Run',
				        }]
				    },{
		            	id: 'idChildCEPEditorGridPatternRunList',
		        		xtype: 'elogSensorKeyValueDataView',
		        		// Set config
					    listeners: {
					    	itemselect: function(oRecord) {
					    		var oCEPEditorGridRunPatternDelete = Ext.getCmp('idChildCEPEditorGridRunPatternDelete');
					    		var oCEPEditorGridPatternRun = Ext.getCmp('idChildCEPEditorGridPatternRun');
					    		var oChildCEPEditorGridRunPatternToolbar = Ext.getCmp('idChildCEPEditorGridRunPatternToolbar');
					    		
					    		// Set toolbar title
					    		oChildCEPEditorGridRunPatternToolbar.setTitle(oRecord.get('sensorName'));
					    		
					    		// New pattern toolbar will be shown if not the top item
					    		oCEPEditorGridRunPatternDelete.show();
				    			oCEPEditorGridPatternRun.show();
					    	}
						},
		            }]       
			    }]
	        }]
	    },{
	    	layout: {
		        type: 'hbox',
		        align: 'stretch',
		    },
		    defaults: {
		        flex: 1
		    },
	        id: 'idChildCEPEditorGridSensorKeyView',
	        items: [{
		        id: 'idChildCEPEditorGridSensorKeyValueDataView',
		        xtype: 'elogSensorKeyValueDataView'
		    },{
		        id: 'idChildCEPEditorGridGpsDataPath',
		        xtype: 'elogGpsDataPath'
		    }]
	    }]
    },
    
    /**
     * Initialize
     */
    init: function() {
    	this.callParent();
    },
});
