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

type ICourseRegistrationIntoCourse = IBaseApi<{
  ListCourseRegistration: any; //List<int> :Nhập là danh sách ID cần chuyển vào khóa học
  CourseID: number; //int: ID khóa học
  isContract: boolean; //true-có hợp đồng
}>;
