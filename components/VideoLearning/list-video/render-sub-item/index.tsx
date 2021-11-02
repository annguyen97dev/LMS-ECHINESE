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

export default RenderItemSub;
