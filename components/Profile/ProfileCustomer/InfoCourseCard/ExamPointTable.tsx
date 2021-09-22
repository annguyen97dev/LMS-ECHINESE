import React from 'react';
import PropTypes from 'prop-types';
import PowerTable from '~/components/PowerTable';
import {dataService} from '~/lib/customer/dataCustomer';

ExamPointTable.propTypes = {
	courseID: PropTypes.number,
	studentID: PropTypes.number,
};
ExamPointTable.defaultProps = {
	courseID: 0,
	studentID: 0,
};
function ExamPointTable(props) {
	const columns3 = [
		{
			title: 'Exam',
			dataIndex: 'pkgName',
		},

		{
			title: 'Listening',
			dataIndex: 'listening',
			render: (listening) => {
				return <span className="tag blue">{listening}</span>;
			},
		},
		{
			title: 'Reading',
			dataIndex: 'reading',
			render: (reading) => {
				return <span className="tag blue">{reading}</span>;
			},
		},
		{
			title: 'Writing',
			dataIndex: 'writing',
			render: (writing) => {
				return <span className="tag blue">{writing}</span>;
			},
		},
		{
			title: 'Speaking',
			dataIndex: 'speaking',
			render: (speaking) => {
				return <span className="tag blue">{speaking}</span>;
			},
		},
		{
			title: 'Ghi chú',
		},
	];
	return (
		<PowerTable
			noScroll
			dataSource={dataService}
			columns={columns3}
			Extra={<h5>Điểm thi</h5>}
		/>
	);
}

export default ExamPointTable;
