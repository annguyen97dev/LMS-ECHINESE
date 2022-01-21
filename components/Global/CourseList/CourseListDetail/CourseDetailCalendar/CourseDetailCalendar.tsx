import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { courseDetailApi, documentScheduleApi } from '~/apiBase';
import TitlePage from '~/components/TitlePage';
import { useWrap } from '~/context/wrap';
import CDCalendar from './Calendar';

CourseDetailCalendar.propTypes = {
	courseID: PropTypes.number,
	isAdmin: PropTypes.bool
};
CourseDetailCalendar.defaultProps = {
	courseID: 0,
	isAdmin: false
};

function CourseDetailCalendar(props) {
	const { courseID: ID, isAdmin } = props;
	const { showNoti } = useWrap();
	const [calendarList, setCalendarList] = useState<ICourseDetailSchedule[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
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
				TeacherAttendanceID,
				IsExam
			} = c;
			const studyTimeStart = moment(StartTime).format('HH:mm');
			const studyTimeEnd = moment(EndTime).format('HH:mm');
			const studyTime = `${studyTimeStart} - ${studyTimeEnd}`;

			return {
				id: +ID,
				title: '',
				start: moment(StartTime).toDate(),
				end: moment(EndTime).toDate(),
				TeacherAttendanceID,
				resource: {
					ID,
					CourseID,
					RoomName,
					BranchName,
					TeacherName,
					SubjectName,
					LinkDocument,
					StudyTimeName: studyTime,
					IsExam,
					TeacherAttendanceID
				}
			};
		});
		return rs;
	};
	const fetchCalendarList = async () => {
		try {
			setIsLoading({
				type: 'FETCH_COURSE_DETAIL_CALENDAR',
				status: true
			});
			const res = await courseDetailApi.getAll({ CourseID: ID });
			if (res.status === 200) {
				setCalendarList(res.data.data);
				setIsLoaded(true);
			}
			if (res.status === 204) {
				showNoti('danger', 'Danh sách trống');
			}
		} catch (error) {
			showNoti('error', error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_COURSE_DETAIL_CALENDAR',
				status: false
			});
		}
	};

	useEffect(() => {
		fetchCalendarList();
	}, []);

	const onUploadDocument = async (data: { CourseScheduleID: number; File: Array<any> }) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		try {
			const formData = new FormData();
			const newData = {
				...data,
				File: data.File[0].originFileObj
			};
			Object.keys(newData).forEach((key) => formData.append(key, newData[key]));
			const res = await documentScheduleApi.add(formData);
			if (res.status === 200) {
				const newCalendarList = [...calendarList];
				const idx = newCalendarList.findIndex((c) => c.ID === newData.CourseScheduleID);
				newCalendarList.splice(idx, 1, {
					...newCalendarList[idx],
					LinkDocument: res.data.data.LinkDocument
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
				status: false
			});
		}
	};

	return (
		<>
			<TitlePage title="Chi tiết khóa học" />

			<div className="hide-rbc-event">
				{isAdmin ? (
					<CDCalendar
						isLoading={isLoading}
						isGetRecordList={true}
						isUploadDocument={true}
						isLoaded={isLoading.type === 'FETCH_COURSE_DETAIL_CALENDAR' && isLoading.status ? false : true}
						eventList={calendarDateFormat(calendarList)}
						handleUploadDocument={onUploadDocument}
					/>
				) : (
					<CDCalendar
						isLoading={isLoading}
						isLoaded={isLoading.type === 'FETCH_COURSE_DETAIL_CALENDAR' && isLoading.status ? false : true}
						eventList={calendarDateFormat(calendarList)}
					/>
				)}
			</div>
		</>
	);
}
export default CourseDetailCalendar;
