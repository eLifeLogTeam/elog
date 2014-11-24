/**
 * eLifeLog : Progress Bar UI
 * 
 * @author pilhokim
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.ui.panel.div.ProgressBar', {
 *     	fullscreen:true
 *     });
 */
Ext.define('Elog.view.ui.panel.div.ProgressBar', {
    extend: 'Elog.view.ui.panel.div.Base',
    xtype: 'elogProgressBar',
    config : {
		height: '25px',
    	scrollable: 'vertical',
    	divStyle: 'width: 100%; align: center, border: 0px solid #aaa',
    	progressBar: null
    },
	
	/**
	 * Instantiate a progress bar on the selected object
	 */
	init: function() {
		this.setProgressBar(
			$('#'+this.getDivId()).progressbar({ 
				value: 0 
			})
		);
	}
});