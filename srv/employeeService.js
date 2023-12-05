const SDKUtil = require('@sap-cloud-sdk/util');
const cds = require('@sap/cds'); //to manipulate the table in Context
const oCDS = require('@sap/cds-dk');
// const EMPLOYEE = require('./SCRIPTS/CV_EMP');
const colors = require("colors");
const forSeq = require('./SCRIPTS/GenNextSeq')

module.exports = async function (srv) {

    SDKUtil.setGlobalLogLevel('error');

    this.on("error", (err, req) => {
        if (!err.message || err instanceof String) {
            err = {
                message: err
            }
        }
        switch (err.message) {
            case "UNIQUE_CONSTRAINT_VIOLATION":
                err.message = `The entry already exists: ${err.message}`;
                break;

            default:
                err.message = `Technical error message(1): ${err.message}`;
                break;
        }
    });

    srv.on('checkRoleReturnId', async req =>{
        console.log(req.user.id);// is btpemail

        var btpmail = req.user.id;
        var empID = 0;

        if(req.user.is('Admin')) return empID;
        else{
            let sql = `SELECT EMPID FROM "DATA_EMPLOYEE" WHERE EMAIL = '`+ btpmail + `'`;
            empID = await cds.run(sql);
            return empID;
        }
    });


    srv.on('fillPersonalDetails', async req =>{
        const data = req.data.data;


        let sql;
        if(!data.skipPhone){

            sql = `UPDATE "DATA_PHONE" SET PRIMARYPHONENUMBER = '`+ data.PRIMARYPHONENUMBER +
                  `', SECONDARYPHONENUMBER = '`+ data.SECONDARYPHONENUMBER +
                  `' WHERE PHONEID = ` + data.PHONEID;
                  
            await cds.run(sql);
        }

        if(!data.skipEmail){

            sql = `UPDATE "DATA_EMPLOYEE" SET EMAIL = '`+ data.EMAIL +
            `' WHERE EMPID = ` + data.EMPID;

            await cds.run(sql);

        }

        if(!data.skipAddress){

            sql = `UPDATE "DATA_ADDRESS" SET STATE = '`+ data.STATE +
            `', CITY = '`+ data.CITY +
            `', COUNTRY = '`+ data.COUNTRY +
            `' WHERE ID = ` + data.ADDRESSID;

            await cds.run(sql);

        }

    });

    const { CompanyE } = srv.entities;

    srv.on('getName', async (req) => {

        const result = await oCDS.run('INSERT INTO '+ `? ("COMPANYID") VALUES (?)`, [CompanyE, req.data.ID]);
        //await cds.run(INSERT.into(CompanyE).entries(data));
        // cds.run(req.query);

        return result;
    });
 
    srv.on("getEmployees", async (req) => {   // unbound function

        console.log(req);
        const { ID } = req.data;

        const db = srv.transaction(req);
        let {EMPLOYEEE} = srv.entities;      // an entity in the service.

        const results = await db.read(EMPLOYEEE).columns('EMPID','FIRSTNAME');
        // .where({EMPID: ID});

        return results;
    });

    srv.on("CREATE", "LeavesE", async (req) => { //Enity Name

        console.log("Are your doing the job??");

        console.log(req.data);

        if (req.data.temp === -1) {
            await cds.run(DELETE.from("DATA_LEAVES").where({ ID: { '=': req.data.ID } }));

        }

        else {
            var nextID = await forSeq.getNextID("SEQ_LVS");

            console.log(nextID);
            req.data.ID = nextID;
        }

        delete req.data.temp;

        // await oCDS.run('INSERT INTO DATA_LEAVES ("ID", "EMPID", "STARTDATE", "ENDDATE", "REASON", "STATUS", "APPLIEDDATE", "COUNTOFDAYS") '+
        // `VALUES (?,?,?,?,?,?,?,?)`, [ nextID, req.EMPID, req.STARTDATE, req.ENDDATE, req.REASON, req.STATUS , req.APPLIEDDATE, req.COUNTOFDAYS ]);

        await cds.run(INSERT.into("DATA_LEAVES").entries(req.data)); //[] only if there are array of payloads --doubt

        req.reply(await cds.read("DATA_LEAVES").where({ ID: nextID }));

    });

    srv.on("CREATE", "ExpensesE", async (req) => {

        // console.log(req);
        // console.log(req.data);

        req.data.ID = await forSeq.getNextID("SEQ_EXP");

        await cds.run(INSERT.into("DATA_EXPENSENS").entries(req.data));

        req.reply(await cds.read("DATA_EXPENSENS").where({ ID: req.data.ID }));

        // await oCDS.run('INSERT INTO DATA_EXPENSES ("ID", "EMPID","EXPENSEDATE","EXPENSETYPE","DESCRIPTION","AMOUNT","RECEIPTNUMBER","APPROVALSTATUS") '+
        // `VALUES (?,?,?,?,?,?,?,?)`, [req.data.ID, req.data.EMPID, req.data.EXPENSEDATE, req.data.EXPENSETYPE, req.data.DESCRIPTION, req.data.AMOUNT, req.data.RECEIPTNUMBER, req.data.APPROVALSTATUS]);
    });

    srv.on("UPDATE", "ExpensesE", async (req) => {

        console.log(req);
        console.log(req.data);

        // var content = new Buffer.from(
        //     req.data.RECEIPT.toString().split(";base64,").pop(),
        //     "base64");

        // console.log(content);
        

        await cds.run(`UPDATE DATA_EXPENSENS SET RECEIPT = ? WHERE ID = ?`,[req.data.RECEIPT,1]);
    } );

    srv.on("DELETE", "LEAVES", async function (req) {
        // console.log("I am not wasted!!!");  no action required??

        await cds.run(DELETE.from("DATA_LEAVES").where({ ID: { '=': req.data.ID } }));
    });

    srv.on("UPDATE", 'LEAVES', async (req) => {
        console.log(req.data);

        await cds.run(DELETE.from("DATA_LEAVES").where({ ID: { '=': req.data.ID } }));

        await cds.run(INSERT.into("DATA_LEAVES").entries(req.data));

        // await cds.run(`UPDATE DATA_LEAVES SET REASON = ?, STARTDATE = ? WHERE ID = ?`,[req.data.REASON, req.data.STARTDATE, req.data.ID]);
    });



    srv.on('DELETE', 'ExpensesE', async function (req) { //event, entity, handler


        await cds.run(DELETE.from("DATA_EXPENSENS").where({ ID: { '=': req.data.ID } }));

    });

    srv.on('DELETE', 'LogisticsE', async function (req) { //event, entity, handler

        await cds.run(DELETE.from("DATA_LOGISTICS").where({ ID: { '=': req.data.ID } }));

    });

    srv.on('CREATE', 'EMPLOYEE', async function (req) { //Entity name

        console.log("Hi");
        req.data.Id = (await cds.run(`Select SEQ_EMP.NEXTVAL as ID FROM DUMMY`))[0].ID;   //The output from dummy is in the from of 2D array
        await cds.insert('DATA_EMPLOYEE', { // Table Name
            EMPID: req.data.Id,
            FIRSTNAME: req.data.FirstName,
            LASTNAME: req.data.LastName,
            EMAIL: req.data.Email
        });
    });

    srv.on('EmployeeFunc', async function (req) {

        console.log(req.data);
        req.data = {
            EMPID: 99, FIRSTNAME: 'Entry99', LASTNAME: 'From Test Function', EMAIL: 'hiK@gmail.com'
        };

        req.data.EMPID = (await cds.run(`Select SEQ_EMP.NEXTVAL as ID FROM DUMMY`))[0].ID;

        await cds.create('DATA_EMPLOYEE', {
            EMPID: req.data.EMPID,
            FIRSTNAME: req.data.FIRSTNAME,
            LASTNAME: req.data.LASTNAME,
            EMAIL: req.data.EMAIL
        });
    });

    //     srv.before("*", req => {
    //        console.log(`Method: ${req.method}`.red.inverse);
    //     //    console.log(`Target: ${req.target.name}`.yellow.inverse);
    //    });



}

