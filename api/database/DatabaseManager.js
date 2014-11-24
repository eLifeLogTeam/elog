/**
 * elog.api.DatabaseManager
 * 
 * @author Pil Ho Kim
 * 
 * User database management library
 * 
 * History:
 * 2011/02/17 - First version
 *
 */
Ext.define('Elog.api.database.DatabaseManager', {
    // These are all detected automatically
    // No need to use @extends, @alternateClassName, @mixin, @alias, @singleton
    extend: 'Elog.api.Base',
    config: {
    },
	
    constructor: function(cfg) {
    	this.callParent(cfg);
    	this.initConfig(cfg);

    	return this;
    },

    /**
     * Load user database information
     * 
     * @param {Object} oDatabaseManager
     */
    initialize : function(cfg) {
    	oDatabaseManager = this;
        this.getServerQuery({
    		command: this.getCommands().getUserDatabaseTables,
    		params: {
    		},    		
    		onSuccess: function(oResult) {
    			if (typeof cfg.onSuccess != "undefined") {
    				cfg.onSuccess(oResult);
    			}
            },            
            onFail: function(oResult) {
            	oDatabaseManager.logError('Server connection failed. Check the internet connection');
            	if (typeof cfg.onFail != "undefined") {
            		cfg.onFail(oResult);
            	}
            }
    	});
    },

    /**
     * Import table into the E-model database
     * 
     * @param {Object} oDatabaseManager
     */
    onImportTable : function(cfg) {
    	oDatabaseManager = this;
        this.getServerQuery({
    		command: this.getCommands().importMysqlTables,
    		params: {
    			eml_tables: cfg.selectedTables.join(";")
    		},    		
    		onSuccess: function(oResult) {
    			if (typeof cfg.onSuccess != "undefined") {
    				cfg.onSuccess(oResult);
    			}
            },            
            onFail: function(oResult) {
            	oDatabaseManager.logError('Server connection failed. Check the internet connection');
            	if (typeof cfg.onFail != "undefined") {
            		cfg.onFail(oResult);
            	}
            }
    	});
    },

    /**
     * 
     * Fetch database as E-model database. This creates tables for E-model operation.
     * 
     * @param {Object} oDatabaseManager
     */
    onFetchDatabase : function(cfg) {
    	oDatabaseManager = this;
        this.getServerQuery({
    		command: this.getCommands().emlSetup,
    		params: {
    		},    		
    		onSuccess: function(oResult) {
    			if (typeof cfg.onSuccess != "undefined") {
    				cfg.onSuccess(oResult);
    			}
            },            
            onFail: function(oResult) {
            	oDatabaseManager.logError('Server connection failed. Check the internet connection');
            	if (typeof cfg.onFail != "undefined") {
            		cfg.onFail(oResult);
            	}
            }
    	});
    },

    /**
     * Initialize E-model database configuration.
     * This remove all e-nodes and c-data objects. Use with caution.
     * 
     * @param {Object} oDatabaseManager
     * 
     */
    onInitializeEMLDatabase : function(cfg) {
    	oDatabaseManager = this;
        this.getServerQuery({
    		command: this.getCommands().emlInitialize,
    		params: {
    		},    		
    		onSuccess: function(oResult) {
    			if (typeof cfg.onSuccess != "undefined") {
    				cfg.onSuccess(oResult);
    			}
            },            
            onFail: function(oResult) {
            	oDatabaseManager.logError('Server connection failed. Check the internet connection');
            	if (typeof cfg.onFail != "undefined") {
            		cfg.onFail(oResult);
            	}
            }
    	});
    }
});
