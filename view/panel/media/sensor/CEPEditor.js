/**
 * CEP editor
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.media.sensor.CEPEditor', {
 *     	fullscreen:true
 *     });
 * 
 * TODO: Make the sensor list in nested form to call all possible subsequent sensor patterns
 */
Ext.define('Elog.view.panel.media.sensor.CEPEditor', {
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
       'Elog.model.CEPPatternModel',
       'Elog.view.ui.ext.CEPListView',
    ],
    xtype: 'elogCEPEditor',
    config : {
    	cls: 'cards',
	    layout: {
	        type: 'vbox',
	        align: 'stretch',
	    },
	    defaults: {
	        flex: 1,
	    },
	    items: [{
	    	xtype: 'tabpanel',
	    	id: 'idElogCEPEditorTabPanel',
	        tabBar: {
	        	ui: 'dark',
	        	activeTab: 0,
		        ui: Ext.filterPlatform('blackberry') || Ext.filterPlatform('ie10') ? 'dark' : 'light',
	        	docked: 'bottom',
	        },
		    items: [{
		    	iconCls: 'info',
		    	id: 'idChildCEPEditorTab',
	        	title: 'CEP Editor',
	        	layout: {
			        type: 'hbox',
			        align: 'stretch',
			    },
			    defaults: {
			        flex: 1,
	        		margin: 3,
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
				        	id: 'idChildCEPEditorListRefresh',
				        	iconCls: 'refresh',
				        	text: 'Reload',
				        	title: 'Reload CEP rules',
				        },{
				        	id: 'idChildCEPEditorListPatternNew',
				        	iconCls: 'compose',
				        	text: 'New',
				        	hidden: true,
				        	title: 'Compose a new pattern',
				        	handler: function() {
				        		// Get new sensor name
				        		
				        		var oChildCEPNestedList = Ext.getCmp('idChildCEPNestedList');
					    		var oSelectedSensor = oChildCEPNestedList.getTitle();
				        		var oChildCEPEditor = Ext.getCmp('idChildCEPEditor');
					    		var oChildCEPEditorStatusFormPanelSensorName = Ext.getCmp('idChildCEPEditorStatusFormPanelSensorName');
								var oChildCEPEditorSave = Ext.getCmp('idChildCEPEditorSave');
								var oChildCEPEditorWindowToolbar = Ext.getCmp('idChildCEPEditorWindowToolbar');
								
								Ext.Msg.prompt(
									'New sensor', 
									// 'Put new sensor name:', 
									'', 
									function(oResult, oSensorName) {
									    if (oResult == "ok") {
									    	// May add some sensor name validation routine
									    	oChildCEPEditorStatusFormPanelSensorName.setValue(oSensorName);
									    	oChildCEPEditorWindowToolbar.show();
									    	
									    	if (oChildCEPEditor.getAceCEPEditor() != null) {
									    		var oAceEditor = oChildCEPEditor.getAceCEPEditor();
									    		var oPatternSensorName = oChildCEPNestedList.getTitle();
									    		
									    		// Find a pattern from sensorName
									    		var oPatternData = oChildCEPNestedList.getPatternDatabySensorName(oPatternSensorName);
									    		
								    			// Add to the list
								    			oAceEditor.selectAll();
								    			oAceEditor.removeLines();
												oAceEditor.insert("/**\n * CEP Pattern: "+oSensorName+"\n * Date: " + (new Date()).toString() + "\n */\n");
												
												if (oPatternSensorName != "Sensors") {
									    			// Insert default pattern from selected input
													oAceEditor.insert(
														"\n"+
														"insert into EventStreamVirtual\n"+
														"select\n"+
														"<Put body>\n"+
														"from EventStream(isSensor('"+oPatternSensorName+"')).win:length_batch(2)\n"+
														"having <Put Condition>\n"+
														"\n"
													);
												}
												else return;
									    	}
									    }
									},
									this,
									true,
									'Esper/CEP/???',
									true
								);
								
						    	
				        	},
				        },{
				        	id: 'idChildCEPEditorListPatternCompose',
				        	iconCls: 'compose',
				        	text: 'Edit',
				        	hidden: true,
				        	title: 'Edit pattern',
				        	handler: function() {
				        		var oChildCEPNestedList = Ext.getCmp('idChildCEPNestedList');
					    		var oChildCEPEditor = Ext.getCmp('idChildCEPEditor');
					    		var oChildCEPEditorStatusFormPanelSensorName = Ext.getCmp('idChildCEPEditorStatusFormPanelSensorName');
								var oChildCEPEditorWindowToolbar = Ext.getCmp('idChildCEPEditorWindowToolbar');
								
						    	var oSelectedSensor = oChildCEPNestedList.getTitle();
				        		
						    	if (oChildCEPEditor.getAceCEPEditor() != null) {
						    		var oAceEditor = oChildCEPEditor.getAceCEPEditor();
						    		var oPatternSensorName = oChildCEPNestedList.getTitle();
						    		
						    		// Find a pattern from sensorName
						    		var oPatternData = oChildCEPNestedList.getPatternDatabySensorName(oPatternSensorName);
						    		
						    		if (oPatternData.get("query") != null) {
						    			oAceEditor.selectAll();
						    			oAceEditor.removeLines();
										oAceEditor.insert("/**\n * CEP Pattern: "+oPatternData.get("sensorName")+"\n * Date: " + (new Date()).toString() + "\n */\n"+oPatternData.get("query")+"\n");
										oChildCEPEditorWindowToolbar.show();
									}
									else return;
									
									oChildCEPEditorStatusFormPanelSensorName.setValue(oSelectedSensor);
						    	}
				        	},
				        },{
				        	xtype: 'spacer'
				        },{
				        	id: 'idChildCEPEditorListPatternAdd',
				        	iconCls: 'arrow_right',
				        	title: 'Add the rule to the editor',
				        	hidden: true,
				        	handler: function() {
				        		var oChildCEPNestedList = Ext.getCmp('idChildCEPNestedList');
					    		var oChildCEPEditor = Ext.getCmp('idChildCEPEditor');
					    		var oChildCEPEditorPatternRunList = Ext.getCmp('idChildCEPEditorPatternRunList');
								
					    		var oPatternSensorName = oChildCEPNestedList.getTitle();
					    		
					    		// Find a pattern from sensorName
					    		var oPatternData = oChildCEPNestedList.getPatternDatabySensorName(oPatternSensorName);
					    		
					    		if (oPatternData.get("query") != null) {
					    			// Add to the list
									oChildCEPEditorPatternRunList.insertPattern(oPatternData);
								}
								else return;
								
				        	}
				        },{
				        	id: 'idChildCEPEditorListPatternAddAll',
				        	// iconCls: 'forward',
				        	icon: 'http://127.0.0.1/lab/elog/sdk/sencha-touch/resources/themes/images/default/pictos/fforward.png',
				        	title: 'Add all rules to the editor',
				        	handler: function() {
				        		var oChildCEPNestedList = Ext.getCmp('idChildCEPNestedList');
					    		var oChildCEPEditorPatternRunList = Ext.getCmp('idChildCEPEditorPatternRunList');
								
					    		// Find a pattern from sensorName
					    		// .all must be used otherwise it will iterate root items only.
					    		var oCEPData = oChildCEPNestedList.getStore().getData().all;
					    		for (var i = 0; i < oCEPData.length; ++i) {
					    			var oData = oCEPData[i];
					    			
					    			if (oData.get("query") != null) {
					    				if (oChildCEPEditorPatternRunList.getPatternDatabySensorName(oData.get("sensorName")) == null) {
					    					oChildCEPEditorPatternRunList.insertPattern(oData);
					    				}
									}
					    		}
				        	}
				        }]
				    },{
				        id: 'idChildCEPNestedList',
				        xtype: 'elogCEPNestedListView',
					    listeners: {
					    	itemselect: function(oRecord) {
					    		var oSelectedSensor = this.getTitle();
					    		var oCEPEditorListPatternNew = Ext.getCmp('idChildCEPEditorListPatternNew');
					    		var oCEPEditorListPatternCompose = Ext.getCmp('idChildCEPEditorListPatternCompose');
					    		var oCEPEditorListPatternAdd = Ext.getCmp('idChildCEPEditorListPatternAdd');
					    		
					    		// New pattern toolbar will be shown if not the top item
					    		if (oSelectedSensor !== "Sensors") {
					    			oCEPEditorListPatternNew.show();
					    		}
					    		else {
					    			oCEPEditorListPatternNew.hide();
					    		}
					    		
					    		if (oRecord.get("query") != null) {
					    			oCEPEditorListPatternCompose.show();
					    			oCEPEditorListPatternAdd.show();
					    		}
					    		else {
					    			oCEPEditorListPatternCompose.hide();
					    			oCEPEditorListPatternAdd.hide();
					    		}
					    	}
						},
				    }]
		        },{
			        xtype: 'tabpanel',
			        activeTab: 0,
			        ui: 'light',
			        /*
			        tabBar: {
			        	ui: 'dark',
			        	layout: {
			        		pack: 'center',
			        		align: 'center',
			        	},
			        }, */
		            items: [{
		            	// iconCls: 'info',
		            	title: 'Editor',
		            	id: 'idChildCEPEditorWindow',
		            	layout: {
					        type: 'vbox',
					        align: 'stretch',
					    },
					    defaults: {
					        flex: 1
					    },
			        	items: [{
					        xtype: 'toolbar',
					        id: 'idChildCEPEditorSensorNameToolbar',
					        docked: 'top',
					        items: [{
				                xtype: 'textfield',
					            id: 'idChildCEPEditorStatusFormPanelSensorName',
					            name: 'sensorName',
					            label: 'Sensor',
					            width: '100%',
					            readOnly: true,
					        }]
					    },{
					        xtype: 'toolbar',
					        id: 'idChildCEPEditorInputSensorsToolbar',
					        docked: 'top',
					        items: [{
				                xtype: 'textfield',
					            id: 'idChildCEPEditorStatusFormPanelInputSensors',
					            name: 'inputSensors',
					            label: 'Inputs',
					            width: '100%',
					            readOnly: true,
					        }]
					    },{
					        xtype: 'toolbar',
					        id: 'idChildCEPEditorWindowToolbar',
					        docked: 'bottom',
					        defaults: {
					        	iconMask: true,
					        	ui: 'plain'
					        },
			        		hidden: true,
					        items: [{
					        	xtype: 'spacer'
					        },{
					        	iconCls: 'add',
					        	text: 'Save',
					        	id: 'idChildCEPEditorPatternSave',
					        }]
					    },{
			            	id: 'idChildCEPEditor',
			            	xtype: 'elogAceCEPEditor',
			            	listeners: {
						    	change: function(oDeltaOfChanges) {
						    		var oCEPEditor = Ext.getCmp('idChildCEPEditor');
						    		var oChildCEPEditorStatusFormPanelSensorName = Ext.getCmp('idChildCEPEditorStatusFormPanelSensorName');
						    		var oChildCEPEditorStatusFormPanelInputSensors = Ext.getCmp('idChildCEPEditorStatusFormPanelInputSensors');
						    		var oChildCEPEditorStatusFormPanelSensorName = Ext.getCmp('idChildCEPEditorStatusFormPanelSensorName');
						    		
						    		var oPatternDefinition = oCEPEditor.getPatternDefinition();
						    		oChildCEPEditorStatusFormPanelSensorName.setValue(oPatternDefinition.sensorName);
						    		oChildCEPEditorStatusFormPanelInputSensors.setValue(oPatternDefinition.inputSensors);
						    	}
							},
			            }]
		            },{
		            	// iconCls: 'settings',
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
					        id: 'idChildCEPEditorRunPatternToolbar',
					        docked: 'top',
					        defaults: {
					        	iconMask: true,
					        	ui: 'plain'
					        },
					        // TODO Put more icons to add, delete, insert or reorder patterns
					        items: [{
					        	id: 'idChildCEPEditorRunPatternDelete',
					        	iconCls: 'delete',
				        		hidden: true,
					        	handler: function() {
					        		// Delete selected pattern
					        		var oChildCEPEditorPatternRunList = Ext.getCmp('idChildCEPEditorPatternRunList');
					        		var oChildCEPEditorRunPatternToolbar = Ext.getCmp('idChildCEPEditorRunPatternToolbar');
						    		
					        		var oSensorName = oChildCEPEditorRunPatternToolbar.getTitle().getTitle();
					        		oChildCEPEditorPatternRunList.removePatternDatabySensorName(oSensorName);
					        	}
					        },{
					        	xtype: 'spacer'
					        },{
					        	id: 'idChildCEPEditorPatternRun',
					        	iconCls: 'search',
					        	text: 'Run',
					        	handler: function () {
					        		var oElogCEPEditorTabPanel = Ext.getCmp('idElogCEPEditorTabPanel');
					        		oElogCEPEditorTabPanel.setActiveItem(1);
					        	},
					        }]
					    },{
			            	id: 'idChildCEPEditorPatternRunList',
			        		xtype: 'elogCEPListView',
							// defaultStore: 'Elog.store.CEPPatternListStore',
			        		// Set config
						    listeners: {
						    	itemselect: function(oRecord) {
						    		var oCEPEditorRunPatternDelete = Ext.getCmp('idChildCEPEditorRunPatternDelete');
						    		var oCEPEditorPatternRun = Ext.getCmp('idChildCEPEditorPatternRun');
						    		var oChildCEPEditorRunPatternToolbar = Ext.getCmp('idChildCEPEditorRunPatternToolbar');
						    		
						    		// Set toolbar title
						    		oChildCEPEditorRunPatternToolbar.setTitle(oRecord.get('sensorName'));
						    		
						    		// New pattern toolbar will be shown if not the top item
						    		oCEPEditorRunPatternDelete.show();
					    			oCEPEditorPatternRun.show();
						    	}
							},
			            }]       
				    }]
		        }]
		    },{
            	iconCls: 'settings',
		    	id: 'idChildCEPEditorSensorKeyViewTab',
	        	title: 'Event Viewer',
	        	layout: {
			        type: 'hbox',
			        align: 'stretch',
			    },
			    defaults: {
			        flex: 1,
	        		margin: 3,
			    },
		        items: [{
			        id: 'idChildCEPEditorSensorKeyValueDataView',
			        xtype: 'elogSensorKeyValueDataView'
			    },{
			        id: 'idChildCEPEditorGpsDataPath',
			        xtype: 'elogGpsDataPath'
			    }]
		    }]
	    }]
	    
    },
    
    /**
     * Initialize
     */
    init: function() {
    	this.callParent();
    },
    
    initialize: function() {
    	// Set icons
    	var oChildCEPEditorListPatternAddAll = Ext.getCmp('idChildCEPEditorListPatternAddAll');
    	oChildCEPEditorListPatternAddAll.setIcon(this.getExternalIconBaseUrl()+"IcoMoon--limited--master/Icons/PNG/32px/forward3.png");
    }
});
