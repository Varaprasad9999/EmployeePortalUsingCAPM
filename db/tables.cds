using {managed} from '@sap/cds/common';


context DATA {

    entity EMPLOYEE {
            // key ID         : Integer;
            //     FIRST_NAME : String(100);
            //     LAST_NAME  : String(100);
            //     Email      : String(250);
            //     AGE        : Integer;
            //     DEPT_ID    : Integer;

        key EMPID           : Integer;
            COMPANYID       : Integer;
            FIRSTNAME       : String(100);
            LASTNAME        : String(100);
            DATEOFBIRTH     : Date;
            GENDER          : String(10);
            DEPARTMENTID    : Integer;
            JOBID           : Integer; //id
            SALARY          : Decimal(15, 2);
            HIREDATE        : Date;
            EMAIL           : String(250);
            PHONEID         : Integer;
            ADDRESSID       : Integer;
            QUALIFICATIONID : Integer;
            ROLE            : String(100);
            LEAVES          : Association to many LEAVES
                                  on LEAVES.EMPID = EMPID;
            PAYSLIPS        : Association to many PAYSLIPS
                                  on PAYSLIPS.EMPID = EMPID;
            LOGISTICS       : Association to many LOGISTICS
                                  on LOGISTICS.EMPID = EMPID;
            EXPENSENS       : Association to many EXPENSENS
                                  on EXPENSENS.EMPID = EMPID;
    };

    entity COMPANY {
        key COMPANYID   : Integer;
            COMPANYNAME : String(100);
            ADDRESSID   : Integer;
    };

    entity ADDRESS {
        key ID         : Integer;
            EMPID      : Integer;
            COMPANYID  : Integer;
            STREET     : String(200);
            CITY       : String(100);
            STATE      : String(50);
            POSTALCODE : Integer;
            COUNTRY    : String(100);
    }

    entity QUALIFICATION {
        key ID            : Integer;
            HIGHESTDEGREE : String(100);
            COLLEGE       : String(200);
            PERCENTAGE    : Decimal(4, 2);
            YEAREARNED    : Integer;
            FIELDOFSTUDY  : String(100);
    }

    entity EXPENSENS {
        key ID             : Integer;
            EMPID          : Integer;
            EXPENSEDATE    : Date;
            EXPENSETYPE    : String(100);
            DESCRIPTION    : String(500);
            AMOUNT         : Decimal(8, 2);
            RECEIPTNUMBER  : String(100);
            APPROVALSTATUS : String(50);
            RECEIPT        : LargeString;
    }

    entity LOGISTICS {
        key ID             : Integer;
            EMPID          : Integer;
            ITEMNAME       : String(200);
            QUANTITY       : Integer;
            PICKUPDATE     : Date;
            RETURNDATE     : Date;
            COSTTOCOMPANY  : Decimal(8, 2);
            COSTCATEGORY   : String(100);
            APPROVALSTATUS : String(50);
    }

    entity PHONE {
        key PHONEID              : Integer;
            COUNTRYCODE          : String(10);
            PRIMARYPHONENUMBER   : String(10);
            SECONDARYPHONENUMBER : String(10);
    }

    entity RESULTS {
        NONWEEKDAYS : Integer;
    }

    entity DEPARTMENT {
        key DEPARTMENTID        : Integer;
            DEPARTMENTNAME      : String(100);
            DEPARTMENTMANAGERID : Integer;
            BUDGET              : Decimal(10, 2);
    }

    entity JOB {
        key JOBID    : Integer;
            JOBTITLE : String(100);
    }

    entity LEAVES {
        key ID              : Integer;
            EMPID           : Integer;
            STARTDATE       : Date;
            ENDDATE         : Date;
            REASON          : String(500);
            STATUS          : String(50);
            APPLIEDDATE     : Date;
            COUNTOFDAYS     : Decimal(3, 1);
            FIRSTDAYHALFDAY : Boolean;
            FRISTDAYAM      : Integer; // 0 => true, 1 => false, -1 => neither
            ENDDAYHALFDAY   : Boolean;
            ENDDAYAM        : Integer;
    }

    entity PAYSLIPS {
        key ID          : Integer;
            EMPID       : Integer;
            PAYSLIPDATE : Date;
            SALARY      : Decimal(10, 2);
            OVERTIMEPAY : Decimal(6, 2); // No Leaves and Extra Time
            BONUS       : Decimal(6, 2); // Also includes approved company expenses
            DEDUCTIONS  : Decimal(6, 2); // Leaves
            TAX         : Decimal(6, 2);
            NETPAY      : Decimal(10, 2);
    }

    entity USER {
        key USERID      : Integer;
            NAME        : String(100);
            DATEOFBIRTH : Date;
            GENDER      : String(6);
            ROLES       : Composition of many ROLES
                              on ROLES.USERID = USERID;

    }

    entity ROLES {
        key ROLEID   : Integer;
            USERID   : Integer;
            ROLENAME : String(50);
    }

    entity ![ZCORTO0030812_DATA_data_App] {
        key ![Id]        : Integer     @title        : 'Id';
            ![Title]     : String(250) @title        : 'Title';
            ![CreatedOn] : Timestamp   @cds.on.insert: $now         @title        : 'CreatedOn';
            ![CreatedBy] : String(10)  @cds.on.insert: $user        @title        : 'CreatedBy';
            ![Data]      : LargeString @title        : 'Data';
            ![Timestamp] : Timestamp   @title        : 'Timestamp'  @cds.on.insert: $now;
            ![ChangedOn] : Timestamp   @title        : 'ChangedOn'  @cds.on.insert: $now  @cds.on.update: $now;
            ![ChangedBy] : String(10)  @title        : 'ChangedBy'  @cds.on.insert: $user;


    }

    entity MYTABLE : managed {
        key ID   : Integer;
            NAME : localized String(100);
    }


}
