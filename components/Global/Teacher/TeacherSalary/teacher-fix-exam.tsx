import React, { useState, useEffect } from 'react';
import { Tooltip, Modal, Form, Spin, Input, Select } from 'antd';
import { RotateCcw } from 'react-feather';
import { numberWithCommas } from '~/utils/functions';
import { useWrap } from '~/context/wrap';
import PowerTable from '~/components/PowerTable';
import { teacherSalaryApi } from '~/apiBase/staff-manage/teacher-salary';
import  moment  from 'moment';

const TeacherFixExam = ({ price, record }) => {
	const [visible, setVisible] = useState(false);
	const [dataSource, setDataSource] = useState<ITeacherSalaryFixExam[]>([]);
	const { showNoti, pageSize } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		loading: false
	});
	const defaultParams = {
		pageIndex: 1,
		pageSize: pageSize,
		sortType: true,
		selectAll: true,
		SalaryOfTeacherID: record.ID
	};
	const [params, setParams] = useState(defaultParams);

	const columns = [
		{
			title: 'Giáo viên',
			width: 150,
			dataIndex: 'TeacherName',
			render: (price, record) => <p className="font-weight-primary">{price}</p>
		},
		{
			title: 'Môn học',
			width: 100,
			dataIndex: 'SetPackageName',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Buổi học',
			width: 100,
			dataIndex: 'ExamTopicName',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Tên học viên',
			width: 150,
			dataIndex: 'StudentName',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Thời gian chấm bài',
			width: 150,
			dataIndex: 'CreateOn',
			render: (price, record) => <p>{moment(price).format('DD-MM-YYYY')}</p>
		}
	];

	const getDataSource = async () => {
		setIsLoading({ type: 'GET_DATA', loading: true });
		try {
			let res = await teacherSalaryApi.getFixExam(params);
			console.log(res.data.data);
			setDataSource(res.data.data);
		} catch (error) {
			// showNoti('danger', 'Không có dữ liệu!');
		} finally {
			setIsLoading({ type: 'GET_DETAIL', loading: false });
		}
	};

	useEffect(() => {
		getDataSource();
	}, []);

	return (
		<>
			<button
				className="font-weight-primary btn btn-icon edit"
				onClick={() => {
					setVisible(true);
				}}
			>
				<Tooltip title="Xem chi tiết">{numberWithCommas(price)}</Tooltip>
			</button>

			<Modal width={800} title="Chi tiết lương chấm bài" visible={visible} onCancel={() => setVisible(false)} footer={false}>
				<PowerTable columns={columns} dataSource={dataSource}></PowerTable>
			</Modal>
		</>
	);
};

export default TeacherFixExam;
