import React, { useState } from 'react';
import NestedTable from '~/components/Elements/NestedTable';
import moment from 'moment';
import { FormOutlined, PlusOutlined } from '@ant-design/icons';
import { Modal, Tooltip, Input, Spin } from 'antd';
import { studentAdviseApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';

const { TextArea } = Input;

const StudentAdvisoryNote = (props) => {
	const { showNoti } = useWrap();
	const { dataSource, userID, onFetchData } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [valueNote, setValueNote] = useState(null);
	const [loading, setLoading] = useState(false);
	const [activeData, setActiveData] = useState(null);

	const columns = [
		{
			title: 'Ghi chú',
			dataIndex: 'Note'
		},
		{
			title: 'Tạo ngày',
			dataIndex: 'CreatedOn',
			render: (date) => <p>{moment(date).format('DD/MM/YYYY HH:mm')}</p>
		},
		{
			title: 'Người tạo',
			dataIndex: 'CreatedBy'
		},
		{
			render: (data) => (
				<button className="btn btn-icon edit" onClick={() => showModal(data)}>
					<FormOutlined />
				</button>
			)
		}
	];

	const addNote = async () => {
		setLoading(true);
		let res = null;
		try {
			if (activeData) {
				res = await studentAdviseApi.updateNote({
					ID: activeData.ID,
					Note: valueNote
				});
			} else {
				res = await studentAdviseApi.addNote({
					CustomerConsultationID: userID,
					Note: valueNote
				});
			}
			if (res.status == 200) {
				showNoti('success', activeData ? 'Cập nhật ghi chú thành công' : 'Thêm ghi chú thành công');
				setIsModalVisible(false);
				onFetchData && onFetchData();
				setActiveData(null);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoading(false);
		}
	};

	const showModal = (dataRow) => {
		setIsModalVisible(true);
		if (dataRow) {
			setActiveData(dataRow);
			setValueNote(dataRow.Note);
		} else {
			setActiveData(null);
		}
	};

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	return (
		<div className="mt-2">
			<Modal footer={null} title="Thêm ghi chú" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
				<TextArea value={valueNote} onChange={(e) => setValueNote(e.target.value)} />
				<div className="text-center mt-3">
					<button className="btn btn-primary w-100" onClick={addNote}>
						Lưu {loading && <Spin className="loading-base" />}{' '}
					</button>
				</div>
			</Modal>
			<Tooltip title="Thêm ghi chú">
				<button className="btn btn-warning" onClick={() => showModal(null)}>
					Thêm ghi chú
				</button>
			</Tooltip>
			<div className="row">
				<div className="col-md-7">
					<NestedTable
						onFetchData={onFetchData}
						addClass="basic-header"
						dataSource={dataSource}
						columns={columns}
						haveBorder={true}
					/>
				</div>
			</div>
		</div>
	);
};

export default StudentAdvisoryNote;
