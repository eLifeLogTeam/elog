/**
 * Elog controller: DatabaseManager
 * 
 */
Ext.define('Elog.controller.data.DatabaseManager', {
	extend: 'Elog.controller.Base',
    requires: [
       'Elog.controller.Base',
       'Elog.api.database.DatabaseManager'
    ],
	config: {
		/**
		 * Including views are optional since necessary components are accessed through refs
		 */
		views: [
	        'Elog.view.panel.data.DatabaseManagerView'
		],
		/**
		 * When designing your own DatabaseManager panel, replace or comment above views config 
		 * and update below IDs to work with your panel
		 */
		refs: {
			databaseManager: '#idDatabaseManager',
			databaseManagerView: '#idElogDatabaseManagerView',
			databaseManagerRefresh: '#idDatabaseManagerRefresh',
			fetchEMLDatabase: '#idFetchEMLDatabase',
			initializeEMLDatabase: '#idInitializeEMLDatabase',
			selectAllTables: '#idSelectAllTables',
			unselectAllTables: '#idUnselectAllTables',
			databaseManagerTablePane: '#idDatabaseManagerTablePane',
			importTables: '#idImportTables',
			databaseManagerReset: '#idDatabaseManagerReset',
			userDatabaseHost: '#idUserDatabaseHost',
			userDatabaseName: '#idUserDatabaseName',
			databaseManagerTablePane: '#idDatabaseManagerTablePane'
		},

		control: {
			databaseManagerView: {
				initialize: 'onInitializeDatabaseManagerView'
			},
			databaseManager: {
				show: 'onDatabaseManagerShow'
			},
			databaseManagerRefresh: {
		    	tap: 'onDatabaseManagerRefresh'
		    },
		    fetchEMLDatabase: {
		    	tap: 'onFetchEMLDatabase'
		    },
		    initializeEMLDatabase: {
		    	tap: 'onInitializeEMLDatabase'
		    },
		    selectAllTables: {
		    	tap: 'onSelectAllTables'
		    },
		    unselectAllTables: {
		    	tap: 'onUnselectAllTables'
		    },
		    importTables: {
		    	tap: 'onImportTables'
		    },
		    databaseManagerReset: {
		    	tap: 'onDatabaseManagerReset'
		    }
		},
		
		// Program configuration
		databaseManager: null
	},
	
	onInitializeDatabaseManagerView: function() {
		if (this.getDatabaseManager() == null) {
            // Create people list viewer
			this.setDatabaseManager(new Ext.create('Elog.api.database.DatabaseManager'));
        }
    	
		var oController = this;
		var oDatabaseManager = this.getDatabaseManager();
    	this.getDatabaseManager().initialize({
    		onSuccess: function (oResult) {
    			oController.getUserDatabaseHost().setValue(oResult.root.results.host_name);
    			oController.getUserDatabaseName().setValue(oResult.root.results.database_name);
                
                // Set table selection
                var oFieldSet = oController.getDatabaseManagerTablePane();
                
                // Clean existing field set
                oFieldSet.removeAll();
                
                var oTables = oResult.root.results.tables;
                oTables.forEach(function (x, idx) {
                	// Do not add EML tables
                	if (x.IS_EML_TABLE === false) {
                		oFieldSet.add({
                    		xtype: 'checkboxfield',
                    		id: 'idTable'+idx,
                            name: x.TABLE_NAME+' ('+x.TABLE_ROWS+')',
                            label: x.TABLE_NAME+' ('+x.TABLE_ROWS+')',
                            labelWidth: '80%'
                        });
                	}
                });
    			// oFieldSet.doLayout();
    			
    			// Save table information
    			oDatabaseManager.oTableData = oResult.root;
    		}
    	});
	},
	
	onDatabaseManagerRefresh: function() {
		this.onInitializeDatabaseManagerView();
	},
	
	onFetchEMLDatabase: function() {
		var oController = this;
		var oDatabaseManager = this.getDatabaseManager();
		this.getDatabaseManager().onFetchDatabase({
			onSuccess: function(oResult) {
				if (typeof oResult.result !== "undefined") {
					oController.attachResult(oResult.result);
				}
				oController.updateInstruction();
			},
			onFail: function(oResult) {
				oController.attachResult(oDatabaseManager);
				oController.updateInstruction();
			}
		});	
		
	},
	
	onInitializeEMLDatabase: function() {
		oController = this;
		this.getDatabaseManager().onInitializeEMLDatabase({
			onSuccess: function(oResult) {
				if (typeof oResult.result !== "undefined") {
					oController.attachResult(oResult.result);
				}
				oController.updateInstruction();
			},
			onFail: function(oResult) {
				oController.attachResult(oDatabaseManager);
				oController.updateInstruction();
			}
		});
	},
	
	onSelectAllTables: function() {
		var oFieldSet = this.getDatabaseManagerTablePane();
		oFieldSet.getInnerItems().forEach(function(oTable) {
			oTable.check();
		});
	},
	
	onUnselectAllTables: function() {
		var oFieldSet = this.getDatabaseManagerTablePane();
		oFieldSet.getInnerItems().forEach(function(oTable) {
			oTable.uncheck();
		});
	},
	
	onImportTables: function() {
    	// Retrieve selected tables
    	var oSelectedTables = new Array();
    	var oFieldSet = this.getDatabaseManagerTablePane();
    	
    	// $('#'+oGUIInfo.informationviewid).html('<center><img src="resources/images/spinner.gif" width="24px"></center>');
    	    	
    	oFieldSet.getInnerItems().forEach(function(oTable) {
    		var oTableName = oTable.getName();
    		if (oTable.isChecked() == true) {
    			oSelectedTables.push(oTableName.substr(0, oTableName.search(' ')));
    		}
    	});
    	
    	var oController = this;
		var oDatabaseManager = this.getDatabaseManager();
		this.getDatabaseManager().onImportTable({
			selectedTables: oSelectedTables,
			onSuccess: function(oResult) {
				if (typeof oResult.result !== "undefined") {
					oController.attachResult(oResult.result);
				}
				oController.updateInstruction();
			},
			onFail: function(oResult) {
				oController.attachResult(oDatabaseManager);
				oController.updateInstruction();
			}
		});	
	},
	
	onDatabaseManagerReset: function() {
		this.getUserDatabaseHost.setValue('');
		this.getUserDatabaseName.setValue('');
	}
});