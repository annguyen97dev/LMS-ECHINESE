import React, { useState } from 'react';
import { Form, Upload, Spin, Button, Tooltip } from 'antd';
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';
import { useWrap } from '~/context/wrap';
import { exerciseGroupApi } from '~/apiBase/';

const UploadAudio = (props) => {
	const { getFile, valueFile, onDeleteAudio } = props;
	const [linkUpload, setLinkUpload] = useState(valueFile);
	const [loadingUpload, setLoadingUpload] = useState(false);
	const { showNoti } = useWrap();

	// Upload file audio
	const onchange_UploadFile = async (info) => {
		if (info.file.status === 'uploading') {
			setLoadingUpload(true);
			return;
		}
		setLoadingUpload(true);
		try {
			let res = await exerciseGroupApi.UploadAudio(info.file.originFileObj);
			if (res.status == 200) {
				setLinkUpload(res.data.data);
				getFile && getFile(res.data.data);
				showNoti('success', 'Upload file thành công');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoadingUpload(false);
		}
	};

	return (
		<div>
			<Upload onChange={onchange_UploadFile} showUploadList={false}>
				<Button icon={<UploadOutlined />}>Bấm để tải file</Button>
			</Upload>
			<div className="d-block mt-3">
				{loadingUpload ? (
					<div className="d-flex align-items-center">
						<Spin />
						<span
							style={{
								marginLeft: '5px',
								fontStyle: 'italic',
								fontSize: '13px'
							}}
						>
							Loading audio...
						</span>
					</div>
				) : (
					linkUpload && (
						<div>
							<audio controls>
								<source src={linkUpload} type="audio/mpeg" />
							</audio>
							{/* <Tooltip title="Xóa audio">
                <button className="delete-ans ms-3" onClick={deleteAudio}>
                  <CloseOutlined />
                </button>
              </Tooltip> */}
						</div>
					)
				)}
			</div>
		</div>
	);
};

export default UploadAudio;
