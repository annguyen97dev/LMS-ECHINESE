import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { rollUpTeacher } from '~/apiBase/course-detail/roll-up';
import PowerTable from '~/components/PowerTable';
import { useWrap } from '~/context/wrap';
import { Switch } from 'antd';

export default function TeacherRollUp(props) {
	const { courseID } = props;
	const { userInformation, isAdmin, showNoti, pageSize } = useWrap();
	const [isLoading, setIsLoading] = useState({ type: '', status: false });
	const [totalPage, setTotalPage] = useState(null);
	const [dataSource, setDataSource] = useState([]);

	// FILTER
	const [filters, setFilters] = useState({
		pageSize: pageSize,
		pageIndex: 1,
		CourseID: courseID
	});

	const getPagination = (pageNumber: number) => {
		setFilters({
			...filters,
			pageIndex: pageNumber
		});
	};

	const columns =
		userInformation && userInformation.RoleID === 1
			? [
					{
						title: 'Giáo viên',
						dataIndex: 'TeacherName',
						render: (text) => <p className="font-weight-primary">{text}</p>
					},
					{
						title: 'Ngày',
						dataIndex: 'Date',
						render: (text, data) => <p>{moment(data.Date).format('DD-MM-YYYY')}</p>
					},
					{
						title: 'Thời gian học',
						dataIndex: 'StudyTimeName',
						render: (text) => <p>{text}</p>
					},
					{
						title: '',
						dataIndex: 'Active',
						render: (text, data) => (
							<Switch
								checked={data.isRollUp}
								checkedChildren="Đã điểm danh"
								unCheckedChildren="Chưa điểm danh"
								onChange={() => onChangeEnable(data)}
							/>
						)
					}
			  ]
			: [
					{
						title: 'Giáo viên',
						dataIndex: 'TeacherName',
						render: (text) => <p className="font-weight-primary">{text}</p>
					},
					{
						title: 'Ngày',
						dataIndex: 'Date',
						render: (text, data) => <p>{moment(data.Date).format('DD-MM-YYYY')}</p>
					},
					{
						title: 'Thời gian học',
						dataIndex: 'StudyTimeName',
						render: (text) => <p>{text}</p>
					},
					{
						title: 'Trạng thái',
						dataIndex: 'RollUp',
						render: (text, data) => <p className={data.isRollUp ? 'tag green' : 'tag red'}>{text}</p>
					}
			  ];

	const getDataSource = async () => {
		setIsLoading({ type: 'GET_ALL', status: true });
		try {
			let res = await rollUpTeacher.getAllTeacher(filters);
			if (res.status === 200) {
				console.log(res.data.data);
				setDataSource(res.data.data);
				setTotalPage(res.data.totalRow);
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false });
		}
	};

	const getDataSourceNoReload = async () => {
		try {
			let res = await rollUpTeacher.getAllTeacher(filters);
			if (res.status === 200) {
				console.log(res.data.data);
				setDataSource(res.data.data);
				setTotalPage(res.data.totalRow);
			}
		} catch (error) {}
	};

	const onChangeEnable = async (data) => {
		try {
			let res = await rollUpTeacher.updateRollUp({
				ID: data.ID,
				isRollUp: data.isRollUp ? false : true
			});
			if (res.status === 200) {
				!data.isRollUp && showNoti('success', 'Điểm danh thành công!');
				data.isRollUp && showNoti('success', 'Hủy điểm danh thành công!');
				getDataSourceNoReload();
			}
		} catch (error) {
		} finally {
		}
	};

	useEffect(() => {
		getDataSource();
	}, [filters]);

	return (
		<PowerTable
			loading={isLoading}
			currentPage={filters.pageIndex}
			totalPage={totalPage}
			getPagination={getPagination}
			dataSource={dataSource}
			columns={columns}
			TitleCard={<div className="d-flex align-items-center"></div>}
		/>
	);
}
