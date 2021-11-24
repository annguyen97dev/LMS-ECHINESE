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

const initData = { CreatedBy: '', Rate: 0, Title: '', ContentFeedBack: '', UID: 0, CreatedOn: '', StatusID: 3 };

const VideoCourseDetail = (props) => {
	// Get path and slug
	const router = useRouter();
	const slug = router.query.slug;
	let path: string = router.pathname;
	let pathString: string[] = path.split('/');
	path = pathString[pathString.length - 2];

	const { showNoti, userInformation } = useWrap();
	const [currentInfomation, setCurrentInfomation] = useState(initData);

	// CALL API UPDATE
	const updateCurrentFeedback = async (param) => {
		try {
			const res = await FeedbackApi.update(param);
			// getCurrentInfo(slug);
		} catch (error) {}
	};

	return (
		<>
			<div className="row feedback-user">
				<div className="col-md-3 col-12">
					<Card className="info-profile-left">
						<>
							{router.query.Thum == null ? (
								<img className="vc-details_thum" src="/images/logo-final.jpg" alt="icon" />
							) : (
								<img className="vc-details_thum" src={router.query.Thum.toString()} />
							)}
							<div className="vc-details_thum-mark"></div>
						</>

						<div className="row pt-4 st-fb-center">
							<div className="col-2">
								<MailOutlined />
							</div>
						</div>

						<hr />

						<div className="row">
							<ul className="list-info-bonus"></ul>
						</div>
					</Card>
				</div>

				<div className="col-md-9 col-12">
					<Card className="space-top-card">
						<div className="card-newsfeed-wrap__label">
							<div className="m-feedback st-fb-100w">
								<div className="row m-0 mb-3 st-fb-rsb st-fb-100w  m-feedback__head"></div>
							</div>
						</div>

						<hr />

						{currentInfomation.StatusID !== 3 && (
							<>
								<div className="box-comment">
									<div className="row m-0 st-fb-100w st-fb-flex-end-row"></div>
								</div>
								<hr />
							</>
						)}

						<div className="list-comment">
							<ul className="m-feedback__list-group-nf"></ul>
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
