type IExamServices = IBaseApi<{
  ID: number;
  SupplierServicesID: number;
  SupplierServicesName: string;
  ServicesID: number;
  ServicesName: string;
  DayOfExam: string;
  Amount: number;
  TimeExam: string;
  InitialPrice: number;
  Price: number;
  ExamOfServiceStyle: number;
}>;
