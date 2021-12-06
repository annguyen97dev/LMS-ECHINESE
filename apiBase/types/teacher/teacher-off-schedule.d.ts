type ITeacherOff = IBaseApi<{
	Day: string;
	Info: [
		{
			StudyTimeID: number;
			StudyTimeName: string;
			IsHideCheckBox: boolean;
			Checked: boolean;
		}
	];
}>;
