import { data } from '~/lib/customer-student/data';
type IFeedBackReply = IBaseApi<{
	ID: number;
	UID: number;
	FullName: string;
	FeedbackID: number;
	CreateDate: string;
	Content: string;
}>;
