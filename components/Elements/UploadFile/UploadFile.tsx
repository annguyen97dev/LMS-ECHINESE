import React, { useState } from 'react';
import { lessonDetailApi } from '~/apiBase/options/lesson-detail';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useWrap } from '~/context/wrap';

const UploadFile = (props) => {
	const { getFile } = props;
	const { showNoti } = useWrap();

	const propsFile = {
		async onChange(info) {
			if (info.file.status === 'uploading') {
				return;
			}

			if (info.file.status !== 'removed') {
				try {
					let res = await lessonDetailApi.UploadDocument(info.file.originFileObj);
					if (res.status === 200) {
						getFile(res.data.data);
						showNoti('success', 'Tải file thành công!');
					} else {
						showNoti('danger', 'Mạng đang không ổn định!');
					}
				} catch (error) {
					showNoti('danger', error.message);
				}
			}
		},
		progress: {
			strokeColor: {
				'0%': '#108ee9',
				'100%': '#87d068'
			},
			strokeWidth: 3,
			format: (percent) => `${parseFloat(percent.toFixed(2))}%`
		}
	};

	// const onChange = async (info) => {
	// 	if (info.file.status === 'uploading') {
	// 		return;
	// 	}
	// 	try {
	// 		let res = await lessonDetailApi.UploadDocument(info.file.originFileObj);
	// 		if (res.status === 200) {
	// 			getFile(res.data.data);
	// 			showNoti('success', 'Tải file thành công!');
	// 		} else {
	// 			showNoti('danger', 'Mạng đang không ổn định!');
	// 		}
	// 	} catch (error) {
	// 		showNoti('danger', error.message);
	// 	}
	// };

	return (
		<div>
			<Upload {...propsFile} className="file-100">
				<Button icon={<UploadOutlined />}>Upload</Button>
			</Upload>
		</div>
	);
};

export default UploadFile;
