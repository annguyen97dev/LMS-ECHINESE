type IStaffSalary = IBaseApi<{
  SalaryID: number,
  UserInformationID: number,
  FullName: string,
  UserName: string,
  Email: string,
  Role: string,
  Salary: number,
  Style: number,
  StyleName: string,
  ModifiedBy: string,
  ModifiedDat: string
  }>;