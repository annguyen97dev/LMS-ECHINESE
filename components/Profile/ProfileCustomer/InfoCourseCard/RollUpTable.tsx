import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {rollUpApi} from '~/apiBase';
import ExpandTable from '~/components/ExpandTable';
import {useWrap} from '~/context/wrap';

RollUpTable.propTypes = {
	courseID: PropTypes.number,
	studentID: PropTypes.number,
};
RollUpTable.defaultProps = {
	courseID: 0,
	studentID: 0,
};

function RollUpTable(props) {
	const {courseID, studentID} = props;
	const [isLoading, setIsLoading] = useState({
		type: 'GET_ALL',
		status: false,
	});
	const [rollUpList, setRollUpList] = useState<IRollUp[]>([]);
	const {showNoti} = useWrap();
	const [totalPage, setTotalPage] = useState(null);
	// FILTER
	const [filters, setFilters] = useState({
		pageSize: 10,
		pageIndex: 1,
		CourseID: courseID,
		StudentID: studentID,
		CourseScheduleID: 0,
	});
	const getPagination = (pageNumber: number) => {
		setFilters({
			...filters,
			pageIndex: pageNumber,
		});
	};
	const getRollUp = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true,
			});
			const res = await rollUpApi.getAll(filters);
			if (res.status === 200) {
				setRollUpList(res.data.data);
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
		getRollUp();
	}, [filters]);
	const columns = [
		{
			title: 'Ngày',
			dataIndex: 'Date',
			render: (dateString) => {
				const date = moment(dateString.slice(0, 11)).format('DD/MM/YYYY');
				return date;
			},
		},
		{
			title: 'Ca',
			dataIndex: 'Date',
			render: (dateString) => {
				return dateString.slice(11);
			},
		},
		{title: 'Môn học', dataIndex: 'SubjectName'},
		{
			title: 'Học lực',
			dataIndex: 'LearningStatusName',
		},
		{
			title: 'Điểm danh',
			dataIndex: 'StatusName',
		},
		{
			title: 'Cảnh báo',
			dataIndex: 'Warning',
			align: 'center',
			render: (Warning, record: IRollUp) => {
				let tag = Warning ? 'tag yellow' : '';
				return (
					<span className={tag} key={record.ID}>
						{Warning ? 'Warning' : ''}
					</span>
				);
			},
		},
	];
	const expandedRowRender = (exam: IRollUp) => {
		return (
			<p>
				<span className="font-weight-black">Ghi chú: </span>
				{exam.Note}
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
			dataSource={rollUpList}
			columns={columns}
			Extra={<h5>Điểm danh</h5>}
			expandable={{expandedRowRender}}
		/>
	);
}

export default RollUpTable;
