type objAnswer = {
  ID: number;
  AnswerContent: string;
  isTrue: boolean;
};

type IExercise = IBaseApi<{
  ID: number;
  Content: string;
  Exercise: Array<objAnswer>;
  ExerciseGroupID: number;
  SubjectID: number;
  SubjectName: string;
  DescribeAnswer: string;
  Level: number;
  LevelName: string;
  LinkAudio: string;
  Type: number;
  TypeName: string;
  Enable: boolean;
}>;
