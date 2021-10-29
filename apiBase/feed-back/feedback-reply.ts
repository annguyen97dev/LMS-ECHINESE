import { instance } from '../instance';
import { IFeedBackReply } from '../types/feed-back-reply/feed-back-reply';

const url = '/api/FeedbackReply';
export const FeedbackReplyApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IFeedBackReply[]>>(url, {
			params
		});
	},

	getByFeedbackID(ID) {
		return instance.get<IApiResultData<IFeedBackReply[]>>(`${url}?FeedbackID=${ID}`);
	},

	getByID(ID) {
		return instance.get<IApiResultData<IFeedBackReply>>(`${url}/${ID}`);
	},

	add(data) {
		return instance.post(url + `?FeedbackID=${data.FeedbackID}&Content=${data.Content}`);
	},

	update(data) {
		return instance.put(url, data);
	}
};
