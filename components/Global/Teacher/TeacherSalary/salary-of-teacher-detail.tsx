import React, { useState, useEffect } from 'react';
import { Tooltip, Modal, Form, Spin, Input, Select } from 'antd';
import { RotateCcw } from 'react-feather';
import { numberWithCommas } from '~/utils/functions';
import { useWrap } from '~/context/wrap';
import { teacherSalaryApi } from '~/apiBase/staff-manage/teacher-salary';
import PowerTable from '~/components/PowerTable';

const SalaryOfTeacherDetail = ({ price, record }) => {
	const [visible, setVisible] = useState(false);
	const [dataSource, setDataSource] = useState<ITeacherSalaryDetail[]>([]);
	const { showNoti, pageSize } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		loading: false
	});
	const defaultParams = {
		pageIndex: 1,
		pageSize: pageSize,
		sortType: true,
		SalaryOfTeacherID: record.ID
	};
	const [params, setParams] = useState(defaultParams);

	const getNum = (num) => {
		return num < 10 ? '0' + num : num;
	};

	const getStrDate = (date) => {
		const nDate = new Date(date);
		return getNum(nDate.getDate()) + '-' + getNum(nDate.getMonth() + 1) + '-' + nDate.getFullYear();
	};

	const columns = [
		{
			title: 'Giáo viên',
			dataIndex: 'TeacherName',
			render: (price, record) => <p className="font-weight-primary">{price}</p>
		},
		{
			title: 'Môn học',
			dataIndex: 'CourseName',
			render: (price, record) => <p className="font-weight-primary">{price}</p>
		},
		{
			title: 'Buổi học',
			dataIndex: 'LessonNumber',
			align: 'center',
			render: (price, record) => <p style={{ width: 70 }}>{price}</p>
		},
		{
			title: 'Ngày dạy',
			dataIndex: 'Date',
			align: 'center',
			render: (price, record) => <p style={{ width: 100 }}>{getStrDate(price)}</p>
		},
		{
			title: 'Thời gian học',
			dataIndex: 'StudyTimeName',
			render: (price, record) => <p style={{ width: 100 }}>{price}</p>
		},
		{
			title: 'Lương môn học',
			dataIndex: 'SalaryOfLesson',
			render: (price, record) => <p style={{ width: 120 }}>{numberWithCommas(price)}</p>
		}
	];

	const getDataSource = async () => {
		setIsLoading({ type: 'GET_DETAIL', loading: true });
		try {
			let res = await teacherSalaryApi.getDetail(params);
			console.log(res.data.data);
			if (res.status == 200) {
				setDataSource(res.data.data);
			}
			if (res.status == 204) {
				// showNoti('danger', 'Không có dữ liệu!');
				setDataSource([]);
			}
		} catch (error) {
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

			<Modal width={800} title="Chi tiết lương giáo viên" visible={visible} onCancel={() => setVisible(false)} footer={false}>
				<PowerTable columns={columns} dataSource={dataSource}></PowerTable>
			</Modal>
		</>
	);
};

export default SalaryOfTeacherDetail;
