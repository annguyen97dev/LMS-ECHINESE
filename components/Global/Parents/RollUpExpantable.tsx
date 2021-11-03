import React, { useState, useEffect } from 'react';
import { rollUpStudentApi } from '~/apiBase/customer/parents/roll-up-student';
import NestedTable from '~/components/Elements/NestedTable';
import PowerTable from '~/components/PowerTable';
import { useWrap } from '~/context/wrap';

const RollUpExpantable = ({ studentID, courseID }) => {
	const [dataSource, setDataSource] = useState<IRollUpStudent[]>();
	const { pageSize, showNoti } = useWrap();
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState({
		type: '',
		loading: false
	});
	const paramsDefault = {
		pageIndex: 1,
		pageSize: pageSize,
		StudentID: 1339,
		CourseID: 19,
		// StudentID: studentID.ID,
		// CourseID: courseID,
		CourseScheduleID: 0
	};
	const [params, setParams] = useState(paramsDefault);

	const columns = [
		{
			title: 'Môn học',
			dataIndex: 'SubjectName',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Thời gian học',
			dataIndex: 'Date',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Ghi chú',
			dataIndex: 'Note',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Trạng thái',
			dataIndex: 'StatusName',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Đang học',
			dataIndex: 'LearningStatusName',
			render: (price, record) => <p>{price}</p>
		}
	];

	const getRollUpStudent = async () => {
		setLoading({ type: 'GET_ALL', loading: true });
		try {
			let res = await rollUpStudentApi.getAll(params);
			if (res.status == 200) {
				setDataSource(res.data.data);
			}
			if (res.status == 204) {
				setDataSource([]);
			}
		} catch (error) {
		} finally {
			setLoading({ type: 'GET_ALL', loading: false });
		}
	};

	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setParams({
			...params,
			pageIndex: currentPage
		});
	};

	useEffect(() => {
		getRollUpStudent();
	}, []);

	return (
		<>
			<NestedTable
				currentPage={currentPage}
				// totalPage={totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				dataSource={dataSource}
				columns={columns}
				loading={loading}
			/>
		</>
	);
};

export default RollUpExpantable;
