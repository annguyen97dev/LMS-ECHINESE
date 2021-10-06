type ISaleCampaignDetail = IBaseApi<{
	ID: number;
	SaleCampaignID: number;
	SaleCampaignName: string;
	CounselorsID: number;
	CounselorsName: string;
	StudentID: number;
	StudentName: string;
	BranchID: number;
	BranchName: string;
	CourseOfStudentPriceID: number;
	Price: number;
	Course: {
		CourseID: number;
		CourseName: string;
		TypeCourse: number;
		TypeCourseName: string;
	}[];
}>;
