import { Card } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { scheduleZoomApi } from '~/apiBase';
import TitlePage from '~/components/TitlePage';
import { useDebounce } from '~/context/useDebounce';
import { useWrap } from '~/context/wrap';
import CDCalendar from '../CourseList/CourseListDetail/CourseDetailCalendar/Calendar';

const ScheduleStudyStudent = () => {
	const { showNoti } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [scheduleStudentList, setScheduleStudentList] = useState<IScheduleZoom[]>([]);
	const [filters, setFilters] = useState({
		StartTime: moment().startOf('month').format('YYYY/MM/DD'),
		EndTime: moment().endOf('month').format('YYYY/MM/DD')
	});

	const fetchScheduleStudyStudent = async () => {
		try {
			setIsLoading({
				type: 'FETCH_SCHEDULE_STUDENT',
				status: true
			});
			const res = await scheduleZoomApi.getAll(filters);
			if (res.status === 200) {
				setScheduleStudentList(res.data.data);
			}
			if (res.status === 204) {
				showNoti('danger', 'Lịch dạy trống');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_SCHEDULE_STUDENT',
				status: false
			});
		}
	};

	useEffect(() => {
		fetchScheduleStudyStudent();
	}, [filters]);

	const fetchNewScheduleList = (date) => {
		let fmDate;
		if (date?.start && date?.end) {
			fmDate = {
				StartTime: moment(date.start).format('YYYY/MM/DD'),
				EndTime: moment(date.end).format('YYYY/MM/DD')
			};
		}
		if (Array.isArray(date) && date.length >= 1) {
			fmDate = {
				StartTime: moment(date[0]).format('YYYY/MM/DD'),
				EndTime: moment(date[date.length - 1]).format('YYYY/MM/DD')
			};
		}
		setFilters(fmDate || { ...filters });
	};
	const debounceFetchScheduleList = useDebounce(fetchNewScheduleList, 200, []);

	const onHandleZoom = async (data: { idx: number; btnID: number; btnName?: string; scheduleID: number }) => {
		try {
			//0 - ,1-Bắt đầu , 2-Vào lớp học, 3-Kết thúc
			const { idx, btnID, btnName, scheduleID } = data;
			if (btnID === 2 && scheduleID) {
				window.open(`/course/zoom-view/${scheduleID}`);
			}
		} catch (error) {
			showNoti('danger', error.message);
			console.log('fetchConfigAccount', error.message);
		}
	};

	// CALENDAR FORMAT
	const calendarFm = (calendarArr: IScheduleZoom[]) => {
		const rs = calendarArr.map((c, idx) => {
			const {
				ID,
				Title,
				CourseID,
				BranchName,
				RoomName,
				SubjectName,
				StartTime,
				EndTime,
				//
				ButtonID,
				ButtonName,
				//
				IsExam,
				ExamTopicID,
				CurriculumsDetailID,
				TeacherAttendanceID
			} = c;
			const studyTimeStart = moment(StartTime).format('HH:mm');
			const studyTimeEnd = moment(EndTime).format('HH:mm');
			const studyTime = `${studyTimeStart} - ${studyTimeEnd}`;

			return {
				id: +ID,
				title: '',
				start: moment(StartTime).toDate(),
				end: moment(EndTime).toDate(),
				CurriculumsDetailID: CurriculumsDetailID,
				resource: {
					ID,
					CourseID,
					CourseName: Title,
					RoomName,
					BranchName,
					SubjectName,
					//
					StudyTimeName: studyTime,
					//
					ButtonID,
					ButtonName,
					idx,
					IsExam,
					ExamTopicID,
					CurriculumsDetailID,
					TeacherAttendanceID
				}
			};
		});
		return rs;
	};

	return (
		<div className="row">
			<TitlePage title="Lịch học của học viên" />
			<div className="col-12">
				<Card>
					<CDCalendar
						isLoaded={isLoading.type === 'FETCH_SCHEDULE_STUDENT' && isLoading.status ? false : true}
						eventList={calendarFm(scheduleStudentList)}
						isStudyZoom={true}
						fetchStudyZoom={debounceFetchScheduleList}
						handleStudyZoom={onHandleZoom}
					/>
				</Card>
			</div>
		</div>
	);
};
export default ScheduleStudyStudent;
