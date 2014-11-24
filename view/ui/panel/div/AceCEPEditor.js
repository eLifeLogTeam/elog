/**
 * CEP Syntax-highlight editor
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.ui.panel.div.AceCEPEditor', {
 *     	fullscreen:true
 *     });
 */
Ext.define('Elog.view.ui.panel.div.AceCEPEditor', {
    extend: 'Elog.view.ui.panel.div.Base',
    xtype: 'elogAceCEPEditor',
    config : {
		// height: '25px',
    	// scrollable: 'vertical',
    	// divStyle: 'height: 100%; width: 100%; align: center, border: 0px solid #aaa',
    	divStyle: 'position: absolute; top: 0; right: 0; bottom: 0; left: 0;height: 100%; width: 100%; align: center, border: 0px solid #aaa',
    	AceCEPEditor: null,
    	lastEventUnixMillitime: null,
    },
	
	/**
	 * Instantiate a progress bar on the selected object
	 */
	init: function() {
		var oViewer = this;
		oViewer.setAceCEPEditor(ace.edit(oViewer.getDivId()));
	    oViewer.getAceCEPEditor().setTheme("ace/theme/monokai");
	    oViewer.getAceCEPEditor().getSession().setMode("ace/mode/esper");
	    oViewer.getAceCEPEditor().getSession().setUseWrapMode(true);
	    
	    // Attach listener
	    oViewer.getAceCEPEditor().on("change", function(e) {
	    	// Fire event frequency: max 500 milliseconds
	    	var oCurrentEventUnixMillitime = new Date().getTime();
	    	if (oViewer.getLastEventUnixMillitime() == null ||
	    		oCurrentEventUnixMillitime > oViewer.getLastEventUnixMillitime() + 500) {
    			setTimeout(function() {
			        oViewer.fireEvent("change", e);
			    }, 500);
			    oViewer.setLastEventUnixMillitime(oCurrentEventUnixMillitime);
	    	}
	    });
	},
	
	/** 
	 * Analyze CEP pattern to retrieve pattern definition
	 * @return {}
	 */
	getPatternDefinition: function() {
		var oViewer = this;
		
    	if (oViewer.getAceCEPEditor() != null) {
    		var oAceEditor = oViewer.getAceCEPEditor();
    		var oQuery = oAceEditor.getValue();
    		// Trim oQuery
    		oQuery = oQuery.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, '$1');
    		oQuery = oQuery.trim();
    		
    		var oSensorName = null;
    		var pattSensorName = /select\s*?'(.*?)'\s*?as\s*?sensor/g;
    		var oFoundSensorName = pattSensorName.exec(oQuery);
			if (oFoundSensorName != null) {
				oSensorName = oFoundSensorName[1];
			}
    		
    		var oInputSensors = [];
    		// Analyze source pattern to retrieve input sensors
			var pattIsArray = /isSensor\(\s*?'(.*?)'\s*?\)/g;
			var pattInArray = /inSensor\(\s*?'(.*?)'\s*?\)/g;
			var pattIsNotArray = /isNotSensor\(\s*?'(.*?)'\s*?\)/g;
			
			var oIsArray = [];
			var oInArray = [];
			var oIsNotArray = [];
			
			var oFoundIsArray;
			while ((oFoundIsArray = pattIsArray.exec(oQuery)) != null) {
				if(oIsArray.indexOf(oFoundIsArray[1]) == -1) {
			    	oIsArray.push(oFoundIsArray[1]);
				}
			}
			
			var oFoundInArray;
			while ((oFoundInArray = pattInArray.exec(oQuery)) != null) {
				if(oInArray.indexOf(oFoundInArray[1]) == -1) {
			        oInArray.push(oFoundInArray[1]);
			    }
			}
			
			var oFoundIsNotArray;
			while ((oFoundIsNotArray = pattIsNotArray.exec(oQuery)) != null) {
				if(oIsNotArray.indexOf(oFoundIsNotArray[1]) == -1) {
			    	oIsNotArray.push(oFoundIsNotArray[1]);
				}
			}
			
			// Merged input sensors
			if (oIsArray.length > 0) oInputSensors.push("isSensor('"+oIsArray.join(';')+"')");
			if (oInArray.length > 0) oInputSensors.push("inSensor('"+oInArray.join(';')+"')");
			if (oIsNotArray.length > 0) oInputSensors.push("isNotSensor('"+oIsNotArray.join(';')+"')");
			
			return {
				"sensorName" : oSensorName,
				"query" : oQuery,
				"inputSensors" : oInputSensors.join()
			};
    	}
    	
    	return null;
	}
});