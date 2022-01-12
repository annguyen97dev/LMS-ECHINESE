import { Card, List } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';

const ScheduleStudyList = (props) => {
	const { dataSource, isLoading } = props;
	const ListChild = (data) => {
		// SỐ CA || SỐ PHÒNG
		const getValuesFromData = Object.keys(data).sort((a, b) => +a.slice(a.lastIndexOf('-') + 1) - +b.slice(b.lastIndexOf('-') + 1));

		return (
			<List
				className="schedule-study-list-child"
				itemLayout="horizontal"
				grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 5 }}
				dataSource={getValuesFromData}
				renderItem={(item) => {
					const title = item.slice(item.indexOf('-') + 1, item.lastIndexOf('-'));
					return (
						<List.Item className="schedule-study-list-child-item">
							<Card title={title == 'undefined' ? '' : title}>
								<div className="content-body">
									{data[item]
										.sort((a, b) => +moment(a.StartTime).format('X') - +moment(b.StartTime).format('X'))
										.map((i, idx) => (
											<div key={idx}>
												{i.CourseName && (
													<p>
														Khóa học:<span> {i.CourseName}</span>
													</p>
												)}
												{i.TeacherID && (
													<p>
														GV:<span> {i.TeacherName}</span>
													</p>
												)}
												{i.SubjectName && (
													<p>
														Môn:<span> {i.SubjectName}</span>
													</p>
												)}
												{i.RoomStudyTimeNameID && (
													<p>
														Ca:<span> {i.StudyTimeName}</span>
													</p>
												)}
												{title == 'undefined' && (
													<p>
														Ca:<span> {i.StudyTimeName}</span>
													</p>
												)}
											</div>
										))}
								</div>
							</Card>
						</List.Item>
					);
				}}
			/>
		);
	};
	return (
		<List
			className="schedule-study-list"
			loading={isLoading?.type === 'GET_ALL' && isLoading?.status}
			itemLayout="vertical"
			dataSource={Object.keys(dataSource).sort((a, b) => +moment(a).format('X') - +moment(b).format('X'))} // MỖI ITEM SẼ LÀ 1 NGÀY
			renderItem={(item) => {
				const dayArr = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
				const dayOffWeek = dayArr[moment(item).day()];
				return (
					<List.Item className="schedule-study-list-item">
						<List.Item.Meta
							title={`${dayOffWeek} - Ngày ${moment(item).format('DD/MM/YYYY')}`}
							description={ListChild(dataSource[item])} // dataSource[item] = OBJECT (CHỨA SỐ CA || CHỨA SỐ PHÒNG)
						/>
					</List.Item>
				);
			}}
		/>
	);
};
ScheduleStudyList.propTypes = {
	dataSource: PropTypes.objectOf(
		PropTypes.shape({
			TeacherID: PropTypes.number,
			TeacherName: PropTypes.string,
			StudyTimeID: PropTypes.number,
			StudyTimeName: PropTypes.string,
			Date: PropTypes.string,
			StartTime: PropTypes.string,
			EndTime: PropTypes.string,
			RoomID: PropTypes.number,
			RoomName: PropTypes.number
		}).isRequired
	).isRequired,
	totalPage: PropTypes.number,
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	//
	getPagination: PropTypes.func
};
ScheduleStudyList.defaultProps = {
	totalPage: 1,
	isLoading: { type: '', status: false },
	getPagination: null
};

export default ScheduleStudyList;
