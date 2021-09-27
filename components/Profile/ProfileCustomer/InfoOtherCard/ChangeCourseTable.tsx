import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {studentChangeCourseApi} from '~/apiBase';
import ExpandTable from '~/components/ExpandTable';
import {useWrap} from '~/context/wrap';
ChangeCourseTable.propTypes = {
	studentID: PropTypes.number,
};
ChangeCourseTable.defaultProps = {
	studentID: null,
};

function ChangeCourseTable(props) {
	const {studentID} = props;
	const [isLoading, setIsLoading] = useState({
		type: 'GET_ALL',
		status: false,
	});
	const {showNoti} = useWrap();
	const [changeCourseList, setChangeCourseList] = useState<
		IStudentChangeCourse[]
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

	const fetchChangeCourseList = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true,
			});
			const res = await studentChangeCourseApi.getAll(filters);
			if (res.status === 200) {
				setChangeCourseList(res.data.data);
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
		fetchChangeCourseList();
	}, [filters]);

	const columns = [
		{
			title: 'Ngày chuyển',
			dataIndex: 'CreatedOn',
			render: (date) => (
				<p className="font-weight-black">{moment(date).format('DD/MM/YYYY')}</p>
			),
		},
		{title: 'Khóa trước', dataIndex: 'CourseNameBefore'},
		{title: 'Khóa chuyển đến', dataIndex: 'CourseNameAfter'},
		{title: 'Người chuyển', dataIndex: 'CreatedBy'},
	];
	const expandedRowRender = (item: IStudentChangeCourse) => {
		return (
			<table className="tb-expand">
				<thead>
					<tr>
						<th>Cam kết</th>
						<th>Ghi chú</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{item.Commitment}</td>
						<td>{item.Note}</td>
					</tr>
				</tbody>
			</table>
		);
	};
	return (
		<ExpandTable
			currentPage={filters.pageIndex}
			totalPage={totalPage}
			getPagination={getPagination}
			loading={isLoading}
			columns={columns}
			dataSource={changeCourseList}
			noScroll
			Extra={<h5>Chuyển khóa</h5>}
			expandable={{expandedRowRender}}
		/>
	);
}

export default ChangeCourseTable;
