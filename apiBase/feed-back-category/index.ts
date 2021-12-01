import { instance } from '../instance';
import { IFeedBack } from '../types/feed-back/feed-back';

const url = '/api/FeedbackCategorys';

export const FeedbackCategoryApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IFeedBack[]>>(url, {
			params
		});
	}
};
