import React, { FC, useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { List, Button, Checkbox, notification } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { VideoCourses } from '~/apiBase/video-learning';
import { useRouter } from 'next/router';
import RenderItemSub from '~/components/VideoLearning/list-video/render-sub-item';

type itemType = {
	ID: string;
	Title: string;
	TotalSecondLesson: string;
	Description: string;
	CompleteVsTotalLesson: string;
	Second: string;
	IsSeen: false;
	LinkDocument: string;
};

type props = {
	item: itemType;
	data: any[];
	onPress: any;
};

let playing: string = '';

// RENDER ITEM LIST VIDEOS
const RenderItem: FC<props> = ({ item, onPress, data }) => {
	const router = useRouter();
	const [isShow, setShow] = useState(false);
	const [subVideos, setSubVideos] = useState([]);
	const [reRender, setRender] = useState('');

	useEffect(() => {
		if (data.indexOf(item) === 0) {
			handleClick();
		}
	}, [data]);

	// CLICK ITEM TO SHOW SUBITEM
	const handleClick = () => {
		setShow(!isShow);
		getVideos();
	};

	// GET INDEXT OF ITEM IN LIST
	const getSectionNumber = () => {
		return data.indexOf(item) + 1;
	};

	//GET DATA
	const getVideos = async () => {
		const temp = {
			SectionID: item.ID,
			VideoCourseOfStudentID: router.query.course
		};

		try {
			const res = await VideoCourses.ListLesson(temp);

			res.status == 200 && setSubVideos(res.data.data);
		} catch (err) {}
	};

	// RENDER
	return (
		<div className="wrap-render-item">
			<div className="pl-5 pt-3 pb-3 row wrap-render-item-2" onClick={handleClick}>
				<div className="left">
					<p className="none-selection">
						Section {getSectionNumber()}: {item.Title}
					</p>
					<span className="date none-selection">
						{item.CompleteVsTotalLesson} |{' '}
						{item.TotalSecondLesson !== null && item.TotalSecondLesson !== undefined
							? item.TotalSecondLesson + ' phút'
							: 'Thời gian: không rõ'}
					</span>
				</div>

				<div className="mr-2" style={{ marginLeft: 17 }}>
					{isShow ? <i className="far fa-chevron-up" /> : <i className="far fa-chevron-down" />}
				</div>
			</div>

			{isShow && (
				<List
					itemLayout="horizontal"
					dataSource={subVideos || []}
					renderItem={(i) => (
						<RenderItemSub
							onPress={(p) => {
								setRender(p.ID);
								onPress(p);
							}}
							data={data}
							item={i}
							subData={subVideos}
							section={item}
						/>
					)}
				/>
			)}
		</div>
	);
};

export default RenderItem;
