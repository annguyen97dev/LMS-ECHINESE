import { List, Modal } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { zoomRoomApi } from '~/apiBase';

const ZoomRecordModal = (props) => {
	const { scheduleID, isOpenModal, onCloseModal } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [recordList, setRecordList] = useState<IZoomRecord[]>([]);

	const getRecordList = async () => {
		if (!scheduleID) return;
		try {
			setIsLoading(true);
			const res = await zoomRoomApi.getRecord(scheduleID);
			if (res.status === 200 && Array.isArray(res.data.data) && res.data.data.length) {
				setRecordList(res.data.data);
			} else {
				setRecordList([]);
			}
		} catch (error) {
			if (error.status === 400) {
				setRecordList([]);
			}
			console.log('getRecordList', error.message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (isOpenModal) {
			getRecordList();
		}
	}, [isOpenModal]);

	const checkTitle = (title: string) => {
		if (title === 'shared_screen') return 'Bản ghi chia sẻ màn hình';
		if (title === 'shared_screen_with_speaker_view') return 'Bản ghi chia sẻ màn hình có tiếng';
		if (title === 'active_speaker') return 'Bản ghi âm thanh có hình';
		if (title === 'audio_only') return 'Bản ghi âm thanh';
		if (title === 'chat_file') return 'Bảng trò chuyện';
		return 'Bản ghi khác';
	};

	return (
		<>
			<Modal title="Danh sách bản ghi buổi học" visible={isOpenModal} footer={null} onCancel={onCloseModal}>
				<List
					pagination={{
						pageSize: 5
					}}
					loading={isLoading}
					itemLayout="horizontal"
					dataSource={recordList}
					renderItem={(item: IZoomRecord, idx) => (
						<List.Item
							actions={[
								<a target="_blank" href={`${item.play_url}`}>
									Xem trực tuyến
								</a>,
								<a href={`${item.download_url}`} download>
									Tải bản ghi
								</a>
							]}
						>
							<List.Item.Meta title={checkTitle(item.recording_type)} />
						</List.Item>
					)}
				/>
			</Modal>
		</>
	);
};
ZoomRecordModal.propTypes = {
	scheduleID: PropTypes.number.isRequired,
	isOpenModal: PropTypes.bool.isRequired,
	onCloseModal: PropTypes.func.isRequired
};
ZoomRecordModal.defaultProps = {};
export default ZoomRecordModal;
