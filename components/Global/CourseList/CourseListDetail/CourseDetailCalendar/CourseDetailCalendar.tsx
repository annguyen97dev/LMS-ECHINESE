import {Spin} from 'antd';
import moment from 'moment';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {courseDetailApi} from '~/apiBase';
import TitlePage from '~/components/TitlePage';
import {useWrap} from '~/context/wrap';
import CDCalendar from './Calendar';

const CourseDetailCalendar = () => {
	const router = useRouter();
	const {slug: ID} = router.query;
	const {showNoti} = useWrap();
	const [calendarList, setCalendarList] = useState<ICourseDetail[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);
	// -----------CALENDAR-----------
	const calendarDateFormat = (calendarArr: ICourseDetail[]) => {
		const rs = calendarArr.map((c, idx) => {
			const {
				ID,
				CourseID,
				CourseName,
				RoomName,
				BranchName,
				TeacherName,
				SubjectName,
				StartTime,
				EndTime,
			} = c;
			const studyTimeStart = moment(StartTime).format('HH:mm');
			const studyTimeEnd = moment(EndTime).format('HH:mm');
			const studyTime = `${studyTimeStart} - ${studyTimeEnd}`;

			return {
				id: ID,
				title: CourseName,
				start: moment(StartTime).toDate(),
				end: moment(EndTime).toDate(),
				resource: {
					CourseID,
					RoomName,
					BranchName,
					TeacherName,
					SubjectName,
					//
					studyTime,
				},
			};
		});
		return rs;
	};
	const fetchCalendarList = async () => {
		try {
			const res = await courseDetailApi.getAll({CourseID: ID});
			if (res.status === 200) {
				setCalendarList(res.data.data);
				setIsLoaded(true);
				showNoti('success', res.data.message);
			}
		} catch (error) {
			showNoti('error', error.message);
		}
	};

	useEffect(() => {
		fetchCalendarList();
	}, []);

	return (
		<>
			<TitlePage title="Chi tiết khóa học" />
			<CDCalendar
				isLoaded={isLoaded}
				eventList={calendarDateFormat(calendarList)}
			/>
		</>
	);
};
export default CourseDetailCalendar;
