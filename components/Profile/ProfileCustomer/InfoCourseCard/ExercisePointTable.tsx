import {Tag} from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import {Info} from 'react-feather';
import ExpandTable from '~/components/ExpandTable';
import {dataService} from '~/lib/customer/dataCustomer';

ExercisePointTable.propTypes = {
	courseID: PropTypes.number,
	studentID: PropTypes.number,
};
ExercisePointTable.defaultProps = {
	courseID: 0,
	studentID: 0,
};
function ExercisePointTable(props) {
	const columns2 = [
		{title: 'Nhóm bài', dataIndex: 'pfSubject'},
		{title: 'Ngày tạo', dataIndex: 'testDate'},
		{
			title: 'Trạng thái',
			dataIndex: 'pfRollCall',
			render: (pfRollCall) => {
				let tag = pfRollCall == 'Có' ? 'tag green' : 'tag black';

				return (
					<Tag className={tag} key={pfRollCall}>
						{pfRollCall}
					</Tag>
				);
			},
		},
		{
			title: 'Điểm',
			dataIndex: 'listening',

			render: (listening) => {
				return <span className="tag blue">{listening}</span>;
			},
		},
		{
			dataIndex: '',
			render: () => (
				<>
					<button className="btn btn-icon">
						<Info />
					</button>
				</>
			),
		},
	];

	const expandedRowRender = () => {
		return (
			<>
				Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic magni,
				obcaecati optio, autem sapiente itaque eligendi deleniti dolor cumque
				suscipit iste incidunt quasi eveniet a laborum! Amet exercitationem nisi
				aspernatur.
			</>
		);
	};

	return (
		<ExpandTable
			noScroll
			Extra={<h5>Bài tập</h5>}
			expandable={{expandedRowRender}}
			dataSource={dataService}
			columns={columns2}
		/>
	);
}

export default ExercisePointTable;
