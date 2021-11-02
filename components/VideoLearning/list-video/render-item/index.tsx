import React, { FC, useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { List, Button, Checkbox, notification } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { VideoCourses } from '~/apiBase/video-learning';
import { useRouter } from 'next/router';

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

// RENDER SUB ITEM LIST
const RenderItemSub: FC<props> = ({ item, onPress }) => {
	const router = useRouter();
	const [api, contextHolder] = notification.useNotification();

	// HANDLER CLICK ITEM => PLAY VIDEO
	const handleClick = async () => {
		await getLessonDetail();
		playing = item.ID;
	};

	// NOTIFICATION WHEN ITEM DON'T HAVE DOCUMEMT
	const openNotification = (placement) => {
		api.info({
			message: 'Tải không thành công',
			description: 'Không tìm thấy file document',
			placement
		});
	};

	// CALL API GET LESSION DETAIL
	const getLessonDetail = async () => {
		const temp = {
			VideoCourseOfStudentID: router.query.course,
			LessonID: item.ID
		};

		try {
			const res = await VideoCourses.LessonDetail(temp);
			res.status == 200 && onPress(res.data.data);
		} catch (err) {}
	};

	// RENDER
	return (
		<a
			onClick={handleClick}
			className="pt-3 pb-3 wrap-sub-item"
			style={{
				background: playing == item.ID ? '#d1d7dc' : '#fff'
			}}
		>
			{contextHolder}
			<Checkbox checked={item.IsSeen} onClick={handleClick} className="mr-3" disabled />
			<div className="video-space-between">
				<p onClick={handleClick} className="none-selection">
					{item.Title}
				</p>
				<div className="pr-4 pl-0 mr-0 row wrap-download">
					<div onClick={handleClick} className="btn-download">
						<i className="fas mr-2 fa-play-circle"></i>
						<span className="date none-selection">{item.Second} giây</span>
					</div>
					{item.LinkDocument !== '' && item.LinkDocument !== null ? (
						<Button
							onClick={(e) => e.stopPropagation()}
							href={item.LinkDocument !== '' ? item.LinkDocument : ''}
							className="btn-download"
							icon={<DownloadOutlined />}
							size="small"
							download={item.LinkDocument !== '' ? true : false}
						>
							Tải xuống
						</Button>
					) : (
						<Button
							onClick={(e) => (e.stopPropagation(), openNotification('bottomRight'))}
							className="btn-download"
							icon={<DownloadOutlined />}
							size="small"
						>
							Tải xuống
						</Button>
					)}
				</div>
			</div>
		</a>
	);
};

// RENDER ITEM LIST VIDEOS
export const RenderItem: FC<props> = ({ item, onPress, data }) => {
	const router = useRouter();
	const [isShow, setShow] = useState(false);
	const [subVideos, setSubVideos] = useState([]);
	const [reRender, setRender] = useState('');

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

				<div>{isShow ? <i className="far fa-chevron-up" /> : <i className="far fa-chevron-down" />}</div>
			</div>

			{isShow && (
				<List
					itemLayout="horizontal"
					dataSource={subVideos || []}
					renderItem={(item) => (
						<RenderItemSub
							onPress={(p) => {
								setRender(p.ID);
								onPress(p);
							}}
							data={data}
							item={item}
						/>
					)}
				/>
			)}
		</div>
	);
};
