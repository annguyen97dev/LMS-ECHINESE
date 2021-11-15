type ISetPackageResultDetail = IBaseApi<{
	ID: number;
	SetPackageResultID: number;
	ExerciseGroupID: number;
	Content: any;
	LinkAudio: any;
	Level: number;
	LevelName: string;
	Type: number;
	TypeName: string;
	ExerciseType: number;
	SetPackageExerciseStudent: [
		{
			ID: number;
			ExerciseID: number;
			Content: string;
			LinkAudio: string;
			DescribeAnswer: string;
			isTrue: true;

			SetPackageExerciseAnswerStudent: [
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
