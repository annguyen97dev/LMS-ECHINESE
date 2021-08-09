type IContractCustomerList = IBaseApi<{
    ID: number,
    UserInformationID: number,
    FullNameUnicode: string,
    CourseID: number,
    CourseName: string,
    CourseOfStudentID: number,
    ContractContent: any,
    Enable: boolean,
    CreatedOn: string,
    CreatedBy: string,
    ModifiedOn: string,
    ModifiedBy: string
  }>;
  