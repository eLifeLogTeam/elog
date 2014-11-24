var changePropertyItem = function(newPropertyItem) {
	if (mainTabPanel) {
		alert('test');
		mainTabPanel.dockedItems.items = newPropertyItem;
	}
};

var setActivePanel = function(panelID) {
    Ext.getCmp("idElogMainPanel").setActiveItem(panelID);
}

Ext.setup({
    icon: 'icon.png',
    glossOnIcon: false,
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    onReady: function() {
        // Resize window
        
        // The below only works for the pop-up window
        // window.resizeTo(1280,1024);
        $(window).width(1280);
        $(window).height(1024);
        
        var oPanel = [];
        
        if (typeof elog_welcome !== "undefined") oPanel.push(elog_welcome);
        if (typeof elog_map_panel !== "undefined") oPanel.push(elog_map_panel);
        
        // Basic data search
		if (typeof elog_search_contact !== "undefined") oPanel.push(elog_search_contact);
		if (typeof elog_search_time !== "undefined") oPanel.push(elog_search_time);
            
        // Data viewer
        if (typeof elog_image_viewer !== "undefined") oPanel.push(elog_image_viewer);
        if (typeof elog_image_thumbnail_viewer !== "undefined") oPanel.push(elog_image_thumbnail_viewer);
        if (typeof elog_search_email !== "undefined") oPanel.push(elog_search_email);
        
        //elog_event_viewer,
        if (typeof elog_gps_cluster_viewer !== "undefined") oPanel.push(elog_gps_cluster_viewer);
        if (typeof elog_gps_cluster_image_viewer !== "undefined") oPanel.push(elog_gps_cluster_image_viewer);
        if (typeof elog_event_timeline_viewer !== "undefined") oPanel.push(elog_event_timeline_viewer);
        if (typeof elog_people_viewer !== "undefined") oPanel.push(elog_people_viewer);
        if (typeof elog_image_flow_viewer !== "undefined") oPanel.push(elog_image_flow_viewer);
        if (typeof elog_face_tagger !== "undefined") oPanel.push(elog_face_tagger);
        if (typeof elog_file_manager !== "undefined") oPanel.push(elog_file_manager);
        if (typeof elog_dragdrop_manager !== "undefined") oPanel.push(elog_dragdrop_manager);
        if (typeof elog_database_manager !== "undefined") oPanel.push(elog_database_manager);
        if (typeof elog_database_manager !== "undefined") oPanel.push(elog_eml_schema_manager);
        if (typeof elog_eml_graph !== "undefined") oPanel.push(elog_eml_graph);
        
        // Query
        if (typeof elog_query_path !== "undefined") oPanel.push(elog_query_path);
        
        this.elog_main_panel = new Ext.Panel({
            id: 'idElogMainPanel',
            modal: true,
            fullscreen: true,
            cls: 'elog_map_cls',
            layout: {
                type: 'card',
                align: 'stretch'
            },
            defaults: {
                flex: 1
            },
            items: oPanel,
            dockedItems: 
            [
                // elog_menu_panel
            ],
            listeners: {
                resize: function(panel, w, h) {
                    alert('Panel resized to ' + w + 'x' + h);
                }
            }
        });
                
        elog_menu_panel.setWidth(120);
        
        if (typeof getCookie('api_key') != "undefined") {
        	this.elog_main_panel.addDocked(elog_menu_panel);
        }
        
        // Select default query
        // elog_querylist.getSelectionModel().select(0);
        
        /* elog_search_option.setWidth(200);  */
    }
});
