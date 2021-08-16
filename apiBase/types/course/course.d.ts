type ICourse = IBaseApi<{
  ID: number;
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
}>;
