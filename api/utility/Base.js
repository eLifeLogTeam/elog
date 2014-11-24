/**
 * Utility class to support elog common operations
 * 
 * @author Pil Ho Kim
 * 
 */
Ext.define('Elog.api.utility.Base', {
    extend: 'Elog.api.Base',
    config: {
    	/**
    	 * elog supported media types that elog can parse and analyze the data inside the file or the data object
    	 * 
    	 * @type Object
    	 */
    	oSupportedMedia : [{
        	name: "General GPS file",
            mediatype: "gps", 
            extensions: ["gpx", "gdb"]
        },{
        	name: "Garmin GPS file",
            mediatype: "tcx", 
            extensions: ["tcx"]
        },{ 
        	name: "Image file",
            mediatype: "image",
            extensions: ["jpg","png","gif","tiff","cr2"]
        },{ 
        	name: "ViconRevue file",
            mediatype: "viconrevue",
            extensions: ["csv"]
        },{ 
        	name: "Multimedia file",
            mediatype: "video",
            extensions: ["avi", "mov", "mp4", "mpg", "wav", "mp3", "mts", "ogg" ]
        }],
        
        /**
         * Timezone data object
         * @type Object
         */
        oTimezoneData : [
    		{value: "-12:00,0",text: "(-12:00) International Date Line West"},
    		{value: "-11:00,0",text: "(-11:00) Midway Island, Samoa"},
    		{value: "-10:00,0",text: "(-10:00) Hawaii"},
    		{value: "-09:00,1",text: "(-09:00) Alaska"},
    		{value: "-08:00,1",text: "(-08:00) Pacific Time (US & Canada)"},
    		{value: "-07:00,0",text: "(-07:00) Arizona"},
    		{value: "-07:00,1",text: "(-07:00) Mountain Time (US & Canada)"},
    		{value: "-06:00,0",text: "(-06:00) Central America, Saskatchewan"},
    		{value: "-06:00,1",text: "(-06:00) Central Time (US & Canada), Guadalajara, Mexico city"},
    		{value: "-05:00,0",text: "(-05:00) Indiana, Bogota, Lima, Quito, Rio Branco"},
    		{value: "-05:00,1",text: "(-05:00) Eastern time (US & Canada)"},
    		{value: "-04:00,1",text: "(-04:00) Atlantic time (Canada), Manaus, Santiago"},
    		{value: "-04:00,0",text: "(-04:00) Caracas, La Paz"},
    		{value: "-03:30,1",text: "(-03:30) Newfoundland"},
    		{value: "-03:00,1",text: "(-03:00) Greenland, Brasilia, Montevideo"},
    		{value: "-03:00,0",text: "(-03:00) Buenos Aires, Georgetown"},
    		{value: "-02:00,1",text: "(-02:00) Mid-Atlantic"},
    		{value: "-01:00,1",text: "(-01:00) Azores"},
    		{value: "-01:00,0",text: "(-01:00) Cape Verde Is."},
    		{value: "00:00,0",text: "(00:00) Casablanca, Monrovia, Reykjavik"},
    		{value: "00:00,1",text: "(00:00) GMT: Dublin, Edinburgh, Lisbon, London"},
    		{value: "+01:00,1",text: "(+01:00) Amsterdam, Berlin, Rome, Vienna, Prague, Brussels"},
    		{value: "+01:00,0",text: "(+01:00) West Central Africa"},
    		{value: "+02:00,1",text: "(+02:00) Amman, Athens, Istanbul, Beirut, Cairo, Jerusalem"},
    		{value: "+02:00,0",text: "(+02:00) Harare, Pretoria"},
    		{value: "+03:00,1",text: "(+03:00) Baghdad, Moscow, St. Petersburg, Volgograd"},
    		{value: "+03:00,0",text: "(+03:00) Kuwait, Riyadh, Nairobi, Tbilisi"},
    		{value: "+03:30,0",text: "(+03:30) Tehran"},
    		{value: "+04:00,0",text: "(+04:00) Abu Dhadi, Muscat"},
    		{value: "+04:00,1",text: "(+04:00) Baku, Yerevan"},
    		{value: "+04:30,0",text: "(+04:30) Kabul"},
    		{value: "+05:00,1",text: "(+05:00) Ekaterinburg"},
    		{value: "+05:00,0",text: "(+05:00) Islamabad, Karachi, Tashkent"},
    		{value: "+05:30,0",text: "(+05:30) Chennai, Kolkata, Mumbai, New Delhi, Sri Jayawardenepura"},
    		{value: "+05:45,0",text: "(+05:45) Kathmandu"},
    		{value: "+06:00,0",text: "(+06:00) Astana, Dhaka"},
    		{value: "+06:00,1",text: "(+06:00) Almaty, Nonosibirsk"},
    		{value: "+06:30,0",text: "(+06:30) Yangon (Rangoon)"},
    		{value: "+07:00,1",text: "(+07:00) Krasnoyarsk"},
    		{value: "+07:00,0",text: "(+07:00) Bangkok, Hanoi, Jakarta"},
    		{value: "+08:00,0",text: "(+08:00) Beijing, Hong Kong, Singapore, Taipei"},
    		{value: "+08:00,1",text: "(+08:00) Irkutsk, Ulaan Bataar, Perth"},
    		{value: "+09:00,1",text: "(+09:00) Yakutsk"},
    		{value: "+09:00,0",text: "(+09:00) Seoul, Osaka, Sapporo, Tokyo"},
    		{value: "+09:30,0",text: "(+09:30) Darwin"},
    		{value: "+09:30,1",text: "(+09:30) Adelaide"},
    		{value: "+10:00,0",text: "(+10:00) Brisbane, Guam, Port Moresby"},
    		{value: "+10:00,1",text: "(+10:00) Canberra, Melbourne, Sydney, Hobart, Vladivostok"},
    		{value: "+11:00,0",text: "(+11:00) Magadan, Solomon Is., New Caledonia"},
    		{value: "+12:00,1",text: "(+12:00) Auckland, Wellington"},
    		{value: "+12:00,0",text: "(+12:00) Fiji, Kamchatka, Marshall Is."},
    		{value: "+13:00,0",text: "(+13:00) Nuku'alofa"}
        ]
    },
    
    constructor: function(cfg) {
    	this.callParent(cfg);
    	this.initConfig(cfg);
    	
    	return this;
    },
    
    /**
     * Remove Html tags from the string
     * 
     * Source code: http://javascript.internet.com
     * Created by: Robert Nyman | http://robertnyman.com/
     * 
     * @param {String} strInputCode
     * 
     */
    removeHTMLTags: function (strInputCode){
        strInputCode = strInputCode.replace(/&(lt|gt);/g, function (strMatch, p1){
            return (p1 == "lt")? "<" : ">";
        });
        return strInputCode.replace(/<\/?[^>]+(>|$)/g, "").trim();
    },
    
    /**
     * String trimming function. It removes spaces in the string from both ends
     * 
     * @param {String} oString
     */
    trim : function (oString) {
        return oString.replace(/^\s*/, "").replace(/\s*$/, "");
    }
});