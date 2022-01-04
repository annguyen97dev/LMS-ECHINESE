import { NextApiRequest, NextApiResponse } from 'next';
import { lessonApi } from '~/apiBase';

export default (_: NextApiRequest, res: NextApiResponse) => {
	const callApi = async () => {
		try {
			const [callAuto, callMinute] = await Promise.all([lessonApi.callAuto(null), lessonApi.callAutoMinute(null)]);
			if (callAuto.status === 200 && callMinute.status === 200) {
				return res.status(200).json({ text: 'callAuto && callAutoMinute đã gọi thành công' });
			}
		} catch (error) {
			console.log(error.message);
			res.status(403).json({ text: 'callAuto && callAutoMinute không thành công' });
		}
	};
	callApi();
};
