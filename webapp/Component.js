sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"ZLEAVE_REQ_CREATE/model/models"
], function(UIComponent, JSONModel, Device, models) {
	"use strict";

	return UIComponent.extend("ZLEAVE_REQ_CREATE.Component", {

		metadata: {
			manifest: "json"

		},
		
/*		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
*/
		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
		//	(SE)
			this.getRouter().initialize();
		//	(SE)
		
			// create the views based on the url/hash
			//sap.ui.core.UIComponent.getRouterFor(this).initialize();
		}
	});
});