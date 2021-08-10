import moment from 'moment';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {courseDetailApi} from '~/apiBase';
import {useWrap} from '~/context/wrap';
import CDCalendar from './Calendar';

const CourseDetailCalendar = () => {
	const router = useRouter();
	const {slug: ID} = router.query;
	const {showNoti} = useWrap();
	const [calendarList, setCalendarList] = useState<ICourseDetail[]>([]);

	// -----------CALENDAR-----------
	const calendarDateFormat = (calendarArr: ICourseDetail[]) => {
		const rs = calendarArr.map((c, idx) => {
			// [
			// 	{
			// 		ID: 97,
			// 		CourseID: 9,
			// 		CourseName:
			// 			'[Mona Media 1] - [Chương trình học 2] - [02/08/212021] - [Ca 20:00 - 21:00, Ca 07:00 - 08:00] - [P2, P1]',
			// 		BranchID: 1043,
			// 		BranchName: 'Mona Media 1',
			// 		RoomName: 'Phòng 2',
			// 		StartTime: '2021-08-02T07:00:00',
			// 		EndTime: '2021-08-02T08:00:00',
			// 		TeacherName: 'Hữu Minh Teacher 10',
			// 		LinkDocument: null,
			// 		SubjectName: 'Sinh',
			// 	},
			// ];
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
	// calendarDateFormat(calendarList);
	const fetchCalendarList = async () => {
		try {
			const res = await courseDetailApi.getByID(ID);
			res.status === 200 && setCalendarList(res.data.data);
			showNoti('success', res.data.message);
		} catch (error) {
			showNoti('error', error.message);
		}
	};

	useEffect(() => {
		fetchCalendarList();
	}, []);

	return (
		<>
			<CDCalendar eventList={calendarDateFormat(calendarList)} />
		</>
	);
};
export default CourseDetailCalendar;
