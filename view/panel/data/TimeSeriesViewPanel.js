/**
 * eLifeLog API demo: Time Series Viewe Panel
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.data.TimeSeriesViewPanel', {
 *     	fullscreen:true
 *     });
 */

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// Generate random color distinguishable to human
// Reference: http://stackoverflow.com/questions/10014271/generate-random-color-distinguishable-to-humans
Colors = {};
Colors.names = {
    aqua: "#00ffff",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    black: "#000000",
    blue: "#0000ff",
    brown: "#a52a2a",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgrey: "#a9a9a9",
    darkgreen: "#006400",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkviolet: "#9400d3",
    fuchsia: "#ff00ff",
    gold: "#ffd700",
    green: "#008000",
    indigo: "#4b0082",
    khaki: "#f0e68c",
    lightblue: "#add8e6",
    lightcyan: "#e0ffff",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    magenta: "#ff00ff",
    maroon: "#800000",
    navy: "#000080",
    olive: "#808000",
    orange: "#ffa500",
    pink: "#ffc0cb",
    purple: "#800080",
    violet: "#800080",
    red: "#ff0000",
    silver: "#c0c0c0",
    white: "#ffffff",
    yellow: "#ffff00"
};

Colors.random = function() {
    var result;
    var count = 0;
    for (var prop in this.names)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
};

Ext.define('Elog.view.panel.data.TimeSeriesViewPanel', {
    extend: 'Elog.view.panel.Base',
    requires: [
    /*
       'Ext.chart.Chart',
       'Ext.chart.series.Line',
       'Ext.chart.axis.Numeric',
       'Ext.chart.axis.Time',
       'Ext.chart.interactions.CrossZoom'
    */
    ],
    xtype: 'elogTimeSeriesViewPanel',
    config : {
    	layout: {
	        type: 'fit',
	        align: 'stretch'
		},
		defaults: {
	        flex: 1
	    },
        items: []
    },
    
    /**
     * Process eLog server data query return results
     * @param {} oResult
     */
    onLoadSource : function (oResult) {
    	var oChart = this.getItems().items[0];
    	
    	// Process store
    	var oStoreData = [];
    	var oNewFields = [{
    		"name":"utcTimestampinMillisecond",
    		"table":"",
    		"maxLength":13,
    		"flags":32897,
    		"typeCategory":"numeric",
    		"typeName":"BIGINT"
		}];
    	
    	for (mediaType in oResult.results) {
    		var oMediaResult = oResult.results[mediaType];
    		
    		if (typeof oMediaResult.root !== 'undefined') {
    			oMediaResult.root.forEach(function(oData, i) {
    				if (typeof oData.result !== 'undefined') {
    					var oFieldInfo = oData.result.fieldInfo;
			    		oFieldInfo.forEach(function(oField) {
			    			if (oField['typeCategory'] == 'numeric' &&
			    				oField['name'].search(/timestamp/i) == -1) {
			    				oNewFields = oNewFields.concat(oField);
			    			}
			    		});
			    		
    					oStoreData = oStoreData.concat(oData.result.data);
	    			}
    			});
            };
    	}
    	
    	// Process data -- normalization for multi-rows like representations
    	var oTimestamps = [];
	
	    oStoreData.forEach(function(oData) {
	    	oTimestamps.push(oData['utcTimestampinMillisecond']);
	    });
	    
	    // Filter out unique timestamps
	    // Reference: http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array
	    oTimestamps = oTimestamps.filter(function(elem, pos) {
		    return oTimestamps.indexOf(elem) == pos;
		});
		
	    oTimestamps = oTimestamps.sort();
	    
		// Normalize data 
		oNewFields.forEach(function(oField, i) {
			if (oField['name'] != 'utcTimestampinMillisecond') {
				// eLogxxx fields are reserved fields not to be used in the source data
				oField['eLogMeanY'] = parseInt(100/oNewFields.length*(oNewFields.length - i - 1/2)); // mean Y position
				oField['eLogDeltaY'] = parseInt(100/oNewFields.length/2); // +- max variable range
				
				oField["eLogMax"] = oStoreData.reduce(function(a, b, index, array) { 
					if (typeof a == 'object' && a.hasOwnProperty(oField['name'])) {
						if (b.hasOwnProperty(oField['name'])) {
							return (Number(a[oField['name']]) > Number(b[oField['name']])) ? 
								Number(a[oField['name']]) : Number(b[oField['name']]);
						}
						else {
							return Number(a[oField['name']]);
						}
					}
					else if (isNumber(a)) {
						if (typeof b == 'object' && b.hasOwnProperty(oField['name'])) {
							return (a > Number(b[oField['name']])) ? 
								a : Number(b[oField['name']]);
						}
						else if (isNumber(b)) {
							return (a > b) ? a : b;
						}
						else {
							return a;
						}
					}
					else if (typeof b == 'object' && b.hasOwnProperty(oField['name'])) {
						// XXX: Or else valid value
						return Number(b[oField['name']]);
					}
					
					// Or return the first non-trivial value
					for (var i = index; i < array.length; ++i) {
						if (array[i].hasOwnProperty(oField['name'])) {
							return Number(array[i][oField['name']]);
						}
					}
				});
				
				oField["eLogMin"] = oStoreData.reduce(function(a, b, index, array) { 
					if (typeof a == 'object' && a.hasOwnProperty(oField['name'])) {
						if (b.hasOwnProperty(oField['name'])) {
							return (Number(a[oField['name']]) < Number(b[oField['name']])) ? 
								Number(a[oField['name']]) : Number(b[oField['name']]);
						}
						else {
							return Number(a[oField['name']]);
						}
					}
					else if (isNumber(a)) {
						if (typeof b == 'object' && b.hasOwnProperty(oField['name'])) {
							return (a < Number(b[oField['name']])) ? 
								a : Number(b[oField['name']]);
						}
						else if (isNumber(b)) {
							return (a < b) ? a : b;
						}
						else {
							return a;
						}
					}
					else if (typeof b == 'object' && b.hasOwnProperty(oField['name'])) {
						// XXX: Or else valid value
						return Number(b[oField['name']]);
					}
					
					// Or return last non-trivial value
					for (var i = index; i < array.length; ++i) {
						if (array[i].hasOwnProperty(oField['name'])) {
							return Number(array[i][oField['name']]);
						}
					}
				});
				
				// normalize data
				oStoreData.forEach(function(element, index, array) {
					if (element.hasOwnProperty(oField['name']) && isNumber(element[oField['name']])) {
						var oNewValue;
						if (oField["eLogMax"] == oField["eLogMin"]) {
							oNewValue = oField["eLogMeanY"];
						}
						else {
							oNewValue = (Number(element[oField['name']]) - oField["eLogMin"]) / (oField["eLogMax"] - oField["eLogMin"]) * oField["eLogDeltaY"]*2 + oField["eLogMeanY"] - oField['eLogDeltaY'];
						}
						element[oField['name']] = oNewValue;
					}
				});
			}
		});
		
		// Sort data
		var oSortedData = [];
		
		oTimestamps.forEach(function(oTimestamp) {
			var oNewData = {
				'utcTimestampinMillisecond' : Number(oTimestamp)
			};
			
			// Initialize new properties as null
			oNewFields.forEach(function(oField) {
				if (oField['name'] != 'utcTimestampinMillisecond') {
					oNewData[oField['name']] = null; 
				}
			});
			
			var matchingData = oStoreData.filter(function(elem, pos) {
			    return elem['utcTimestampinMillisecond'] == oTimestamp;
			});
			
			matchingData.forEach(function (oData) {
				Object.keys(oData).forEach(function(oKey) {
					if (oKey !== 'utcTimestampinMillisecond') {
						oNewData[oKey] = oData[oKey];
					}
				});
			});
			
			oSortedData.push(oNewData);
		});
		
		
		// Fill up average value from the head and tail
		oNewFields.forEach(function(oField) {
			if (oField['name'] != 'utcTimestampinMillisecond') {
				var i;
				for (i = 0; i < oSortedData.length; ++i) {
					if (oSortedData[i][oField['name']] === null || 
						oSortedData[i][oField['name']] === 0) {
						oSortedData[i][oField['name']] = oField['eLogMeanY'];
					}
					else break;
				}
				
				for (i = oSortedData.length - 1; i >= 0 ; --i) {
					if (oSortedData[i][oField['name']] === null || 
						oSortedData[i][oField['name']] === 0) {
						oSortedData[i][oField['name']] = oField['eLogMeanY'];
					}
					else break;
				}
			}
		});
		
		// Perform interpolation. This is forward scanning
		oSortedData.forEach(function(oData, i) {
			// Initialize new properties as null
			oNewFields.forEach(function(oField) {
				if (oField['name'] != 'utcTimestampinMillisecond' &&
					oData[oField['name']] === null ||
					oData[oField['name']] === 0) {
					for (var j = i+1; j < oSortedData.length; ++j) {
						// Since this is mean-shifted data, there should be no null and no zero if meaningful.
						if (oSortedData[j][oField['name']] !== null && oSortedData[j][oField['name']] !== 0) {
							break;
						}
					}
					
					// Fill up all null values in between i and j
					// so do not need to repeat this step
					for (var k = i; k < j; ++k) {
						oSortedData[k][oField['name']] =  oSortedData[i-1][oField['name']] +  (oSortedData[j][oField['name']] - oSortedData[i-1][oField['name']]) / (j - i + 1) * (k - i +1);
					}
				}
			});
	    });
		
    	// Process series
    	var oSeriesData = [];
    	
    	oNewFields.forEach(function(oField) {
    		if (oField['name'] != 'utcTimestampinMillisecond') {
    			var oSeriesColor = Colors.names[Colors.random()];
    			oSeriesData = oSeriesData.concat({
	    			type: 'line',
			        xField: 'utcTimestampinMillisecond',
			        yField: oField['name'],
			        title: oField['name'],
			        style: {
			        //    fill: oSeriesColor,
			            stroke: oSeriesColor,
			            fillOpacity: 0.6,
			        //    miterLimit: 3,
			        //    lineCap: 'miter',
			        //    lineWidth: 2
			        },
			        showInLegend: true
	    		});
    		}
    	});
    	
    	var oChartFields = [];
    	
    	oNewFields.forEach(function(oField) {
    		oChartFields.push(oField['name']);
    	});
    	
    	
    	// Set the time increment
    	var maxTimestamp = oTimestamps.reduce(function(a, b) { return (a > b) ? a : b });
		var minTimestamp = oTimestamps.reduce(function(a, b) { return (a < b) ? a : b });
		var oTimeIncrement = parseInt((maxTimestamp - minTimestamp)/10);
			
    	var oNewChart = new Ext.chart.CartesianChart({
	        id: 'barchartgenerateview',
	        store: {
	            fields: oChartFields,
	            data: oSortedData
	        },
	        background: 'white',
	        interactions: [
	            {
	                type: 'crosszoom',
	                zoomOnPanGesture: false
	            }
	        ],
		    legend: {
		      docked: 'right'
		    },
	        series: oSeriesData,
	        axes: [
	        {
        		type: 'numeric',
        		position: 'left',
        		visibleRange: [0,100]
        		/*
        		fields: ['value'],
        		title: {
        			text: 'Y axis',
        			fontSize: 20
        		}
        		*/
        	},{
        		type: 'time',
        		dateFormat: 'Y-m-d H:i:s',
        		// visibleRange: [0,1],
        		position: 'bottom',
        		fields: 'utcTimestampinMillisecond',
        		increment: oTimeIncrement
        		/*,
        		title: {
        			text: 'Date',
        			fontSize: 20
        		}
        		*/
        	}]
	    });
	    
    	this.add(oNewChart);
    }
});