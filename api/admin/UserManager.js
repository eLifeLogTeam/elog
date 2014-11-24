/**
 * User Management Library
 * 
 * Check the server responce format below. If you are developing your own user verification, 
 * its response format should be like below.
 * 	callback({
 * 		"root": [{
 * 			"user_id": "youruserid",
 * 			"database_password": "yourdbpassword",
 * 			"user_key": "yourapikey",
 * 			"host_name": "yourhostname",
 * 			"database_name": "yourdbname",
 * 			"database_user_id": "yourdbusername"
 * 		}]
 * 	});
 * 
 */
Ext.define('Elog.api.admin.UserManager', {
    extend: 'Elog.api.Base',
    requires: [
       'Elog.api.Base',
       'Ext.data.JsonP'
    ],
    config: {
    },
	
    constructor: function(cfg) {
    	this.callParent(cfg);

    	return this;
    },
    
    /**
     * Verify user information. If matched, it returns complete user information.
     * 
     * @param {Object} cfg User information to authenticate.
     * @param {String} cfg.userId your user id.
     * @param {String} cfg.userPassword your password.
     * @param {Function} cfg.onSuccess function to call on success.
     * @param {Object} cfg.onSuccess.oResult Query result.
     * @param {Function} cfg.onFail function to call on fail.
     * @param {Object} cfg.onFail.oResult Query result.
     * 
     * @return {Object} Responce format: 
     * 		callback({
     * 			"root": [{
     * 				"user_id": "youruserid",
     * 				"database_password": "yourdbpassword",
     * 				"user_key": "yourapikey",
     * 				"host_name": "yourhostname",
     * 				"database_name": "yourdbname",
     * 				"database_user_id": "yourdbusername"
     * 			}]
     * 		});
     */
    getUserInformation : function (cfg) {
    	oUserManager = this;
    	
    	this.getServerQuery({
    		serverUrl: cfg.serverUrl,
    		command: this.getCommands().checkUserInformation,
    		params: {
				userId: cfg.userId,
                userPassword: cfg.userPassword
    		},
    		onSuccess: function(oResult) {
            	oUserManager.setCookie("server_url", cfg.serverUrl);
            	
    			if (oResult.root.length > 0 &&
					oResult.root[0].user_key !== undefined &&
    				oResult.root[0].user_key != "") {
    				oUserManager.onLogin({
    					userKey: oResult.root[0].user_key,
    					userId: oResult.root[0].user_id
    				});
    				
    				if (typeof cfg.onSuccess !== 'undefined') {
    					cfg.onSuccess(oResult);
    				}
    			}
    			else {
    				if (typeof cfg.onFail !== 'undefined') {
    					cfg.onFail(oResult);
    				}
    			}
            },
            
            onFail: function(oResult) {
            	oUserManager.deleteCookie("server_url");
            	cfg.onConnectionFail(oResult);
            }
    	});
    },
    
    /**
     * Check the elog server setup status
     * 
     * @param {Object} cfg
     */
    checkSetup: function (cfg) {
    	oUserManager = this;
    	
    	this.getServerQuery({
    		serverUrl: cfg.serverUrl,
    		command: this.getCommands().checkSetup,
    		params: cfg.params,
    		onSuccess: function(oResult) {
    			oUserManager.setCookie("server_url", cfg.serverUrl);
    			if (oResult.root == false) {
    				if (typeof cfg.onSetupNonExist !== 'undefined') {
    					cfg.onSetupNonExist(oResult);
    				}
        		}
        		else {
        			if (typeof cfg.onSetupExist !== 'undefined') {
    					cfg.onSetupExist(oResult);
    				}
        		}
            },
            
            onFail: function(oResult) {
            	oUserManager.deleteCookie("server_url");
            	cfg.onConnectionFail(oResult);
            }
    	});
    },
    
    /**
     * Perform the initial server setup
     * 
     * @param {Object} cfg
     * @param {String} cfg.adminUserId Administrator user ID
     * @param {String} cfg.adminUserPassword Administrator user password
     * @param {String} cfg.dbAddress Database address
     * @param {String} cfg.dbAdminUserId Database user ID. This should be the admin account that can creates database and set the priviledge
     * @param {String} cfg.dbAdminUserPassword Database user password
     * @param {String} cfg.dbType Database type. It currently supports MySQL only.
     */
    runSetup : function (cfg) {
    	oUserManager = this;
    	
    	this.getServerQuery({
    		serverUrl: cfg.serverUrl,
    		command: this.getCommands().configSetup,
    		params: cfg.params, 
    		onSuccess: function(oResult) {
            	oUserManager.setCookie("server_url", cfg.serverUrl);
	            if (typeof oResult.root.userKey !== undefined &&
	               oResult.root.userKey != "") {
	               oUserManager.onLogin({
	                  userKey: oResult.root.userKey,
	                  userId: oResult.root.userId
	               }); 
	    
	               if (typeof cfg.onSuccess !== 'undefined') {
	                  cfg.onSuccess(oResult);
	               }   
	            } 
    			else {
    				if (typeof cfg.onFail !== 'undefined') {
    					cfg.onFail(oResult);
    				}
    			}
            },
            
            onFail: function(oResult) {
            	oUserManager.deleteCookie("server_url");
            	cfg.onConnectionFail(oResult);
            }
    	});
    },

    /**
     * Register a user
     * 
     * @param {Object} cfg
     * @param {String} cfg.userId Administrator user ID
     * @param {String} cfg.userPassword Administrator user password
     * @param {String} cfg.userEmail User email address
     * @param {String} cfg.userIsAdmin Admin user status
     */
    registerUser : function (cfg) {
    	oUserManager = this;
    	    	
    	this.getServerQuery({
    		serverUrl: cfg.serverUrl,
    		command: this.getCommands().registerUser,
    		params: cfg.params, 
    		onSuccess: function(oResult) {
            	oUserManager.setCookie("server_url", cfg.serverUrl);
    			if (typeof oResult.root !== undefined &&
    				oResult.root.userKey != "") {
    				oUserManager.onLogin({
    					userKey: oResult.root.userKey,
    					userId: oResult.root.userId
    				});
    				
    				if (typeof cfg.onSuccess !== 'undefined') {
    					cfg.onSuccess(oResult);
    				}
    			}
    			else {
    				if (typeof cfg.onFail !== 'undefined') {
    					cfg.onFail(oResult);
    				}
    			}
            },
            
            onFail: function(oResult) {
            	oUserManager.deleteCookie("server_url");
            	cfg.onConnectionFail(oResult);
            }
    	});
    },
    
    /**
     * Record user information cookie
     * @param {Object} oUser User information to record into the cookie
     * @param {String} oUser.userKey User key
     * @param {String} oUser.userId User Id
     * 
     */
    onLogin : function (oUser) {
    	// Set user information
    	this.setCookie("user_key", oUser.userKey);
    	this.setCookie("user_id", oUser.userId);
    },
    
    /**
     * Check the status of user log in
     */
    isLoggedIn : function () {
    	if (typeof this.getCookie('user_key') !== "undefined") {
    		return true;
    	}
    	
    	return false;
    },
    
    /**
     * Delete cookies
     */
    onLogout : function () {
    	this.deleteCookie("user_key");
    	this.deleteCookie("user_id");
    }
});
