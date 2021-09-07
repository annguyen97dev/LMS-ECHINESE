type IExerciseGroup = IBaseApi<{
  ID: number;
  Content: string;
  SubjectID: number;
  SubjectName: string;
  CountExe: number;
  LinkAudio: string;
  Level: number;
  LevelName: string;
  Type: number;
  TypeName: string;
  Enable: boolean;
  ExerciseList: any;
  Paragraph: string;
}>;
