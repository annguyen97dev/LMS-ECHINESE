import React, { useState } from 'react';
import NestedTable from '~/components/Elements/NestedTable';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Tooltip, Input } from 'antd';

const { TextArea } = Input;

const StudentAdvisoryNote = (props) => {
	const { dataSource } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [valueNote, setValueNote] = useState(null);

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

	const addNote = () => {};

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	return (
		<div>
			<Modal title="Thêm ghi chú" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
				<TextArea onChange={(e) => setValueNote(e.target.value)} />
			</Modal>
			<Tooltip title="Thêm ghi chú">
				<button className="btn btn-icon add" onClick={showModal}>
					<PlusOutlined />
				</button>
			</Tooltip>
			<div className="row">
				<div className="col-md-7">
					<NestedTable addClass="basic-header" dataSource={dataSource} columns={columns} haveBorder={true} />
				</div>
			</div>
		</div>
	);
};

export default StudentAdvisoryNote;
