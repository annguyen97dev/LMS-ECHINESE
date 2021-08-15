type ISchedule = {
	ID: number;
	eventName: string;
	Color: string;
	Tiet: {
		CurriculumsDetailID: number;
		CurriculumsDetailName: string;
		SubjectID: number;
	};
	date: string;
	TeacherID: number;
	TeacherName: string;
	CaID: number;
	CaName: string;
	RoomID: number;
	RoomName: string;
	isValid?: boolean;
};
type ILesson = {
	schedule: ISchedule[];
	enddate: string;
};
