/**
 * @class fileTree jQuery extension for file tree UI
 * 
 * File Tree UI. Excerpted from (http://abeautifulsite.net/notebook.php?article=58)
 *
 * Usage: 
 * 	$('.fileTreeDemo').fileTree( options, callback )
 *
 * Options:  
 * 		root           - root folder to display; default = /
 * 		folderEvent    - event to trigger expand/collapse; default = click
 * 		expandSpeed    - default = 500 (ms); use -1 for no animation
 * 		collapseSpeed  - default = 500 (ms); use -1 for no animation
 * 		expandEasing   - easing function to use on expand (optional)
 * 		collapseEasing - easing function to use on collapse (optional)
 * 		multiFolder    - whether or not to limit the browser to one subfolder at a time
 * 		loadMessage    - Message to display while initial tree loads (can be HTML)
 *
 * History:
 *
 * * 1.01 - updated to work with foreign characters in directory/file names (12 April 2008)
 * * 1.00 - released (24 March 2008)
 *
 * ## TERMS OF USE
 * 
 * This plugin is dual-licensed under the GNU General Public License and the MIT License and
 * is copyright 2008 A Beautiful Site, LLC. 
 *
 * Modified by Pil Ho Kim: Original codes from (http://abeautifulsite.net/notebook.php?article=58) is 
 * modified to work with the e-Log backends.

 * * TODO: Enhance the file tree to include the DELETE button not to process the data. May look at jQueryUI tree libraries (ex: http: *www.jstree.com/)
 * * TODO: Enhance tree routines with more controls
 * * TODO: Support drag & drops
 * 
 */
if(jQuery) (function($){
 	
	$.extend($.fn, {
		fileTree: function(o, h) {
			// Defaults
			if( !o ) var o = {};
			if( o.root == undefined ) o.root = '/';
			if( o.folderEvent == undefined ) o.folderEvent = 'click';
			if( o.expandSpeed == undefined ) o.expandSpeed= 500;
			if( o.collapseSpeed == undefined ) o.collapseSpeed= 500;
			if( o.expandEasing == undefined ) o.expandEasing = null;
			if( o.collapseEasing == undefined ) o.collapseEasing = null;
			if( o.multiFolder == undefined ) o.multiFolder = false;
			if( o.loadMessage == undefined ) o.loadMessage = 'Loading...';
			
			$(this).each( function() {
				
				function showTree(c, t) {
					$(c).addClass('wait');
					
					if (c.requestid != null) {
						c.requestid.abort();
						$(c).removeClass('wait');
						return;
					}
					$(".jqueryFileTree.start").remove();
					
					if (typeof h.getCookie('user_key') == "undefined") return false;
					
					c.requestid = $.ajax({
						url: h.getCookie('server_url'),
						dataType: 'jsonp',
						data: { 
							command: 'File.base.GetUserFileDir',
							params : Ext.JSON.encode({
								userKey: h.getCookie('user_key'),
								fileName: t
							})
						},  
						success: function(data) {
							if (data.root) {
								$(c).find('.start').html('');
								$(c).removeClass('wait').append(data.root.results);
								if( o.root == t ) $(c).find('UL:hidden').show(); 
								else $(c).find('UL:hidden').slideDown({ 
									duration: o.expandSpeed, 
									easing: o.expandEasing 
								});
								bindTree(c);
							}
						}
					});
				}
				
				function bindTree(t) {
					$(t).find('LI A').bind(o.folderEvent, function() {
						if( $(this).parent().hasClass('directory') ) {
							if( $(this).parent().hasClass('collapsed') ) {
								// Expand
								if( !o.multiFolder ) {
									$(this).parent().parent().find('UL').slideUp({ duration: o.collapseSpeed, easing: o.collapseEasing });
									$(this).parent().parent().find('LI.directory').removeClass('expanded').addClass('collapsed');
								}
								$(this).parent().find('UL').remove(); // cleanup
								showTree( $(this).parent(), escape($(this).attr('rel').match( /.*\// )) );
								$(this).parent().removeClass('collapsed').addClass('expanded');
							} else {
								// Collapse
								$(this).parent().find('UL').slideUp({ duration: o.collapseSpeed, easing: o.collapseEasing });
								$(this).parent().removeClass('expanded').addClass('collapsed');
							}
						}
						
						h.onSelectionChange(h, $(this).attr('rel'), $(this).parent().hasClass('directory'));
						return false;
					});
					// Prevent A from triggering the # on non-click events
					if( o.folderEvent.toLowerCase != 'click' ) $(t).find('LI A').bind('click', function() { return false; });
				}
				// Loading message
				$(this).html('<ul class="jqueryFileTree start"><li class="wait">' + o.loadMessage + '<li></ul>');
				// Get the initial file list
				showTree( $(this), escape(o.root) );
			});
		}
	});
	
})(jQuery);


/**
 * File tree view div panel
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.ui.panel.div.FileTreeView', {
 *     	fullscreen:true
 *     });
 * 
 */
Ext.define('Elog.view.ui.panel.div.FileTreeView', {
    extend: 'Elog.view.ui.panel.div.Base',
    xtype: 'elogFileTreeView',
    config : {
		// height: '500px',
    	/**
    	 * Set file tree view scrollable. Default is 'vertical'
    	 * 
    	 * @type String
    	 */
    	scrollable: 'vertical',
    	/**
    	 * Filetreeview panel name
    	 * @type String
    	 */
    	name: 'idElogFileTreeViewer',
    	// divStyle: 'height: 100%; border: 0px solid #aaa'
    	/**
    	 * File tree boundary CSS style
    	 * @type String
    	 */
    	divStyle: 'solid #aaa',
    	/**
    	 * Show directory only if set true
    	 */
    	showDir: false
    },
    
    /**
     * Instantiate the free tree from a given DIV object
     */
    init: function (oContainer, opts) {
    	// Resize the height of a HTML DIV element
	    var oElement = this.getDivObject();
	    if (oElement == null) return false;
	    // Set height
	    // oElement.style.height = this.element.getHeight() + "px";
	    		
	    $('#'+this.getDivId()).fileTree(
	        { 
	            root: '/'
	        }, 
	        // Assign the event listener
	        this
	    );
	}, 
    
    /**
     * Listen to file tree selection change event.
     * 
     * This will call associatied controller's onSelectionChange callback function.
     * 
     * @param {Object} oFileTreeView
     * @param {String} sSourceFile
     * @param {Boolean} bIsDirectory
     */
    onSelectionChange : function(oFileTreeView, sSourceFile, bIsDirectory) {
    	var oResult = oFileTreeView.fireEvent('selectionchange', {
    		sourceFile: sSourceFile,
    		isDirectory: bIsDirectory
    	});
    	
    	/*
    	if (this.getController()) {
    		var oResult = this.getController().onSelectionChange({
        		sourceFile: sSourceFile,
        		isDirectory: bIsDirectory
        	});
    	}
    	*/
    }
});
