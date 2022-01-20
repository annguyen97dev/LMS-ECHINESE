import React, { useEffect, useState } from 'react';
import { teacherSalaryApi } from '~/apiBase/staff-manage/teacher-salary';
import NestedTable from '~/components/Elements/NestedTable';
import { useWrap } from '~/context/wrap';
import { numberWithCommas } from '~/utils/functions';
import SalaryOfTeacherDetail from '../TeacherSalary/salary-of-teacher-detail';
import TeacherFixExam from '../TeacherSalary/teacher-fix-exam';

const SalaryTeacherNested = (props) => {
	const { showNoti, pageSize } = useWrap();
	const { teacherID } = props;
	const [dataSource, setDataSource] = useState([]);
	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: 1,
		TeacherID: teacherID
	};
	const [currentPage, setCurrentPage] = useState(1);
	const [todoApi, setTodoApi] = useState(listTodoApi);
	const [totalPage, setTotalPage] = useState(null);
	const [loading, setLoading] = useState({
		type: 'GET_ALL',
		status: false
	});

	const getDataSource = async () => {
		setLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await teacherSalaryApi.getAll(todoApi);
			res.status == 200 && setDataSource(res.data.data);
			res.status == 204 && setDataSource([]);
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	// -------------- GET PAGE_NUMBER -----------------
	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setTodoApi({
			...todoApi,
			pageIndex: pageNumber
		});
	};

	const columns = [
		{
			title: 'Tháng',
			dataIndex: 'Month',
			render: (price, record: ITeacherSalary) => <p>{price}</p>
		},
		{
			title: 'Năm',
			dataIndex: 'Year',
			render: (price, record: ITeacherSalary) => <p>{price}</p>
		},
		{
			title: 'Lương cơ bản',
			dataIndex: 'BasicSalary',
			render: (price, record: ITeacherSalary) => <p>{price}</p>
		},

		{
			title: 'Thưởng',
			dataIndex: 'Bonus',
			render: (price, record: ITeacherSalary) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Ghi Chú',
			dataIndex: 'NoteBonus',
			render: (price, record: any) => <p>{price}</p>
		},
		{
			title: 'Trạng Thái',
			dataIndex: 'StatusName',
			render: (price, record: any) => (
				<>
					{record.StatusID == 1 && <span className="tag red">{price}</span>}
					{record.StatusID == 3 && <span className="tag yellow">{price}</span>}
					{record.StatusID == 4 && <span className="tag blue">{price}</span>}
					{record.StatusID == 5 && <span className="tag green">{price}</span>}
				</>
			)
		},
		{
			title: 'Trừ Tạm Ứng',
			dataIndex: 'AdvanceSalary',
			render: (price, record: ITeacherSalary) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Lương Tháng',
			dataIndex: 'Salary',
			render: (price, record: ITeacherSalary) => <SalaryOfTeacherDetail price={price} record={record} />
		},
		{
			title: 'Lương Chấm Bài',
			dataIndex: 'SalaryFixExam',
			render: (price, record: ITeacherSalary) => <TeacherFixExam price={price} record={record} />
		},
		{
			title: 'Lương Tổng',
			dataIndex: 'TotalSalary',
			render: (price, record: ITeacherSalary) => <p>{numberWithCommas(price)}</p>
		}
	];

	useEffect(() => {
		getDataSource();
	}, [todoApi]);

	return (
		<>
			<NestedTable
				loading={loading}
				addClass="basic-header"
				dataSource={dataSource}
				columns={columns}
				haveBorder={true}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
			/>
		</>
	);
};

export default SalaryTeacherNested;
