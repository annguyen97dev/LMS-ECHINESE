type IStaff = IBaseApi<{
  ID: number;
  UserInformationID: number;
  FullNameUnicode: string;
  Mobile: string;
  RoleID: number;
  RoleName: string;
  Month: number;
  Year: number;
  Salary: number;
  Style: number;
  styleName: string;
  TeachingTime: number;
  TotalSalary: number;
}>;