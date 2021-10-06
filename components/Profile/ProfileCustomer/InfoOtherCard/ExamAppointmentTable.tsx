import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {testCustomerApi} from '~/apiBase';
import ExpandTable from '~/components/ExpandTable';
import {useWrap} from '~/context/wrap';

ExamAppointmentTable.propTypes = {
	studentID: PropTypes.number,
};
ExamAppointmentTable.defaultProps = {
	studentID: null,
};
function ExamAppointmentTable(props) {
	const {studentID} = props;
	const [isLoading, setIsLoading] = useState({
		type: 'GET_ALL',
		status: false,
	});
	const {showNoti} = useWrap();
	const [examAppointmentList, setExamAppointmentList] = useState<
		ITestCustomer[]
	>([]);
	const [totalPage, setTotalPage] = useState(null);
	// FILTER
	const [filters, setFilters] = useState({
		pageSize: 10,
		pageIndex: 1,
		UserInformationID: studentID,
	});
	const getPagination = (pageNumber: number) => {
		setFilters({
			...filters,
			pageIndex: pageNumber,
		});
	};

	const fetchExamAppointmentList = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true,
			});
			const res = await testCustomerApi.getAll(filters);
			if (res.status === 200) {
				setExamAppointmentList(res.data.data);
				setTotalPage(res.data.totalRow);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
			});
		}
	};

	useEffect(() => {
		fetchExamAppointmentList();
	}, [filters]);

	const columns = [
		{title: 'Trung tâm', dataIndex: 'BranchName'},
		{
			title: 'Ngày hẹn',
			dataIndex: 'AppointmentDate',
			render: (date) =>
				date ? (
					<p className="font-weight-black">
						{moment(date).format('DD/MM/YYYY')}
					</p>
				) : (
					''
				),
		},
		{
			title: 'Thời gian',
			dataIndex: 'Time',
			render: (time) => <p className="font-weight-black">{time}</p>,
		},
		{title: 'Nhân viên tư vấn', dataIndex: 'CounselorsName'},
		{
			title: 'Trạng thái',
			dataIndex: 'StatusName',
			render: (statusName) => <p className="font-weight-black">{statusName}</p>,
		},
	];

	const expandedRowRender = (item: ITestCustomer) => {
		return (
			<p>
				<span className="font-weight-black">Ghi chú: </span>
				{item.Note}
			</p>
		);
	};

	return (
		<ExpandTable
			loading={isLoading}
			totalPage={totalPage}
			currentPage={filters.pageIndex}
			getPagination={getPagination}
			noScroll
			dataSource={examAppointmentList}
			columns={columns}
			Extra={<h5>Hẹn đăng ký khóa học</h5>}
			expandable={{expandedRowRender}}
		/>
	);
}

export default ExamAppointmentTable;
