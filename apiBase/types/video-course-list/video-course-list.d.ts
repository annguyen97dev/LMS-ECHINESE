import { data } from '~/lib/customer-student/data';
type IVideoCourseList = IBaseApi<{
	ID: number;
	VideoCourseID: number;
	VideoCourseName: string;
	UserInformationID: number;
	StudentName: string;
	ImageThumbnails: string;
	Status: number;
	StatusName: number;
	RatingNumber: number;
	RatingComment: string;
	data: { data: object };
	OriginalPrice: number;
	SellPrice: number;
	Quantity: number;
}>;
