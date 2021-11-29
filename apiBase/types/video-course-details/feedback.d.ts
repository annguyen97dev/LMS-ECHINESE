import { data } from '~/lib/customer-student/data';
export type IVideoCourseDetailsFeedback<T = any> = IBaseApi<{
	StarModel: any;
	TotalRow: number;
	VideoCourseFeedBack: T;
}>;

export type IDetailsFeedbackItem = IBaseApi<{
	ID: number;
	FullNameUnicode: string;
	Avatar: string;
	RatingComment: string;
	RatingNumber: number;
}>;
