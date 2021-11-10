type IDocumentList = IBaseApi<{
	ID: number;
	CategoryID: number;
	DocumentLink: string;
	DocumentName: string;
	Enable: boolean;
	CreatedOn: string;
	CreatedBy: string;
	ModifiedOn: string;
	ModifiedBy: string;
}>;
