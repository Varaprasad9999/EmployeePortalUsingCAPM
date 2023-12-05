sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("com.amista.employeeapplication.controller.App", {
        onInit() {

          // console.log(req.user);
          var then = this;

          // debugger;
          this.getOwnerComponent().getModel().read('/checkRoleReturnId()', {
            success: function(odata){
              console.log(odata);

              if(odata.checkRoleReturnId === 0) //Admin
                then.getOwnerComponent().getRouter().navTo("RouteEmployeePortalView");

              else{
                then.getOwnerComponent().getRouter().navTo("RouteEmpPersonalView",{
                  EMPID : odata.checkRoleReturnId.EMPID
              });
              }
            },
            error: function(){
              console.log("You are saved!! Not an Employee!");
            }
          });
        }
      });
    }
  );
  