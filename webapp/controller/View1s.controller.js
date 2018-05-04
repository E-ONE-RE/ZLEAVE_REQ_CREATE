sap.ui.define([
		"eone_zleave_req_create/controller/BaseController", "sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History", "eone_zleave_req_create/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"

	],
	function(BaseController, JSONModel, History, formatter, Filter, FilterOperator, MessageBox) {
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

		return BaseController.extend("eone_zleave_req_create.controller.View1s", {

			formatter: formatter,

			onInit: function() {
                
            this.modelServices();
              
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
				

			   // var oSelect1 = sap.ui.getCore().byId("__component0---V1S--selABS");
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
	     	
	     		var oRouter = this.getRouter();
				oRouter.getRoute("view1s").attachMatched(this._onRouteMatched, this);
				
			},

			_onRouteMatched: function(oEvent) {

                
                //refresh della tabella
                var oView = this.getView();
				var oTable = oView.byId("__table0");
				var oTable2 = oView.byId("__tableUserInfo");
				oTable.getBinding("items").refresh();
				oTable2.getBinding("items").refresh();
				
				
				

			},
			
			// richiamo function per auto refresh tabella
			modelServices: function() {
				
		      var self = this;
		      this.intervalHandle = setInterval(function() { 
		      self.callRefreshTable();
          
			       },  300000);
			},

		   callRefreshTable: function() {
		
			var oView = this.getView();
					var oTable = oView.byId("__table0");
					oTable.getBinding("items").refresh();
					
						var msg = "Updating...";
					sap.m.MessageToast.show(msg, {
						duration: 3000,
						autoClose: true,
						closeOnBrowserNavigation: true
					});
	
				},
				
					// richiamo function per auto refresh tabella
			onPress: function(oEvent) {

		      	var oItem, oCtx, zid;
			//	var oView = this.getView();
				
				 if (this.intervalHandle) 
			      clearInterval(this.intervalHandle);
		 
		    	this.onRefreshTable();
		     
		    	oItem = oEvent.getSource();
				oCtx = oItem.getBindingContext();
				
				zid = oCtx.getProperty("ZrequestId");

				this.getRouter().navTo("view2", {
					ZrequestId: zid
				});
          
			       
			},
		
		
		onNavBackDirect        : function (oEvent) {
			
             if (this.intervalHandle) 
			      clearInterval(this.intervalHandle);
	 //		this.getRouter().navTo("view1s", {});
			
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
			//	this.getRouter().navTo("view1s", {}, true );
			    this.getRouter().navTo("view1", {});
			}
			
		},
           
			
			//pulisco il contatore dell'auto refresh
			onExit:function() {
			   // You should stop the interval on exit. 
			   // You should also stop the interval if you navigate out of your view and start it again when you navigate back. 
			   if (this.intervalHandle) 
			      clearInterval(this.intervalHandle);
			},
			
			onAfterRendering: function(oEvent) {

			},

			onUpdateFinished: function(oEvent) {
				
				var oView = this.getView();
				
				var oTable2 = oView.byId("__tableUserInfo");
				
				oTable2.getBinding("items").refresh();


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
			
		
	

		/*	onPress: function(oEvent) {
               
               var oView = this.getView();
				var oTable = oView.byId("__table0");
               
				oTable.getBinding("items").refresh(true);
				oView.byId("__table0").rerender();
				
				 var oModel = this.getView().getModel();

			     oModel.refresh();
			     var zstat = oModel.Odata.LeaveRequestSet.ZreqStatus.getValue();
			   	
			  //	oModel.destroy();
			//  oModel.setModel();
        //oModel.updateBindings(true);
        // oModel.refresh();
        
        //	var oModel = this.getView().getModel();
        //oModel = this.getView().getModel();
		//		sap.ui.getCore().setModel(oModel);
    
			
				var oItem, oCtx, zid;

				oItem = oEvent.getSource();
				oCtx = oItem.getBindingContext();
				
				zid = oCtx.getProperty("ZrequestId");


				this.getRouter().navTo("view2", {
					ZrequestId: zid
				});

			},*/
			
			
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
		
		
		onPullToRefresh: function() {
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
			
           oView.byId("pullToRefresh").hide();
		},
		
		
			_onCalendarHandle: function() {

				var oView = this.getView();
				var oModel = this.getView().getModel();
				sap.ui.getCore().setModel(oModel);
				
				var oCal1 = oView.byId("PC1");
				var that = this;
			//	var oRefDate = new Date();
						
			//	oCal1.startDate(oRefDate);
				oCal1.destroyRows();
				
		/*		
			 oCal1.addView(
						new sap.m.PlanningCalendarView({
							key: "customView11",
							intervalType: sap.ui.unified.CalendarIntervalType.Day,
							description: "Week4",
							intervalsS: 31,
							intervalsM: 31,
							intervalsL:31,
							showSubIntervals: false
						})
					);    
                   oCal1.setViewKey(oCal1.getViews()[0].getKey());
			
	
                          oCal1.addView(
						new sap.m.PlanningCalendarView({
							key: "customView0",
							intervalType: sap.ui.unified.CalendarIntervalType.Hour,
							description: "Day",
							intervalsS: 8,
							intervalsM: 8,
							intervalsL:8,
							showSubIntervals: true
						})
					);    
                   oCal1.setViewKey(oCal1.getViews()[0].getKey());
                 
                 	 oCal1.addView(
						new sap.m.PlanningCalendarView({
							key: "customView1",
							intervalType: sap.ui.unified.CalendarIntervalType.Day,
							description: "Week",
							intervalsS: 7,
							intervalsM: 7,
							intervalsL:7,
							showSubIntervals: true
						})
					);    
                   oCal1.setViewKey(oCal1.getViews()[0].getKey());
                   
                   
                   
                   
                   
                   
                   	 oCal1.addView(
						new sap.m.PlanningCalendarView({
							key: "customView2",
							intervalType: sap.ui.unified.CalendarIntervalType.Month,
							description: "Month",
							intervalsS: 1,
							intervalsM: 1,
							intervalsL: 1,
							showSubIntervals: true
						})
					);    
                   oCal1.setViewKey(oCal1.getViews()[0].getKey());
                   
                   oCal1.addView(
						new sap.m.PlanningCalendarView({
							key: "customView3",
							intervalType: sap.ui.unified.CalendarIntervalType.Month,
							description: "2 Months",
							intervalsS: 2,
							intervalsM: 2,
							intervalsL: 2,
							showSubIntervals: true
						})
					);    
                   oCal1.setViewKey(oCal1.getViews()[0].getKey());*/
	                     
                var zarea = oView.byId("SLCT_TEAMS").getSelectedKey();
              
                 
	         	var sRead = "/LeaveRequestPosUserSet";

				oModel.read(sRead, {
					
					filters: [new sap.ui.model.Filter({

						filters: [new sap.ui.model.Filter({
							path: "Area",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: zarea

						})],

						and: true

					})],

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

				

						var oDateRange;
						var person;
						var abs_type_title;
						var abs_type_type;
						var abs_type_icon;
						var abs_tooltip;
						var abs_text;
						
						var abs_hour;
						var abs_min;
						
						
						 var viewKey = oView.byId("PC1").getViewKey();
		               

						if (oData.results.length > 0) {
							for (var i = 0; i < oData.results.length; i++) {
								//escludo richieste rifiutate
                            //	if (oData.results[i].ZreqStatus === 'A' || oData.results[i].ZreqStatus === 'I') {
								//						var res = oData.results[i].Zdate.substring(8);
								
									if (oData.results[i].Name + " " + oData.results[i].Surname != person) {
									
									person = oData.results[i].Name + " " + oData.results[i].Surname;
	                               
	           
	                           
	                              
	                                var oRow = new sap.m.PlanningCalendarRow({
										icon: "sap-icon://employee",
										title: person      
									});
									oCal1.addRow(oRow);
								}
								
								
								
									var res = oData.results[i].Zdate;
								
									if (res != '') {
									
									var abs_date_start = oFormatYYyyymmdd.parse(res);
									 var abs_date_end = oFormatYYyyymmdd.parse(res);
										var abs_hour_start = oData.results[i].Ztimestart.substring(0,2);
										
										/*if (abs_hour_start != '') {
									//	if (1 == 2) {
											
										var abs_min_start = oData.results[i].Ztimestart.substring(3);
										var abs_hour_end = oData.results[i].Ztimeend.substring(0,2);
										var abs_min_end = oData.results[i].Ztimeend.substring(3);
										
	                                    abs_date_start.setHours(abs_hour_start,abs_min_start );
	                                    
	                                    abs_date_end.setHours(abs_hour_end,abs_min_end );
	                                    
	                                   
				
				
										} else {*/
										if(oData.results[i].Ztimestart == '' || oData.results[i].Ztimeend == ''){
											abs_text = "Giornata intera";
											abs_tooltip = " per giornata intera"
										}else{
										 abs_text = "Dalle " + oData.results[i].Ztimestart + " alle " + oData.results[i].Ztimeend;
										 abs_tooltip = " dalle ore "  + oData.results[i].Ztimestart + " alle ore " + oData.results[i].Ztimeend;
										}
	
	                                    abs_date_end.setHours('23','59');
	                                     //		abs_date_end.setDate(abs_date_end.getDate()+1);
	                                     
	    
				
									//	}
					//		
					
					that.sAppointmentTitle = '';
					
	                switch (oData.results[i].ZabsType){
	                		case "0001":
	                	abs_type_title = "Permesso";
	                	that.sAppointmentTitle = "Permesso ID: " + formatter.formatRequestId(oData.results[i].ZrequestId) + " \nStato: " + formatter.formatStatus(oData.results[i].ZreqStatus) + " \nGiorno: " + formatter.formatDate(oData.results[i].Zdate);
				//		abs_type_type = sap.ui.unified.CalendarDayType.Type08;
						abs_tooltip = "Permesso" + abs_tooltip;
					
						
						abs_type_icon = "sap-icon://customer-history";
	                
	                	break;
	                	case "0002":
	                	abs_type_title= "Ferie";
	                	that.sAppointmentTitle = "Ferie ID: " + formatter.formatRequestId(oData.results[i].ZrequestId) + " \nStato: " + formatter.formatStatus(oData.results[i].ZreqStatus) + " \nGiorno: " + formatter.formatDate(oData.results[i].Zdate);
				//		abs_type_type = sap.ui.unified.CalendarDayType.Type07;
						abs_tooltip ="Ferie" + abs_tooltip;
					
					
						abs_type_icon = "sap-icon://general-leave-request";
						break;
							case "0003":
	                	abs_type_title = "Recupero";	
	                	that.sAppointmentTitle = "Recupero ID: " + formatter.formatRequestId(oData.results[i].ZrequestId) + " \nStato: " + formatter.formatStatus(oData.results[i].ZreqStatus) + " \nGiorno: " + formatter.formatDate(oData.results[i].Zdate);
				//		abs_type_type = sap.ui.unified.CalendarDayType.Type06;
						
						abs_tooltip = "Recupero" + abs_tooltip;
				
					
						abs_type_icon = "sap-icon://cause";
						break;
							case "0004":
	                	abs_type_title = "ROL";	
	                	that.sAppointmentTitle = "ROL ID: " + formatter.formatRequestId(oData.results[i].ZrequestId) + " \nStato: " + formatter.formatStatus(oData.results[i].ZreqStatus) + " \nGiorno: " + formatter.formatDate(oData.results[i].Zdate);
				//		abs_type_type = sap.ui.unified.CalendarDayType.Type05;
						abs_tooltip = "ROL" + abs_tooltip;
					
						abs_type_icon = "sap-icon://customer-history";
						
								
	                }
	                
	                if (oData.results[i].ZreqStatus == "A"){
						abs_type_type = sap.ui.unified.CalendarDayType.Type08;
								
				         }else	{
			              abs_type_type = sap.ui.unified.CalendarDayType.Type05;
			                	
			               }	
			                		
			                		
	                var oAppointment = new sap.ui.unified.CalendarAppointment({
					startDate: abs_date_start,
				//	 nowP.setDate(nowP.getDate()-365);
				//	endDate: oFormatYYyyymmdd.parse(res),
					endDate: abs_date_end,
					type: abs_type_type,
					title: abs_type_title,
					tooltip: abs_tooltip,
					text: abs_text,
					icon: abs_type_icon,
				});
				 oRow.addAppointment(oAppointment);
	
				 
				 
			/*	 	 var oHeaders1 = new sap.ui.unified.CalendarAppointment({
					startDate: abs_date_start,
				//	 nowP.setDate(nowP.getDate()-365);
				//	endDate: oFormatYYyyymmdd.parse(res),
					endDate: abs_date_end,
					type: abs_type_type,
					title: abs_type_title,
					tooltip: abs_tooltip,
					text: abs_text,
					icon: abs_type_icon
				
				});
				 oRow.addIntervalHeader(oHeaders1);
				 */
				 
	
							/*			oCal1.addSpecialDate(new DateTypeRange({
											startDate: oFormatYYyyymmdd.parse(res),
											type: "Type01",
											tooltip: "Permesso Id: " + formatter.formatRequestId(oData.results[i].ZrequestId) + " Stato: " + oData.results[i].ZreqStatus 
	                                           
										}));
									*/
							}
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
				//	console.log(oError);

					alert("Error in read: " + oError.message);
				}

			
	      /*   var oRow = new sap.m.PlanningCalendarRow({
				icon: "sap-icon://employee",
				title: "Sandro Elmo"
			});
			oCal1.addRow(oRow);
	                     
	                     
	                     var oAppointment = new sap.ui.unified.CalendarAppointment({
					startDate: new Date("2018", "5", "01", "00", "00"),
					endDate: new Date("2018", "5", "01", "24", "00"),
					type: sap.ui.unified.CalendarDayType.Type08,
					title: "F",
					tooltip: "Test",
			//		text: "Test",
					icon: "sap-icon://sap-ui5"
				});
				 oRow.addAppointment(oAppointment);
				 
				          var oAppointment2 = new sap.ui.unified.CalendarAppointment({
						startDate: new Date("2018", "5", "02", "00", "00"),
					endDate: new Date("2018", "5", "02", "24", "00"),
					type: sap.ui.unified.CalendarDayType.Type08,
					title: "F",
					tooltip: "Test",
			//		text: "Test",
					icon: "sap-icon://sap-ui5"
				});
				 oRow.addAppointment(oAppointment2);
				 
				          var oAppointment3 = new sap.ui.unified.CalendarAppointment({
						startDate: new Date("2018", "5", "03", "00", "00"),
					endDate: new Date("2018", "5", "03", "24", "00"),
					type: sap.ui.unified.CalendarDayType.Type08,
					title: "F",
					tooltip: "Test",
				//	text: "Test",
					icon: "sap-icon://sap-ui5"
				});
				 oRow.addAppointment(oAppointment3);*/
				 
				 
				 
				/* var oHeaders1 = new sap.ui.unified.CalendarAppointment({
					startDate: new Date("2018", "5", "01", "00", "00"),
					endDate: new Date("2018", "5", "01", "24", "00"),
					type: sap.ui.unified.CalendarDayType.Type05,
					title: "New Appointment Sandro H"
				
				});
				 oRow.addIntervalHeader(oHeaders1);
				 */

			},
			
			
			handleViewChange: function (oEvent) {
					this._onBindingChange();
			},
			
				handleTeamsSelect: function(oEvent) {
				var oTeams = oEvent.getSource();
				var aTeamsKey = oTeams.getSelectedKey();
				
					this._onCalendarHandle();
				
			},
			
			

			handleAppointmentSelect: function (oEvent) {
					var oAppointment = oEvent.getParameter("appointment");
				if (oAppointment) {
					MessageBox.show(this.sAppointmentTitle + " \nDettaglio ore: " +
				oAppointment.getText());
				} else {
					var aAppointments = oEvent.getParameter("appointments");
					var sValue = aAppointments.length + " eventi selezionati, scegliere un intervallo di date minore per visualizzare il dettaglio.";
					MessageBox.show(sValue);
				}
			},
			
			handleSelectionFinish: function(oEvent) {
				var aSelectedKeys = oEvent.getSource().getSelectedKeys();

				this.getView().byId("PC1").setBuiltInViews(aSelectedKeys);
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