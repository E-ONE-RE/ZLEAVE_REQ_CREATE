sap.ui.define([
		"ZLEAVE_REQ_CREATE/controller/BaseController", "sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History", "ZLEAVE_REQ_CREATE/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"

	],
	function(BaseController, JSONModel, History, formatter, Filter, FilterOperator) {
		"use strict";

			//	jQuery.sap.require("ZLEAVE_REQ_CREATE.utils.Formatters");
	//	jQuery.sap.require("ZLEAVE_REQ_CREATE.utils.UIHelper");
		jQuery.sap.require("sap.m.MessageBox");
	//	jQuery.sap.require("ZLEAVE_REQ_CREATE.utils.DataManager");
	//	jQuery.sap.require("ZLEAVE_REQ_CREATE.utils.ConcurrentEmployment");
	//	jQuery.sap.require("ZLEAVE_REQ_CREATE.utils.CalendarTools");
	//	jQuery.sap.require("sap.ca.ui.dialog.factory");
	//	jQuery.sap.require("sap.ca.ui.dialog.Dialog");
		jQuery.sap.require("sap.m.MessageToast");
		// jQuery.support.useFlexBoxPolyfill = false;
	//	jQuery.sap.require("sap.ca.ui.model.format.FileSizeFormat");
	//	jQuery.sap.require("sap.ca.ui.message.message");
		// jQuery.sap.require("sap.ui.thirdparty.sinon");

		return BaseController.extend("ZLEAVE_REQ_CREATE.controller.View1s", {

			formatter: formatter,

			onInit: function() {
                
                
            /// refresh tabella richieste
			setInterval(function() {
				
				var oView = this.getView();
				var oTable = oView.byId("__table0");
				oTable.getBinding("items").refresh();

				var msg = "Updating...";
				sap.m.MessageToast.show(msg, {
					duration: 3000,
					autoClose: true,
					closeOnBrowserNavigation: true
				});

			}, 300000);
			
				//MP: Creo un modello JSON locale per il binding della lista select nel filtro
				var jData = {
					"StatusCollection": [{
							"id": "I",
							"text": "Inviata"
						},

						{
							"id": "A",
							"text": "Approvata"
						},

						{
							"id": "R",
							"text": "Rifiutata"
						}
					]
				};
				
			    var oSelect1 = sap.ui.getCore().byId("__component0---V1S--selABS");
				var oSelect2 = this.getView().byId("selStatus");
				var oModel = new sap.ui.model.json.JSONModel(jData);
				sap.ui.getCore().setModel(oModel, "StatusCollection");
				oSelect2.setModel(sap.ui.getCore().getModel("StatusCollection"));
				var oTemplate =  new sap.ui.core.Item({
						key: "{id}",
						text: "{text}"

					});
				oSelect2.bindAggregation("items", {
					path: "/StatusCollection",
					template: oTemplate
				});
				
	     	// MP: fine binding JSON model alla lista degli stati nella select per il filtro
				
			},

			_onRouteMatched: function(oEvent) {

			},

			onAfterRendering: function(oEvent) {

			},

			onUpdateFinished: function(oEvent) {
			
	
			},

			_onBindingChange: function() {

			},

			//MP: implementazione per i filtri
			//MP: pulizia filtri
			onClear: function(oEvent) {
				this.getView().byId("selABS").setSelectedKey("");
				this.getView().byId("selStatus").setSelectedKey("");
				this.onSearch();
			},
			//MP: fine

            //MP: funzione per i filtri sulla pagina dello storico
			onSearch: function(oEvent) {
				var aFilter = [];
				var sQuery1 = this.getView().byId("selABS").getSelectedKey();
				var sQuery2 = this.getView().byId("selStatus").getSelectedKey();
				if (sQuery1 && sQuery2) {
					aFilter.push(new Filter("ZabsType", FilterOperator.Contains, sQuery1));
					aFilter.push(new Filter("ZreqStatus", FilterOperator.Contains, sQuery2));
				} else if (sQuery1 && !sQuery2) {
					aFilter.push(new Filter("ZabsType", FilterOperator.Contains, sQuery1));
				} else {
					aFilter.push(new Filter("ZreqStatus", FilterOperator.Contains, sQuery2));
				}
				var oTable = this.getView().byId("__table0");
				var oBinding = oTable.getBinding("items");
				oBinding.filter(aFilter);
			},
		   //MP: fine funzione per filtro


            //MP: funzione per eseguire automaticamente il filtraggio ogni volta che i filtri selezionati cambiano
			onSelectChange: function(oEvent) {
				this.onSearch();
			},
			//MP: fine

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
			
			
		// MP: per il refresh del binding della lista delle richieste
		onClickRefresh: function() {
			var oView = this.getView();
			var oTable = oView.byId("__table0");
			oTable.getBinding("items").refresh();

			var msg = "Updated";
			sap.m.MessageToast.show(msg, {
				duration: 1500, // default
				animationTimingFunction: "ease", // default
				animationDuration: 1000, // default
				closeOnBrowserNavigation: true // default
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