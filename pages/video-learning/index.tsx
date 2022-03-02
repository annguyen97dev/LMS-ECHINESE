import { Drawer, Spin } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { VideoCourseDetailApi } from '~/apiBase/video-course-details';
import { VideoCourseInteraction, VideoCourseOfStudent, VideoCourses } from '~/apiBase/video-learning';
import { VideoNoteApi } from '~/apiBase/video-learning/video-note';
import HeaderVideo from '~/components/VideoLearning/header';
import VideoList from '~/components/VideoLearning/list-video';
import VideoTabs from '~/components/VideoLearning/tabs';
import { useWrap } from '~/context/wrap';
import { usePageVisibility } from '~/utils/functions';

const initDetails = {
	VideoCourseName: '',
	Slogan: '',
	Requirements: '',
	Description: '',
	ResultsAchieved: '',
	CourseForObject: '',
	TotalRating: 0,
	RatingNumber: 0,
	TotalStudent: 0,
	CreatedBy: ''
};

const useUnload = (fn) => {
	const cb = useRef(fn);

	useEffect(() => {
		cb.current = fn;
	}, [fn]);

	useEffect(() => {
		const onUnload = (...args) => cb.current?.(...args);
		window.addEventListener('beforeunload', onUnload);
		return () => window.removeEventListener('beforeunload', onUnload);
	}, []);
};

const useBeforeUnload = (fn) => {
	window.onbeforeunload = function () {
		fn();
		return 'Bạn thật sự muốn đóng video đang xem?';
	};
};

const VideoLearning = () => {
	const router = useRouter();
	const ref = useRef<HTMLDivElement>(null);
	const { titlePage, userInformation } = useWrap();

	const videoStudy = useRef(null);
	const boxVideo = useRef(null);
	const [currentVideo, setCurrentVideo] = useState(null);
	const [data, setData] = useState([]);
	const [render, setRender] = useState('');
	const [videos, setVideos] = useState([]);
	const [dataQA, setDataQA] = useState([]);
	const [dataNotification, setDataNotification] = useState([]);
	const [currentLession, setCurrentLession] = useState({
		ID: '',
		Title: '',
		Description: '',
		Type: 0,
		SectionID: '',
		Second: 0
	});

	useEffect(() => {
		if (router.query.course !== undefined) {
			getVideos();
			getCourseDetails(router.query.course);
		}
	}, []);

	// RELOAD TAB
	useUnload((e) => {
		updateTime();
		e.preventDefault();
		e.returnValue = '';
	});

	// CLOSE WINDOW OR TAB
	if (typeof window !== 'undefined') {
		useBeforeUnload(() => updateTime());
	}

	// HANDLE VISIT PAGE
	const handleVisibilityChange = (visible) => {
		if (videoStudy.current !== null) {
			if (videoStudy.current.currentTime !== 0) {
				updateTime();
			}
		}
	};

	const [details, setDetails] = useState(initDetails);

	// CALL API DETAILS
	const getCourseDetails = async (param) => {
		try {
			const res = await VideoCourseDetailApi.getDetails(param);
			res.status == 200 && setDetails(res.data.data);
		} catch (error) {
			console.log(error);
		}
	};

	usePageVisibility(handleVisibilityChange);

	const updateTime = async () => {
		if (videoStudy.current !== null) {
			if (videoStudy.current.currentTime !== 0 && currentLession.ID !== '') {
				let temp = {
					VideoCourseOfStudentID: router.query.ID,
					SectionID: currentLession.SectionID,
					LessonID: currentLession.ID,
					IsSeen: videoStudy.current.duration / 2 < videoStudy.current.currentTime ? 'True' : 'False', // True - False: đánh dấu đã xem video
					TimeWatched: videoStudy.current.currentTime // (giây) Thời gian đã xem video
				};
				try {
					const res = await VideoCourseOfStudent.UpdateSeenAndTimeWatchedVideo(temp);
				} catch (error) {}
			}
		}
	};

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
			searchCreateby: userInformation?.UserAccountID,
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
			getListNotification(router.query.ID);
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
			ID: id
		};
		try {
			await VideoNoteApi.delete(temp);
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
	const handleEditQuestion = async (param) => {
		try {
			await VideoNoteApi.update(param);
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
				TimeNote: curTime || 0,
				Type: 2
			};
			await VideoCourseInteraction.add(temp);
			getListNote(currentLession.ID);
		} catch (error) {}
	};

	// -- PAUSE VIDEO
	function handlePause() {
		// videoStudy.current.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*')
		// console.log(videoStudy.current.contentWindow.document)
		// console.log(videoStudy.current.contentWindow.window)
	}

	const fake = 'http://www.youtube.com/embed/NlOF03DUoWc';

	function Iframe(props) {
		const [hei, setHei] = useState(0);
		useEffect(() => {
			if (videoStudy.current.clientWidth > 0) {
				setHei(videoStudy.current.clientWidth / 1.75);
			}
		}, [videoStudy.current && videoStudy.current.clientWidth]);

		return (
			// <div
			// 	className="iframe-video"
			// 	ref={ref}
			// 	style={{ width: '100%', height: hei || 'auto' }}
			// 	id="PStyle"
			// 	dangerouslySetInnerHTML={{ __html: props.iframe ? props.iframe : '' }}
			// />
			<>
				<iframe
					// ref={ref}
					id="video__course__iframe"
					ref={videoStudy}
					width="100%"
					height={hei}
					src={props?.iframe}
					frameBorder="0"
					allow="autoplay; clipboard-write; picture-in-picture"
					allowFullScreen
					title="Embedded youtube"
				></iframe>
				{/* <ReactPlayer ref={videoStudy} width="900px" height="600px" url={fake} /> */}
			</>
		);
	}

	// RENDER
	return (
		<div className="container-fluid p-0" style={{ overflow: 'hidden' }}>
			<HeaderVideo params={router.query} onClick={showDrawer} />
			<div className="row">
				<div className="col-md-9 col-12 p-0">
					<div className="wrap-video pl-3">
						<div ref={ref} className="wrap-video__video">
							<div className="box-video" ref={boxVideo}>
								{currentVideo === null ? (
									<>
										<div className="html-iframe d-flex justify-content-center align-items-between">
											<Spin tip="Loading..." style={{ height: 100, marginTop: '25%' }} size="large"></Spin>
										</div>
									</>
								) : (
									// <iframe id="movie_player" ref={videoStudy} className="html-iframe" src={fake} title="cc" allowFullScreen />
									<Iframe iframe={currentVideo} allow="autoplay" />
								)}

								{data.length > 0 && currentLession.Type === 0
									? data.map((item) => (
											<a href="/#" key={item.ID} style={{ left: item.TimeNote + '%' }} className="marked">
												<div data-time={item.TimeNote}></div>
											</a>
									  ))
									: ''}
							</div>

							<VideoTabs
								videoRef={videoStudy}
								params={currentLession}
								details={details}
								dataNote={data}
								dataQA={dataQA}
								onCreateNew={(p) => handleSubmit(p)}
								onPress={(p) => {
									videoStudy.current.currentTime = p.TimeNote;
								}}
								onDelete={(p) => removeItem(p.ID)}
								onEdit={(p) => handleFixed(p.item.ID, p.title, p.content)}
								onPauseVideo={() => handlePause()}
								addNewQuest={(p) => addNewQuestion(p.comment, p.title)}
								onEditQuest={(e) =>
									handleEditQuestion({
										ID: e.item.ID,
										Title: e.title,
										TextContent: e.content,
										Type: 1
									})
								}
								onDeleteQuest={(e) => handleEditQuestion({ ID: e?.ID, Enable: false })}
								dataNotification={dataNotification}
								createNewNotification={(e) => addNewNotification(e)}
							/>
						</div>
					</div>
				</div>

				<div className="col-md-3 col-12 p-0">
					<div className="wrap-menu">
						<VideoList
							onPress={(p) => {
								setCurrentLession(p);
								getListNote(p.ID);

								const temp =
									'http://lmsv2.monamedia.net/Upload/HTML5LessonDetail/dac149ea-e684-4803-aa58-e872cdcc4aa6/index.html';

								p.Type === 0 ? setCurrentVideo(p.LinkVideo) : setCurrentVideo(p.LinkHtml);
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
