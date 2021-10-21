type ISalerRevenue = IBaseApi<{
	ID: number;
	SaleCampaignID: number;
	SaleCampaignName: string;
	CounselorsID: number;
	CounselorsName: string;
	Revenue: number;
	InvoiceNumber: number;
	CustomersNumber: number;
}>;
