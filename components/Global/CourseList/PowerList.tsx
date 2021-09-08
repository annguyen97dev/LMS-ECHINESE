import {List, Avatar, Tag, Divider} from 'antd';
import ModalUpdate from './CourseListUpdate';
import Link from 'next/link';
import {cloneElement, useState} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import CourseListUpdate from './CourseListUpdate';
import {numberWithCommas} from '~/utils/functions';
const PowerList = (props) => {
	const {dataSource, isLoading, totalPage, getPagination, children} = props;
	const checkGetPagination = (page) => {
		if (!getPagination) return;
		getPagination(page);
	};
	const checkStatus = (vl, ctn) => {
		const rs = ['yellow', 'green', 'gray'];
		return <span className={`tag ${rs[vl]}`}>{ctn}</span>;
	};
	return (
		<List
			loading={isLoading?.type === 'GET_ALL' && isLoading?.status}
			pagination={{
				onChange: checkGetPagination,
				total: totalPage,
				size: 'small',
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
				BranchID,
			}: ICourse) => (
				<List.Item
					extra={cloneElement(children, {
						courseObj: {ID, BranchID, AcademicUID, TeacherLeaderUID},
					})}
				>
					<List.Item.Meta
						avatar={checkStatus(Status, StatusName)}
						title={
							<Link
								href={{
									pathname: '/course/course-list/course-list-detail/[slug]',
									query: {slug: ID},
								}}
							>
								<a>{CourseName}</a>
							</Link>
						}
						description={
							<div className="content-body">
								<ul className="list-ver">
									<li>
										<span>Academic: </span>{' '}
										<span>{AcademicName || 'Trống'}</span>
									</li>
									<li>
										<span>Leader: </span>{' '}
										<span>{TeacherLeaderName || 'Trống'}</span>
									</li>
									<li>
										<span>Teachers: </span> <span>{TeacherName}</span>
									</li>
									<li>
										<span>Price: </span>{' '}
										<span>{numberWithCommas(Price)} VNĐ</span>
									</li>
								</ul>
								<ul className="list-hor">
									<li>
										Number of school days: <span>{TotalDays}</span>
									</li>
									<li>
										Opening:{' '}
										<span>{moment(StartDay).format('DD/MM/YYYY')}</span>
									</li>
									<li>
										End: <span>{moment(EndDay).format('DD/MM/YYYY')}</span>
									</li>
									<li>
										Student: <span>{TotalStudents}</span>
									</li>
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
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	children: PropTypes.element,
	//
	getPagination: PropTypes.func,
};
PowerList.defaultProps = {
	totalPage: 1,
	isLoading: {type: '', status: false},
	getPagination: null,
};

export default PowerList;
