/*jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("ZLEAVE_REQ_CREATE.utils.Formatters");
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
sap.ca.scfld.md.controller.BaseFullscreenController.extend("ZLEAVE_REQ_CREATE.view.View1", {
	extHookChangeFooterButtons: null,
	extHookRouteMatchedHome: null,
	extHookRouteMatchedChange: null,
	extHookClearData: null,
	extHookInitCalendar: null,
	extHookTapOnDate: null,
	extHookSetHighlightedDays: null,
	extHookDeviceDependantLayout: null,
	extHookSubmit: null,
	extHookOnSubmitLRCfail: null,
	extHookOnSubmitLRCsuccess: null,
	extHookCallDialog: null,*/

// SE
/*sap.ui.define([
	"sap/ui/core/mvc/Controller"

], function(Controller) {
	"use strict";*/

//SE	

	sap.ui.define([
	"ZLEAVE_REQ_CREATE/controller/BaseController" , "sap/ui/model/json/JSONModel",
		'sap/ui/unified/CalendarLegendItem',
		'sap/ui/unified/DateTypeRange'
	],
	function(BaseController, JSONModel, CalendarLegendItem, DateTypeRange) {
	"use strict";
	
	
		
//	jQuery.sap.require("ZLEAVE_REQ_CREATE.utils.Formatters");
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


  
	return BaseController.extend("ZLEAVE_REQ_CREATE.controller.View1", {

//SE START CUSTOM CALENDAR
oFormatYyyymmdd: null,

//	oModel: null,
//SE END CUSTOM CALENDAR		
		
		onInit: function() {
			//SE			ZLEAVE_REQ_CREATE.utils.DataManager.init(this.oDataModel, this.resourceBundle);
		//	ZLEAVE_REQ_CREATE.utils.Formatters.init(this.resourceBundle);
		//	ZLEAVE_REQ_CREATE.utils.CalendarTools.init(this.resourceBundle);
		//	this.oRouter.attachRouteMatched(this._handleRouteMatched, this);
		//	sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit.call(this);
		//this.oApplication = this.oApplicationFacade.oApplicationImplementation;
		//this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		//this.oDataModel = this.oApplicationFacade.getODataModel();
		//ZLEAVE_REQ_CREATE.utils.DataManager.init(this.oDataModel, this.resourceBundle);
//		ZLEAVE_REQ_CREATE.utils.Formatters.init(this.resourceBundle);
	    //ZLEAVE_REQ_CREATE.utils.CalendarTools.init(this.resourceBundle);
		//this.oDataModel = ZLEAVE_REQ_CREATE.utils.DataManager.getBaseODataModel();
		
		
				
		//this.oRouter.attachRouteMatched(this._handleRouteMatched, this);
		//this._buildHeaderFooter();
		this._initCntrls();
	    // sap.ui.getCore().getEventBus().subscribe("ZLEAVE_REQ_CREATE.LeaveCollection", "refresh", this._onLeaveCollRefresh, this);
		

		this.oFormatYyyymmdd = sap.ui.core.format.DateFormat.getInstance({pattern: "yyyyMMdd", calendarType: sap.ui.core.CalendarType.Gregorian});

	//		this.oModel = new JSONModel({selectedDates:[]});
	//		this.getView().setModel(this.oModel);
			

			
			var oRouter = this.getRouter();
			oRouter.getRoute("view1").attachMatched(this._onRouteMatched, this);
			

	

		},
		

		
		
			_onRouteMatched: function(oEvent) {
				
			var		oView = this.getView();
				
				oView.bindElement({
					path: "/LeaveRequestPosSet",
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
			
			onAfterRendering: function(oEvent) {


			},
			
			
			onUpdateFinished: function(oEvent) {

			
			},
		
		
				_onBindingChange: function() {
			

			 var oView = this.getView();
			 var oModel = this.getView().getModel();
                      sap.ui.getCore().setModel(oModel);
                      
				//ripulisco i campi		
				oView.byId("LRS4_DAT_CALENDAR").removeAllSelectedDates();
				oView.byId("LRS4_DAT_CALENDAR").removeAllSpecialDates();
				
					var oCal1 = oView.byId("LRS4_DAT_CALENDAR");
						var oLeg1 = oView.byId("legend1");
							oLeg1.destroyItems();

				oView.byId("LRS4_DAT_STARTTIME").setValue("");
				oView.byId("LRS4_DAT_STARTTIME").rerender();
				oView.byId("LRS4_DAT_STARTTIME").setEnabled(true);

				oView.byId("LRS4_DAT_ENDTIME").setValue("");
				oView.byId("LRS4_DAT_ENDTIME").rerender();
				oView.byId("LRS4_DAT_ENDTIME").setEnabled(true);

				oView.byId("LRS4_TXA_NOTE").setValue("");
				oView.byId("LRS4_TXA_NOTE").rerender();
				oView.byId("LRS4_TXA_NOTE").setEnabled(true);

				var sRead = "/LeaveRequestPosSet";

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

						if ( oData.results[i].ZabsType == "0001") {		
								
									oCal1.addSpecialDate(new DateTypeRange({
									startDate : oFormatYYyyymmdd.parse(res),
									type : "Type01",
									tooltip : "Permesso"
						
									
									}));
						}
						
							if ( oData.results[i].ZabsType == "0002") {		
								
									oCal1.addSpecialDate(new DateTypeRange({
									startDate : oFormatYYyyymmdd.parse(res),
									type : "Type05",
									tooltip : "Ferie"
						
									
									}));
						}
						
							if ( oData.results[i].ZabsType == "0003") {		
								
									oCal1.addSpecialDate(new DateTypeRange({
									startDate : oFormatYYyyymmdd.parse(res),
									type : "Type09",
									tooltip : "Recupero"
						
									
									}));
						}

                          // aggiungere date selezionate quando si è in modifica
								/*oCal1.addSelectedDate(new DateTypeRange({
									startDate: oFormatYYyyymmdd.parse(res)

								}));*/

							}
							
						oLeg1.addItem(new CalendarLegendItem({
						text : "Permesso",
						id : "leg1",
						type : "Type01"
						
					}));
					
						oLeg1.addItem(new CalendarLegendItem({
						text : "Ferie",
						id : "leg2",
						type : "Type05"
					}));
					
						oLeg1.addItem(new CalendarLegendItem({
						text : "Recupero",
						id : "leg3",
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

				function fnReadE(oError) {
					console.log(oError);

					alert("Error in read: " + oError.message);
				}

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
			var oDataSel = {selectedDates:[]};
			if (aSelectedDates.length > 0 ) {
				for (var i = 0; i < aSelectedDates.length; i++){
					oDate = aSelectedDates[i].getStartDate();
					oDataSel.selectedDates.push({Date:this.oFormatYyyymmdd.format(oDate)});
				}
			//	this.oModel.setData(oData);
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


	//Show confirmation dialog
			showDialog: function (oEvent) {
				
				var aSelectedDates = this.cale.getSelectedDates();
				
				if (aSelectedDates.length == 0 ) {
				
				
					jQuery.sap.require("sap.m.MessageBox");
					            sap.m.MessageBox.show(
							      "Selezionare almeno un giorno!", {
							          icon: sap.m.MessageBox.Icon.WARNING,
							          title: "Error",
							          actions: [sap.m.MessageBox.Action.CLOSE]
							          
							      });
				}
				else  {
							      
						var that = this;
						this.sButtonKey= oEvent.getSource().getId();//mi salvo il valore chiave del bottone per la gestione dei conflitti in actionTask
						if (!that.Dialog) {
						
			               that.Dialog = sap.ui.xmlfragment("ZLEAVE_REQ_CREATE.view.Dialog", this, "ZLEAVE_REQ_CREATE.controller.View1");
							//to get access to the global model
							this.getView().addDependent(that.Dialog);
							if(sap.ui.Device.system.phone){
								that.Dialog.setStretch(true);
							}
						}
						if(sap.ui.Device.system.phone){
								that.Dialog.setStretch(true);
							}
			        that.Dialog.open();
        
				}
		},
		
		//Close Dialog
		closeDialog: function(){
		 this.Dialog.close();
		 this.sButtonKey=undefined; //per controllare i conflitti in actionTask N.B.
		},


	onDisplayNotFound : function (oEvent) {
			//display the "notFound" target without changing the hash
			this.getRouter().getTargets().display("notFound", {
				fromTarget : "view1"
			});
		},
/////////////////////////////////////////////////////////////////////  
		actionTask: function(oEvent) 
	{
		
		// richiamare handleAbsTypeSelect
		
		var sButtonId;
		var oView, oViewW;
		var sTypeAction;
		var sSelectedTaskid;
		var sZabsType; 
				 
		var sAction, sUser, sUname; //sUser e sUname rappresentano delle variabili di appoggio
	
	
			oView = this.getView();
			 var oModel = this.getView().getModel();
                      sap.ui.getCore().setModel(oModel);
                      
            //          oModel.setUseBatch(false);
			//var oObject = oView.getBindingContext().getObject();
			
		if(this.Dialog){
			this.Dialog.close();
		}
		
        
           sButtonId = this.sButtonKey;
           
           /** MP
            * La forma oView.byId(<sID statico>).getId() è importante da mantenere
            * in quanto una volta che l'applicazione è deployata ed eseguita sul server
            * il prefisso dell'id statico cambia. Referenziando il controllo con il suo 
            * id staticoutilizzando questa forma fa si che il controllo e la logica 
            * applicata ad esso o a partire da azioni su di esso non cambi in dipendenza 
            * dell'ambiente di esecuzione e del prefisso applicato. 
            * FORMA PRECEDENTE: (sButtonId == "application-zworkflow-display-component---object--btn1") 
            */ 
            
            
                         sUser  = "";
						 sAction = undefined;
						 
						 sTypeAction = undefined;
						if (sButtonId == oView.byId("btn1").getId()) {
							sAction = "OK";
							sTypeAction = "Task approved";
							sUname = undefined;
						} else if (sButtonId == oView.byId("btn2").getId()) {
							sAction = "KO";
							sTypeAction = "Task rejected";
							sUname = undefined;
						//(SE)
				    	} else if ((sButtonId == oView.byId("btn3").getId()) && (sUname != undefined))  {
						    sAction = "MOVE";
						    sTypeAction = "Task moved";
							sUser = sUname;
						}
		
					
//			var aSelectedDates = oCalendar.getSelectedDates();
            var aSelectedDates = this.cale.getSelectedDates();
			var oDate;
//			var oDataSel = {ToLeaveReqPos:[]};
//var oDataSel = [];

var oUrlParams = {
				 //ZWfTaskid : "0000025000",
				 Tmsapprover : this.slctApprover.getSelectedKey(),
				 ZabsType : this.slctLvType.getSelectedKey(),
				 ZreqStatus : "I",
                 Znote : this.note.getValue()
		
					 };
					 
	oUrlParams.ToLeaveReqPos = [];				 
			if (aSelectedDates.length > 0 ) {
				for (var i = 0; i < aSelectedDates.length; i++){
					oDate = aSelectedDates[i].getStartDate();
					oUrlParams.ToLeaveReqPos.push({ 
						Zdate:this.oFormatYyyymmdd.format(oDate), 
						Ztimestart:this.timeFrom.getValue(),
						Ztimeend:this.timeTo.getValue(), 
						Tmsapprover:this.slctApprover.getSelectedKey(),
						ZabsType:this.slctLvType.getSelectedKey(),
						ZreqStatus:"I"} );
				
				}
			//	this.oModel.setData(oData);
			} else {
			//	this._clearModel();
			}

					  
					   jQuery.sap.require("sap.ui.commons.MessageBox");
						oModel.create('/LeaveRequestSet', oUrlParams, {
							method: "POST",
						       success : fnS,
						       
						       error : fnE
						  });
					   
				//}
			//}	
				   function fnS(oData, response) {
						console.log(oData);
						console.log(response);
		
						// controllo che la funzione è andata a buon fine recuperando il risultato della function sap
					//	if (oData.Type == "S") {
						if (response.statusCode == "201") {	

						//	var msg = "Success: "+oData.Message+", "+sTypeAction;
								var msg = "Success";
		        					sap.m.MessageToast.show(msg, { duration: 5000,
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
				
	
						} else {
							
									
								jQuery.sap.require("sap.m.MessageBox");
					            sap.m.MessageBox.show(
							      "Error: "+oData.Message, {
							          icon: sap.m.MessageBox.Icon.WARNING,
							          title: "Error",
							          actions: [sap.m.MessageBox.Action.CLOSE]
							          
							      });
								  
								}

					}// END FUNCTION SUCCESS

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

		
				onHistoryPress: function() {
					
	//this.getRouter().getTargets().display("view1s");
			
					this.getRouter().navTo("view1s", {});
					
				},

		
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
			
		
		}
		
	/*	_buildHeaderFooter: function() {
			var _ = this;
			this.objHeaderFooterOptions = {
				sI18NFullscreenTitle: "",
				oEditBtn: {
					sId: "LRS4_BTN_SEND",
					sI18nBtnTxt: "LR_SEND",
					onBtnPressed: function(e) {
						_.onSendClick(e);
					}
				},
				buttonList: [{
					sId: "LRS4_BTN_CANCEL",
					sI18nBtnTxt: "LR_RESET",
					onBtnPressed: function(e) {
						_.onCancelClick(e);
					}
				}, {
					sId: "LRS4_BTN_ENTITLEMENT",
					sI18nBtnTxt: "LR_BALANCE_TILE",
					onBtnPressed: function(e) {
						_.onEntitlementClick(e);
					}
				}, {
					sId: "LRS4_BTN_HISTORY",
					sI18nBtnTxt: "LR_HISTORY_TILE",
					onBtnPressed: function(e) {
						_.onHistoryClick(e);
					}
				}]
			};
			var m = new sap.ui.core.routing.HashChanger();
			var u = m.getHash();
			this.objHeaderFooterOptions.bSuppressBookmarkButton = true;
			if (u.indexOf("Shell-runStandaloneApp") >= 0) {
				this.objHeaderFooterOptions.bSuppressBookmarkButton = true;
			}
			if (this.extHookChangeFooterButtons) {
				this.objHeaderFooterOptions = this.extHookChangeFooterButtons(this.objHeaderFooterOptions);
			}
		},*/
		
		
	/*	_handleRouteMatched: function(a) {
			var _ = this;
			this.withdrawMode = false;
			this.changeMode = false;
			if (a.getParameter("name") === "home") {
				ZLEAVE_REQ_CREATE.utils.DataManager.init(this.oDataModel, this.resourceBundle);
				this.objHeaderFooterOptions.sI18NFullscreenTitle = "LR_CREATE_LEAVE_TILE";
				this.setHeaderFooterOptions(this.objHeaderFooterOptions);
				ZLEAVE_REQ_CREATE.utils.UIHelper.setControllerInstance(this);
				this.oChangeModeData = {};
				this.changeMode = false;
				this.withdrawMode = false;
				this.byId("fileupload").setVisible(false);
				this._clearData();
				ZLEAVE_REQ_CREATE.utils.CalendarTools.clearCache();
				var c = sap.ui.core.Component.getOwnerIdFor(this.getView());
				var s = sap.ui.component(c).getComponentData().startupParameters;
				var p;
				if (s && s.pernr) {
					p = s.pernr[0];
					ZLEAVE_REQ_CREATE.utils.UIHelper.setPernr(p);
				} else {
					p = ZLEAVE_REQ_CREATE.utils.UIHelper.getPernr();
				}
				if (p) {
					_.initializeView();
				} else {
					ZLEAVE_REQ_CREATE.utils.ConcurrentEmployment.getCEEnablement(this, function() {
						_.initializeView();
					});
				}
				if (_.cale && _.cale.getSelectedDates().length === 0) {
					_.setBtnEnabled("LRS4_BTN_SEND", false);
				} else {
					_.setBtnEnabled("LRS4_BTN_SEND", true);
				}
				if (this.extHookRouteMatchedHome) {
					this.extHookRouteMatchedHome();
				}
			} else if (a.getParameter("name") === "change" || a.getParameter("name") === "withdraw") {
				ZLEAVE_REQ_CREATE.utils.DataManager.init(this.oDataModel, this.resourceBundle);
				if (a.getParameter("name") === "withdraw") {
					this.objHeaderFooterOptions.sI18NFullscreenTitle = "LR_TITLE_WITHDRAW_VIEW";
					this.withdrawMode = true;
				} else {
					this.objHeaderFooterOptions.sI18NFullscreenTitle = "LR_TITLE_CHANGE_VIEW";
					this.changeMode = true;
				}
				this.setHeaderFooterOptions(this.objHeaderFooterOptions);
				ZLEAVE_REQ_CREATE.utils.UIHelper.setControllerInstance(this);
				this.oChangeModeData = {};
				this._clearData();
				var b = a.getParameters().arguments.requestID;
				var d = null,
					i;
				var f = ZLEAVE_REQ_CREATE.utils.DataManager.getCachedModelObjProp("ConsolidatedLeaveRequests");
				if (f) {
					for (i = 0; i < f.length; i++) {
						if (f[i].RequestID == b) {
							d = f[i];
						}
					}
					if (d == null) {
						for (i = 0; i < f.length; i++) {
							if (f[i].LeaveKey == b) {
								d = f[i];
							}
						}
					}
				}
				if (!d) {
					jQuery.sap.log.warning("curntLeaveRequest is null", "_handleRouteMatched", "ZLEAVE_REQ_CREATE.view.S1");
					this.oRouter.navTo("home", {}, true);
				} else {
					var g = ZLEAVE_REQ_CREATE.utils.Formatters.getDate(d.StartDate);
					var h = ZLEAVE_REQ_CREATE.utils.Formatters.getDate(d.EndDate);
					g = new Date(g.getUTCFullYear(), g.getUTCMonth(), g.getUTCDate(), 0, 0, 0);
					h = new Date(h.getUTCFullYear(), h.getUTCMonth(), h.getUTCDate(), 0, 0, 0);
					_.oChangeModeData.requestId = d.RequestID;
					_.oChangeModeData.leaveTypeCode = d.AbsenceTypeCode;
					_.oChangeModeData.startDate = g.toString();
					_.oChangeModeData.endDate = h.toString();
					_.oChangeModeData.requestID = d.RequestID;
					_.oChangeModeData.noteTxt = d.Notes;
					_.oChangeModeData.startTime = d.StartTime;
					_.oChangeModeData.endTime = d.EndTime;
					_.oChangeModeData.employeeID = d.EmployeeID;
					_.oChangeModeData.changeStateID = d.ChangeStateID;
					_.oChangeModeData.leaveKey = d.LeaveKey;
					_.oChangeModeData.evtType = _._getCaleEvtTypeForStatus(d.StatusCode);
					_.oChangeModeData.StatusCode = d.StatusCode;
					_.oChangeModeData.ApproverEmployeeID = d.ApproverEmployeeID;
					_.oChangeModeData.ApproverEmployeeName = d.ApproverEmployeeName;
					_.oChangeModeData.WorkingHoursDuration = d.WorkingHoursDuration;
					_.oChangeModeData.AttachmentDetails = d.AttachmentDetails;
					try {
						_.oChangeModeData.AdditionalFields = d.AdditionalFields;
						_.oChangeModeData.MultipleApprovers = d.MultipleApprovers;
					} catch (e) {
						jQuery.sap.log.warning("falied to copy additional fields" + e, "_handleRouteMatched", "ZLEAVE_REQ_CREATE.view.S1");
					}
					if (!ZLEAVE_REQ_CREATE.utils.DataManager.getCachedModelObjProp("DefaultConfiguration")) {
						_.initializeView(_.oChangeModeData.leaveTypeCode);
					} else {
						_._setUpLeaveTypeData(_.oChangeModeData.leaveTypeCode);
					}
					var j = $.when(ZLEAVE_REQ_CREATE.utils.DataManager.getAbsenceTypeCollection());
					j.done(function(m) {
						_.leaveType = _._readWithKey(m, _.oChangeModeData.leaveTypeCode);
						_._copyChangeModeData();
					});
					if (_.cale.getSelectedDates().length > 1) {
						if (this.timeFrom) {
							this.timeFrom.setValue("");
							this.timeFrom.setEnabled(false);
						}
						if (this.timeTo) {
							this.timeTo.setValue("");
							this.timeTo.setEnabled(false);
						}
					}
					if (this.withdrawMode) {
						this.byId("SLCT_LEAVETYPE").setEnabled(false);
						this.byId("LRS4_DAT_STARTTIME").setEnabled(false);
						this.byId("LRS4_DAT_ENDTIME").setEnabled(false);
						this.byId("LRS4_ABS_HOURS").setEnabled(false);
						this.byId("fileUploader").setEnabled(false);
						var k = this.byId("fileupload").getItems();
						for (i = 0; i < k.length; i++) {
							k[i].setEnableDelete(false);
						}
					} else {
						this.byId("SLCT_LEAVETYPE").setEnabled(true);
						this.byId("LRS4_DAT_STARTTIME").setEnabled(true);
						this.byId("LRS4_DAT_ENDTIME").setEnabled(true);
						this.byId("LRS4_ABS_HOURS").setEnabled(true);
						this.byId("fileUploader").setEnabled(true);
						var l = this.byId("fileupload").getItems();
						for (i = 0; i < l.length; i++) {
							l[i].setEnableDelete(true);
						}
					}
					if (_.cale && _.cale.getSelectedDates().length === 0) {
						_.setBtnEnabled("LRS4_BTN_SEND", false);
					} else {
						_.setBtnEnabled("LRS4_BTN_SEND", true);
					}
				}
				if (this.extHookRouteMatchedChange) {
					this.extHookRouteMatchedChange();
				}
			}
		},*/
		
		
		/*_copyChangeModeData: function() {
			var _ = null;
			var a = null;
			var b = 0;
			var c = 0;
			if (this.oChangeModeData === {}) {
				return;
			}
			this.selRange.start = this.oChangeModeData.startDate;
			this.selRange.end = this.oChangeModeData.endDate;
			if (this.selRange.start === this.selRange.end) {
				this.selRange.end = null;
				if (this.cale) {
					this.cale.toggleDatesSelection([this.selRange.start], true);
				}
			} else {
				if (this.cale) {
					this.cale.toggleDatesRangeSelection(this.selRange.start, this.selRange.end, true);
				}
			}
			if (this.cale) {
				this.cale.setCurrentDate(this.selRange.start);
				this._setHighlightedDays(this.cale.getCurrentDate());
			}
			this.requestID = this.oChangeModeData.requestID;
			if (this.note) {
				if (!!this.byId("LRS4_NOTE") && this.byId("LRS4_NOTE").getContent().length > 2) this.byId("LRS4_NOTE").removeContent(1);
				if (!!this.oChangeModeData.noteTxt && this.oChangeModeData.noteTxt !== "") {
					var d = ZLEAVE_REQ_CREATE.utils.Formatters._parseNotes(this.oChangeModeData.noteTxt);
					var t = "";
					for (var i = 0; i < d.NotesCollection.length; i++) {
						t = t + d.NotesCollection[i].Author + ":" + d.NotesCollection[i].Text + "\n";
					}
					var n = new sap.m.Text({
						width: "100%",
						wrapping: true,
						layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
							weight: 8
						})
					});
					n.setText(t);
					this.byId("LRS4_NOTE").insertContent(n, 1);
				}
			}
			if (this.oChangeModeData.AttachmentDetails !== "") {
				var D = ZLEAVE_REQ_CREATE.utils.Formatters._parseAttachments(this.oChangeModeData.AttachmentDetails, this.oChangeModeData.RequestID,
					this.oDataModel);
				if (D.AttachmentsCollection.length > 0) {
					var f = new sap.ui.model.json.JSONModel(D);
					this.byId("fileupload").setModel(f, "files");
					this.byId("fileupload").setVisible(true);
					this.oChangeModeData.Attachments = [];
					for (var j = 0; j < D.AttachmentsCollection.length; j++) {
						var A = {};
						A.ArchivDocId = D.AttachmentsCollection[j].DocumentId;
						A.FileName = D.AttachmentsCollection[j].FileName;
						A.FilePath = D.AttachmentsCollection[j].FilePath;
						A.FileSize = D.AttachmentsCollection[j].FileSize;
						A.FileSizeDescr = D.AttachmentsCollection[j].FileSizeDesc;
						A.FileType = D.AttachmentsCollection[j].FileType;
						A.LeaveRequestId = this.requestID;
						A.FileUrl = D.AttachmentsCollection[j].FileUrl;
						A.AttachmentStatus = D.AttachmentsCollection[j].Status;
						A.FileSize = A.FileSize.toString();
						this.oChangeModeData.Attachments.push(A);
					}
				}
			} else {
				this.byId("fileupload").setVisible(false);
			}
			if (typeof this.oChangeModeData.startTime === "string") {
				if (this.timeFrom) {
					if (this.oChangeModeData.startTime === "000000") {
						this.timeFrom.setValue("");
					} else {
						this.timeFrom.setValue(this.oChangeModeData.startTime.substring(0, 2) + ":" + this.oChangeModeData.startTime.substring(2, 4));
					}
				}
				if (this.timeTo) {
					if (this.oChangeModeData.endTime === "000000") {
						this.timeTo.setValue("");
					} else {
						this.timeTo.setValue(this.oChangeModeData.endTime.substring(0, 2) + ":" + this.oChangeModeData.endTime.substring(2, 4));
					}
				}
			} else {
				_ = new Date(this.oChangeModeData.startTime.ms);
				b = _.getUTCHours();
				c = _.getUTCMinutes();
				b = (b < 10 ? "0" : "") + b;
				c = (c < 10 ? "0" : "") + c;
				if (this.timeFrom) {
					this.timeFrom.setValue(b + ":" + c);
				}
				a = new Date(this.oChangeModeData.endTime.ms);
				b = a.getUTCHours();
				c = a.getUTCMinutes();
				b = (b < 10 ? "0" : "") + b;
				c = (c < 10 ? "0" : "") + c;
				if (this.timeTo) {
					this.timeTo.setValue(b + ":" + c);
				}
			}
			if (this.cale & this.cale.getSelectedDates().length === 0) {
				this.setBtnEnabled("LRS4_BTN_SEND", false);
			} else {
				this.setBtnEnabled("LRS4_BTN_SEND", true);
			}
			if (this.oChangeModeData.WorkingHoursDuration) {
				this.byId("LRS4_ABS_HOURS").setValue(this.oChangeModeData.WorkingHoursDuration);
			}
			try {
				if (this.leaveType.AdditionalFields && this.leaveType.AdditionalFields.results.length > 0) {
					var C = this.byId("LRS4_FR_ADDN_FIELDS_GRID").getContent();
					for (var k = 0; k < C.length; k++) {
						if (this.leaveType.AdditionalFields.results[k].TypeKind && this.leaveType.AdditionalFields.results[k].TypeKind === "Date") {
							var I = C[k].getContent()[2];
						} else if (this.leaveType.AdditionalFields.results[k].TypeKind && this.leaveType.AdditionalFields.results[k].TypeKind === "Time") {
							var I = C[k].getContent()[3];
						} else {
							var I = C[k].getContent()[1];
						}
						var g = I.getCustomData()[0].getValue();
						if (this.leaveType.AdditionalFields.results[k].TypeKind && this.leaveType.AdditionalFields.results[k].TypeKind === "Date") {
							this.oChangeModeData.AdditionalFields[g] = ZLEAVE_REQ_CREATE.utils.Formatters.DATE_YYYYMMdd(this.oChangeModeData.AdditionalFields[
								g]);
						} else if (this.leaveType.AdditionalFields.results[k].TypeKind && this.leaveType.AdditionalFields.results[k].TypeKind === "Time") {
							var h = new Date(this.oChangeModeData.AdditionalFields[g].ms);
							b = h.getUTCHours();
							c = h.getUTCMinutes();
							b = (b < 10 ? "0" : "") + b;
							c = (c < 10 ? "0" : "") + c;
							this.oChangeModeData.AdditionalFields[g] = b + ":" + c;
						}
						I.setValue(this.oChangeModeData.AdditionalFields[g]);
					}
				}
			} catch (e) {
				jQuery.sap.log.warning("falied to copy values to additional fields" + e, "_copyChangeModeData", "ZLEAVE_REQ_CREATE.view.S1");
			}
		},*/
		
		/*_clearData: function() {
			this._clearDateSel();
			if (this._isLocalReset) {
				for (var i = 0; i < this.calSelResetData.length; i++) {
					this.cale.toggleDatesType(this.calSelResetData[i].calEvt, this.calSelResetData[i].evtType, false);
				}
				this.calSelResetData = [];
			}
			if (!this.changeMode) {
				this.oChangeModeData = {};
			}
			if (this.cale) {
				this.cale.setCurrentDate(new Date());
			}
			if (this.note) {
				this.note.setValue("");
				if (!!this.byId("LRS4_NOTE") && this.byId("LRS4_NOTE").getContent().length > 2) this.byId("LRS4_NOTE").removeContent(1);
			}
			if (this.timeFrom) {
				this.timeFrom.setValue("");
				this.timeFrom.rerender();
				this.timeFrom.setEnabled(true);
			}
			if (this.timeTo) {
				this.timeTo.setValue("");
				this.timeTo.rerender();
				this.timeTo.setEnabled(true);
			}
			if (this.byId("LRS4_ABS_HOURS")) {
				this.byId("LRS4_ABS_HOURS").setValue("");
				this.byId("LRS4_ABS_HOURS").rerender();
				this.byId("LRS4_ABS_HOURS").setEnabled(true);
			}
			if (this.byId("fileUploader")) {
				this.byId("fileUploader").setValue("");
			}
			if (this.byId("fileupload")) {
				this.byId("fileupload").setVisible(false);
			}
			this.setBtnEnabled("LRS4_BTN_SEND", false);
			if (this.byId("LRS4_LBL_TITLE")) {
				this.byId("LRS4_LBL_TITLE").setText(this.resourceBundle.getText("LR_TITLE_CREATE_VIEW"));
			}
			if (this.aLeaveTypes.length > 0 && this.changeMode === false && this._isLocalReset === true) {
				this._setUpLeaveTypeData();
			}
			this._isLocalReset = false;
			if (this.extHookClearData) {
				this.extHookClearData();
			}
		},*/
		
/*		
		_clearDateSel: function() {
			if (this.cale) {
				this.cale.unselectAllDates();
			}
			this.selRange.end = null;
			this.selRange.start = null;
			this.setBtnEnabled("LRS4_BTN_SEND", false);
		},
		_initCalendar: function() {
			if (this.cale) {
				this.cale.setSwipeToNavigate(true);
				this.cale.attachChangeCurrentDate(this._onChangeCurrentDate, this);
				this.cale.attachTapOnDate(this._onTapOnDate, this);
				this.cale.setEnableMultiselection(false);
				this.cale.setWeeksPerRow(1);
			}
			//SE
			if (this.legend) {
				this.legend.setLegendForNormal(this.resourceBundle.getText("LR_WORKINGDAY"));
				this.legend.setLegendForType00(this.resourceBundle.getText("LR_NONWORKING"));
				this.legend.setLegendForType01(this.resourceBundle.getText("LR_APPROVELEAVE"));
				this.legend.setLegendForType04(this.resourceBundle.getText("LR_APPROVEPENDING"));
				this.legend.setLegendForType06(this.resourceBundle.getText("LR_PUBLICHOLIDAY"));
				this.legend.setLegendForType07(this.resourceBundle.getText("LR_REJECTEDLEAVE"));
				this.legend.setLegendForToday(this.resourceBundle.getText("LR_DTYPE_TODAY"));
				this.legend.setLegendForSelected(this.resourceBundle.getText("LR_DTYPE_SELECTED"));
			}
			if (this.extHookInitCalendar) {
				this.extHookInitCalendar();
			}
		},
		registerForOrientationChange: function(a) {
			if (sap.ui.Device.system.tablet) {
				this.parentApp = a;
				a.attachOrientationChange(jQuery.proxy(this._onOrientationChanged, this));
			}
		},
		_onOrientationChanged: function() {
			this._leaveTypeDependantSettings(this.leaveType, false);
		},*/
		
		
	/*	_onTapOnDate: function(e) {
			var _;
			if (this.cale) {
				_ = this.cale.getSelectedDates();
			}
			if (this.leaveType.AllowedDurationMultipleDayInd === false) {} else if (this.leaveType.AllowedDurationMultipleDayInd) {
				if (_.length === 0) {
					if (this.selRange.start !== null && this.selRange.end !== null) {
						this._clearDateSel();
						if (e.getParameters().date !== "") {
							this.selRange.start = e.getParameters().date;
							if (this.cale) {
								this.cale.toggleDatesSelection([this.selRange.start], true);
							}
						}
					} else if (this.selRange.start !== null && this.selRange.end === null) {
						this._clearDateSel();
					}
				} else if (this.selRange.start === null) {
					this.selRange.start = e.getParameters().date;
				} else if (this.selRange.end === null) {
					this.selRange.end = e.getParameters().date;
					if (this.cale) {
						this.cale.toggleDatesRangeSelection(this.selRange.start, this.selRange.end, true);
					}
				} else {
					this.selRange.start = e.getParameters().date;
					this.selRange.end = null;
					if (this.cale) {
						this.cale.toggleDatesSelection([this.selRange.start], true);
					}
				}
			}
			if (this.leaveType.AllowedDurationMultipleDayInd === true && this.timeFrom && this.timeTo) {
				_ = this.cale.getSelectedDates();
				if (_.length > 1) {
					this.timeFrom.setValue("");
					this.timeTo.setValue("");
					this.byId("LRS4_ABS_HOURS").setValue("");
					this.timeFrom.setEnabled(false);
					this.timeTo.setEnabled(false);
					this.byId("LRS4_ABS_HOURS").setEnabled(false);
				} else {
					this.timeFrom.setEnabled(true);
					this.timeTo.setEnabled(true);
					this.byId("LRS4_ABS_HOURS").setEnabled(true);
				}
			} else if (this.leaveType.AllowedDurationMultipleDayInd === false) {
				_ = this.cale.getSelectedDates();
				if (_.length > 1) {
					this.timeFrom.setValue("");
					this.timeTo.setValue("");
					this.byId("LRS4_ABS_HOURS").setValue("");
					this.timeFrom.setEnabled(false);
					this.timeTo.setEnabled(false);
					this.byId("LRS4_ABS_HOURS").setEnabled(false);
				} else {
					this.timeFrom.setEnabled(true);
					this.timeTo.setEnabled(true);
					this.byId("LRS4_ABS_HOURS").setEnabled(true);
				}
			}
			
		
			//SE	
			if (this.cale && this.cale.getSelectedDates().length === 0) {
				this.setBtnEnabled("LRS4_BTN_SEND", false);
			} else {
				this.setBtnEnabled("LRS4_BTN_SEND", true);
			}
			if (this.extHookTapOnDate) {
				this.extHookTapOnDate();
			}
		},
		_setHighlightedDays: function(s) {
			var _;
			try {
				_ = sap.me.Calendar.parseDate(s);
			} catch (e) {
				_ = new Date(s);
			}
			ZLEAVE_REQ_CREATE.utils.CalendarTools.getDayLabelsForMonth(_, this._getCalLabelsOK, this._getCalLabelsError);
			if (this.extHookSetHighlightedDays) {
				this.extHookSetHighlightedDays();
			}
		},
		_getCalLabelsOK: function(c) {
			var _ = ZLEAVE_REQ_CREATE.utils.UIHelper.getControllerInstance();
			if (!!c.REJECTED && c.REJECTED.length > 0) {
				_.cale.toggleDatesType(c.REJECTED, sap.me.CalendarEventType.Type07, true);
				_.cale.toggleDatesType(c.REJECTED, sap.me.CalendarEventType.Type04, false);
				_.cale.toggleDatesType(c.REJECTED, sap.me.CalendarEventType.Type01, false);
			}
			if (!!c.SENT && c.SENT.length > 0) {
				_.cale.toggleDatesType(c.SENT, sap.me.CalendarEventType.Type07, false);
				_.cale.toggleDatesType(c.SENT, sap.me.CalendarEventType.Type04, true);
				_.cale.toggleDatesType(c.SENT, sap.me.CalendarEventType.Type01, false);
			}
			if (!!c.APPROVED && c.APPROVED.length > 0) {
				_.cale.toggleDatesType(c.APPROVED, sap.me.CalendarEventType.Type07, false);
				_.cale.toggleDatesType(c.APPROVED, sap.me.CalendarEventType.Type04, false);
				_.cale.toggleDatesType(c.APPROVED, sap.me.CalendarEventType.Type01, true);
			}
			if (!!c.POSTED && c.POSTED.length > 0) {
				_.cale.toggleDatesType(c.POSTED, sap.me.CalendarEventType.Type07, false);
				_.cale.toggleDatesType(c.POSTED, sap.me.CalendarEventType.Type04, false);
				_.cale.toggleDatesType(c.POSTED, sap.me.CalendarEventType.Type01, true);
			}
			if (!!c.WEEKEND && c.WEEKEND.length > 0) {
				_.cale.toggleDatesType(c.WEEKEND, sap.me.CalendarEventType.Type04, false);
				_.cale.toggleDatesType(c.WEEKEND, sap.me.CalendarEventType.Type01, false);
				_.cale.toggleDatesType(c.WEEKEND, sap.me.CalendarEventType.Type00, true);
			}
			if (!!c.PHOLIDAY && c.PHOLIDAY.length > 0) {
				_.cale.toggleDatesType(c.PHOLIDAY, sap.me.CalendarEventType.Type04, false);
				_.cale.toggleDatesType(c.PHOLIDAY, sap.me.CalendarEventType.Type06, true);
			}
			if (!!c.WORKDAY && c.WORKDAY.length > 0) {
				if (sap.me.CalendarEventType.Type10) {
					_.cale.toggleDatesType(c.WORKDAY, sap.me.CalendarEventType.Type10, true);
				} else {
					_.cale.toggleDatesType(c.WORKDAY, "", true);
				}
			}
		},
		_getCaleEvtTypeForStatus: function(s) {
			if (s === "WEEKEND") {
				return sap.me.CalendarEventType.Type00;
			} else if (s === "PHOLIDAY") {
				return sap.me.CalendarEventType.Type06;
			} else if (s === "SENT") {
				return sap.me.CalendarEventType.Type04;
			} else if (s === "POSTED" || s === "APPROVED") {
				return sap.me.CalendarEventType.Type01;
			} else if (s === "REJECTED") {
				return sap.me.CalendarEventType.Type07;
			} else if (s === "WORKDAY") {
				if (sap.me.CalendarEventType.Type10) return sap.me.CalendarEventType.Type10;
				else return "";
			} else {
				return "";
			}
		},
		_getCalLabelsError: function(o) {
			ZLEAVE_REQ_CREATE.utils.UIHelper.errorDialog(o);
		},
		_onChangeCurrentDate: function(e) {
			if (this.cale) {
				this._setHighlightedDays(this.cale.getCurrentDate());
			}
		},
		_getStartEndDate: function(s) {
			var _ = [];
			var a = [];
			var r = {};
			for (var i = 0; i < s.length; i++) {
				_[i] = new Date(s[i]);
			}
			if (_.length === 0) {
				r.startDate = {};
				r.endDate = {};
			} else if (_.length === 1) {
				r.startDate = _[0];
				r.endDate = _[0];
			} else {
				a = _.sort(function(d, b) {
					if (d < b) return -1;
					if (d > b) return 1;
					return 0;
				});
				r.startDate = a[0];
				r.endDate = a[a.length - 1];
			}
			return r;
		},
		_getLeaveTypesFromModel: function() {
			var _ = new Array();
			for (var x in this.oDataModel.oData) {
				if (x.substring(0, 21) === "AbsenceTypeCollection") {
					if (this.oDataModel.oData[x] instanceof Array) {
						for (var i = 0; i < this.oDataModel.oData[x].length; i++) {
							_.push(this.oDataModel.oData[x][i]);
						}
					} else {
						_.push(this.oDataModel.oData[x]);
					}
				}
			}
			return _;
		},
		_setUpLeaveTypeData: function(a) {
			if (!a) {
				this.leaveType = this._getDefaultAbsenceType(this.aLeaveTypes);
				a = this.leaveType.AbsenceTypeCode;
			} else {
				this.leaveType = this._readWithKey(this.aLeaveTypes, a);
			}
			if (this.slctLvType) {
				this.slctLvType.setSelectedKey(a);
			}
			this._leaveTypeDependantSettings(this.leaveType, false);
			this.getBalancesForAbsenceType(a);
			this.selectorInititDone = true;
			if (this.leaveType.AllowedDurationMultipleDayInd === false && this.cale.getSelectedDates().length > 1) {
				this._clearDateSel();
			}
		},
		_setUpLeaveTypeDataNoInit: function(a) {
			this.leaveType.ApproverName = this.sApproverPernr;
			this.leaveType.ApproverPernr = this.sApprover;
			this.getBalancesForAbsenceType(a);
			this.selectorInititDone = true;
		},
		_setUpLeaveTypeAfterChangedSelection: function(a) {
			this.leaveType.ApproverName = this.sApproverPernr;
			this.leaveType.ApproverPernr = this.sApprover;
			this.leaveType = this._readWithKey(this.aLeaveTypes, a);
			if (this.slctLvType) {
				this.slctLvType.setSelectedKey(a);
			}
			this._leaveTypeDependantSettings(this.leaveType, true);
			this.getBalancesForAbsenceType(a);
			this.selectorInititDone = true;
		},
		_readWithKey: function(l, k) {
			var d;
			for (var i = 0; i < l.length; i++) {
				if (l[i].AbsenceTypeCode === k) {
					d = l[i];
					return d;
				}
			}
			if (l.length > 1) {
				return l[0];
			}
		},
		_getDefaultAbsenceType: function(l) {
			var d;
			for (var i = 0; i < l.length; i++) {
				if (l[i].DefaultType === true) {
					d = l[i];
					return d;
				}
			}
			if (!d) {
				ZLEAVE_REQ_CREATE.utils.UIHelper.errorDialog(this.resourceBundle.getText("LR_DD_GENERIC_ERR"));
				jQuery.sap.log.warning("couldn't find defaultLeaveType", "_getDefaultAbsenceType", "ZLEAVE_REQ_CREATE.view.S1");
			}
			if (l.length > 1) {
				return l[0];
			}
		},
		_getBalancesBusyOn: function() {
			this.bookedVacation.setVisible(false);
			this.byId("LRS1_BUSY_BOOKEDDAYS").setVisible(true);
			this.remainingVacation.setVisible(false);
			this.byId("LRS1_BUSY_REMAININGDAYS").setVisible(true);
		},
		_getBalancesBusyOff: function() {
			this.bookedVacation.setVisible(true);
			this.byId("LRS1_BUSY_BOOKEDDAYS").setVisible(false);
			this.remainingVacation.setVisible(true);
			this.byId("LRS1_BUSY_REMAININGDAYS").setVisible(false);
		},
		_leaveTypeDependantSettings: function(l, I) {
			var c = ZLEAVE_REQ_CREATE.utils.DataManager.getCachedModelObjProp("DefaultConfigurations");
			var C;
			if (l && l.AllowedDurationPartialDayInd) {
				if (this.timeInputElem && this.byId("LRS4_FELEM_ABSENCE") && c) {
					this.timeInputElem.setVisible(c.RecordInClockTimesAllowedInd);
					this.byId("LRS4_FELEM_ABSENCE").setVisible(c.RecordInClockHoursAllowedInd);
				}
			} else {
				if (this.timeInputElem && this.byId("LRS4_FELEM_ABSENCE")) {
					this.timeInputElem.setVisible(false);
					this.byId("LRS4_FELEM_ABSENCE").setVisible(false);
				}
			}
			if (l) {
				var a;
				var b;
				if (!I) {
					this.byId("LR_FELEM_APPROVER").setVisible(l.ApproverVisibleInd);
					this.byId("LRS4_APPROVER_NAME").setEnabled(!l.ApproverReadOnlyInd);
					this.byId("LRS4_APPROVER_NAME").setShowSuggestion(!l.ApproverReadOnlyInd);
					if (this.changeMode && this.oChangeModeData.ApproverEmployeeID && this.oChangeModeData.ApproverEmployeeID !== "00000000") {
						C = new sap.ui.core.CustomData({
							"key": "ApproverEmployeeID",
							"value": this.oChangeModeData.ApproverEmployeeID
						});
						this.byId("LRS4_APPROVER_NAME").setValue(this.oChangeModeData.ApproverEmployeeName);
					} else {
						a = l.ApproverPernr !== "" ? l.ApproverPernr : c.DefaultApproverEmployeeName;
						b = l.ApproverName !== "" ? l.ApproverName : c.DefaultApproverEmployeeID;
						C = new sap.ui.core.CustomData({
							"key": "ApproverEmployeeID",
							"value": b
						});
						this.byId("LRS4_APPROVER_NAME").setValue(a);
					}
				} else {
					this.byId("LR_FELEM_APPROVER").setVisible(l.ApproverVisibleInd);
					this.byId("LRS4_APPROVER_NAME").setEnabled(!l.ApproverReadOnlyInd);
					a = l.ApproverPernr = this.byId("LRS4_APPROVER_NAME").getValue();
					b = l.ApproverName;
				}
				this.byId("LRS4_APPROVER_NAME").removeAllCustomData();
				this.byId("LRS4_APPROVER_NAME").addCustomData(C);
				this.byId("LRS4_FELEM_NOTE").setVisible(l.NoteVisibleInd);
				this.byId("LRS4_FELEM_FILEATTACHMENTS").setVisible(l.AttachmentEnabled);
				this.timeFrom.setValue("");
				this.timeTo.setValue("");
				this.byId("LRS4_ABS_HOURS").setValue("");
				this.note.setValue("");
				this.byId("fileUploader").setValue("");
				this.byId("fileUploader").setFileType(this.leaveType.AttachSupportFileType);
				this.byId("fileUploader").setMaximumFileSize(this.leaveType.AttachMaxSize / 1048576);
			}
			var A = new sap.ui.model.json.JSONModel();
			var g = this.byId("LRS4_FR_ADDN_FIELDS_GRID");
			g.destroyContent();
			if (l.AddFieldProp) {
				var d = JSON.parse(l.AddFieldProp);
				for (var i = 0; i < d.length; i++) {
					for (var j = 0; j < l.AdditionalFields.results.length;) {
						if (d[i].NAME === l.AdditionalFields.results[j].Fieldname) {
							if (d[i].LENGTH === "") {
								d[i].LENGTH = 0;
							}
							l.AdditionalFields.results[j].Type_Kind = d[i].TYPE_KIND;
							switch (d[i].TYPE_KIND) {
								case 'D':
									l.AdditionalFields.results[j].TypeKind = "Text";
									l.AdditionalFields.results[j].Length = 0;
									l.AdditionalFields.results[j].DateVisible = true;
									l.AdditionalFields.results[j].InputVisible = false;
									l.AdditionalFields.results[j].TimeVisible = false;
									break;
								case 'N':
									l.AdditionalFields.results[j].TypeKind = "Number";
									l.AdditionalFields.results[j].Length = parseInt(d[i].LENGTH);
									l.AdditionalFields.results[j].InputVisible = true;
									l.AdditionalFields.results[j].DateVisible = false;
									l.AdditionalFields.results[j].TimeVisible = false;
									break;
								case 'C':
									l.AdditionalFields.results[j].TypeKind = "Text";
									l.AdditionalFields.results[j].Length = parseInt(d[i].LENGTH);
									l.AdditionalFields.results[j].InputVisible = true;
									l.AdditionalFields.results[j].DateVisible = false;
									l.AdditionalFields.results[j].TimeVisible = false;
									break;
								case 'P':
									l.AdditionalFields.results[j].TypeKind = "Number";
									l.AdditionalFields.results[j].Length = parseInt(d[i].LENGTH);
									l.AdditionalFields.results[j].TimeVisible = false;
									l.AdditionalFields.results[j].DateVisible = false;
									l.AdditionalFields.results[j].InputVisible = true;
									break;
								case 'T':
									l.AdditionalFields.results[j].TypeKind = "Text";
									l.AdditionalFields.results[j].Length = 0;
									l.AdditionalFields.results[j].TimeVisible = true;
									l.AdditionalFields.results[j].DateVisible = false;
									l.AdditionalFields.results[j].InputVisible = false;
									break;
								default:
									l.AdditionalFields.results[j].TypeKind = "Text";
									l.AdditionalFields.results[j].Length = parseInt(d[i].LENGTH);
									l.AdditionalFields.results[j].InputVisible = true;
									l.AdditionalFields.results[j].DateVisible = false;
									l.AdditionalFields.results[j].TimeVisible = false;
							}
							l.AdditionalFields.results[j].Decimals = d[i].DECIMALS;
							if (d[i].HAS_F4 === "X") {
								l.AdditionalFields.results[j].HasF4 = true;
							} else {
								l.AdditionalFields.results[j].HasF4 = false;
							}
							if (this.withdrawMode) {
								l.AdditionalFields.results[j].enabled = false;
							} else if (this.changeMode) {
								l.AdditionalFields.results[j].enabled = true;
							}
							break;
						} else {
							j++;
						}
					}
				}
			}
			if (l.AdditionalFields && l.AdditionalFields.results.length > 0) {
				A.setData(l.AdditionalFields.results);
				g.setModel(A);
				if (l.AddFieldProp) {
					var v = new sap.ui.layout.VerticalLayout({
						width: "100%",
						content: [new sap.m.Label({
							width: "100%",
							text: "{FieldLabel}",
							layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
								linebreak: true,
								baseSize: "100%"
							}),
							required: "{path:'Required',formatter:'ZLEAVE_REQ_CREATE.utils.Formatters.isRequired'}"
						}), new sap.m.Input({
							type: "{TypeKind}",
							showValueHelp: "{HasF4}",
							enabled: "{enabled}",
							valueHelpRequest: this._addValueHelp,
							width: "100%",
							maxLength: "{Length}",
							visible: "{InputVisible}",
							layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
								linebreak: true,
								baseSize: "100%"
							}),
							customData: new sap.ui.core.CustomData({
								"key": "FieldName",
								"value": "{Fieldname}"
							})
						}), new sap.m.DatePicker({
							width: "100%",
							visible: "{DateVisible}",
							valueFormat: "yyyy-MM-dd",
							enabled: "{enabled}",
							layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
								linebreak: true,
								baseSize: "100%"
							}),
							customData: new sap.ui.core.CustomData({
								"key": "FieldName",
								"value": "{Fieldname}"
							})
						}), new sap.m.DateTimeInput({
							type: "Time",
							width: "100%",
							visible: "{TimeVisible}",
							enabled: "{enabled}",
							layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
								linebreak: true,
								baseSize: "100%"
							}),
							customData: new sap.ui.core.CustomData({
								"key": "FieldName",
								"value": "{Fieldname}"
							})
						})]
					});
				} else {
					var v = new sap.ui.layout.VerticalLayout({
						width: "100%",
						content: [new sap.m.Label({
							width: "100%",
							text: "{FieldLabel}",
							layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
								linebreak: true,
								baseSize: "100%"
							}),
							required: "{path:'Required',formatter:'ZLEAVE_REQ_CREATE.utils.Formatters.isRequired'}"
						}), new sap.m.Input({
							width: "100%",
							layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
								linebreak: true,
								baseSize: "100%"
							}),
							customData: new sap.ui.core.CustomData({
								"key": "FieldName",
								"value": "{Fieldname}"
							})
						})]
					});
				}
				g.bindAggregation("content", "/", v);
			} else {
				g.removeAllContent();
				g.destroyContent();
			}
			try {
				this.byId("LRS4_FR_MUL_APP_GRID").removeAllContent();
				if (l.MultipleApproverFlag === false) {
					if (l.AddDelApprovers && (this.byId("LR_APPROVER").getContent()[1].getItems()).length < 2) {
						var B = new sap.m.Button({
							icon: "sap-icon://add",
							width: "38px",
							customData: new sap.ui.core.CustomData({
								"key": "Level",
								"value": 1
							}),
							enabled: l.AddDelApprovers,
							press: this.handleAdd,
							layoutData: new sap.m.FlexItemData({
								growFactor: 1
							})
						});
						this.byId("LR_APPROVER").getContent()[1].insertItem(B, 1);
						this.byId("LR_APPROVER").getContent()[1].rerender();
					}
					this.byId("LRS4_FR_MUL_APP_GRID").removeAllContent();
					var L = 2,
						j;
					if (this.changeMode) {
						if (this.oChangeModeData.MultipleApprovers.results.length > 0) {
							for (j = 1; this.oChangeModeData.MultipleApprovers.results && j < this.oChangeModeData.MultipleApprovers.results.length; j++) {
								this._addContentToGrid(L++, this.oChangeModeData.MultipleApprovers.results[j], !l.ApproverReadOnlyInd);
							}
							b = this.oChangeModeData.MultipleApprovers.results[0].Pernr;
							a = this.oChangeModeData.MultipleApprovers.results[0].Name;
							C = new sap.ui.core.CustomData({
								"key": "ApproverEmployeeID",
								"value": b
							});
							this.byId("LRS4_APPROVER_NAME").setValue(a);
							this.byId("LRS4_APPROVER_NAME").removeAllCustomData();
							this.byId("LRS4_APPROVER_NAME").addCustomData(C);
						} else if (l.MultipleApprovers.results.length > 0) {
							for (j = 1; l.MultipleApprovers && j < l.MultipleApprovers.results.length; j++) {
								this._addContentToGrid(L++, l.MultipleApprovers.results[j], !l.ApproverReadOnlyInd);
							}
							b = l.MultipleApprovers.results[0].Pernr;
							a = l.MultipleApprovers.results[0].Name;
							C = new sap.ui.core.CustomData({
								"key": "ApproverEmployeeID",
								"value": b
							});
							this.byId("LRS4_APPROVER_NAME").setValue(a);
							this.byId("LRS4_APPROVER_NAME").removeAllCustomData();
							this.byId("LRS4_APPROVER_NAME").addCustomData(C);
						} else {
							this.byId("LRS4_FR_MUL_APP_GRID").removeAllContent();
						}
					} else {
						if (l.MultipleApprovers.results.length > 0) {
							for (j = 1; l.MultipleApprovers && j < l.MultipleApprovers.results.length; j++) {
								this._addContentToGrid(L++, l.MultipleApprovers.results[j], !l.ApproverReadOnlyInd);
							}
							b = l.MultipleApprovers.results[0].Pernr;
							a = l.MultipleApprovers.results[0].Name;
							C = new sap.ui.core.CustomData({
								"key": "ApproverEmployeeID",
								"value": b
							});
							this.byId("LRS4_APPROVER_NAME").setValue(a);
							this.byId("LRS4_APPROVER_NAME").removeAllCustomData();
							this.byId("LRS4_APPROVER_NAME").addCustomData(C);
						} else {
							this.byId("LRS4_FR_MUL_APP_GRID").removeAllContent();
						}
					}
				}
			} catch (e) {
				jQuery.sap.log.warning("falied to process Multiple Approvers" + e.message, "_leaveTypeDependantSettings",
					"ZLEAVE_REQ_CREATE.view.S1");
			}
		},
		_orientationDependancies: function(c) {
			try {
				if (sap.ui.Device.system.phone === true) {
					if (this.cale) {
						this.cale.setMonthsToDisplay(1);
						this.cale.setMonthsPerRow(1);
					}
				} else {
					if (c === "portrait") {
						if (this.byId("LRS4_FRM_CNT_CALENDAR") && this.byId("LRS4_FRM_CNT_CALENDAR").getLayoutData()) {
							this.byId("LRS4_FRM_CNT_CALENDAR").getLayoutData().setWeight(5);
						}
						if (this.cale) {
							this.cale.setMonthsToDisplay(1);
							this.cale.setMonthsPerRow(1);
						}
						if (this.formContainer && this.formContainer.getLayoutData()) {
							this.formContainer.getLayoutData().setWeight(5);
						}
					} else if (c === "landscape" && this.byId("LRS4_FRM_CNT_CALENDAR").getLayoutData()) {
						if (this.byId("LRS4_FRM_CNT_CALENDAR")) {
							this.byId("LRS4_FRM_CNT_CALENDAR").getLayoutData().setWeight(6);
						}
						if (this.cale) {
							this.cale.setMonthsToDisplay(2);
							this.cale.setMonthsPerRow(2);
						}
						if (this.formContainer && this.formContainer.getLayoutData()) {
							this.formContainer.getLayoutData().setWeight(3);
						}
					}
				}
			} catch (e) {
				jQuery.sap.log.warning("Unable to set the orientation Dependancies:" + e.message, [], [
					"ZLEAVE_REQ_CREATE.view.S1.controller._orientationDependancies"
				]);
			}
		},
		_deviceDependantLayout: function() {
			try {
				if (sap.ui.Device.system.phone) {
					if (this.byId("LRS4_LEGEND")) {
						this.byId("LRS4_LEGEND").setExpandable(true);
						this.byId("LRS4_LEGEND").setExpanded(false);
					}
					if (this.timeInputElem) {
						this.timeInputElem.getLayoutData().setLinebreak(true);
					}
					if (this.formContainer) {
						this.formContainer.getLayoutData().setLinebreak(true);
						this.formContainer.getLayoutData().setWeight(3);
					}
				} else {
					if (this.byId("S4")) {
						this.byId("S4").setEnableScrolling(false);
					}
					if (this.byId("LRS4_FRM_CNT_CALENDAR")) {
						this.byId("LRS4_FRM_CNT_CALENDAR").getLayoutData().setWeight(6);
					}
					if (this.cale) {
						this.cale.setMonthsToDisplay(2);
						this.cale.setMonthsPerRow(2);
					}
					if (this.formContainer) {
						this.formContainer.getLayoutData().setLinebreak(false);
						this.formContainer.getLayoutData().setWeight(3);
					}
					if (this.balanceElem) {
						this.balanceElem.getLayoutData().setLinebreak(false);
					}
					if (this.timeInputElem) {
						this.timeInputElem.getLayoutData().setLinebreak(true);
						this.timeInputElem.setVisible(false);
					}
					if (this.noteElem) {
						this.noteElem.getLayoutData().setLinebreak(true);
					}
					if (this.byId("LRS4_LEGEND")) {
						this.byId("LRS4_LEGEND").setExpandable(true);
						this.byId("LRS4_LEGEND").setExpanded(true);
					}
					if (this.byId("LRS4_FRM_CNT_LEGEND")) {
						this.byId("LRS4_FRM_CNT_LEGEND").getLayoutData().setLinebreak(true);
						this.byId("LRS4_FRM_CNT_LEGEND").getLayoutData().setWeight(9);
					}
				}
				if (this.extHookDeviceDependantLayout) {
					this.extHookDeviceDependantLayout();
				}
			} catch (e) {
				jQuery.sap.log.warning("Unable to set the device Dependancies:" + e.message, [], [
					"ZLEAVE_REQ_CREATE.view.S1.controller._deviceDependantLayout"
				]);
			}
		},
		_getDaysOfRange: function(s, e) {
			var _ = null;
			var a = null;
			var d = [];
			if (s instanceof Date) {
				_ = new Date(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate());
			} else if (typeof s === "string") {
				_ = new Date(s);
			}
			if (e instanceof Date) {
				a = new Date(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate());
			} else if (typeof e === "string") {
				a = new Date(e);
			}
			if (a === null) {
				_ = new Date(_);
				return [_.toDateString()];
			} else {
				while (_ <= a) {
					d.push(_.toDateString());
					_.setTime(_.getTime() + 86400000);
				}
				return d;
			}
		},
		onSend: function() {
			this.submit(true);
		},
		submit: function(i) {
			var s, S, E, a;
			this.bApproverOK = null;
			this.bSubmitOK = null;
			this.oSubmitResult = {};
			this.bSimulation = i;
			if (this.cale) {
				if (this.withdrawMode) {
					s = this.oChangeModeData.startDate;
					E = this.oChangeModeData.endDate;
					s = ZLEAVE_REQ_CREATE.utils.Formatters.DATE_YYYYMMdd(s) + 'T00:00:00';
					E = ZLEAVE_REQ_CREATE.utils.Formatters.DATE_YYYYMMdd(E) + 'T00:00:00';
					S = this.oChangeModeData.startTime;
					a = this.oChangeModeData.endTime;
				} else {
					var _ = this._getStartEndDate(this.cale.getSelectedDates());
					if (this.timeFrom && this.timeTo && this.leaveType.AllowedDurationPartialDayInd) {
						s = ZLEAVE_REQ_CREATE.utils.Formatters.DATE_YYYYMMdd(_.startDate) + 'T00:00:00';
						if (this.timeFrom.getValue() === "") {
							S = '000000';
						} else {
							S = this.timeFrom.getValue().substring(0, 2) + this.timeFrom.getValue().substring(3, 5) + "00";
						}
						E = ZLEAVE_REQ_CREATE.utils.Formatters.DATE_YYYYMMdd(_.endDate) + 'T00:00:00';
						if (this.timeTo.getValue() === "") {
							a = '000000';
						} else {
							a = this.timeTo.getValue().substring(0, 2) + this.timeTo.getValue().substring(3, 5) + "00";
						}
					} else {
						s = ZLEAVE_REQ_CREATE.utils.Formatters.DATE_YYYYMMdd(_.startDate) + 'T00:00:00';
						S = '000000';
						E = ZLEAVE_REQ_CREATE.utils.Formatters.DATE_YYYYMMdd(_.endDate) + 'T00:00:00';
						a = '000000';
					}
				}
				this.oBusy.open();
				var n = "";
				if (this.note) {
					n = this.note.getValue();
				}
				var N = {};
				N.StartDate = s;
				N.StartTime = S;
				N.Notes = n;
				N.ProcessCheckOnlyInd = (i ? true : false);
				N.AbsenceTypeCode = this.leaveType.AbsenceTypeCode;
				N.EndDate = E;
				N.EndTime = a;
				N.InfoType = this.leaveType.InfoType;
				if (this.byId("fileUploader").getValue().length !== 0) {
					N.AttachmentsExist = "X";
				} else {
					N.AttachmentsExist = "";
				}
				if (this.byId("LRS4_ABS_HOURS").getValue()) {
					N.WorkingHoursDuration = this.byId("LRS4_ABS_HOURS").getValue();
				}
				if (this.byId("LRS4_APPROVER_NAME").getValue()) {
					N.ApproverEmployeeName = this.byId("LRS4_APPROVER_NAME").getValue();
				}
				try {
					N.ApproverEmployeeID = this.byId("LRS4_APPROVER_NAME").getCustomData()[0].getValue();
				} catch (e) {
					if (!this.sApproverPernr) {
						N.ApproverEmployeeID = "00000000";
					} else {
						N.ApproverEmployeeID = this.sApproverPernr;
					}
				}
				N.AdditionalFields = {};
				try {
					if (this.leaveType.AdditionalFields && this.leaveType.AdditionalFields.results.length > 0) {
						var c = this.byId("LRS4_FR_ADDN_FIELDS_GRID").getContent();
						for (var k = 0; k < c.length; k++) {
							if (this.leaveType.AdditionalFields.results[k].TypeKind && this.leaveType.AdditionalFields.results[k].TypeKind === "Date") {
								var I = c[k].getContent()[2];
							} else if (this.leaveType.AdditionalFields.results[k].TypeKind && this.leaveType.AdditionalFields.results[k].TypeKind ===
								"Time") {
								var I = c[k].getContent()[3];
							} else {
								var I = c[k].getContent()[1];
							}
							var f = I.getCustomData()[0].getValue();
							if (I.getValue() !== "") {
								N.AdditionalFields[f] = I.getValue();
								if (this.leaveType.AdditionalFields.results[k].TypeKind && this.leaveType.AdditionalFields.results[k].TypeKind === "Date") {
									N.AdditionalFields[f] = ZLEAVE_REQ_CREATE.utils.Formatters.DATE_YYYYMMdd(N.AdditionalFields[f]) + 'T00:00:00';
								}
								if (this.leaveType.AdditionalFields.results[k].TypeKind && this.leaveType.AdditionalFields.results[k].TypeKind === "Time") {
									N.AdditionalFields[f] = "PT" + N.AdditionalFields[f].substring(0, 2) + "H" + N.AdditionalFields[f].substring(3, 5) + "M00" +
										"S";
								}
							}
						}
					}
				} catch (e) {
					jQuery.sap.log.warning("falied to get additional fields" + e, "submit", "ZLEAVE_REQ_CREATE.view.S1");
					N.AdditionalFields = {};
				}
				try {
					N.MultipleApprovers = [];
					var g = this.byId("LRS4_FR_MUL_APP_GRID");
					var A = {
						Pernr: (N.ApproverEmployeeID).toString(),
						Name: N.ApproverEmployeeName,
						Seqnr: "1"
					};
					if (A.Pernr !== "00000000") {
						N.MultipleApprovers.push(A);
						for (var j = 0; j < g.getContent().length; j++) {
							var F = g.getContent()[j].getContent()[1];
							var o = F.getItems()[0];
							if (o.getCustomData()[0].getValue()) {
								A = {
									Pernr: (o.getCustomData()[0].getValue()).toString(),
									Name: o.getValue(),
									Seqnr: (j + 2).toString()
								};
								N.MultipleApprovers.push(A);
							}
						}
					}
				} catch (e) {
					jQuery.sap.log.warning("falied to get additional fields" + e, "submit", "ZLEAVE_REQ_CREATE.view.S1");
					delete N.MultipleApprovers;
				}
				if (this.changeMode || this.withdrawMode) {
					N.RequestID = this.oChangeModeData.requestID;
					N.EmployeeID = ZLEAVE_REQ_CREATE.utils.UIHelper.getPernr();
					N.ChangeStateID = this.oChangeModeData.changeStateID;
					if (this.changeMode) {
						N.ActionCode = 2;
					} else {
						N.ActionCode = 3;
					}
					N.LeaveKey = this.oChangeModeData.leaveKey;
					N.EmployeeID = ZLEAVE_REQ_CREATE.utils.UIHelper.getPernr();
					N.Attachments = [];
					N.Attachments = this.oChangeModeData.Attachments;
					ZLEAVE_REQ_CREATE.utils.DataManager.changeLeaveRequest(N, i, this.onSubmitLRCsuccess, this.onSubmitLRCfail, this.uploadFileAttachments);
				} else {
					N.RequestID = "";
					N.EmployeeID = ZLEAVE_REQ_CREATE.utils.UIHelper.getPernr();
					N.ActionCode = 1;
					ZLEAVE_REQ_CREATE.utils.DataManager.submitLeaveRequest(N, i, this.onSubmitLRCsuccess, this.onSubmitLRCfail, this.uploadFileAttachments);
				}
			}
			if (this.extHookSubmit) {
				this.extHookSubmit();
			}
		},
		onSubmitLRCfail: function(e) {
			var _ = ZLEAVE_REQ_CREATE.utils.UIHelper.getControllerInstance();
			_.evalSubmitResult("submitLRC", false, {});
			_.oBusy.close();
			if (this.extHookOnSubmitLRCfail) {
				e = this.extHookOnSubmitLRCfail(e);
			}
			ZLEAVE_REQ_CREATE.utils.UIHelper.errorDialog(e);
		},
		onSubmitLRCsuccess: function(r, m) {
			var _ = ZLEAVE_REQ_CREATE.utils.UIHelper.getControllerInstance();
			if (this.extHookOnSubmitLRCsuccess) {
				var a = this.extHookOnSubmitLRCsuccess(r, m);
				r = a.oResult;
				m = a.oMsgHeader;
			}
			_.oLRSuccessResult = r;
			if (_.bSimulation) {
				if (m && m.severity) {
					if (m.severity === "warning") {
						if (typeof String.prototype.trim !== "function") {
							String.prototype.trim = function() {
								return this.replace(/^\s+|\s+$/g, '');
							};
						}
						var d = "";
						m.details.forEach(function(n) {
							d += decodeURI(n.message).trim() + '\r\n';
						});
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.WARNING,
							message: decodeURI(m.message).trim(),
							details: d
						}, _._fetchApprover(r));
					} else {
						_._fetchApprover(r);
					}
				} else {
					_._fetchApprover(r);
				}
			} else {
				if (_.cale && _.changeMode) {
					var D = _._getDaysOfRange(_.oChangeModeData.startDate, _.oChangeModeData.endDate);
					_.cale.toggleDatesType(D, _.oChangeModeData.evtType, false);
					_._deleteOldDatesFromCalendarCache(D, _.oChangeModeData.StatusCode);
					var s = ZLEAVE_REQ_CREATE.utils.Formatters.getDate(_.oLRSuccessResult.StartDate);
					var b = ZLEAVE_REQ_CREATE.utils.Formatters.getDate(_.oLRSuccessResult.EndDate);
					s = new Date(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate(), 0, 0, 0);
					b = new Date(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate(), 0, 0, 0);
					_.oChangeModeData.requestId = _.oLRSuccessResult.RequestID;
					_.oChangeModeData.leaveTypeCode = _.oLRSuccessResult.AbsenceTypeCode;
					_.oChangeModeData.startDate = s.toString();
					_.oChangeModeData.endDate = b.toString();
					_.oChangeModeData.requestID = _.oLRSuccessResult.RequestID;
					_.oChangeModeData.noteTxt = _.oLRSuccessResult.Notes;
					_.oChangeModeData.startTime = _.oLRSuccessResult.StartTime;
					_.oChangeModeData.endTime = _.oLRSuccessResult.EndTime;
					_.oChangeModeData.employeeID = _.oLRSuccessResult.EmployeeID;
					_.oChangeModeData.changeStateID = _.oLRSuccessResult.ChangeStateID;
					_.oChangeModeData.leaveKey = _.oLRSuccessResult.LeaveKey;
					_.oChangeModeData.evtType = _._getCaleEvtTypeForStatus(_.oLRSuccessResult.StatusCode);
					_.oChangeModeData.StatusCode = _.oLRSuccessResult.StatusCode;
					_.oChangeModeData.ApproverEmployeeID = _.oLRSuccessResult.ApproverEmployeeID;
					_.oChangeModeData.ApproverEmployeeName = _.oLRSuccessResult.ApproverEmployeeName;
					_.oChangeModeData.WorkingHoursDuration = _.oLRSuccessResult.WorkingHoursDuration;
					_.oChangeModeData.AttachmentDetails = _.oLRSuccessResult.AttachmentDetails;
					try {
						_.oChangeModeData.AdditionalFields = _.oLRSuccessResult.AdditionalFields;
						_.oChangeModeData.MultipleApprovers = _.oLRSuccessResult.MultipleApprovers;
					} catch (e) {
						jQuery.sap.log.warning("falied to copy additional fields" + e, "onSubmitLRCsuccess", "ZLEAVE_REQ_CREATE.view.S1");
					}
				}
				if (!_.sApprover || _.sApprover === null || _.sApprover === undefined || _.leaveType.ActionApprove === 'N' || _.leaveType.ActionApprove ===
					'O') {
					sap.m.MessageToast.show(_.resourceBundle.getText("LR_SUBMITDONE_NA"), {
						width: "15em"
					});
				} else {
					sap.m.MessageToast.show(_.resourceBundle.getText("LR_SUBMITDONE", [_.sApprover]), {
						width: "15em"
					});
				}
				_._clearData();
				_._setUpLeaveTypeDataNoInit(_.slctLvType.getSelectedKey());
				_.note.setValue("");
				if (_.cale) {
					var c = _.cale.getSelectedDates();
					var f = _._getDaysOfRange(_.oLRSuccessResult.StartDate, _.oLRSuccessResult.EndDate);
					if (!f) {
						f = _._getDaysOfRange(c[0], c[c.length - 1]);
					}
					for (var i = 0; i < f.length; i++) {
						var g = new Date(f[i]);
						var h = new Date(g.getFullYear(), g.getMonth(), 1);
						var C = ZLEAVE_REQ_CREATE.utils.CalendarTools.oCache;
						if (C.hasOwnProperty(h.toString())) {
							var k = C[h];
							for (var l in k) {
								if (k.hasOwnProperty(l)) {
									if (k[l].length > 0) {
										for (var j = 0; j < k[l].length; j++) {
											if ((new Date(k[l][j])).toString() == (new Date(g)).toString()) {
												k[l].splice(j, 1);
												if (k[l].length < 1) {
													delete k[l];
												}
												break;
											}
										}
									}
								}
							}
							if (_.oLRSuccessResult.StatusCode === "APPROVED") {
								if (k.hasOwnProperty("APPROVED")) k.APPROVED.push(f[i]);
								else {
									k.APPROVED = new Array(f[i]);
								}
							} else {
								if (k.hasOwnProperty("SENT")) k.SENT.push(f[i]);
								else {
									k.SENT = new Array(f[i]);
								}
							}
						}
					}
					_.cale.toggleDatesType(f, sap.me.CalendarEventType.Type06, false);
					_.cale.toggleDatesType(f, sap.me.CalendarEventType.Type01, false);
					_.cale.toggleDatesType(f, sap.me.CalendarEventType.Type07, false);
					_.cale.toggleDatesType(f, sap.me.CalendarEventType.Type04, false);
					if (sap.me.CalendarEventType.Type10) {
						_.cale.toggleDatesType(f, sap.me.CalendarEventType.Type10, false);
					}
					if (_.oLRSuccessResult.StatusCode === "APPROVED" || _.oLRSuccessResult.StatusCode === "POSTED") {
						_.cale.toggleDatesType(f, sap.me.CalendarEventType.Type01, true);
					} else {
						_.cale.toggleDatesType(f, sap.me.CalendarEventType.Type04, true);
					}
				}
			}
			if ((_.changeMode === true && _.bSimulation === false) || (_.withdrawMode === true && _.bSimulation === false)) {
				this.onHistoryClick();
			}
			_.oBusy.close();
		},
		_fetchApprover: function(l) {
			var _ = ZLEAVE_REQ_CREATE.utils.UIHelper.getControllerInstance();
			var a = {};
			if (l.ApproverEmployeeName !== "") {
				_.slctLvType.setSelectedKey(_.leaveType.AbsenceTypeCode);
				a.sApprover = _.sApprover = l.ApproverEmployeeName;
				a.sApproverPernr = _.sApproverPernr = l.ApproverEmployeeID;
				_.evalSubmitResult("getApprover", true, a);
				_.evalSubmitResult("submitLRC", true, _.oLRSuccessResult);
			} else {
				ZLEAVE_REQ_CREATE.utils.DataManager.getApprover(function(A) {
					_.slctLvType.setSelectedKey(_.leaveType.AbsenceTypeCode);
					a.sApprover = _.sApprover = A;
					_.evalSubmitResult("getApprover", true, a);
					_.evalSubmitResult("submitLRC", true, _.oLRSuccessResult);
				}, function() {
					a.sApprover = _.resourceBundle.getText("LR_UNKNOWN");
					_.evalSubmitResult("getApprover", false, a);
				}, this);
			}
		},
		evalSubmitResult: function(c, s, r) {
			var _ = ZLEAVE_REQ_CREATE.utils.UIHelper.getControllerInstance();
			if (c === "submitLRC") {
				_.bSubmitOK = s;
				_.oSubmitResult = r;
			}
			if (c === "getApprover") {
				_.bApproverOK = s;
				_.sApprover = r.sApprover;
			}
			if (_.bSubmitOK === false) {
				_.oBusy.close();
			} else if (_.bSubmitOK === true) {
				if (_.bApproverOK === false) {
					_.oBusy.close();
					_.callDialog(_.oSubmitResult, _.sApprover);
				} else if (_.bApproverOK === true) {
					_.oBusy.close();
					_.callDialog(_.oSubmitResult, _.sApprover);
				}
			}
		},
		callDialog: function(s, a) {
			var _ = ZLEAVE_REQ_CREATE.utils.UIHelper.getControllerInstance();
			var b, c;
			if (jQuery.sap.getUriParameters().get("responderOn")) {
				if (_.selRange.start === null) {
					try {
						_.selRange.start = sap.me.Calendar.parseDate(_.cale.getSelectedDates()[0]);
					} catch (e) {
						_.selRange.start = new Date(_.cale.getSelectedDates()[0]);
					}
				}
				b = _.selRange.start;
				if (_.selRange.end === null) {
					c = _.selRange.start;
				} else {
					c = _.selRange.end;
				}
			} else {
				if (_.leaveType.AllowedDurationPartialDayInd) {
					b = ZLEAVE_REQ_CREATE.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(s.StartDate, "medium");
					c = ZLEAVE_REQ_CREATE.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(s.EndDate, "medium");
					b += " " + ZLEAVE_REQ_CREATE.utils.Formatters.TIME_hhmm(s.StartTime);
					c += " " + ZLEAVE_REQ_CREATE.utils.Formatters.TIME_hhmm(s.EndTime);
				} else {
					b = ZLEAVE_REQ_CREATE.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(s.StartDate);
					c = ZLEAVE_REQ_CREATE.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(s.EndDate);
				}
			}
			_.oConfirmationForm = new sap.ui.layout.form.Form({
				maxContainerCols: 2,
				class: "sapUiLargeMarginTopBottom",
				layout: new sap.ui.layout.form.ResponsiveGridLayout({
					labelSpanL: 3,
					labelSpanM: 4,
					labelSpanS: 3,
					columnsL: 2,
					columnsM: 2
				}),
				formContainers: new sap.ui.layout.form.FormContainer({
					formElements: [new sap.ui.layout.form.FormElement({
						label: new sap.m.Label({
							text: _.resourceBundle.getText("LR_BALANCE_DEDUCTIBLE")
						}),
						fields: new sap.m.Text({
							text: this.leaveType.AbsenceTypeName
						})
					}), new sap.ui.layout.form.FormElement({
						label: new sap.m.Label({
							text: _.resourceBundle.getText("LR_FROM")
						}),
						fields: new sap.m.Text({
							text: b
						})
					}), new sap.ui.layout.form.FormElement({
						label: new sap.m.Label({
							text: _.resourceBundle.getText("LR_TO")
						}),
						fields: new sap.m.Text({
							text: c
						})
					}), new sap.ui.layout.form.FormElement({
						label: new sap.m.Label({
							text: _.resourceBundle.getText("LR_REQUEST")
						}),
						fields: new sap.m.Text({
							text: ZLEAVE_REQ_CREATE.utils.Formatters.adjustSeparator(s.WorkingHoursDuration) + " " + _.resourceBundle.getText(
								"LR_LOWERCASE_HOURS")
						})
					}), new sap.ui.layout.form.FormElement({
						visible: Boolean(s.DeductionInfo),
						label: new sap.m.Label({
							text: _.resourceBundle.getText("LR_DEDUCTION")
						}),
						fields: new sap.m.Text({
							text: ZLEAVE_REQ_CREATE.utils.Formatters.adjustSeparator(s.TotalDeduction) + " " + _.resourceBundle.getText(s.TimeUnitTextDeduction)
						})
					})]
				})
			});
			if (this.withdrawMode) {
				_.oConfirmationDialog = new sap.m.Dialog({
					title: _.resourceBundle.getText("LR_TITLE_WITHDRAW"),
					class: "sapUiContentPadding sapUiLargeMarginTopBottom",
					content: [new sap.m.Text({
						text: this.resourceBundle.getText("LR_WITHDRAWNMSG")
					}), _.oConfirmationForm],
					buttons: [new sap.m.Button({
						text: _.resourceBundle.getText("LR_OK"),
						press: function() {
							_.oConfirmationDialog.close();
							_.submit(false);
						}
					}), new sap.m.Button({
						text: _.resourceBundle.getText("LR_CANCEL"),
						press: function() {
							_.oConfirmationDialog.close();
							_.oConfirmationDialog.Cancelled = true;
						}
					})]
				});
			} else {
				_.oConfirmationDialog = new sap.m.Dialog({
					title: _.resourceBundle.getText("LR_TITLE_SEND"),
					class: "sapUiContentPadding sapUiLargeMarginTopBottom",
					content: [new sap.m.Text({
						text: this.resourceBundle.getText("LR_CONFIRMATIONMSG", [a])
					}), _.oConfirmationForm],
					buttons: [new sap.m.Button({
						text: _.resourceBundle.getText("LR_OK"),
						press: function() {
							_.oConfirmationDialog.close();
							_.submit(false);
						}
					}), new sap.m.Button({
						text: _.resourceBundle.getText("LR_CANCEL"),
						press: function() {
							_.oConfirmationDialog.close();
							_.oConfirmationDialog.Cancelled = true;
						}
					})]
				});
			}
			if (!a || a === null || a === undefined || this.leaveType.ActionApprove === 'N' || this.leaveType.ActionApprove === 'O') {
				delete _.oConfirmationDialog.removeContent(0);
			}
			if (this.extHookCallDialog) {
				_.oConfirmationDialog = this.extHookCallDialog(_.oConfirmationDialog);
			}
			_.oConfirmationDialog.open();
		},
		
		onSelectionChange: function(e) {
			var s = e.getParameter("selectedItem");
			var a = s.getProperty("key");
			this._setUpLeaveTypeAfterChangedSelection(a);
		},
		getBalancesForAbsenceType: function(a) {
			if (!a) {
				return;
			}
			this._getBalancesBusyOn();
			var _ = this;
			var A = "";
			if (this.leaveType.AttabsInd !== undefined) {
				if (this.leaveType.InfoType == '2001') {
					A = "A";
				} else {
					A = "P";
				}
			}
			ZLEAVE_REQ_CREATE.utils.DataManager.getBalancesForAbsenceType(a, A, function(b, t, B, T, s, c, d, e) {
				_.balanceElem.setVisible(e);
				_._getBalancesBusyOff();
				if (e) {
					var j = {
						BalancePlannedQuantity: b,
						BalanceAvailableQuantity: B,
						BalanceUsedQuantity: c,
						BalanceTotalUsedQuantity: d,
						TimeUnitName: T
					};
					var m = new sap.ui.model.json.JSONModel(j);
					_.getView().setModel(m, "TimeAccount");
					m.createBindingContext("/", function(C) {
						_.getView().setBindingContext(C, "TimeAccount");
					});
				}
			}, function(e) {
				_._getBalancesBusyOff();
				ZLEAVE_REQ_CREATE.utils.UIHelper.errorDialog(e);
			}, this);
		},
		onTimeChange: function() {
			var _ = this.byId("LRS4_DAT_ENDTIME").getValue();
			var a = this.byId("LRS4_DAT_STARTTIME").getValue();
			if (this.byId("LRS4_DAT_ENDTIME") && _ === "" && a !== "") {
				this.byId("LRS4_DAT_ENDTIME").setValue(a);
			}
			if (this.byId("LRS4_DAT_STARTTIME") && _ !== "" && a === "") {
				this.byId("LRS4_DAT_STARTTIME").setValue(_);
			}
		},
		onSendClick: function() {
			if (this.checkAttachmentMandatory("sendButton")) {
				this.submit(true);
			}
		},
		onCancelClick: function() {
			this._isLocalReset = true;
			this.changeMode = false;
			this._clearData();
			ZLEAVE_REQ_CREATE.utils.CalendarTools.clearCache();
			this._setHighlightedDays(this.cale.getCurrentDate());
		},
		onEntitlementClick: function() {
			this.oRouter.navTo("entitlements", {});
		},
		onHistoryClick: function() {
			this.oRouter.navTo("master", {});
		},
		handleAdd: function(a) {
			try {
				var c = ZLEAVE_REQ_CREATE.utils.UIHelper.getControllerInstance();
				var b = a.getSource().getParent().getCustomData();
				var l = 1;
				if (b.length > 0) {
					l = b[0].getValue();
				}
				var g = c.byId("LRS4_FR_MUL_APP_GRID");
				if (c.leaveType.ApproverLevel > g.getContent().length + 1) {
					l++;
					c._addContentToGrid(l);
					for (var k = l - 1; k < g.getContent().length; k++) {
						var L = g.getContent()[k].getContent()[0];
						var f = g.getContent()[k].getContent()[1];
						L.setText(c.resourceBundle.getText("LR_LEVEL", [k + 2]));
						f.getCustomData()[0].setValue(k + 2);
					}
				} else {
					var E = c.resourceBundle.getText("LR_APPROVER_LEVEL_MAX");
					ZLEAVE_REQ_CREATE.utils.UIHelper.errorDialog(E);
				}
			} catch (e) {
				jQuery.sap.log.warning("Couldn't add approver:" + e.message, "handleAdd", "ZLEAVE_REQ_CREATE.view.S1");
			}
		},
		handleLess: function(a) {
			try {
				var c = ZLEAVE_REQ_CREATE.utils.UIHelper.getControllerInstance();
				var b = a.getSource().getParent().getCustomData();
				var l = -1;
				if (b.length > 0) {
					l = b[0].getValue();
				}
				var g = c.byId("LRS4_FR_MUL_APP_GRID");
				if (l > 1) {
					var C = g.getContent()[l - 2];
					g.removeContent(C);
					for (var k = l - 2; k < g.getContent().length; k++) {
						var L = g.getContent()[k].getContent()[0];
						var f = g.getContent()[k].getContent()[1];
						L.setText(c.resourceBundle.getText("LR_LEVEL", [k + 2]));
						f.getCustomData()[0].setValue(k + 2);
					}
				}
			} catch (e) {
				jQuery.sap.log.warning("Couldn't remove approver:" + e.message, "handleLess", "ZLEAVE_REQ_CREATE.view.S1");
			}
		},
		handleValueHelp: function(e) {
			var _ = ZLEAVE_REQ_CREATE.utils.UIHelper.getControllerInstance();
			_.currentApproverField = e.getSource();
			var D = _.resourceBundle.getText("LR_APPROVER");
			var s = new sap.m.SelectDialog({
				title: D,
				search: _._searchAction
			});
			s.open();
		},
		_searchAction: function(e) {
			var _ = this;
			if (e.getParameter('value').length > 0 || !isNaN(e.getParameter('value'))) {
				sap.ca.ui.utils.busydialog.requireBusyDialog();
				var s = function(d) {
					for (var i = 0; i < d.results.length; i++) {
						if (d.results[i].ApproverEmployeeID === "00000000") {
							delete d.results[i];
						}
					}
					var m = new sap.ui.model.json.JSONModel(d);
					sap.ca.ui.utils.busydialog.releaseBusyDialog();
					var a = new sap.m.StandardListItem({
						title: "{ApproverEmployeeName}",
						description: "{ApproverEmployeeID}",
						active: "true"
					});
					_.setModel(m);
					_.bindAggregation("items", "/results", a);
					_.attachConfirm(function(e) {
						var _ = ZLEAVE_REQ_CREATE.utils.UIHelper.getControllerInstance();
						var b = e.getParameter("selectedItem");
						var c = new sap.ui.core.CustomData({
							"key": "ApproverEmployeeID",
							"value": b.getDescription()
						});
						_.sApproverPernr = b.getProperty("description");
						_.currentApproverField.removeAllCustomData();
						_.currentApproverField.addCustomData(c);
						_.currentApproverField.setValue(b.getTitle());
					});
				};
				ZLEAVE_REQ_CREATE.utils.DataManager.searchApprover(e.getParameter('value'), s);
			}
		},
		uploadFileAttachments: function(s, o, a) {
			var _ = ZLEAVE_REQ_CREATE.utils.UIHelper.getControllerInstance();
			_.objectResponse = o;
			var f = _.byId("fileUploader");
			_.ResponseMessage = a;
			if (!_.bSimulation && _.leaveType.AttachmentEnabled && f.getValue()) {
				var u = "/LeaveRequestCollection(EmployeeID='',RequestID='" + o.RequestID + "',ChangeStateID=1,LeaveKey='')/Attachments";
				u = _.oDataModel.sServiceUrl + u;
				f.setUploadUrl(u);
				f.removeAllHeaderParameters();
				f.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
					name: "slug",
					value: encodeURIComponent(f.getValue())
				}));
				f.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
					name: "x-csrf-token",
					value: _.oDataModel.getSecurityToken()
				}));
				f.setSendXHR(true);
				if (f.getValue()) {
					f.upload();
				}
			} else {
				_.onSubmitLRCsuccess(_.objectResponse, _.ResponseMessage);
			}
		},
		handleUploadComplete: function(c) {
			var _ = ZLEAVE_REQ_CREATE.utils.UIHelper.getControllerInstance();
			var p = c.getParameters();
			if (parseInt(p.status, 10) >= 400) {
				var X = jQuery.parseXML(p.responseRaw);
				var e = ZLEAVE_REQ_CREATE.utils.DataManager.Xml2Json(X.documentElement);
				var s = {
					message: e.message,
					type: sap.ca.ui.message.Type.ERROR
				};
				sap.ca.ui.message.showMessageBox(s);
			}
			this.onSubmitLRCsuccess(_.objectResponse, _.ResponseMessage);
		},
		handleValueChange: function() {
			var _ = ZLEAVE_REQ_CREATE.utils.UIHelper.getControllerInstance();
			_.checkAttachmentMandatory();
			jQuery.sap.log.info("fileUploaderValue changed", ["handleValueChange"], ["S1 controller"]);
		},
		_deleteOldDatesFromCalendarCache: function(d, s) {
			try {
				for (var i = 0; i < d.length; i++) {
					var c = new Date(d[i]);
					var f = new Date(c.getFullYear(), c.getMonth(), 1);
					var C = ZLEAVE_REQ_CREATE.utils.CalendarTools.oCache;
					if (C.hasOwnProperty(f.toString())) {
						var a = C[f];
						for (var k in a) {
							if (k === s && a.hasOwnProperty(k)) {
								if (a[k].length > 0) {
									for (var j = 0; j < a[k].length; j++) {
										if ((new Date(a[k][j])).toString() == (new Date(c)).toString()) {
											a[k].splice(j, 1);
											if (a[k].length < 1) {
												delete a[k];
											}
											break;
										}
									}
								}
							}
						}
					}
				}
			} catch (e) {
				jQuery.sap.log.warning("falied to update cache" + e, "_deleteOldDatesFromCalendarCache", "ZLEAVE_REQ_CREATE.view.S1");
			}
		},
		initializeView: function(a) {
			var _ = this;
			var c = $.when(ZLEAVE_REQ_CREATE.utils.DataManager.getConfiguration(), ZLEAVE_REQ_CREATE.utils.DataManager.getAbsenceTypeCollection());
			c.done(function(d, l) {
				_.aLeaveTypes = l;
				var o = {};
				o.AbsenceTypeCollection = _.aLeaveTypes;
				_.slctLvType.setModel(new sap.ui.model.json.JSONModel(o));
				_.slctLvType.bindItems({
					path: "/AbsenceTypeCollection",
					template: new sap.ui.core.Item({
						key: "{AbsenceTypeCode}",
						text: "{AbsenceTypeName}"
					})
				});
				if (_.aLeaveTypes.length > 0) {
					_._setUpLeaveTypeData(a);
				}
			});
			c.fail(function(e) {
				ZLEAVE_REQ_CREATE.utils.UIHelper.errorDialog(e);
			});
			_._setHighlightedDays(_.cale.getCurrentDate());
		},
		checkAttachmentMandatory: function(o) {
			var _ = ZLEAVE_REQ_CREATE.utils.UIHelper.getControllerInstance();
			if (_.leaveType.AttachmentMandatory && _.byId("fileUploader").getValue() === "") {
				_.byId("fileUploader").setValueState("Error");
				_.byId("fileUploader").focus();
				if (o === "sendButton") {
					return false;
				}
			} else {
				_.byId("fileUploader").setValueState("None");
				if (o === "sendButton") {
					return true;
				}
			}
		},
		onFileDeleted: function(e) {
			var d = e.getParameter("documentId");
			var D = this.getView().byId("fileupload").getModel("files").getData();
			var I = this.getView().byId("fileupload").getModel("files").getData().AttachmentsCollection;
			for (var a = 0; a < I.length; a++) {
				if (I[a].DocumentId === d) {
					I.splice(a, 1);
				}
			}
			D.AttachmentsCollection = I;
			var b = new sap.ui.model.json.JSONModel(D);
			this.byId("fileupload").setModel(b, "files");
			for (var i = 0; i < this.oChangeModeData.Attachments.length; i++) {
				if (this.oChangeModeData.Attachments[i].ArchivDocId === d) {
					this.oChangeModeData.Attachments[i].AttachmentStatus = "D";
				}
			}
			if (D.AttachmentsCollection.length === 0) {
				this.byId("fileupload").setVisible(false);
			}
		},
		_addContentToGrid: function(l, a, b) {
			try {
				var c = ZLEAVE_REQ_CREATE.utils.UIHelper.getControllerInstance();
				var A = {};
				A.Name = a ? a.Name : "";
				A.Pernr = a ? a.Pernr : "";
				var g = c.byId("LRS4_FR_MUL_APP_GRID");
				var v = new sap.ui.layout.VerticalLayout({
					width: "100%",
					content: [new sap.m.Label({
						width: "100%",
						text: c.resourceBundle.getText("LR_LEVEL", [l]),
						layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
							linebreak: true,
							baseSize: "100%"
						})
					}), new sap.m.FlexBox({
						customData: new sap.ui.core.CustomData({
							"key": "Level",
							"value": l
						}),
						width: "100%",
						items: [new sap.m.Input({
							value: A.Name,
							enabled: b,
							width: "100%",
							showSuggestion: true,
							valueHelpOnly: true,
							showValueHelp: true,
							valueHelpRequest: c.handleValueHelp,
							customData: new sap.ui.core.CustomData({
								"key": "ApproverEmployeeID",
								"value": A.Pernr
							}),
							layoutData: new sap.m.FlexItemData({
								growFactor: 30
							})
						}), new sap.m.Button({
							width: "38px",
							icon: "sap-icon://add",
							enabled: c.leaveType.AddDelApprovers,
							press: c.handleAdd,
							layoutData: new sap.m.FlexItemData({
								growFactor: 1
							})
						}), new sap.m.Button({
							width: "38px",
							icon: "sap-icon://less",
							enabled: c.leaveType.AddDelApprovers,
							press: c.handleLess,
							layoutData: new sap.m.FlexItemData({
								growFactor: 1
							})
						})]
					})]
				});
				g.insertContent(v, l - 2);
			} catch (e) {
				jQuery.sap.log.warning("falied to add content grid" + e.message, "_leaveTypeDependantSettings", "ZLEAVE_REQ_CREATE.view.S1");
			}
		},
		handleTypeMissmatch: function(e) {
			var f = e.getSource().getFileType();
			sap.m.MessageToast.show(this.resourceBundle.getText("LR_ATTACHMENT_TYPE_ERROR", [f]), {
				width: "15em"
			});
			e.getSource().clear();
		},
		handleFileSizeExceed: function(e) {
			var m = e.getSource().getMaximumFileSize();
			sap.m.MessageToast.show(this.resourceBundle.getText("LR_ATTACHMENT_SIZE_ERROR", [m]), {
				width: "15em"
			});
			e.getSource().clear();
		},
		_addValueHelp: function(e) {
			var c = ZLEAVE_REQ_CREATE.utils.UIHelper.getControllerInstance();
			c.valueHelpControlId = e.getSource().getId();
			var l = e.getSource().getCustomData()[0].getValue();
			ZLEAVE_REQ_CREATE.utils.DataManager.LeaveRequestValueHelp(l, function(d) {
				var a = JSON.parse(d.results[0].SELECT_LIST);
				var b = JSON.parse(d.results[0].SELECT_LIST_HEADERS);
				var m = new sap.ui.model.json.JSONModel();
				m.setData(a);
				c.DialogInstance = new sap.m.Dialog({
					title: c.resourceBundle.getText("LR_VALUEHELP"),
					endButton: new sap.m.Button({
						text: "Cancel",
						press: function() {
							c.DialogInstance.close();
						}
					})
				});
				var L = new sap.m.List({
					growingScrollToLoad: true
				});
				L.bindItems({
					path: "/",
					template: new sap.m.StandardListItem({
						type: sap.m.ListType.Active,
						title: "{" + d.results[0].FIELDNAME + "}",
						description: "{" + d.results[0].FIELDVALUE + "}",
						press: function(f) {
							var c = ZLEAVE_REQ_CREATE.utils.UIHelper.getControllerInstance();
							var i = c.valueHelpControlId.split("LRS4_FR_ADDN_FIELDS_GRID-")[1];
							var g = f.getSource().getTitle();
							c.byId('LRS4_FR_ADDN_FIELDS_GRID').getAggregation('content')[i].getContent()[1].setValue(g);
							c.DialogInstance.close();
							c.DialogInstance = null;
						}.bind(this)
					})
				});
				L.setModel(m);
				c.DialogInstance.addContent(L);
				c.DialogInstance.open();
			}, function(r) {});
		}*/

		// SE
	});
});