import moment from 'moment';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {courseDetailApi, documentScheduleApi} from '~/apiBase';
import TitlePage from '~/components/TitlePage';
import {useWrap} from '~/context/wrap';
import CDCalendar from './Calendar';

const CourseDetailCalendar = () => {
	const router = useRouter();
	const {slug: ID} = router.query;
	const {showNoti} = useWrap();
	const [calendarList, setCalendarList] = useState<ICourseDetailSchedule[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	// -----------CALENDAR-----------
	const calendarDateFormat = (calendarArr: ICourseDetailSchedule[]) => {
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
				LinkDocument,
			} = c;
			const studyTimeStart = moment(StartTime).format('HH:mm');
			const studyTimeEnd = moment(EndTime).format('HH:mm');
			const studyTime = `${studyTimeStart} - ${studyTimeEnd}`;

			return {
				id: +ID,
				title: '',
				start: moment(StartTime).toDate(),
				end: moment(EndTime).toDate(),
				resource: {
					ID,
					CourseID,
					RoomName,
					BranchName,
					TeacherName,
					SubjectName,
					LinkDocument,
					//
					StudyTimeName: studyTime,
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

	const onUploadDocument = async (data: {
		CourseScheduleID: number;
		File: Array<any>;
	}) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true,
		});
		try {
			const formData = new FormData();
			const newData = {
				...data,
				File: data.File[0].originFileObj,
			};
			Object.keys(newData).forEach((key) => formData.append(key, newData[key]));
			const res = await documentScheduleApi.add(formData);
			if (res.status === 200) {
				const newCalendarList = [...calendarList];
				const idx = newCalendarList.findIndex(
					(c) => c.ID === newData.CourseScheduleID
				);
				newCalendarList.splice(idx, 1, {
					...newCalendarList[idx],
					LinkDocument: res.data.data.LinkDocument,
				});
				setCalendarList(newCalendarList);
				showNoti('success', res.data.message);
			}
			return res;
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false,
			});
		}
	};

	return (
		<>
			<TitlePage title="Chi tiết khóa học" />
			<CDCalendar
				isLoading={isLoading}
				isUploadDocument={true}
				isLoaded={isLoaded}
				eventList={calendarDateFormat(calendarList)}
				handleUploadDocument={onUploadDocument}
			/>
		</>
	);
};
export default CourseDetailCalendar;
