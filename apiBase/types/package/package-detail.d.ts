type ISetPackageDetail = IBaseApi<{
  ID: number;
  SetPackageID: number;
  SetPackageName: string;
  ExamTopicID: number;
  ExamTopicName: string;
  SetPackageLevel: number;
  Type: number;
  TypeName: string;
  SubjectID: number;
  SubjectName: string;
  CurriculumName: string;
  Time: number;
}>;
