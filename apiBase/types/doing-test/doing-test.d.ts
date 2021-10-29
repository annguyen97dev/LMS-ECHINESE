type answerDetail = {
  AnswerID: number;
  AnswerContent: string;
  FileAudio: string;
};

type questionDetail = {
  ExerciseID: number;
  SetPackageExerciseAnswerStudentList: Array<answerDetail>;
};

type packageResultDetail = {
  ExamTopicDetailID: number;
  ExerciseGroupID: number;
  Level: number;
  Type: number;
  SkillID: number;
  SetPackageExerciseStudentInfoList: Array<questionDetail>;
};

type IDoingTest = IBaseApi<{
  StudentID: number;
  SetPackageDetailID: number;
  SetPackageResultDetailInfoList: Array<packageResultDetail>;
}>;
