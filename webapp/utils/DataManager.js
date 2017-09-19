/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("ZLEAVE_REQ_CREATE.utils.Formatters");
jQuery.sap.declare("ZLEAVE_REQ_CREATE.utils.DataManager");
ZLEAVE_REQ_CREATE.utils.DataManager = (function() {
	var _ = null;
	var d = null;
	var f = {};
	f.exist = true;
	return {
		init: function(D, o) {
			_ = D;
			_.setCountSupported(false);
			d = o;
		},
		getBaseODataModel: function() {
			return _;
		},
		setCachedModelObjProp: function(p, a) {
			f[p] = a;
		},
		getCachedModelObjProp: function(p) {
			return f[p];
		},
		clearcachedData: function() {
			f = {};
			f.exist = false;
		},
		getApprover: function(s, a) {
			var p = "ApproverCollection";
			var b = ["$select=ApproverEmployeeName,ApproverEmployeeID,ApproverUserID"];
			this._getOData(p, null, b, function(o) {
				var A, c;
				try {
					var r = o.results;
					if (r instanceof Array) {
						for (var i = 0; i < r.length; i++) {
							A = r[i].ApproverEmployeeName;
							c = r[i].ApproverEmployeeID;
						}
					}
					if (A === undefined) {
						a([d.getText("LR_DD_NO_APPROVER") + " (DataManager.getApprover)"]);
						return;
					}
				} catch (e) {
					a([d.getText("LR_DD_PARSE_ERR") + " (DataManager.getApprover)"]);
					return;
				}
				s(A, c);
			}, function(o) {
				a(ZLEAVE_REQ_CREATE.utils.DataManager.parseErrorMessages(o));
			});
		},
		getConfiguration: function() {
			var a = $.Deferred();
			var p = "ConfigurationCollection";
			if (!f.DefaultConfigurations) {
				this._getOData(p, null, [], function(o) {
					var c;
					try {
						var r = o.results;
						if (r instanceof Array) {
							c = r[0];
						}
						if (c === undefined) {
							a.reject(ZLEAVE_REQ_CREATE.utils.DataManager.parseErrorMessages(o));
							return;
						}
					} catch (e) {
						a.reject(ZLEAVE_REQ_CREATE.utils.DataManager.parseErrorMessages(e));
						return;
					}
					f.DefaultConfigurations = c;
					a.resolve(c);
				}, function(o) {
					a.reject(ZLEAVE_REQ_CREATE.utils.DataManager.parseErrorMessages(o));
				});
			} else {
				a.resolve(f.DefaultConfigurations);
			}
			return a.promise();
		},
		getAbsenceTypeCollection: function() {
			var a = $.Deferred();
			var p = "AbsenceTypeCollection";
			var P = ['$expand=AdditionalFields,MultipleApprovers'];
			if (!f.AbsenceTypeCollection) {
				this._getOData(p, null, P, function(o) {
					f.AbsenceTypeCollection = o.results;
					a.resolve(o.results);
				}, function(o) {
					a.reject(ZLEAVE_REQ_CREATE.utils.DataManager.parseErrorMessages(o));
				});
			} else {
				a.resolve(f.AbsenceTypeCollection);
			}
			return a.promise();
		},
		getBalancesForAbsenceType: function(a, A, s, b) {
			var p = ZLEAVE_REQ_CREATE.utils.UIHelper.getPernr();
			var P;
			if (A == "") {
				P = "AbsenceTypeCollection(EmployeeID='" + p + "',AbsenceTypeCode='" + a + "')/absenceTypeTimeAccount";
			} else {
				P = "AbsenceTypeCollection(EmployeeID='" + p + "',AbsenceTypeCode='" + a + "',AttabsInd='" + A + "')/absenceTypeTimeAccount";
			}
			var c = ["$select=BalancePlannedQuantity,BalanceAvailableQuantity,BalanceUsedQuantity,TimeUnitName,TimeAccountTypeName"];
			this._getOData(P, null, c, function(o) {
				var B = null,
					g = null,
					h = null,
					j = null;
				var t = null,
					T = null,
					k = null;
				var l = null,
					m = null,
					n = null;
				var q = false;
				try {
					var r = o.results;
					if (r instanceof Array && r.length > 0) {
						q = true;
						t = r[0].TimeUnitName;
						T = r[0].TimeUnitName;
						k = r[0].TimeAccountTypeName;
						for (var i = 0; i < r.length; i++) {
							l += parseFloat(r[i].BalancePlannedQuantity);
							m += parseFloat(r[i].BalanceAvailableQuantity);
							n += parseFloat(r[i].BalanceUsedQuantity);
						}
						B = ZLEAVE_REQ_CREATE.utils.Formatters.BALANCE(l.toString());
						g = ZLEAVE_REQ_CREATE.utils.Formatters.BALANCE(m.toString());
						h = ZLEAVE_REQ_CREATE.utils.Formatters.BALANCE(n.toString());
						j = ZLEAVE_REQ_CREATE.utils.Formatters.BALANCE((n + l).toString());
					}
				} catch (e) {
					b([d.getText("LR_DD_PARSE_ERR") + " (DataManager.getBalancesForAbsenceType)"]);
					return;
				}
				s(B, t, g, T, k, h, j, q);
			}, function(o) {
				b(ZLEAVE_REQ_CREATE.utils.DataManager.parseErrorMessages(o));
			});
		},
		getPendingLeaves: function(s, e) {
			this.getConsolidatedLeaveRequests(function(p) {
				var l = p.LeaveRequestCollection;
				var P = 0;
				for (var i = 0; i < l.length; i++) {
					if (l[i].StatusCode === "SENT") {
						P++;
					} else if (l[i].aRelatedRequests !== undefined && l[i].aRelatedRequests.length > 0) {
						if (l[i].aRelatedRequests[0].StatusCode === "SENT") {
							P++;
						}
					}
				}
				s(P + "");
			}, e);
		},
		getConsolidatedLeaveRequests: function(s, a) {
			var p = "LeaveRequestCollection";
			var P = [
				'$select=ApproverEmployeeID,ApproverEmployeeName,EmployeeID,RequestID,ChangeStateID,LeaveKey,ActionCode,StatusCode,StatusName,AbsenceTypeCode,AbsenceTypeName,InfoType,StartDate,StartTime,EndDate,EndTime,WorkingHoursDuration,WorkingDaysDuration,Notes,ActionDeleteInd,ActionModifyInd,DeductionInfo,TotalDeduction,TimeUnitDeduction,TimeUnitTextDeduction,LeaveRequestType,AttachmentDetails,AdditionalFields,MultipleApprovers'
			];
			var o = ZLEAVE_REQ_CREATE.utils.UIHelper.getPernr();
			P.push("$expand=MultipleApprovers");
			P.push("$filter=EmployeeID eq '" + o + "'");
			this._getOData(p, null, P, function(b) {
				var l = [];
				try {
					var r = b.results;
					if (!r instanceof Array) {
						a([d.getText("LR_DD_NO_CFG") + " (DataManager.getConsolidatedLeaveRequests)"]);
						return;
					}
					var R = {};
					for (var i = 0; i < r.length; i++) {
						if ((r[i].LeaveRequestType === "2" || r[i].LeaveRequestType === "3") && r[i].LeaveKey) {
							if (!R[r[i].LeaveKey]) {
								R[r[i].LeaveKey] = [];
							}
							R[r[i].LeaveKey].push(r[i]);
						}
					}
					for (var i = 0; i < r.length; i++) {
						if (r[i].LeaveRequestType !== "2" && r[i].LeaveRequestType !== "3") {
							if (r[i].LeaveKey && R[r[i].LeaveKey]) {
								r[i].aRelatedRequests = R[r[i].LeaveKey];
								for (var j = 0; j < r[i].aRelatedRequests.length; j++) {
									r[i].Notes = r[i].aRelatedRequests[j].Notes + r[i].Notes;
								}
							}
							l.push(r[i]);
						}
					}
				} catch (e) {
					a([d.getText("LR_DD_PARSE_ERR") + " (DataManager.getConsolidatedLeaveRequests)"]);
					return;
				}
				s({
					LeaveRequestCollection: l
				});
			}, function(b) {
				a(ZLEAVE_REQ_CREATE.utils.DataManager.parseErrorMessages(b));
			});
		},
		getTimeAccountCollection: function(s, a) {
			var p = "TimeAccountCollection";
			this._getOData(p, null, null, function(o) {
				var t = [];
				try {
					var r = o.results;
					if (!r instanceof Array) {
						a([d.getText("LR_DD_NO_CFG") + " (DataManager.getTimeAccountCollection)"]);
						return;
					}
					for (var i = 0; i < r.length; i++) {
						delete r[i]['__metadata'];
						t.push(r[i]);
					}
				} catch (e) {
					a([d.getText("LR_DD_PARSE_ERR") + " (DataManager.getTimeAccountCollection)"]);
					return;
				}
				s({
					TimeAccountCollection: t
				});
			}, function(o) {
				a(ZLEAVE_REQ_CREATE.utils.DataManager.parseErrorMessages(o));
			});
		},
		submitLeaveRequest: function(n, p, s, e, u) {
			n.ProcessCheckOnlyInd = (p ? true : false);
			this._postOData("LeaveRequestCollection", n, function(o, a) {
				var b = "";
				if (a.headers["sap-message"]) {
					b = JSON.parse(a.headers["sap-message"]);
				}
				if (!o.RequestID) {
					var m = b || d.getText("LR_DD_GENERIC_ERR");
					ZLEAVE_REQ_CREATE.utils.UIHelper.errorDialog(m);
				} else {
					ZLEAVE_REQ_CREATE.utils.UIHelper.setIsChangeAction(true);
					if (u) {
						u(s, o, b);
					}
				}
			}, function(o) {
				e(ZLEAVE_REQ_CREATE.utils.DataManager.parseErrorMessages(o));
			});
		},
		changeLeaveRequest: function(m, p, s, e, u) {
			m.ProcessCheckOnlyInd = (p ? true : false);
			var a = this;
			this._postOData("LeaveRequestCollection", m, function(o, b) {
				var c = "";
				if (b.headers["sap-message"]) {
					c = JSON.parse(b.headers["sap-message"]);
				}
				if (!o.RequestID) {
					var g = c || d.getText("LR_DD_GENERIC_ERR");
					ZLEAVE_REQ_CREATE.utils.UIHelper.errorDialog(g);
				} else {
					ZLEAVE_REQ_CREATE.utils.UIHelper.setIsChangeAction(true);
					if (u) {
						u(s, o, c);
					}
				}
			}, function(o) {
				e(ZLEAVE_REQ_CREATE.utils.DataManager.parseErrorMessages(o));
			});
		},
		withdrawLeaveRequest: function(s, e, r, c, l, a, b) {
			this.recallLeaveRequest(e, r, c, l, a, b);
		},
		getLeaveRequestsForTimePeriod: function(s, E, a, b) {
			var S = ZLEAVE_REQ_CREATE.utils.Formatters.DATE_YYYYMMdd(s) + 'T00:00:00';
			var c = ZLEAVE_REQ_CREATE.utils.Formatters.DATE_YYYYMMdd(E) + 'T00:00:00';
			var p = "LeaveRequestCollection";
			var P = ZLEAVE_REQ_CREATE.utils.UIHelper.getPernr();
			var g = ["$filter=StartDate eq datetime'" + S + "' and EndDate eq datetime'" + c + "' and EmployeeID eq '" + P + "'",
				"$select=StatusCode,StatusName,AbsenceTypeCode,AbsenceTypeName,StartDate,StartTime,EndDate,EndTime"
			];
			this._getOData(p, null, g, function(o) {
				var l = [];
				try {
					var r = o.results;
					if (r instanceof Array) {
						for (var i = 0; i < r.length; i++) {
							var R = new Object();
							R.StatusCode = r[i].StatusCode;
							R.StatusName = r[i].StatusName;
							R.AbsenceTypeCode = r[i].AbsenceTypeCode;
							R.AbsenceTypeName = r[i].AbsenceTypeName;
							R.StartDate = r[i].StartDate;
							R.StartTime = r[i].StartTime;
							R.EndDate = r[i].EndDate;
							R.EndTime = r[i].EndTime;
							l.push(R);
						}
					}
				} catch (e) {
					b([d.getText("LR_DD_PARSE_ERR") + " (DataManager.getLeaveRequestsForTimePeriod)"]);
					return;
				}
				a(l);
			}, function(o) {
				b(ZLEAVE_REQ_CREATE.utils.DataManager.parseErrorMessages(o));
			});
		},
		getWorkSchedulesForTimePeriod: function(s, E, a, b) {
			var S = ZLEAVE_REQ_CREATE.utils.Formatters.DATE_YYYYMMdd(s) + 'T00:00:00';
			var c = ZLEAVE_REQ_CREATE.utils.Formatters.DATE_YYYYMMdd(E) + 'T00:00:00';
			var p = "WorkScheduleCollection";
			var P = ZLEAVE_REQ_CREATE.utils.UIHelper.getPernr();
			var g = ["$filter=StartDate eq datetime'" + S + "' and EndDate eq datetime'" + c + "' and EmployeeID eq '" + P + "'",
				"$select=EmployeeID,StartDate,EndDate,StatusValues"
			];
			this._getOData(p, null, g, function(o) {
				var w = [];
				try {
					var r = o.results;
					if (r instanceof Array) {
						for (var i = 0; i < r.length; i++) {
							var h = new Object();
							h.StartDate = r[i].StartDate;
							h.EndDate = r[i].EndDate;
							h.StatusValues = r[i].StatusValues;
							w.push(h);
						}
					}
				} catch (e) {
					b([d.getText("LR_DD_PARSE_ERR") + " (DataManager.getWorkSchedulesForTimePeriod)"]);
					return;
				}
				a(w);
			}, function(o) {
				b(ZLEAVE_REQ_CREATE.utils.DataManager.parseErrorMessages(o));
			});
		},
		isRecallableLeaveRequest: function(s, l) {
			if (s === "CREATED") {
				return true;
			}
			if (!l) {
				return true;
			}
			for (var i = 0; i < l.length; i++) {
				var c = l.charAt(i);
				if (c !== " " && c !== "\t" && c !== "\v" && c !== "\r" && c !== "\n" && c !== "0") {
					return false;
				}
			}
			return true;
		},
		createDeleteLeaveRequest: function(e, r, c, l, s, a) {
			var b = {};
			b.ActionCode = 03;
			b.EmployeeID = e;
			b.RequestID = r;
			b.ChangeStateID = c;
			b.LeaveKey = l;
			b.ProcessCheckOnlyInd = false;
			this._postOData("LeaveRequestCollection", b, function(o, g) {
				var h = "";
				if (g.headers["sap-message"]) {
					h = JSON.parse(g.headers["sap-message"]);
				}
				s(o, h);
			}, function(o) {
				a(ZLEAVE_REQ_CREATE.utils.DataManager.parseErrorMessages(o));
			});
		},
		recallLeaveRequest: function(e, r, c, l, s, a) {
			this._deleteOData("LeaveRequestCollection(EmployeeID='" + e + "',RequestID='" + r + "',ChangeStateID=" + c + ",LeaveKey='" + l + "')",
				function(o) {
					s(o);
				},
				function(o) {
					a(ZLEAVE_REQ_CREATE.utils.DataManager.parseErrorMessages(o));
				});
		},
		parseErrorMessages: function(o) {
			if (o.response && o.response.body) {
				var c = function(p) {
					var s = 1;
					if (p[0] === "-") {
						s = -1;
						p = p.substr(1);
					}
					return function(a, b) {
						var g;
						if (a[p] < b[p]) {
							g = -1;
						} else if (a[p] > b[p]) {
							g = 1;
						} else {
							g = 0;
						}
						return g * s;
					};
				};
				try {
					var r = JSON.parse(o.response.body);
					if (r.error && r.error.message && r.error.message.value) {
						var g = [];
						g.push(r.error.message.value);
						if (r.error.innererror && r.error.innererror.errordetails && r.error.innererror.errordetails instanceof Array) {
							r.error.innererror.errordetails.sort(c("severity"));
							for (var i = 0; i < r.error.innererror.errordetails.length; i++) {
								if (r.error.innererror.errordetails[i].message) {
									var m = r.error.innererror.errordetails[i].message;
									if (r.error.innererror.errordetails[i].code) {
										m += " [" + r.error.innererror.errordetails[i].code + "]";
									}
									g.push(m);
								}
							}
						}
						return g;
					}
				} catch (e) {
					jQuery.sap.log.warning("couldn't parse error message", ["parseErrorMessages"], ["DataManger"]);
				}
			} else {
				return [d.getText("LR_DD_GENERIC_ERR") + o.message];
			}
		},
		getXmlNodeValue: function(n) {
			try {
				if (n.childNodes.length !== 1) return null;
				switch (n.childNodes[0].nodeType) {
					case 3:
						return n.childNodes[0].data;
				}
			} catch (e) {
				return null;
			}
		},
		getDateFromString: function(v) {
			if (v.length !== 19) {
				return null;
			}
			if (v.charAt(4) !== '-' || v.charAt(7) !== '-' || v.charAt(10) !== 'T' || v.charAt(13) !== ':' || v.charAt(16) !== ':') {
				return null;
			}
			var y = v.substring(0, 4) * 1;
			var m = v.substring(5, 7) * 1;
			var a = v.substring(8, 10) * 1;
			var h = v.substring(11, 13) * 1;
			var b = v.substring(14, 16) * 1;
			var s = v.substring(17, 19) * 1;
			return new Date(y, m - 1, a, h, b, s);
		},
		searchApprover: function(s, a) {
			var p = "ApproverCollection";
			var b = '';
			if (!isNaN(s)) {
				b = s;
			}
			s = encodeURIComponent(s);
			var c = ["$filter=ApproverEmployeeName eq '" + s + "' and ApproverEmployeeID eq '" + b + "'"];
			this._getOData(p, null, c, function(o) {
				try {
					var r = o.results;
					if (r instanceof Array) {
						a(o);
					}
				} catch (e) {
					ZLEAVE_REQ_CREATE.utils.DataManager.parseErrorMessages([d.getText("LR_DD_PARSE_ERR") + " (DataManager.getApprover)"]);
					sap.ca.ui.utils.busydialog.releaseBusyDialog();
					return;
				}
			}, function(o) {
				sap.ca.ui.utils.busydialog.releaseBusyDialog();
				ZLEAVE_REQ_CREATE.utils.DataManager.parseErrorMessages(o);
			});
		},
		getPersonellAssignments: function(a, s) {
			this._getOData("/ConcurrentEmploymentSet", null, [], function(D) {
				s(D.results);
			}, function(e) {
				ZLEAVE_REQ_CREATE.utils.DataManager.parseErrorMessages(e);
			});
		},
		_getOData: function(p, c, u, s, e) {
			if (p === "AbsenceTypeCollection" || p === "ConfigurationCollection" || p === "TimeAccountCollection") {
				var P = ZLEAVE_REQ_CREATE.utils.UIHelper.getPernr();
				u = u ? u : [];
				u.push("$filter=EmployeeID eq '" + P + "'");
			}
			_.read(p, c, u, true, function(r) {
				s(r);
			}, function(r) {
				e(r);
			});
		},
		_postOData: function(p, b, s, e) {
			var P = {};
			P.success = s;
			P.error = e;
			P.async = true;
			_.create(p, b, P, s, e);
		},
		_deleteOData: function(p, s, e) {
			var P = {};
			P.fnSuccess = s;
			P.fnError = e;
			_.remove(p, P);
		},
		Xml2Json: function(n) {
			var a = {},
				t = this;
			var A = function(e, v) {
				if (a[e]) {
					if (a[e].constructor !== Array) {
						a[e] = [a[e]];
					}
					a[e][a[e].length] = v;
				} else {
					a[e] = v;
				}
			};
			var c, b;
			for (c = 0; c < n.attributes.length; c++) {
				b = n.attributes[c];
				A(b.name, b.value);
			}
			for (c = 0; c < n.childNodes.length; c++) {
				b = n.childNodes[c];
				if (b.nodeType === 1) {
					if (b.childNodes.length === 1 && b.firstChild.nodeType === 3) {
						A(b.nodeName, b.firstChild.nodeValue);
					} else {
						A(b.nodeName, t.Xml2Json(b));
					}
				}
			}
			return a;
		},
		LeaveRequestValueHelp: function(a, s, e) {
			var p = "LeaveRequestHelpCollection?";
			var u = "$filter=FIELDNAME eq '" + a + "'";
			_.read(p, null, u, true, function(r) {
				s(r);
			}, function(r) {
				e(r);
			});
		}
	};
}());