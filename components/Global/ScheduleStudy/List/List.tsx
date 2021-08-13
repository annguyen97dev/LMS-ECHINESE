import {Card, List} from 'antd';
import moment from 'moment';
import Link from 'next/link';
import PropTypes from 'prop-types';
const ScheduleStudyList = (props) => {
	const {dataSource, isLoading, totalPage, getPagination, children} = props;
	const checkGetPagination = (page) => {
		if (!getPagination) return;
		getPagination(page);
	};
	const checkStatus = (vl, ctn) => {
		const rs = ['yellow', 'green', 'gray'];
		return <span className={`tag ${rs[vl]}`}>{ctn}</span>;
	};
	const ListChild = (data) => {
		// SỐ CA || SỐ PHÒNG
		const getValuesFromData = Object.keys(data).sort(
			(a, b) =>
				+a.slice(a.lastIndexOf('-') + 1) - +b.slice(b.lastIndexOf('-') + 1)
		);
		return (
			<List
				className="schedule-study-list-child"
				itemLayout="horizontal"
				grid={{gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 5}}
				dataSource={getValuesFromData}
				renderItem={(item) => {
					return (
						<List.Item className="schedule-study-list-child-item">
							<Card
								title={item.slice(item.indexOf('-') + 1, item.lastIndexOf('-'))}
							>
								<div className="content-body">
									{data[item].map((i, idx) => (
										<p key={idx}>
											{i.TeacherID && <span>GV: {i.TeacherName}</span>}
											{i.RoomID && <span>Ca: {i.StudyTimeName}</span>}
										</p>
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
			// pagination={{
			// 	onChange: checkGetPagination,
			// 	total: totalPage,
			// }}
			itemLayout="vertical"
			dataSource={Object.keys(dataSource)} // MỖI ITEM SẼ LÀ 1 NGÀY
			renderItem={(item) => {
				const dayArr = [
					'Chủ Nhật',
					'Thứ 2',
					'Thứ 3',
					'Thứ 4',
					'Thứ 5',
					'Thứ 6',
					'Thứ 7',
				];
				const dayOffWeek = dayArr[moment(item).day()];
				return (
					<List.Item className="schedule-study-list-item">
						<List.Item.Meta
							title={`${dayOffWeek} - Ngày ${moment(item).format(
								'DD/MM/YYYY'
							)}`}
							description={ListChild(dataSource[item])} // dataSource[item] = OBJECT (CHỨA SỐ CA || CHỨA SỐ PHÒNG)
						/>
					</List.Item>
				);
			}}
		/>
	);
};

ScheduleStudyList.propTypes = {
	dataSource: PropTypes.shape({}).isRequired,
	totalPage: PropTypes.number,
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	//
	getPagination: PropTypes.func,
};
ScheduleStudyList.defaultProps = {
	totalPage: 1,
	isLoading: {type: '', status: false},
	getPagination: null,
};

export default ScheduleStudyList;
