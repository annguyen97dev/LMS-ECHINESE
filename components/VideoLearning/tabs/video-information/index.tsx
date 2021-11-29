import React, { FC } from 'react';
import 'antd/dist/antd.css';
import { Descriptions, Spin } from 'antd';
import ReactHtmlParser from 'react-html-parser';

type props = {
	params: { Title: string; Description: string };
	details: any;
};

const title = 'Thông tin khóa học';

const VideoInfomation: FC<props> = ({ params, details }) => {
	return (
		<div className="wrap-infomation">
			<Descriptions className="ml-3 " column={1} title={title} bordered>
				{details?.VideoCourseName === '' ? (
					<Spin size="default" />
				) : (
					<>
						<Descriptions.Item label="Tên khóa học">{ReactHtmlParser(details?.VideoCourseName)}</Descriptions.Item>
						<Descriptions.Item label="Slogan">{ReactHtmlParser(details?.Slogan)}</Descriptions.Item>
						<Descriptions.Item label="Đối tượng học">{ReactHtmlParser(details?.CourseForObject)}</Descriptions.Item>
						<Descriptions.Item label="Điều kiện học">{ReactHtmlParser(details?.Requirements)}</Descriptions.Item>
						<Descriptions.Item label="Nội dung khóa học">{ReactHtmlParser(details?.ResultsAchieved)}</Descriptions.Item>
						<Descriptions.Item label="Giới thiệu">{ReactHtmlParser(details?.Description)}</Descriptions.Item>
					</>
				)}
			</Descriptions>
		</div>
	);
};

export default VideoInfomation;
