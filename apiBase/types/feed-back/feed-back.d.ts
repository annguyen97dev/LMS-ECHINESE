import { data } from '~/lib/customer-student/data';
type IFeedBack = IBaseApi<{
	ID: number;
	UID: number;
	FullNameUnicode: string;
	TypeID: number;
	TypeName: string;
	Title: string;
	ContentFeedBack: string;
	StatusID: number;
	StatusName: string;
	isPrioritized: boolean;
	Rate: number;
	RateBy: string;
	FullName: string;
}>;
