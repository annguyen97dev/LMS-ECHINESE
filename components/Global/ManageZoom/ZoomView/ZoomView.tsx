import { Spin } from 'antd';
import { signIn, useSession } from 'next-auth/client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { scheduleZoomApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';

function ZoomView() {
	const router = useRouter();
	const { slug: ScheduleID } = router.query;
	const [session, loading] = useSession();
	let path: string = router.pathname;

	const [dataZoom, setDataZoom] =
		useState<{
			apiKey: string;
			signature: string;
			meetingNumber: string;
			passWord: string;
			userName: string;
		}>(null);

	const { userInformation } = useWrap();

	const fetchInfoRoomZoom = async () => {
		try {
			if (!userInformation) return;
			const parseID = parseInt(ScheduleID.toString());
			const res = await scheduleZoomApi.getById(parseID);
			if (res.status === 200) {
				const { ZoomRoomID, ZoomRoomPass, SignatureTeacher, SignatureStudent, ApiKey } = res.data.data;
				setDataZoom({
					apiKey: ApiKey,
					signature:
						SignatureTeacher && SignatureStudent ? (userInformation.RoleID === 2 ? SignatureTeacher : SignatureStudent) : '',
					meetingNumber: ZoomRoomID,
					passWord: ZoomRoomPass,
					userName: userInformation.FullNameUnicode
				});
			}
		} catch (error) {
			console.log('fetchInfoRoomZoom', error.message);
		}
	};

	useEffect(() => {
		fetchInfoRoomZoom();
	}, [userInformation]);

	useEffect(() => {
		if (typeof session !== 'undefined') {
			if (session == null) {
				// console.log("Test path: ", path.search("signin") < 0);
				if (path.search('signin') < 0) {
					signIn();
				}
			}
		}
	}, [session]);

	const initZoom = async () => {
		if (!dataZoom) return;
		const module = await import('@zoomus/websdk');
		// DECLARE MODULE
		const { ZoomMtg } = module;
		ZoomMtg.setZoomJSLib('https://source.zoom.us/2.1.1/lib', '/av');
		ZoomMtg.preLoadWasm();
		ZoomMtg.prepareWebSDK();

		// SHOW LAYOUT ZOOM
		document.getElementById('zmmtg-root')?.setAttribute('style', 'display:block;');
		let leaveUrl = 'http://localhost:3000/';
		if (typeof window !== 'undefined') {
			leaveUrl = window.location.origin;
		}
		// INIT MEETING
		ZoomMtg.init({
			leaveUrl,
			isSupportAV: true,
			success: (success) => {
				// JOIN MEETING
				console.log('ZoomMtg.init', success);
				ZoomMtg.join({
					...dataZoom,
					success: (success) => {
						console.log('ZoomMtg.join', success);
					},
					error: (error) => {
						console.log('ZoomMtg.join', error);
					}
				});
				// ZoomMtg.inMeetingServiceListener('onUserJoin', function (data) {
				// 	console.log('onUserJoin', data);
				// });
				// ZoomMtg.inMeetingServiceListener('onUserLeave', function (data) {
				// 	console.log('onUserLeave', data);
				// });
				// ZoomMtg.inMeetingServiceListener(
				// 	'onUserIsInWaitingRoom',
				// 	function (data) {
				// 		console.log('onUserIsInWaitingRoom', data);
				// 	}
				// );
				// ZoomMtg.endMeeting({
				// 	success: (success) => {
				// 		console.log('endMeeting', success);
				// 	},
				// 	error: (error) => {
				// 		console.log(error);
				// 	},
				// });
				// ZoomMtg.leaveMeeting({
				// 	success: (success) => {
				// 		console.log('leaveMeeting', success);
				// 	},
				// 	error: (error) => {
				// 		console.log(error);
				// 	},
				// });
			},
			error: (error) => {
				console.log('ZoomMtg.init', error);
			}
		});
	};

	useEffect(() => {
		initZoom();
	}, [dataZoom]);

	return (
		<>
			<Head>
				<link type="text/css" rel="stylesheet" href="https://source.zoom.us/2.1.1/css/bootstrap.css" />
				<link type="text/css" rel="stylesheet" href="https://source.zoom.us/2.1.1/css/react-select.css" />
			</Head>
			<div className="zoom-view" style={{ height: '100vh', width: '100vw', position: 'relative' }}>
				<Spin size="large" />
			</div>
		</>
	);
}
export default ZoomView;
