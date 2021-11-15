type ICourseExamResult = IBaseApi<{
	ID: number;
	CourseExamresultID: number;
	ExerciseGroupID: number;
	Introduce: string;
	Content: any;
	LinkAudio: any;
	SkillID: number;
	SkillName: string;
	Level: number;
	LevelName: string;
	Type: number;
	TypeName: string;
	ExerciseType: number;
	ExerciseTypeName: string;
	CourseExamExerciseStudent: [
		{
			ID: number;
			ExerciseID: number;
			Content: string;
			LinkAudio: string;
			DescribeAnswer: string;
			isTrue: true;

			CourseExamExerciseAnswerStudent: [
				{
					ID: number;
					ExerciseAnswerID: number;
					ExerciseAnswerContent: string;
					isTrue: true;
					AnswerID: number;
					AnswerContent: string;
					isResult: true;
					FileAudio: string;
					AnswerComment: [
						{
							ID: number;
							TextNote: string;
							TextNoteID: string;
							Note: string;
							Enable: number;
							CreatedOn: string;
							CreatedBy: string;
							ModifiedOn: string;
							ModifiedBy: string;
						}
					];
				}
			];
		}
	];
}>;
