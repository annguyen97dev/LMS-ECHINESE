import { instance } from '../instance';
import { IFeedBack } from '../types/feed-back/feed-back';

const url = '/api/Feedback';
export const FeedbackApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IFeedBack[]>>(url, {
			params
		});
	},

	add(data) {
		return instance.post(url, data);
	},

	update(data) {
		return instance.put(url, data);
	},

	getByID(ID) {
		return instance.get<IApiResultData<IFeedBack>>(`${url}/${ID}`);
	}
};
