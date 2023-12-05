// @cds.persistence.exists
// @cds.persistence.calcview
// entity CV_FNEMP1 {
//     key EMPID             : Integer     @title: 'EMPID: EMPID';
//         FIRSTNAME         : String(100) @title: 'FIRSTNAME: FIRSTNAME';
//         LASTNAME          : String(100) @title: 'LASTNAME: LASTNAME';
//         DEPARTMENT_BUDGET : Integer     @title: 'DEPARTMENT_BUDGET: DEPARTMENT_BUDGET';
//         DEPARTMENTNAME    : String(100) @title: 'DEPARTMENTNAME: DEPARTMENTNAME';
// }

// @cds.persistence.exists
// @cds.persistence.calcview
// entity CV_FNEMP2 {
//     key EMPID     : Integer     @title: 'EMPID: EMPID';
//         FIRSTNAME : String(100) @title: 'FIRSTNAME: FIRSTNAME';

// }

// @cds.persistence.exists
// @cds.persistence.calcview
// entity CV_EMPGROUP {
//     key DEPARTMENTNAME : String(100) @title: 'DEPARTMENTNAME: DEPARTMENTNAME';
//         EMPLOYEE_COUNT : Integer     @title: 'EMPLOYEE_COUNT: EMPLOYEE_COUNT';
// }

@cds.persistence.exists
@cds.persistence.calcview
entity CV_AP {
    key EMPID           : Integer     @title: 'EMPID: EMPID';
        COMPANYID       : Integer     @title: 'COMPANYID: COMPANYID';
        FIRSTNAME       : String(100) @title: 'FIRSTNAME: FIRSTNAME';
        LASTNAME        : String(100) @title: 'LASTNAME: LASTNAME';
        DATEOFBIRTH     : Date        @title: 'DATEOFBIRTH: DATEOFBIRTH';
        GENDER          : String(10)  @title: 'GENDER: GENDER';
        DEPARTMENTID    : Integer     @title: 'DEPARTMENTID: DEPARTMENTID';
        JOBID           : Integer     @title: 'JOBID: JOBID';
        SALARY          : Decimal(15) @title: 'SALARY: SALARY';
        HIREDATE        : Date        @title: 'HIREDATE: HIREDATE';
        EMAIL           : String(250) @title: 'EMAIL: EMAIL';
        PHONEID         : Integer     @title: 'PHONEID: PHONEID';
        ADDRESSID       : Integer     @title: 'ADDRESSID: ADDRESSID';
        QUALIFICATIONID : Integer     @title: 'QUALIFICATIONID: QUALIFICATIONID';
        ROLE            : String(100) @title: 'ROLE: ROLE';
}

@cds.persistence.exists
@cds.persistence.calcview
entity EmployeeDetailsSummarized {
        FIRSTNAME                : String(100) @title: 'FIRSTNAME: FIRSTNAME';
        COMPANYNAME              : String(100) @title: 'COMPANYNAME: COMPANYNAME';
        HIREDATE                 : Date        @title: 'HIREDATE: HIREDATE';
        CC_SALARY                : String(100) @title: 'CC_SALARY: CC_SALARY';
    key EMAIL                    : String(250) @title: 'EMAIL: EMAIL';
        HIGHESTDEGREE            : String(100) @title: 'HIGHESTDEGREE: HIGHESTDEGREE';
        FIELDOFSTUDY             : String(100) @title: 'FIELDOFSTUDY: FIELDOFSTUDY';
        DEPARTMENTNAME           : String(100) @title: 'DEPARTMENTNAME: DEPARTMENTNAME';
        EXPENSETYPE              : String(100) @title: 'EXPENSETYPE: EXPENSETYPE';
        ITEMNAME                 : String(200) @title: 'ITEMNAME: ITEMNAME';
        QUANTITY                 : Integer     @title: 'QUANTITY: QUANTITY';
        COSTCATEGORY             : String(100) @title: 'COSTCATEGORY: COSTCATEGORY';
        COSTTOCOMPANY            : Decimal(8)  @title: 'COSTTOCOMPANY: COSTTOCOMPANY';
        CC_ADDRESS               : String(200) @title: 'CC_ADDRESS: CC_ADDRESS';
        APPROVALSTATUS_EXPENSES  : String(50)  @title: 'APPROVALSTATUS_EXPENSES: APPROVALSTATUS';
        LASTNAME                 : String(100) @title: 'LASTNAME: LASTNAME';
        DESCRIPTION              : String(500) @title: 'DESCRIPTION: DESCRIPTION';
        AMOUNT                   : Decimal(8)  @title: 'AMOUNT: AMOUNT';
        RECEIPTNUMBER            : String(100) @title: 'RECEIPTNUMBER: RECEIPTNUMBER';
        APPROVALSTATUS_LOGISTICS : String(50)  @title: 'APPROVALSTATUS_LOGISTICS: APPROVALSTATUS';
        PICKUPDATE               : Date        @title: 'PICKUPDATE: PICKUPDATE';
        PRIMARYPHONENUMBER       : String(10)  @title: 'PRIMARYPHONENUMBER: PRIMARYPHONENUMBER';
        SECONDARYPHONENUMBER     : String(10)  @title: 'SECONDARYPHONENUMBER: SECONDARYPHONENUMBER';
        EMP_ROLE                 : String(100) @title: 'EMP_ROLE: ROLE';
}

@cds.persistence.exists
@cds.persistence.calcview
entity CV_EMP {
    key EMPID       : Integer     @title: 'EMPID: EMPID';
        FIRSTNAME   : String(100) @title: 'FIRSTNAME: FIRSTNAME';
        LASTNAME    : String(100) @title: 'LASTNAME: LASTNAME';
        DATEOFBIRTH : Date        @title: 'DATEOFBIRTH: DATEOFBIRTH';
        EMAIL       : String(250) @title: 'EMAIL: EMAIL';
}

@cds.persistence.exists
@cds.persistence.calcview
entity CV_ADDRESS {
    key ID         : Integer     @title: 'ID: ID';
        EMPID      : Integer     @title: 'EMPID: EMPID';
        COMPANYID  : Integer     @title: 'COMPANYID: COMPANYID';
        STREET     : String(200) @title: 'STREET: STREET';
        CITY       : String(100) @title: 'CITY: CITY';
        STATE      : String(50)  @title: 'STATE: STATE';
        POSTALCODE : Integer     @title: 'POSTALCODE: POSTALCODE';
        COUNTRY    : String(100) @title: 'COUNTRY: COUNTRY';
}

@cds.persistence.exists
@cds.persistence.calcview
entity CV_COMPANY {
    key COMPANYID   : Integer     @title: 'COMPANYID: COMPANYID';
        COMPANYNAME : String(100) @title: 'COMPANYNAME: COMPANYNAME';
        ADDRESSID   : Integer     @title: 'ADDRESSID: ADDRESSID';
}

@cds.persistence.exists
@cds.persistence.calcview
entity CV_DEPARTMENT {
    key DEPARTMENTID        : Integer     @title: 'DEPARTMENTID: DEPARTMENTID';
        DEPARTMENTNAME      : String(100) @title: 'DEPARTMENTNAME: DEPARTMENTNAME';
        DEPARTMENTMANAGERID : Integer     @title: 'DEPARTMENTMANAGERID: DEPARTMENTMANAGERID';
        BUDGET              : Decimal(10) @title: 'BUDGET: BUDGET';
}

@cds.persistence.exists
@cds.persistence.calcview
entity CV_EXPENSES {
    key ID             : Integer     @title: 'ID: ID';
        EMPID          : Integer     @title: 'EMPID: EMPID';
        EXPENSEDATE    : Date        @title: 'EXPENSEDATE: EXPENSEDATE';
        EXPENSETYPE    : String(100) @title: 'EXPENSETYPE: EXPENSETYPE';
        DESCRIPTION    : String(500) @title: 'DESCRIPTION: DESCRIPTION';
        AMOUNT         : Decimal(8)  @title: 'AMOUNT: AMOUNT';
        RECEIPTNUMBER  : String(100) @title: 'RECEIPTNUMBER: RECEIPTNUMBER';
        APPROVALSTATUS : String(50)  @title: 'APPROVALSTATUS: APPROVALSTATUS';
}


@cds.persistence.exists
@cds.persistence.calcview
entity CV_LEAVES {
    key ID                 : Integer     @title: 'ID: ID';
        EMPID              : Integer     @title: 'EMPID: EMPID';
        STARTDATE          : Date        @title: 'STARTDATE: STARTDATE';
        ENDDATE            : Date        @title: 'ENDDATE: ENDDATE';
        REASON             : String(500) @title: 'REASON: REASON';
        STATUS             : String(50)  @title: 'STATUS: STATUS';
        APPLIEDDATE        : Date        @title: 'APPLIEDDATE: APPLIEDDATE';
        COUNTOFDAYS        : Decimal(3)  @title: 'COUNTOFDAYS: COUNTOFDAYS';
        FIRSTDAYHALFDAY    : Boolean     @title: 'FIRSTDAYHALFDAY: FIRSTDAYHALFDAY';
        FRISTDAYAM         : Integer     @title: 'FRISTDAYAM: FRISTDAYAM';
        ENDDAYHALFDAY      : Boolean     @title: 'ENDDAYHALFDAY: ENDDAYHALFDAY';
        ENDDAYAM           : Integer     @title: 'ENDDAYAM: ENDDAYAM';
        HALFDAYDESCRIPTION : String(100) @title: 'HALFDAYDESCRIPTION: HALFDAYDESCRIPTION';
}

@cds.persistence.exists
@cds.persistence.calcview
entity CV_PAYSLIPS {
    key ID          : Integer     @title: 'ID: ID';
        EMPID       : Integer     @title: 'EMPID: EMPID';
        PAYSLIPDATE : Date        @title: 'PAYSLIPDATE: PAYSLIPDATE';
        SALARY      : Decimal(10) @title: 'SALARY: SALARY';
        OVERTIMEPAY : Decimal(6)  @title: 'OVERTIMEPAY: OVERTIMEPAY';
        BONUS       : Decimal(6)  @title: 'BONUS: BONUS';
        DEDUCTIONS  : Decimal(6)  @title: 'DEDUCTIONS: DEDUCTIONS';
        TAX         : Decimal(6)  @title: 'TAX: TAX';
        NETPAY      : Decimal(10) @title: 'NETPAY: NETPAY';
}

@cds.persistence.exists
@cds.persistence.calcview
entity CV_PHONE {
    key PHONEID              : Integer    @title: 'PHONEID: PHONEID';
        COUNTRYCODE          : String(10) @title: 'COUNTRYCODE: COUNTRYCODE';
        PRIMARYPHONENUMBER   : String(10) @title: 'PRIMARYPHONENUMBER: PRIMARYPHONENUMBER';
        SECONDARYPHONENUMBER : String(10) @title: 'SECONDARYPHONENUMBER: SECONDARYPHONENUMBER';
}

@cds.persistence.exists
@cds.persistence.calcview
entity CV_EMPLOYEE {
    key EMPID           : Integer     @title: 'EMPID: EMPID';
        COMPANYID       : Integer     @title: 'COMPANYID: COMPANYID';
        FIRSTNAME       : String(100) @title: 'FIRSTNAME: FIRSTNAME';
        LASTNAME        : String(100) @title: 'LASTNAME: LASTNAME';
        DATEOFBIRTH     : Date        @title: 'DATEOFBIRTH: DATEOFBIRTH';
        GENDER          : String(10)  @title: 'GENDER: GENDER';
        DEPARTMENTID    : Integer     @title: 'DEPARTMENTID: DEPARTMENTID';
        JOBID           : Integer     @title: 'JOBID: JOBID';
        SALARY          : Decimal(15) @title: 'SALARY: SALARY';
        HIREDATE        : Date        @title: 'HIREDATE: HIREDATE';
        EMAIL           : String(250) @title: 'EMAIL: EMAIL';
        PHONEID         : Integer     @title: 'PHONEID: PHONEID';
        ADDRESSID       : Integer     @title: 'ADDRESSID: ADDRESSID';
        QUALIFICATIONID : Integer     @title: 'QUALIFICATIONID: QUALIFICATIONID';
        ROLE            : String(100) @title: 'ROLE: ROLE';
}

@cds.persistence.exists
@cds.persistence.calcview
entity CV_COMBINED {
    key EMPID                : Integer     @title: 'EMPID: EMPID';
        FIRSTNAME            : String(100) @title: 'FIRSTNAME: FIRSTNAME';
        LASTNAME             : String(100) @title: 'LASTNAME: LASTNAME';
        DATEOFBIRTH          : Date        @title: 'DATEOFBIRTH: DATEOFBIRTH';
        GENDER               : String(10)  @title: 'GENDER: GENDER';
        SALARY               : Decimal(15) @title: 'SALARY: SALARY';
        HIREDATE             : Date        @title: 'HIREDATE: HIREDATE';
        EMAIL                : String(250) @title: 'EMAIL: EMAIL';
        ROLE                 : String(100) @title: 'ROLE: ROLE';
        JOBTITLE             : String(100) @title: 'JOBTITLE: JOBTITLE';
        ADDRESSID            : Integer     @title: 'ADDRESSID: ADDRESSID';
        QUALIFICATIONID      : Integer     @title: 'QUALIFICATIONID: QUALIFICATIONID';
        PHONEID              : Integer     @title: 'PHONEID: PHONEID';
        DEPARTMENTID         : Integer     @title: 'DEPARTMENTID: DEPARTMENTID';
        COMPANYID            : Integer     @title: 'COMPANYID: COMPANYID';
        STREET               : String(200) @title: 'STREET: STREET';
        STATE                : String(50)  @title: 'STATE: STATE';
        POSTALCODE           : Integer     @title: 'POSTALCODE: POSTALCODE';
        COUNTRY              : String(100) @title: 'COUNTRY: COUNTRY';
        CITY                 : String(100) @title: 'CITY: CITY';
        HIGHESTDEGREE        : String(100) @title: 'HIGHESTDEGREE: HIGHESTDEGREE';
        COLLEGE              : String(200) @title: 'COLLEGE: COLLEGE';
        PERCENTAGE           : Decimal(4)  @title: 'PERCENTAGE: PERCENTAGE';
        YEAREARNED           : Integer     @title: 'YEAREARNED: YEAREARNED';
        FIELDOFSTUDY         : String(100) @title: 'FIELDOFSTUDY: FIELDOFSTUDY';
        COUNTRYCODE          : String(10)  @title: 'COUNTRYCODE: COUNTRYCODE';
        PRIMARYPHONENUMBER   : String(10)  @title: 'PRIMARYPHONENUMBER: PRIMARYPHONENUMBER';
        SECONDARYPHONENUMBER : String(10)  @title: 'SECONDARYPHONENUMBER: SECONDARYPHONENUMBER';
        DEPARTMENTNAME       : String(100) @title: 'DEPARTMENTNAME: DEPARTMENTNAME';
        DEPARTMENTMANAGERID  : Integer     @title: 'DEPARTMENTMANAGERID: DEPARTMENTMANAGERID';
        BUDGET               : Decimal(10) @title: 'BUDGET: BUDGET';
        COMPANYNAME          : String(100) @title: 'COMPANYNAME: COMPANYNAME';
}
