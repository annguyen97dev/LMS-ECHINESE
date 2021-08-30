type IExamTopic = IBaseApi<{
	ID: number;
	Name: string;
	Code: string;
	Type: number;
	TypeName: string;
	SubjectID: number;
	SubjectName: string;
	NumberExercise: number;
	Time: number;
	DifficultExercise: number;
	NormalExercise: number;
	EasyExercise: number;
}>;
