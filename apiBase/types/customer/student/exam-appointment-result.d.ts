type IExamAppointmentResult = IBaseApi<{
	ExamAppointmentID: number;
	UserInformationID: number;
	ListeningPoint: number;
	SpeakingPoint: number;
	ReadingPoint: number;
	WritingPoint: number;
	VocabPoint: number;
	MaxTuitionOfStudent: number;
	TeacherID: number;
	TeacherName: string;
	CounselorsID: number;
	CounselorsName: string;
	Note: string;
}>;
