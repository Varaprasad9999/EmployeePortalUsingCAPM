sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageBox","com/amista/employeeapplication/FORMATTER/dateFormatter","sap/ui/core/routing/History","sap/ui/core/UIComponent","sap/ui/core/util/Export","sap/ui/core/util/ExportTypeCSV"],function(e,t,a,s,n,i,o){"use strict";return e.extend("com.amista.employeeapplication.controller.EmpPersonalView",{dateFormatter:a,onInit:function(){this.usingEditLeave=false;this.getOwnerComponent().getRouter().getRoute("RouteEmpPersonalView").attachMatched(this.getSentData,this)},onPressBackButton:function(){var e,t;e=s.getInstance();t=e.getPreviousHash;if(t!==undefined){window.history.go(-1)}},modelNull:function(){var e=this;var t={leaveDisplay:e.usingEditLeave,ID:0,EMPID:null,APPLIEDDATE:null,STARTDATE:null,ENDDATE:null,COUNTOFDAYS:null,REASON:"",STATUS:"",FIRSTDAYHALFDAY:null,FRISTDAYAM:1,ENDDAYHALFDAY:null,ENDDAYAM:1};t.EMPID=this.dataFetch;t.APPLIEDDATE=this.presentDate;return t},OnEditPersonal:function(){var e=this.getView().getBindingContext().getObject();var t={PHONEID:e.PHONEID,PRIMARYPHONENUMBER:e.PRIMARYPHONENUMBER,SECONDARYPHONENUMBER:e.SECONDARYPHONENUMBER,skipPhone:true,EMPID:null,EMAIL:e.EMAIL,skipEmail:true,ADDRESSID:e.ADDRESSID,COUNTRY:e.COUNTRY,STATE:e.STATE,CITY:e.CITY,skipAddress:true};t.EMPID=this.dataFetch;var a=new sap.ui.model.json.JSONModel;a.setData(t);this.getView().setModel(a,"personalDetailsModel");this._fragmentone=sap.ui.xmlfragment("com.amista.employeeapplication.Fragments.editPersonal",this);this.getView().addDependent(this._fragmentone);this._fragmentone.open()},onCancel:function(){this._fragmentone.close();this._fragmentone.destroy()},onSave:function(){var e=this.getView().getModel("personalDetailsModel").getData();var a={data:e};var s=this.getView().getModel();var n=this;if(!e.skipEmail){s.read("/checkRoleReturnId()",{success:function(s){var i=s.checkRoleReturnId;if(i!==0){a.data.skipEmail=true;t.warning("Only Admin can change Email. Please Contact Admin to change your Work Email.")}if(!e.skipAddress||!e.skipPhone){t.confirm("Please Contact Admin to change your Work Email. Do you want to continue with other changes?",{actions:["Continue","Cancel"],emphasizedAction:"Continue",onClose:function(e){if(e==="Continue"){n.callActionToFillPersonalDetails(a)}}})}else{return}}})}else this.callActionToFillPersonalDetails(a);this._fragmentone.close();this._fragmentone.destroy()},callActionToFillPersonalDetails:function(e){var a=this.getView().getModel();a.create("/fillPersonalDetails",e,{success:function(){a.refresh(true);t.success("Edited personal details successfully.")},error:function(){t.error("Error editing personal details.")}})},phoneNumberChange:function(){this.getView().getModel("personalDetailsModel").getData().skipPhone=false},mailChange:function(){this.getView().getModel("personalDetailsModel").getData().skipEmail=false},addressChange:function(){this.getView().getModel("personalDetailsModel").getData().skipAddress=false},OnApplyNewLeave:function(e){var t=this;var a=new Date;var s=sap.ui.core.format.DateFormat.getDateTimeInstance({pattern:"yyyy-MM-dd"});this.presentDate=s.format(a);var n=new sap.ui.model.json.JSONModel;n.setData(this.modelNull());this.getView().setModel(n,"LeaveApplication");this._fragmenttwo=sap.ui.xmlfragment("com.amista.employeeapplication.Fragments.applyLeaves",this);this.getView().addDependent(this._fragmenttwo);this._fragmenttwo.open()},getWorkingDays:function(e,t){var a=0;var s=new Date(e);var n=new Date(t);while(s<=n){if(s.getDay()!=0&&s.getDay()!=6){a++}s.setDate(s.getDate()+1)}return a<0?0:a},onDateChange:function(e){var t=a.funDate(this.getView().getModel("LeaveApplication").getData().STARTDATE);var s=a.funDate(this.getView().getModel("LeaveApplication").getData().ENDDATE);sap.ui.getCore().byId("daysCount").setValueState("None");if(t<=s){var n=sap.ui.getCore().byId("startHalfDay").getSelected();var i=sap.ui.getCore().byId("endHalfDay").getSelected();var o=0;var l=false;var r=this.specialCondition(t,s);if(t===s||r){sap.ui.getCore().byId("startHalfDayForm").setVisible(false);o=i?.5:0;var c=new Date(t);var d=t;if(c.getDay()===0||c.getDay()===6){if(r)d=s;else l=true}sap.ui.getCore().byId("endHalfDay").setText(d+" as Half Day")}else{o=n?i?1:.5:i?.5:0;sap.ui.getCore().byId("startHalfDayForm").setVisible(true);sap.ui.getCore().byId("endHalfDay").setText("End Date as Half Day")}this.getView().getModel("LeaveApplication").getData().STARTDATE=t;this.getView().getModel("LeaveApplication").getData().ENDDATE=s;this.getView().getModel("LeaveApplication").getData().APPLIEDDATE=a.funDate(this.getView().getModel("LeaveApplication").getData().APPLIEDDATE);var u=this.getWorkingDays(t,s)-o;if(l||u<=0){u=0;sap.ui.getCore().byId("daysCount").setValue("Can't Apply Leave on Non-Working Days.");sap.ui.getCore().byId("daysCount").setValueState("Error");l=false}else{sap.ui.getCore().byId("daysCount").setValue(u);sap.ui.getCore().byId("daysCount").setValueState("Success")}}else if(!t||!s){sap.ui.getCore().byId("daysCount").setValue("Update Both Start and End Dates");sap.ui.getCore().byId("daysCount").setValueState("Error")}else{sap.ui.getCore().byId("daysCount").setValue("Update Both Start and End Dates");sap.ui.getCore().byId("daysCount").setValueState("Error")}},specialCondition:function(e,t){var a=this.getWorkingDays(e,t);return a===1?true:false},onSelectHalfDay:function(e){var t=sap.ui.getCore().byId("startHalfDay").getSelected();var a=sap.ui.getCore().byId("endHalfDay").getSelected();this.onDateChange();sap.ui.getCore().byId("firstHalfDayGroup").setEnabled(t);sap.ui.getCore().byId("secondHalfDayGroup").setEnabled(a)},onLeaveDayCountChange:function(e){this.onDateChange()},onSaveLeave:function(e){const a=sap.ui.getCore().byId("daysCount").getValueState();var s=this.getView().getModel("LeaveApplication").getData();const n=s.COUNTOFDAYS;s.REASON=sap.ui.getCore().byId("leaveReason").getValue();if(a==="Error"||s.STARTDATE===null&&s.ENDDATE===null||s.REASON===""){t.error("Enter all the required fields!!");return}if(n==1&&s.STARTDATE===s.ENDDATE){s.FIRSTDAYHALFDAY=false}delete s._metadata;delete s.HALFDAYDESCRIPTION;delete s.leaveDisplay;if(!this.usingEditLeave){var i=this.getView().getModel();this.getView().getModel().create("/LeavesE",s,{success:function(){i.refresh(true);t.success("Leave application submitted successfully.")},error:function(){t.error("Error while submitting leave application.")}})}else{this.usingEditLeave=false;var o=this.byId("leavesTable").getSelectedItem().getBindingContext().getPath();this.getView().getModel().update(o,s,{success:function(){t.success("Leave successfully edited.")},error:function(){t.error("Error editing the leave.")}})}this.onCancelLeave()},onCancelLeave:function(e){this.usingEditLeave=false;if(this._fragmenttwo!==undefined){this._fragmenttwo.close();this._fragmenttwo.destroy()}},onDeleteLeaves:function(e){var a=this.byId("leavesTable").getSelectedItem();if(a===null){t.error("Select an Upcoming Leave to Delete!")}else{var s=this.getView().getModel();t.warning("Delete selected leave?",{actions:[sap.m.MessageBox.Action.DELETE,sap.m.MessageBox.Action.CANCEL],emphasizedAction:t.Action.DELETE,onClose:function(e){if(e==="DELETE"){var n=a.getBindingContext().getPath();s.remove(n,{success:function(e,a){t.success("Leave Successfully Cancelled!!")},error:function(e){t.error("Error Cancelling your Leave!!")}})}}})}},OnEditLeave:function(e){var s=this.byId("leavesTable").getSelectedItem();if(s===null){t.error("Select a Applied Leave to Edit!")}else{var n=s.getBindingContext();var i=new Date(n.getProperty("ENDDATE"));var o=new Date;i.setHours(0,0,0,0);o.setHours(0,0,0,0);if(i>=o){this.usingEditLeave=true;const e=this.modelNull();const t=n.getObject();Object.assign(e,t);e.APPLIEDDATE=a.funDate(e.APPLIEDDATE);e.STARTDATE=a.funDate(e.STARTDATE);e.ENDDATE=a.funDate(e.ENDDATE);var l=new sap.ui.model.json.JSONModel;l.setData(e);this.getView().setModel(l,"LeaveApplication");this._fragmenttwo=sap.ui.xmlfragment("com.amista.employeeapplication.Fragments.applyLeaves",this);this.getView().addDependent(this._fragmenttwo);sap.ui.getCore().byId("leaveReason").setValue(t.REASON);sap.ui.getCore().byId("applyLeaveDialog").setTitle("Editing an Applied Leave");this._fragmenttwo.open()}else{t.error("You Can't Edit Past Leaves!")}}},onEditSavedLeave:function(e){var a=sap.ui.getCore().byId("EditLeaveForm").getBindingContext().getObject();var s=this.byId("leavesTable").getSelectedItem().getBindingContext().getPath();delete a._metadata;delete a.HALFDAYDESCRIPTION;this.getView().getModel().update(s,a,{success:function(){t.success("Leave successfully edited.")},error:function(){t.error("Error editing the leave.")}});this.onCancelLeave2()},onStatusChange:function(e){var t=e.getSource().getSelectedKey();this.getView().getModel("LeaveApplication").getData().STATUS=t},onCancelLeave2:function(){this._fragmentfour.close();this._fragmentfour.destroy()},openPieChart:function(e){this._fragmenttwo=sap.ui.xmlfragment("com.amista.employeeapplication.Fragments.leaveAnalytics",this);this.getView().addDependent(this._fragmenttwo);this._fragmenttwo.open()},OnAddNewExpense:function(){var e=this;const t={ID:0,EMPID:e.dataFetch,EXPENSEDATE:"2023-10-12",EXPENSETYPE:"Electronics",DESCRIPTION:"AC",AMOUNT:"40000",RECEIPTNUMBER:"2233445",APPROVALSTATUS:"Rejected"};var a=new sap.ui.model.json.JSONModel;a.setData(t);this.getView().setModel(a,"ExpenseApplication");this._fragmentthree=sap.ui.xmlfragment("com.amista.employeeapplication.Fragments.addExpenses",this);this.getView().addDependent(this._fragmentthree);this._fragmentthree.open()},onSaveExpense:function(){var e=this;var a=this.getView().getModel("ExpenseApplication").getData();this.getView().getModel().create("/ExpensesE",a,{success:function(){e.getView().getModel().refresh(true);t.success("New Expense successfully created.")},error:function(){t.error("Error creating the expense.")}});this.onCancelExpense()},onCancelExpense:function(){this._fragmentthree.close();this._fragmentthree.destroy()},OnClickExpenses:function(){var e=this.getView().byId("EmpExpenseInformation");var t=e.getVisible();e.setVisible(!t);var a=this.getView().byId("ExpenseButton");if(t){a.setText("Show Expenses")}else{a.setText("Hide Expenses")}},onDeleteExpense:function(e){var a=this.byId("EmpExpenseInformation").getSelectedItems();if(a.length===0){t.error("Select at least one Expense to Delete!!")}else{var s=a.length===1?"selected Expense":"all selected Expenses";var n=this.getView().getModel();this.expensesDeleted=0;t.warning(`Delete ${s}?`,{actions:["Delete","Cancel"],emphasizedAction:"Delete",onClose:function(e){if(e==="Delete"){for(let e=0;e<a.length;e++){var s=a[e].getBindingContext().getPath();var i=this;n.remove(s,{success:function(e,s){i.expensesDeleted++;if(a.length===1)t.success("Successfully Deleted the Expense!!");else if(i.expensesDeleted===a.length)t.success("Successfully Deleted all Selected Expenses!!")},error:function(e){t.error("Error deleting the expense.")}})}}}})}},onPressfileUpload:function(){var e=sap.ui.getCore().byId("fileInput");var a=this;const s=e.FUEl.files[0];this.fileName=s.name;this.fileType=s.type;var n=new FileReader;n.onload=function(e){var t=e.currentTarget.result;a.updateFile(a.fileName,a.fileType,t)};n.readAsDataURL(s);console.log(n);var i=sap.ui.getCore().byId("fileInput");e.checkFileReadable().then(function(){e.upload()},function(e){t.error("The file can't be read.")}).then(function(){e.clear()})},updateFile:function(e,a,s){var n={RECEIPT:s};console.log(n);this.getView().getModel().update("/ExpensesE(1)",n,{success:function(){t.success("File uploaded successfully!!")},error:function(){t.error("Error uploading the file!!")}})},onDeleteLogistic:function(e){var a=this.byId("logisticsTable").getSelectedItem();if(a===null)t.error("Select a Logistic to Delete!!");else{var s=a.getBindingContext().getPath();this.getView().getModel().remove(s,{success:function(e,a){t.success("Logistic successfully deleted")},error:function(e){t.error("Error deleting the logistic.")}})}},OnClickPayslips:function(){var e=this.getView().byId("payslipsTable");var t=e.getVisible();e.setVisible(!t);var a=this.getView().byId("PayslipButton");if(t){a.setText("Show Payslips")}else{a.setText("Hide Payslips")}},onClickDownload:sap.m.Table.prototype.exportData||function(){var e=this.byId("payslipsTable").getSelectedItem();if(e===null){t.error("Select a Payslip to Download!!");return}e=e.getBindingContext().getObject();e.PAYSLIPDATE=a.funDate(e.PAYSLIPDATE);var s=new sap.ui.model.json.JSONModel;s.setData(e);this.getView().setModel(s,"PayslipSelected");var n=this.getView().getModel("PayslipSelected");var l=new i({exportType:new o({fileExtension:"xls",separatorChar:"\t"}),models:n,rows:{path:"/"},columns:[{name:"PAYSLIP_DATE",template:{content:"{/PAYSLIPDATE}"}},{name:"SALARY",template:{content:"{/SALARY}"}},{name:"OVERTIME_PAY",template:{content:"{/OVERTIMEPAY}"}},{name:"BONUS",template:{content:"{/BONUS}"}},{name:"DEDUCTIONS",template:{content:"{/DEDUCTIONS}"}},{name:"TAX",template:{content:"{/TAX}"}},{name:"NETPAY",template:{content:"{/NETPAY}"}}]});console.log(l);l.saveFile("Payslips").catch(function(e){console.log("error123 : ",e)}).then(function(){l.destroy();console.log("Success")})},getSentData:function(e){this.dataFetch=e.getParameter("arguments").EMPID;this.getView().bindElement({path:"/EMPLOYEE("+this.dataFetch+")",parameters:{expand:"LOGISTICS,PAYSLIPS,LEAVES,EXPENSENS",format:"json"}})}})});