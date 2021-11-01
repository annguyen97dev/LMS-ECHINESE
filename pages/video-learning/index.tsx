import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Tabs, Drawer } from 'antd';

import { CircularProgressbar } from 'react-circular-progressbar';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import HeaderVideo from './header';
// import VideoTabs from './tabs';
import VideoList from './list-video';
import { VideoCourseOfStudent, VideoCourseInteraction, VideoCourses } from '~/apiBase/video-learning';
import { useRouter } from 'next/router';
import { useWrap } from '~/context/wrap';

const { TabPane } = Tabs;

// const fakeData = {require("./fakeData/fakeData.json");}

// const data = [];

const VideoLearning = () => {
	const router = useRouter();
	const ref = useRef<HTMLDivElement>(null);

	const { titlePage, userInformation } = useWrap();

	const videoStudy = useRef(null);
	const boxVideo = useRef(null);

	const [currentVideo, setCurrentVideo] = useState('');

	const [data, setData] = useState([]);

	// const [valueNote, setValueNote] = useState("");
	const [render, setRender] = useState('');

	const [eWidth, setWidth] = useState('100%');

	const [size, setSize] = useState([0, 0]);

	const [videos, setVideos] = useState([]);

	const [dataQA, setDataQA] = useState([]);

	const [currentLession, setCurrentLession] = useState({ ID: '' });

	useEffect(() => {
		if (router.query.course !== undefined) {
			getVideos();
			// getListQA(0); // jqhư eghjq danm damns dbnahjsd hjáhhjd ahgyqưgeh qưbanbsdna sgh
			// console.log("userInformation: ", userInformation.UserAccountID);
		}
	}, []);

	useEffect(() => {
		setWidth(ref.current.offsetWidth.toString());
	}, [size]);

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
		} catch (err) {
			// showNoti("danger", err);
		}
	};

	useEffect(() => {
		console.log('data: ', data);
	}, [data]);

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
		} catch (err) {
			// showNoti("danger", err);
		}

		getListQA(LessonDetailID);
	};

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

	const [visible, setVisible] = useState(false);

	const showDrawer = () => {
		setVisible(!visible);
	};

	const onClose = () => {
		setVisible(false);
	};

	useLayoutEffect(() => {
		// setCurrentVideo(fakeData.videos[0].listVideo[0].link);

		function updateSize() {
			setSize([window.innerWidth, window.innerHeight]);
		}
		window.addEventListener('resize', updateSize);
		updateSize();
		return () => window.removeEventListener('resize', updateSize);
	}, []);

	const formatTime = (seconds) => {
		let minutes: any = Math.floor(seconds / 60);
		minutes = minutes >= 10 ? minutes : '0' + minutes;
		seconds = Math.floor(seconds % 60);
		seconds = seconds >= 10 ? seconds : '0' + seconds;
		return minutes + ':' + seconds;
	};

	// --- Remove item ---
	const removeItem = (id) => {
		data.forEach((item, index, arr) => {
			if (item.id === id) {
				arr.splice(index, 1);
			}
		});
		let dataTest = data.filter((item) => {
			return item.id != id;
		});

		setData(dataTest);
		console.log('Data after remove: ', dataTest);
	};

	// --- HANDLE FIXED ---
	const handleFixed = (id, note) => {
		data.forEach((item, index, arr) => {
			if (item.id === id) {
				item.note = note;
			}
		});
		let dataTest = data.map((item) => {
			if (item.id === id) {
				item.note = note;
			}
			return item;
		});

		setData(dataTest);
		// setShowForm(false);
		console.log('DATA after fixed: ', dataTest);
	};

	// --- Calculator position of line note  inside video ---
	const calPosition = (curTime) => {
		let widthVideo = boxVideo.current.offsetWidth;
		let lengthTimeVideo = Math.round(videoStudy.current.duration);

		let position = (curTime * 100) / lengthTimeVideo;
		// position = (position * widthVideo) / 100 + 16;

		return position;
	};

	// --- Handle Submit ---
	const handleSubmit = async (param) => {
		try {
			let curTime = videoStudy.current.currentTime;
			let position = calPosition(curTime);

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

	// RENDER
	return (
		<div className="container-fluid p-0">
			<HeaderVideo params={router.query} onClick={showDrawer} />
			<div className="row">
				<div className="col-md-9 col-12 p-0">
					<div className="wrap-video pl-3">
						<div ref={ref} className="wrap-video__video">
							<div className="box-video" ref={boxVideo}>
								<video ref={videoStudy} controls>
									<track default kind="captions" />
									{/* VIDIEO LINK IN SRC */}
									<source src="/static/video/video.mp4" type="video/mp4" />
									Your browser does not support HTML video.
								</video>

								{/* {data.length > 0
                  ? data.map((item) => (
                      <a
                        href="/#"
                        key={item.id}
                        style={{ left: item.position + "%" }}
                        className="marked"
                        onClick={moveToCurTime}
                      >
                        <div data-time={item.curTime}></div>
                      </a>
                    ))
                  : ""} */}
							</div>

							{/* <VideoTabs
                params={fakeData}
                dataNote={data}
                dataQA={dataQA}
                onCreateNew={(p) => {
                  handleSubmit(p);
                }}
                onPress={(p) => {
                  videoStudy.current.currentTime = p.TimeNote;
                }}
                onDelete={(p) => {
                  removeItem(p.id);
                }}
                onEdit={(p) => {
                  console.log(p);
                  handleFixed(p.item.id, p.content);
                }}
                onPauseVideo={() => {
                  handlePause();
                }}
                videoRef={videoStudy}
                addNewQuest={(p) => {
                  addNewQuestion(p.comment, p.title);
                }}
              /> */}
						</div>
					</div>
				</div>

				<div className="col-md-3 col-12 p-0">
					<div className="wrap-menu">
						<VideoList
							onPress={(p) => {
								console.log(p);

								setCurrentLession(p);

								// getListQA(p.ID);
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
							setCurrentVideo(p);
						}}
						videos={videos}
					/>
				</div>
			</Drawer>
		</div>
	);
};

export default VideoLearning;
