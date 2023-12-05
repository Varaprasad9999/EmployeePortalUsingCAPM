const cds = require('@sap/cds');

module.exports = {
    getNextID: async function getNextID(seq){
        return (await cds.run("SELECT "+ seq + ".NEXTVAL as ID FROM DUMMY"))[0].ID;
    }
};