import { Card, Spin, Timeline } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { timelineApi } from '~/apiBase/course-detail/timeline';
import { useWrap } from '~/context/wrap';
import TimelineCourseForm from './TimelineCourseForm';
moment.locale('vn');

TimelineCourse.propTypes = {
	courseID: PropTypes.number
};
TimelineCourse.defaultProps = {
	courseID: 0
};
function TimelineCourse(props) {
	const { courseID } = props;
	const [timelineList, setTimelineList] = useState<ITimeLine[]>([]);
	const [isLoading, setIsLoading] = useState({ type: 'GET_ALL', status: false });
	const { showNoti } = useWrap();

	const getDataTimeline = async () => {
		try {
			setIsLoading({
				type: 'FETCH_TIMELINE',
				status: true
			});
			const res = await timelineApi.getByCourseID(courseID);
			if (res.status === 200) {
				setTimelineList(res.data.data);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_TIMELINE',
				status: false
			});
		}
	};

	useEffect(() => {
		getDataTimeline();
	}, []);

	const onSubmit = async (data: { Note: string }) => {
		try {
			setIsLoading({
				type: 'ADD_TIMELINE',
				status: true
			});
			const newData = {
				...data,
				CourseID: courseID
			};
			const res = await timelineApi.add(newData);
			if (res.status === 200) {
				const newTimeLineList = [res.data.data, ...timelineList];
				setTimelineList(newTimeLineList);
				showNoti('success', res.data.message);
				return true;
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_TIMELINE',
				status: false
			});
		}
	};

	return (
		<div>
			<Card title="Phản hồi buổi học" extra={<TimelineCourseForm isLoading={isLoading} handleSubmit={onSubmit} />}>
				<div>
					<Spin spinning={isLoading.type === 'FETCH_TIMELINE' && isLoading.status} size="large">
						<Timeline mode="right">
							{timelineList.map((x) => (
								<Timeline.Item
									key={x.ID}
									label={
										<>
											<div>
												<p className="font-weight-black">{moment(x.CreatedOn).format('DD/MM/YYYY')}</p>
											</div>
											<div>{moment(x.CreatedOn).format('LT')}</div>
										</>
									}
								>
									<div>
										<p className="font-weight-primary">{x.Note}</p>
									</div>
									{/* @ts-ignore */}
									<div style={{color: 'blue'}}>{x.NoteStudent}</div>
									<div>{x.CreatedBy}</div>
									<div>{x.RoleName}</div>
								</Timeline.Item>
							))}
						</Timeline>
					</Spin>
				</div>
			</Card>
		</div>
	);
}

export default TimelineCourse;
