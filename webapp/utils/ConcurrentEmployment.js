/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("ZLEAVE_REQ_CREATE.utils.ConcurrentEmployment");
jQuery.sap.require("ZLEAVE_REQ_CREATE.utils.DataManager");
ZLEAVE_REQ_CREATE.utils.ConcurrentEmployment = {
	getCEEnablement: function(s, a) {
		var t = this;
		if (t.iAmAlreadyCalled === false) {
			t.iAmAlreadyCalled = true;
		} else {
			t.secondSuccessHandler = a;
			return;
		}
		this.initialize(s, a);
		var m = new sap.ui.model.json.JSONModel();
		ZLEAVE_REQ_CREATE.utils.DataManager.getPersonellAssignments(s, function(d) {
			if (d.length > 1) {
				m.setData(d);
				s.oCEForm.setModel(m);
				s.oCEDialog.open();
			} else {
				s.oApplication.pernr = d[0].Pernr;
				ZLEAVE_REQ_CREATE.utils.UIHelper.setPernr(d[0].Pernr);
				a();
				if (t.secondSuccessHandler) {
					t.secondSuccessHandler();
					t.secondSuccessHandler = null;
				}
			}
		});
	},
	initialize: function(s, a) {
		var t = this;
		this.setControllerInstance(s);
		var i = new sap.m.RadioButton({
			text: "{AssignmentText}",
			customData: new sap.ui.core.CustomData({
				"key": "Pernr",
				"value": "{Pernr}"
			})
		});
		s.oCESelect = new sap.m.RadioButtonGroup().bindAggregation("buttons", "/", i);
		s.oCEForm = new sap.ui.layout.form.Form({
			maxContainerCols: 2,
			class: "sapUiLargeMarginTopBottom",
			layout: new sap.ui.layout.form.ResponsiveGridLayout({
				labelSpanL: 12,
				labelSpanM: 12,
				labelSpanS: 12,
				columnsL: 2,
				columnsM: 2
			}),
			formContainers: new sap.ui.layout.form.FormContainer({
				formElements: [new sap.ui.layout.form.FormElement({
					label: new sap.m.Label({
						text: s.resourceBundle.getText("PERSONAL_ASSIGN")
					}),
					fields: s.oCESelect
				})]
			})
		});
		s.oCEDialog = new sap.m.Dialog({
			title: s.resourceBundle.getText("PERSONAL_ASSIGN_TITLE"),
			class: "sapUiContentPadding sapUiLargeMarginTopBottom",
			content: s.oCEForm,
			buttons: [new sap.m.Button({
				text: s.resourceBundle.getText("LR_OK"),
				press: function() {
					t.iAmAlreadyCalled = false;
					s.oCEDialog.close();
					s.oCEDialog.Cancelled = false;
					s.oApplication.pernr = s.oCESelect.getSelectedButton().data().Pernr;
					ZLEAVE_REQ_CREATE.utils.UIHelper.setPernr(s.oApplication.pernr);
					a();
					if (t.secondSuccessHandler) {
						t.secondSuccessHandler();
						t.secondSuccessHandler = null;
					}
				}
			}), new sap.m.Button({
				text: s.resourceBundle.getText("LR_CANCEL"),
				press: function() {
					t.iAmAlreadyCalled = false;
					s.oCEDialog.close();
					s.oCEDialog.Cancelled = true;
					window.history.go(-1);
				}
			})]
		});
		s.oCEDialog.attachAfterClose(function() {
			if (!s.oApplication.pernr && !s.oCEDialog.Cancelled) {
				s.oCEDialog.open();
			}
		});
	},
	setControllerInstance: function(m) {
		this.me = m;
	},
	getControllerInstance: function() {
		return this.me;
	}
};