import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { notificationCourseApi } from '~/apiBase/course-detail/notification-course';
import PowerTable from '~/components/PowerTable';
import { useWrap } from '~/context/wrap';
import NotificationCourseForm from './NotificationCourseForm';

NotificationCourse.propTypes = {
	courseID: PropTypes.number
};
NotificationCourse.defaultProps = {
	courseID: 0
};
function NotificationCourse(props) {
	const { courseID } = props;
	const { showNoti } = useWrap();
	const [notificationList, setNotificationList] = useState<INotificationCourse[]>();
	const [isLoading, setIsLoading] = useState({
		type: 'GET_ALL',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const listFieldInit = {
		pageSize: 10,
		pageIndex: 1,
		CourseID: courseID
	};
	const [filters, setFilters] = useState(listFieldInit);
	// PAGINATION
	const getPagination = (pageIndex: number) => {
		setFilters({
			...filters,
			pageIndex
		});
	};

	const getDataNotificationCourse = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true
			});
			const res = await notificationCourseApi.getAll(filters);
			if (res.status === 200) {
				setNotificationList(res.data.data);
				setTotalPage(res.data['TotalRow']);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	useEffect(() => {
		getDataNotificationCourse();
	}, [filters]);

	const onSubmit = async (data: { NotificationTitle: string; NotificationContent: string }) => {
		try {
			setIsLoading({
				type: 'ADD_NOTI',
				status: true
			});
			const newData = {
				...data,
				CourseID: courseID
			};
			const res = await notificationCourseApi.add(newData);
			if (res.status === 200) {
				showNoti('success', res.data.message);
				setFilters({
					...listFieldInit
				});
				return true;
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_NOTI',
				status: false
			});
		}
	};

	const columns = [
		{
			title: 'Thông báo qua email',
			dataIndex: 'NotificationTitle',
			render: (text) => <p className="font-weight-primary">{text}</p>
		},
		{
			title: 'Nội dung',
			dataIndex: 'NotificationContent'
		},
		{
			title: 'Người tạo',
			dataIndex: 'CreatedBy'
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'CreatedOn',
			render: (CreatedOn) => moment(CreatedOn).format('DD/MM/YYYY')
		}
	];

	return (
		<PowerTable
			currentPage={filters.pageIndex}
			totalPage={totalPage}
			getPagination={getPagination}
			loading={isLoading}
			addClass="basic-header"
			TitleCard={<NotificationCourseForm isLoading={isLoading} handleSubmit={onSubmit} />}
			dataSource={notificationList}
			columns={columns}
			Extra="Thông báo khóa học"
		/>
	);
}
export default NotificationCourse;
