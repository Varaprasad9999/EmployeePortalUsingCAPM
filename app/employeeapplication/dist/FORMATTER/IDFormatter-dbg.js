sap.ui.define([], function(){
    "use strict";

    return {

        funID : function(value){

            var returnVal = "";

            if(value < 3){

                returnVal = "Success";
            }
            else if(value>=3 & value<6){
                returnVal = "Warning";
            }
            else{
                returnVal = "Error";
            }

            return returnVal;
        }
    }


} );