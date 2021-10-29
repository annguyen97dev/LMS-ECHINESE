type IExamDetail = IBaseApi<{
  ID: number;
  ExamTopicID: number;
  ExerciseGroupID: number;
  Content: string;
  Paragraph: string;
  Introduce: string;
  LinkAudio: string;
  CountExe: number;
  Level: number;
  LevelName: string;
  Type: number;
  TypeName: string;
  Enable: true;
  ExerciseTopic: any;
  SkillID: number;
  SkillName: string;
}>;
