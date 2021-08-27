type ITestCustomerPoint = IBaseApi<{
  ExamAppointmentID: number;
  UserInformationID: number;
  ListeningPoint: number;
  SpeakingPoint: number;
  ReadingPoint: number;
  WritingPoint: number;
  VocabPoint: number;
  MaxTuitionOfStudent: number;
  TeacherID: number;
  TeacherName: string;
  CounselorsID: any;
  CounselorsName: any;
  Note: string;
  Enable: boolean;
}>;
