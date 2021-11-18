type ILessonDetail = IBaseApi<{
	ID: number;
	Content: string;
	CurriculumDetailID: number;
	LessonDetailNumber: number;
	LinkVideo: string;
	MinuteVideo: number;
	LinkDocument: string;
	LinkHtml: string;
	Description: string;
	ExamTopicID: numner;
	Enable: true;
}>;
