import {Card} from 'antd';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
	branchApi,
	checkRoomApi,
	checkTeacherApi,
	curriculumApi,
	gradeApi,
	lessonApi,
	programApi,
	roomApi,
	studyDayApi,
	studyTimeApi,
	userInformationApi,
} from '~/apiBase';
import CreateCourseForm from '~/components/Global/CreateCourse/CreateCourseForm/CreateCourseForm';
import SaveCreateCourse from '~/components/Global/CreateCourse/SaveCreateCourse';
import TitlePage from '~/components/TitlePage';
import {useWrap} from '~/context/wrap';
import CreateCourseCalendar from './Calendar/CreateCourseCalendar';
import Schedule from './Schedule/Schedule';
import ScheduleItem from './Schedule/ScheduleItem';
import ScheduleList from './Schedule/ScheduleList';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.

// ------------ MAIN COMPONENT ------------------
const fmSelectArr = (arr, title, value, option = null) =>
	arr.map((x) => ({
		title: x[title],
		value: x[value],
		option: x[option],
	}));
const dayOfWeek = [
	{
		title: 'Thứ 2',
		value: 1,
	},
	{
		title: 'Thứ 3',
		value: 2,
	},
	{
		title: 'Thứ 4',
		value: 3,
	},
	{
		title: 'Thứ 5',
		value: 4,
	},
	{
		title: 'Thứ 6',
		value: 5,
	},
	{
		title: 'Thứ 7',
		value: 6,
	},
	{
		title: 'Chủ nhật',
		value: 0,
	},
];
const CreateCourse = (props) => {
	// -----------STATE-----------
	// CREATE COURSE FORM STATE
	const {showNoti} = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [branchList, setBranchList] = useState<IBranch[]>([]);
	const [studyTimeList, setStudyTimeList] = useState([]);
	const [gradeList, setGradeList] = useState<IGrade[]>([]);
	const [programList, setProgramList] = useState<IProgram[]>([]);
	const [dataFetchByBranch, setDataFetchByBranch] = useState({
		userInformationList: [],
		roomList: [],
	});
	const [dataToFetchCurriculum, setDataToFetchCurriculum] = useState({
		StudyTimeID: null,
		ProgramID: null,
	});
	const [curriculumList, setCurriculumList] = useState([]);
	const stoneStudyTimeList = useRef(studyTimeList);
	//Lesson
	const [scheduleList, setScheduleList] = useState({
		schedule: [],
		endDate: '',
	});
	const [optionForSchedule, setOptionForSchedule] = useState({
		optionRoomList: [],
		optionTeacherList: [],
		optionStudyTimeList: [],
	});
	//StudyDay
	const [calendarList, setCalendarList] = useState<IStudyDay[]>([]);
	const [dateSelected, setDateSelected] = useState({
		dateString: '',
	});
	// SAVE
	const stoneDataToSave = useRef({
		BranchID: 0,
		RoomID: '',
		CurriculumID: 0,
		ProgramID: 0,
	});
	const [saveCourseInfo, setSaveCourseInfo] = useState({
		CourseName: '',
		BranchID: 0,
		GradeID: 0,
		ProgramID: 0,
		CurriculumID: 0,
		StartDay: '',
		Schedule: [],
	});

	// -----------CREATE COURSE FORM-----------
	// FETCH BRANCH, STUDY TIME, GRADE IN THE FIRST TIME
	const fetchData = async () => {
		try {
			const resArr = await Promise.all([
				branchApi.getAll({pageIndex: 1, pageSize: 9999}),
				studyTimeApi.getAll({selectAll: true}),
				gradeApi.getAll({selectAll: true}),
			]).catch((err) => console.log('fetchData - PromiseAll:', err));
			// BRANCH
			const newBranchList = fmSelectArr(
				resArr[0].data.data,
				'BranchName',
				'ID'
			);
			setBranchList(newBranchList);
			// STUDY TIME
			const newStudyTimeList = fmSelectArr(
				resArr[1].data.data,
				'Name',
				'ID',
				'Time'
			);
			stoneStudyTimeList.current = newStudyTimeList;
			setStudyTimeList(newStudyTimeList);
			// GRADE
			const newGradeList = fmSelectArr(resArr[2].data.data, 'GradeName', 'ID');
			setGradeList(newGradeList);
		} catch (error) {
			showNoti('danger', error.message);
		}
	};
	useEffect(() => {
		fetchData();
	}, []);
	// FETCH ROOM AND USER INFORMATION
	const fetchDataByBranch = async (id: number) => {
		setIsLoading({
			type: 'BranchID',
			status: true,
		});

		try {
			const params = {
				BranchID: id,
			};
			const resArr = await Promise.all([
				userInformationApi.getAllParams(params),
				roomApi.getAll(params),
			]).catch((err) => console.log('FetchDataByBranch - PromiseAll:', err));
			// USER INFORMATION
			if (resArr[0].status === 200) {
				const newUserInformationList = fmSelectArr(
					resArr[0].data.data,
					'FullNameUnicode',
					'UserInformationID'
				);
				setDataFetchByBranch((preState) => ({
					...preState,
					userInformationList: newUserInformationList,
				}));
			} else if (resArr[0].status === 204) {
				setDataFetchByBranch((preState) => ({
					...preState,
					userInformationList: [],
				}));
			}
			// ROOM
			if (resArr[1].status === 200) {
				const newRoomList = fmSelectArr(
					resArr[1].data.data,
					'RoomCode',
					'RoomID'
				);
				setDataFetchByBranch((preState) => ({
					...preState,
					roomList: newRoomList,
				}));
			} else if (resArr[1].status === 204) {
				setDataFetchByBranch((preState) => ({
					...preState,
					roomList: [],
				}));
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'BranchID',
				status: false,
			});
		}
	};
	// PROGRAM
	const fetchProgramByGrade = async (id: number) => {
		setIsLoading({
			type: 'GradeID',
			status: true,
		});

		try {
			const res = await programApi.getAll({
				GradeID: id,
			});
			if (res.status === 200) {
				const newProgramList = fmSelectArr(res.data.data, 'ProgramName', 'ID');
				setProgramList(newProgramList);
			}
			if (res.status === 204) {
				setProgramList([]);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GradeID',
				status: false,
			});
		}
	};
	// CURRICULUM
	const checkStudyTime = async (value) => {
		if (!value.length) {
			setStudyTimeList(stoneStudyTimeList.current);
			return;
		}

		if (value.length === 1) {
			const time = studyTimeList.find(
				(s) => s.value === +value.toString()
			).option;
			const newStudyTimeList = studyTimeList.filter((s) => s.option === time);
			setStudyTimeList(newStudyTimeList);
			setOptionForSchedule({
				...optionForSchedule,
				optionStudyTimeList: newStudyTimeList,
			});
		}
		// const res = await checkStudyTimeApi.check({
		// Before: prevStudyTime.current,
		// After: value.join(','),
		// });
	};
	// GET ENOUGH 2 VALUE TO GET CURRICULUM - NEED PROGRAM ID - STUDY TIME ID
	const getValueBeforeFetchCurriculum = async (key: string, value: number) => {
		setDataToFetchCurriculum((prevState) => ({
			...prevState,
			[key]: value,
		}));
	};
	const fetchCurriculum = async () => {
		setIsLoading({
			type: 'ProgramID',
			status: true,
		});

		try {
			const res = await curriculumApi.getAll({
				StudyTimeID: dataToFetchCurriculum.StudyTimeID.join(','),
				ProgramID: dataToFetchCurriculum.ProgramID,
			});
			if (res.status === 200) {
				const newCurriculum = fmSelectArr(
					res.data.data,
					'CurriculumName',
					'ID'
				);
				setCurriculumList(newCurriculum);
			}
			if (res.status === 204) {
				setCurriculumList([]);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ProgramID',
				status: false,
			});
		}
	};
	useEffect(() => {
		if (dataToFetchCurriculum.ProgramID && dataToFetchCurriculum.StudyTimeID) {
			fetchCurriculum();
		}
	}, [dataToFetchCurriculum]);
	// GET COURSE
	const getCourse = async (object) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true,
		});
		try {
			stoneDataToSave.current = {
				...stoneDataToSave.current,
				RoomID: object.RoomID.join(','),
				BranchID: object.BranchID,
				CurriculumID: object.CurriculumID,
			};
			const lessonParams = {
				CurriculumnID: object.CurriculumID,
				StartDate: object.StartDay,
				StudyTimeID: object.StudyTimeID.join(','),
				RoomID: object.RoomID.join(','),
				BranchID: object.BranchID,
				DaySelected: object.DaySelected.join(','),
			};
			const studyDayParams = {
				StudyTimeID: object.StudyTimeID.join(','),
				StartDate: object.StartDay,
				DaySelected: object.DaySelected.join(','),
				RoomID: object.RoomID.join(','),
			};
			const arrRes = await Promise.all([
				lessonApi.getAll(lessonParams),
				studyDayApi.getAll(studyDayParams),
			])
				.then(([lessonList, studyDayList]) => {
					lessonList.status === 200 &&
						setScheduleList({
							schedule: lessonList.data['schedule'],
							endDate: lessonList.data['enddate'],
						});
					studyDayList.status === 200 &&
						setCalendarList(studyDayList.data.data);

					if (lessonList.status === 200 && studyDayList.status === 200) {
						checkStudyTime('');
						showNoti('success', 'Thành công');
						return true;
					}
				})
				.catch((error) => {
					error.status === 400 && showNoti('danger', 'Không tìm thấy lịch');
				});

			return arrRes;
		} catch (error) {
			showNoti('error', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false,
			});
		}
	};
	// -----------SCHEDULE-----------
	const getInfoAvailableSchedule = (obj) => {
		console.log({obj, saveCourseInfo});
		// setSaveCourseInfo(obj)
	};
	const fetchInfoAvailableSchedule = async (obj) => {
		setIsLoading({
			type: 'CHECK_SCHEDULE',
			status: true,
		});
		const {
			RoomID: RoomIdOfSchedule,
			RoomName,
			TeacherID,
			TeacherName,
			StudyTimeID,
			StudyTimeName,
			SubjectID,
		} = obj;
		const Date = moment(obj.Date).format('YYYY/MM/DD');
		const {BranchID, RoomID} = stoneDataToSave.current;
		const checkTeacherParams = {
			BranchID,
			SubjectID,
			StudyTimeID,
			Date,
		};
		const checkRoomParams = {
			BranchID,
			Rooms: RoomID,
			StudyTimeID,
			Date,
		};
		try {
			await Promise.all([
				checkTeacherApi.getAll(checkTeacherParams),
				checkRoomApi.getAll(checkRoomParams),
			])
				.then(([teacherList, roomList]) => {
					if (teacherList.status === 200) {
						const fmTeacher = teacherList.data.data.map((t) => ({
							value: t['id'],
							title: t['name'],
						}));
						setOptionForSchedule({
							...optionForSchedule,
							optionTeacherList: fmTeacher,
						});
					}
					if (teacherList.status === 204) {
						setOptionForSchedule({
							...optionForSchedule,
							optionTeacherList: [
								{
									title: TeacherName,
									value: TeacherID,
								},
							],
						});
					}
					if (roomList.status === 200) {
						const fmRoom = roomList.data.data.map((t) => ({
							value: t['id'],
							title: t['name'],
						}));
						setOptionForSchedule({
							...optionForSchedule,
							optionRoomList: fmRoom,
						});
					}
					if (roomList.status === 204) {
						setOptionForSchedule({
							...optionForSchedule,
							optionRoomList: [
								{
									title: RoomName,
									value: RoomIdOfSchedule,
								},
							],
						});
					}
					if (teacherList.status === 200 && roomList.status === 200) {
						showNoti('success', 'Thành công');
						return true;
					}
				})
				.catch((err) => console.log('FetchDataByBranch - PromiseAll:', err));
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'CHECK_SCHEDULE',
				status: false,
			});
		}
	};
	useEffect(() => {}, []);
	// -----------CALENDAR-----------
	const calendarDateFormat = (calendarArr) => {
		const {schedule} = scheduleList;

		// const scheduleDateArr = schedule.map((s) => s.date);

		// const clearDuplicateSchedule = scheduleDateArr.filter(
		// 	(d, idx) => scheduleDateArr.indexOf(d) === idx
		// );
		const scheduleHadDate = schedule.reduce((newObj, s) => {
			newObj[s.date] ? newObj[s.date].push(s) : (newObj[s.date] = [s]);
			return newObj;
		}, {});
		// console.log(scheduleHadDate);
		// const newCalendarArr = calendarArr.filter(
		// 	(c) => clearDuplicateSchedule.includes(c.Day.slice(0, 10)) === false
		// );

		const rs = calendarArr.map((c, idx) => {
			let isValid = true;
			let limit = c.Limit;
			let scheduleList = [];
			let title = `Số buổi trống: ${limit}`;
			const calendarHadSchedule = scheduleHadDate[c.Day.slice(0, 10)]?.length;
			if (calendarHadSchedule) {
				limit = c.Limit - calendarHadSchedule;
				scheduleList = scheduleHadDate[c.Day.slice(0, 10)];
				title = 'Click để xem chi tiết';
			}
			if (!limit) {
				isValid = false;
			}
			// if (c.Day === dateSelected.dayString) {
			// 	limit = dateSelected.dayLimit - dateSelected.scheduleList.length;
			// }
			return {
				id: idx + 1,
				title: title,
				start: moment(c.Day).toDate(),
				end: moment(c.Day).toDate(),
				resource: {
					dateString: c.Day,
					valid: isValid,
					limit: c.Limit,
					scheduleList,
				},
			};
		});
		return rs;
	};
	// calendar obj demo
	// {
	// 	id: 1,
	// 	title: 'Khóa học 1',
	// 	start: new Date(2021, 6, 3),
	// 	end: new Date(2021, 6, 3),
	// 	resource: {
	// 		center: 'center-1',
	// 		academy: 'academy-1',
	// 		room: 'room-1',
	// 		session: 'session-1',
	// 		book: 'book-1',
	// 		block: 'block-1',
	// 		classTT: 'classTT-1',
	// 	},
	// },
	// OBJ FROM API
	// {
	// "Day": "2021-07-26T00:00:00",
	// "Limit": 2
	// }
	const onSelectDate = async (vl) => {
		setDateSelected({
			dateString: vl.resource.dateString,
		});
	};
	// useEffect(() => {
	// 	console.log(dateSelected);
	// }, [dateSelected]);
	const onSelectSchedule = (vl) => {
		if (!dateSelected.dateString) {
			showNoti('danger', 'Bạn cần chọn ngày');
			return false;
		}
		console.log(vl);
		//
		// const newScheduleList = [...dateSelected.scheduleList];
		// const isScheduleAlready = newScheduleList.findIndex((s) => s.ID === vl.ID);
		// //
		// if (isScheduleAlready >= 0) {
		// 	newScheduleList.splice(isScheduleAlready, 1);
		// } else {
		// 	newScheduleList.push(vl);
		// }
		// //
		// if (newScheduleList.length > dateSelected.dayLimit) {
		// 	showNoti('danger', `Không được chọn quá ${dateSelected.dayLimit} ca`);
		// 	return false;
		// }
		// //
		// const newDaySelected = {
		// 	...dateSelected,
		// 	scheduleList: newScheduleList,
		// };
		// setDateSelected(newDaySelected);
		// return true;
	};
	// -----------SAVE COURSE-----------
	const saveCourse = () => {
		console.log(123);
	};
	return (
		<div className="create-course">
			<TitlePage title="Tạo khóa học" />
			<div className="row">
				<div className="col-md-8 col-12">
					<Card
						title="Sắp xếp lịch học"
						extra={
							<div className="btn-page-course">
								<CreateCourseForm
									isLoading={isLoading}
									isUpdate={false}
									handleGetCourse={getCourse}
									//
									optionBranchList={branchList}
									optionStudyTimeList={studyTimeList}
									optionGradeList={gradeList}
									optionFetchByBranch={dataFetchByBranch}
									optionProgramList={programList}
									optionCurriculum={curriculumList}
									optionDayOfWeek={dayOfWeek}
									handleCheckStudyTime={checkStudyTime}
									handleFetchDataByBranch={fetchDataByBranch}
									handleFetchProgramByGrade={fetchProgramByGrade}
									handleGetValueBeforeFetchCurriculum={
										getValueBeforeFetchCurriculum
									}
								/>
								<SaveCreateCourse />
							</div>
						}
					>
						<div className="wrap-calendar">
							<CreateCourseCalendar
								eventList={calendarDateFormat(calendarList)}
								handleSelectDate={onSelectDate}
								dateSelected={dateSelected}
							/>
						</div>
					</Card>
				</div>
				<div className="col-md-4 col-12">
					<Schedule>
						<ScheduleList>
							{scheduleList['schedule'].map((s, idx) => (
								<ScheduleItem
									isLoading={isLoading}
									key={idx}
									scheduleObj={s}
									handleSelectSchedule={onSelectSchedule}
									handleGetInfoAvailableSchedule={getInfoAvailableSchedule}
									handleFetchInfoAvailableSchedule={fetchInfoAvailableSchedule}
									//
									optionForScheduleList={optionForSchedule}
								/>
							))}
						</ScheduleList>
					</Schedule>
				</div>
			</div>
		</div>
	);
};

export default CreateCourse;
