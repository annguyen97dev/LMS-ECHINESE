type IVideoCourseOfStudentAdmin = IBaseApi<{
	ID: number;
	VideoCourseID: number;
	VideoCourseName: string;
	UserInformationID: number;
	StudentName: string;
	Phone: string;
	ImageThumbnails: string;
	Status: number;
	StatusName: string;
	RatingNumber: number;
	RatingComment: string;
	Complete: number;
	TotalLesson: number;
	CreatedOn: string;
	CreatedBy: string;
	Email: string;
}>;
