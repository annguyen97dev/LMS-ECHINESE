import { Form, Modal, Spin, Tooltip } from 'antd';
import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'react-feather';
import { courseStudentPriceApi } from '~/apiBase/customer/student/course-student-price';
import { useWrap } from '~/context/wrap';

const UpdatePaidStatus = (props) => {
	const { record, setFilters } = props;
	const [isVisible, setIsVisible] = useState(false);
	const [isLoading, setIsLoading] = useState({ type: '', loading: false });
	const { showNoti } = useWrap();

	const handleUpdate = async () => {
		setIsLoading({ type: 'UPLOADING', loading: true });
		try {
			let res = await courseStudentPriceApi.update({ ID: record.ID, DonePaid: !record.DonePaid, Enable: true });
			if (res.status == 200) {
				showNoti('success', 'Cập nhật thành công!');
				setFilters();
				setIsVisible(false);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({ type: 'UPLOADING', loading: false });
		}
	};

	return (
		<>
			<button
				className="btn btn-icon edit"
				onClick={() => {
					setIsVisible(true);
				}}
			>
				<Tooltip title="Cập trạng thái thanh toán">
					<RotateCcw />
				</Tooltip>
			</button>

			<Modal
				visible={isVisible}
				footer={null}
				title="Cập nhật trạng thái thanh toán"
				onCancel={() => {
					setIsVisible(false);
				}}
			>
				<Form onFinish={handleUpdate}>
					<div className="row">
						<div className="col-12 mb-3">
							<h3 className="text-center">{record.DonePaid ? 'Xác nhận chưa thanh toán?' : 'Xác nhận đã thanh toán?'}</h3>
						</div>
						<div className="col-12">
							<button type="submit" className="btn btn-primary w-100">
								Lưu
								{isLoading.type == 'UPLOADING' && isLoading.loading && <Spin className="loading-base" />}
							</button>
						</div>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default UpdatePaidStatus;
