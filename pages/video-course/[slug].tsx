import { Card, Input, Modal, Rate, Spin } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useRef } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { studentApi, VideoCourseListApi, VideoCourseOfStudent } from '~/apiBase';
import { VideoCourseDetailApi } from '~/apiBase/video-course-details';
import { VideoCourseCardApi } from '~/apiBase/video-course-store';
import LayoutBase from '~/components/LayoutBase';
import CourseDetailsContent from '~/components/VideoCourse/CourseDetailsContent/CourseDetailsContent';
import CourseDetailsFeedBack from '~/components/VideoCourse/CourseDetailsFeedBack';
import CourseDetailsPreview from '~/components/VideoCourse/CourseDetailsPreview';
import ModalAddStudentTakedVideoCourse from '~/components/VideoCourse/ModalAddStudent';
import { useWrap } from '~/context/wrap';
import { parseToMoney } from '~/utils/functions';

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

const VideoCourseDetail = (props) => {
	const router = useRouter();
	const videoStudy = useRef(null);

	const slug = router.query.slug;
	let path: string = router.pathname;
	let pathString: string[] = path.split('/');
	path = pathString[pathString.length - 2];

	const [isLoading, setLoading] = useState(true);
	const { showNoti, getTitlePage, handleReloadNoti, userInformation, pageSize } = useWrap();
	const [details, setDetails] = useState(initDetails);
	const [content, setContent] = useState({});
	const [userEmail, setUserEmail] = useState([]);
	const [userName, setUserName] = useState([]);
	const [userPhone, setUserPhone] = useState([]);
	// @ts-ignore
	const [registers, setRegisters] = useState<IVideoCourseOfStudentAdmin[]>([]);

	const [showPreview, setShowPreview] = useState(false);

	const [buyLoading, setByLoading] = useState(false);
	const [buyNowLoading, setByNowLoading] = useState(false);

	useEffect(() => {
		getTitlePage('Khóa học video');
		if (userInformation !== null) {
			getCourseDetails(slug);
		}
		getCourseRegisters();
	}, [userInformation]);

	const fetchDataUser = async () => {
		(async () => {
			try {
				const res = await studentApi.getAll({
					pageIndex: 1,
					pageSize: 99999
				});
				if (res.status == 200) {
					let tempName = [];
					let tempPhone = [];
					let tempEmail = [];
					res.data.data.forEach((item) => {
						tempName.push({ title: item.FullNameUnicode, value: item.UserInformationID });
						tempPhone.push({ title: item.Mobile, value: item.UserInformationID });
						tempEmail.push({ title: item.Email, value: item.UserInformationID });
					});
					setUserName(tempName);
					setUserPhone(tempPhone);
					setUserEmail(tempEmail);
				}
			} catch (err) {
				showNoti('danger', err.message);
			}
		})();
	};

	useEffect(() => {
		fetchDataUser();
	}, []);

	// CALL API DETAILS
	const getCourseDetails = async (param) => {
		try {
			const res = await VideoCourseDetailApi.getDetails(param);
			res.status == 200 && (setDetails(res.data.data), getCourseContent(res.data.data.CurriculumID));
		} catch (error) {
			console.log(error);
		}
	};

	const getCourseRegisters = async () => {
		try {
			const res = await VideoCourseOfStudent.getAllAdmin({ pageIndex: 1, pageSize: pageSize, VideoCourseID: slug });
			res.status == 200 && (setRegisters(res.data.data), console.log('data video course of student', res.data.data));
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
			<div className="row">
				<div className="col-12 col-md-4 col-lg-3" style={{ zIndex: 9 }}>
					<Card loading={isLoading} className="vc-details p-0">
						<div
							onClick={() => {
								videoPreView.length > 0 ? setShowPreview(true) : showNoti('danger', 'Không có video xem trước');
							}}
							className="vc-details_main-thum"
						>
							{router.query.Thum == null || router.query.Thum == undefined || router.query.Thum == '' ? (
								<img className="vc-details_thum" src="/images/logo.jpg" />
							) : (
								<img className="vc-details_thum" src={router.query.Thum.toString()} />
							)}
							<div className="vc-details_thum-mark">
								<i className="far fa-play-circle vc-details_icon-play"></i>
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

								{userInformation &&
									(userInformation.RoleID === 1 ||
										userInformation.UserInformationID.toString() === router.query.TeacherID) && (
										<Link
											href={{
												pathname: '/video-learning',
												query: {
													ID: router.query.CategoryID,
													course: slug,
													complete: 0 + '/' + 0,
													name: details.VideoCourseName
												}
											}}
										>
											<button className="btn btn-warning" type="button" style={{ width: '100%' }}>
												Xem khóa học
											</button>
										</Link>
									)}

								{userInformation !== null && userInformation?.RoleID !== 1 && userInformation?.RoleID !== 2 && (
									<>
										{activing ? (
											<>
												<Input
													value={code}
													onChange={(e) => setCode(e.target.value)}
													placeholder="Mã kích hoạt"
													style={{ height: 36, borderRadius: 6 }}
												/>
												<button
													onClick={() => handleActive({ VdieoCourseID: slug, ActiveCode: code })}
													className="btn btn-warning btn-add mt-2"
												>
													Kích hoạt {activeLoading && <Spin className="loading-base" />}
												</button>
												<button onClick={() => setActiving(false)} className="btn btn-primary btn-add mt-2">
													Huỷ
												</button>
											</>
										) : (
											<>
												<button
													onClick={(e) => {
														e.stopPropagation();
														addToCard(1);
													}}
													className="btn btn-primary btn-add"
												>
													Thêm vào giỏ {buyLoading && <Spin className="loading-base" />}
												</button>

												{router.query.Active == 'activated' ? (
													<Link
														href={{
															pathname: '/video-learning',
															query: {
																ID: slug,
																course: slug,
																complete: 0 + '/' + 0,
																name: details.VideoCourseName
															}
														}}
													>
														<button className="btn btn-dark btn-add mt-2">Xem khóa học</button>
													</Link>
												) : (
													<button onClick={() => setActiving(true)} className="btn btn-warning btn-add mt-2">
														Kích hoạt
													</button>
												)}
												<button
													onClick={(e) => {
														e.stopPropagation();
														addToCard(0);
													}}
													className="btn btn-light btn-add mt-2"
												>
													Mua ngay {buyNowLoading && <Spin className="loading-base" />}
												</button>
											</>
										)}
									</>
								)}
							</div>
						</div>

						{userInformation && (userInformation.RoleID === 1 || userInformation.RoleID === 2 || userInformation.RoleID === 5) && (
							<div className="registers">
								<div className="d-flex justify-content-between align-items-center">
									<h6>Học viên đã đăng kí</h6>
									<ModalAddStudentTakedVideoCourse
										userEmail={userEmail}
										userName={userName}
										userPhone={userPhone}
										CourseID={Number(slug)}
										getCourseRegisters={getCourseRegisters}
									/>
								</div>
								{registers.map((item, index) => {
									return (
										<div className="row mb-2" key={index}>
											<div className="col-2 col-md-3 register-avatar mb-0">
												<img src="/images/user.png" alt="user image" style={{ width: 40, height: 40 }} />
											</div>
											<div className="col-10 col-md-9 register-info pl-2 pl-md-1">
												<p className="mb-1">{item.StudentName}</p>
												<p>{item.Email}</p>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</Card>
				</div>

				<div className="col-12 col-md-8 col-lg-9" style={{ zIndex: 9 }}>
					<Card loading={isLoading} className="space-top-card vc-details_main">
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
		</>
	);
};

VideoCourseDetail.propTypes = {};
VideoCourseDetail.layout = LayoutBase;

export default VideoCourseDetail;
