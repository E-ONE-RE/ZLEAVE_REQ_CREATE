sap.ui.define([
		"ZLEAVE_REQ_CREATE/controller/BaseController", "sap/ui/model/json/JSONModel",
		'sap/ui/unified/CalendarLegendItem',
		'sap/ui/unified/DateTypeRange',
		'sap/m/Button',
		'sap/m/Dialog',
		'sap/m/Label',
		"ZLEAVE_REQ_CREATE/model/formatter"
	],
	function(BaseController, JSONModel, CalendarLegendItem, DateTypeRange, Button, Dialog, Label, formatter) {
		"use strict";

		jQuery.sap.require("sap.m.MessageBox");
		jQuery.sap.require("sap.m.MessageToast");

		return BaseController.extend("ZLEAVE_REQ_CREATE.controller.View2", {
			
			formatter: formatter,
				
			oFormatYyyymmdd: null,
			oFormatYYyyymmdd: null,
			oFormatDaysShort: null,
		
			onInit: function() {

				this._initCntrls();
				
				this.oFormatYyyymmdd = sap.ui.core.format.DateFormat.getInstance({
					pattern: "yyyyMMdd",
					calendarType: sap.ui.core.CalendarType.Gregorian
				});
				
				this.oFormatDaysShort = sap.ui.core.format.DateFormat.getInstance({
					pattern: "E",
					calendarType: sap.ui.core.CalendarType.Gregorian
				});
				
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
                
                var oCal2 = oView.byId("LRS4_DAT_CALENDAR");
				var oLeg2 = oView.byId("legend1");
				
					//ripulisco i campi	calendario	
				oView.byId("LRS4_DAT_CALENDAR").removeAllSelectedDates();
				oView.byId("LRS4_DAT_CALENDAR").removeAllSpecialDates();
				oLeg2.destroyItems();
				
				
				
				/*oView.byId("LRS4_DAT_STARTTIME").setValue("");
				oView.byId("LRS4_DAT_STARTTIME").setEnabled(true);
				oView.byId("LRS4_DAT_STARTTIME").rerender();
				

				oView.byId("LRS4_DAT_ENDTIME").setValue("");
				oView.byId("LRS4_DAT_ENDTIME").setEnabled(true);
				oView.byId("LRS4_DAT_ENDTIME").rerender();
				

				oView.byId("LRS4_TXA_NOTE").setValue("");
				oView.byId("LRS4_TXA_NOTE").setEnabled(true);
				oView.byId("LRS4_TXA_NOTE").rerender();*/
				
				var oCtx, zid, zstatus;
				oCtx = oView.getBindingContext();
				zid = oCtx.getProperty("ZrequestId");
				zstatus = oCtx.getProperty("ZreqStatus");
				////zid = oView.getBindingContext().getProperty("ZrequestId");
				
				// setto i valori in base ai valori del binding corrente
				oView.byId("SLCT_LEAVETYPE").setSelectedKey(oCtx.getProperty("ZabsType"));
				oView.byId("SLCT_APPROVER").setSelectedKey(oCtx.getProperty("Tmsapprover"));
				oView.byId("LRS4_DAT_ORETOT").setValue(oCtx.getProperty("ZoreTotali"));
				
				oView.byId("LRS4_TXA_NOTE").setValue(oCtx.getProperty("Znote"));
				
				if (zstatus === 'A' || zstatus === 'R')
				{
					oView.byId("SLCT_LEAVETYPE").setEnabled(false);
					oView.byId("SLCT_LEAVETYPE").rerender();
					
					oView.byId("SLCT_APPROVER").setEnabled(false);
					oView.byId("SLCT_APPROVER").rerender();
					
					oView.byId("LRS4_DAT_STARTTIME").setEnabled(false);
					oView.byId("LRS4_DAT_STARTTIME").rerender();
					
					oView.byId("LRS4_DAT_ENDTIME").setEnabled(false);
					oView.byId("LRS4_DAT_ENDTIME").rerender();
					
					oView.byId("LRS4_TXA_NOTE").setEnabled(false);
					oView.byId("LRS4_TXA_NOTE").rerender();
					
					oCal2.setVisible(false);
					oCal2.rerender();
					
					oLeg2.setVisible(false);
					oLeg2.rerender();
					
					oView.byId("removeAll_btn").setEnabled(false);	
					oView.byId("removeAll_btn").rerender();	
                }
                else  
					{


                	oView.byId("SLCT_LEAVETYPE").setEnabled(true);
					oView.byId("SLCT_LEAVETYPE").rerender();
					
					oView.byId("SLCT_APPROVER").setEnabled(true);
					oView.byId("SLCT_APPROVER").rerender();
					
					oView.byId("LRS4_DAT_STARTTIME").setEnabled(true);
					oView.byId("LRS4_DAT_STARTTIME").rerender();
					
					oView.byId("LRS4_DAT_ENDTIME").setEnabled(true);
					oView.byId("LRS4_DAT_ENDTIME").rerender();
					
					oView.byId("LRS4_TXA_NOTE").setEnabled(true);
					oView.byId("LRS4_TXA_NOTE").rerender();
					
					oCal2.setVisible(true);
					oCal2.rerender();
					
					oLeg2.setVisible(true);
					oLeg2.rerender();
					
					oView.byId("removeAll_btn").setEnabled(true);	
					oView.byId("removeAll_btn").rerender();	
					
				//leggo le posizioni per ricavare i giorni selezionati della singola richiesta in modifica
				
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
                           
                        // setto valori orario
                        oView.byId("LRS4_DAT_STARTTIME").setValue(oData.results[0].Ztimestart);
				        oView.byId("LRS4_DAT_ENDTIME").setValue(oData.results[0].Ztimeend);
                           
						var oFormatYYyyymmdd = sap.ui.core.format.DateFormat.getInstance({
							pattern: "yyyyMMdd",
							calendarType: sap.ui.core.CalendarType.Gregorian
						});
                       
						var oRefDate = new Date();

						var oDateRange;
						
						
						if (oData.results.length > 1) {

							oView.byId("LRS4_DAT_STARTTIME").setEnabled(false);
				            oView.byId("LRS4_DAT_ENDTIME").setEnabled(false);
						}    

						if (oData.results.length > 0) {
							for (var i = 0; i < oData.results.length; i++) {

								 var oZdate = oData.results[i].Zdate;
							
                          // aggiungere date selezionate quando si è in modifica
								oCal2.addSelectedDate(new DateTypeRange({
									startDate: oFormatYYyyymmdd.parse(oZdate)

								}));

							}
							
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
					console.log(oError);

					alert("Error in read: " + oError.message);
				}
				
				
				
				
				//////////////////////////
				
				//leggo le posizioni per ricavare i giorni delle richieste già attive
				
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

								var res = oData.results[i].Zdate;
								
								//escludo specialDate di richiesta già presente per la richiesta in modifica
								// per non far scattare il controllo di data sovrapposta nel caso in cui l'utente
								// deseleziona il giorno e lo riseleziona
	                        	if (oData.results[i].ZrequestId !== zid){
	                           
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
	                        	}
                        
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

					//	jQuery.sap.require("sap.m.MessageBox");
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
					}

			},

			/////////////////////

			onAfterRendering: function(oEvent) {
		//			onBeforeRendering: function(oEvent) {
				
			/*	var oView = this.getView();
				var oCtx, zstatus;
                var oCal2 = oView.byId("LRS4_DAT_CALENDAR");
				var oLeg2 = oView.byId("legend1");
				
				oCtx = oView.getBindingContext();
				zstatus = oCtx.getProperty("ZreqStatus");

				if (zstatus === 'A' || zstatus === 'R')
				{
					oView.byId("SLCT_LEAVETYPE").setEnabled(false);
					oView.byId("SLCT_APPROVER").setEnabled(false);
					oView.byId("LRS4_DAT_STARTTIME").setEnabled(false);
					oView.byId("LRS4_DAT_ENDTIME").setEnabled(false);
					oView.byId("LRS4_TXA_NOTE").setEnabled(false);
					oCal2.setVisible(false);
					oLeg2.setVisible(false);
					oView.byId("removeAll_btn").setEnabled(false);	
                }	
				*/
			
//oCal2.setVisible(false);
			},

		
		/////////////////////////////////////////////////////////////////////  
		/*actionTask: function(oEvent) 
	{
		
        var oView = this.getView();

				var oModel = this.getView().getModel();
				sap.ui.getCore().setModel(oModel);
                      
                      //causa bug di versione sopno costretto a forzare xml, altrimenti i campi di tipo 
                      //decimali fanno andare la chiamata post create_deep_entity in errore: CX_SXML_PARSE_ERROR
                      //note sap:
                      //1751991 - OData Channel - Deep Insert in JSON Format Leads to Error
					 //1874920 - Error in "deep insert" case when parsing JSON
					 // https://archive.sap.com/discussions/thread/3936579
					 ////
                      oModel.oHeaders.Accept="application/atom+xml,application/atomsvc+xml,application/xml";

                      oModel.bJSON = false;
                    /////  
            //          oModel.setUseBatch(false);
			//var oObject = oView.getBindingContext().getObject();
			
		
						 
						
//			var aSelectedDates = oCalendar.getSelectedDates();
            var aSelectedDates = this.cale.getSelectedDates();
			var oDate;
			
			var aZtimestart = this.timeFrom.getValue();
			var	aZtimeend = this.timeTo.getValue();
			var aOreTot,
			    aOrep;
			    var aOreDay = 8.0;
			    
			
			if ( aZtimestart ===  "" & aZtimeend === "" ) {
				
				  aOreTot = parseFloat(aSelectedDates.length * 8);

				  aOrep = 8;
			}
			else {
		
					var tim1=aZtimestart,tim2=aZtimeend;
				var ary1=tim1.split(':'),ary2=tim2.split(':');
				var minsdiff=parseInt(ary2[0],10)*60+parseInt(ary2[1],10)-parseInt(ary1[0],10)*60-parseInt(ary1[1],10);
				var aTstart = parseInt(ary1[0],10);
				var aTend = parseInt(ary2[0],10);
				var aTendMin = parseInt(ary2[1],10);
				aOrep = parseFloat(minsdiff/60);
				Number(aOrep).toFixed(1);    
				   
				   
					//sottraggo ore pausa in caso di assenza a cavallo tra mattina e rientro nel pome
						if ( aTstart < 13 & ((aTend > 14) || (aTend === 14 & aTendMin >= 30)) ) {
						  aOrep = aOrep - 1.5;
						}
						
						if ( aOrep > 8 ) {
						  aOrep = 8;
						}
						
				aOreTot = parseFloat(aSelectedDates.length * aOrep);
				Number(aOreTot).toFixed(1); 
			
					
				}

   var oUrlParams = {
				 //ZWfTaskid : "0000025000",
				 Tmsapprover : this.slctApprover.getSelectedKey(),
				 ZabsType : this.slctLvType.getSelectedKey(),
				 ZreqStatus : "I",
				 ZoreTotali : aOreTot,
                 Znote : this.note.getValue()
		
					 };
					 
	oUrlParams.ToLeaveReqPos = [];				 
			if (aSelectedDates.length > 0 ) {
				for (var i = 0; i < aSelectedDates.length; i++){
					oDate = aSelectedDates[i].getStartDate();
					oUrlParams.ToLeaveReqPos.push({ 
						Zdate:this.oFormatYyyymmdd.format(oDate), 
						Ztimestart:aZtimestart,
						Ztimeend:aZtimeend, 
						Tmsapprover:this.slctApprover.getSelectedKey(),
						ZabsType:this.slctLvType.getSelectedKey(),
						Zorep:aOrep,
						ZreqStatus:"I"} );
				
				}
			//	this.oModel.setData(oData);
			} else {
			//	this._clearModel();
			}

					  
					  // jQuery.sap.require("sap.ui.commons.MessageBox");
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
					  
	}, */
            //NON USATA, abbiamo deciso di nascondere il calendario in caso di richieste già apporvate o rifutate
            handleCalendarSelectV2: function(oEvent) {
            	
            	var oCtx, zid, zstatus;
            	var oView = this.getView();
            	var that = this;
				
				oCtx = oView.getBindingContext();
			
				zstatus = oCtx.getProperty("ZreqStatus");
				////zid = oView.getBindingContext().getProperty("ZrequestId");
				
				if (zstatus === 'A' || zstatus === 'R')
				{
						sap.m.MessageBox.show(
						"Nessun modifica consentita su questo tipo di richiesta in quanto già approvata o rifiutata.", {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.CLOSE]

						});
					
					return;
                }
                else 	{
                			that.handleCalendarSelect(oEvent);
                		}
            	
            },
             		
             		
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