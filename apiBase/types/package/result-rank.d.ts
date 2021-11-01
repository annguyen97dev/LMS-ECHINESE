type IRankResult = IBaseApi<{
	ID: number;
	ExamTopicID: number;
	ExamTopicName: string;
	StudentID: number;
	StudentName: string;
	Avatar: string;
	Point: number;
	Rank: number;
}>;
