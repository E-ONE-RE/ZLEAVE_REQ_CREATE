/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.declare("ZLEAVE_REQ_CREATE.utils.Formatters");
ZLEAVE_REQ_CREATE.utils.Formatters = (function() {
	return {
		init: function(r) {
			this.resourceBundle = r;
		},
		getDate: function(v) {
			var d;
			if (v instanceof Date) {
				d = v;
			} else {
				if (typeof v !== "string" && !(v instanceof String)) {
					return null;
				}
				if (v.length < 8) {
					return null;
				}
				if (v.substring(0, 6) !== "/Date(" || v.substring(v.length - 2, v.length) !== ")/") {
					return null;
				}
				var a = v.substring(6, 6 + v.length - 8);
				d = new Date();
				d.setTime(a * 1);
			}
			return d;
		},
		stripDecimals: function(n) {
			while (n.length > 0 && n.charAt(0) === "0") {
				n = n.substring(1, 1 + n.length - 1);
			}
			var p = n.indexOf(".");
			if (p < 0) {
				if (n.length < 1) {
					return "0";
				}
				return n;
			}
			while (n.charAt(n.length - 1) === "0") {
				n = n.substring(0, n.length - 1);
			}
			if (n.charAt(n.length - 1) === ".") {
				n = n.substring(0, n.length - 1);
			}
			if (n.length < 1) {
				return "0";
			}
			if (n.length > 0 && n.charAt(0) === ".") {
				return "0" + n;
			}
			return n;
		},
		adjustSeparator: function(n) {
			try {
				if (!isNaN(parseFloat(n)) && isFinite(n)) {
					var a = sap.ca.ui.model.format.NumberFormat.getInstance();
					if (n.indexOf(".") > 0) {
						a.oFormatOptions.decimals = 2;
					}
					return a.format(n);
				}
			} catch (e) {}
			return "";
		},
		DATE_ODATA_MMMyyyy: function(v) {
			var d = ZLEAVE_REQ_CREATE.utils.Formatters.getDate(v);
			if (d !== null) {
				var D = sap.ca.ui.model.format.DateFormat.getInstance({
					pattern: "MMM yyyy"
				});
				return D.format(d, true);
			} else {
				return null;
			}
		},
		DATE_ODATA_EEEdMMMyyyy: function(v, s) {
			var d = ZLEAVE_REQ_CREATE.utils.Formatters.getDate(v);
			var D;
			if (d !== null) {
				if (s) {
					D = sap.ca.ui.model.format.DateFormat.getInstance({
						style: s
					});
					return D.format(d, true);
				} else {
					if (sap.ui.Device.system.phone === true) {
						D = sap.ca.ui.model.format.DateFormat.getInstance({
							style: "medium"
						});
						return D.format(d, true);
					} else {
						D = sap.ca.ui.model.format.DateFormat.getInstance({
							style: "medium"
						});
						return D.format(d, true);
					}
				}
			} else {
				return null;
			}
		},
		DATE_ODATA_EEEdMMMyyyyLong: function(v, s) {
			var d = ZLEAVE_REQ_CREATE.utils.Formatters.getDate(v);
			var D;
			if (d !== null) {
				if (s) {
					D = sap.ca.ui.model.format.DateFormat.getInstance({
						style: s
					});
					return D.format(d, true);
				} else {
					if (sap.ui.Device.system.phone === true) {
						D = sap.ca.ui.model.format.DateFormat.getInstance({
							style: "long"
						});
						return D.format(d, true);
					} else {
						D = sap.ca.ui.model.format.DateFormat.getInstance({
							style: "full"
						});
						return D.format(d, true);
					}
				}
			} else {
				return null;
			}
		},
		DATE_ODATA_ddMMMyyyy: function(v) {
			var d = ZLEAVE_REQ_CREATE.utils.Formatters.getDate(v);
			if (d !== null) {
				var D = sap.ca.ui.model.format.DateFormat.getInstance({
					pattern: "dd.MM.yyyy"
				});
				return D.format(d, true);
			} else {
				return null;
			}
		},
		DATE_YYYYMMdd: function(d) {
			if (d === undefined) return "";
			var D = sap.ca.ui.model.format.DateFormat.getInstance({
				pattern: "YYYY-MM-dd"
			});
			return D.format(d);
		},
		BALANCE: function(v) {
			if (v === undefined) return "";
			if (typeof v !== 'string' && !(v instanceof String)) return "";
			return ZLEAVE_REQ_CREATE.utils.Formatters.adjustSeparator(ZLEAVE_REQ_CREATE.utils.Formatters.stripDecimals(v));
		},
		DURATION_FORMAT: function(h) {
			if (h.indexOf(".") > -1) {
				var d = h.split(".");
				var a = d[0].toString();
				if (parseInt(d[1]) < 10) d[1] = parseInt(d[1]) * 10;
				var m = (parseInt(d[1]) * 60) / 100;
				m = Math.round(m);
				m = m.toString();
				if (m < 10) m = "0" + m;
				return a + ":" + m;
			} else return h + ":00";
		},
		DURATION: function(d, h) {
			if (d === undefined || h === undefined) return "";
			d = ZLEAVE_REQ_CREATE.utils.Formatters.stripDecimals(d);
			if (d) {
				var p = d.indexOf(".");
				if (p < 0) return ZLEAVE_REQ_CREATE.utils.Formatters.adjustSeparator(d);
			}
			return ZLEAVE_REQ_CREATE.utils.Formatters.DURATION_FORMAT(ZLEAVE_REQ_CREATE.utils.Formatters.stripDecimals(h));
		},
		DURATION_UNIT: function(d, h) {
			if (d === undefined || h === undefined) return "";
			d = ZLEAVE_REQ_CREATE.utils.Formatters.stripDecimals(d);
			if (d) {
				var p = d.indexOf(".");
				if (p < 0) return (d * 1 !== 1) ? ZLEAVE_REQ_CREATE.utils.Formatters.resourceBundle.getText("LR_DAYS") : ZLEAVE_REQ_CREATE.utils.Formatters
					.resourceBundle.getText("LR_DAY");
			}
			return (h * 1 !== 1) ? ZLEAVE_REQ_CREATE.utils.Formatters.resourceBundle.getText("LR_HOURS") : ZLEAVE_REQ_CREATE.utils.Formatters.resourceBundle
				.getText("LR_HOUR");
		},
		isHalfDayLeave: function(d) {
			if (d === undefined) return false;
			d = ZLEAVE_REQ_CREATE.utils.Formatters.stripDecimals(d);
			var p = d.indexOf(".");
			if (p < 0) return false;
			return true;
		},
		TIME_hhmm: function(v) {
			if (v === undefined) return "";
			var d;
			if (v instanceof Date) {
				d = v;
			} else if (v.ms) {
				var h = (v.ms / (3600 * 1000)) | 0;
				var m = ((v.ms - (h * 3600 * 1000)) / (60 * 1000)) | 0;
				var s = ((v.ms - (h * 3600 * 1000) - (m * 60 * 1000)) / 1000) | 0;
				d = new Date();
				d.setHours(h, m, s, 0);
			} else {
				if (typeof v !== 'string' && !(v instanceof String)) return "";
				if (v.length !== 6) return "";
				var h = v.substring(0, 2) * 1;
				var m = v.substring(2, 4) * 1;
				var s = v.substring(4, 6) * 1;
				d = new Date();
				d.setHours(h, m, s, 0);
			}
			var D = sap.ca.ui.model.format.DateFormat.getTimeInstance({
				style: "short"
			});
			var t = D.format(d);
			var T = t.split(":");
			var a = "";
			var l = T[T.length - 1];
			if (isNaN(l)) {
				var A = l.split(" ");
				T[T.length - 1] = A[0];
				a = " " + A[1];
			}
			return (T[0] + ":" + T[1] + a);
		},
		FORMAT_DATETIME: function(p, v) {
			return p + " " + ZLEAVE_REQ_CREATE.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(v);
		},
		FORMATTER_INTRO: function(r) {
			if (!r || r.length < 1) {
				return "";
			}
			var l = r[0].LeaveRequestType;
			var s = r[0].StatusCode;
			if (l && l.toString() === "2") {
				if (s === "SENT") {
					return ZLEAVE_REQ_CREATE.utils.Formatters.resourceBundle.getText("LR_CHANGE_PENDING");
				}
				if (s === "APPROVED") {
					return ZLEAVE_REQ_CREATE.utils.Formatters.resourceBundle.getText("LR_CHANGE_DONE");
				}
			}
			if (l && l.toString() === "3") {
				if (s === "SENT") {
					return ZLEAVE_REQ_CREATE.utils.Formatters.resourceBundle.getText("LR_CANCEL_PENDING");
				}
				if (s === "APPROVED") {
					return ZLEAVE_REQ_CREATE.utils.Formatters.resourceBundle.getText("LR_CANCEL_DONE");
				}
			}
			return "";
		},
		FORMAT_ENDDATE: function(h, w, s, E, a) {
			try {
				if (h && w && s && E && a) {
					if (ZLEAVE_REQ_CREATE.utils.Formatters.isHalfDayLeave(w)) {
						return ZLEAVE_REQ_CREATE.utils.Formatters.TIME_hhmm(s) + " " + h + " " + ZLEAVE_REQ_CREATE.utils.Formatters.TIME_hhmm(a);
					} else if (w * 1 !== 1) {
						return h + " " + ZLEAVE_REQ_CREATE.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(E);
					}
				}
			} catch (e) {}
			return "";
		},
		FORMAT_ENDDATE_LONG: function(h, w, s, E, a) {
			try {
				if (h && w && s && E && a) {
					if (ZLEAVE_REQ_CREATE.utils.Formatters.isHalfDayLeave(w)) {
						return ZLEAVE_REQ_CREATE.utils.Formatters.TIME_hhmm(s) + " " + h + " " + ZLEAVE_REQ_CREATE.utils.Formatters.TIME_hhmm(a);
					} else if (w * 1 != 1) {
						return h + " " + ZLEAVE_REQ_CREATE.utils.Formatters.DATE_ODATA_EEEdMMMyyyyLong(E);
					}
				}
			} catch (e) {}
			return "";
		},
		SET_RELATED_VISIBILITY: function(r) {
			return r !== undefined && r.length > 0 && r[0].LeaveRequestType == "2";
		},
		SET_RELATED_START_DATE_VISIBILITY: function(r) {
			return r !== undefined && r.length > 0 && r[0].LeaveRequestType == "2" && r[0].StartDate != undefined;
		},
		FORMAT_RELATED_START_DATE: function(r) {
			if (r !== undefined && r.length > 0 && r[0].LeaveRequestType == "2" && r[0].StartDate != undefined) {
				try {
					return ZLEAVE_REQ_CREATE.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(r[0].StartDate);
				} catch (e) {}
			}
			return "";
		},
		FORMAT_RELATED_START_DATE_LONG: function(r) {
			if (r !== undefined && r.length > 0 && r[0].LeaveRequestType == "2" && r[0].StartDate != undefined) {
				try {
					return ZLEAVE_REQ_CREATE.utils.Formatters.DATE_ODATA_EEEdMMMyyyyLong(r[0].StartDate);
				} catch (e) {}
			}
			return "";
		},
		SET_RELATED_END_DATE_VISIBILITY: function(r) {
			return r != undefined && r.length > 0 && r[0].LeaveRequestType == "2" && r[0].WorkingDaysDuration != undefined && r[0].StartDate !=
				undefined && r[0].EndDate != undefined && !r[0].EndTime != undefined && (ZLEAVE_REQ_CREATE.utils.Formatters.isHalfDayLeave(r[0].WorkingDaysDuration) ||
					r[0].WorkingDaysDuration * 1 != 1);
		},
		FORMAT_RELATED_END_DATE: function(h, r) {
			if (r != undefined && r.length > 0 && r[0].LeaveRequestType == "2" && r[0].WorkingDaysDuration != undefined && r[0].StartDate !=
				undefined && r[0].EndDate != undefined && !r[0].EndTime != undefined) {
				try {
					if (ZLEAVE_REQ_CREATE.utils.Formatters.isHalfDayLeave(r[0].WorkingDaysDuration)) {
						return ZLEAVE_REQ_CREATE.utils.Formatters.TIME_hhmm(r[0].StartTime) + " " + h + " " + ZLEAVE_REQ_CREATE.utils.Formatters.TIME_hhmm(
							r[0].EndTime);
					}
					if (r[0].WorkingDaysDuration * 1 != 1) {
						return h + " " + ZLEAVE_REQ_CREATE.utils.Formatters.DATE_ODATA_EEEdMMMyyyy(r[0].EndDate);
					}
				} catch (e) {}
			}
			return "";
		},
		FORMAT_RELATED_END_DATE_LONG: function(h, r) {
			if (r != undefined && r.length > 0 && r[0].LeaveRequestType == "2" && r[0].WorkingDaysDuration != undefined && r[0].StartDate !=
				undefined && r[0].EndDate != undefined && !r[0].EndTime != undefined) {
				try {
					if (ZLEAVE_REQ_CREATE.utils.Formatters.isHalfDayLeave(r[0].WorkingDaysDuration)) {
						return ZLEAVE_REQ_CREATE.utils.Formatters.TIME_hhmm(r[0].StartTime) + " " + h + " " + ZLEAVE_REQ_CREATE.utils.Formatters.TIME_hhmm(
							r[0].EndTime);
					}
					if (r[0].WorkingDaysDuration * 1 != 1) {
						return h + " " + ZLEAVE_REQ_CREATE.utils.Formatters.DATE_ODATA_EEEdMMMyyyyLong(r[0].EndDate);
					}
				} catch (e) {}
			}
			return "";
		},
		State: function(s) {
			if (s !== null) {
				s = s.toLowerCase();
			}
			switch (s) {
				case "sent":
					return null;
				case "posted":
					return "Success";
				case "approved":
					return "Success";
				case "rejected":
					return "Error";
				default:
					return null;
			}
		},
		calculateUsed: function(B, a, b) {
			var s = parseFloat(B) + parseFloat(a) + parseFloat(b);
			s = ZLEAVE_REQ_CREATE.utils.Formatters.BALANCE(s.toString());
			return s;
		},
		_parseNotes: function(n) {
			try {
				var a = n.split("::NEW::");
				var r = [];
				var E = {};
				var b, i, d, t, D;
				for (i = 1; i < a.length; i++) {
					E = {};
					b = a[i].split("::::");
					E.Pernr = b[0];
					E.Author = b[1];
					E.Text = b[2];
					d = b[3].toString();
					t = b[4].toString();
					D = new Date(d.substring(0, 4), parseInt(d.substring(4, 6), 10) - 1, d.substring(6, 8), t.substring(0, 2), t.substring(2, 4), t.substring(
						4, 6));
					var o = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
						style: 'medium'
					});
					E.Timestamp = o.format(D);
					r.push(E);
				}
				return {
					"NotesCollection": r
				};
			} catch (e) {
				jQuery.sap.log.error("Failed to parse notes details in utils.Formatters._parsenotes with input" + n);
			}
		},
		_parseAttachments: function(a, R, m) {
			try {
				var b = a.split("::NEW::");
				var r = [];
				var E = {};
				var c, i, d, t, D;
				var p = ZLEAVE_REQ_CREATE.utils.UIHelper.getPernr();
				for (i = 1; i < b.length; i++) {
					E = {};
					c = b[i].split("::::");
					E.FileName = c[0];
					E.FileType = '';
					E.Contributor = c[2];
					d = c[3].toString();
					t = c[4].toString();
					D = new Date(d.substring(0, 4), parseInt(d.substring(4, 6), 10) - 1, d.substring(6, 8), t.substring(0, 2), t.substring(2, 4), t.substring(
						4, 6));
					if (new Date().getTimezoneOffset() > 0) {
						D = this.toUTCDate(D);
					}
					var o = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
						style: 'medium'
					});
					E.UploadedDate = o.format(D);
					E.DocumentId = c[5];
					E.Status = c[6];
					E.FilePath = c[7];
					E.FileSize = parseFloat(c[8], 10);
					E.FileSizeDesc = c[9];
					E.MimeType = c[1];
					if (c[5]) {
						E.FileUrl = m.sServiceUrl + "/FileAttachmentSet(EmployeeID='" + p + "',LeaveRequestId='" + R + "',ArchivDocId='" + c[5] +
							"',FileName='" + encodeURIComponent(E.FileName) + "')/$value";
					} else {
						jQuery.sap.log.error("ArchivDocId is missing for LeaveRequestID:" + R, [], ["ZLEAVE_REQ_CREATE.utils.Formatters._parseAttachments"]);
						E.FileUrl = "";
					}
					r.push(E);
				}
				return {
					"AttachmentsCollection": r
				};
			} catch (e) {
				jQuery.sap.log.error("Failed to parse notes details in utils.Formatters._parseAttachments with input" + a);
			}
		},
		isRequired: function(v) {
			if (v === "" || v === null || v === undefined) {
				return false;
			} else return true;
		},
		formatterAbsenceDuration: function(W, a, A) {
			var f;
			if (a === null || W === null || A === null) {
				return "";
			}
			if (A) {
				f = ZLEAVE_REQ_CREATE.utils.Formatters.stripDecimals(W);
			} else {
				f = ZLEAVE_REQ_CREATE.utils.Formatters.stripDecimals(a);
			}
			return f;
		},
		formatterAbsenceDurationUnit: function(W, a, A) {
			var f;
			if (A) {
				if (parseInt(W, 10) === 1) {
					f = ZLEAVE_REQ_CREATE.utils.Formatters.resourceBundle.getText("LR_DAY");
				} else {
					f = ZLEAVE_REQ_CREATE.utils.Formatters.resourceBundle.getText("LR_DAYS");
				}
			} else {
				if (parseInt(a, 10) === 1) {
					f = ZLEAVE_REQ_CREATE.utils.Formatters.resourceBundle.getText("LR_HOUR");
				} else {
					f = ZLEAVE_REQ_CREATE.utils.Formatters.resourceBundle.getText("LR_HOURS");
				}
			}
			return f;
		}
	};
}());