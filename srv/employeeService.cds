using DATA from '../db/tables';
using {
    // CV_FNEMP1,
    // CV_FNEMP2,
    // CV_EMPGROUP,
    CV_AP,
    CV_EMP,
    CV_ADDRESS,
    CV_COMPANY,
    CV_DEPARTMENT,
    CV_EXPENSES,
    CV_LEAVES,
    CV_PAYSLIPS,
    CV_PHONE,
    CV_EMPLOYEE,
    CV_COMBINED
} from '../db/views'; //from views.cds file

@requires: 'authenticated-user'
// // @(path: '/EmployeeServices')
service DetailsEmployeeServices {

    entity OTHERTABLE           as projection on DATA.ZCORTO0030812_DATA_data_App;
    entity TABLE                as projection on DATA.MYTABLE;
    entity USERS                as projection on DATA.USER;
    entity ROLES                as projection on DATA.ROLES;
    entity EMP1                 as projection on DATA.EMPLOYEE;
    function getEmployees(ID : Integer)                                                           returns array of String; //unbound function


    entity EMPLOYEE             as projection on CV_COMBINED {
        EMPID                as ![EMPID] ,
        FIRSTNAME            as ![FIRSTNAME] ,
        LASTNAME             as ![LASTNAME] ,
        DATEOFBIRTH          as ![DATEOFBIRTH] ,
        GENDER               as ![GENDER] ,
        SALARY               as ![SALARY] ,
        HIREDATE             as ![HIREDATE] ,
        EMAIL                as ![EMAIL] ,
        ROLE                 as ![ROLE] ,
        JOBTITLE             as ![JOBTITLE] ,
        ADDRESSID            as ![ADDRESSID] ,
        QUALIFICATIONID      as ![QUALIFICATIONID] ,
        PHONEID              as ![PHONEID] ,
        DEPARTMENTID         as ![DEPARTMENTID] ,
        COMPANYID            as ![COMPANYID] ,
        STREET               as ![STREET] ,
        STATE                as ![STATE] ,
        POSTALCODE           as ![POSTALCODE] ,
        COUNTRY              as ![COUNTRY] ,
        CITY                 as ![CITY] ,
        HIGHESTDEGREE        as ![HIGHESTDEGREE] ,
        COLLEGE              as ![COLLEGE] ,
        PERCENTAGE           as ![PERCENTAGE] ,
        YEAREARNED           as ![YEAREARNED] ,
        FIELDOFSTUDY         as ![FIELDOFSTUDY] ,
        COUNTRYCODE          as ![COUNTRYCODE] ,
        PRIMARYPHONENUMBER   as ![PRIMARYPHONENUMBER] ,
        SECONDARYPHONENUMBER as ![SECONDARYPHONENUMBER] ,
        DEPARTMENTNAME       as ![DEPARTMENTNAME] ,
        DEPARTMENTMANAGERID  as ![DEPARTMENTMANAGERID] ,
        BUDGET               as ![BUDGET] ,
        COMPANYNAME          as ![COMPANYNAME] ,
        LEAVES    : Association to many LEAVES on LEAVES.EMPID = EMPID, //Changed here
        PAYSLIPS  : Association to many PayslipsE on PAYSLIPS.EMPID = EMPID,
        LOGISTICS : Association to many LogisticsE on LOGISTICS.EMPID = EMPID,
        EXPENSENS : Association to many ExpensesE on EXPENSENS.EMPID = EMPID,
    };

    entity EMPLOYEEE            as projection on DATA.EMPLOYEE;
    entity ADDRESS              as projection on CV_ADDRESS;
    entity COMPANY              as projection on CV_COMPANY;
    entity DEPARTMENT           as projection on CV_DEPARTMENT;
    entity EXPENSES             as projection on CV_EXPENSES;
    entity LEAVES               as projection on CV_LEAVES;
    entity PAYSLIPS             as projection on CV_PAYSLIPS;
    entity PHONE                as projection on CV_PHONE;
    function EmployeeFunc(EMPID : Integer, FIRSTNAME : String, LASTNAME : String, EMAIL : String) returns String;
    // //Fuctions are for get/read and actions are for post


    // entity EmployeeDetailsAP @(restrict: [{         //because of this as I deleted the APs
    //     grant: 'READ',
    //     to   : 'Admin',
    //     where: 'EMAIL = $user'
    // },
    // // { grant: 'READ', to:'Employee', where: 'EMAIL = $user'},
    // // { grant: 'READ', to:'Manager', where: 'DEPARTMENT = "ANALYTICS"'},
    // ])                          as projection on CV_AP;

    // // entity EmployeeFunction     as projection on CV_FNEMP1;

    // // entity EMPADD1 as projection on DATA.EMPADD;

    // @insertonly
    // entity InputEmployee        as projection on CV_FNEMP2;

    // entity EmployeeCountGroupBy as projection on CV_EMPGROUP;

    @readonly
    entity EmployeeTrail        as projection on DATA.EMPLOYEE excluding {
        FIRSTNAME,
        LASTNAME,
        DATEOFBIRTH,
        GENDER,
        SALARY,
        HIREDATE,
        EMAIL

    };

    type details{
        PHONEID : Integer;
        PRIMARYPHONENUMBER: String(10);
        SECONDARYPHONENUMBER: String(10);
        skipPhone: Boolean;

        EMPID: String(5);
        EMAIL: String(250);
        skipEmail: Boolean;
        
        ADDRESSID: Integer;
        COUNTRY: String(100);
        STATE: String(50);
        CITY: String(100);
        skipAddress: Boolean;
    };

    action   fillPersonalDetails(data: details);

    entity CompanyE             as projection on DATA.COMPANY

    actions { //bound action
        action getName(ID : Integer) returns array of String;
    };

    function checkRoleReturnId() returns Integer;

    entity CompanyWithRestrict  as projection on DATA.COMPANY

    // @(restrict: [{grant: 'READ'},
    // // SESSION_CONTEXT('APPLICATINOUSER')
    // // { grant: ['READ','WRITE'], where: 'CreatedBy = $user' },
    // ])

    entity AddressE             as projection on DATA.ADDRESS;
    entity QualificationE       as projection on DATA.QUALIFICATION;
    entity ExpensesE            as projection on DATA.EXPENSENS;
    entity LogisticsE           as projection on DATA.LOGISTICS;
    entity PhoneE               as projection on DATA.PHONE;
    entity DepartmentE          as projection on DATA.DEPARTMENT;
    entity LeavesE              as projection on DATA.LEAVES;
    entity PayslipsE            as projection on DATA.PAYSLIPS;

    entity BasicEmployeeDetails as
        select from DATA.EMPLOYEE as e
        inner join DATA.JOB as j
            on e.JOBID = j.JOBID
        inner join DATA.DEPARTMENT as d
            on e.DEPARTMENTID = d.DEPARTMENTID
        {
            key e.EMPID          as ![EmployeeId] ,
                e.FIRSTNAME      as ![EmployeeName] ,
                e.GENDER         as ![Gender] ,
                j.JOBTITLE       as ![JobTitle] ,
                d.DEPARTMENTNAME as ![DepartmentName]
        };

    entity EMPLOYEE6            as // Joining calculation views
        select from CV_EMPLOYEE as e
        inner join CV_PHONE as p
            on e.PHONEID = p.PHONEID
        {
            key e.EMPID                as ![EMPID] ,
                e.FIRSTNAME            as ![FIRSTNAME] ,
                e.LASTNAME             as ![LASTNAME] ,
                e.EMAIL                as ![EMAIL] ,
                e.DATEOFBIRTH          as ![DOB] ,
                e.GENDER               as ![GENDER] ,
                e.SALARY               as ![SALARY] ,
                e.HIREDATE             as ![HIREDATE] ,
                p.COUNTRYCODE          as ![COUNTRYCODE] ,
                p.PRIMARYPHONENUMBER   as ![PRIMARYPHONENUMBER] ,
                p.SECONDARYPHONENUMBER as ![SECONDARYPHONENUMBER]

        };

}
