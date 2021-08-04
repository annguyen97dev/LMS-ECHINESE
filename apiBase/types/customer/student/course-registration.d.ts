type ICourseRegistration = IBaseApi<{
  ID: number;
  UserInformationID: number;
  FullNameUnicode: string;
  BranchID: number;
  BranchName: string;
  ProgramID: number;
  ProgramName: string;
  StudyTimeID: number;
  StudyTimeName: string;
}>;
