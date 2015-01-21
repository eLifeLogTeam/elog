/**
 * Elog controller: LogIn
 * 
 * This is the log-in interface controller. Including views are optional since necessary components are 
 * accessed through refs.When designing your own login panel, replace or comment above views config 
 * and update below IDs to work with your panel.
 * 
 * It calls the server service (See {@link Elog.api.admin.UserManager}) to check the identity. 
 * 
 */
Ext.define('Elog.controller.admin.LogIn', {
	extend: 'Elog.controller.Base',
    requires: [
       'Elog.controller.Base',
       'Elog.api.admin.UserManager'
    ],
	config: {
		userManager: null, // Instance of 'Elog.api.admin.UserManager'
		/**
		 * Including views are optional since necessary components are accessed through refs
		 */
		views: [
	        'Elog.view.panel.admin.LogInPanel'
		],
		/**
		 * When designing your own login panel, replace or comment above views config 
		 * and update below IDs to work with your panel
		 */
		refs: {
			logInPanel: '#idElogLogInPanel',
			logInFieldSet: '#idElogLogInFieldSet',
			userId: '#idElogUserId',
			userPassword: '#idElogUserPassword',
			runLogIn: '#idElogRunLogIn',
			serverUrl: '#idElogServerUrl',
			mainPanel: '#idElogMainPanel',
			menuList: '#idElogMenuList'
		},

		control: {
			serverUrl: {
		    	action: 'onRunLogIn'
		    },
			userPassword: {
		    	action: 'onRunLogIn'
		    },
		    runLogIn: {
		    	tap: 'onRunLogIn'
		    }
		}
	},
	
	init: function() {
		if (this.getUserManager() == null) {
			this.setUserManager(new Ext.create('Elog.api.admin.UserManager'));
			
			if (this.getUserManager() == null) {
				this.logError('Errors in creating the instance of Elog.api.admin.UserManager');
				return false;
			}
		}
		
		// executes after 1 seconds:
		Ext.Function.defer(this.onAuthenticate, 1000, this, []);
	},
	
	/**
	 * Authenticate the user information
	 */
	onAuthenticate: function() {
		if (typeof this.getUserManager().getCookie('user_key') !== "undefined") {
			if (this.getUserId()) {
				this.getUserId().setValue(this.getUserManager().getCookie('user_id'));
				this.getServerUrl().setValue(this.getUserManager().getCookie('server_url'));
				
				this.onLogInSuccess();
			}
			else {
				this.logError('')
			}
			
		}
	},
	
	/**
	 * Decide actions when the button is pressed. If the cookie exists, then it logs out.
	 * Or else it logs in.
	 */
	onRunLogIn: function() {
		if (this.getUserManager() !== undefined) {
			if (typeof this.getUserManager().getCookie('user_key') !== "undefined") {
				if (this.getRunLogIn().getText() == 'Sign out') {
					this.onLogOut();
				}
				else {
					this.onLogIn();
				}
			}
			else {
				this.onLogIn();
			}
		}
	},
	
	/**
	 * Perform log-in. It calls the server service (See {@link Elog.api.admin.UserManager}) to check the identity. 
	 * If succssful, we will have a number of cookies of user details.
	 */
	onLogIn: function() {
		oLogIn = this;
		this.logStatus('Logging in to the system...');
		
		oResult = this.getUserManager().getUserInformation({
			userId: this.getUserId().getValue(),
			userPassword: this.getUserPassword().getValue(),
			serverUrl: this.getServerUrl().getValue(),
			// Callback function for the user loging success event
			onSuccess: function (oResult) {
				oLogIn.attachResult(oLogIn.getUserManager());
				oLogIn.onLogInSuccess(oResult);
			},
			/**
			 * Callback function for log-in failure
			 */
			onFail: function (oResult) {
				oLogIn.attachResult(oLogIn.getUserManager());
				oLogIn.onLogInFail(oResult);
			},
			// Callback function for connection failure. Mostly due to the network connection or wrong server address.
			onConnectionFail: function (oResult) {
				oLogIn.onConnectionFail(oResult);
			}
		});
	},
	
	/**
	 * If the user input is matched with the db user information, 
	 * then it performs post-login procedure.
	 * 
	 * @param {Object} oResult
	 */
	onLogInSuccess: function (oResult) {
		this.getUserId().setDisabled(true);
		this.getUserPassword().hide(true);
		this.getServerUrl().hide(true);
		this.getRunLogIn().setText('Sign out');
		
		this.updateInstruction();
	},
	
	/**
	 * Called when log-in fails.
	 * 
	 * @param {Object} oResult
	 */
	onLogInFail: function (oResult) {
		// this.getLogInFieldSet().setInstructions('Your username or password is incorrect.');
		this.getUserPassword().setValue('');
		this.updateInstruction();
	},
	
	/**
	 * Called when log-in fails.
	 * 
	 * @param {Object} oResult
	 */
	onConnectionFail: function (oResult) {
		this.getServerUrl().setValue('');
		this.logError('No network connection or wrong server address.');
		
		this.updateInstruction();
	},
	
	/**
	 * Delete cookies when logging out.
	 */
	onLogOut: function() {
		this.getUserId().setValue(this.getUserManager().getCookie('user_id'));
    	this.getUserManager().onLogout();
    	
    	this.getRunLogIn().setText('Sign in');
    	this.getUserPassword().show(true);
    	this.getUserPassword().setValue('');
    	this.getServerUrl().show(true);
    	this.getUserId().setDisabled(false);

    	this.logStatus('Logged out...');
		this.updateInstruction();
	}
});