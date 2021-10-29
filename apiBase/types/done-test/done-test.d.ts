type SetPackageExerciseAnswerStudent = {
  ID: number;
  ExerciseAnswerID: number;
  ExerciseAnswerContent: string;
  isTrue: boolean;
  AnswerID: number;
  AnswerContent: string;
  isResult: boolean;
  FileAudio: string;
  AnswerComment: Array<any>;
};

type SetPackageExerciseStudent = {
  ID: number;
  ExerciseID: number;
  Point: number;
  isDone: boolean;
  Content: string;
  inputID: number;
  LinkAudio: string;
  DescribeAnswer: string;
  isTrue: boolean;
  Level: number;
  LevelName: string;
  Type: number;
  TypeName: string;
  SkillID: number;
  SkillName: string;
  SetPackageExerciseAnswerStudent: Array<SetPackageExerciseAnswerStudent>;
};

type IDoneTest = IBaseApi<{
  ID: 7;
  SetPackageResultID: number;
  ExamTopicDetailID: number;
  ExerciseGroupID: number;
  Content: string;
  Paragraph: string;
  Introduce: string;
  LinkAudio: string;
  Level: number;
  LevelName: string;
  Type: number;
  TypeName: string;
  SkillID: number;
  SkillName: string;
  ExerciseType: number;
  ExerciseTypeName: string;
  Index: number;
  SetPackageExerciseStudent: Array<SetPackageExerciseStudent>;
}>;
