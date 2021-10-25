import { Tooltip } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useState } from 'react';
import { AlertTriangle, Info, X } from 'react-feather';
import { jobApi } from '~/apiBase';
import { packageResultApi } from '~/apiBase/package/package-result';
import { useWrap } from '~/context/wrap';

const PackageResultUpdateTeacher = React.memo((props: any) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { reloadData } = props;
	const { showNoti } = useWrap();

	const onHandleDelete = async () => {
		try {
			setIsModalVisible(false);
			// @ts-ignore
			let res = await packageResultApi.updateTeacher();
			showNoti('success', res.data?.message);
			reloadData(1);
		} catch (error) {
			setIsModalVisible(false);
			showNoti('danger', error.message);
		}
	};

	return (
		<>
			<Tooltip title="Tự động chia giáo viên chấm bài">
				<button
					className="btn btn-warning add-new"
					onClick={() => {
						setIsModalVisible(true);
					}}
				>
					Chia đều giáo viên chấm bài
				</button>
			</Tooltip>
			<Modal title={<Info color="green" />} visible={isModalVisible} onOk={onHandleDelete} onCancel={() => setIsModalVisible(false)}>
				<p className="text-confirm">Chức năng này chỉ được sử dụng cho các đề thi đã được yêu cầu chấm</p>
			</Modal>
		</>
	);
});

export default PackageResultUpdateTeacher;
