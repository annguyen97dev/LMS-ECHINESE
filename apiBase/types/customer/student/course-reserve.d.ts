type ICourseReserve = IBaseApi<{
  ID: number;
  BranchID: number;
  BranchName: string;
  ProgramID: number;
  ProgramName: string;
  CourseOfStudentID: number;
  CourseOfStudentPriceID: number;
  ProgramPrice: number;
  ReserveDate: string;
  ExpirationDate: string;
  Note: string;
  StatusID: number;
  StatusName: string;
// reserve insert student to course
  UserInformationID: number;
  CourseReserveID: number;
  CourseID: number;
  Paid: number;
  BranchID: number;
  PaymentMethodsID: number;
  PayDate: string;
}>;
