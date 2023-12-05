sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "com/amista/employeeapplication/FORMATTER/dateFormatter",
  "sap/ui/core/routing/History",
  "sap/ui/core/UIComponent",
  "sap/ui/core/util/Export",
  "sap/ui/core/util/ExportTypeCSV"
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageBox, dateFormatter, History, UIComponent, Export, ExportTypeCSV) {
    "use strict";


    return Controller.extend("com.amista.employeeapplication.controller.EmpPersonalView", {

      dateFormatter: dateFormatter,

      onInit: function () {

        // var model = this.getOwnerComponent().getModel();   if not in onInit then edit option needs to be used twice for at least one time to enable TwoWay Binding.
        // model.setDefaultBindingMode('TwoWay');
        this.usingEditLeave = false;
        this.getOwnerComponent().getRouter().getRoute("RouteEmpPersonalView").attachMatched(this.getSentData, this);



      },


      onPressBackButton: function () {
        var oHistory, sPreviousHash;

        oHistory = History.getInstance();
        sPreviousHash = oHistory.getPreviousHash;

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        }

      },

      modelNull: function () {
        var that = this;
        var fortwoway = {     //Can easily use this single global object both for apply & edit leaves but the data binded at time of edit leave will be shown when applying for a new leave.
          leaveDisplay: that.usingEditLeave,
          ID: 0,
          EMPID: null,
          APPLIEDDATE: null,
          STARTDATE: null,
          ENDDATE: null,
          COUNTOFDAYS: null,
          REASON: '',
          STATUS: '',
          FIRSTDAYHALFDAY: null,
          FRISTDAYAM: 1,
          ENDDAYHALFDAY: null,
          ENDDAYAM: 1
        }

        fortwoway.EMPID = this.dataFetch;

        fortwoway.APPLIEDDATE = this.presentDate;


        return fortwoway;
      },

      OnEditPersonal: function () { // Open editPersonal fragment
        var personalData = this.getView().getBindingContext().getObject();

        var details = {
          PHONEID: personalData.PHONEID,
          PRIMARYPHONENUMBER: personalData.PRIMARYPHONENUMBER,
          SECONDARYPHONENUMBER: personalData.SECONDARYPHONENUMBER,
          skipPhone: true,

          EMPID: null,
          EMAIL: personalData.EMAIL,
          skipEmail: true,

          ADDRESSID: personalData.ADDRESSID,
          COUNTRY: personalData.COUNTRY,
          STATE: personalData.STATE,
          CITY: personalData.CITY,
          skipAddress: true,
        };

        details.EMPID = this.dataFetch;

        var personalDetailsModel = new sap.ui.model.json.JSONModel();
        personalDetailsModel.setData(details);
        this.getView().setModel(personalDetailsModel, "personalDetailsModel");

        this._fragmentone = sap.ui.xmlfragment("com.amista.employeeapplication.Fragments.editPersonal", this);
        this.getView().addDependent(this._fragmentone);


        this._fragmentone.open();

      },

      onCancel: function () {
        this._fragmentone.close();
        this._fragmentone.destroy();
      },

      onSave: function () {

        var details = this.getView().getModel("personalDetailsModel").getData();

        var detail = {
          data: details
        }
        // debugger;
        var odataModel = this.getView().getModel();
        var that =this;


        if (!details.skipEmail) // need to be changed.
        {
          odataModel.read('/checkRoleReturnId()', {

            success: function (odata) {
              var user = odata.checkRoleReturnId;

              if (user !== 0) { //Not Admin
                detail.data.skipEmail = true;

                MessageBox.warning("Only Admin can change Email. Please Contact Admin to change your Work Email.");
              }

              if (!details.skipAddress || !details.skipPhone) //if more details need to be changed.
              {
                MessageBox.confirm('Please Contact Admin to change your Work Email. Do you want to continue with other changes?', {

                  actions: ["Continue", "Cancel"],
                  emphasizedAction: "Continue",
                  onClose: function (selectedAction) {

                    if (selectedAction === "Continue") {

                      that.callActionToFillPersonalDetails(detail);

                    }
                  }
                })
              }
              else {
                return;
              }

            }
          });
        }
        else this.callActionToFillPersonalDetails(detail);


        this._fragmentone.close();
        this._fragmentone.destroy();
      },

      callActionToFillPersonalDetails: function (detail) {

        var odataModel = this.getView().getModel();

        odataModel.create('/fillPersonalDetails', detail, {
          success: function () {

            odataModel.refresh(true)
            MessageBox.success("Edited personal details successfully.");
          },
          error: function () {

            MessageBox.error("Error editing personal details.");
          }
        });
      },


      // onSave: function () {   // for promise.All()

      //    var details = this.getView().getModel("personalDetailsModel").getData();

      //    var detail = {
      //     data : details
      //    }

      //    var odataModel = this.getView().getModel();

      //   if(!details.skipEmail) // need to be changed.

      //   odataModel.read('/checkRoleReturnId()',{

      //      success: function(odata){
      //        var user = odata.checkRoleReturnId;

      //        if(user === 0){ //Admin
      //          details.skipEmail = true;
      //        }

      //        else{

      //          MessageBox.warning("Only Admin can change this field. Contact Admin to change your Work Email.");

      //          if(!details.skipAddress || !details.skipPhone ) //if more details need to be changed.
      //          {
      //             MessageBox.confirm('Do you want to continue with other changes?',{

      //                 actions: ["Continue", "Cancel"],
      //                 emphasizedAction: "Continue",
      //                 onClose: function(selectedAction){

      //                   if(selectedAction === Cancel) return;
      //                 }
      //               })
      //          }
      //          else{
      //           return;
      //          }
      //        }

      //        MessageBox.warning("Only Admin can change this field. Contact Admin to change your Work Email.");
      //      }
      //    });


      //    odataModel.create('/fillPersonalDetails', detail, {
      //     success: function(){

      //       odataModel.refresh(true)
      //       MessageBox.success("Edited personal details successfully.");
      //     },
      //     error: function(){

      //       MessageBox.error("Error editing personal details.");
      //     }
      //   });

      //   this._fragmentone.close();
      //   this._fragmentone.destroy();
      // },

      phoneNumberChange: function () {
        this.getView().getModel("personalDetailsModel").getData().skipPhone = false;
      },

      mailChange: function () {
        this.getView().getModel("personalDetailsModel").getData().skipEmail = false;
      },

      addressChange: function () {
        this.getView().getModel("personalDetailsModel").getData().skipAddress = false;
      },



      OnApplyNewLeave: function (oEvent) { // Open applyLeaves fragment

        var that = this;

        var oDate = new Date();
        var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });
        this.presentDate = dateFormat.format(oDate);

        //  var fortwoway = {
        //   "ID": 0,
        //   "EMPID": that.dataFetch,
        //   "APPLIEDDATE": that.presentDate,
        //   "STARTDATE": null,
        //   "ENDDATE": null,
        //   "COUNTOFDAYS": null,
        //   "REASON": 'Backend Entity Testing',
        //   "STATUS": 'Approved',
        //   "FIRSTDAYHALFDAY": null,
        //   "FRISTDAYAM": 1,
        //   "ENDDAYHALFDAY": null,
        //   "ENDDAYAM": 1
        // };


        var leaveModel = new sap.ui.model.json.JSONModel();
        leaveModel.setData(this.modelNull());
        this.getView().setModel(leaveModel, "LeaveApplication");

        this._fragmenttwo = sap.ui.xmlfragment("com.amista.employeeapplication.Fragments.applyLeaves", this);
        this.getView().addDependent(this._fragmenttwo);

        // var oDatePickerAppliedDate = sap.ui.getCore().byId("appliedDateInput");

        // oDatePickerAppliedDate.setValue(this.presentDate);// model refresh, valueFormat

        // this.getView().getModel("LeaveApplication").getData().APPLIEDDATE = dateFormat.format(oDate);
        // this.getView().getModel("LeaveApplication").getData().STARTDATE = dateFormat.format(oDate);
        this._fragmenttwo.open();
      },

      // onEnteringReason: function(oEvent){   // not working so directly assign while posting the leave.
      //   var value = sap.ui.getCore().byId("leaveReason").getValue();
      //   sap.ui.getCore().byId("leaveReason").setValue(value);

      // },



      getWorkingDays: function (startDate, endDate) {
        var workingDays = 0;
        var currentDate = new Date(startDate);
        var stopDate = new Date(endDate);

        while (currentDate <= stopDate) {
          if (currentDate.getDay() != 0 && currentDate.getDay() != 6) {
            workingDays++;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }

        return (workingDays < 0 ? 0 : workingDays); // if applied on Sat or Sun
      },

      onDateChange: function (oEvent) {

        var startDate = dateFormatter.funDate(this.getView().getModel("LeaveApplication").getData().STARTDATE);     //.getProperty("/STARTDATE")); gives the LeaveApplication binded Date
        var endDate = dateFormatter.funDate(this.getView().getModel("LeaveApplication").getData().ENDDATE);
        sap.ui.getCore().byId("daysCount").setValueState("None");

        if (startDate <= endDate) {
          var isSelectedStart = sap.ui.getCore().byId("startHalfDay").getSelected();
          var isSelectedEnd = sap.ui.getCore().byId("endHalfDay").getSelected();
          var totalHalfDay = 0;
          var NonWorkingDay = false;
          var leavesIncludeSatSun = this.specialCondition(startDate, endDate);

          if (startDate === endDate || leavesIncludeSatSun) { // both same date => there can only be one half day
            sap.ui.getCore().byId("startHalfDayForm").setVisible(false);


            totalHalfDay = (isSelectedEnd ? 0.5 : 0);

            var NonWorkingDayCheck = new Date(startDate); // Applying on Sat or Sun
            var specialConditionDate = startDate; // Assuming StartDate in not Sat or Sun
            if (NonWorkingDayCheck.getDay() === 0 || NonWorkingDayCheck.getDay() === 6) {

              if (leavesIncludeSatSun)
                specialConditionDate = endDate;
              else
                NonWorkingDay = true;
            }

            sap.ui.getCore().byId("endHalfDay").setText(specialConditionDate + " as Half Day");
          }
          else {
            totalHalfDay = (isSelectedStart ? (isSelectedEnd ? 1 : 0.5) : (isSelectedEnd ? 0.5 : 0));
            sap.ui.getCore().byId("startHalfDayForm").setVisible(true);
            sap.ui.getCore().byId("endHalfDay").setText("End Date as Half Day");
          }

          //backend expects in YYYY-MM-DD format
          this.getView().getModel("LeaveApplication").getData().STARTDATE = startDate;
          this.getView().getModel("LeaveApplication").getData().ENDDATE = endDate;
          this.getView().getModel("LeaveApplication").getData().APPLIEDDATE = dateFormatter.funDate(this.getView().getModel("LeaveApplication").getData().APPLIEDDATE);   // done in Edit2 but if changed

          var daysCount = (this.getWorkingDays(startDate, endDate) - totalHalfDay);

          if (NonWorkingDay || daysCount <= 0) {
            daysCount = 0;
            sap.ui.getCore().byId("daysCount").setValue("Can't Apply Leave on Non-Working Days.");
            sap.ui.getCore().byId("daysCount").setValueState("Error");
            NonWorkingDay = false;
          }
          else {
            //this.getView().getModel("LeaveApplication").setProperty("/COUNTOFDAYS", daysCount);
            sap.ui.getCore().byId("daysCount").setValue(daysCount);
            sap.ui.getCore().byId("daysCount").setValueState("Success");
          }
        }
        else if (!startDate || !endDate) {     // if any one or both of the dates does not exist.. But now endDate is taking a default value at 1-1-1970
          sap.ui.getCore().byId("daysCount").setValue("Update Both Start and End Dates");
          sap.ui.getCore().byId("daysCount").setValueState("Error");
        }
        else {
          sap.ui.getCore().byId("daysCount").setValue("Update Both Start and End Dates");
          sap.ui.getCore().byId("daysCount").setValueState("Error");
        }

      },

      specialCondition: function (startDate, endDate) { //countOfDays = 2||3 but includes Sat||Sun so count = 1 hence start and end dates are same
        var count = this.getWorkingDays(startDate, endDate);
        return (count === 1) ? true : false;

      },

      onSelectHalfDay: function (oEvent) {
        var isSelectedStart = sap.ui.getCore().byId("startHalfDay").getSelected();
        var isSelectedEnd = sap.ui.getCore().byId("endHalfDay").getSelected();

        this.onDateChange();

        sap.ui.getCore().byId("firstHalfDayGroup").setEnabled(isSelectedStart);
        sap.ui.getCore().byId("secondHalfDayGroup").setEnabled(isSelectedEnd);

      },

      onLeaveDayCountChange: function (oEvent) {

        this.onDateChange();
      },

      onSaveLeave: function (oEvent) {

        // var odata = this.getOwnerComponent().getModel(); // will the get the data from manifest.json and hence gets all the entites of the mainService when it hits employee-services
        // this.getView().getModel("LeaveApplication").getData();

        // var leaveStatus = sap.ui.getCore().byId("leaveStatus").getValue();     other way is getting each value like this and creating a payload yourself to send
        // var data = {
        //   ID: 240,
        //   EMPID: 1,
        //   APPLIEDDATE: appliedDate,
        //   STARTDATE: startDate,
        //   ENDDATE: endDate,
        //   COUNTOFDAYS: daysCount,
        //   REASON: leaveReason,
        //   STATUS: leaveStatus
        // };
        const daysCountState = sap.ui.getCore().byId("daysCount").getValueState();
        var data = this.getView().getModel("LeaveApplication").getData();
        const daysCount = data.COUNTOFDAYS;

        data.REASON = sap.ui.getCore().byId("leaveReason").getValue();

        if (daysCountState === "Error" || (data.STARTDATE === null && data.ENDDATE === null) || data.REASON === '') {
          MessageBox.error("Enter all the required fields!!");
          return;
        }



        if (daysCount == 1 && (data.STARTDATE === data.ENDDATE)) { // data type is different && daysCount is also 1 if user applies half day on only two day of leave

          data.FIRSTDAYHALFDAY = false;
        }

        delete data._metadata; // no use
        delete data.HALFDAYDESCRIPTION; //calculation view's calculated column
        delete data.leaveDisplay;// needed for expression binding in the reuse of applyLeaves fragment


        if (!this.usingEditLeave) {
          var odataModel = this.getView().getModel();

          //odata or this.getView().getModel()
          this.getView().getModel().create("/LeavesE", data, {
            success: function () {

              odataModel.refresh(true); // update gets reflected else the page neededs to be refreshed (mostly when cache is empty else updated automatically)
              MessageBox.success("Leave application submitted successfully.");
            },
            error: function () {
              MessageBox.error("Error while submitting leave application.");
            }
          });
        }

        else {
          this.usingEditLeave = false; // if give at end then if an error is triggered before then the value still will be true.
          // var data = sap.ui.getCore().byId("FormLeaveDisplay").getBindingContext().getObject(); // gets all the Employee details instead of just the leave details
          // sap.ui.getCore().byId("FormLeaveDisplay").getModel("LeaveApplication") // works

          var sPath = this.byId("leavesTable").getSelectedItem().getBindingContext().getPath();

          this.getView().getModel().update(sPath, data, {
            success: function () {

              MessageBox.success("Leave successfully edited.");
            },
            error: function () {

              MessageBox.error("Error editing the leave.");

            }
          });

        }

        this.onCancelLeave();

      },

      onCancelLeave: function (oEvent) {
        // if (this._fragmenttwo !== undefined) {
        //   this._fragmenttwo.close();
        //     this._fragmenttwo.destroy();
        //     this._fragmenttwo;
        // } else if (this._fragmentfour !== undefined) {
        //   this._fragmentfour.close();
        //     this._fragmentfour.destroy();
        // } else if (this._fragmentone !== undefined) {
        //     this._fragmentone.destroy();
        // } else {
        //     this._fragmentthree.destroy();
        // }

        this.usingEditLeave = false;

        if (this._fragmenttwo !== undefined) {
          this._fragmenttwo.close();
          this._fragmenttwo.destroy();
        }
        //   if (this._fragmentfour !== undefined)
        //   {
        //     this._fragmentfour.close();
        //   this._fragmentfour.destroy();
        // }
      },

      onDeleteLeaves: function (oEvent) {
        var LeaveSelected = this.byId("leavesTable").getSelectedItem();

        if (LeaveSelected === null) {
          MessageBox.error("Select an Upcoming Leave to Delete!");
        }
        else {

          var model = this.getView().getModel();

          MessageBox.warning("Delete selected leave?", {


            actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL], // some are not defined in Actions then just use "example"  // displayed as small only
            emphasizedAction: MessageBox.Action.DELETE,

            onClose: function (selectedAction) {
              if (selectedAction === "DELETE") {
                var pathOfLeave = LeaveSelected.getBindingContext().getPath();

                model.remove(pathOfLeave, {
                  success: function (data, response) {
                    MessageBox.success("Leave Successfully Cancelled!!");
                  },
                  error: function (error) {
                    MessageBox.error("Error Cancelling your Leave!!");
                  }
                });

              }
            }

          });


        }

      },

      OnEditLeave: function (oEvent) {     //Opens  applyleave fragment

        var item = this.byId("leavesTable").getSelectedItem();

        if (item === null) {
          MessageBox.error("Select a Applied Leave to Edit!");
        }
        else {
          var context = item.getBindingContext();
          var endDate = new Date(context.getProperty("ENDDATE"));
          var currentDate = new Date();

          endDate.setHours(0, 0, 0, 0); // comparing the time too.
          currentDate.setHours(0, 0, 0, 0);

          if (endDate >= currentDate) {
            this.usingEditLeave = true;

            const fortwowayhelper = this.modelNull();
            const data = context.getObject();
            //  fortwowayhelper = context.getObject(); overriding the key values is fine but removing the keys in the fortwowayhelper if not present in getObject()
            Object.assign(fortwowayhelper, data); //(target, source) <- and only use const as var datatype will not work

            fortwowayhelper.APPLIEDDATE = dateFormatter.funDate(fortwowayhelper.APPLIEDDATE);
            fortwowayhelper.STARTDATE = dateFormatter.funDate(fortwowayhelper.STARTDATE);
            fortwowayhelper.ENDDATE = dateFormatter.funDate(fortwowayhelper.ENDDATE);

            var leaveModel = new sap.ui.model.json.JSONModel();
            leaveModel.setData(fortwowayhelper);
            this.getView().setModel(leaveModel, "LeaveApplication");

            this._fragmenttwo = sap.ui.xmlfragment("com.amista.employeeapplication.Fragments.applyLeaves", this);
            this.getView().addDependent(this._fragmenttwo);

            sap.ui.getCore().byId("leaveReason").setValue(data.REASON); // had to do this manually if the REASON is not one of the predefined keys.

            // sap.ui.getCore().byId("toggleLeaveApplyEdit").setText("Edit Leave"); // should be set permanently but as we are destroying the fragment it is also getting destroyed.
            sap.ui.getCore().byId("applyLeaveDialog").setTitle("Editing an Applied Leave");

            // sap.ui.getCore().byId("FormLeaveDisplay").bindElement({
            //   path: spath,
            // });

            this._fragmenttwo.open();

          }
          else {

            MessageBox.error("You Can't Edit Past Leaves!");
          }
        }

      },



      // OnEditLeave: function(oEvent){     //Opens edit leaves fragment
      //   var item = this.byId("leavesTable").getSelectedItem();

      //   if(item === null){
      //     MessageBox.error("Select a Applied Leave to Edit!");
      //   }
      //   else
      //   {
      //     var context = item.getBindingContext();
      //     var endDate = new Date(context.getProperty("ENDDATE"));
      //     var currentDate = new Date();

      //     endDate.setHours(0, 0, 0, 0); // even comparing the time
      //     currentDate.setHours(0, 0, 0, 0);

      //       if(endDate >= currentDate){
      //         this._fragmentfour = sap.ui.xmlfragment("com.amista.employeeapplication.Fragments.editLeave", this);
      //         this.getView().addDependent(this._fragmentfour);
      //         var spath = context.getPath();        //Great code to make this work every function that works with byId() needs to be modified. So unless you don't want to reuse the existing applyLeave fragment use this.

      //         sap.ui.getCore().byId("EditLeaveForm").bindElement({
      //           path: spath,
      //         });

      //         // mParameters: {
      //         //   model: "LeaveApplication"  // if this LeaveApplication exists as a global model like in manifest.json then we can get the data from there else no use.
      //         // }
      //         // var model = oEvent.getSource().getBindingContext().getModel();
      //         // model.setDefaultBindingMode('TwoWay');

      //         this.getView().getModel().refresh(true);

      //       this._fragmentfour.open();

      //       }
      //       else{

      //         MessageBox.error("You Can't Edit Past Leaves!");
      //     }
      // }

      // },

      // reasonChange: function(oEvent){
      //     var reasonData = sap.ui.getCore().byId("leaveReason2").getProperty("value");

      //     sap.ui.getCore().byId("leaveReason2").setProperty("value", reasonData);

      //     // var model = oEvent.getSource().getBindingContext().getModel();
      //     // model.setDefaultBindingMode('sap.ui.model.BindingMode.TwoWay');
      //   },

      onEditSavedLeave: function (oEvent) {   //change this to work with save after edit ************

        var data = sap.ui.getCore().byId("EditLeaveForm").getBindingContext().getObject();

        var sPath = this.byId("leavesTable").getSelectedItem().getBindingContext().getPath();
        delete data._metadata; // no use
        delete data.HALFDAYDESCRIPTION;

        this.getView().getModel().update(sPath, data, {
          success: function () {

            MessageBox.success("Leave successfully edited.");
          },
          error: function () {

            MessageBox.error("Error editing the leave.");

          }
        });

        this.onCancelLeave2();
      },

      onStatusChange: function (oEvent) {

        var selected = oEvent.getSource().getSelectedKey();
        this.getView().getModel("LeaveApplication").getData().STATUS = selected;

        // sap.ui.getCore().byId("leaveStatus").setSelectedKey(selected);
      },

      onCancelLeave2: function () {

        this._fragmentfour.close();
        this._fragmentfour.destroy();
      },

      openPieChart: function (oEvent) {

        this._fragmenttwo = sap.ui.xmlfragment("com.amista.employeeapplication.Fragments.leaveAnalytics", this);
        this.getView().addDependent(this._fragmenttwo);
        this._fragmenttwo.open();
      },




      OnAddNewExpense: function () {     //Open addExpenses fragment

        var that = this;
        const myExpenseObj = {

          "ID": 0,
          "EMPID": that.dataFetch,
          "EXPENSEDATE": '2023-10-12',
          "EXPENSETYPE": 'Electronics',
          "DESCRIPTION": 'AC',
          "AMOUNT": '40000',
          "RECEIPTNUMBER": '2233445',
          "APPROVALSTATUS": 'Rejected'
        }

        var model = new sap.ui.model.json.JSONModel();
        model.setData(myExpenseObj);
        this.getView().setModel(model, "ExpenseApplication");

        this._fragmentthree = sap.ui.xmlfragment("com.amista.employeeapplication.Fragments.addExpenses", this);
        this.getView().addDependent(this._fragmentthree);
        this._fragmentthree.open();

      },

      onSaveExpense: function () {

        var that = this;
        var data = this.getView().getModel("ExpenseApplication").getData(); //myExpenseObj

        this.getView().getModel().create('/ExpensesE', data,
          {
            success: function () {

              that.getView().getModel().refresh(true);
              MessageBox.success("New Expense successfully created.");
            },
            error: function () {

              MessageBox.error("Error creating the expense.");

            }
          }
        );


        this.onCancelExpense();
      },

      onCancelExpense: function () {
        this._fragmentthree.close();
        this._fragmentthree.destroy();
      },

      OnClickExpenses: function () {  //Toggle

        var expenses = this.getView().byId("EmpExpenseInformation");
        var isVisible = expenses.getVisible();

        // Toggle visibility
        expenses.setVisible(!isVisible);

        // Toggle button text
        var button = this.getView().byId("ExpenseButton");
        if (isVisible) {
          button.setText("Show Expenses");
        } else {
          button.setText("Hide Expenses");
        }
      },

      onDeleteExpense: function (oEvent) {

        // var payslipSelected = this.byId("EmpExpenseInformation")._aSelectedPaths[0]; as _ are private variables and can be changed by SAP anytime. Hence not for explicit usage in development.
        var noOfExpenses = this.byId("EmpExpenseInformation").getSelectedItems();

        if (noOfExpenses.length === 0) {
          MessageBox.error("Select at least one Expense to Delete!!");
        }
        else {

          var deleteNoMsg = (noOfExpenses.length === 1) ? "selected Expense" : "all selected Expenses";
          var odataModel = this.getView().getModel();
          this.expensesDeleted = 0;



          MessageBox.warning(`Delete ${deleteNoMsg}?`, {

            actions: ["Delete", "Cancel"],
            emphasizedAction: "Delete",
            onClose: function (selectedAction) {
              if (selectedAction === "Delete") {

                for (let i = 0; i < noOfExpenses.length; i++) {
                  var expenseSelected = noOfExpenses[i].getBindingContext().getPath();

                  var that = this;

                  odataModel.remove(expenseSelected, {
                    success: function (data, response) {

                      that.expensesDeleted++;

                      if (noOfExpenses.length === 1)
                        MessageBox.success("Successfully Deleted the Expense!!");
                      else if (that.expensesDeleted === noOfExpenses.length)
                        MessageBox.success("Successfully Deleted all Selected Expenses!!");


                    },
                    error: function (error) {
                      MessageBox.error("Error deleting the expense.")
                    }
                  });
                }
              }
            }
          });



        }
      },


      onPressfileUpload: function () {
        var oFileUploader = sap.ui.getCore().byId("fileInput");

        // var domRef = oFileUploader.getFocusDomRef();
        // var file = domRef.files[0];
        var that = this;

        const file = oFileUploader.FUEl.files[0];
        this.fileName = file.name;
        this.fileType = file.type;

        // oFileUploader.addEventListener("change", e => {

        //   const reader = new FileReader();

        //   reader.addEventListener("load", () =>{
        //     console.log(reader.result);
        //   });

        //   reader.readAsDataURL(file);

        // });

        var reader = new FileReader();
        reader.onload = function (e) {
          var vContent = e.currentTarget.result;

          that.updateFile(that.fileName, that.fileType, vContent);
        }
        reader.readAsDataURL(file);
        console.log(reader);



        var oFile2 = sap.ui.getCore().byId("fileInput");
        oFileUploader.checkFileReadable().then(function () {
          oFileUploader.upload();
        }, function (error) {
          MessageBox.error("The file can't be read.");
        }).then(function () {
          oFileUploader.clear();
        });

      },

      updateFile: function (fileName, fileType, vContent) {     // Remember to change employeeService.js in the backend in order to use this.
        var payLoad = {
          RECEIPT: vContent
        }
        // var binary_string = URL.createObjectURL(new Blob([vContent , {type:'text/plain'}]));
        // //  window.atob(vContent);
        // payLoad.RECEIPT = binary_string;
        console.log(payLoad);

        this.getView().getModel().update('/ExpensesE(1)', payLoad, {
          success: function () {
            MessageBox.success("File uploaded successfully!!");
          },
          error: function () {
            MessageBox.error("Error uploading the file!!");
          }
        })
      },



      onDeleteLogistic: function (oEvent) {

        var logistic = this.byId("logisticsTable").getSelectedItem();

        if (logistic === null) MessageBox.error("Select a Logistic to Delete!!");

        else {
          var logisticSelected = logistic.getBindingContext().getPath();

          this.getView().getModel().remove(logisticSelected, {
            success: function (data, response) {
              MessageBox.success("Logistic successfully deleted");
            },
            error: function (error) {
              MessageBox.error("Error deleting the logistic.")
            }
          });
        }
      },


      OnClickPayslips: function () {


        var payslips = this.getView().byId("payslipsTable");
        var isVisible = payslips.getVisible();

        payslips.setVisible(!isVisible);

        var button = this.getView().byId("PayslipButton");
        if (isVisible) {
          button.setText("Show Payslips");
        } else {
          button.setText("Hide Payslips");
        }
      },

      onClickDownload: sap.m.Table.prototype.exportData || function () {

        var selectedData = this.byId("payslipsTable").getSelectedItem();

        if (selectedData === null) {
          MessageBox.error("Select a Payslip to Download!!");
          return;
        }

        selectedData = selectedData.getBindingContext().getObject();
        selectedData.PAYSLIPDATE = dateFormatter.funDate(selectedData.PAYSLIPDATE);

        var payslipModel = new sap.ui.model.json.JSONModel();
        payslipModel.setData(selectedData);
        this.getView().setModel(payslipModel, "PayslipSelected");


        var oModel = this.getView().getModel("PayslipSelected");
        var oExport = new Export({

          exportType: new ExportTypeCSV({
            fileExtension: "xls",
            separatorChar: "\t"
          }),

          models: oModel,

          rows: {
            path: '/'
          },
          columns: [{
            name: "PAYSLIP_DATE",
            template: {
              content: "{/PAYSLIPDATE}"
            }
          }, {
            name: "SALARY",
            template: {
              content: "{/SALARY}"
            }
          }, {
            name: "OVERTIME_PAY",
            template: {
              content: "{/OVERTIMEPAY}"
            }
          }, {
            name: "BONUS",
            template: {
              content: "{/BONUS}"
            }
          }, {
            name: "DEDUCTIONS",
            template: {
              content: "{/DEDUCTIONS}"
            }
          },
          {
            name: "TAX",
            template: {
              content: "{/TAX}"
            }
          },
          {
            name: "NETPAY",
            template: {
              content: "{/NETPAY}"
            }
          }
          ]
        });
        console.log(oExport);
        oExport.saveFile('Payslips').catch(function (oError) {
          console.log("error123 : ", oError);

        }).then(function () {
          oExport.destroy();
          console.log("Success");
        });
      },


      //        OR

      //   onClickDownload: function() {
      //     var oTable = this.byId("payslipsTable");
      //     var oSelectedRow = oTable.getSelectedItem();

      //     if (oSelectedRow) {
      //         var selectedData = oSelectedRow.getBindingContext().getObject();

      //         var oExport = new Export({
      //             exportType: new ExportTypeCSV({
      //                 fileExtension: "xls",
      //                 separatorChar: "\t"
      //             }),
      //             rows: {
      //                 path: '/'
      //             },
      //             columns: [
      //                 { name: "PAYSLIP_DATE", template: { content: "{/PAYSLIPDATE}" } },
      //                 { name: "SALARY", template: { content: "{/SALARY}" } },
      //                 { name: "NETPAY", template: { content: "{/NETPAY}" } },
      //                 { name: "TAX", template: { content: "{/TAX}" } },
      //                 { name: "DEDUCTIONS", template: { content: "{/DEDUCTIONS}" } },
      //                 { name: "OVERTIMEPAY", template: { content: "{/OVERTIMEPAY}" } },
      //                 { name: "BONUS", template: { content: "{/BONUS}" } },
      //                 
      //             ]
      //         });

      //         oExport.setModel(new sap.ui.model.json.JSONModel(selectedData));

      //         oExport.saveFile('Payslips').catch(function(oError) {
      //             console.error("Error: ", oError);
      //         }).then(function() {
      //             oExport.destroy();
      //         });
      //     } else {
      //         MessageBox.error("Select a Payslip to Download!!");
      //     }
      // },


      getSentData: function (oEvent) {  // For Binding the selected employeeData
        this.dataFetch = oEvent.getParameter("arguments").EMPID; //EMPID

        // this.byId("trailOne").bindElement({path: '/EMPLOYEE(' + this.dataFetch + ')', expand: 'LOGISTICS,PAYSLIPS,LEAVES,EXPENSENS', format: 'JSON' });      //, model: "specificEmployee"
        // this.byId("trailOne").bindElement({
        //   path: '/EMPLOYEE(' + this.dataFetch + ')',

        //   parameters: {
        //     expand: "LOGISTICS,PAYSLIPS,LEAVES,EXPENSENS",
        //     format: "json"
        //   },
        // }

        // );

        // To bind only the selected Employee data to the whole view

        this.getView().bindElement({
          path: '/EMPLOYEE(' + this.dataFetch + ')',
          parameters: {
            expand: "LOGISTICS,PAYSLIPS,LEAVES,EXPENSENS",
            format: "json"
          },
        });

        // this.byId("leavePieChart").bindElement({
        //   path: '/EMPLOYEE(' + this.dataFetch + ')',
        //   parameters: {
        //     ex
        //   }
        // });


      }

    });
  });


// var tempurl2 = "/details-employee-services/EMPLOYEE(" + this.dataFetch + ")?$expand=LOGISTICS,PAYSLIPS,LEAVES,EXPENSENS";

// var that = this;
// $.ajax({
//   url: tempurl2,
//   type: 'GET',

//   success: function (ans) {

//     var model2 = new sap.ui.model.json.JSONModel();
//     model2.setData(ans);
//     that.getView().setModel(model2, "LeavesData")
//   },
// });




// var tempurl = "/details-employee-services/EMPLOYEE?$filter=EMPID eq " + this.dataFetch;
// // var tempurl = "/EMPLOYEE("+this.dataFetch+")";
// var that = this;
// $.ajax({
//   url: tempurl,
//   type: 'GET',

//   success: function (ans) {

//     console.log(ans.value);
//     var model1 = new sap.ui.model.json.JSONModel();
//     model1.setData(ans.value[0]);
//     console.log(model1);
//     that.getView().setModel(model1, "EmpData");
//   },

//   error: function (err) {

//     // Handle error if needed
//     //   sap.m.MessageBox.error(err.responseText, {
//     //      title: "Error",
//     //      actions: [sap.m.MessageBox.Action.OK]
//     //    });
//     console.log("Error Ocuured");
//     console.log(err);
//   }
// });


// onSaveLeave: function () {

//   var oStartDate = this.getView().byId("startDateInput").getValue();
//   var oEndDate = this.getView().byId("endDateInput").getValue();
//   var sReason = this.getView().byId("reasonInput").getValue();

//   var oData = {
//       "EMPID": this.dataFetch,
//       "STARTDATE": oStartDate,
//       "ENDDATE": oEndDate,
//       "REASON": sReason
//   };

//   var sUrl = "/details-employee-services/LeavesE";

//   $.ajax({
//       url: sUrl,
//       method: "POST",
//       contentType: "application/json",
//       data: JSON.stringify(oData),
//       success: function(data, textStatus, jqXHR) {
//           console.log("Leave request submitted successfully!");

//           // Refresh the LeavesData model after successful submission
//           var tempurl2 = "/details-employee-services/EMP1(" + this.dataFetch + ")?$expand=LEAVES";
//           var that = this;
//           $.ajax({
//               url: tempurl2,
//               type: 'GET',
//               success: function (ans) {
//                   var model2 = new sap.ui.model.json.JSONModel();
//                   model2.setData(ans);
//                   that.getView().setModel(model2, "LeavesData");
//               }
//           });
//       },
//       error: function(jqXHR, textStatus, errorThrown) {
//           console.error("Error submitting leave request: " + errorThrown);
//       }
//   });
//   this._fragmenttwo.close();
//   this._fragmenttwo.destroy();
// },