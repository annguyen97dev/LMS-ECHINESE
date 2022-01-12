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

type ITestCheck = {
	StudentID: number;
	CourseID: number;
	CurriculumDetailID: number;
	CourseExamresultDetailInfoList: Array<{
		ExamTopicDetailID: number;
		ExerciseGroupID: number;
		Level: number;
		Type: number;
		SkillID: number;
		CourseExamExerciseStudentInfoList: Array<{
			ExerciseID: number;
			CourseExamExerciseAnswerStudentList: Array<{
				AnswerID: number;
				AnswerContent: string;
				FileAudio: string;
			}>;
		}>;
	}>;
};

type ITestHW = {
	StudentID: any;
	CourseID: any;
	CurriculumDetailID: any;
	ExamAppointmentID: any;
	HomeworkID: any;
	HomeworkResultDetailInfoList: any[];
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
