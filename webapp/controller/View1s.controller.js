sap.ui.define([
		"ZLEAVE_REQ_CREATE/controller/BaseController", "sap/ui/model/json/JSONModel",
			"sap/ui/core/routing/History", "ZLEAVE_REQ_CREATE/model/formatter"
	

	],
	function(BaseController, JSONModel, History, formatter) {
		"use strict";


//	jQuery.sap.require("ZLEAVE_REQ_CREATE.model.formatter");
	jQuery.sap.require("ZLEAVE_REQ_CREATE.utils.UIHelper");
	jQuery.sap.require("sap.m.MessageBox");
	jQuery.sap.require("ZLEAVE_REQ_CREATE.utils.DataManager");
	jQuery.sap.require("ZLEAVE_REQ_CREATE.utils.ConcurrentEmployment");
	jQuery.sap.require("ZLEAVE_REQ_CREATE.utils.CalendarTools");
	jQuery.sap.require("sap.ca.ui.dialog.factory");
	jQuery.sap.require("sap.ca.ui.dialog.Dialog");
	jQuery.sap.require("sap.m.MessageToast");
	jQuery.support.useFlexBoxPolyfill = false;
	jQuery.sap.require("sap.ca.ui.model.format.FileSizeFormat");
	jQuery.sap.require("sap.ca.ui.message.message");
	jQuery.sap.require("sap.ui.thirdparty.sinon");
	
	
		return BaseController.extend("ZLEAVE_REQ_CREATE.controller.View1s", {
			
			formatter: formatter,

			onInit: function() {

			},

			_onRouteMatched: function(oEvent) {

			},

			onAfterRendering: function(oEvent) {

			},

			onUpdateFinished: function(oEvent) {

			},

			_onBindingChange: function() {

			},

			onDisplayNotFound: function(oEvent) {
				//display the "notFound" target without changing the hash
				this.getRouter().getTargets().display("notFound", {
					fromTarget: "view1"
				});
			},

			onPress: function(oEvent) {

				var oItem, oCtx, zid;

				oItem = oEvent.getSource();
				oCtx = oItem.getBindingContext();
				zid = oCtx.getProperty("ZrequestId");

				this.getRouter().navTo("view2", {
					ZrequestId: zid
				});
			},

			_showObject: function(oItem) {
				this.getRouter().navTo("view2", {
					objectId: oItem.getBindingContext().getProperty("ZrequestId")

				});
			},

			getRouter: function() {
				return sap.ui.core.UIComponent.getRouterFor(this);
			}

		});
	});