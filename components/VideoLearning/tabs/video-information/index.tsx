import React, { FC } from 'react';
import 'antd/dist/antd.css';
import { Descriptions } from 'antd';

type props = {
	params: { Title: string; Description: string };
};

const title = 'Thông tin khóa học';

const VideoInfomation: FC<props> = ({ params }) => {
	return (
		<div className="wrap-infomation">
			<Descriptions className="ml-3 " column={1} title={title} bordered>
				<Descriptions.Item label="Tên khóa học">{params.Title}</Descriptions.Item>
				<Descriptions.Item label="Giới thiệu">{params.Description}</Descriptions.Item>
			</Descriptions>
		</div>
	);
};

export default VideoInfomation;
