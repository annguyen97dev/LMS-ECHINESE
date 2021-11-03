import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Tabs, Drawer } from 'antd';
import 'react-circular-progressbar/dist/styles.css';
import HeaderVideo from '~/components/VideoLearning/header';
import VideoTabs from '~/components/VideoLearning/tabs';
import VideoList from '~/components/VideoLearning/list-video';
import { VideoCourseOfStudent, VideoCourseInteraction, VideoCourses } from '~/apiBase/video-learning';
import Router, { useRouter } from 'next/router';
import { useWrap } from '~/context/wrap';
import { VideoNoteApi } from '~/apiBase/video-learning/video-note';

const VideoLearning = () => {
	const router = useRouter();
	const ref = useRef<HTMLDivElement>(null);
	const { titlePage, userInformation } = useWrap();

	const videoStudy = useRef(null);
	const boxVideo = useRef(null);
	const [currentVideo, setCurrentVideo] = useState('');
	const [data, setData] = useState([]);
	const [render, setRender] = useState('');
	const [videos, setVideos] = useState([]);
	const [dataQA, setDataQA] = useState([]);
	const [dataNotification, setDataNotification] = useState([]);
	const [currentLession, setCurrentLession] = useState({ ID: '', Title: '', Description: '' });

	useEffect(() => {
		if (router.query.course !== undefined) {
			getVideos();
		}
	}, []);
	window.addEventListener('beforeunload', function (e) {
		// Cancel the event
		console.log(e);

		e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
		// Chrome requires returnValue to be set
		e.returnValue = '';
	});

	console.log('render');

	useEffect(() => {
		return () => {
			console.log('asdasd');
		};
	}, []);

	//GET DATA
	const getVideos = async () => {
		try {
			const res = await VideoCourses.ListSection(router.query.course);
			res.status == 200 && setVideos(res.data.data);
		} catch (err) {
			// showNoti("danger", err);
		}
	};

	//GET DATA
	const getListQA = async (LessonDetailID) => {
		const temp = {
			pageIndex: 1,
			pageSize: 10,
			VideoCourseID: router.query.course,
			LessonDetailID: LessonDetailID,
			Title: '',
			sort: 0
		};
		try {
			const res = await VideoCourseInteraction.ListQA(temp);
			res.status == 200 && res.data.data !== undefined ? setDataQA(res.data.data) : setDataQA([]);
		} catch (err) {}
		getListNotification(router.query.course);
	};

	//GET DATA
	const getListNote = async (LessonDetailID) => {
		const temp = {
			pageIndex: 1,
			pageSize: 10,
			VideoCourseID: router.query.course,
			LessonDetailID: LessonDetailID,
			searchCreateby: userInformation.UserAccountID,
			sort: 0
		};
		try {
			const res = await VideoCourseInteraction.ListNote(temp);
			res.status == 200 && res.data.data !== undefined ? setData(res.data.data) : setData([]);
			setRender(res + '');
		} catch (err) {}
		getListQA(LessonDetailID);
	};

	//GET DATA NOTIFICATION
	const getListNotification = async (videocourseID) => {
		try {
			const res = await VideoCourseInteraction.ListListAnnouncement(videocourseID);
			res.status == 200 && res.data.data !== undefined ? setDataNotification(res.data.data) : setDataNotification([]);
			res.status == 204 && setDataNotification([]);
			setRender(res + '');
		} catch (err) {}
	};

	// CALL API CREATE NEW QUESTION
	const addNewQuestion = async (comment, title) => {
		try {
			let temp = {
				VideoCourseID: router.query.course,
				LessonDetailID: currentLession.ID,
				Title: title,
				TextContent: comment,
				Type: 1
			};
			await VideoCourseInteraction.add(temp);
			getListQA(currentLession.ID);
		} catch (error) {}
	};

	// CALL API CREATE NEW QUESTION
	const addNewNotification = async (param) => {
		try {
			let curTime = videoStudy.current.currentTime;
			let temp = {
				VideoCourseID: router.query.course,
				LessonDetailID: currentLession.ID,
				Title: param.title,
				TextContent: param.newContent,
				TimeNote: curTime,
				Type: 3
			};
			await VideoCourseInteraction.add(temp);
			getListNotification(router.query.course);
		} catch (error) {}
	};

	// DRAWER VIDEO LIST STATE
	const [visible, setVisible] = useState(false);

	// OPEN DRAWER VIDEO LIST
	const showDrawer = () => {
		setVisible(!visible);
	};

	// CLOSE DRAWER VIDEO LIST
	const onClose = () => {
		setVisible(false);
	};

	const formatTime = (seconds) => {
		let minutes: any = Math.floor(seconds / 60);
		minutes = minutes >= 10 ? minutes : '0' + minutes;
		seconds = Math.floor(seconds % 60);
		seconds = seconds >= 10 ? seconds : '0' + seconds;
		return minutes + ':' + seconds;
	};

	// DELETE NOTE
	const removeItem = async (id) => {
		let temp = {
			ID: id,
			Type: 3
		};
		try {
			await VideoNoteApi.update(temp);
		} catch (error) {}
		getListNote(currentLession.ID);
	};

	// POST DATA EDIT NOTE
	const handleFixed = async (id, title, note) => {
		let temp = {
			ID: id,
			Title: title,
			TextContent: note
		};
		try {
			await VideoNoteApi.update(temp);
		} catch (error) {}
		getListNote(currentLession.ID);
	};

	// HANDLE EDIT QUESTION
	const handleEditQuestion = async (id, title, content) => {
		let temp = {
			ID: id,
			Title: title,
			TextContent: content,
			Type: 1
		};
		try {
			await VideoNoteApi.update(temp);
		} catch (error) {}
		getListNote(currentLession.ID);
	};

	// --- Calculator position of line note  inside video ---
	const calPosition = (curTime) => {
		let widthVideo = boxVideo.current.offsetWidth;
		let lengthTimeVideo = Math.round(videoStudy.current.duration);

		let position = (curTime * 100) / lengthTimeVideo;
		// position = (position * widthVideo) / 100 + 16;

		return position;
	};

	// CREATE NEW NOTE
	const handleSubmit = async (param) => {
		try {
			let curTime = videoStudy.current.currentTime;
			let temp = {
				VideoCourseID: router.query.course,
				LessonDetailID: currentLession.ID,
				Title: param.title,
				TextContent: param.newContent,
				TimeNote: curTime,
				Type: 2
			};
			await VideoCourseInteraction.add(temp);
			getListNote(currentLession.ID);
		} catch (error) {}
	};

	// -- PAUSE VIDEO
	const handlePause = () => {
		videoStudy.current.pause();
	};

	const fakeVideos = 'http://lmsv2.monamedia.net/Upload/NewsFeed/09caac49-d844-4b74-9025-ae4d03e03d82.mp4';

	// RENDER
	return (
		<div className="container-fluid p-0">
			<HeaderVideo params={router.query} onClick={showDrawer} />
			<div className="row">
				<div className="col-md-9 col-12 p-0">
					<div className="wrap-video pl-3">
						<div ref={ref} className="wrap-video__video">
							<div className="box-video" ref={boxVideo}>
								<video src={currentVideo} ref={videoStudy} controls>
									<track default kind="captions" />
								</video>

								{data.length > 0
									? data.map((item) => (
											<a
												href="/#"
												key={item.ID}
												style={{ left: item.TimeNote + '%' }}
												className="marked"
												// onClick={moveToCurTime}
											>
												<div data-time={item.TimeNote}></div>
											</a>
									  ))
									: ''}
							</div>

							<VideoTabs
								params={currentLession}
								dataNote={data}
								dataQA={dataQA}
								onCreateNew={(p) => {
									handleSubmit(p);
								}}
								onPress={(p) => {
									videoStudy.current.currentTime = p.TimeNote;
								}}
								onDelete={(p) => {
									removeItem(p.ID);
								}}
								onEdit={(p) => {
									handleFixed(p.item.ID, p.title, p.content);
								}}
								onPauseVideo={() => {
									handlePause();
								}}
								videoRef={videoStudy}
								addNewQuest={(p) => {
									addNewQuestion(p.comment, p.title);
								}}
								onEditQuest={(e) => {
									handleEditQuestion(e.item.ID, e.title, e.content);
								}}
								dataNotification={dataNotification}
								createNewNotification={(e) => {
									addNewNotification(e);
								}}
							/>
						</div>
					</div>
				</div>

				<div className="col-md-3 col-12 p-0">
					<div className="wrap-menu">
						<VideoList
							onPress={(p) => {
								console.log('VideoList - onPress: ', p);

								setCurrentLession(p);
								getListNote(p.ID);
								setCurrentVideo(p.LinkVideo);
							}}
							videos={videos}
						/>
					</div>
				</div>
			</div>

			<Drawer
				title="Nội dung khóa học"
				placement="right"
				onClose={onClose}
				visible={visible}
				className="video-drawer"
				headerStyle={{
					paddingTop: 24,
					paddingBottom: 24,
					background: '#fff'
				}}
			>
				<div className="wrap-menu-drawer">
					<VideoList
						onPress={(p) => {
							setCurrentLession(p);
							getListNote(p.ID);
							setCurrentVideo(p.LinkVideo);
						}}
						videos={videos}
					/>
				</div>
			</Drawer>
		</div>
	);
};

export default VideoLearning;
