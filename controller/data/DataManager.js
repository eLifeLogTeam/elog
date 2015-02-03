/**
 * Elog controller: DataManager
 * 
 */
Ext.define('Elog.controller.data.DataManager', {
	extend: 'Elog.controller.Base',
    requires: [
       'Elog.controller.Base',
       'Elog.api.media.FileManager',
       'Elog.api.media.GPSTimeRangeViewer',
       'Elog.view.panel.data.DataManagerPanel',
       'Elog.api.utility.Base',
       'Elog.view.panel.data.FileExplorer',
       'Elog.view.panel.data.FileUploader',
       'Ext.util.Droppable'
    ],
	config: {
		/**
		 * Including views are optional since necessary components are accessed through refs
		 */
		views: [
	        'Elog.view.panel.data.DataManagerPanel'
		],
		/**
		 * When designing your own DataManager panel, replace or comment above views config 
		 * and update below IDs to work with your panel
		 */
		refs: {
			backButton: '#idElogFileManagerBackButton',
			copyTime: '#idElogFileCopyTime',
			dataManager: '#idElogDataManager',
			dataManagerBackButton: '#idElogFileManagerBackButton',
			dataManagerDeleteButton: '#idElogFileManagerDeleteButton',
			dataManagerLayout: '#idElogDataManagerLayout',
			dataManagerPropertyLayout: '#idElogDataManagerPropertyLayout',
			filePreview: '#idElogFilePreview',
			filePreviewCard: '#idElogFilePreviewCard',
			filePreviewPanel: '#idElogFilePreviewPanel',
			filePreviewWindow: '#idElogFilePreviewWindow',
			filePreviewWindowItem: '#idElogFilePreviewWindowItem',
			
			fileTreeView: '#idElogFileTreeView',
			
			fileExplorer: '#idElogFileExplorerView',
			childFileTreeView: '#idChildElogFileTreeView',
			
			fileExplorerFileButton: '#idElogFileExplorerFileButton',
			fileExplorerRestoreButton: '#idElogFileExplorerRestoreButton',
			
			fileUploaderView: '#idElogFileUploaderView',
			fileUploaderButton: '#idChildElogFileUploader',
			fileUploadTreeView: '#idChildElogFileUploadTreeView',
			fileUploadListView: '#idChildElogFileUploadListView',
			fileUploadSubmit: '#idChildElogFileUploadSubmit',
			fileUploadConfig: '#idFileUploadConfig',
			fileUploadCommand: '#idFileUploadCommand',
			
			loadMedia: '#idElogLoadMedia',
			loadMediaFromDirectory: '#idElogLoadMediaFromDirectory',
			mediaControl: '#idElogMediaControl',
			mediaTimestamp: '#idElogMediaTimestamp',
			mediaTimestampModified: '#idElogMediaTimestampModified',
			mediaType: '#idElogMediaType',
			mediaTypeSelectField: '#idElogMediaTypeSelectField',
			previewMap: '#idElogMapPreview',
			processingResult: '#idElogProcessingResult',
			progressBar: '#idPElogrogressBar',
			resultPane: '#idElogResultPane',
			selectedFile: '#idElogSelectedFile',
			sourceType: '#idElogSourceType',
			timeAdjustPane: '#idElogTimeAdjustPane', 
			timeRange: '#idElogTimeRange',
			timeZone: '#idElogTimeZone',
			archiveFile: '#idElogArchiveFile',
			videoPreview: '#idElogVideoPreview'
		},

		control: {
			dataManager: {
				initialize: 'onDataManagerInitialize'
			},
			dataManagerBackButton: {
		    	tap: 'onDataManagerBack'
		    },
		    dataManagerDeleteButton: {
		    	tap: 'onDataManagerDelete'
		    },
		    dataManagerLayout: {
		    	activeitemchange : 'onDataManagerItemChange'
		    },
		    timeZone: {
		    	change: 'onTimeZoneChange'
		    },
		    copyTime: {
		    	tap: 'onCopyTime'
		    },
		    loadMedia: {
		    	tap: 'onLoadMedia'
		    },
		    loadMediaFromDirectory: {
		    	tap: 'onLoadMediaFromDirectory'
		    },
		    mediaTimestampModified: {
		    	action: 'onRunTimestampModified',
		    	change: 'onTimestampModified'
		    },
		    timeRange: {
		    	change: 'onTimeRangeChange'
		    },
		    fileTreeView: {
		    	selectionchange: 'onFileSelectionChange'
		    },
		    fileExplorer: {
		    	selectionchange: 'onFileSelectionChange'
		    },
		    childFileTreeView: {
		    	selectionchange: 'onFileSelectionChange'
		    },
		    
		    fileUploaderButton: {
		    	initialize: 'onFileUploadInitialize',
		    	submit: 'onFileUploadSubmitted'
		    },
		    fileUploadTreeView: {
		    	selectionchange: 'onFileUploadSelectionChange'
		    },
		    fileUploadSubmit: {
		    	tap: 'onFileUploadSubmit'
		    },
		    
		    fileExplorerRestoreButton: {
		    	tap: 'onFileRestore'
		    }
		},
		
		dataFileManager: null,
		dataGpsTimeRangeViewer: null,
		dropControl: null
	},

	getFileManager: function() {
		if (this.getDataFileManager() == null) {
			this.setDataFileManager(new Ext.create('Elog.api.media.FileManager'));
		}
		
		return this.getDataFileManager();
	},
	
	getGpsTimeRangeViewer: function() {
		if (this.getDataGpsTimeRangeViewer() == null) {
			if (this.getPreviewMap() == null || this.getTimeZone() == null) return null;
			this.setDataGpsTimeRangeViewer(new Ext.create('Elog.api.media.GPSTimeRangeViewer',{
				oGoogleMap : this.getPreviewMap(),
			    oTimeZone : this.getTimeZone()
			}));
		}
		
		return this.getDataGpsTimeRangeViewer();
	},
	
	/**
	 * Data manager initialization
	 * @param {Object} oDataManager
	 */
	onDataManagerInitialize: function(oDataManager) {
		
    },
    
    /*
	init: function() {
		if (typeof this.getFileManager() == "undefined") {
			this.getFileManager() = new Ext.create('Elog.api.media.FileManager');
		}
		if (typeof this.getGpsTimeRangeViewer() !== "undefined") {
			this.getGpsTimeRangeViewer() = new Ext.create('Elog.api.media.GPSTimeRangeViewer',{
				oGoogleMap : this.getPreviewMap(),
			    oTimeZone : this.getTimeZone()
			});
		}
	},
	*/
	
	/**
	 * Switch to the Preview panel
	 */
	onDataManagerBack: function() {
		this.getDataManagerLayout().setActiveItem(
			this.getFileExplorer()
    	);
	},
	
	/**
	 * Delete the file
	 */
	onDataManagerDelete: function() {
		oDataManager = this;
		Ext.Msg.confirm(
			"Confirmation", 
			"Are you sure you want to remove "+this.getSelectedFile().getValue()+"?<br><br>This operation is irrevocable.", 
			function(e) {
	  			if (e == 'yes') {
	  				oDataManager.getFileManager().removeMedia({
	  					sourceFile: oDataManager.getSelectedFile().getValue(),
	  					onSuccess: function (oResult) {
	  						if (typeof oResult.result !== "undefined") {
	  							oDataManager.attachResult(oResult.result);
	  						}
	  	            		
	  	            		oDataManager.updateInstruction();
	  					}
	  				});
  				
	  				return true;
	  			}
			}
		);
	},
	
	/**
	 * Upate the GPS information by the file creation date
	 */
	onPreviewUpdateGPS : function (oConfig) {
		// Convert to seconds from milliseconds
		this.getFileManager().oTimeOffset = 0;
    			
		var oMySQLTimeZone = this.getTimeZone().formatMySQLTimeZone(
			this.getTimeZone().getValue()
		);
		
		this.getGpsTimeRangeViewer().onGPSTimeRangeViewerRefresh(
			oConfig["startUnixtime"],
			oConfig["endUnixtime"],
			oMySQLTimeZone
		);
		
		this.attachResult(this.getGpsTimeRangeViewer());
		this.updateInstruction();
    },
    
    /**
     * Center the map to the file timestamp
     * 
     * @param {Object} oFileManager
     * 
     */
    onSetCurrentMapTime : function (oFileManager) {
    	if (this.getGpsTimeRangeViewer() !== undefined) {
    		this.getGpsTimeRangeViewer().setCurrentMapTime(
				this.getGpsTimeRangeViewer(),
				oFileManager.oCurrentPlayTime
    		);
    		
    		this.attachResult(this.getGpsTimeRangeViewer());
    		this.updateInstruction();
		}
    },
    
    /**
     * On card switch event
     *  
     * @param {Object} oThis
     * @param {Object} oNewCard
     * @param {Object} oOldCard
     * @param {Number} oIndex
     * @param {Boolean} bAnimated
     * 
     */
    onDataManagerItemChange: function (oThis, oNewCard, oOldCard, oIndex, bAnimated) {
    	if (typeof this.getFileManager() == "undefined") {
			this.getFileManager() = new Ext.create('Elog.api.media.FileManager');
            
			/*
			this.getGpsTimeRangeViewer() = new Ext.create('Elog.api.media.GPSTimeRangeViewer', {
            	oTimeZone: Ext.getCmp('idTimeZone'),
            	oGoogleMap: Ext.getCmp('idMapPreview').map
        	});
        	*/
        }
    	
    	if (oThis.rendered) {
    		if (oNewCard.id == 'idElogFileTreeView') {
    			this.getDataManagerBackButton().disable(true);
    		}
    		else {
    			this.getDataManagerBackButton().enable(true);
    		}
    	}
    },
    
    /**
     * Update the timezone information
     * 
     * @param {Object} oModifiedTimeZone
     * @param {Number} oNewValue
     * @param {Number} oOldValue
     * 
     */
    onTimeZoneChange: function (oModifiedTimeZone, oNewValue, oOldValue) {
    	if (this.getFileManager() == null || this.getGpsTimeRangeViewer() == null) {
    		this.logStatus('Data manager is not initialized');
    		this.updateInstruction();
    		return false;
		}
    	
    	if (this.getGpsTimeRangeViewer() !== undefined) {
			var d;
			var oFileManager = this.getFileManager();
			
    		if (this.getMediaTimestampModified().getValue() != '') {
    			d = new Date(this.getmMdiaTimestampModified().getValue());
        	}
    		else {
    			d = new Date(this.getMediaTimestamp().getValue());
    		}
    		var oModifiedTime = oFileManager.ModifyTimebySelectedZone(
    			oFileManager, d, oNewValue
        	);
		
    		this.getMediaTimestampModified().setValue(oModifiedTime);
    		
    		var oNewRange = this.getTimeRange().getValue();
    		
    		var oDiff = oModifiedTime - oFileManager.oDateTime;
        	// Convert to seconds from milliseconds
    		oFileManager.oTimeOffset = oDiff.valueOf()/1000;
        	
    		var oStartTime = new Date(oModifiedTime.getTime()-oNewRange*1000);
    		var oEndTime = new Date(oModifiedTime.getTime()+oNewRange*1000);
    		var oMySQLTimeZone = this.getTimeZone().formatMySQLTimeZone(
				this.getTimeZone().getValue()
			); 		
    		
    		this.getGpsTimeRangeViewer().onGPSTimeRangeViewerRefresh(
				oStartTime,
				oEndTime,
				oMySQLTimeZone
    		);
    		
    		this.attachResult(this.getFileManager());
    		this.attachResult(this.getGpsTimeRangeViewer());
    		this.updateInstruction();
		}
    },
    
    /**
     * Set the modified time as the creation time
     */
    onCopyTime: function () {
    	var d = new Date(this.getMediaTimestamp().getValue());
    	var oFileManager = this.getFileManager();
    	
    	var oModifiedTime = this.getTimeZone().modifyTimebySelectedZone(
			d, 
			this.getTimeZone().getValue()
    	);
		
    	this.getMediaTimestampModified().setValue(oModifiedTime);
		
		var oNewRange = this.getTimeRange().getValue();
		
		var oDiff = oModifiedTime - oFileManager.oDateTime;
    	// Convert to seconds from milliseconds
		oFileManager.oTimeOffset = oDiff.valueOf()/1000;
    	
		var oStartTime = new Date(oModifiedTime.getTime()-oNewRange*1000);
		var oEndTime = new Date(oModifiedTime.getTime()+oNewRange*1000);
		var oMySQLTimeZone = this.getTimeZone().formatMySQLTimeZone(
			this.getTimeZone().getValue()
		);
		
		this.getGpsTimeRangeViewer().onGPSTimeRangeViewerRefresh(
			oStartTime,
			oEndTime,
			oMySQLTimeZone
		);	
		
		this.attachResult(this.getGpsTimeRangeViewer());
		this.updateInstruction();
    },
    
    /**
     * Load media into the E-model system
     */
    onLoadMedia: function(){
    	oFileManager.oSelectedMediaType = this.getMediaType().getValue();
    	$(this.config.refs.progressBar).progressbar( "option", "value", 0);
    	
    	if (oFileManager.oSelectedMediaType == '') {
    		alert('Media type is not selected');
    		return false;
    	}
    	
    	oMySQLTimeZone = this.getTimeZone().formatMySQLTimeZone(
    		this.getTimeZone().getValue()
    	);
    	
    	var oDataManager = this;
        this.getFileManager().onLoadMedia({
        	sourceFile: this.getSelectedFile().getValue(),
        	mediaType: this.getMediaType().getValue(),
        	isDir: 'false',
        	mysqlTimeZone: oMySQLTimeZone,
        	archiveFile: this.getArchiveFile().getValue(),
        	timeOffset: oFileManager.oTimeOffset,
        	onSuccess: function (data) {
        		oDataManager.attachResult(data.result);
        		oDataManager.updateInstruction();
        		
	            // Ext.getCmp(oFileManager.oGUIInfo.processingresultid).setValue(data.root.results);
        		// oDataManager.getResultPane().show(false);
        	},
        	onDirSuccess: function (data) {
				// Show the job start
        		oDataManager.attachResult(data.result);
        		oDataManager.logStatus("Importing started: Job ID("+data.root.results+")");
        		oDataManager.updateInstruction();
    		},
        	onJobSuccess: function (data) {
        		oDataManager.attachResult(data.result);
        		oDataManager.logStatus("Importing job is done.");
        		oDataManager.updateInstruction();
        		
    			// $(this.config.refs.processingBar).progressbar( "option", "value", 100);
        	},
        	onProgressSuccess: function (data) {
        		oDataManager.attachResult(data.result);
        		var oData = data.root;
	    	    
            	if (typeof oData["updatelog"] !== 'undefined') {
            		oFileManager.oUpdateLog = oData["updatelog"];
            	}
            	
            	var oStatus = "";
            	var oProgress = 0;
            	if (typeof oData["results"] !== 'undefined') {
            		if (typeof oData["results"] == 'object') {
    	        		oData["results"].forEach(function(oResult) {
    	        			oStatus = oStatus + oResult.m_sMessage+' ['+oResult.m_iUpdateLog+']<p>';
    	        			oProgress = parseInt(oResult.m_fProgress);
    	        		});
            		}
            		else oStatus = oData["results"];
            	}
            	
        		// Display the progress
            	if (oFileManager.oJobStarted == true) {
            		if (oProgress > 0) {
            			$(this.config.refs.processingBar).progressbar( "option", "value", oProgress);
            		}
            		
            		oDataManager.logStatus(oStatus);
            		oDataManager.updateInstruction();
        		}
        	}
        });
    },
    
    /**
     * Load entire selected media files from the directory
     */
    onLoadMediaFromDirectory: function(){
    	var oFileManager = this.getFileManager();
    	
    	oFileManager.oSelectedMediaType = this.getMediaType().getValue();
    	$(this.config.refs.progressBar).progressbar( "option", "value", 0);
    	
    	if (oFileManager.oSelectedMediaType == '') {
    		this.logError('Media type is not selected');
    		this.updateInstruction();
    		return false;
    	}
    	
    	oMySQLTimeZone = this.getTimeZone().formatMySQLTimeZone(
			this.getTimeZone().getValue()
    	);
    	
    	var oDataManager = this;
        this.getFileManager().onLoadMedia({
        	sourceFile: this.getSelectedFile().getValue(),
        	mediaType: this.getMediaType().getValue(),
        	isDir: 'true',
        	mysqlTimeZone: oMySQLTimeZone,
        	archiveFile: this.getArchiveFile().getValue(),
        	timeOffset: oFileManager.oTimeOffset,
        	onSuccess: function (data) {
        		oDataManager.attachResult(data.result);
        		oDataManager.updateInstruction();
        		
	            // Ext.getCmp(oFileManager.oGUIInfo.processingresultid).setValue(data.root.results);
        		// oDataManager.getResultPane().show(false);
        	},
        	onDirSuccess: function (data) {
				// Show the job start
        		oDataManager.attachResult(data.result);
        		oDataManager.logStatus("Importing started: Job ID("+data.root.results+")");
        		oDataManager.updateInstruction();
    		},
        	onJobSuccess: function (data) {
        		oDataManager.attachResult(data.result);
        		oDataManager.logStatus("Importing job is done.");
        		oDataManager.updateInstruction();
        		
    			// $(this.config.refs.processingBar).progressbar( "option", "value", 100);
        	},
        	onProgressSuccess: function (data) {
        		oDataManager.attachResult(data.result);
        		var oData = data.root;
	    	    
            	if (typeof oData["updatelog"] !== 'undefined') {
            		oFileManager.oUpdateLog = oData["updatelog"];
            	}
            	
            	var oStatus = "";
            	var oProgress = 0;
            	if (typeof oData["results"] !== 'undefined') {
            		if (typeof oData["results"] == 'object') {
    	        		oData["results"].forEach(function(oResult) {
    	        			oStatus = oStatus + oResult.m_sMessage+' ['+oResult.m_iUpdateLog+']<p>';
    	        			oProgress = parseInt(oResult.m_fProgress);
    	        		});
            		}
            		else oStatus = oData["results"];
            	}
            	
        		// Display the progress
            	if (oFileManager.oJobStarted == true) {
            		if (oProgress > 0) {
            			$(this.config.refs.processingBar).progressbar( "option", "value", oProgress);
            		}
            		
            		oDataManager.logStatus(oStatus);
            		oDataManager.updateInstruction();
        		}
        	}
        });
        
        this.logStatus("Directory importing start.");
        this.updateInstruction();
    },
    
    /**
     * Compute the time offset from the modified timestamp
     * 
     * @param {Object} oModifiedTimeField
     * @param {Number} oNewValue
     * @param {Number} oOldValue
     * 
     */
    onTimestampModified : function (oModifiedTimeField, oNewValue, oOldValue) {
    	var oFileManager = this.getFileManager();
    	var oNewDate = new Date(oNewValue);
    	var oTimestampID = this.getMediaTimestamp();
    	var oDiff = oNewDate - new Date(oTimestampID.getValue());
    	
    	// Convert to seconds from milliseconds
    	oFileManager.oTimeOffset = oDiff.valueOf()/1000;
    },
    
    /**
     * Refresh GPS time range view
     * 
     * @param {Object} oModifiedTimeField
     * @param {Object} oEvent
     * 
     */
    onRunTimestampModified: function (oModifiedTimeField, oEvent) {
    	if (this.getGpsTimeRangeViewer() !== undefined) {
    		var oModifiedTime = new Date(oModifiedTimeField.getValue());
    		var oNewRange = this.getTimeRange().getValue();
    		var oFileManager = this.getFileManager();

        	var oTimestampID = this.getMediaTimestamp();
        	var oDiff = oModifiedTime - new Date(oTimestampID.getValue());
        	
        	// Convert to seconds from milliseconds
    		oFileManager.oTimeOffset = oDiff.valueOf()/1000;
        	
    		var oStartTime = new Date(oModifiedTime.getTime()-oNewRange*1000);
    		var oEndTime = new Date(oModifiedTime.getTime()+oNewRange*1000);
		
    		var oMySQLTimeZone = this.getTimeZone().formatMySQLTimeZone(
	            this.getTimeZone().getValue()
	        );
    		
    		this.getGpsTimeRangeViewer().onGPSTimeRangeViewerRefresh(
				oStartTime,
				oEndTime,
				oMySQLTimeZone
    		);
    		
    		this.attachResult(this.getGpsTimeRangeViewer());
            this.updateInstruction();
		}
    },
    
    /**
     * Update the GPS information from the selected time range
     * 
     * @param {Object} oSlider
     * @param {Object} oThumb
     * @param {Number} oNewValue
     * @param {Number} oOldValue
     * 
     */
    onTimeRangeChange : function (oSlider, oThumb, oNewValue, oOldValue) {
		if (this.getGpsTimeRangeViewer() !== undefined) {
			var oFileManager = this.getFileManager();
			var oModifiedValue = this.getMediaTimestampModified().getValue();
			var oSearchTime = "";
			if (oModifiedValue != "") {
				oSearchTime = new Date(oModifiedValue);
			}
			else {
				var oTimestamp = this.getMediaTimestamp().getValue();
				if (oTimestamp != "") {
					oSearchTime = new Date(oTimestamp);
				}
			}
			
			if (oSearchTime != "") {
				// Set label
				// TODO: This is not working. Check it back.
//				oSlider.labelEl.update("<span>GPS Search<p>(+/- "+oNewValue.toString()+" s)</span>")
				
				var oStartTime = new Date(oSearchTime.getTime()-oNewValue*1000);
        		var oEndTime = new Date(oSearchTime.getTime()+oNewValue*1000);
        		
        		var oMySQLTimeZone = this.getTimeZone().formatMySQLTimeZone(
		            this.getTimeZone().getValue()
		        );
        		
        		this.getGpsTimeRangeViewer().onGPSTimeRangeViewerRefresh(
    				oStartTime,
    				oEndTime,
    				oMySQLTimeZone
        		);
        		
        		this.attachResult(this.getGpsTimeRangeViewer());
                this.updateInstruction();
			}
		}
    },
    
    /**
     * Listen to file tree selection change event
     * 
     * @param {Object} oOptions
     */
    onFileSelectionChange : function(oOptions) {
    	// Check validity whether in composition with other components
    	if (typeof this.getSelectedFile() == "undefined") return false;

    	this.logStatus('Selected file: '+oOptions.sourceFile);
        
    	// Save a selected file information
    	this.getSelectedFile().setValue(oOptions.sourceFile);
        this.getSourceType().setValue(oOptions.isDirectory);
        
        if (oOptions.isDirectory == true) {
        	this.setInstruction(this.getSummary());
        	return;
        }
        
        this.getFilePreviewWindowItem().setHtml('');
        // this.getResultPane().hide(false);
        
        var ext = oOptions.sourceFile.substr(oOptions.sourceFile.lastIndexOf('.') + 1).toLowerCase();
        var oSelectedMediaType = '';
        
        this.getMediaType().setFile(oOptions.sourceFile);
        this.getFilePreviewWindowItem().setHtml('<center><img src="resources/images/spinner.gif" width="24px"></center>');
        
    	oDataManager = this;
        return this.getFileManager().isValidMedia({
        	sourceFile: oOptions.sourceFile, 
        	onFail: function() {
        		if (oDataManager.getFilePreview()) {
        			oDataManager.getFilePreview().setHtml('');
        		}
        		
        		oDataManager.attachResult(data.result);
        		oDataManager.updateInstruction();
        	},
        	onGetPreview: function(data) {
        		oDataManager.onGetPreview(data);
        		
        		oDataManager.attachResult(data.result);
        		oDataManager.updateInstruction();
        	}
        });
    },
    
    /**
     * Update the GPS region by the Video duration
     * 
     * @param {Object} oFileManager
     */
    onVideoGetDuration : function(oFileManager) {
    	oFileManager.startTime = new Date(oFileManager.oDateTime.getTime());
    	
    	// Convert duration to milliseconds for Javscript timestamp object interoperation
    	oFileManager.endTime = new Date(oFileManager.oDateTime.getTime() + oFileManager.duration*1000);
    	
        // Update GPS
    	var oConfig = new Array();
        oConfig["startTimestamp"] = oFileManager.startTime;
        oConfig["endTimestamp"] = oFileManager.endTime;
        this.onPreviewUpdateGPS(oConfig);
    },

    /**
     * Shift the location by the video play time
     * 
     * @param {Object} oFileManager
     */
    onVideoPlay : function(oFileManager) {
    	// Convert duration to milliseconds for Javscript timestamp object interoperation
    	oFileManager.oCurrentPlayTime = new Date(oFileManager.oDateTime.getTime() + oFileManager.currentTime*1000);
    	
    	oTimestampID = this.getMediaTimestamp();
        oTimestampModifiedID = this.getMediaTimestampModified();
        
    	oTimestampID.setValue(oFileManager.oCurrentPlayTime.toString());
    	
        // Update GPS
    	// TODO: This is not that to implement in the preview mode before the time correction
    	/*
        if (oFileManager.onSetCurrentMapTime) {
        	oFileManager.onSetCurrentMapTime(oFileManager);
        }
        */
    },
    
    /**
     * Get file preview from the server
     * 
     * @param data
     */
    onGetPreview: function (data) {
    	var oUtil = new Ext.create('Elog.api.utility.Base');
    	
    	// Switch to preview card
        this.getDataManagerLayout().
        	setActiveItem(this.getFilePreviewPanel());
        
        // Adjust width
        /*
        var oWidthControledHtml = '<div id="'+
			oFileManager.oGUIInfo.filepreviewid+'" style="width: '+
			(Ext.getCmp(oFileManager.oGUIInfo.filemanagerfilelayout).getWidth()-20)+'px; align: center"></div>';
        
        $('#'+oFileManager.oGUIInfo.filepreviewwindowitem).html(oWidthControledHtml);
        */
        
        if (data.root.isbase64encoded == 'true') {
        	this.getFilePreviewWindowItem().setHtml(oUtil.base64Decode(data.root.results));
        }
        else {
        	this.getFilePreviewWindowItem().setHtml(data.root.results);
        }
        
        this.updateInstruction();
        
        var oTimestampID = this.getMediaTimestamp();
        var oTimestampModifiedID = this.getMediaTimestampModified();
        
        // oFileManager.oDateTime = "";
        if (data.root.unixtimestamp !== undefined && data.root.unixtimestamp != '') {
        	oTimestampID.show(true);
        	oFileManager.oDateTime = new Date(data.root.unixtimestamp*1000);
        }
        else if (data.root.timestamp !== undefined && data.root.timestamp != '') {
        	oTimestampID.show(true);
        	oFileManager.oDateTime = new Date(Date.parse(data.root.timestamp));
        }
        else if (data.root.utctimestamp !== undefined && data.root.utctimestamp != '') {
        	oTimestampID.show(true);
        	// oFileManager.oDateTime = new Date(Date.parse(data.root.utctimestamp));
        	oFileManager.oDateTime = new Date(data.root.utctimestamp);
        }
        
        if (typeof oFileManager.oDateTime != "undefined") {
        	oTimestampID.setValue(oFileManager.oDateTime.toString());
        	// oTimestampModifiedID.setValue(oFileManager.oDateTime.toString());
        	// Set the time zone
        	this.getTimeZone().setValue(
    			this.getTimeZone(
        			oFileManager,
        			oFileManager.oDateTime
        		)
        	);
        	oTimestampModifiedID.reset("");
        }
        
        // Time to adjust in milliseconds
    	oFileManager.oDateTimeToAdjust = 0;
        // this.getDataManagerLayout().doLayout();
        
        // Ext.getCmp(oFileManager.oGUIInfo.mediacontrolpanelid).show(false);
        
        // Enable time range selector
        this.getTimeRange().enable();
        
        // Update GPS
        var oStartUnixtime;
        var oEndUnixtime;
        
    	var d = new Date(this.getMediaTimestamp().getValue());
		var oModifiedTime = this.getTimeZone().modifyTimebySelectedZone(d);
		var oNewRange = this.getTimeRange().getValue();
		
		this.getMediaTimestampModified().setValue(oModifiedTime);
		
        if (data.root.hasOwnProperty("endUnixtime")) {
//        	oStartUnixtime = parseInt(data.root.startTimestamp);
        	oStartUnixtime = parseInt(data.root.startUnixtime);
			oEndUnixtime = parseInt(data.root.endUnixtime);
        }
        else {
        	oStartUnixtime = (this.getFileManager().startTime) ? this.getFileManager().startTime : new Date(oModifiedTime.getTime()-oNewRange*1000);
			oEndUnixtime = (this.getFileManager().endTime) ? this.getFileManager().endTime : new Date(oModifiedTime.getTime()+oNewRange*1000);
        }
        
        var oConfig = new Array();
        oConfig["startUnixtime"] = oStartUnixtime*1000;
        oConfig["endUnixtime"] = oEndUnixtime*1000;
        this.onPreviewUpdateGPS(oConfig);
        
        // Tracking video progress
        if (this.getVideoPreview()) {
        	// Attach video events listeners
        	// Check the event video list at http://www.w3.org/2010/05/video/mediaevents.html
        	
        	// Initial call to get the video duration information in second
        	// TODO: This is not that to implement in the preview mode before the time correction
        	// TODO: Let's implement in the data view mode
        	/*
        	$("#"+oFileManager.oGUIInfo.videopreviewid).bind("durationchange", function() {
        		oFileManager.duration = this.duration;
        		oFileManager.onVideoGetDuration(oFileManager);
     		});
        	*/
        	
        	// Time update event to check the current time
        	// Below should be changed or use Sencha video
        	this.getVideoPreview().bind("timeupdate", function() {
        		oFileManager.currentTime = this.currentTime;
        		oFileManager.onVideoPlay(oFileManager);
      		});
        }	
    },
    
    onFileUploadInitialize: function(fileBtn) {
    	if (this.getFileManager() == null) {
			this.setFileManager(new Ext.create('Elog.api.media.FileManager'));
		}
		
		// Restore files
		var oDataManager = this;
        
        console.log('Init');
        
        fileBtn.setCallbacks({
            scope: oDataManager,
            success: oDataManager.onFileUploadSuccess,
            failure: oDataManager.onFileUploadFailure,
            change: oDataManager.onFileUploadChange
        });
    },
    
    onFileUploadChange: function(oScope, oFiles) {
    	console.log('Change');
        
    	oFileListView = oScope.getFileUploadListView();
    	oFileListView.getStore().removeAll();
    	
    	for (var i= 0; i < oFiles.length; ++i) {
    		var oFile = oFiles[i];
    		
    		oFileListView.getStore().insert(i, {
    			name: oFile.name,
    			size: oFile.size,
    			type: oFile.type
    		});
    	}
		
        // Ext.Msg.alert('File upload change', 'Change!');
    },
    
    onFileUploadSuccess: function(response) {
        console.log('Success');
        /*
        var loaded = Ext.getCmp('loadedImage');
        
        if (loaded) {
            loaded.destroy();
        }
        
        var image = Ext.create('Ext.Img', {
            id: 'loadedImage',
            width: 250,
            height: 200,
            src: response.base64,
            style: 'background-size: contain; margin-top: 20px; border-radius: 15px;'
        });
        
        var wlc = Ext.getCmp('welcome');
        wlc.add(image);
        image.show('fadeIn');
        */
        Ext.Msg.alert('File upload', 'Success!');
    },
    
    onFileUploadFailure: function() {
        console.log('Failure');
        Ext.Msg.alert('File upload', 'Failure!');
    },
    
    
    /**
     * Listen to file tree selection change event
     * 
     * @param {Object} oOptions
     */
    onFileUploadSelectionChange : function(oOptions) {
    	// Check validity whether in composition with other components
    	if (typeof this.getSelectedFile() == "undefined") return false;

    	this.logStatus('Selected file: '+oOptions.sourceFile);
        
        if (oOptions.isDirectory == true) {
        	this.setInstruction(this.getSummary());
        	var oParams = Ext.JSON.encode({
	        	uploadDir: oOptions.sourceFile,
	        	command: this.getFileManager().getCommands().putUserFile,
	        	userKey: this.getFileManager().getCookie('user_key')
	        });
	        
	        $('#idFileUploadConfig').val(oParams);
        }
    },
    
    onFileUploadSubmit: function(fileBtn) {
    	if (this.getFileManager() == null) {
			this.setFileManager(new Ext.create('Elog.api.media.FileManager'));
		}
		
		// Restore files
		var oDataManager = this;
		
		// Set initial data
    	$('#idFileUploadCommand').val(this.getFileManager().getCommands().putUserFile);
    	
    	var oFileUploader = this.getFileUploaderButton();
		oFileUploader.setActionUrl(this.getFileManager().getCookie('server_url'));
		
		if (oFileUploader) {
			oFileUploader.submit();
		}
		
        console.log('Submitted');
    },
    
    onFileUploadSubmitted: function(fileBtn) {
    	if (this.getFileManager() == null) {
			this.setFileManager(new Ext.create('Elog.api.media.FileManager'));
		}
		
		// Restore files
		var oDataManager = this;
		
        console.log('Submit');
    },
    
    onFileRestore: function() {
    	if (this.getFileManager() == null) {
			this.setFileManager(new Ext.create('Elog.api.media.FileManager'));
		}
		
		// Restore files
		var oDataManager = this;
		
		return this.getFileManager().restoreTestData({
			onSuccess: function() {
				// Refresh file tree
				if (oDataManager.getFileTreeView()) {
					$('#'+oDataManager.getFileTreeView().getDivId()).fileTree(
				        { 
					    	root: '/'
					    }, 
				        // Assign the event listener
				        oDataManager.getFileTreeView()
				    );
				}
			}
		});
    }
});