sap.ui.define([], function () {
    "use strict";

    return {


        funDate: function (value) {

            if(value === null) return '';

            var oDate = new Date(value);
            // debugger;

            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "yyyy-MM-dd"
            });

            var formattedDate = oDateFormat.format(oDate);
            return formattedDate;
        },

        getCurrentDate: function () {


            var oDate = new Date();
            var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });
            return dateFormat.format(oDate);

        },

        displayi18n: function(entireString, name) {

            return entireString.replaceAll('{0}', name);
        }
    }


});