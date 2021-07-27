type ICheckSchedule = IBaseApi<{
	data: object[{
		id: number;
		name: string;
		select: boolean;
	}];
}>;
