/**
 * eLifeLog API: Time zone select field UI
 * 
 * This is the extension of [Sencha Touch Select field](http://docs.sencha.com/touch/2-0/#!/api/Ext.field.Select) 
 * for the timezone selection in eLog libraries. This icludes the list of all timezones that are currently supported by eLog libraries.
 * 
 * ## How to use
 * In designing the selection field in user GUI, use this field for timezone selection.
 * For instance when designing a media metadata tagger, you may use this field as time zone selector.
 * 
 * ## Example
 *
 *     @example preview
 *     	Ext.create('Elog.view.ui.ext.TimeZoneSelectField', {
 *     });
 * 
 */
Ext.define('Elog.view.ui.ext.TimeZoneSelectField', {
    extend: 'Ext.field.Select',
    requires: [
       'Ext.field.Select'
    ],
    mixins: ['Elog.view.ui.Mixin'],
    xtype: 'elogTimeZoneSelectField',
    config : {
		label: 'Timezone',
		/**
		 * Full data is available at http://en.wikipedia.org/wiki/List_of_tz_database_time_zones
         * Be aware that 34	AU	-3133+15905	Australia/Lord_Howe	Lord Howe Island	UTC+10:30	UTC+11
         * There is one time zone that shifts only 30 minutes. However here we do not include this case
         * For all other time zone, DST add 1 hours
		 */
        options : [
    		{value: "-12:00,0",text: "(-12:00) International Date Line West"},
    		{value: "-11:00,0",text: "(-11:00) Midway Island, Samoa"},
    		{value: "-10:00,0",text: "(-10:00) Hawaii"},
    		{value: "-09:00,1",text: "(-09:00) Alaska"},
    		{value: "-09:00,1,DST",text: "(-09:00,DST) Alaska"},
    		{value: "-08:00,1",text: "(-08:00) Pacific Time (US & Canada)"},
    		{value: "-08:00,1,DST",text: "(-08:00,DST) Pacific Time (US & Canada)"},
    		{value: "-07:00,0",text: "(-07:00) Arizona"},
    		{value: "-07:00,1",text: "(-07:00) Mountain Time (US & Canada)"},
    		{value: "-07:00,1,DST",text: "(-07:00,DST) Mountain Time (US & Canada)"},
    		{value: "-06:00,0",text: "(-06:00) Central America, Saskatchewan"},
    		{value: "-06:00,1",text: "(-06:00) Central Time (US & Canada), Guadalajara, Mexico city"},
    		{value: "-06:00,1,DST",text: "(-06:00,DST) Central Time (US & Canada), Guadalajara, Mexico city"},
    		{value: "-05:00,0",text: "(-05:00) Indiana, Bogota, Lima, Quito, Rio Branco"},
    		{value: "-05:00,1",text: "(-05:00) Eastern time (US & Canada)"},
    		{value: "-05:00,1,DST",text: "(-05:00,DST) Eastern time (US & Canada)"},
    		{value: "-04:00,1",text: "(-04:00) Atlantic time (Canada), Manaus, Santiago"},
    		{value: "-04:00,1,DST",text: "(-04:00,DST) Atlantic time (Canada), Manaus, Santiago"},
    		{value: "-04:00,0",text: "(-04:00) Caracas, La Paz"},
    		{value: "-03:30,1",text: "(-03:30) Newfoundland"},
    		{value: "-03:30,1,DST",text: "(-03:30,DST) Newfoundland"},
    		{value: "-03:00,1",text: "(-03:00) Greenland, Brasilia, Montevideo"},
    		{value: "-03:00,1,DST",text: "(-03:00,DST) Greenland, Brasilia, Montevideo"},
    		{value: "-03:00,0",text: "(-03:00) Buenos Aires, Georgetown"},
    		{value: "-02:00,1",text: "(-02:00) Mid-Atlantic"},
    		{value: "-02:00,1,DST",text: "(-02:00,DST) Mid-Atlantic"},
    		{value: "-01:00,1",text: "(-01:00) Azores"},
    		{value: "-01:00,1,DST",text: "(-01:00,DST) Azores"},
    		{value: "-01:00,0",text: "(-01:00) Cape Verde Is."},
    		{value: "00:00,0",text: "(00:00) Casablanca, Monrovia, Reykjavik"},
    		{value: "00:00,1",text: "(00:00) GMT: Dublin, Edinburgh, Lisbon, London"},
    		{value: "00:00,1,DST",text: "(00:00,DST) GMT: Dublin, Edinburgh, Lisbon, London"},
    		{value: "+01:00,1",text: "(+01:00) Amsterdam, Berlin, Rome, Vienna, Prague, Brussels"},
    		{value: "+01:00,1,DST",text: "(+01:00,DST) Amsterdam, Berlin, Rome, Vienna, Prague, Brussels"},
    		{value: "+01:00,0",text: "(+01:00) West Central Africa"},
    		{value: "+02:00,1",text: "(+02:00) Amman, Athens, Istanbul, Beirut, Cairo, Jerusalem"},
    		{value: "+02:00,1,DST",text: "(+02:00,DST) Amman, Athens, Istanbul, Beirut, Cairo, Jerusalem"},
    		{value: "+02:00,0",text: "(+02:00) Harare, Pretoria"},
    		{value: "+03:00,1",text: "(+03:00) Baghdad, Moscow, St. Petersburg, Volgograd"},
    		{value: "+03:00,1,DST",text: "(+03:00,DST) Baghdad, Moscow, St. Petersburg, Volgograd"},
    		{value: "+03:00,0",text: "(+03:00) Kuwait, Riyadh, Nairobi, Tbilisi"},
    		{value: "+03:30,0",text: "(+03:30) Tehran"},
    		{value: "+04:00,0",text: "(+04:00) Abu Dhadi, Muscat"},
    		{value: "+04:00,1",text: "(+04:00) Baku, Yerevan"},
    		{value: "+04:00,1,DST",text: "(+04:00,DST) Baku, Yerevan"},
    		{value: "+04:30,0",text: "(+04:30) Kabul"},
    		{value: "+05:00,1",text: "(+05:00) Ekaterinburg"},
    		{value: "+05:00,1,DST",text: "(+05:00,DST) Ekaterinburg"},
    		{value: "+05:00,0",text: "(+05:00) Islamabad, Karachi, Tashkent"},
    		{value: "+05:30,0",text: "(+05:30) Chennai, Kolkata, Mumbai, New Delhi, Sri Jayawardenepura"},
    		{value: "+05:45,0",text: "(+05:45) Kathmandu"},
    		{value: "+06:00,0",text: "(+06:00) Astana, Dhaka"},
    		{value: "+06:00,1",text: "(+06:00) Almaty, Nonosibirsk"},
    		{value: "+06:00,1,DST",text: "(+06:00,DST) Almaty, Nonosibirsk"},
    		{value: "+06:30,0",text: "(+06:30) Yangon (Rangoon)"},
    		{value: "+07:00,1",text: "(+07:00) Krasnoyarsk"},
    		{value: "+07:00,1,DST",text: "(+07:00,DST) Krasnoyarsk"},
    		{value: "+07:00,0",text: "(+07:00) Bangkok, Hanoi, Jakarta"},
    		{value: "+08:00,0",text: "(+08:00) Beijing, Hong Kong, Singapore, Taipei"},
    		{value: "+08:00,1",text: "(+08:00) Irkutsk, Ulaan Bataar, Perth"},
    		{value: "+08:00,1,DST",text: "(+08:00,DST) Irkutsk, Ulaan Bataar, Perth"},
    		{value: "+09:00,1",text: "(+09:00) Yakutsk"},
    		{value: "+09:00,1,DST",text: "(+09:00,DST) Yakutsk"},
    		{value: "+09:00,0",text: "(+09:00) Seoul, Osaka, Sapporo, Tokyo"},
    		{value: "+09:30,0",text: "(+09:30) Darwin"},
    		{value: "+09:30,1",text: "(+09:30) Adelaide"},
    		{value: "+09:30,1,DST",text: "(+09:30,DST) Adelaide"},
    		{value: "+10:00,0",text: "(+10:00) Brisbane, Guam, Port Moresby"},
    		{value: "+10:00,1",text: "(+10:00) Canberra, Melbourne, Sydney, Hobart, Vladivostok"},
    		{value: "+10:00,1,DST",text: "(+10:00,DST) Canberra, Melbourne, Sydney, Hobart, Vladivostok"},
    		{value: "+11:00,0",text: "(+11:00) Magadan, Solomon Is., New Caledonia"},
    		{value: "+12:00,1",text: "(+12:00) Auckland, Wellington"},
    		{value: "+12:00,1,DST",text: "(+12:00,DST) Auckland, Wellington"},
    		{value: "+12:00,0",text: "(+12:00) Fiji, Kamchatka, Marshall Is."},
    		{value: "+13:00,0",text: "(+13:00) Nuku'alofa"}
        ],
        
	    listeners: {
	    	initialize: function () {
	    	    // Detect the local timezone
	    	    this.setValue(this.getTimeZone(new Date()));
	    	}	    		
		}
    },
    
	/**
	 * Get time zone
	 * script by Josh Fraser (http://www.onlineaspect.com)
	 * This function is more accurate than getTimezoneOffset() of Javascript Date function since it computes the dst
	 */
    getTimeZone : function (oTargetDate) {
		var jan1 = new Date(oTargetDate.getFullYear(), 0, 1, 0, 0, 0, 0);  // jan 1st
		var june1 = new Date(oTargetDate.getFullYear(), 6, 1, 0, 0, 0, 0); // june 1st
		
		var temp = jan1.toGMTString();
		var jan2 = new Date(temp.substring(0, temp.lastIndexOf(" ")-1));
		temp = june1.toGMTString();
		var june2 = new Date(temp.substring(0, temp.lastIndexOf(" ")-1));
		var std_time_offset = (jan1 - jan2) / (1000 * 60 * 60);
		var daylight_time_offset = (june1 - june2) / (1000 * 60 * 60);
		var dst;
		if (std_time_offset == daylight_time_offset) {
			dst = "0"; // daylight savings time is NOT observed
		} else {
			// positive is southern, negative is northern hemisphere
			var hemisphere = std_time_offset - daylight_time_offset;
			if (hemisphere >= 0)
				std_time_offset = daylight_time_offset;
			dst = "1"; // daylight savings time is observed
		}
		
		// Check when dst = 1, then the given time is in DST or not
		if (dst == 1) {
			oInDST = "";
			if (parseInt(oTargetDate.getTimezoneOffset()*-1/60) > std_time_offset) {
				oInDST = "DST";
			}
		}
		
		return this.convertTimeZone(std_time_offset,dst, oInDST);
	},
	
	/**
	 * Convert time zone
	 */
	convertTimeZone : function (value,dst, oInDST) {
		var hours = parseInt(value);
	   	value -= parseInt(value);
		value *= 60;
		var mins = parseInt(value);
	   	value -= parseInt(value);
		value *= 60;
		var secs = parseInt(value);
		var display_hours = hours;
		// handle GMT case (00:00)
		if (hours == 0) {
			display_hours = "00";
		} else if (hours > 0) {
			// add a plus sign and perhaps an extra 0
			display_hours = (hours < 10) ? "+0"+hours : "+"+hours;
		} else {
			// add an extra 0 if needed 
			display_hours = (hours > -10) ? "-0"+Math.abs(hours) : hours;
		}
		
		mins = (mins < 10) ? "0"+mins : mins;
		
		// REturn example "+01:00,1,DST" DST means that the current time is in DST
		return display_hours+":"+mins+","+dst+((oInDST == "") ? "" : ","+oInDST);
	},
	
	/**
	 * Prepare MySQL compatible timezone information
	 */
    formatMySQLTimeZone : function(sTimeZoneValue) {
    	var hours = parseInt(sTimeZoneValue.slice(0, 3));
    	var mins = parseInt(sTimeZoneValue[4]+sTimeZoneValue[5]);
    	
    	/// Be aware that there is a timezone that shifts only 30 minutes when in DST
    	if (sTimeZoneValue.slice(-3) == 'DST') hours = hours + 1;
    	
    	// handle GMT case (00:00)
    	if (hours == 0) {
    		display_hours = "00";
    	} else if (hours > 0) {
    		// add a plus sign and perhaps an extra 0
    		display_hours = (hours < 10) ? "+0"+hours : "+"+hours;
    	} else {
    		// add an extra 0 if needed 
    		display_hours = (hours > -10) ? "-0"+Math.abs(hours) : hours;
    	}
    	
    	mins = (mins < 10) ? "0"+mins : mins;
    	
    	// REturn example "+01:00,1,DST" DST means that the current time is in DST
    	return display_hours+":"+mins;
    },
    
    /**
     * oTime should be a Javascript date object
     * oZoneValue shoud be one value of oTimezoneData array
     */
    modifyTimebySelectedZone : function(oTime, oZoneValue) {
    	var gmtHours = -oTime.getTimezoneOffset() / 60;
    	
    	var oNewZoneHour = null;
    	if (typeof oZoneValue == "undefined") {
    		oZoneValue = this.getValue();
    	}
    	
    	oNewZoneHour = parseInt(oZoneValue.split(":", 1)[0]);
    	var oIsDST = (oZoneValue.slice(-3) == "DST") ? 1 : 0;
    	
    	oNewZoneHour += oIsDST;
    	
    	var oModifiedTime = new Date(oTime.getTime() + (gmtHours - oNewZoneHour)*60*60*1000);
    	
    	return oModifiedTime;
    }
});