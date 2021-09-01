type ICourse = IBaseApi<{
  CourseName: string;
  AcademicUID: number;
  BranchID: number;
  EndDay: string;
  GradeID: number;
  Price: string;
  ProgramID: number;
  TypeCourse: string;
  CurriculumID: number;
  StartDay: string;
  Schedule: object[];
  ID: number;
}>;

type ICourseDetail = IBaseApi<{
  ID: number;
  CourseName: string;
  BranchID: number;
  GradeID: number;
  ProgramID: number;
  CurriculumID: number;
  StartDay: string;
  EndDay: string;
  Price: number;
  Status: number;
  StatusName: string;
  AcademicUID: number;
  TeacherLeaderUID: number;
  Enable: boolean;
  TypeCourse: number;
}>;
