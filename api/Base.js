/**
 * The base class for eLifeLog Javascript APIs
 * 
 * ## eLog server API list
 * The list of server service APIs is available at [eLifelog Server APIs](#!/guide/server_api).
 * For the service call, use {@link Elog.api.Base#getServerQuery getServerQuery} and check its instruction.
 * 	
 */
Ext.define('Elog.api.Base', {
	// extend: 'Elog.controller.Base',
	requires: [
       // 'Elog.controller.Base',
	   // XXX: Commented out due to the loading error in iOS simluator when not packaged with Sencha Touch, May 13th, 2013
       // 'Ext.device.Connection'
    ],
	config: {
		pictosIconBaseUrl: window.location.origin+"/lab/elog/sdk/sencha-touch/resources/themes/images/default/pictos/",
		externalIconBaseUrl: window.location.origin+"/lab/elog/sdk/library/buttoniconcollection/",
		mapIconBaseUrl: window.location.origin+"/lab/elog/sdk/library/mapiconscollection-markers/",
	
		name: "eLifeLog Javascript API base class",
		/**
		 * List of eLifelog server service commands
		 */
		commands: {
			// Administration
			/**w
			 * Check user information
			 * 
			 * @type String
			 */
			checkUserInformation: 'Admin.base.CheckUserInformation',
            registerUser: 'Admin.base.RegisterUser',
            getUserApiKey: 'Admin.base.GetUserApiKey',
            configSetup: 'Admin.base.Setup',
            checkSetup: 'Admin.base.CheckSetup',
            
            // Database
            getUserDatabaseInformation: 'Database.base.GetUserDatabaseInformation',
            getUserDatabaseTables: 'Database.base.GetUserDatabaseTables',
            
            // File
            getUserFileDir: 'File.base.GetUserFileDir',
            putUserFile: 'File.base.PutUserFile',
            
            // This is a special command to restore the API testing data
            restoreTestData: 'File.base.RestoreTestData',
            
            // Media
            getList: 'Media.base.GetList',
            getListbyTimestamps: 'Media.base.GetListbyTimestamps',
            loadChildMedia: 'Media.base.LoadChildMedia',
            uploadChildMedia: 'Media.base.LoadChildMedia',
            getMedia: 'Media.base.GetMedia',
            getTimestamps: 'Media.base.GetTimestamps',
            getData: 'Media.base.GetData',
            getValidMediaType: 'Media.base.GetValidMediaType',
            isValidMedia: 'Media.base.IsValidMedia',
            getPreview: 'Media.base.GetPreview',
            loadMedia: 'Media.base.LoadMedia',
            registerChildMedia: 'Media.base.RegisterChildMedia',
            removeMedia: 'Media.base.RemoveMedia',
            download: 'Media.base.Download',
            
            // GPS
            gpsGetMediabyTimespan: 'Media.gps.GetMediabyTimeSpan',
            getGpsCluster: 'Media.gps.GetGpsCluster',
            gpsLoadTimeRange: 'Media.gps.LoadTimeRange',
            
            // EML store
            workMonitor: 'Eml.store.base.WorkMonitor',
            getListbyTimeLimit: 'Eml.store.base.GetListByTimeLimit',
            getSourcebyTimeLimit: 'Eml.store.base.GetSourceByTimeLimit',
            emlSetup: 'Eml.store.base.Setup',
            emlInitialize: 'Eml.store.base.Initialize',
            importJson: 'Eml.store.base.ImportJson',
            exportTable: 'Eml.store.base.ExportTable',
            queryGraph: 'Eml.store.base.QueryGraph',
            walkGraph: 'Eml.store.base.WalkGraph',
            registerJob: 'Eml.store.base.RegisterJob',
            getJobProgress: 'Eml.store.base.GetJobProgress',
            
            // EML MySQL store
            importMysqlTables: 'Eml.store.mysql.ImportMysqlTables',
            
            // EML Event Store
            getEventbyTimeLimit: 'Eml.store.event.GetEventByTimeLimit',
            
            // Sensor Key value
            getSensorData: 'Media.android.GetSensorData',
		},
		elogError: [],
		elogStatus: [],
        
        /**
         * Color LUT for Simile or other data representation
         * @type Object
         */
        colorLUT : [
    		"#CC0000",
    		"#FF0000",
    		"#007FFF",
    		"#FF7F00",
    		"#FF007F",
    		"#B22222",
    		"#FFFF00",
    		"#005C5C",
    		"#808080",
    		"#00FFFF"
        ],
    },
	
    constructor: function(cfg) {
    	this.initConfig(cfg);

    	// TODO: This directory retrieval method should be carefully checked later.
    	// this.setMapIconUrl(window.location.origin+"/lab/elog/sdk/library/mapiconscollection-markers/");
	    
    	return this;
    },
    
    /**
     * Unified server call function
     * 
     * @param {String} config E-log server API call command name. This value must exist and conform the eLog server API call name.
     * @param {String} config.serverUrl E-log server Url. This is used when a user logs in. This URL should contain the complete server address. For instance, http://www.yourhost.com/server/index.php
     * @param {String} config.apiKey User's server call API key. If not exists, it will check from the cookie or else fail.
     * @param {String} config.command Command name
     * @param {Object} config.params Command params
     * @param {Function} config.onSuccess A callback function on success
     * @param {Object} config.onSuccess.oResult A server responce
     * @param {Function} config.onFail A callback function on fail
     * @param {Object} config.onFail.oResult A server responce
     * @param {Function} config.onConnectionFail A callback function on connection fail.
     * @param {Object} config.onConnectionFail.oResult Check the oResult.status and oResult.message: to check the reason
     * @return {Object} {status: 'true' or 'false', message: result}
     * 
     */
    getServerQuery : function (config) {
    	var oServerParams = {};
    	
    	// Check parameter validity
    	if (typeof config.command == 'undefined') {
    		this.logError('Undefined command: '+config.command);
    		return false;
    	}
    	else {
    		// Merge the command into the parameters for Url request
    		oServerParams["command"] = config.command;
    	}
    	
    	// Check login status
    	if (typeof this.getCookie('user_key') == "undefined") {
    		// Is this login query?
    		if (typeof config.serverUrl == 'undefined') {
    			this.logError('A user is not logged in and this is not a login call.');
        		return false;
    		}
    		else {
    			if (typeof config.params !== 'undefined') {
            		// Attach user_key parameter
    				oServerParams["params"] = Ext.JSON.encode(config.params);
            	}
    		}
    	}
    	else {
    		// If logged in, then retrieve cookie values
    		config.serverUrl = this.getCookie('server_url');
    		
    		if (typeof config.params !== 'undefined') {
        		// Attach user_key parameter
    			oServerParams["userKey"] = this.getCookie('user_key');
    			if (typeof config.params["userKey"] == 'undefined') {
    				config.params["userKey"] = this.getCookie('user_key');
    			}
    			oServerParams["params"] = Ext.JSON.encode(config.params);
        	}
    	}
    	
    	// Back up the caller instance
    	oBase = this;
    	
    	var oRequestResult = false;
    	oRequestResult = Ext.data.JsonP.request({
            url: config.serverUrl,
            callbackKey: 'callback',
            params: oServerParams,
            timeout: 600000, // Appeared since Touch 2.0. Increase it to 60 seconds.
            success: function(oResult, oRequest) {
            	// Check success, failure
            	var bSuccess = false;
            	
            	if (typeof oResult["results"] !== 'undefined') {
            		var mediaType;
	            	
	            	for (mediaType in oResult.results) {
	            		var result = oResult.results[mediaType];
	            		
	            		if (result.root !== undefined) {
	            			bSuccess = true;
		    			}
		    			else {
		    				bSuccess = false;
		    				break;
		    			}
	            	}
	        	
	            	// Classify by the number of result count to keep the compatiblity with the old APIs.
	            	if (parseInt(oResult.count) > 1) {
	            		if (bSuccess) {
		            		if (typeof config.onSuccess !== 'undefined') {
		            			// Any new APIs that use here should process results in a new way as the array.
		    					return config.onSuccess(oResult);
		    				}
		            	}
		            	else {
		            		if (typeof config.onFail !== 'undefined') {
		    					config.onFail(result);
		    				}
		            	}
					}
					else {
						if (bSuccess) {
							for (mediaType in oResult.results) {
	            				var result = oResult.results[mediaType];
			            		if (result.root !== undefined) {
				    				if (typeof config.onSuccess !== 'undefined') {
				    					return config.onSuccess(result);
				    				}
				    			}
			            	}
						}
						else {
							for (mediaType in oResult.results) {
	            				var result = oResult.results[mediaType];
			            		if (result.root !== undefined) {
				    				if (typeof config.onFail !== 'undefined') {
				    					return config.onFail(result);
				    				}
				    			}
			            	}
	    				}
					}
            	}
            	else {
	                if (typeof oResult.root !== 'undefined') {
	                    if (typeof config.onSuccess !== 'undefined') {
	                        config.onSuccess(oResult);
	                    }   
	                }   
	                else {
	                    if (typeof config.onFail !== 'undefined') {
	                        config.onFail(oResult);
	                    }
	                }
            	}
            },
            failure: function(oResult, oRequest) {
            	// oUserManager.deleteCookie("server_url");
            	if (typeof config.onConnectionFail !== 'undefined') {
            		config.onConnectionFail(oResult);
            	}
            	else {
            		// Check the network status
					// XXX: Commented out due to the loading error in iOS simluator, May 13th, 2013
					/*
            		if (Ext.device.Connection.isOnline()) {
            			oBase.logError('Connection is made through '+Ext.device.Connection.getType()+' but the server is not responding.');
                	}
            		else {
					*/
            			oBase.logError('No internet connection.');
                	/* }     
					*/
            	}
            }
        });
        
        // this.logStatus('Your server call is transferred.');
        return true;
    },
    
    
    /**
     * Unified server call url
     * 
     * @param {String} config E-log server API call command name. This value must exist and conform the eLog server API call name.
     * @param {String} config.serverUrl E-log server Url. This is used when a user logs in. This URL should contain the complete server address. For instance, http://www.yourhost.com/server/index.php
     * @param {String} config.apiKey User's server call API key. If not exists, it will check from the cookie or else fail.
     * @param {String} config.command Command name
     * @param {Object} config.params Command params
     * @param {Function} config.onSuccess A callback function on success
     * @param {Object} config.onSuccess.oResult A server responce
     * @param {Function} config.onFail A callback function on fail
     * @param {Object} config.onFail.oResult A server responce
     * @param {Function} config.onConnectionFail A callback function on connection fail.
     * @param {Object} config.onConnectionFail.oResult Check the oResult.status and oResult.message: to check the reason
     * @return {Object} {status: 'true' or 'false', message: result}
     * 
     */
    getServerQueryUrl : function (config) {
    	var oServerParams = {};
    	
    	// Check parameter validity
    	if (typeof config.command == 'undefined') {
    		this.logError('Undefined command: '+config.command);
    		return false;
    	}
    	else {
    		// Merge the command into the parameters for Url request
    		oServerParams["command"] = config.command;
    	}
    	
    	// Check login status
    	if (typeof this.getCookie('user_key') == "undefined") {
    		// Is this login query?
    		if (typeof config.serverUrl == 'undefined') {
    			this.logError('A user is not logged in and this is not a login call.');
        		return false;
    		}
    		else {
    			if (typeof config.params !== 'undefined') {
            		// Attach user_key parameter
    				oServerParams["params"] = Ext.JSON.encode(config.params);
            	}
    		}
    	}
    	else {
    		// If logged in, then retrieve cookie values
    		config.serverUrl = this.getCookie('server_url');
    		
    		if (typeof config.params !== 'undefined') {
        		// Attach user_key parameter
    			oServerParams["userKey"] = this.getCookie('user_key');
    			if (typeof config.params["userKey"] == 'undefined') {
    				config.params["userKey"] = this.getCookie('user_key');
    			}
    			oServerParams["params"] = Ext.JSON.encode(config.params);
        	}
    	}
    	
    	oServerQueryUrl = {
    		url: config.serverUrl,
    		params: oServerParams,
    	};
    	
    	return oServerQueryUrl;
    },
    
    /**
     * Encodes string using MIME base64 algorithm
     * 
     * @param {String} data
     */
    base64Encode : function (data) {
        // Excerpted from http://kevin.vanzonneveld.net
        // +   original by: Tyler Akins (http://rumkin.com)
        // +   improved by: Bayron Guevara
        // +   improved by: Thunder.m
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   bugfixed by: Pellentesque Malesuada
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: Rafa≈Ç Kukawski (http://kukawski.pl)
        // *     example 1: base64_encode('Kevin van Zonneveld');
        // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
        // mozilla has this native
        // - but breaks in 2.0.0.12!
        //if (typeof this.window['atob'] == 'function') {
        //    return atob(data);
        //}
        var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
            ac = 0,
            enc = "",
            tmp_arr = [];

        if (!data) {
            return data;
        }

        do { // pack three octets into four hexets
            o1 = data.charCodeAt(i++);
            o2 = data.charCodeAt(i++);
            o3 = data.charCodeAt(i++);

            bits = o1 << 16 | o2 << 8 | o3;

            h1 = bits >> 18 & 0x3f;
            h2 = bits >> 12 & 0x3f;
            h3 = bits >> 6 & 0x3f;
            h4 = bits & 0x3f;

            // use hexets to index into b64, and append result to encoded string
            tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
        } while (i < data.length);

        enc = tmp_arr.join('');
        
        var r = data.length % 3;
        
        return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
    },
    
    /**
     * Decodes string using MIME base64 algorithm
     * 
     * @param {String} data
     */
    base64Decode : function (data) {
        // http://kevin.vanzonneveld.net
        // +   original by: Tyler Akins (http://rumkin.com)
        // +   improved by: Thunder.m
        // +      input by: Aman Gupta
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   bugfixed by: Onno Marsman
        // +   bugfixed by: Pellentesque Malesuada
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +      input by: Brett Zamir (http://brett-zamir.me)
        // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // *     example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
        // *     returns 1: 'Kevin van Zonneveld'
        // mozilla has this native
        // - but breaks in 2.0.0.12!
        //if (typeof this.window['btoa'] == 'function') {
        //    return btoa(data);
        //}
        var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
            ac = 0,
            dec = "",
            tmp_arr = [];

        if (!data) {
            return data;
        }
        
        if (typeof data != "string" || data.match('^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$') === null ||  data.match(' ') !== null) {
    		return data;
    	}

        data += '';

        do { // unpack four hexets into three octets using index points in b64
            h1 = b64.indexOf(data.charAt(i++));
            h2 = b64.indexOf(data.charAt(i++));
            h3 = b64.indexOf(data.charAt(i++));
            h4 = b64.indexOf(data.charAt(i++));

            bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

            o1 = bits >> 16 & 0xff;
            o2 = bits >> 8 & 0xff;
            o3 = bits & 0xff;

            if (h3 == 64) {
                tmp_arr[ac++] = String.fromCharCode(o1);
            } else if (h4 == 64) {
                tmp_arr[ac++] = String.fromCharCode(o1, o2);
            } else {
                tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
            }
        } while (i < data.length);

        dec = tmp_arr.join('');

        return dec;
    },
    
	/**
	 * Log error
	 * 
	 * @param {String} sError
	 */
	logError : function (sError) {
		this.getElogError().push({
			"className" : Ext.getClassName(this),
			"message" : sError.substr(0, 1000),
			"timestamp" : Math.round((new Date()).getTime())
		});
	},
    
    /**
	 * Log status
	 * 
	 * @param {String} sStatus
	 */
	logStatus : function (sStatus) {
		this.getElogStatus().push({
			"className" : Ext.getClassName(this),
			"message" : sStatus.substr(0, 1000),
			"timestamp" : Math.round((new Date()).getTime())
		});
	},
	
	/**
	 * Attach the result of other object that inherits Elog.controller.Base
	 * or Elog.api.Base or the array with error and status entities
	 * 
	 */
	attachResult: function (oObject) {
		if (typeof oObject.getElogError !== "undefined" &&
			typeof oObject.getElogStatus !== "undefined") {
			this.attachError(oObject.getElogError());
			this.attachStatus(oObject.getElogStatus());
		}
		else if (typeof oObject.error !== "undefined" &&
			typeof oObject.status !== "undefined") {
			this.attachError(oObject.error);
			this.attachStatus(oObject.status);
		}
		else if (typeof oObject.count !== "undefined") {
			for (resultType in oObject.results) {
				var result = oObject.results[resultType];
        		this.attachResult(result);
        	}
		}
	},
	
	/**
	 * Attach the error of other object.
	 * Mostly used to add the child object error instance.
	 * 
	 * @param {Object} oError
	 */
	attachError : function (oError) {
		this.setElogError(this.getElogError().concat(oError));
	},

	/**
	 * Attach the status of other object.
	 * Mostly used to add the child object status instance.
	 * 
	 * @param {Object} oStatus
	 */
	attachStatus : function (oStatus) {
		this.setElogError(this.getElogStatus().concat(oStatus));
	},
    
	/**
	 * From the given date object, prepare the UTC date string.
	 * 
	 * @param {Date} oDate
	 */
	getUTCDateString : function(oDate) {
		return (
			(oDate.getUTCFullYear()).toString()+'-'+
	        (oDate.getUTCMonth()+1).toString()+'-'+
	        (oDate.getUTCDate()).toString()+' '+
	        (oDate.getUTCHours()).toString()+':'+
	        (oDate.getUTCMinutes()).toString()+':'+
	        (oDate.getUTCSeconds()).toString()
	    );
	},

	/**
	 * From the given date object, prepare the date string.
	 * 
	 * @param {Date} oDate
	 */
	getDateString : function(oDate) {
		return (
			(oDate.getFullYear()).toString()+'-'+
	        (oDate.getMonth()+1).toString()+'-'+
	        (oDate.getDate()).toString()+' '+
	        (oDate.getHours()).toString()+':'+
	        (oDate.getMinutes()).toString()+':'+
	        (oDate.getSeconds()).toString()
	    );
	},
	/**
	 * Function : dump()
	 * 
	 * Excerpted from http://www.openjs.com/scripts/others/dump_function_php_print_r.php
	 * Copyrights all reserverd to them
	 * 
	 * Arguments: The data - array,hash(associative array),object
	 *    The level - OPTIONAL
	 * Returns  : The textual representation of the array.
	 * This function was inspired by the print_r function of PHP.
	 * This will accept some data as the argument and return a
	 * text that will be a more readable version of the
	 * array/hash/object that is given.
	 * Docs: http://www.openjs.com/scripts/others/dump_function_php_print_r.php
	 */
	dump : function (arr,level) {
		var dumped_text = "";
		if(!level) level = 0;
		
		if (level > 2) return ' [] ';
		
		//The padding given at the beginning of the line.
		var level_padding = "";
		for(var j=0;j<level+1;j++) level_padding += "    ";
		
		if(typeof(arr) == 'object') { //Array/Hashes/Objects 
			for(var item in arr) {
				var value = arr[item];
				
				if(typeof(value) == 'object') { //If it is an array,
					dumped_text += level_padding + "'" + item + "' ...\n";
					dumped_text += this.dump(value,level+1);
				} else {
					dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
				}
			}
		} else { //Stings/Chars/Numbers etc.
			dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
		}
		return dumped_text;
	},
	
    /**
     * Set user browser cookie
     * 
     * @param {String} c_name
     * @param {String} value
     * @param {Date} exdays
     */
    setCookie: function (c_name,value,exdays)
    {
	    var exdate=new Date();
	    exdate.setDate(exdate.getDate() + exdays);
	    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	    document.cookie=c_name + "=" + c_value;
    },

    /**
     * Delete user browser cookie
     * 
     * @param {String} c_name
     */
    deleteCookie: function (c_name)
    {
	    var c_value= "; expires=Thu, 01-Jan-70 00:00:01 GMT;";
	    document.cookie=c_name + "=" + c_value;
    },
    
    /**
     * Retrieve user browser cookie value by name
     * 
     * @param {String} c_name
     */
    getCookie: function (c_name)
    {
	    var i,x,y,ARRcookies=document.cookie.split(";");
	    for (i=0;i<ARRcookies.length;i++) {
	    	x = ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
	    	y = ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
	      	x = x.replace(/^\s+|\s+$/g,"");
	    	if (x == c_name) {
	        	return unescape(y);
	        }
	    }
    },
    
    /**
     * Get client time zone
     * @param{sHead} If specified, it is used ahead of '+/-Hour'. If null (different with ''), then 'GMT' is headed automatically.
     * @return {String} '+/-Hour'
     */
    getClientTimeZone: function (gmt)
    {
    	var currentTime = new Date();
		var currentTimezone = currentTime.getTimezoneOffset();
		currentTimezone = (currentTimezone/60) * -1;
		
		if (gmt === null) gmt = 'GMT';
		
		if (currentTimezone !== 0) {
			gmt += (currentTimezone >= 0) ? '+' : '-';
			
			// currentTimezone = String(currentTimezone);
			// if (currentTimezone.length === 1) currentTimezone = '0'+currentTimezone;
			
			gmt += currentTimezone;
		}
		
		return gmt;
    }
});
