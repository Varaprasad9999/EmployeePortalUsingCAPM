sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/amista/employeeapplication/FORMATTER/IDFormatter",
    "sap/ui/core/routing/History",
	"sap/ui/core/UIComponent"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, IDFormatter, History, UIComponent) { //
        "use strict";


        return Controller.extend("com.amista.employeeapplication.controller.EmployeePortalView", {


            FormatID: IDFormatter,

            onInit: function () {


            },

            onListItemPress : function(oEvent){

                var EMPID = oEvent.getSource().getBindingContext().getProperty("EMPID"); 

                // console.log(EMPID);

                this.getOwnerComponent().getRouter().navTo("RouteEmpPersonalView",{
                    EMPID : EMPID
                });
                
            },

            onPressBackButton: function(){
                var oHistory, sPreviousHash;
        
                oHistory = History.getInstance().getPreviousHash;
        
                if(oHistory !== undefined){
                    window.history.go(-1);
                }
        
              },


        });
    });
