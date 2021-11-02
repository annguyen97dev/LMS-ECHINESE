import React, { FC, useState } from 'react';
import 'antd/dist/antd.css';
import { List } from 'antd';
import RenderItem from '~/components/VideoLearning/list-video/render-item';

type IProps = { videos: any[]; onPress: any };

// LIST VIDEOS
const VideoList: FC<IProps> = ({ videos, onPress }) => {
	return (
		<div className="wrap-video-list">
			<div className="wrap-video-list__container">
				<div className="wrap-video-list__title-2 video-shadow">
					<span className="ml-4 pl-1 none-selection">Nội dung khóa học</span>
				</div>
				<List
					itemLayout="horizontal"
					dataSource={videos}
					className="wrap-list-container"
					renderItem={(item) => (
						<RenderItem
							data={videos}
							onPress={(p) => {
								onPress(p);
							}}
							item={item}
						/>
					)}
				/>
			</div>
		</div>
	);
};

export default VideoList;
