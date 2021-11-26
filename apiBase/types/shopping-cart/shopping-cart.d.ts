type IShoppingCart = IBaseApi<{
	ID: number;
	VideoCourseID: number;
	VideoCourseName: string;
	ImageThumbnails: string;
	Price: number;
	Quantity: number;
}>;
