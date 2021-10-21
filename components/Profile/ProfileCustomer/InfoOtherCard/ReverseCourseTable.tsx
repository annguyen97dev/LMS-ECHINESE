import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {courseReserveApi} from '~/apiBase/customer/student/course-reserve';
import ExpandTable from '~/components/ExpandTable';
import {useWrap} from '~/context/wrap';

ReverseCourseTable.propTypes = {
	studentID: PropTypes.number,
};
ReverseCourseTable.defaultProps = {
	studentID: null,
};
function ReverseCourseTable(props) {
	const {studentID} = props;
	const [isLoading, setIsLoading] = useState({
		type: 'GET_ALL',
		status: false,
	});
	const {showNoti} = useWrap();
	const [reverseCourseList, setReverseCourseList] = useState<ICourseReserve[]>(
		[]
	);
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

	const fetchReverseCourseList = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true,
			});
			const res = await courseReserveApi.getAll(filters);
			if (res.status === 200) {
				setReverseCourseList(res.data.data);
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
		fetchReverseCourseList();
	}, [filters]);

	const columns = [
		{title: 'Lớp bảo lưu', dataIndex: 'ProgramName'},
		{
			title: 'Ngày bảo lưu',
			dataIndex: 'ReserveDate',
			render: (date) => (
				<p className="font-weight-black">{moment(date).format('DD/MM/YYYY')}</p>
			),
		},
		{
			title: 'Hạn bảo lưu',
			dataIndex: 'ExpirationDate',
			render: (date) => (
				<p className="font-weight-black">{moment(date).format('DD/MM/YYYY')}</p>
			),
		},
		{title: 'Trạng thái', dataIndex: 'StatusName'},
	];

	const expandedRowRender = (item: ICourseReserve) => {
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
			currentPage={filters.pageIndex}
			totalPage={totalPage}
			getPagination={getPagination}
			noScroll
			dataSource={reverseCourseList}
			columns={columns}
			Extra={<h5>Bảo lưu</h5>}
			expandable={{expandedRowRender}}
		/>
	);
}

export default ReverseCourseTable;
