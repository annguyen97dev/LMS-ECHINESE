type IExamTopic = IBaseApi<{
  ID: number;
  Name: string;
  Code: string;
  Type: number;
  TypeName: string;
  CurriculumID: number;
  CurriculumName: string;
  NumberExercise: number;
  Time: number;
  DifficultExercise: number;
  NormalExercise: number;
  EasyExercise: number;
  Description: string;
  ProgramName: string;
}>;
