type ISaleSalary = IBaseApi<{
	ID: number;
	CounselorsID: number;
	CounselorsName: string;
	SaleCampaignID: number;
	SaleCampaignName: string;
	Salary: number;
	Bonus: number;
	TotalSalary: number;
	DonePaid: boolean;
	Note: string;
}>;
