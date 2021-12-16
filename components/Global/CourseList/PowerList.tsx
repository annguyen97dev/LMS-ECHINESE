import { List } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { cloneElement } from 'react';
import { useWrap } from '~/context/wrap';
import { numberWithCommas } from '~/utils/functions';

const PowerList = (props) => {
	const { dataSource, isLoading, totalPage, currentPage, getPagination, children } = props;
	const { userInformation } = useWrap();
	const checkGetPagination = (page) => {
		if (!getPagination) return;
		getPagination(page);
	};
	const checkStatus = (vl, ctn) => {
		const rs = ['yellow', 'green', 'gray'];
		return <span className={`tag ${rs[vl]}`}>{ctn}</span>;
	};

	const returnPathName = (ID, TypeCourse) => {
		if (!userInformation) return '';
		let role = userInformation.RoleID;
		let path = null;

		if (role == 1 || role == 5) {
			path = {
				pathname: '/course/course-list/course-list-detail/[slug]',
				query: { slug: ID, type: TypeCourse }
			};
		} else {
			path = {
				// pathname: '/customer/student/lesson-detail',
				pathname: '/course/course-list/course-list-detail/[slug]',
				query: { slug: ID, courseID: ID }
			};
		}

		return path;
	};

	return (
		<List
			loading={isLoading?.type === 'GET_ALL' && isLoading?.status}
			pagination={{
				onChange: checkGetPagination,
				total: totalPage,
				size: 'small',
				current: currentPage
			}}
			// 0 sắp diễn ra, 1 đang diễn ra, 2 đã đóng
			//       AcademicName: "Nguyễn Phi Hùng"
			// AcademicUID: 48
			// CourseName: "[Mona Media 1] - [Chương trình học 2] - [29/07/212021] - [Ca 13:00 - 15:00, Ca 15:00 - 17:00, Ca 17:00 - 19:00] - [P2, P1]"
			// EndDay: "2021-08-30T00:00:00"
			// ID: 7
			// Price: 20000000
			// StartDay: "2021-07-29T00:00:00"
			// Status: 0
			// StatusName: "UpComing"
			// TeacherLeaderName: ""
			// TeacherLeaderUID: 0
			// TeacherName: "Hữu Minh Teacher 10,Teacher Minh"
			// TotalDays: 12
			// TotalRow: 13
			// TotalStudents: 0
			// TypeCourse: 1
			// TypeCourseName: "Offline"
			itemLayout="horizontal"
			dataSource={dataSource}
			renderItem={({
				ID,
				Status,
				StatusName,
				CourseName,
				AcademicName,
				AcademicUID,
				TeacherLeaderName,
				TeacherLeaderUID,
				TeacherName,
				Price,
				TotalDays,
				StartDay,
				EndDay,
				TotalStudents,
				TypeCourse,
				TypeCourseName,
				MaximumStudent,
				BranchID
			}: ICourse) => (
				<List.Item
					extra={cloneElement(children, {
						courseObj: { ID, BranchID, AcademicUID, TeacherLeaderUID }
					})}
				>
					<List.Item.Meta
						avatar={checkStatus(Status, StatusName)}
						title={
							<Link href={returnPathName(ID, TypeCourse)}>
								<a>{CourseName}</a>
							</Link>
						}
						description={
							<div className="content-body">
								<ul className="list-ver">
									<li>
										<span>Học vụ: </span> <span>{AcademicName || 'Trống'}</span>
									</li>
									<li>
										<span>Quản lý: </span> <span>{TeacherLeaderName || 'Trống'}</span>
									</li>
									<li>
										<span>Giáo viên: </span> <span>{TeacherName}</span>
									</li>
									<li>
										<span>Hình thức: </span> <span>{TypeCourseName}</span>
									</li>
									<li>
										<span>Học phí: </span> <span>{numberWithCommas(Price)} VNĐ</span>
									</li>
								</ul>
								<ul className="list-hor">
									<li>
										Số buổi học: <span>{TotalDays}</span>
									</li>
									<li>
										Khai giảng: <span>{moment(StartDay).format('DD/MM/YYYY')}</span>
									</li>
									<li>
										Bế giảng: <span>{moment(EndDay).format('DD/MM/YYYY')}</span>
									</li>
									<li>
										Số học viên: <span>{TotalStudents}</span>
									</li>
									{MaximumStudent && (
										<li>
											Số học viên tối đa: <span>{MaximumStudent}</span>
										</li>
									)}
								</ul>
							</div>
						}
					/>
				</List.Item>
			)}
		/>
	);
};

PowerList.propTypes = {
	dataSource: PropTypes.array.isRequired,
	totalPage: PropTypes.number,
	currentPage: PropTypes.number,
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	children: PropTypes.element,
	//
	getPagination: PropTypes.func
};
PowerList.defaultProps = {
	totalPage: 1,
	currentPage: 1,
	isLoading: { type: '', status: false },
	getPagination: null
};

export default PowerList;
