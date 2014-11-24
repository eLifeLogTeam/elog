/**
 * elog.api.ImageViewer
 * 
 * @author Pil Ho Kim
 * 
 * Canvas image viewer UI library
 * 
 * History:
 * 2011/02/17 - First version
 *
 */
Ext.define('Elog.api.media.ImageViewer', {
    // These are all detected automatically
    // No need to use @extends, @alternateClassName, @mixin, @alias, @singleton
    extend: 'Elog.api.media.Base',
    config: {
        m_iDefaultImageWidth : 640,
        m_iDefaultImageHeight : 480,
        m_iThumbnailRowCount : 3, // Display 3 thumbnails per row
        oElogImages : [],
        oElogImagesx : [],
        oElogImagesy : [],
        oElogImageCanvas : null,
        oElogImageContext : null,
        m_iCurrentImageID : -1,
        oElogImageGeoCoder : null,
        oElogImageMapCenterMarker : null,
        oElogImageInformation : null,
        oSelectedImageID : null,
        oSlideInterval : null,
        oElogImageInformationCanvas : null,
        oElogImageInformationContext : null,
        oInformationImage : null,
        oElogImageInformationTemperature : null,
        oElogImageInformationDescription : null
    },
    
    constructor: function(cfg) {
    	this.callParent(cfg);
    	this.initConfig(cfg);
    	
	    this.config.m_iThumbnailWidth = this.config.m_iDefaultImageWidth/10;
	    this.config.m_iThumbnailHeight = parseInt(this.config.m_iThumbnailWidth * this.config.m_iDefaultImageHeight/this.config.m_iDefaultImageWidth);
	
	    this.config.oSearchImageStore = new Ext.data.Store({
	        model: 'elogImageList',
	        proxy: {
	            type: 'localstorage',
	            id: 'elog_image_viewer_config'
	        }
	    });
	    
	    return this;
    },

    /**
     * Redraw image list
     */
    onEventViewerRefresh : function() {
        ReadTimeRange();
        
        if (m_ElogImageViewer.oElogImageGeoCoder) delete m_ElogImageViewer.oElogImageGeoCoder;
        
        m_ElogImageViewer.oElogImageGeoCoder = new google.maps.Geocoder();

        // Read search configuration
        var oTimeConfig;
            
        if (oSearchTimeStore.getCount() > 0) {
            oTimeConfig = oSearchTimeStore.getRange();
        }
        else oTimeConfig = oSearchTimeConfig;

        var myMask = new Ext.LoadMask(Ext.get('idElogImageViewer'), {msg:"Loading..."});
        myMask.show();
         
        $.ajax({
            url: oServerSetting['server_index'],
            dataType: 'jsonp',
            data: {
                user_key: $('idUserKey').val(),
                elog_command: 'GetImageList',
                serverurl: oServerSetting['server_index_key']+'&elog_command=GetImage&utctimestamp=',
                timefrom: (Ext.isArray(oTimeConfig)) ? 
                    Math.round(oTimeConfig[oTimeConfig.length-1].data.dateFrom.getTime()/1000) : '',
                timeto: (Ext.isArray(oTimeConfig)) ? 
                    Math.round(oTimeConfig[oTimeConfig.length-1].data.dateTo.getTime()/1000) : ''
            },
            success: function(data) {
                m_ElogImageViewer.onProcessImageList(data);
            }
        });
    }
});