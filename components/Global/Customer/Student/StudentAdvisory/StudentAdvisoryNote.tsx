import React from 'react';
import NestedTable from '~/components/Elements/NestedTable';
import moment from 'moment';

const StudentAdvisoryNote = (props) => {
	const { dataSource } = props;

	const columns = [
		{
			title: 'Ghi chú',
			dataIndex: 'Note'
		},
		{
			title: 'Tạo ngày',
			dataIndex: 'CreatedOn',
			render: (date) => <p>{moment(date).format('DD/MM/YYYY')}</p>
		},
		{
			title: 'Người tạo',
			dataIndex: 'CreatedBy'
		}
	];

	return (
		<div>
			<h6 className="mt-3" style={{ fontWeight: 500 }}>
				Ghi chú:
			</h6>
			<div className="row">
				<div className="col-md-7">
					<NestedTable addClass="basic-header" dataSource={dataSource} columns={columns} haveBorder={true} />;
				</div>
			</div>
		</div>
	);
};

export default StudentAdvisoryNote;
