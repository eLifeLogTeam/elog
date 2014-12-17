/**
 * Elog API view: LoginPanel
 * 
 * A panel used for log-in process
 * 
 * 
 * ## Example
 *
 *     @example preview
 *     Ext.create('Elog.view.panel.admin.LogInPanel', {
 *     	fullscreen:true
 *     });
 * 
 */
Ext.define('Elog.view.panel.admin.LogInPanel', {
	extend: 'Elog.view.panel.Base',
    xtype: 'elogLogInPanel',
    requires: [
       // 'Ext.form.Panel',
       'Ext.form.FieldSet',
	   'Ext.field.Password',
	   'Ext.field.Checkbox'
    ],
    config: {
    	layout: {
	        type: 'vbox',
	        align: 'center',
	        pack: 'center'
	    },
	    // maxWidth: 550,
    	/*
         * Here you add lifelog interfaces as cards to the main panel.
         */
	    margin: 5,
    	items: [{
	    	xtype: 'fieldset',
	    	minWidth: 450,
        	id: 'idElogLogInFieldSet',
	    	items: [{
	        	xtype: 'textfield',
				id: 'idElogUserId',
				name: 'idElogUserId',
				label: 'Username',
				placeHolder: 'User ID',
				required: true,
				clearIcon: true,
				value: 'eloguidemo'
		    },{
		    	xtype: 'passwordfield',
				id: 'idElogUserPassword',
				name: 'idElogUserPassword',
				label: 'Password',
				placeHolder: 'password',
				required: true,
				clearIcon: true,
				value: 'Qwer!234'
		    },{
	        	xtype: 'textfield',
				id: 'idElogServerUrl',
				name: 'idElogServerUrl',
				label: 'Server URL',
				placeHolder: 'Server',
				// value: 'http://127.0.0.1/lab/server/index.php',
				value: 'http://www.elifelog.org/lab/server/index.php',
				required: true,
				clearIcon: true
		    },{
		    	xtype: 'button',
	        	text: 'Sign in',
	            id: 'idElogRunLogIn'
	        }]
	    }]
    }
});
