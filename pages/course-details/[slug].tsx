import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Card, Rate, Modal, Spin, Input } from 'antd';
import { useWrap } from '~/context/wrap';
import ReactHtmlParser from 'react-html-parser';
import LayoutBase from '~/components/LayoutBase';
import { parseToMoney } from '~/utils/functions';
import { VideoCourseDetailApi } from '~/apiBase/video-course-details';
import CourseDetailsContent from '~/components/VideoCourse/CourseDetailsContent/CourseDetailsContent';
import CourseDetailsFeedBack from '~/components/VideoCourse/CourseDetailsFeedBack';
import { VideoCourseCardApi } from '~/apiBase/video-course-store';
import CourseDetailsPreview from '~/components/VideoCourse/CourseDetailsPreview';
import Link from 'next/link';
import { VideoCourseListApi } from '~/apiBase';

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

const VideoCourseDetailF = (props) => {
	const router = useRouter();
	const videoStudy = useRef(null);

	const slug = router.query.slug;
	let path: string = router.pathname;
	let pathString: string[] = path.split('/');
	path = pathString[pathString.length - 2];

	const [isLoading, setLoading] = useState(true);
	const { showNoti, getTitlePage, handleReloadNoti, userInformation } = useWrap();
	const [details, setDetails] = useState(initDetails);
	const [content, setContent] = useState({});

	const [showPreview, setShowPreview] = useState(false);
	const [buyLoading, setByLoading] = useState(false);
	const [buyNowLoading, setByNowLoading] = useState(false);

	useEffect(() => {
		getTitlePage('Khóa học video');
		if (userInformation !== null) {
			getCourseDetails(slug);
		}
	}, [userInformation]);

	// CALL API DETAILS
	const getCourseDetails = async (param) => {
		try {
			const res = await VideoCourseDetailApi.getDetails(param);
			res.status == 200 && (setDetails(res.data.data), getCourseContent(res.data.data.CurriculumID));
		} catch (error) {
			console.log(error);
		}
	};

	const [feedBack, setFeedBack] = useState({});
	const [feedbackIndex, setIndex] = useState(1);

	console.log('router.query?.CurriculumID: ', router.query?.CurriculumID);

	// CALL API GET CONTENT
	const getCourseContent = async (param) => {
		try {
			const res = await VideoCourseDetailApi.getContent(param);
			res.status == 200 && setContent(res.data.data);
		} catch (error) {
			console.log(error);
		} finally {
			let temp = {
				videocourseId: slug,
				rating: 0,
				search: '',
				pageIndex: feedbackIndex,
				pageSize: 10
			};
			getCourseFeedback(temp);
			getCoursePreview(router.query?.CurriculumID);
		}
	};

	const [videoPreView, setVideoPreView] = useState([]);

	// CALL API GET FEEDBACK
	const getCourseFeedback = async (param) => {
		try {
			const res = await VideoCourseDetailApi.getFeedback(param);
			res.status == 200 && setFeedBack(res.data.data);
		} catch (error) {
			console.log(error);
		}
	};

	// CALL API GET FEEDBACK
	const getCoursePreview = async (param) => {
		try {
			const res = await VideoCourseDetailApi.getLessonPreview(param);
			res.status == 200 && setVideoPreView(res.data.data);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	// HANDLE SEARCH
	const onSearchFeedback = (e) => {
		let temp = {
			videocourseId: slug,
			rating: 0,
			search: e,
			pageIndex: feedbackIndex,
			pageSize: 10
		};
		getCourseFeedback(temp);
	};

	// HANDLE SEARCH
	const onFilterFeedback = (e) => {
		let temp = {
			videocourseId: slug,
			rating: e,
			search: '',
			pageIndex: feedbackIndex,
			pageSize: 10
		};
		getCourseFeedback(temp);
	};

	// HANDLE SEARCH
	const onChangeIndex = (index) => {
		console.log('onChangeIndex');

		let temp = {
			videocourseId: slug,
			rating: 0,
			search: '',
			pageIndex: index,
			pageSize: 10
		};
		getCourseFeedback(temp);
	};

	const [showModal, setShowModal] = useState(false);
	const [currentVideo, setCurrentVideo] = useState('');

	// ADD COURSE VIDEO TO CART
	const postAddToCard = async (data, type) => {
		try {
			const res = await VideoCourseCardApi.add(data);
			if (type == 1) {
				res.status == 200 && setShowModal(true);
				handleReloadNoti();
			} else {
				router.push('/cart/check-out');
			}
		} catch (error) {
			showNoti('danger', 'Thêm không thành công');
		} finally {
			setByLoading(false);
			setByNowLoading(false);
		}
	};

	// HANDLE AD TO CARD (STUDENT)
	const addToCard = (type) => {
		type == 1 ? setByLoading(true) : setByNowLoading(true);
		let temp = {
			VideoCourseID: slug,
			Quantity: 1
		};
		postAddToCard(temp, type);
	};

	const handlePlayVideo = (e) => {
		setCurrentVideo(e);
	};

	const [activing, setActiving] = useState(false);
	const [code, setCode] = useState('');
	const [activeLoading, setActiveLoading] = useState(false);

	// UPDATE COURSE
	const handleActive = async (param) => {
		setActiveLoading(true);
		try {
			const res = await VideoCourseListApi.updateActiveCode(param);
			res.status == 200 && showNoti('success', 'Thành công');
			res.status === 204 && showNoti('success', 'Thành công');
			getCourseDetails(slug);
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setActiveLoading(false);
		}
	};

	function Iframe(props) {
		const [hei, setHei] = useState(0);
		useEffect(() => {
			if (videoStudy.current.clientWidth > 0) {
				setHei(videoStudy.current.clientWidth / 1.75);
			}
		}, [videoStudy.current && videoStudy.current.clientWidth]);

		const fake = 'http://www.youtube.com/embed/NlOF03DUoWc';

		return (
			// <div
			// 	className="iframe-video"
			// 	ref={videoStudy}
			// 	style={{ width: '100%', height: hei || 'auto' }}
			// 	id="PStyle"
			// 	dangerouslySetInnerHTML={{ __html: props.iframe ? props.iframe : '' }}
			// />
			<>
				<iframe
					id="video__course__iframe"
					ref={videoStudy}
					width="100%"
					height={hei}
					src={props?.iframe}
					frameBorder="0"
					allow="autoplay; clipboard-write; picture-in-picture"
					allowFullScreen
				/>
			</>
		);
	}

	return (
		<>
			<div>
				<div style={{ height: 70 }}>
					<header style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 99 }}>
						<div className="shopping__cart-header justify-content-between align-items-center row">
							<div className="header__logo col-6 col-md-3">
								<Link href="https://app.echinese.vn">
									<a href="https://app.echinese.vn">
										<img className="logo-img" src="/images/logo-final.jpg" alt="logo branch"></img>
									</a>
								</Link>
							</div>
							<div className="header__profile col-2 col-md-3">
								<div className="col-setting">
									<ul className="col-setting-list">
										<li className="user">
											<div className="d-inline-block d-md-none  w-25 "></div>
											<div className="d-none d-md-inline-block "></div>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</header>
					<div
						style={{
							width: '100%',
							height: 12,
							background: '#f8f7f7',
							position: 'fixed',
							top: 72,
							left: 0,
							zIndex: 99
						}}
					/>
				</div>

				<div className="m-3 pl-3 pb-3">
					<div className="row feedback-user">
						<div className="vc-details-fuck_menu" style={{ zIndex: 9 }}>
							<Card loading={isLoading} className="vc-details-fuck col-md-4 col-12 p-0" style={{ width: '150%' }}>
								<div
									onClick={() => {
										videoPreView.length > 0 ? setShowPreview(true) : showNoti('danger', 'Không có video xem trước');
									}}
									className="vc-details-fuck_main-thum"
								>
									{router.query.Thum == null || router.query.Thum == undefined || router.query.Thum == '' ? (
										<img className="vc-details-fuck_thum" src="/images/logo.jpg" />
									) : (
										<img className="vc-details-fuck_thum" src={router.query.Thum.toString()} />
									)}
									<div className="vc-details-fuck_thum-mark">
										<i className="far fa-play-circle vc-details-fuck_icon-play"></i>
									</div>
								</div>

								<div className="row pt-4 st-fb-center">
									<div className="ml-3 mr-3" style={{ width: '100%' }}>
										{router.query.Sell !== undefined && <h2>{parseToMoney(router.query.Sell)}đ</h2>}
										{router.query.Original !== undefined && (
											<h6
												style={{
													textDecorationLine: 'line-through',
													marginTop: 5,
													marginBottom: 15
												}}
											>
												Giá gốc: {parseToMoney(router.query.Original)}đ
											</h6>
										)}

										<div style={{ color: 'red', paddingBottom: 10 }}>Đăng nhập để mua khóa học</div>

										<Link
											href={{
												pathname: 'https://app.echinese.vn'
											}}
										>
											<button className="btn btn-warning" type="button" style={{ width: '100%' }}>
												Đăng nhập
											</button>
										</Link>
									</div>
								</div>
							</Card>
							<div className="col-md-9 col-12"></div>
						</div>

						<div className="col-md-3 col-12 vc-details-fuck_mobile" style={{ zIndex: 9 }}>
							<Card loading={isLoading} className="vc-details-fuck">
								<div
									onClick={() => {
										videoPreView.length > 0 ? setShowPreview(true) : showNoti('danger', 'Không có video xem trước');
									}}
									className="vc-details-fuck_main-thum"
								>
									{router.query.Thum == null || router.query.Thum == undefined || router.query.Thum == '' ? (
										<img className="vc-details-fuck_thum" src="/images/logo.jpg" />
									) : (
										<img className="vc-details-fuck_thum" src={router.query.Thum.toString()} />
									)}
									<div className="vc-details-fuck_thum-mark">
										<i className="far fa-play-circle vc-details-fuck_icon-play"></i>
									</div>
								</div>

								<div className="row pt-4 st-fb-center">
									<div className="ml-3 mr-3" style={{ width: '100%' }}>
										{router.query.Sell !== undefined && <h2>{parseToMoney(router.query.Sell)}đ</h2>}
										{router.query.Original !== undefined && (
											<h6
												style={{
													textDecorationLine: 'line-through',
													marginTop: 5,
													marginBottom: 15
												}}
											>
												Giá gốc: {parseToMoney(router.query.Original)}đ
											</h6>
										)}

										<Link
											href={{
												pathname: 'https://app.echinese.vn'
											}}
										>
											<button className="btn btn-warning" type="button" style={{ width: '100%' }}>
												Đăng nhập
											</button>
										</Link>
									</div>
								</div>
							</Card>
						</div>

						<div className="col-md-3 col-12" />

						<div className="col-md-9 col-12" style={{ zIndex: 9 }}>
							<Card loading={isLoading} className="space-top-card vc-details-fuck_main">
								<div className="card-newsfeed-wrap__label">
									<div className="m-feedback st-fb-100w">
										<div className="m-0 mb-0 st-fb-rsb st-fb-100w m-feedback__head header">
											<span className="name">{ReactHtmlParser(details.VideoCourseName)}</span>
											<span className="slogan mt-2">{ReactHtmlParser(details.Slogan)}</span>
											<div className="row m-0 center-row">
												<Rate disabled value={details.RatingNumber} className="rate" />
												<span className="total-student ml-3">({details.TotalRating} lượt đánh giá)</span>
												<span className="total-student ml-3">{details.TotalStudent} học sinh</span>
												<span className="total-student ml-3">{router.query?.TotalVideoViews || 0} lượt xem</span>
											</div>
											<span className="total-student mt-2">
												Tạo bởi: <span>{details.CreatedBy || 'Không rõ'}</span>
											</span>
										</div>
									</div>
								</div>

								<hr />

								<div className="card-newsfeed-wrap__label">
									<div className="m-feedback st-fb-100w">
										<div className="m-0 mb-3 st-fb-rsb st-fb-100w m-feedback__head header">
											<span className="title">Đối tượng học</span>
											<span className="slogan mt-2">{ReactHtmlParser(details.CourseForObject)}</span>

											<span className="title">Khóa học này có gì?</span>
											<span className="slogan mt-2">{ReactHtmlParser(details.ResultsAchieved)}</span>
										</div>
									</div>
								</div>

								<hr />

								<div className="card-newsfeed-wrap__label">
									<div className="m-feedback st-fb-100w">
										<div className="m-0 mb-3 st-fb-rsb st-fb-100w m-feedback__head header">
											<span className="title">Nội dung khóa học</span>
											<CourseDetailsContent loading={isLoading} contentData={content} />
										</div>
									</div>
								</div>

								<hr />

								<div className="card-newsfeed-wrap__label">
									<div className="m-feedback st-fb-100w">
										<div className="m-0 mb-3 st-fb-rsb st-fb-100w m-feedback__head header">
											<span className="title">Yêu cầu</span>
											<span className="slogan">{ReactHtmlParser(details.Requirements)}</span>
											<span className="title">Giới thiệu</span>
											<span className="slogan">{ReactHtmlParser(details.Description)}</span>
										</div>
									</div>
								</div>

								<hr />

								<div className="card-newsfeed-wrap__label">
									<div className="m-feedback st-fb-100w">
										<div className="m-0 mb-3 st-fb-rsb st-fb-100w m-feedback__head header">
											<span className="title">Phản hồi của học sinh</span>
											<CourseDetailsFeedBack
												feedBack={feedBack}
												onSearchFeedback={onSearchFeedback}
												onFilterFeedback={onFilterFeedback}
												getPagination={(e) => onChangeIndex(e)}
												pageIndex={feedbackIndex}
											/>
										</div>
									</div>
								</div>
							</Card>
						</div>
					</div>

					<Modal
						title="Xem trước"
						visible={showPreview}
						confirmLoading={false}
						className="vc-store_modal"
						footer={null}
						onCancel={() => setShowPreview(false)}
						width={600}
					>
						<div className="m-0 row vc-store-space-beetween">
							{/* <video style={{ width: '100%' }} src={currentVideo} controls>
						<track default kind="captions" />
					</video> */}
							<Iframe iframe={currentVideo} allow="autoplay" />
						</div>

						<CourseDetailsPreview videoPreView={videoPreView} onClick={handlePlayVideo} />
					</Modal>

					<Modal
						title="Thêm vào giỏ hàng"
						visible={showModal}
						confirmLoading={false}
						className="vc-store_modal"
						footer={null}
						onCancel={() => setShowModal(false)}
						width={500}
					>
						<div className="m-0 row vc-store-center vc-store-space-beetween">
							<div className="m-0 row vc-store-center">
								<i className="fas fa-check-circle vc-store_modal_icon"></i>
								<span className="vc-store_modal_title">Thêm thành công</span>
							</div>
							<a href="/cart/shopping-cart">
								<button type="button" className="btn btn-primary">
									Đến giỏ hàng
								</button>
							</a>
						</div>
					</Modal>
				</div>
			</div>
		</>
	);
};

VideoCourseDetailF.propTypes = {};

export default VideoCourseDetailF;
