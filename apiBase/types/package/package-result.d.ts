type ISetPackageResult = IBaseApi<{
  ID: number;
  StudentID: number;
  StudentName: string;
  SetPackageDetailID: number;
  SetPackageLevel: any;
  ExamTopicID: number;
  ExamTopicName: string;
  ExamTopicType: number;
  ExamTopicTypeName: string;
  TeacherID: number;
  TeacherName: null;
  NumberExercise: number;
  CorrectNumber: number;
  WrongNumber: number;
  Note: string;
  Point: number;
  isDone: boolean;
}>;
