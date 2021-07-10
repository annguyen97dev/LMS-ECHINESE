type IStaffSalary = IBaseApi<{
    SalaryID: number;
    SalaryMonth: string;
    SalaryHour: string;
    UserInformationID: string;
    CountHour: number;
    Enable: boolean
  }>;