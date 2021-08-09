type IStudentAdvise = IBaseApi<{
  ID: number;
  AreaID: number;
  AreaName: string;
  CustomerName: string;
  Number: string;
  Email: string;
  SourceInformationID: number;
  SourceInformationName: string;
  CustomerConsultationStatusID: number;
  CustomerConsultationStatusName: string;
  CounselorsID: number;
  CounselorsName: string;
  Enable: boolean;
}>;
