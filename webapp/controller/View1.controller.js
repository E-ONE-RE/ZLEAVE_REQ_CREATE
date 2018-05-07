sap.ui.define([
		"eone_zleave_req_create/controller/BaseController", "sap/ui/model/json/JSONModel",
		'sap/ui/unified/CalendarLegendItem',
		'sap/ui/unified/DateTypeRange',
		'sap/m/Button',
		'sap/m/Dialog',
		'sap/m/Label',
	//	'sap/m/MessageToast',
	//	'sap/m/MessageBox',
		"eone_zleave_req_create/model/formatter"
	],
	function(BaseController, JSONModel, CalendarLegendItem, DateTypeRange, Button, Dialog, Label, formatter) {
		"use strict";

		//	jQuery.sap.require("eone_zleave_req_create.utils.Formatters");
	//	jQuery.sap.require("eone_zleave_req_create.utils.UIHelper");
		jQuery.sap.require("sap.m.MessageBox");
	//	jQuery.sap.require("eone_zleave_req_create.utils.DataManager");
	//	jQuery.sap.require("eone_zleave_req_create.utils.ConcurrentEmployment");
	//	jQuery.sap.require("eone_zleave_req_create.utils.CalendarTools");
	//	jQuery.sap.require("sap.ca.ui.dialog.factory");
	//	jQuery.sap.require("sap.ca.ui.dialog.Dialog");
		jQuery.sap.require("sap.m.MessageToast");
		// jQuery.support.useFlexBoxPolyfill = false;
	//	jQuery.sap.require("sap.ca.ui.model.format.FileSizeFormat");
	//	jQuery.sap.require("sap.ca.ui.message.message");
		// jQuery.sap.require("sap.ui.thirdparty.sinon");

		return BaseController.extend("eone_zleave_req_create.controller.View1", {
			
			formatter: formatter,

			oFormatYyyymmdd: null,
			oFormatDaysShort: null,
			oFormatYear: null,

			onInit: function() {
				//SE			eone_zleave_req_create.utils.DataManager.init(this.oDataModel, this.resourceBundle);
				//	eone_zleave_req_create.utils.Formatters.init(this.resourceBundle);
				//	eone_zleave_req_create.utils.CalendarTools.init(this.resourceBundle);
				//	this.oRouter.attachRouteMatched(this._handleRouteMatched, this);
				//	sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit.call(this);
				//this.oApplication = this.oApplicationFacade.oApplicationImplementation;
				//this.resourceBundle = this.oApplicationFacade.getResourceBundle();
				//this.oDataModel = this.oApplicationFacade.getODataModel();
				//eone_zleave_req_create.utils.DataManager.init(this.oDataModel, this.resourceBundle);
				//		eone_zleave_req_create.utils.Formatters.init(this.resourceBundle);
				//eone_zleave_req_create.utils.CalendarTools.init(this.resourceBundle);
				//this.oDataModel = eone_zleave_req_create.utils.DataManager.getBaseODataModel();

				//this.oRouter.attachRouteMatched(this._handleRouteMatched, this);
				//this._buildHeaderFooter();
				this._initCntrls();
				// sap.ui.getCore().getEventBus().subscribe("eone_zleave_req_create.LeaveCollection", "refresh", this._onLeaveCollRefresh, this);

				this.oFormatYyyymmdd = sap.ui.core.format.DateFormat.getInstance({
					pattern: "yyyyMMdd",
					calendarType: sap.ui.core.CalendarType.Gregorian
				});
				
				this.oFormatDaysShort = sap.ui.core.format.DateFormat.getInstance({
					pattern: "E",
					calendarType: sap.ui.core.CalendarType.Gregorian
				});
				
				this.oFormatYear = sap.ui.core.format.DateFormat.getInstance({
					pattern: "Y",
					calendarType: sap.ui.core.CalendarType.Gregorian
				});

				//		this.oModel = new JSONModel({selectedDates:[]});
				//		this.getView().setModel(this.oModel);

///////

/* var mDataFullDay = {
    
    "combotype":"ComboText",
    "DataFullDay" : [{
     "Name" :"SI",
     "Value":"SI"
    },
    {
     "Name" :"NO",
     "Value":"NO"
    }]
  
   };
*/
  

			this._data = {
							GiorniTab : [
							            
							      /*      { data : '' , inizio : '' , fine : '', oretot : ''}*/
							           
							            ]
						};
						

			this.jModel = new sap.ui.model.json.JSONModel();
			this.jModel.setData(this._data);
			
					
	//		this.yModel = new sap.ui.model.json.JSONModel();
	//		this.yModel.setData(mDataFullDay);


///////
				var oRouter = this.getRouter();
				oRouter.getRoute("view1").attachMatched(this._onRouteMatched, this);


			},

//////new table
			onBeforeRendering: function() {
					this.byId('GiorniTabIns').setModel(this.jModel);
			//	   this.byId('LRS4_DAT_FULLDAY').setModel(this.yModel);
				},
            
            addRow : function(oArg, oDatasap){
		this._data.GiorniTab.push({datasap: oDatasap, data : oArg, inizio : '', fine: '', oretotday: '8'});
		this.jModel.refresh();//which will add the new record
	    this._checkFullDays();//aggiorno ore totali
	},
	
	// solo a scopo di debug
	fetchRecords : function(oArg){
	
	
		console.log(this._data.GiorniTab);
		
	},
	
	/*deleteRow : function(oArg){
		var deleteRecord = oArg.getSource().getBindingContext().getObject();
		for(var i=0;i<this._data.GiorniTab.length;i++){
			if(this._data.GiorniTab[i] == deleteRecord )
					{
					
						this._data.GiorniTab.splice(i,1); //removing 1 record from i th index.
						this.jModel.refresh();
						break;//quit the loop
					}
		}
	},*/
	
	

	
		_clearModelGiorniTab: function() {
		this._data = {
				GiorniTab : [
				            
				      /*      { data : '' , inizio : '' , fine : '', oretot : ''}*/
				           
				            ]	
			};
			this.jModel.setData(this._data);
			this.jModel.refresh();
		},
  
  //// fine new table  
  
  
			_onRouteMatched: function(oEvent) {

				var oView = this.getView();

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
				
			    //resetto array tabella dei giorni
				this._clearModelGiorniTab();

				//ripulisco i campi		
				oView.byId("LRS4_DAT_CALENDAR").removeAllSelectedDates();
				oView.byId("LRS4_DAT_CALENDAR").removeAllSpecialDates();
				oView.byId("LRS4_DAT_CALENDAR").removeAllDisabledDates();

				var oCal1 = oView.byId("LRS4_DAT_CALENDAR");
				var oLeg1 = oView.byId("legend1");
				oLeg1.destroyItems();
				
				//imposto la data minima selezionabile dietro di un anno
				   var nowP = new Date();
				
				   var  nowF = new Date();
				    nowP.setDate(nowP.getDate()-365);
					oCal1.setMinDate(nowP);
					
					//imposto la data massima selezionabile avanti di un anno
				  
				    nowF.setDate(nowF.getDate()+365);
					oCal1.setMaxDate(nowF);
					
				
				    var nowForYear = new Date();
	                     var oYear = this.oFormatYear.format(nowForYear);
 
                         var oYearN = Number(oYear);
                         
                         var oYear2 = oYearN+1;
                     
                         // disabilito giorni festivi 
	                     oCal1.addDisabledDate(new DateTypeRange({   
	                     startDate: this.oFormatYear.parse(oYearN+"0101")
	                     }));
	                     
	                     oCal1.addDisabledDate(new DateTypeRange({   
	                     startDate: this.oFormatYear.parse(oYear2+"0101")
	                     }));

                         ///// befana
	                     oCal1.addDisabledDate(new DateTypeRange({   
	                     startDate: this.oFormatYear.parse(oYearN+"0106")
	                     }));
	                     
	                      oCal1.addDisabledDate(new DateTypeRange({   
	                     startDate: this.oFormatYear.parse(oYear2+"0106")
	                   
	                     }));
	                     
	                     ///// 25 aprile
	                     oCal1.addDisabledDate(new DateTypeRange({   
	                     startDate: this.oFormatYear.parse(oYearN+"0425")
	                     }));
	                     
	                      oCal1.addDisabledDate(new DateTypeRange({   
	                     startDate: this.oFormatYear.parse(oYear2+"0425")
	                     }));
	                     
	                     
	                     ///// primo maggio
	                      oCal1.addDisabledDate(new DateTypeRange({   
	                     startDate: this.oFormatYear.parse(oYearN+"0501")
	                     }));
	                     
	                      oCal1.addDisabledDate(new DateTypeRange({   
	                     startDate: this.oFormatYear.parse(oYear2+"0501")
	                     }));
	                     
	                     
	                     ///// 2 giugno
	                       oCal1.addDisabledDate(new DateTypeRange({   
	                     startDate: this.oFormatYear.parse(oYearN+"0602")
	                     }));
	                     
	                      oCal1.addDisabledDate(new DateTypeRange({   
	                     startDate: this.oFormatYear.parse(oYear2+"0602")
	                     }));
	                     
	                     
	                     ///// ferragosto
	                     oCal1.addDisabledDate(new DateTypeRange({   
	                     startDate: this.oFormatYear.parse(oYearN+"0815")
	                     }));
	                     
	                      oCal1.addDisabledDate(new DateTypeRange({   
	                     startDate: this.oFormatYear.parse(oYear2+"0815")
	                     }));
	                     
	                     
	                     ///// tutti i santi
	                     oCal1.addDisabledDate(new DateTypeRange({   
	                     startDate: this.oFormatYear.parse(oYearN+"1101")
	                     }));
	                     
	                      oCal1.addDisabledDate(new DateTypeRange({   
	                     startDate: this.oFormatYear.parse(oYear2+"1101")
	                     }));
	                     
	                     
	                     ///// immacolata
	                      oCal1.addDisabledDate(new DateTypeRange({   
	                     startDate: this.oFormatYear.parse(oYearN+"1208")
	                     }));
	                     
	                      oCal1.addDisabledDate(new DateTypeRange({   
	                     startDate: this.oFormatYear.parse(oYear2+"1208")
	                     }));
	                     
	                     
	                     ////// natale
	                      oCal1.addDisabledDate(new DateTypeRange({   
	                     startDate: this.oFormatYear.parse(oYearN+"1225")
	                     }));
	                     
	                      oCal1.addDisabledDate(new DateTypeRange({   
	                     startDate: this.oFormatYear.parse(oYear2+"1225")
	                     }));
	                     
	                     
	                     ////// santo stefano
	                       oCal1.addDisabledDate(new DateTypeRange({   
	                     startDate: this.oFormatYear.parse(oYearN+"1226")
	                     }));
	                     
	                      oCal1.addDisabledDate(new DateTypeRange({   
	                     startDate: this.oFormatYear.parse(oYear2+"1226")
	                     }));
	                  ///////////////FINE FESTIVI////////////   
	                  
	                  
	                  ///////////// test tabella
	        
            
	                  ////////////////

				//new tab	oView.byId("LRS4_DAT_STARTTIME").setValue("");
			//new tab		oView.byId("LRS4_DAT_STARTTIME").rerender();
				//oView.byId("LRS4_DAT_STARTTIME").setEnabled(true);

				//new tab	oView.byId("LRS4_DAT_ENDTIME").setValue("");
				//new tab	oView.byId("LRS4_DAT_ENDTIME").rerender();
				//oView.byId("LRS4_DAT_ENDTIME").setEnabled(true);

				oView.byId("LRS4_TXA_NOTE").setValue("");
				oView.byId("LRS4_TXA_NOTE").rerender();
				oView.byId("LRS4_TXA_NOTE").setEnabled(true);
				
				
			//	oView.byId("LRS4_TXA_NOTE_RECUP").setValue("");
			//	oView.byId("LRS4_TXA_NOTE_RECUP").rerender("");
			//	oView.byId("LRS4_TXA_NOTE_RECUP").setEnabled(true);
				
				oView.byId("LRS4_DAT_ORETOT").setValue("0");
				oView.byId("LRS4_DAT_ORETOT").setEnabled(false);
				oView.byId("LRS4_DAT_ORETOT").rerender();

				var sRead = "/LeaveRequestPosSet";

				oModel.read(sRead, {

					success: fnReadS,

					error: fnReadE
				});

				function fnReadS(oData, response) {
				//	console.log(oData);
				//	console.log(response);

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
								//escludo richieste rifiutate
                            	if (oData.results[i].ZreqStatus === 'A' || oData.results[i].ZreqStatus === 'I') {
								//						var res = oData.results[i].Zdate.substring(8);
									var res = oData.results[i].Zdate;
	                               
	                               if (oData.results[i].Zorep >= "8") {
	                               // disabilito giorni che contengono già una richiesta   
	                               oCal1.addDisabledDate(new DateTypeRange({   
	                               startDate: oFormatYYyyymmdd.parse(res)
	                               }));
	                               
	                               }
	                               
									if (oData.results[i].ZabsType == "0001") {
	
										oCal1.addSpecialDate(new DateTypeRange({
											startDate: oFormatYYyyymmdd.parse(res),
											type: "Type01",
											tooltip: "Permesso Id: " + formatter.formatRequestId(oData.results[i].ZrequestId) + " Ore: " + formatter.formatRequestId(oData.results[i].Zorep) + " Stato: " + oData.results[i].ZreqStatus 
	                                           
										}));
									}
	
									if (oData.results[i].ZabsType == "0002") {
	
										oCal1.addSpecialDate(new DateTypeRange({
											startDate: oFormatYYyyymmdd.parse(res),
											type: "Type05",
											tooltip: "Ferie Id: " + formatter.formatRequestId(oData.results[i].ZrequestId) + " Ore: " + formatter.formatRequestId(oData.results[i].Zorep) + " Stato: " + oData.results[i].ZreqStatus
	
										}));
									}
	
									if (oData.results[i].ZabsType == "0003") {
	
										oCal1.addSpecialDate(new DateTypeRange({
											startDate: oFormatYYyyymmdd.parse(res),
											type: "Type09",
											tooltip: "Recupero Id: " + formatter.formatRequestId(oData.results[i].ZrequestId) +  " Ore: " + formatter.formatRequestId(oData.results[i].Zorep) + " Stato: " + oData.results[i].ZreqStatus
	
										}));
								}
								
											if (oData.results[i].ZabsType == "0004") {
	
										oCal1.addSpecialDate(new DateTypeRange({
											startDate: oFormatYYyyymmdd.parse(res),
											type: "Type08",
											tooltip: "ROL Id: " + formatter.formatRequestId(oData.results[i].ZrequestId) + " Ore: " + formatter.formatRequestId(oData.results[i].Zorep)  + " Stato: " + oData.results[i].ZreqStatus
	
										}));
								}
								
                             }	

								// aggiungere date selezionate quando si è in modifica
								/*oCal1.addSelectedDate(new DateTypeRange({
									startDate: oFormatYYyyymmdd.parse(res)

								}));*/

							}

							oLeg1.addItem(new CalendarLegendItem({
								text: "Permesso",
								id: "leg1",
								type: "Type01"

							}));

							oLeg1.addItem(new CalendarLegendItem({
								text: "Ferie",
								id: "leg2",
								type: "Type05"
							}));

							oLeg1.addItem(new CalendarLegendItem({
								text: "Recupero",
								id: "leg3",
								type: "Type09"
							}));

						}

					} else {

						//jQuery.sap.require("sap.m.MessageBox");
						sap.m.MessageBox.show(
							"Error: Nessun record recuperato", {
								icon: sap.m.MessageBox.Icon.WARNING,
								title: "Error",
								actions: [sap.m.MessageBox.Action.CLOSE]

							});

					}

				} // END FUNCTION SUCCESS

				function fnReadE(oError) {
				//	console.log(oError);

					alert("Error in read: " + oError.message);
				}

			},


			/////////////////////////////////////////////////////////////////////  

			onHistoryPress: function(oEvent) {

				//this.getRouter().getTargets().display("view1s");

				this.getRouter().navTo("view1s", {});

			},


			getRouter: function() {
				return sap.ui.core.UIComponent.getRouterFor(this);

			}


		});
	});