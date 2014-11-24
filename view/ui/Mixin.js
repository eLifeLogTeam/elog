/**
 * Elog.view.ui.Mixin class is to support the common error logging and reporting structure 
 * through heterognenous UIs.
 * 
 * 
 * @author pilhokim
 * 
 */
Ext.define('Elog.view.ui.Mixin', {
    // extend: 'Ext.Container',
	extend: 'Elog.api.Base',
    mixins: ['Ext.mixin.Observable'],
    config : {
    	currentUnixTimestamp: null,
    	lastEvent: null,
    	startTimestamp: null,
    	endTimestamp: null,
    	startUnixtime: null,
    	endUnixtime: null,
	},
	
	/**
	 * Inherited or mixed-in child classes should implement below common functions.
	 * 
	 * They should also put "this.callParent();" at the start of the function
	 */ 
	/**
     * Initialize
     */
    init: function() {
    	this.callParent();
    },
	
    /**
     * fireEvent while keeping the record
     * 
     * Be aware that the best pratice to fire this event is the reaction to user's input.
     * 
     * @param {} oEvent It is an object composed of eventName and eventConfig objects.
     * 
     */
    fireElogEvent: function (oEvent) {
    	this.setLastEvent(oEvent);
    	if (oEvent.eventName == "timechange") {
    		// oConfig is a unixtimestamp in second, not in millisecond
    		this.setCurrentUnixTimestamp(oEvent.eventConfig.unixTimestamp);
    	}
    	
    	oEvent.eventConfig.unixTimestamp = parseInt(oEvent.eventConfig.unixTimestamp);
    	
    	this.fireEvent(oEvent.eventName, oEvent.eventConfig);
    },
    
    /**
     * React to the time change
     * 
     * @param {} oUnixtimestamp
     */
	onTimeChange : function(oEventConfig) {
		var oUnixTimestamp = oEventConfig.unixTimestamp;
		if (parseInt(this.getCurrentUnixTimestamp()) == null) {
			this.setCurrentUnixTimestamp(oUnixTimestamp);
		}
	},
	
	/**
	 * Load data. The result is the output of the oMedia.getSensorDatabyTimeSpan() call.
	 * 
	 * @param {JSONObject} oResult The output of the oMedia.getSensorDatabyTimeSpan
	 */
    loadEvents : function(oResult) {	
    },
    
    getTimeRangeFromCookie: function() {
    	var oObject = this;
    	// var oApiBase = new Elog.api.Base();
		if (typeof oObject.getCookie('elogStartTime') !== 'undefined') {
			oObject.setStartTimestamp(new Date(oObject.getCookie('elogStartTime')));
			oObject.setStartUnixtime(parseInt(oObject.getStartTimestamp().getTime()/1000));
    	}
    	if (typeof oObject.getCookie('elogEndTime') !== 'undefined') {
			oObject.setEndTimestamp(new Date(oObject.getCookie('elogEndTime')));
			oObject.setEndUnixtime(parseInt(oObject.getEndTimestamp().getTime()/1000));
    	}
    },
});