type ISaleCampaign = IBaseApi<{
	ID: number;
	Name: string;
	StartTime: string;
	EndTime: string;
	TotalDay: number;
	TotalRevenue: number;
	StatusID: number;
	StatusName: string;
	Note: string;
	SaleBonusList: {
		ID: number;
		MoneyCollected: number;
		PercentBonus: number;
		Enable: boolean;
	}[];
}>;
