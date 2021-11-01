type ITestFirst = {
	StudentID: number;
	ExamAppointmentID: number;
	ExamAppointmentResultDetailInfoList: Array<{
		ExamTopicDetailID: number;
		ExerciseGroupID: number;
		Level: number;
		Type: number;
		SkillID: number;
		ExamAppointmentExerciseStudentInfoList: Array<{
			ExerciseID: number;
			ExamAppointmentExerciseAnswerStudentList: Array<{
				AnswerID: number;
				AnswerContent: string;
				FileAudio: string;
			}>;
		}>;
	}>;
};

type ITestExamination = {
	StudentID: number;
	SetPackageDetailID: number;
	SetPackageResultDetailInfoList: Array<{
		ExamTopicDetailID: number;
		ExerciseGroupID: number;
		Level: number;
		Type: number;
		SkillID: number;
		SetPackageExerciseStudentInfoList: Array<{
			ExerciseID: number;
			SetPackageExerciseAnswerStudentList: Array<{
				AnswerID: number;
				AnswerContent: string;
				FileAudio: string;
			}>;
		}>;
	}>;
};
