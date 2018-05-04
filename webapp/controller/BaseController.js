sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/unified/DateTypeRange',
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"eone_zleave_req_create/model/formatter"
], function(Controller, DateTypeRange, JSONModel, History, MessageBox, formatter) {
	"use strict";
     var sRendered; 
     jQuery.sap.require("sap.m.MessageBox");
     
	return Controller.extend("eone_zleave_req_create.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		onNavBack: function (oEvent) {
			
			
		//	if(oEvent && oView!=undefined){
			////////SE su pressione tasto back faccio refresh tabella taskset
			var oView, oViewW;
			oView = this.getView();
			var sPrefix = oView.getId().substring(0, oView.getId().indexOf("---")) + "---"; 
					oViewW = sap.ui.getCore().byId(sPrefix + "V1S");
					var oTable = oViewW.byId("__table0");
					oTable.getBinding("items").refresh();
			////////
	//		}
			
			
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("view1", {});
			}
		},
		
		
		handlePopHelp: function(oEvent){
	        var oVbox;
	        var oView = this.getView();
	        var sViewName = oView.getProperty("viewName");
	        var sShortName = sViewName.substring(sViewName.lastIndexOf(".") + 1, sViewName.length);
			if (!this._oPopoverHelp) {
				

				this._oPopoverHelp = sap.ui.xmlfragment("eone_zleave_req_create.view.PopoverHelp", this, "eone_zleave_req_create.controller.BaseController");

				this.getView().addDependent(this._oPopoverHelp);
		
				
			}
			
			oVbox = this._oPopoverHelp.getContent()[0];
			//oVbox = sap.ui.getCore().byId("Vbox");
			oVbox.destroyItems();
            
		
			var oHTML, oHTML_Footer;

			if (sShortName == "View1") {
				oHTML = new sap.ui.core.HTML({
					content: 
					' <strong> Inserire una richiesta </strong> ' +
						'<ul>' +
						
							
								' <li>Selezionare il tipo di richiesta tramite l\'apposito menu a tendina. </li>' +
								' <li>Indicare se la richiesta si riferisce ad un piano ferie già approvato dalla direzione. Se viene selezionato  "SI"  la richiesta viene inoltrata direttamente ' +
								' all&apos; amministrazione senza passare dall&apos; approvatore. </li>' +
								' <li> Indicare l\'approvatore (solitamente il TL) a cui inoltrare la richiesta. </li> ' +
								' <li> Inserire eventuali note per l\'approvatore tramite l\'apposito box di testo presente nel form. </li> ' +
								
								' <li> Scegliere il/i giorni dal calendario. Nella tabella generata per ogni giorno selezionato  ' +
								' è possibile selezionare un intervallo orario (es. 9:00-13:00), oppure in caso di giornata intera indicare solo il totale ore. ' +
								
								' Non sono consentiti intervalli orari inferiori ai 30 minuti. Se l\'intervallo orario non viene indicato viene suggerito un valore ' +
								' di 8 ore che può eventualmente essere modificato in caso di part time o orari diversi. </li>' +
								
								
								
								' <li> Cliccando sul bottone "Invia", la richiesta verrà inoltrata all\'approvatore e notificata all\'ufficio ' +
								' amministrativo di competenza. </li>' +
								
			               	'</ul>' +
			                
			                '<strong> Visualizzare lo storico e modificare le richieste. </strong> '+
			                '<ul>' + 
			                ' <li> Cliccare sul bottone "Storico", ' + 
							' verrà visualizzata una lista riportante lo storico delle richieste effettuate dalla quale si potrà visualizzare il dettaglio ed eventualemente modificare/eliminare la singola richiesta. </li>' +
							'</ul>',
					sanitizeContent: true
				});
			}else if(sShortName == "View1s"){
				oHTML = new sap.ui.core.HTML({
					content: '<strong>Storico delle richieste</strong>' +
						'<ul>' +
						' La pagina mostra lo storico delle richieste effettuate, con una indicazione circa il loro stato.' +
						' E\' possibile filtrare la lista di richieste attraverso la barra dei filtri. Le richieste possono essere filtrate' +
						' per tipo ("Permesso", "Ferie", "Recupero", "ROL"), per stato ("Inviata", "Approvata", "Rifiutata") o combinando i due filtri singoli.' +
						' Cliccando su un elemento della lista, è possibile visualizzare il dettaglio di questa.' +
						' Tramite il tab info utente, è possibile visualizzare un riepilogo "indicativo" delle ore inserite dall\'utente per l\'anno in corso.' +
						' ' +
						'</ul>',
					sanitizeContent: true
				});
			}else{
					oHTML = new sap.ui.core.HTML({
					content: '<strong>Pagina di riepilogo richiesta</strong>' +
						'<ul>' +
						' La pagina mostra un riepilogo della richiesta selezionata. E\' presente una lista dei giorni oggetto della richiesta, nonchè una indicazione circa l\'approvatore designato e le evantuali note' +
						' inserite dall\'approvatore. Nel caso in cui la richiesta non sia stata ancora processata, è possibile modificarla o eliminarla' +
						' attraverso gli appositi bottoni ("Modifica" o "Elimina").' +
						'</ul>',
					sanitizeContent: true
				});
			}

		
			oVbox.addItem(oHTML);

			this._oPopoverHelp.openBy(oEvent.getSource());
		
		},
		
				// chiude help
			handleCloseButton: function(oEvent) {
				this._oPopoverHelp.close();
			},

	
			onRefreshTable: function (oEvent) {
				
			var oView = this.getView();
			var oTable = oView.byId("__table0");
			oTable.getBinding("items").refresh();
			
		
			},
		
		
			onNavBackDirect        : function (oEvent) {
			

	 //		this.getRouter().navTo("view1s", {});
			
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
			//	this.getRouter().navTo("view1s", {}, true );
			    this.getRouter().navTo("view1s", {});
			}
			
		},
		

			onTimePickerChange: function(oArg) {
				
			var aCells = oArg.getSource().getParent().getAggregation("cells");
			var aFullday_cell = aCells[3];
				
						
            var oView ;
		    oView = this.getView();
		     	
		    // gestione new con tabella
		     	
		    var oObject = oArg.getSource().getBindingContext().getObject();
		    var oExpTable = oView.byId("GiorniTabIns");
			var aItems = oExpTable.getAggregation("items");
			var oInput = oArg.getSource();
			var oItem;

		     var aZtimestart = oObject.inizio;
			 var aZtimeend = oObject.fine;
			 
			 var aOreDay = oObject.oretotday; 


		     	//////// vecchia gestione
				/*var aSelectedDates = this.cale.getSelectedDates();

				var aZtimestart = this.timeFrom.getValue();
				var aZtimeend = this.timeTo.getValue();
				*/
				
				var aOreTot,
					aOrep;
				var aOreDay = 8.0;
				
				var tim1 = aZtimestart,
						tim2 = aZtimeend;
					var ary1 = tim1.split(':'),
						ary2 = tim2.split(':');
					var minsdiff = parseInt(ary2[0], 10) * 60 + parseInt(ary2[1], 10) - parseInt(ary1[0], 10) * 60 - parseInt(ary1[1], 10);
					var aTstart = parseInt(ary1[0], 10);
					var aTstartMin = parseInt(ary1[1], 10);
					var aTend = parseInt(ary2[0], 10);
					var aTendMin = parseInt(ary2[1], 10);
				//	var aTendMinLast = aTendMin.substring(1, 1);
					var aTstartMinLast = aZtimestart.substring(4);
						var aTendMinLast = aZtimeend.substring(4);
				
				// vecchia gestione
			/*	this.timeFrom.setValueState(sap.ui.core.ValueState.None);	
				this.timeTo.setValueState(sap.ui.core.ValueState.None);*/

				var minsEnd = parseInt(ary2[0], 10) * 60 + parseInt(ary2[1], 10);
				var minsStart = parseInt(ary1[0], 10) * 60 + parseInt(ary1[1], 10);
				
					//controllo che almeno un giorno sia selezionato
					// vecchia gestione
		/*		if (aSelectedDates.length === 0) {

					//jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show(
						"Selezionare prima i giorni", {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.CLOSE]

						});
				
					return "KO";
				}*/


                //////////////////////////////////////////
                if (aZtimestart !== "") {
						//controllo correttezza inserimento intervallo ore
					//	if ((aTstart < 9 || aTstart > 18) || (aTstart === 13 || (aTstart === 14 & aTstartMin < 30)) ) {
					//	(SE) richiesta modifica da WAFA consentire richiesta da ore 14	
					//		if ((aTstart < 8 || aTstart > 19) || (aTstart === 13 ) ) {
							if ( (aTstart < 8 || aTstart > 19) ) {
							
								oInput.setValue("");
				

								/*	for(var i=0;i<this._data.GiorniTab.length;i++){
										if(this._data.GiorniTab[i] == oObject )
												{
												
													this._data.GiorniTab[i].inizio = ""; 
										//			this.jModel.refresh();
													break;//quit the loop
												}
									}*/
									
								
						
								   // vecchia gestione			
									//			oView.byId("LRS4_DAT_STARTTIME").setValue("");
									//		this.timeFrom.setValueState(sap.ui.core.ValueState.Error);
									
										sap.m.MessageBox.show(
								"Inserimento ora inizio non corretto. Ora inizio >= 8:00, <= 19:00 ", {
									icon: sap.m.MessageBox.Icon.ERROR,
									title: "Error",
									actions: [sap.m.MessageBox.Action.CLOSE]
		
								});
								
								//		oInput.setValueState(sap.ui.core.ValueState.Error);
								return;		
							} 
							
						//controllo correttezza inserimento intervallo minuti inizio
						if (aTstartMinLast !== "0") {
		
							oInput.setValue("");

							//	oInput.setValueState(sap.ui.core.ValueState.Error);
								
								///jQuery.sap.require("sap.m.MessageBox");
							sap.m.MessageBox.show(
								"Ora inizio, sono selezionabili solo i minuti 00 o 30.", {
									icon: sap.m.MessageBox.Icon.ERROR,
									title: "Error",
									actions: [sap.m.MessageBox.Action.CLOSE]
		
								});
								
						    // vecchia gestione
							/*	oView.byId("LRS4_DAT_STARTTIME").setValue("");
								this.timeFrom.setValueState(sap.ui.core.ValueState.Error);*/
								
							return;
						}
				
				
                }
			
			///////////////////////////////////////	
			if (aZtimeend !== "") {
						//controllo correttezza inserimento ora fine
			//	if ( (aTend > 18 || aTend <= 9) || ((aTend === 13 & aTendMin > 0) || (aTend === 14 & aTendMin < 30)) ) {
					
			//	if ( (aTend > 19 || aTend <= 8) || ((aTend === 13 & aTendMin > 0) || (aTend === 14 & aTendMin < 30)) ) {
			if ( (aTend > 19 || aTend <= 8) ) {
				
				
						oInput.setValue("");

						//	oInput.setValueState(sap.ui.core.ValueState.Error);
							
								sap.m.MessageBox.show(
						"Inserimento intervallo ore non corretto. Ora fine > 8:00, <= 19:00", {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.CLOSE]

						});
							
						 // vecchia gestione
							/*oView.byId("LRS4_DAT_ENDTIME").setValue("");
							this.timeTo.setValueState(sap.ui.core.ValueState.Error);*/
					return;
				}
				
					//controllo correttezza inserimento intervallo minuti fine
				if (aTendMinLast !== "0") {

					oInput.setValue("");
						
					//oInput.setValueState(sap.ui.core.ValueState.Error);
							
										//jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show(
						"Ora fine, sono selezionabili solo i minuti 00 o 30.", {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.CLOSE]

						});
						
					 // vecchia gestione		
					/*oView.byId("LRS4_DAT_ENDTIME").setValue("");
					this.timeTo.setValueState(sap.ui.core.ValueState.Error);*/
					return; 
				}
				
				
			}	
			
			/////////////////////////////////////
				 // vecchia gestione
			/*			//controllo correttezza inserimento intervallo ore
				if  (aZtimestart === "" & aZtimeend !== "")  {
					oInput.setValueState(sap.ui.core.ValueState.Error);
                    // vecchia gestione	
			     	//	this.timeFrom.setValueState(sap.ui.core.ValueState.Error);
		
				
				}	
				
							//controllo correttezza inserimento intervallo ore
				if  (aZtimestart !== "" & aZtimeend === "")  {
						oInput.setValueState(sap.ui.core.ValueState.Error);
				// vecchia gestione	
					//this.timeTo.setValueState(sap.ui.core.ValueState.Error);
				
				}	*/
			////////////////////////////////////
			
				// vecchia gestione	
			//	if (aZtimestart === "" & aZtimeend === "") {

				// vecchia gestione	
				//	aOreTot = parseFloat(aSelectedDates.length * 8);

			//	aOrep = 8;
					
			//	} else if (aZtimestart !== "" & aZtimeend !== "") {
                    
                if (aZtimestart !== "" & aZtimeend !== "") {
		                    // controllo che inizio non sia maggiore di fine
					  if (minsStart >= minsEnd) {
		
							oInput.setValue("");
								
							oInput.setValueState(sap.ui.core.ValueState.Error);
							
								//jQuery.sap.require("sap.m.MessageBox");
							sap.m.MessageBox.show(
								"Inserimento intervallo ore non corretto: ora inizio deve essere antecedente a ora fine", {
									icon: sap.m.MessageBox.Icon.ERROR,
									title: "Error",
									actions: [sap.m.MessageBox.Action.CLOSE]
		
								});
									// vecchia gestione	
							//	oView.byId("LRS4_DAT_STARTTIME").setValue("");
						//	this.timeFrom.setValueState(sap.ui.core.ValueState.Error);
						//	this.timeTo.setValueState(sap.ui.core.ValueState.Error);
							return;
						}
						
						
					aOrep = minsdiff / 60;	
					//aOrep = parseFloat(minsdiff / 60);
					//Number(aOrep).toFixed(1);

					// alcuni utenti fanno orari di pausa diversi, 
					// togliamo di deafault 1,5 ore ma lasciamo libero il campo per eventuale correzione utente
					//sottraggo ore pausa in caso di assenza a cavallo tra mattina e rientro nel pome
					/*if (aTstart < 13 & ((aTend > 14) || (aTend === 14 & aTendMin >= 30))) {
						aOrep = aOrep - 1.5;
					}*/
					
					if (aTstart < 13 & ((aTend > 14) || (aTend === 14 & aTendMin >= 30))) {
					 // aFullday_cell.setValueState(sap.ui.core.ValueState.Warning);
					//  aFullday_cell.setValueStateText("Considerare ore pausa se necessario");
						aOrep = aOrep - 1.5;
							//jQuery.sap.require("sap.m.MessageBox");
							sap.m.MessageBox.show(
								"Vengono sottratte 1.5 ore di pausa pranzo, in causa di durata pausa pranzo minore o maggiore correggere il totale ore", {
									icon: sap.m.MessageBox.Icon.WARNING,
									title: "Attenzione",
									actions: [sap.m.MessageBox.Action.CLOSE]
		
								});
					}


					if (aOrep > 8) {
						aOrep = 8;
					}


                   aFullday_cell.setValue(aOrep); 
				//	aOreTot = parseFloat(aSelectedDates.length * aOrep);
				//	Number(aOreTot).toFixed(1);

				}
				
				 if (aZtimestart == "" & aZtimeend == "") {
		             
                    aFullday_cell.setValue("8"); 
	
				}
				
		//		this._checkFullDay();
                // vecchia gestione, calcolo ore tot lo eseguo ora su array tabella
				//this.getView().byId("LRS4_DAT_ORETOT").setValue(aOreTot);
			},
			
			
			// richiamato per controllo campi ore quando invio richiesta
				onTimePickerCheck: function() {

               	var oView ;
		     	oView = this.getView();
		     	
		     	var oExpTable = oView.byId("GiorniTabIns");
				var aItems = oExpTable.getAggregation("items");
				var oItem;
			
				var aZtimestart_cell;
				var aZtimeend_cell;
				var aZtimestart;
				var aZtimeend;
				var error = 'N';
			    
			    	for (var i = 0; i < aItems.length; i++) {
							oItem = aItems[i];
					
		     				aZtimestart_cell = oItem.getAggregation("cells")[1];
		     				aZtimestart = aZtimestart_cell.getValue(); 
							aZtimeend_cell = oItem.getAggregation("cells")[2];
							aZtimeend = aZtimeend_cell.getValue(); 
							
							if  (aZtimestart === "" & aZtimeend !== "")  {

						
								//	oView.byId("LRS4_DAT_STARTTIME").setValue("");
								//	this.timeFrom.setValueState(sap.ui.core.ValueState.Error);
									aZtimestart_cell.setValueState(sap.ui.core.ValueState.Error);
									aZtimestart_cell.setValueStateText("Controllare inserimento");
									
										//jQuery.sap.require("sap.m.MessageBox");
							sap.m.MessageBox.show(
								"Inserimento ora inizio non corretto", {
									icon: sap.m.MessageBox.Icon.ERROR,
									title: "Error",
									actions: [sap.m.MessageBox.Action.CLOSE]
		
								});
								
							error = 'Y';
							break;
										
					    	}  
					    	
					    		if  (aZtimestart !== "" & aZtimeend === "")  {

						
								//	oView.byId("LRS4_DAT_STARTTIME").setValue("");
								//	this.timeFrom.setValueState(sap.ui.core.ValueState.Error);
								aZtimeend_cell.setValueState(sap.ui.core.ValueState.Error);
								aZtimeend_cell.setValueStateText("Controllare inserimento");
								
									//	jQuery.sap.require("sap.m.MessageBox");
								sap.m.MessageBox.show(
									"Inserimento ora fine non corretto", {
										icon: sap.m.MessageBox.Icon.ERROR,
										title: "Error",
										actions: [sap.m.MessageBox.Action.CLOSE]
			
									});
									
							error = 'Y';
							break;
										
					    	}
					    	
					    	if  ( error == 'N' ) {
									aZtimestart_cell.setValueState(sap.ui.core.ValueState.None);
								    aZtimeend_cell.setValueState(sap.ui.core.ValueState.None);
								    aZtimestart_cell.setValueStateText("");
								    aZtimeend_cell.setValueStateText("");
									
								}
			    	
			    	}
			    	
			    	
			    	var CheckErrorFullDay =  this._checkFullDays();
			    	if (CheckErrorFullDay === "KO") {
			    		error = 'Y';
			    	}
			    	
			    	
			    	if  ( error == 'Y' ) {
			    	return "KO";
			    	}
			    	
		     	// vecchia gestione
		     /*	var aZtimestart = this.timeFrom.getValue();
				var aZtimeend = this.timeTo.getValue();*/
				
			/*	for(var i=0;i<this._data.GiorniTab.length;i++){
										if(this._data.GiorniTab[i] == oObject )
												{
												
												if(	this._data.GiorniTab[i].inizio  === "" & this._data.GiorniTab[i].inizio !== "") {
												oInput.setValueState(sap.ui.core.ValueState.Error);
													break;//quit the loop
												}
									}*/
									
								//	oInput.setValueState(sap.ui.core.ValueState.Error);
		     	
				/////////////////////////////////////
			
	/*					//controllo correttezza inserimento intervallo ore
				if  (aZtimestart === "" & aZtimeend !== "")  {

					//jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show(
						"Inserimento ora inizio non corretto", {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.CLOSE]

						});
					oView.byId("LRS4_DAT_STARTTIME").setValue("");
					this.timeFrom.setValueState(sap.ui.core.ValueState.Error);
					return "KO";
				}	
				
							//controllo correttezza inserimento intervallo ore
				if  (aZtimestart !== "" & aZtimeend === "")  {

				//	jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show(
						"Inserimento ora fine non corretto", {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.CLOSE]

						});
								oView.byId("LRS4_DAT_ENDTIME").setValue("");
					this.timeTo.setValueState(sap.ui.core.ValueState.Error);
					return "KO";
				}*/	
			////////////////////////////////////

				
				
				},
			// controllo singolo campo di input tot ore day appena modificato	
			handleTotday: function(oEvent) {
 
		     	var aCells = oEvent.getSource().getParent().getAggregation("cells");
				//var oInput;
				//var oSaveButton = aCells[3].getAggregation("content")[1];
			//	oSaveButton.setEnabled(true);
				var aZtimestart_cell = aCells[1];
				var aZtimeend_cell = aCells[2];
				var aFullday = aCells[3];
				
				var	aZtimestart = aZtimestart_cell.getValue(""); 
							
				var	aZtimeend = aZtimeend_cell.getValue(""); 
				var  aOreDay = 0;
				
					var tim1 = aZtimestart,
						tim2 = aZtimeend;
					var ary1 = tim1.split(':'),
						ary2 = tim2.split(':');
					var aTstart = parseInt(ary1[0], 10);
					var aTstartMin = parseInt(ary1[1], 10);
					var aTend = parseInt(ary2[0], 10);
					var aTendMin = parseInt(ary2[1], 10);	
					var minsdiff = parseInt(ary2[0], 10) * 60 + parseInt(ary2[1], 10) - parseInt(ary1[0], 10) * 60 - parseInt(ary1[1], 10);
					var 	aTimeDiff = minsdiff / 60;	
					var 	error = 'N';	
				
				var chk = aFullday.getValue();
				
				if (chk != "") {
				aOreDay = parseFloat(aFullday.getValue());
				
					if (aZtimestart != "" & aZtimeend != "") {
						
									if (aOreDay >  aTimeDiff) { error = "Y";}
								
								
											if (aTstart < 13 & ((aTend > 14) || (aTend === 14 & aTendMin >= 30))) {
											 // aFullday_cell.setValueState(sap.ui.core.ValueState.Warning);
											//  aFullday_cell.setValueStateText("Considerare ore pausa se necessario");
											if (aTimeDiff  >  (aOreDay + 2)) { error = "Y";}
											
												
											} else {
												
													if (aTimeDiff  != aOreDay) { error = "Y";}
												
											}
										if (error == "Y")	  {		
														//	jQuery.sap.require("sap.m.MessageBox");
										sap.m.MessageBox.show(
											"Attenzione: Intervallo ora inizio ora fine non rispecchia tot. ore", {
												icon: sap.m.MessageBox.Icon.ERROR,
												title: "Error",
												actions: [sap.m.MessageBox.Action.CLOSE]
					
											});
										}	
							}
					
					
				} else{
				aOreDay = chk;
				}
				
				if  ( (chk < "8" & (aZtimestart == "" || aZtimeend == ""))  || error == "Y")   {
					
				aZtimestart_cell.setValueState(sap.ui.core.ValueState.Error);
				aZtimeend_cell.setValueState(sap.ui.core.ValueState.Error);
				//		aZtimestart.setEnabled(true);
				//			aZtimeend.setEnabled(true);
				//			this.jModel.refresh();
				
				} else {
					
				aZtimestart_cell.setValueState(sap.ui.core.ValueState.None);
				aZtimeend_cell.setValueState(sap.ui.core.ValueState.None);
				
				}
				
			    if (aOreDay == 0 || aOreDay == undefined || aOreDay == "") {
					
				aFullday.setValueState(sap.ui.core.ValueState.Error);
				
			    } else {
					
				aFullday.setValueState(sap.ui.core.ValueState.None);
				
				}
				
				
				// richiamo function di controllo per tutti i giorni selezionati
				this._checkFullDays();

			},	
			
			 // controllo tutte le righe dei giorni
				_checkFullDays: function() {
					
				var oView ;
		     	oView = this.getView();
		     	
		     	var oExpTable = oView.byId("GiorniTabIns");
				var aItems = oExpTable.getAggregation("items");
				var oItem;
			
				var aZtimestart_cell;
				var aZtimeend_cell;
				var aZtimestart;
				var aZtimeend;
				var error = 'N';
					var aFullday;
			    var aFullday_cell;
			    var aOreTot = 0;
			    var aOreDay = 0;
			  // var aFullday = aCells[3];
			  	var error = 'N';


				

			    	for (var i = 0; i < aItems.length; i++) {
							oItem = aItems[i];
					
					
					
						aZtimestart_cell = oItem.getAggregation("cells")[1];
		     			aZtimestart = aZtimestart_cell.getValue(""); 
						aZtimeend_cell = oItem.getAggregation("cells")[2];
						aZtimeend = aZtimeend_cell.getValue(""); 
						
						aFullday_cell = oItem.getAggregation("cells")[3];
						
					var tim1 = aZtimestart,
						tim2 = aZtimeend;
					var ary1 = tim1.split(':'),
						ary2 = tim2.split(':');
					var aTstart = parseInt(ary1[0], 10);
					var aTstartMin = parseInt(ary1[1], 10);
					var aTend = parseInt(ary2[0], 10);
					var aTendMin = parseInt(ary2[1], 10);	
					var minsdiff = parseInt(ary2[0], 10) * 60 + parseInt(ary2[1], 10) - parseInt(ary1[0], 10) * 60 - parseInt(ary1[1], 10);
					var 	aTimeDiff = minsdiff / 60;	
					var 	error = 'N';	
						
					    var chk = aFullday_cell.getValue();

					    aOreDay = aFullday_cell.getValue();
					    
						if (aOreDay != "") {
						aOreDay  = parseFloat(aOreDay);
					    aOreTot = parseFloat(aOreDay + aOreTot);
					    Number(aOreTot).toFixed(1);
					    
					    	if (aZtimestart != "" & aZtimeend != "") {
						
									if (aOreDay >  aTimeDiff) { error = "Y";}
								
								
											if (aTstart < 13 & ((aTend > 14) || (aTend === 14 & aTendMin >= 30))) {
											 // aFullday_cell.setValueState(sap.ui.core.ValueState.Warning);
											//  aFullday_cell.setValueStateText("Considerare ore pausa se necessario");
											if (aTimeDiff  >  (aOreDay + 2)) { error = "Y";}
											
												
											} else {
												
													if (aTimeDiff  != aOreDay) { error = "Y";}
												
											}
							}
						} 

                        // se oretot è minore di 8 è necessario valorizzare i timepicker
					//	if (chk < "8" & (aZtimestart == "" || aZtimeend == "")) {
		     		    if  ( (chk < "8" & (aZtimestart == "" || aZtimeend == ""))  || error == "Y")   {
							
							aZtimestart_cell.setValueState(sap.ui.core.ValueState.Error);
							aZtimeend_cell.setValueState(sap.ui.core.ValueState.Error);
							
							error = 'Y';
							
					//		aFullday_cell = oItem.getAggregation("cells")[4];
					//		aFullday= aFullday_cell.setState(true);
				//			aFullday_cell = oItem.getAggregation("cells")[4];
				//			aFullday= aFullday_cell.setSelectedKey("NO"); 
						}  else {
					
							aZtimestart_cell.setValueState(sap.ui.core.ValueState.None);
							aZtimeend_cell.setValueState(sap.ui.core.ValueState.None);
							
						}	
						
						// oretot non può essere 0 o non valorizzato		
						if (aOreDay == 0 || aOreDay == undefined || aOreDay == "") {
							
							aFullday_cell.setValueState(sap.ui.core.ValueState.Error);
							error = 'Y';
						
					    } else {
							
							aFullday_cell.setValueState(sap.ui.core.ValueState.None);
						
						}
						
						
					} 
					
					// valorizzo oreTotali richiesta nella vista
					this.getView().byId("LRS4_DAT_ORETOT").setValue(aOreTot);
					
				    if  ( error == 'Y' ) {
			    		return "KO";
			    	}
				
					    			
				},
				
	/*			handleComboBoxFullDay: function(oEvent) {
 //var oObject = oEvent.getSource().getBindingContext().getObject();
		     	
		     	var aCells = oEvent.getSource().getParent().getAggregation("cells");
				//var oInput;
				//var oSaveButton = aCells[3].getAggregation("content")[1];
			//	oSaveButton.setEnabled(true);
				var aZtimestart = aCells[1];
				var aZtimeend = aCells[2];
				var aFullday = aCells[4];
				
					
				var chk = aFullday.getSelectedKey();
				if (chk == "NO") {
				
						aZtimestart.setEnabled(true);
							aZtimeend.setEnabled(true);
	
				} else {
			
						aZtimestart.setEnabled(false);
				
						aZtimeend.setEnabled(false);
				}

			},*/
			
/*			handleFullDay: function(oEvent) {
				 var oObject = oEvent.getSource().getBindingContext().getObject();
		     	
		     	var aCells = oEvent.getSource().getParent().getAggregation("cells");
				//var oInput;
				//var oSaveButton = aCells[3].getAggregation("content")[1];
			//	oSaveButton.setEnabled(true);
				var aZtimestart = aCells[1];
				var aZtimeend = aCells[2];
				var aFullday = aCells[4];
				
					
				var chk = aFullday.getState();
				if (!chk) {
					aZtimestart.setEnabled(true);
							aZtimeend.setEnabled(true);
				} else {
							aZtimestart.setValue("");
							aZtimestart.setEnabled(false);

							aZtimeend.setValue("");
						aZtimeend.setEnabled(false);
	
		
				}

			},*/
			
		/*	handleGiorniTabSelection: function() {
					
						var oView ;
		     	oView = this.getView();
		     	
		     	var oExpTable = oView.byId("GiorniTabIns");
				var aItems = oExpTable.getAggregation("items");
				var oItem;
			
				var aZtimestart_cell;
				var aZtimeend_cell;
				var aZtimestart;
				var aZtimeend;
				var error = 'N';
					var aFullday;
			    var aFullday_cell;
			    	
			    	for (var i = 0; i < aItems.length; i++) {
							oItem = aItems[i];
					
		     				aZtimestart_cell = oItem.getAggregation("cells")[1];
		     	//			aZtimestart = aZtimestart_cell.setValue(""); 
							aZtimeend_cell = oItem.getAggregation("cells")[2];
				//			aZtimeend = aZtimeend_cell.setValue(""); 
							
							aZtimestart.setValueState(sap.ui.core.ValueState.Error);
							aZtimeend.setValueState(sap.ui.core.ValueState.Error);
					//		aFullday_cell = oItem.getAggregation("cells")[4];
					//		aFullday= aFullday_cell.setState(true);
				//			aFullday_cell = oItem.getAggregation("cells")[4];
				//			aFullday= aFullday_cell.setSelectedKey("NO"); 
	
										
					    	} 
					    			
					    	} ,
					    	*/
			   
					    	
			checkCalendarSelection: function() {
			var aSelectedDates = this.cale.getSelectedDates();
			var oDate;
			var oView;
				oView = this.getView();
				
				
			//controllo che almeno un giorno sia selezionato
				if (aSelectedDates.length == 0) {

					//jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show(
						"Selezionare almeno un giorno!", {
							icon: sap.m.MessageBox.Icon.WARNING,
							title: "Error",
							actions: [sap.m.MessageBox.Action.CLOSE]

						});
				  
					return "KO";
				}
				
			    //CHECK GIORNI DI PREAVVISO///////////////////////////////
				var urgentReqLimit = new Date();
				urgentReqLimit.setDate(urgentReqLimit.getDate()+3);
				
				this.note.setValueState(sap.ui.core.ValueState.None);
				
					if (aSelectedDates.length > 0) {

					for (var i = 0; i < aSelectedDates.length; i++) {

						oDate = aSelectedDates[i].getStartDate();
						
						if (oDate <= urgentReqLimit & this.note.getValue() === "") {
							
								sap.m.MessageBox.show(
									"Attenzione: Per richieste con meno di 3 giorni di preavviso la direzione richiede la compilazione obbligatoria del campo note.", {
										icon: sap.m.MessageBox.Icon.WARNING,
										title: "Error",
										actions: [sap.m.MessageBox.Action.CLOSE]

									});
								
									this.note.setValueState(sap.ui.core.ValueState.Error);
								
							return "KO";
							
						}		

					}

				}
				
				// CHECK RECUPERO
				var absType = this.slctLvType.getSelectedKey();
				
					
							if (absType === "0003" & this.note.getValue() === "") {
							
								sap.m.MessageBox.show(
									"Attenzione: Specificare nelle note giorno/i di lavoro ai quali si riferisce il recupero. Es.: assenza del 21/09/2017 come recupero del 16/09/2017 8 ore", {
										icon: sap.m.MessageBox.Icon.WARNING,
										title: "Error",
										actions: [sap.m.MessageBox.Action.CLOSE]

									});
								
									this.note.setValueState(sap.ui.core.ValueState.Error);
								
							return "KO";
							
						}		
			
			},
			
			// NON USATA
			handleAbsTypeSelect: function(oEvent) {
				var oAbsType = oEvent.oSource;
				var aAbsTypeKey = oAbsType.getSelectedKey();
				
					if (aAbsTypeKey === "0003") {
							
								sap.m.MessageBox.show(
									"Attenzione: Specificare nelle note giorno/i di lavoro ai quali si riferisce il recupero. Es.: assenza del 21/09/2017 come recupero del 16/09/2017 8 ore", {
										icon: sap.m.MessageBox.Icon.INFORMATION,
										title: "Information",
										actions: [sap.m.MessageBox.Action.CLOSE]

									});
								
							return;
							
						}		

			},
			
				//SE START CUSTOM CALENDAR
			handleCalendarSelect: function(oEvent) {

				var oView;
				oView = this.getView();

				var oCalendar = oEvent.oSource;
				var aSelectedDates = oCalendar.getSelectedDates();

				var oDate;
				var oSpecialDate;
				var oDataSel = {
					selectedDates: []
				};

				var aSpecialDates = this.cale.getSpecialDates();
	
				var now = new Date();
				var oDateSapformat;
				var oDateITformat;
				var exist;
				
                    //Subtract one day from it
                    now.setDate(now.getDate()-1);
                    // get current date
                    //var date = Date.parse(oEvent.oSource.getLiveValue());
                
                // ad ogni cambio selezione giorni dal calendario resetto modello tabella righe giorni    
                // 	this._clearModelGiorniTab();
                //oView.byId("LRS4_DAT_OREDAY").setValue("");
                //  oView.byId("GiorniTabIns").getBinding("items").refresh();
				if (aSelectedDates.length > 0) {
					
					var pastReqLimit = new Date();
				    pastReqLimit.setDate(pastReqLimit.getDate()-60);

					for (var i = 0; i < aSelectedDates.length; i++) {

						oDate = aSelectedDates[i].getStartDate();
						
						// devo confrontare date e aggiungere solo i giorni non ancora presenti
						//nella tabella
						oDateSapformat = this.oFormatYyyymmdd.format(oDate);
						oDateITformat = formatter.formatDate(oDateSapformat);
						exist = "N";
						if (this._data.GiorniTab.length > 0) {
							
		
							for(var k=0; k<this._data.GiorniTab.length; k++) {
								if(this._data.GiorniTab[k].datasap == oDateSapformat )
									{
						              exist = "S";
				         			  break;
								    }
								    
		                	}
		                   
				                	if  (exist == "N") {
			                	 	
			                	 		this.addRow(oDateITformat, oDateSapformat);
			                		 }
			            
	                	 } else {
	                	 	
	                	 		this.addRow(oDateITformat, oDateSapformat);
	                	 }
		
					
					
						///CHECK DATE PASSATE///////////////////////////////////
						// if current date lower than past dates, show error
					//	if (oDate < now) {
					if (oDate < pastReqLimit) {
					
								//jQuery.sap.require("sap.m.MessageBox");
								sap.m.MessageBox.show(
									"Attenzione: Non è possibile selezionare date nel passato di oltre 60 giorni, " + oDate, {
										icon: sap.m.MessageBox.Icon.WARNING,
										title: "Error",
										actions: [sap.m.MessageBox.Action.CLOSE]

									});
								
								//	oCalendar.removeSelectedDate(oDater);
								oCalendar.removeAllSelectedDates();
								return;
							}
							
						//CHECK GIORNI NON LAVORATIVI///////////////////////////////
						var oDayOfWeek = this.oFormatDaysShort.format(oDate);

						if(oDayOfWeek === "sab" || oDayOfWeek === "sat" || oDayOfWeek === "dom" || oDayOfWeek=== "sun") {
						//if(oDate === sap.ui.unified.CalendarDayType.NonWorking) {
								//jQuery.sap.require("sap.m.MessageBox");
								sap.m.MessageBox.show(
									"Attenzione: Non è possibile selezionare giorni non lavorativi, rimuovere la selezione, " + oDate, {
										icon: sap.m.MessageBox.Icon.WARNING,
										title: "Error",
										actions: [sap.m.MessageBox.Action.CLOSE]

									});
								

								//oCalendar.removeAllSelectedDates();
								return;
							}
						
				
						// permetto inserimento di più richieste di diverso tipo nello stesso giorno
						//CHECK RIHIESTE SOVRAPPOSTE///////////////////////////////
						//	var	oDater = aSelectedDates[i].getStartDate();
					/*	oDate = this.oFormatYyyymmdd.format(oDate);
						for (var ii = 0; ii < aSpecialDates.length; ii++) {

							oSpecialDate = aSpecialDates[ii].getStartDate();
							oSpecialDate = this.oFormatYyyymmdd.format(oSpecialDate);

							if (oDate == oSpecialDate) {

								//jQuery.sap.require("sap.m.MessageBox");
								sap.m.MessageBox.show(
									"Attenzione: Non è possibile inserire più di una richiesta per giorno, controllare giorno " + oDate, {
										icon: sap.m.MessageBox.Icon.WARNING,
										title: "Error",
										actions: [sap.m.MessageBox.Action.CLOSE]

									});
								//	alert("Errore sovrapposizione giorni");
								//	oCalendar.removeSelectedDate(oDater);
								
								oCalendar.removeAllSelectedDates();
								return;
							}

						}*/
						
						///////////////////////////////////////
						// servirebbe per notificare a video date selezionate, serve un nuovo model json
						//	 oDataSel.selectedDates.push({Date:oDate});

					}
					
					// elimino dalla tabella dei giorni da inserire i giorni deselezionati dal calendario
					for(var kk=0; kk<this._data.GiorniTab.length; kk++) {
						exist = "N";
						
							for (var i = 0; i < aSelectedDates.length; i++) {

										oDate = aSelectedDates[i].getStartDate();

										oDateSapformat = this.oFormatYyyymmdd.format(oDate);
										
										if(this._data.GiorniTab[kk].datasap == oDateSapformat ) {
											exist = "S";
								         	break;
										} 	
							}
							
										if  (exist == "N") {
					                	 	
					                	 	this._data.GiorniTab.splice(kk,1); //removing 1 record from i th index.
											this.jModel.refresh();
					                	}
					}		
							

				} else {
					// resetto oreTotali e array giorni se nessun giorno del calendario è selezionato
					this.getView().byId("LRS4_DAT_ORETOT").setValue("0");
					this._clearModelGiorniTab();
				}
                // se seleziono più di un giorno disabilito timepicker e calcolo ore tot
                  //    commento per nuova versione con tabella editabile per giorno
				/*if (aSelectedDates.length > 1) {

					oView.byId("LRS4_DAT_STARTTIME").setValue("");
					oView.byId("LRS4_DAT_STARTTIME").rerender();
					oView.byId("LRS4_DAT_STARTTIME").setEnabled(false);

					oView.byId("LRS4_DAT_ENDTIME").setValue("");
					oView.byId("LRS4_DAT_ENDTIME").rerender();
					oView.byId("LRS4_DAT_ENDTIME").setEnabled(false);

					var aOreTot;

					var aOreDay = 8.0;

					aOreTot = parseFloat(aSelectedDates.length * aOreDay);
					Number(aOreTot).toFixed(1);

					oView.byId("LRS4_DAT_ORETOT").setValue(aOreTot);

				}*/
                 
                // se seleziono solo un giorno abilito timepicker e calcolo ore
                //    commento per nuova versione con tabella editabile per giorno
				/*if (aSelectedDates.length > 0 & aSelectedDates.length < 2) {

					oView.byId("LRS4_DAT_STARTTIME").setValue("");
					oView.byId("LRS4_DAT_STARTTIME").rerender();
					oView.byId("LRS4_DAT_STARTTIME").setEnabled(true);
					
					oView.byId("LRS4_DAT_ORETOT").setValue("");
					oView.byId("LRS4_DAT_ORETOT").rerender();
					oView.byId("LRS4_DAT_ORETOT").setEnabled(true);

					oView.byId("LRS4_DAT_ENDTIME").setValue("");
					oView.byId("LRS4_DAT_ENDTIME").rerender();
					oView.byId("LRS4_DAT_ENDTIME").setEnabled(true);

					var aZtimestart = this.timeFrom.getValue();
					var aZtimeend = this.timeTo.getValue();
					var aOreTot;
					var aOreDay = 8.0;


					// se uno dei due timepicker è vuoto cancello conteggio ore
					if (aZtimestart === "" || aZtimeend === "") {

						aOreTot = "";
						oView.byId("LRS4_DAT_ORETOT").setValue(aOreTot);
					}
                    
                    // se entrambi i timepicker non sono valorizzati assumo 8 ore di default
					if (aZtimestart === "" & aZtimeend === "") {

						aOreTot = parseFloat(aSelectedDates.length * aOreDay);

					}
                    
                    // valorizzo oreTot nella vista
					this.getView().byId("LRS4_DAT_ORETOT").setValue(aOreTot);

				}*/
  
                // se nessun giorno è selezionato disabilito timepicker
            //    commento per nuova versione con tabella editabile per giorno
			/*	if (aSelectedDates.length === 0) {

					oView.byId("LRS4_DAT_STARTTIME").setValue("");
					oView.byId("LRS4_DAT_STARTTIME").setEnabled(false);
					oView.byId("LRS4_DAT_STARTTIME").rerender();
					

					oView.byId("LRS4_DAT_ENDTIME").setValue("");
					oView.byId("LRS4_DAT_ENDTIME").setEnabled(false);
					oView.byId("LRS4_DAT_ENDTIME").rerender();
					

					oView.byId("LRS4_DAT_ORETOT").setValue("0");
					oView.byId("LRS4_DAT_ORETOT").setEnabled(false);
					oView.byId("LRS4_DAT_ORETOT").rerender();

				}*/
				
				

			},
			
				handleRemoveSelection: function(oEvent) {
				this.getView().byId("LRS4_DAT_CALENDAR").removeAllSelectedDates();
					this._clearModelGiorniTab();
				//	this._clearModel();
			},

			/*_clearModel: function() {
			var oData = {selectedDates:[]};
			this.oModel.setData(oData);
		},*/
		
		handleCalendarCancel: function(oEvent) {
				this.getView().byId("LRS4_DAT_CALENDAR").removeAllSelectedDates();
				//	this._clearModel();
			},
			
			onDisplayNotFound: function(oEvent) {
				//display the "notFound" target without changing the hash
				this.getRouter().getTargets().display("notFound", {
					fromTarget: "view1"
				});
			},
			
			onActionDialog: function(oEvent) {
					
					var oView = this.getView();
					var oViewId = oView.getId();
					var that = this;
					var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
					var absType = this.slctLvType.getSelectedKey();
					var tabsType = formatter.formatAbsence(absType);
				
					this.sButtonKey = oEvent.getSource().getId();
					 
					 
		//estraggo id della view 
		var sViewIdStart = oView.getId().indexOf("---");
		sViewIdStart = sViewIdStart + 3;
		
	    //		var sPrefix = oView.getId().substring(0, oView.getId().indexOf("---");) + "---"; 
	   var sViewID = oView.getId().substring(sViewIdStart); 
	   
	   // l'alternativa è basarsi sul nome della view completa
		//	var sViewName = oView.getViewName(); 
		
		// inserisco giorni selezionati un una stringa di testo per dettagli messagebox
	                    var aSelectedDates = this.cale.getSelectedDates();
						//var oDataSel = {
						//	selectedDates: []
					//	};
	 
							var oDate;
							var oDateTxt = "";
							var oComma = "";
			
				
							if (aSelectedDates.length > 0) {
								for (var i = 0; i < aSelectedDates.length; i++) {
									oDate = aSelectedDates[i].getStartDate();
									oDate = this.oFormatYyyymmdd.format(oDate);
									oDate = formatter.formatDate(oDate);
									//oDataSel.selectedDates.push({Date:oDate});
										if (oDateTxt !== "") {
										oComma = ", ";
										}
									
									oDateTxt = oDateTxt + oComma + oDate;
								  }
								}	
	
					
			//	if (oViewId ===	"__component0---V1") {	
						if (sViewID ===	"V1") {	
					
				
						 // controllo button selezionato
					   if (this.sButtonKey === oView.byId("btn1").getId()) {
						// se bt1 eseguo controlli per azione di modifica
					
						    
						 // richiamo function in baseController per verifica calendario     
						 var calCheck =  this.checkCalendarSelection();
	                    if (calCheck === "KO") {return;}
	                    
	                       // richiamo function in baseController per verifica ore   
	             //new tab       var timeCheck = this.onTimePickerChange();
	              //new tab       if (timeCheck === "KO") {return;}
	                 
	               //richiamo function in baseController per verifica ore campi vuoti   
	                    var timeCheckBlank = this.onTimePickerCheck();   
	                    if (timeCheckBlank === "KO") {
	                    	
	                    		//jQuery.sap.require("sap.m.MessageBox");
								sap.m.MessageBox.show(
									"Attenzione: Correggere gli inserimenti e riprovare ", {
										icon: sap.m.MessageBox.Icon.WARNING,
										title: "Error",
										actions: [sap.m.MessageBox.Action.CLOSE]

									});
									
									return;
	                    	
	                    }
	                    

						MessageBox.confirm("Confermi l'invio della richiesta?", {
							icon: MessageBox.Icon.QUESTION,
							title: "Invio Richiesta",
							actions: [MessageBox.Action.YES, MessageBox.Action.NO],
							initialFocus : MessageBox.Action.NO,
							id: "messageBoxId1",
							defaultAction: MessageBox.Action.NO,
							details: "Tipo di richiesta: " + tabsType + " \nApprovatore: " + this.slctApprover.getSelectedKey() + " \nOre totali: " + this.oreTot.getValue()
							+ " \nGiorno/i assenza: " + oDateTxt + " \nCliccando SI, la richiesta verrà inoltrata, riceverai una notifica via mail sul suo esito. Puoi modificare o eliminare solo le richieste in stato 'Inviata' accedendo allo storico. ",
							styleClass: bCompact ? "sapUiSizeCompact" : "",
							contentWidth: "100px",
							
							 onClose: function(oAction) {
								        if (oAction == "YES") {
								        	that.actionTask();
								            //sap.ui.controller("eone_zleave_req_create.controller.View1").actionTask(); //altro modo per richiamare function se non ci fosse un event
								        }
										        else 
										        {
										            return;
										        }
								    	}
						});
						
					   } 
				}   
				
			//	if (oViewId === "__component0---V2") {
						if (sViewID === "V2") {
					if (this.sButtonKey ===oView.byId("btn1_mod").getId()) {
					   		// se bt1_mod  eseguo controlli e modifico
					   		
					   	 // richiamo function in baseController per verifica calendario     
						 var calCheck =  this.checkCalendarSelection();
	                    if (calCheck === "KO") {return;}
	                    
	                       // richiamo function in baseController per verifica ore   
	               //new tab        var timeCheck = this.onTimePickerChange();
	               //new tab     if (timeCheck === "KO") {return;}
	                 
	                   // richiamo function in baseController per verifica ore campi vuoti   
			               var timeCheckBlank = this.onTimePickerCheck();   
			                   if (timeCheckBlank === "KO") {return;}
					   		
					   		MessageBox.confirm("Confermi la modifica della richiesta?", {
								icon: MessageBox.Icon.QUESTION,
								title: "Modifica Richiesta",
								actions: [MessageBox.Action.YES, MessageBox.Action.NO],
								initialFocus : MessageBox.Action.NO,
								id: "messageBoxId1_mod",
								defaultAction: MessageBox.Action.NO,
								details: "Tipo di richiesta: " + tabsType + " \nApprovatore: " + this.slctApprover.getSelectedKey() + " \nOre totali: " + this.oreTot.getValue()
									+ " \nGiorno/i assenza: " + oDateTxt + " \nCliccando SI, la richiesta verrà modificata, riceverai una notifica via mail sul suo esito. Puoi modificare o eliminare solo le richieste in stato 'Inviata' accedendo allo storico. ",
						
								styleClass: bCompact ? "sapUiSizeCompact" : "",
								contentWidth: "100px",
								 onClose: function(oAction) {
									        if (oAction == "YES") {
									        	that.actionTask();
									            //sap.ui.controller("eone_zleave_req_create.controller.View1").actionTask(); //altro modo per richiamare function se non ci fosse un event
									        }
											        else 
											        {
											            return;
											        }
									    	}
							});
						
					} 
					
					else if (this.sButtonKey ===oView.byId("btn2_del").getId()) {
							// se bt2_del non eseguo controlli ed elimino, in action verrà passato il parametro sDeleted = "X";
						
								MessageBox.confirm("Confermi l'eliminazione della richiesta?", {
								icon: MessageBox.Icon.QUESTION,
								title: "Elimina Richiesta",
								actions: [MessageBox.Action.YES, MessageBox.Action.NO],
								initialFocus : MessageBox.Action.NO,
								id: "messageBoxId1_del",
								defaultAction: MessageBox.Action.NO,
								details: "Tipo di richiesta: " + tabsType + " \nApprovatore: " + this.slctApprover.getSelectedKey() + " \nOre totali: " + this.oreTot.getValue()
								+ " \nGiorno/i assenza: " + oDateTxt + " \nCliccando SI, la richiesta verrà eliminata, non potrai più visualizzarla nell'APP.",
								styleClass: bCompact ? "sapUiSizeCompact" : "",
								contentWidth: "100px",
								 onClose: function(oAction) {
									        if (oAction == "YES") {
									        	that.actionTask();
									            //sap.ui.controller("eone_zleave_req_create.controller.View1").actionTask(); //altro modo per richiamare function se non ci fosse un event
									        }
											        else 
											        {
											            return;
											        }
									    	}
							});
							
					}
				}	
					
			},
				
				
			actionTask: function(oEvent) {
		
                var oView = this.getView();
                var oViewId = oView.getId();
				var oModel = this.getView().getModel();
				sap.ui.getCore().setModel(oModel);
				
					var that = this;
                //(SE)
				//causa bug di versione sono costretto a forzare xml, altrimenti i campi di tipo 
				//decimali fanno andare la chiamata post create_deep_entity in errore: CX_SXML_PARSE_ERROR
				//note sap:
				//1751991 - OData Channel - Deep Insert in JSON Format Leads to Error
				//1874920 - Error in "deep insert" case when parsing JSON
				// https://archive.sap.com/discussions/thread/3936579
				////
				oModel.oHeaders.Accept = "application/atom+xml,application/atomsvc+xml,application/xml";

				oModel.bJSON = false;
				/////  
				//          oModel.setUseBatch(false);
				//var oObject = oView.getBindingContext().getObject();
                var sButtonId = this.sButtonKey;
				var sDeleted = "";
				var sZrequestId = "";
				var sAction = "creata"; 
				
				//estraggo id della view 
				var sViewIdStart = oView.getId().indexOf("---");
				sViewIdStart = sViewIdStart + 3;
				
			    //		var sPrefix = oView.getId().substring(0, oView.getId().indexOf("---");) + "---"; 
			   var sViewID = oView.getId().substring(sViewIdStart); 
	   
	   // l'alternativa è basarsi sul nome della view completa
		//	var sViewName = oView.getViewName(); 
				
			//	if (oViewId === "__component0---V2") {	
			if (sViewID === "V2") {	
					 if (sButtonId === oView.byId("btn2_del").getId()) {
					 	var oObject = oView.getBindingContext().getObject();
					 	sZrequestId = oObject.ZrequestId;
					 	sDeleted = "X";
					 	sAction = "eliminata";
					 }
					 else if (sButtonId === oView.byId("btn1_mod").getId()) {
					    var oObject = oView.getBindingContext().getObject();
					 	sZrequestId = oObject.ZrequestId;
					 	sAction = "modificata";
					 
					 }
				}
			
			// nuova gestione tabella	
				var aSelectedDates = this._data.GiorniTab;
				
				//	var aSelectedDates = this.cale.getSelectedDates();
			//	var oDate;
                
                
				//var aZtimestart = this.timeFrom.getValue();
				//var aZtimeend = this.timeTo.getValue();
				var aOreTot = this.oreTot.getValue();
			//	var	aOrep = aOreTot / aSelectedDates.length;
				
				var aPferie = this.pferie.getState();
				if (aPferie) {
								aPferie = "X";
							}
							else 
							{
								aPferie = "";
							}

				
				var oUrlParams = {
					ZrequestId: sZrequestId,
					Tmsapprover: this.slctApprover.getSelectedKey(),
					ZabsType: this.slctLvType.getSelectedKey(),
					ZreqStatus: "I",
					ZoreTotali: aOreTot, // da calcolare
					Znote: this.note.getValue(),
					Zdeleted: sDeleted,
					ZpianoFerie: aPferie

				};

				oUrlParams.ToLeaveReqPos = [];
				if (aSelectedDates.length > 0) {
					for (var i = 0; i < aSelectedDates.length; i++) {
					//	oDate = aSelectedDates[i].datasap;
						oUrlParams.ToLeaveReqPos.push({
							Zdate: aSelectedDates[i].datasap,
							Ztimestart: aSelectedDates[i].inizio,
							Ztimeend: aSelectedDates[i].fine,
							Tmsapprover: this.slctApprover.getSelectedKey(),
							ZabsType: this.slctLvType.getSelectedKey(),
							Zorep: aSelectedDates[i].oretotday,
							ZreqStatus: "I"
						});

					}
					//	this.oModel.setData(oData);
				} else {
					//	this._clearModel();
				}
				 
			/*	var aSelectedDates = this.cale.getSelectedDates();
				var oDate;
                
                
				var aZtimestart = this.timeFrom.getValue();
				var aZtimeend = this.timeTo.getValue();
				var aOreTot = this.oreTot.getValue();
				var	aOrep = aOreTot / aSelectedDates.length;
				
				var aPferie = this.pferie.getState();
				if (aPferie) {
								aPferie = "X";
							}
							else 
							{
								aPferie = "";
							}

				
				var oUrlParams = {
					ZrequestId: sZrequestId,
					Tmsapprover: this.slctApprover.getSelectedKey(),
					ZabsType: this.slctLvType.getSelectedKey(),
					ZreqStatus: "I",
					ZoreTotali: aOreTot,
					Znote: this.note.getValue(),
					Zdeleted: sDeleted,
					ZpianoFerie: aPferie

				};

				oUrlParams.ToLeaveReqPos = [];
				if (aSelectedDates.length > 0) {
					for (var i = 0; i < aSelectedDates.length; i++) {
						oDate = aSelectedDates[i].getStartDate();
						oUrlParams.ToLeaveReqPos.push({
							Zdate: this.oFormatYyyymmdd.format(oDate),
							Ztimestart: aZtimestart,
							Ztimeend: aZtimeend,
							Tmsapprover: this.slctApprover.getSelectedKey(),
							ZabsType: this.slctLvType.getSelectedKey(),
							Zorep: aOrep,
							ZreqStatus: "I"
						});

					}
					//	this.oModel.setData(oData);
				} else {
					//	this._clearModel();
				}*/

				//jQuery.sap.require("sap.ui.commons.MessageBox");
				oModel.create('/LeaveRequestSet', oUrlParams, {
					method: "POST",
					success: fnS,

					error: fnE
				});

				//}
				//}	
				function fnS(oData, response) {
				//	console.log(oData);
				//	console.log(response);

					// controllo che la funzione è andata a buon fine recuperando il risultato della function sap
					//	if (oData.Type == "S") {
					if (response.statusCode == "201") {

						//	var msg = "Success: "+oData.Message+", "+sTypeAction;
						var msg = "Richiesta " + sAction + " con successo.\nID: " + formatter.formatRequestId(oData.ZrequestId) + "";
						
						sap.m.MessageToast.show(msg, {
							duration: 5000,
							autoClose: true,
							closeOnBrowserNavigation: false

						});

						// ripulisco campi  	
						oView.byId("LRS4_DAT_CALENDAR").removeAllSelectedDates();

					//new tab	oView.byId("LRS4_DAT_STARTTIME").setValue("");
						//new tab	oView.byId("LRS4_DAT_STARTTIME").rerender();
						//oView.byId("LRS4_DAT_STARTTIME").setEnabled(true);

						//new tab	oView.byId("LRS4_DAT_ENDTIME").setValue("");
						//new tab	oView.byId("LRS4_DAT_ENDTIME").rerender();
						//oView.byId("LRS4_DAT_ENDTIME").setEnabled(true);

						oView.byId("LRS4_TXA_NOTE").setValue("");
						oView.byId("LRS4_TXA_NOTE").rerender();
						oView.byId("LRS4_TXA_NOTE").setEnabled(true);
						
					//	if (oViewId === "__component0---V2") {
					    if (sViewID === "V2") {	
								// faccio refresh tabella riepilogativa delle richieste
								var sPrefix = oView.getId().substring(0, oView.getId().indexOf("---")) + "---"; 
							    var oViewW = sap.ui.getCore().byId(sPrefix + "V1S");
								var oTable = oViewW.byId("__table0");
								oTable.getBinding("items").refresh();
								sap.ui.controller("eone_zleave_req_create.controller.View2").onNavBackDirect();
							//    that.onRefreshTable();
							//	that.getRouter().navTo("view1s", {});
						}
						
					//	if (oViewId === "__component0---V1") {	
						if (sViewID === "V1") {	
							
	
							that.getRouter().navTo("view1s", {});
						}
						
					} else {

						//jQuery.sap.require("sap.m.MessageBox");
						sap.m.MessageBox.show(
							"Error: " + oData.Message, {
								icon: sap.m.MessageBox.Icon.WARNING,
								title: "Error",
								actions: [sap.m.MessageBox.Action.CLOSE]

							});

					}

				} // END FUNCTION SUCCESS

				function fnE(oError) {
				//	console.log(oError);

					alert("Error in read: " + oError.message + "\n" + oError.responseText);
				}

			},
			
			
				//********* Funzione per getione Popover alla pressione del tasto help su Multiday *********//
			// Funzione per getione Popover alla pressione del tasto help su Multiday
			handleResponsivePopoverMultydayPress: function(oEvent) {
				if (!this._PopoverHelpMulti) {
					this._PopoverHelpMulti = sap.ui.xmlfragment("eone_zleave_req_create.view.PopoverHelpMulti", this);

					this.getView().addDependent(this._PopoverHelpMulti);

				}
				
				var oView;
				oView = this.getView();
				 	var oVboxM =  sap.ui.getCore().byId("VboxM");
			//	var oVboxM = 	oView.byId("VboxM");
				oVboxM.destroyItems();
		//		var sId = oEvent.getSource().getParent().getParent().getId();
				var oHTML;

				oHTML = new sap.ui.core.HTML({
					content: '<strong>Inserimento richiesta legata ad un piano ferie</strong>' +
						'<ul>' +

						'<li>Se la richiesta che si sta inserendo fa parte di un piano ferie già inviato e approvato dalla direzione aziendale selezionare "SI".' +
						' La richiesta verrà elaborata direttamente dall\'amministrazione. </li>' +
						'</ul>',
					sanitizeContent: true
				});

				oVboxM.addItem(oHTML);
				this._PopoverHelpMulti.openBy(oEvent.getSource());
			},
			//******************************************************************************************//
			
			
			
			_initCntrls: function() {
			//	this.changeMode = false;
			//	this.withdrawMode = false;
			//	this.oChangeModeData = {};
			//	this.selRange = {};
			//	this.selRange.start = null;
			//	this.selRange.end = null;
			//	this.aLeaveTypes = [];
			//	this.leaveType = {};
			//	this.iPendingRequestCount = 0;
			//	this.bSubmitOK = null;
			//	this.bApproverOK = null;
			//	this.oSubmitResult = {};
			//	this.sApprover = "";
			//	this.sApproverPernr = "";
			//	this.bSimulation = true;
			//	this._isLocalReset = false;
			//	this.oBusy = new sap.m.BusyDialog();
			//	this.formContainer = this.byId("LRS4_FRM_CNT_BALANCES");
			//	this.timeInputElem = this.byId("LRS4_FELEM_TIMEINPUT");
			//	this.balanceElem = this.byId("LRS4_FELEM_BALANCES");
			//	this.noteElem = this.byId("LRS4_FELEM_NOTE");
			    this.pferie = this.byId("LRS4_DAT_PFERIE");
				//new tab	this.timeFrom = this.byId("LRS4_DAT_STARTTIME");
				//new tab	this.timeTo = this.byId("LRS4_DAT_ENDTIME");
				this.oreTot = this.byId("LRS4_DAT_ORETOT");
				this.legend = this.byId("LRS4_LEGEND");
			//	this.remainingVacation = this.byId("LRS4_TXT_REMAINING_DAYS");
			//	this.bookedVacation = this.byId("LRS4_TXT_BOOKED_DAYS");
				this.note = this.byId("LRS4_TXA_NOTE");
			//	this.note_rec = this.byId("LRS4_TXA_NOTE_RECUP");
				this.cale = this.byId("LRS4_DAT_CALENDAR");
				this.slctLvType = this.byId("SLCT_LEAVETYPE");
				this.slctApprover = this.byId("SLCT_APPROVER");
			//	this.calSelResetData = [];
				//SE
				//this._initCalendar();
				//		this._deviceDependantLayout();
			//	this.objectResponse = null;
			//	this.ResponseMessage = null;
			},
			
			
				
		/**
		 * Event handler when the share button has been clicked
		 * @param {sap.ui.base.Event} oEvent the butten press event
		 * @public
		 */
		onSharePress: function() {
			var oShareSheet = this.byId("shareSheet");
			jQuery.sap.syncStyleClass(this.getOwnerComponent().getContentDensityClass(), this.getView(), oShareSheet);
			oShareSheet.openBy(this.byId("shareButton"));
		},

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress: function() {
			var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		}

	});

});