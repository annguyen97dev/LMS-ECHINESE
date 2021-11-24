import PropTypes from 'prop-types';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, Avatar, Rate } from 'antd';
import { useWrap } from '~/context/wrap';
import ReactHtmlParser from 'react-html-parser';
import EditorSimple from '~/components/Elements/EditorSimple';

import { UserOutlined, DeploymentUnitOutlined, WhatsAppOutlined, MailOutlined, AimOutlined } from '@ant-design/icons';
// import Editor from "~/components/Elements/Editor";
import CommentBox from '~/components/Elements/CommentBox';
import LayoutBase from '~/components/LayoutBase';
import { FeedbackApi, studentApi } from '~/apiBase';
import { FeedbackReplyApi } from '~/apiBase/feed-back/feedback-reply';
import { parseToMoney } from '~/utils/functions';
import { VideoCourseDetailApi } from '~/apiBase/video-course-details';
import CourseDetailsContent from '~/components/VideoCourse/CourseDetailsContent/CourseDetailsContent';

const initDetails = {
	// VideoCourseID: 0,
	VideoCourseName: '',
	// ImageThumbnails: '',
	Slogan: '',
	// Requirements: '',
	// Description: '',
	// ResultsAchieved: '',
	// CourseForObject: '',
	TotalRating: 0,
	RatingNumber: 0,
	TotalStudent: 0,
	// CreatedOn: '',
	CreatedBy: ''
	// CourseInFo: ''
};

const VideoCourseDetail = (props) => {
	// Get path and slug
	const router = useRouter();
	const slug = router.query.slug;
	let path: string = router.pathname;
	let pathString: string[] = path.split('/');
	path = pathString[pathString.length - 2];

	const [isLoading, setLoading] = useState(true);
	const { showNoti, userInformation } = useWrap();
	const [currentInfomation, setCurrentInfomation] = useState({});
	const [details, setDetails] = useState(initDetails);
	const [content, setContent] = useState({});

	useEffect(() => {
		getCourseDetails(slug);
		getCourseContent(slug);
	}, []);

	// CALL API DETAILS
	const getCourseDetails = async (param) => {
		try {
			const res = await VideoCourseDetailApi.getDetails(param);
			res.status == 200 && setDetails(res.data.data);
		} catch (error) {
			console.log(error);
		}
	};

	// CALL API GET CONTENT
	const getCourseContent = async (param) => {
		try {
			const res = await VideoCourseDetailApi.getContent(param);
			res.status == 200 && setContent(res.data.data);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	console.log('router.query.Active : ', router.query.Active);

	return (
		<>
			<div className="row feedback-user">
				<div className="col-md-3 col-12">
					<Card className="info-profile-left vc-details">
						<div className="vc-details_main-thum">
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
								<h2>{parseToMoney(router.query.Sell)}đ</h2>
								<h6
									style={{
										textDecorationLine: 'line-through',
										marginTop: 5,
										marginBottom: 15
									}}
								>
									Giá gốc: {parseToMoney(router.query.Original)}đ
								</h6>

								<button className="btn btn-primary btn-add">Thêm vào giỏ</button>

								{router.query.Active == 'notactivated' ? (
									<button className="btn btn-warning btn-add mt-2">Kích hoạt</button>
								) : (
									<button className="btn btn-dark btn-add mt-2">Xem khóa học</button>
								)}
								<button className="btn btn-light btn-add mt-2">Mua ngay</button>
							</div>
						</div>

						<hr />
						<div className="row">
							<ul className="list-info-bonus"></ul>
						</div>
					</Card>
				</div>

				<div className="col-md-9 col-12">
					<Card loading={isLoading} className="space-top-card vc-details_main">
						<div className="card-newsfeed-wrap__label">
							<div className="m-feedback st-fb-100w">
								<div className="m-0 mb-3 st-fb-rsb st-fb-100w m-feedback__head header">
									<span className="name">{details.VideoCourseName}</span>
									<span className="slogan mt-2">
										{details.Slogan}
										Slogan
									</span>
									<div className="row m-0 center-row mt-2">
										<Rate disabled value={details.RatingNumber} className="rate" />
										<span className="total-student ml-3">({details.TotalRating} lượt đánh giá)</span>
										<span className="total-student ml-3">{details.TotalStudent} học sinh</span>
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
									{/* ResultsAchieved */}
									<span className="slogan">
										<i className="fas fa-check mr-3"></i>
										Bạn cần một khoá học ReactJS ngắn gọn, tập trung vào thực hành và kinh nghiệm thực chiến. Bạn mới
										tìm hiểu về ReactJS, giờ muốn hiểu rõ hơn về nó.
									</span>

									<span className="title">Khóa học này có gì?</span>
									{/* ResultsAchieved */}
									<span className="slogan">
										<i className="fas fa-check mr-3"></i>
										Kiến thức nền tảng của ReactJS. Làm giao diện nhanh và đơn giản với Material UI. Thiết kế và triển
										khai API cho một dự án thực tế
									</span>

									<span className="title">Nội dung khóa học</span>
									<span className="slogan">
										<i className="fas fa-check mr-3"></i>
										Kiến thức nền tảng của ReactJS. Làm giao diện nhanh và đơn giản với Material UI. Thiết kế và triển
										khai API cho một dự án thực tế
									</span>
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
					</Card>
				</div>
			</div>
		</>
	);
};

VideoCourseDetail.propTypes = {};

VideoCourseDetail.layout = LayoutBase;

export default VideoCourseDetail;
