import { data } from '~/lib/customer-student/data';
export type IVideoCourseDetailsContent<T = any> = IBaseApi<{
	TotalSections: number;
	TotalLessons: number;
	TotalSecondVideos: number;
	SectionModels: T;
}>;

export type IDetailsContentItem = IBaseApi<{
	ID: number;
	SectionName: string;
	TotalLesson: number;
	TotalSecondVideo: number;
}>;
