import {Card} from 'antd';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {courseDetailApi} from '~/apiBase';
import TitlePage from '~/components/TitlePage';
import {useWrap} from '~/context/wrap';
import CDCalendar from '../CourseList/CourseListDetail/CourseDetailCalendar/Calendar';

const ScheduleStudyTeacher = () => {
	const {showNoti} = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [scheduleTeacherList, setScheduleTeacherList] = useState<
		ICourseDetailSchedule[]
	>([]);

	const {userInformation} = useWrap();

	const fetchScheduleStudyTeacher = async () => {
		try {
			if (!userInformation) return;
			setIsLoading({
				type: 'FETCH_SCHEDULE_TEACHER',
				status: true,
			});
			const fmObj = {
				TeacherID: userInformation.UserInformationID,
			};
			const res = await courseDetailApi.getAll(fmObj);
			if (res.status === 200) {
				setScheduleTeacherList(res.data.data);
				showNoti('success', res.data.message);
			}
			if (res.status === 204) {
				showNoti('danger', 'Lịch dạy trống');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_SCHEDULE_TEACHER',
				status: false,
			});
		}
	};
	useEffect(() => {
		fetchScheduleStudyTeacher();
	}, [userInformation]);

	// CALENDAR FORMAT
	const calendarFm = (calendarArr: ICourseDetailSchedule[]) => {
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

	return (
		<div className="row">
			<TitlePage title="Lịch dạy giáo viên" />
			<div className="col-12">
				<Card>
					<CDCalendar
						isLoaded={
							isLoading.type === 'FETCH_SCHEDULE_TEACHER' && isLoading.status
								? false
								: true
						}
						eventList={calendarFm(scheduleTeacherList)}
					/>
				</Card>
			</div>
		</div>
	);
};
export default ScheduleStudyTeacher;
