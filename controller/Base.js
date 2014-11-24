/**
 * Elog controller: Base
 * 
 * The base class for Elog controllers.
 * 
 */
Ext.define('Elog.controller.Base', {
	extend: 'Ext.app.Controller',
    // mixins: ['Elog.api.Base'],
    requires: [
       'Ext.app.Controller'
    ],
	
	config: {
		elogError: [],
		elogStatus: [],
		
		refs: {
			elogInstruction: '#idElogInstruction'
		}
	},
    
	/**
	 * Log error
	 * 
	 * @param {String} sError
	 */
	logError : function (sError) {
		this.getElogError().push({
			"class" : Ext.getClassName(this),
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
			"class" : Ext.getClassName(this),
			"message" : sStatus.substr(0, 1000),
			"timestamp" : Math.round((new Date()).getTime())
		});
	},
	
	/**
	 * Attach the result of other object that inherits Elog.controller.Base
	 * or Elog.api.Base or the array with error and status entities 
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
		else if (typeof oObject.result !== "undefined") {
			if (typeof oObject.result.error !== "undefined" &&
				typeof oObject.result.status !== "undefined") {
				this.attachError(oObject.result.error);
				this.attachStatus(oObject.result.status);
			}
		}
		else if (typeof oObject.results !== "undefined") {
			var resultType;
			for (resultType in oObject.results) {
				var result = oObject.results[resultType];
        		if (typeof result.error !== "undefined" &&
					typeof result.status !== "undefined") {
					this.attachError(result.error);
					this.attachStatus(result.status);
				}
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
		this.setElogStatus(this.getElogStatus().concat(oStatus));
	},
	
	/**
	 * Format result to get the summary
	 */
	getSummary: function(result) {
		if (typeof result != 'undefined') {
			this.attachResult(result);
		}
		
		var oSummary = '';
		
		// Reverse the order of logs temporally descendantly
		var oError;
		this.getElogError().reverse();
		while (oError = this.getElogError().pop()) {
			if (typeof oError.timestamp != "undefined") {
				oDate = new Date(oError.timestamp);
				oSummary = oSummary + 'Error: ' + oError.message + '<br>[' + oError.className + ', '+ oDate.toString() + ']<br>';
			}
		}

		// Reverse the order of logs temporally descendantly
		this.getElogStatus().reverse();
		var oStatus;		
		while (oStatus = this.getElogStatus().pop()) {
			if (typeof oStatus.timestamp != "undefined") {
				oDate = new Date(oStatus.timestamp);
				oSummary = oSummary + 'Status: ' + oStatus.message + '<br>[' + oStatus.className + ', '+ oDate.toString() + ']<br>';
			}
		}
		
		return oSummary;
	},
	
	/**
	 * Update the instruction
	 */
	updateInstruction: function() {
		if (!Ext.os.is('Phone')) {
			this.setInstruction(this.getSummary());
		}
	},
	
	/**
	 * Show status information
	 * 
	 * @param {String} message
	 */
	setInstruction: function(message) {
		if (message == '') return false;
		console.log(message);
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
	}
});
