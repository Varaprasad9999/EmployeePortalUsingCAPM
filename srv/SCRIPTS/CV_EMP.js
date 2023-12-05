async function createEntry(req) {
    req.data.Id = (await cds.run(`Select SEQ_EMP.NEXTVAL as ID FROM DUMMY`))[0].ID;   //The output from dummy is in the from of 2D array
    await cds.insert('DATA_EMPLOYEE',{
        EMPID: req.data.Id, 
        FIRSTNAME: req.data.FirstName, 
        LASTNAME: req.data.LastName, 
        DATEOFBIRTH: req.data.DateOfBirth, 
        EMAIL: req.data.Email
    });
}