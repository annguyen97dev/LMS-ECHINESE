import {Card, Spin, Timeline} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {Clock} from 'react-feather';
import {timelineStudentApi} from '~/apiBase/customer/student/history-change';
import {useWrap} from '~/context/wrap';

InfoTimelineCard.propTypes = {
	studentID: PropTypes.number,
};
InfoTimelineCard.defaultProps = {
	studentID: 0,
};
function InfoTimelineCard(props) {
	const {studentID} = props;
	const [timelineList, setTimelineList] = useState<ITimelineStudent[]>([]);
	const [isLoading, setIsLoading] = useState({type: 'GET_ALL', status: false});
	const {showNoti} = useWrap();

	const getDataTimeline = async () => {
		try {
			setIsLoading({
				type: 'FETCH_TIMELINE',
				status: true,
			});
			const res = await timelineStudentApi.getAll({
				pageSize: 8,
				UserInformationID: studentID,
			});
			if (res.status === 200) {
				setTimelineList(res.data.data);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_TIMELINE',
				status: false,
			});
		}
	};

	useEffect(() => {
		getDataTimeline();
	}, []);

	return (
		<>
			{timelineList.length ? (
				<Card>
					<Spin
						spinning={isLoading.type === 'FETCH_TIMELINE' && isLoading.status}
						size="large"
					>
						<Timeline mode="left">
							{timelineList.map((t) => (
								<Timeline.Item
									key={t.ID}
									label={
										<>
											<div>
												<p className="font-weight-black">
													{moment(t.CreatedOn).format('DD/MM/YYYY')}
												</p>
											</div>
											<div>{moment(t.CreatedOn).format('LT')}</div>
										</>
									}
									dot={<Clock style={{fontSize: '16px'}} size={18} />}
								>
									<div>
										<p className="font-weight-black">
											Thay đổi:{' '}
											{t.Content.slice(
												0,
												t.Content.indexOf(':')
											).toLocaleLowerCase()}
										</p>
									</div>
									<div>{t.Content.slice(t.Content.indexOf(':') + 1)}</div>
								</Timeline.Item>
							))}
						</Timeline>
					</Spin>
				</Card>
			) : null}
		</>
	);
}
export default InfoTimelineCard;
