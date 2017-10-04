sap.ui.define([
		"ZLEAVE_REQ_CREATE/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		'sap/ui/unified/CalendarLegendItem',
		'sap/ui/unified/DateTypeRange',
		"sap/ui/core/routing/History",
		"ZLEAVE_REQ_CREATE/model/formatter"
	],
	function(BaseController, JSONModel, CalendarLegendItem, DateTypeRange, History, formatter) {
		"use strict";

//		jQuery.sap.require("ZLEAVE_REQ_CREATE.utils.Formatters");
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

		return BaseController.extend("ZLEAVE_REQ_CREATE.controller.View2", {
			
				formatter: formatter,
				
			//	oModelDate: null,

			//SE START CUSTOM CALENDAR
			oFormatYyyymmdd: null,
			oFormatYYyyymmdd: null,
			//	oModel: null,
			//SE END CUSTOM CALENDAR		
			onInit: function() {

			//	this.oModelDate = new JSONModel({selectedDates:[]});
			//	this.getView().setModel(this.oModelDate);
				ZLEAVE_REQ_CREATE.utils.Formatters.init(this.resourceBundle);
				//ZLEAVE_REQ_CREATE.utils.CalendarTools.init(this.resourceBundle);
				//this.oDataModel = ZLEAVE_REQ_CREATE.utils.DataManager.getBaseODataModel();
		
				this._initCntrls();
				// sap.ui.getCore().getEventBus().subscribe("ZLEAVE_REQ_CREATE.LeaveCollection", "refresh", this._onLeaveCollRefresh, this);

				this.oFormatYyyymmdd = sap.ui.core.format.DateFormat.getInstance({
					pattern: "yyyyMMdd",
					calendarType: sap.ui.core.CalendarType.Gregorian
				});
				//this.oFormatYYyyymmdd = sap.ui.core.format.DateFormat.getInstance({pattern: "yyyy-MM-dd", calendarType: sap.ui.core.CalendarType.Gregorian});

				var oRouter = this.getRouter();
				oRouter.getRoute("view2").attachMatched(this._onRouteMatched, this);

			},

			_onRouteMatched: function(oEvent) {
				var oArgs, oView;
				oArgs = oEvent.getParameter("arguments");
				oView = this.getView();

				oView.bindElement({
					path: "/LeaveRequestSet('" + oArgs.ZrequestId + "')",
					//	parameters : {expand: 'ToLeaveReqPos'}, 

					events: {
						change: this._onBindingChange.bind(this),
						dataRequested: function(oEvent) {
							oView.setBusy(true);
						},
						dataReceived: function(oEvent) {
							oView.setBusy(false);

						}
					}
				});

			},

			_onBindingChange: function(oEvent) {
				// No data for the binding
				if (!this.getView().getBindingContext()) {
					this.getRouter().getTargets().display("notFound");
				}
				
				 var oView = this.getView();
					var oModel = this.getView().getModel();
                      sap.ui.getCore().setModel(oModel);
                      
				//ripulisco i campi		
				oView.byId("LRS4_DAT_CALENDAR").removeAllSelectedDates();
				oView.byId("LRS4_DAT_CALENDAR").removeAllSpecialDates();
				
					var oCal2 = oView.byId("LRS4_DAT_CALENDAR");
						var oLeg2 = oView.byId("legend1");
							oLeg2.destroyItems();

				oView.byId("LRS4_DAT_STARTTIME").setValue("");
				oView.byId("LRS4_DAT_STARTTIME").rerender();
				oView.byId("LRS4_DAT_STARTTIME").setEnabled(true);

				oView.byId("LRS4_DAT_ENDTIME").setValue("");
				oView.byId("LRS4_DAT_ENDTIME").rerender();
				oView.byId("LRS4_DAT_ENDTIME").setEnabled(true);

				oView.byId("LRS4_TXA_NOTE").setValue("");
				oView.byId("LRS4_TXA_NOTE").rerender();
				oView.byId("LRS4_TXA_NOTE").setEnabled(true);
				
				var oCtx, zid;
				oCtx = oView.getBindingContext();
				zid = oCtx.getProperty("ZrequestId");
				////zid = oView.getBindingContext().getProperty("ZrequestId");

				// setto i valori in base ai valori del binding corrente
				oView.byId("SLCT_LEAVETYPE").setSelectedKey(oCtx.getProperty("ZabsType"));
				oView.byId("SLCT_APPROVER").setSelectedKey(oCtx.getProperty("Tmsapprover"));
				oView.byId("LRS4_DAT_STARTTIME").setValue("");
				oView.byId("LRS4_DAT_ENDTIME").setValue("");
				oView.byId("LRS4_TXA_NOTE").setValue(oCtx.getProperty("Znote"));

			
				
				//leggo le posizioni per ricavare i giorni
				
				var sRead = "/LeaveRequestSet('" + zid + "')/ToLeaveReqPos";

				oModel.read(sRead, {

					success: fnReadS,

					error: fnReadE
				});

				function fnReadS(oData, response) {
					console.log(oData);
					console.log(response);

					// controllo che la funzione è andata a buon fine 
					if (response.statusCode == "200") {
						////////////////////////////////				

						var oFormatYYyyymmdd = sap.ui.core.format.DateFormat.getInstance({
							pattern: "yyyyMMdd",
							calendarType: sap.ui.core.CalendarType.Gregorian
						});

						var oRefDate = new Date();

						var oDateRange;

						if (oData.results.length > 0) {
							for (var i = 0; i < oData.results.length; i++) {

								//						var res = oData.results[i].Zdate.substring(8);
								var res = oData.results[i].Zdate;

						/*if ( oData.results[i].ZabsType == "0001") {		
								
									oCal2.addSpecialDate(new DateTypeRange({
									startDate : oFormatYYyyymmdd.parse(res),
									type : "Type01",
									tooltip : "Permesso"
						
									
									}));
						}
						
							if ( oData.results[i].ZabsType == "0002") {		
								
									oCal2.addSpecialDate(new DateTypeRange({
									startDate : oFormatYYyyymmdd.parse(res),
									type : "Type05",
									tooltip : "Ferie"
						
									
									}));
						}
						
							if ( oData.results[i].ZabsType == "0003") {		
								
									oCal2.addSpecialDate(new DateTypeRange({
									startDate : oFormatYYyyymmdd.parse(res),
									type : "Type09",
									tooltip : "Recupero"
						
									
									}));
						}*/

                          // aggiungere date selezionate quando si è in modifica
								oCal2.addSelectedDate(new DateTypeRange({
									startDate: oFormatYYyyymmdd.parse(res)

								}));

							}
							
				/*		oLeg2.addItem(new CalendarLegendItem({
						text : "Permesso",
						id : "leg11",
						type : "Type01"
						
					}));
					
						oLeg2.addItem(new CalendarLegendItem({
						text : "Ferie",
						id : "leg22",
						type : "Type05"
					}));
					
						oLeg2.addItem(new CalendarLegendItem({
						text : "Recupero",
						id : "leg33",
						type : "Type09"
					}));*/

						}

					} else {

						jQuery.sap.require("sap.m.MessageBox");
						sap.m.MessageBox.show(
							"Error: Nessun record recuperato", {
								icon: sap.m.MessageBox.Icon.WARNING,
								title: "Error",
								actions: [sap.m.MessageBox.Action.CLOSE]

							});

					}

				} // END FUNCTION SUCCESS

				function fnReadE(oError) {
					console.log(oError);

					alert("Error in read: " + oError.message);
				}
				
				
				
				
				//////////////////////////
				
				//leggo le posizioni per ricavare i giorni
				
				var sReadPos = "/LeaveRequestPosSet";

				oModel.read(sReadPos, {

					success: fnReadS_Pos,

					error: fnReadE_Pos
				});

				function fnReadS_Pos(oData, response) {
					console.log(oData);
					console.log(response);

					// controllo che la funzione è andata a buon fine 
					if (response.statusCode == "200") {
						////////////////////////////////				

						var oFormatYYyyymmdd = sap.ui.core.format.DateFormat.getInstance({
							pattern: "yyyyMMdd",
							calendarType: sap.ui.core.CalendarType.Gregorian
						});

						var oRefDate = new Date();

						var oDateRange;

						if (oData.results.length > 0) {
							for (var i = 0; i < oData.results.length; i++) {

								//						var res = oData.results[i].Zdate.substring(8);
								var res = oData.results[i].Zdate;

						if ( oData.results[i].ZabsType == "0001") {		
								
									oCal2.addSpecialDate(new DateTypeRange({
									startDate : oFormatYYyyymmdd.parse(res),
									type : "Type01",
									tooltip : "Permesso"
						
									
									}));
						}
						
							if ( oData.results[i].ZabsType == "0002") {		
								
									oCal2.addSpecialDate(new DateTypeRange({
									startDate : oFormatYYyyymmdd.parse(res),
									type : "Type05",
									tooltip : "Ferie"
						
									
									}));
						}
						
							if ( oData.results[i].ZabsType == "0003") {		
								
									oCal2.addSpecialDate(new DateTypeRange({
									startDate : oFormatYYyyymmdd.parse(res),
									type : "Type09",
									tooltip : "Recupero"
						
									
									}));
						}

                          // aggiungere date selezionate quando si è in modifica
						//		oCal2.addSelectedDate(new DateTypeRange({
						//			startDate: oFormatYYyyymmdd.parse(res)

						//		}));

							}
							
						oLeg2.addItem(new CalendarLegendItem({
						text : "Permesso",
						id : "leg11",
						type : "Type01"
						
					}));
					
						oLeg2.addItem(new CalendarLegendItem({
						text : "Ferie",
						id : "leg22",
						type : "Type05"
					}));
					
						oLeg2.addItem(new CalendarLegendItem({
						text : "Recupero",
						id : "leg33",
						type : "Type09"
					}));

						}

					} else {

						jQuery.sap.require("sap.m.MessageBox");
						sap.m.MessageBox.show(
							"Error: Nessun record recuperato", {
								icon: sap.m.MessageBox.Icon.WARNING,
								title: "Error",
								actions: [sap.m.MessageBox.Action.CLOSE]

							});

					}

				} // END FUNCTION SUCCESS

				function fnReadE_Pos(oError) {
					console.log(oError);

					alert("Error in read: " + oError.message);
				}


			},

			/////////////////////

			onAfterRendering: function(oEvent) {

			},

			handleAbsTypeSelect: function(oEvent) {
				var oAbsType = oEvent.oSource;
				var aAbsTypeKey = oAbsType.getSelectedKey();

			},

			//SE START CUSTOM CALENDAR
			handleCalendarSelect: function(oEvent) {
				var oCalendar = oEvent.oSource;
				var aSelectedDates = oCalendar.getSelectedDates();
				var oDate;
				var oDataSel = {
					selectedDates: []
				};
				if (aSelectedDates.length > 0) {
					for (var i = 0; i < aSelectedDates.length; i++) {
						oDate = aSelectedDates[i].getStartDate();
						oDataSel.selectedDates.push({
							Date: this.oFormatYyyymmdd.format(oDate)
						});
					}
				//		this.oModelDate.setData(oDataSel);
				} else {
					//	this._clearModel();
				}
			},



		
			handleRemoveSelection: function(oEvent) {
				this.getView().byId("LRS4_DAT_CALENDAR").removeAllSelectedDates();
				//	this._clearModel();
			},

			/*_clearModel: function() {
			var oData = {selectedDates:[]};
			this.oModel.setData(oData);
		},*/
			//SE END CUSTOM CALENDAR

			handleShowSpecialDays: function(oEvent) {
				var oCal1 = this.getView().byId("LRS4_DAT_CALENDAR");
				var oLeg1 = this.getView().byId("legend1");

				var bPressed = oEvent.getParameter("pressed");

				if (bPressed) {
					var oRefDate = new Date();
					for (var i = 1; i <= 10; i++) {
						oRefDate.setDate(i);
						var sType = "";
						if (i < 10) {
							sType = "Type0" + i;
						} else {
							sType = "Type" + i;
						}
						oCal1.addSpecialDate(new DateTypeRange({
							startDate: new Date(oRefDate),
							type: sType,
							tooltip: "Placeholder " + i
						}));

						oLeg1.addItem(new CalendarLegendItem({
							text: "Placeholder " + i
						}));

					}

					oCal1.addSpecialDate(new DateTypeRange({
						startDate: new Date(oRefDate.setDate(11)),
						endDate: new Date(oRefDate.setDate(21)),
						type: sap.ui.unified.CalendarDayType.NonWorking
					}));

					oCal1.addSpecialDate(new DateTypeRange({
						startDate: new Date(oRefDate.setDate(25)),
						type: sap.ui.unified.CalendarDayType.NonWorking
					}));

					//			oDateRange = new sap.ui.unified.DateRange({startDate: oDate});
					oCal1.addSelectedDate(new DateTypeRange({
						startDate: new Date(oRefDate.setDate(26))

					}));

				} else {
					oCal1.destroySpecialDates();

					oLeg1.destroyItems();

				}
			},

			//Show confirmation dialog
			showDialog: function(oEvent) {
				var that = this;
				this.sButtonKey = oEvent.getSource().getId(); //mi salvo il valore chiave del bottone per la gestione dei conflitti in actionTask
				if (!that.Dialog) {

					that.Dialog = sap.ui.xmlfragment("ZLEAVE_REQ_CREATE.view.Dialog", this, "ZLEAVE_REQ_CREATE.controller.View2");
					//to get access to the global model
					this.getView().addDependent(that.Dialog);
					if (sap.ui.Device.system.phone) {
						that.Dialog.setStretch(true);
					}
				}
				if (sap.ui.Device.system.phone) {
					that.Dialog.setStretch(true);
				}
				that.Dialog.open();
			},

			//Close Dialog
			closeDialog: function() {
				this.Dialog.close();
				this.sButtonKey = undefined; //per controllare i conflitti in actionTask N.B.
			},

			onDisplayNotFound: function(oEvent) {
				//display the "notFound" target without changing the hash
				this.getRouter().getTargets().display("notFound", {
					fromTarget: "view1"
				});
			},
			/////////////////////////////////////////////////////////////////////  
			actionTask: function(oEvent) {

				// richiamare handleAbsTypeSelect

				var sButtonId;
				var oView, oViewW;
				var sTypeAction;
				var sSelectedTaskid;
				var sZabsType;
				var sDeleted;

				var sAction, sUser, sUname; //sUser e sUname rappresentano delle variabili di appoggio

				oView = this.getView();
				var oModel = this.getView().getModel();
				sap.ui.getCore().setModel(oModel);

				//          oModel.setUseBatch(false);
				//var oObject = oView.getBindingContext().getObject();

				if (this.Dialog) {
					this.Dialog.close();
				}

				sButtonId = this.sButtonKey;

				sUser = "";
				sAction = undefined;
				sDeleted = "";

				sTypeAction = undefined;
				if (sButtonId == oView.byId("btn1").getId()) {
					sAction = "MOD";
					sTypeAction = "Richiesta modificata";
					sUname = undefined;
				} else if (sButtonId == oView.byId("btn2").getId()) {
					sAction = "DEL";
					sTypeAction = "Richiesta Eliminata";
					sUname = undefined;
					sDeleted = "X";
					//(SE)
				}
			
           
				var oObject = oView.getBindingContext().getObject();

				var aSelectedDates = this.cale.getSelectedDates();
				var oDate;


				var oUrlParams = {
					ZrequestId: oObject.ZrequestId,
					Tmsapprover: this.slctApprover.getSelectedKey(),
					ZabsType: this.slctLvType.getSelectedKey(),
					ZreqStatus: "I",
					Znote: this.note.getValue(),
					Zdeleted: sDeleted

				};

				oUrlParams.ToLeaveReqPos = [];
				if (aSelectedDates.length > 0) {
					for (var i = 0; i < aSelectedDates.length; i++) {
						oDate = aSelectedDates[i].getStartDate();
						oUrlParams.ToLeaveReqPos.push({
							Zdate: this.oFormatYyyymmdd.format(oDate),
							Ztimestart: this.timeFrom.getValue(),
							Ztimeend: this.timeTo.getValue()
						});
						

					}
				
				} 

				jQuery.sap.require("sap.ui.commons.MessageBox");
				oModel.create('/LeaveRequestSet', oUrlParams, {
					method: "POST",
					success: fnS,

					error: fnE
				});

			
				function fnS(oData, response) {
					console.log(oData);
					console.log(response);

					// controllo che la funzione è andata a buon fine recuperando il risultato della function sap
					//	if (oData.Type == "S") {
					if (response.statusCode == "201") {

						//	var msg = "Success: "+oData.Message+", "+sTypeAction;
						var msg = "Success";
						sap.m.MessageToast.show(msg, {
							duration: 5000,
							autoClose: true,
							closeOnBrowserNavigation: false

						});

						// ripulisco campi  	
						oView.byId("LRS4_DAT_CALENDAR").removeAllSelectedDates();

						oView.byId("LRS4_DAT_STARTTIME").setValue("");
						oView.byId("LRS4_DAT_STARTTIME").rerender();
						oView.byId("LRS4_DAT_STARTTIME").setEnabled(true);

						oView.byId("LRS4_DAT_ENDTIME").setValue("");
						oView.byId("LRS4_DAT_ENDTIME").rerender();
						oView.byId("LRS4_DAT_ENDTIME").setEnabled(true);

						oView.byId("LRS4_TXA_NOTE").setValue("");
						oView.byId("LRS4_TXA_NOTE").rerender();
						oView.byId("LRS4_TXA_NOTE").setEnabled(true);

						// faccio refresh tabella riepilogativa delle richieste
						var sPrefix = oView.getId().substring(0, oView.getId().indexOf("---")) + "---"; 
						oViewW = sap.ui.getCore().byId(sPrefix + "V1S");
						var oTable = oViewW.byId("__table0");
						oTable.getBinding("items").refresh();
						sap.ui.controller("ZLEAVE_REQ_CREATE.controller.View2").onNavBackDirect(); 

					} else {
						//richiama una funzione di Object.Controller con questa sintassi

						//		alert("Error: "+oData.Message); 

						jQuery.sap.require("sap.m.MessageBox");
						sap.m.MessageBox.show(
							"Error: " + oData.Message, {
								icon: sap.m.MessageBox.Icon.WARNING,
								title: "Error",
								actions: [sap.m.MessageBox.Action.CLOSE]

							});

					}

				} // END FUNCTION SUCCESS

				function fnE(oError) {
					console.log(oError);

					alert("Error in read: " + oError.message);
				}

			},


			_initCntrls: function() {
				this.changeMode = false;
				this.withdrawMode = false;
				this.oChangeModeData = {};
				this.selRange = {};
				this.selRange.start = null;
				this.selRange.end = null;
				this.aLeaveTypes = [];
				this.leaveType = {};
				this.iPendingRequestCount = 0;
				this.bSubmitOK = null;
				this.bApproverOK = null;
				this.oSubmitResult = {};
				this.sApprover = "";
				this.sApproverPernr = "";
				this.bSimulation = true;
				this._isLocalReset = false;
				this.oBusy = new sap.m.BusyDialog();
				this.formContainer = this.byId("LRS4_FRM_CNT_BALANCES");
				this.timeInputElem = this.byId("LRS4_FELEM_TIMEINPUT");
				this.balanceElem = this.byId("LRS4_FELEM_BALANCES");
				this.noteElem = this.byId("LRS4_FELEM_NOTE");
				this.timeFrom = this.byId("LRS4_DAT_STARTTIME");
				this.timeTo = this.byId("LRS4_DAT_ENDTIME");
				this.legend = this.byId("LRS4_LEGEND");
				this.remainingVacation = this.byId("LRS4_TXT_REMAINING_DAYS");
				this.bookedVacation = this.byId("LRS4_TXT_BOOKED_DAYS");
				this.note = this.byId("LRS4_TXA_NOTE");
				this.cale = this.byId("LRS4_DAT_CALENDAR");
				this.slctLvType = this.byId("SLCT_LEAVETYPE");
				this.slctApprover = this.byId("SLCT_APPROVER");
				this.calSelResetData = [];
				//SE
				//this._initCalendar();
				//		this._deviceDependantLayout();
				this.objectResponse = null;
				this.ResponseMessage = null;
			},

			/*	_onLeaveCollRefresh: function() {
					ZLEAVE_REQ_CREATE.utils.CalendarTools.clearCache();
				},*/


			// NON USATA
			onChange: function(oEvent) {

				var oItem, oCtx, zid;

				oItem = oEvent.getSource();
				oCtx = oItem.getBindingContext();
				zid = oCtx.getProperty("ZrequestId");

				this.getRouter().navTo("view2", {
					//		ZrequestId: "0000000041" 
					ZrequestId: oCtx.getProperty("ZrequestId")
				});
			},

			//	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			// oRouter.navTo("view2", {
			//		ZrequestId: r
			//	});

			//	},

			_showObject: function(oItem) {
				this.getRouter().navTo("change", {
					objectId: oItem.getBindingContext().getProperty("ZrequestId")

				});
			},

			getRouter: function() {
				return sap.ui.core.UIComponent.getRouterFor(this);
			}

	

		});
	});