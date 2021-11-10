import React, { FC, useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { List, Button, Checkbox, notification, Tooltip } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { VideoCourses } from '~/apiBase/video-learning';
import { useRouter } from 'next/router';
import da from 'date-fns/esm/locale/da/index.js';

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
	subData: any[];
	section: any;
};

let playing: string = '';
// let type = 0;

// RENDER SUB ITEM LIST
const RenderItemSub: FC<props> = ({ item, onPress, data, subData, section }) => {
	const router = useRouter();
	const [api, contextHolder] = notification.useNotification();
	const [type, setType] = useState(0);

	useEffect(() => {
		if (subData.indexOf(item) === 0) {
			handleClick(0);
		}
	}, [data]);

	// HANDLER CLICK ITEM => PLAY VIDEO
	const handleClick = async (e) => {
		await getLessonDetail(e);
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
	const getLessonDetail = async (e) => {
		const temp = {
			VideoCourseOfStudentID: router.query.course,
			LessonID: item.ID
		};
		try {
			const res = await VideoCourses.LessonDetail(temp);
			res.status == 200 && onPress(getJsonData(res.data.data, e));
		} catch (err) {}
	};

	const getJsonData = (param, e) => {
		return {
			ID: param.ID,
			SectionID: section.ID,
			Description: param.Description,
			LinkDocument: param.LinkDocument,
			LinkHtml: param.LinkHtml,
			LinkVideo: param.LinkVideo,
			TimeWatched: param.TimeWatched,
			Second: item.Second,
			Title: item.Title,
			Type: e
		};
	};

	// RENDER
	return (
		<a
			onClick={() => {
				setType(0);
				handleClick(0);
			}}
			className="pt-3 pb-3 wrap-sub-item"
			style={{
				background: playing == item.ID ? '#d1d7dc' : '#fff'
			}}
		>
			{contextHolder}
			<Checkbox
				checked={item.IsSeen}
				onClick={() => {
					setType(0);
					handleClick(0);
				}}
				className="mr-3"
				disabled
			/>
			<div className="video-space-between">
				<p
					onClick={() => {
						setType(0);
						handleClick(0);
					}}
					className="none-selection"
				>
					{item.Title}
				</p>
				<div className="p-0 m-0 pr-2 row wrap-download">
					<div
						onClick={() => {
							setType(0);
							handleClick(0);
						}}
						className="btn-download p-0"
					>
						<i className="fas mr-2 fa-play-circle"></i>
						<span className="date none-selection">{item.Second} giây</span>
					</div>

					<div className="row m-0 p-0">
						<Tooltip title="Xem video">
							<i
								onClick={(e) => {
									e.stopPropagation();
									handleClick(0);
								}}
								className="far fa-file-video wrap-sub-item__btn-video"
							></i>
						</Tooltip>
						<Tooltip title="Xem html">
							<i
								onClick={(e) => {
									e.stopPropagation();
									handleClick(1);
								}}
								className="far fa-file-code wrap-sub-item__btn-html"
							></i>
						</Tooltip>
					</div>
					{/* {item.LinkDocument !== '' && item.LinkDocument !== null ? (
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
					)} */}
				</div>
			</div>
		</a>
	);
};

export default RenderItemSub;
