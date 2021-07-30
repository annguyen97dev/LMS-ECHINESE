import {Card} from 'antd';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
	branchApi,
	checkRoomApi,
	checkStudyTimeApi,
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
import {courseApi} from '~/apiBase/course/course';
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
const fmSelectArr = (arr, title, value, options = []) =>
	arr.map((x) => ({
		title: x[title],
		value: x[value],
		options: options.reduce((obj, o) => ({...obj, [o]: x[o]}), {}),
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
	const stonePrevStudyTimeList = useRef(null);
	const prevStudyTime = useRef('');
	//Lesson
	const [scheduleList, setScheduleList] = useState({
		available: [],
		unavailable: [],
		endDate: '',
	});
	const [optionForSchedule, setOptionForSchedule] = useState({
		optionStudyTimeList: [],
		list: [
			{
				optionRoomList: [],
				optionTeacherList: [],
			},
		],
	});
	//StudyDay
	const [calendarList, setCalendarList] = useState<IStudyDay[]>([]);
	const [dateSelected, setDateSelected] = useState({
		dateString: '',
	});
	// SAVE
	const [isSave, setIsSave] = useState(false);
	const stoneDataToSave = useRef({
		BranchID: 0,
		RoomID: '',
		CurriculumID: 0,
		ProgramID: 0,
		StartDay: '',
		GradeID: 0,
		DaySelected: '',
		StudyTimeID: '',
	});
	const [saveCourseInfo, setSaveCourseInfo] = useState({
		CourseName: '',
		BranchID: 0,
		BranchName: '',
		GradeID: 0,
		RoomID: '',
		RoomName: '',
		StudyTimeID: '',
		StudyTimeName: '',
		ProgramID: 0,
		ProgramName: '',
		CurriculumID: 0,
		CurriculumName: '',
		StartDay: '',
		DaySelected: '',
		DaySelectedName: '',
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
			const newStudyTimeList = fmSelectArr(resArr[1].data.data, 'Name', 'ID', [
				'Time',
				'TimeStart',
				'TimeEnd',
			]);
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
		const newStudyTimeList = [...studyTimeList];
		let rs;
		const studyTimeSelected = [];
		for (let i = 0; i < value.length; i++) {
			const timeObjBase = newStudyTimeList.find((s) => s.value === value[i]);
			const s1 = +timeObjBase.options.TimeStart.replace(':', '');
			const e1 = +timeObjBase.options.TimeEnd.replace(':', '');
			const t1 = +timeObjBase.options.Time;
			rs = newStudyTimeList.filter((st) => {
				const s2 = +st.options.TimeStart.replace(':', '');
				const e2 = +st.options.TimeEnd.replace(':', '');
				const t2 = +st.options.Time;
				if (timeObjBase.value === st.value) {
					studyTimeSelected.push(st);
					return st;
				}
				if (
					!(
						(s1 < s2 && e1 > e2 && s1 < e2) ||
						(s1 > s2 && e1 > e2 && s1 < e2) ||
						(s1 < s2 && e1 < e2 && e1 > s2) ||
						(s1 > s2 && e1 < e2)
					) &&
					t1 === t2
				) {
					return st;
				}
			});
		}
		setStudyTimeList(rs);
		setOptionForSchedule({
			...optionForSchedule,
			optionStudyTimeList: studyTimeSelected,
		});
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
			const {
				RoomID,
				BranchID,
				CurriculumID,
				StartDay: StartDate,
				StudyTimeID,
				DaySelected,
				ProgramID,
				GradeID,
			} = object;
			stoneDataToSave.current = {
				BranchID,
				RoomID: RoomID.join(','),
				CurriculumID,
				ProgramID,
				GradeID,
				StartDay: StartDate,
				DaySelected: DaySelected.join(','),
				StudyTimeID: StudyTimeID.join(','),
			};
			const lessonParams = {
				CurriculumnID: CurriculumID,
				StartDate,
				StudyTimeID: StudyTimeID.join(','),
				RoomID: RoomID.join(','),
				BranchID,
				DaySelected: DaySelected.join(','),
			};
			const studyDayParams = {
				StudyTimeID: StudyTimeID.join(','),
				StartDate,
				DaySelected: DaySelected.join(','),
				RoomID: RoomID.join(','),
			};
			const arrRes = await Promise.all([
				lessonApi.getAll(lessonParams),
				studyDayApi.getAll(studyDayParams),
			])
				.then(([lessonList, studyDayList]) => {
					if (lessonList.status === 200) {
						setScheduleList({
							...scheduleList,
							unavailable: lessonList.data['schedule'],
						});
					}
					studyDayList.status === 200 &&
						setCalendarList(studyDayList.data.data);
					if (lessonList.status === 200 && studyDayList.status === 200) {
						setIsSave(true);
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
	const fetchInfoAvailableSchedule = async (arrSchedule) => {
		const newScheduleList = [...arrSchedule].map(
			({
				ID,
				RoomID,
				RoomName,
				TeacherID,
				TeacherName,
				CaID,
				CaName,
				date,
				Tiet,
			}) => ({
				ID,
				RoomID,
				RoomName,
				TeacherID,
				TeacherName,
				StudyTimeID: CaID,
				StudyTimeName: CaName,
				Date: date,
				SubjectID: Tiet.CurriculumsDetailID,
			})
		);
		setIsLoading({
			type: 'CHECK_SCHEDULE',
			status: true,
		});
		const {BranchID, RoomID} = stoneDataToSave.current;
		const paramsArr = newScheduleList
			.map(({StudyTimeID, Date, SubjectID}) => {
				const dateFm = moment(Date).format('YYYY/MM/DD');
				return [
					// TEACHER
					{
						BranchID,
						SubjectID,
						StudyTimeID,
						Date: dateFm,
					},
					// ROOM
					{
						BranchID,
						Rooms: RoomID,
						StudyTimeID,
						Date: dateFm,
					},
				];
			})
			.flat(1);
		try {
			if (!paramsArr.length) return;
			const promises = paramsArr.map((p, idx) => [
				idx % 2 === 0 ? checkTeacherApi.getAll(p) : checkRoomApi.getAll(p),
			]);
			const resArr = await Promise.all(promises.flat(1))
				.then((res) => {
					const newRes = [];
					for (let i = 0, len = res.length; i < len; i += 2) {
						newRes.push([res[i], res[i + 1]]);
					}
					const newOptionForSchedule = newRes.map((r, idx) => {
						const teacherList = r[0];
						const roomList = r[1];
						const rs = {
							optionRoomList: [],
							optionTeacherList: [],
						};

						if (teacherList.status === 200) {
							rs.optionTeacherList = teacherList.data.data.map((t) => ({
								value: t['id'],
								title: t['name'],
							}));
						}
						if (teacherList.status === 204) {
							rs.optionTeacherList = [
								{
									title: newScheduleList[idx].TeacherName,
									value: newScheduleList[idx].TeacherID,
								},
							];
						}
						if (roomList.status === 200) {
							rs.optionRoomList = roomList.data.data.map((t) => ({
								value: t['id'],
								title: t['name'],
							}));
						}
						if (roomList.status === 204) {
							rs.optionRoomList = [
								{
									title: newScheduleList[idx].RoomName,
									value: newScheduleList[idx].RoomID,
								},
							];
						}
						return rs;
					});
					setOptionForSchedule((prevState) => ({
						...prevState,
						list: newOptionForSchedule,
					}));
				})
				.catch((err) =>
					console.log('fetchInfoAvailableSchedule - PromiseAll:', err)
				);
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'CHECK_SCHEDULE',
				status: false,
			});
		}
	};
	const checkDuplicateStudyTimeInDay = (arr, vl) => {
		const scheduleSameStudyTime = arr.filter((s) => s.CaID === vl);
		if (scheduleSameStudyTime.length > 1) {
			return true;
		}
		return false;
	};
	const onChangeValueSchedule = (uid, key, vl) => {
		if (!vl) {
			showNoti('danger', 'Dữ liệu không phù hợp');
			return;
		}
		const {unavailable} = scheduleList;
		let date;
		const newUnavailableScheduleList = unavailable.map((s) => {
			if (s.ID === uid) {
				date = s.date;
				return {
					...s,
					[key]: vl,
				};
			} else {
				return s;
			}
		});
		if (key === 'CaID') {
			const scheduleList = newUnavailableScheduleList.filter(
				(s) => s.date === date
			);
			if (checkDuplicateStudyTimeInDay(scheduleList, vl)) {
				showNoti('danger', 'Dữ liệu không được thay đổi do trùng lập');
			} else {
				fetchInfoAvailableSchedule(scheduleList);
			}
		}
		setScheduleList({
			...scheduleList,
			unavailable: newUnavailableScheduleList,
		});
	};
	const onChangeStatusSchedule = (sch, type = 1) => {
		const {dateString} = dateSelected;
		const newScheduleUnavailableList = [...scheduleList.unavailable];
		const newScheduleAvailableList = [...scheduleList.available];
		const fmDate = moment(dateString).format('YYYY-MM-DD');
		const newScheduleObj = {
			...sch,
			date: fmDate,
		};
		const fmScheduleUnavailableToObject = newScheduleUnavailableList.reduce(
			(newObj, s) => {
				newObj[s.date] ? newObj[s.date].push(s) : (newObj[s.date] = [s]);
				return newObj;
			},
			{}
		);
		// type = 2 => unavailable to available
		if (type === 2) {
			const idx = newScheduleUnavailableList.findIndex((s) => s.ID === sch.ID);
			newScheduleUnavailableList.splice(idx, 1);
			newScheduleAvailableList.push(newScheduleObj);
		}
		// type = 1 => available to unavailable
		if (type === 1) {
			if (
				fmScheduleUnavailableToObject[fmDate]?.length >=
				calendarList[0]['Limit']
			) {
				showNoti('danger', 'Số ca đạt giới hạn');
				return;
			}
			const idx = newScheduleAvailableList.findIndex((s) => s.ID === sch.ID);
			newScheduleAvailableList.splice(idx, 1);
			newScheduleUnavailableList.push(newScheduleObj);
		}
		setScheduleList((prevState) => ({
			...prevState,
			available: newScheduleAvailableList,
			unavailable: newScheduleUnavailableList,
		}));
	};
	// -----------CALENDAR-----------
	const calendarDateFormat = (calendarArr) => {
		const {unavailable} = scheduleList;
		const fmScheduleUnavailableToObject = unavailable.reduce((newObj, s) => {
			newObj[s.date] ? newObj[s.date].push(s) : (newObj[s.date] = [s]);
			return newObj;
		}, {});
		const rs = calendarArr.map((c, idx) => {
			let isValid = true;
			let limit = c.Limit;
			let scheduleList = [];
			let title = `Số buổi trống: ${limit}`;

			const calendarHadSchedule =
				fmScheduleUnavailableToObject[c.Day.slice(0, 10)]?.length;

			if (calendarHadSchedule) {
				limit = c.Limit - calendarHadSchedule;
				scheduleList = fmScheduleUnavailableToObject[c.Day.slice(0, 10)];
				title = 'Click để xem chi tiết';
			}

			if (!limit) {
				isValid = false;
			}
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
	const onSelectDate = (vl) => {
		setDateSelected({
			dateString: vl.resource.dateString,
		});
	};
	// -----------SAVE COURSE-----------
	const onSaveCourse = async () => {
		setIsLoading({
			type: 'SAVE_COURSE',
			status: true,
		});
		let res;

		try {
			const {Schedule} = saveCourseInfo;
			console.log(Schedule);
			res = await courseApi.add(saveCourseInfo);
			res.status === 200 && showNoti('success', res.data.message);
		} catch (error) {
			showNoti('error', error.message);
		} finally {
			setIsLoading({
				type: 'SAVE_COURSE',
				status: false,
			});
		}
		return res;
	};
	const getTitle = (arr, vl) => arr.find((p) => p['value'] === vl)['title'];
	const getMultiTitle = (arrList, arrVl) => {
		const rs = [];
		for (const r1 of arrVl.split(',')) {
			for (const r2 of arrList) {
				if (+r1 === r2.value) {
					rs.push(r2.title);
					break;
				}
			}
		}
		return rs.join(', ');
	};
	const onFetchDataToSave = () => {
		const newScheduleFm = scheduleList.unavailable.map((s) => ({
			CurriculumsDetailID: s.Tiet.CurriculumsDetailID,
			Date: s.date,
			StudyTimeID: s.CaID,
			RoomID: s.RoomID,
			TeacherID: s.TeacherID,
		}));
		const {
			BranchID,
			RoomID,
			ProgramID,
			CurriculumID,
			DaySelected,
			StudyTimeID,
			StartDay,
		} = stoneDataToSave.current;

		const BranchName = getTitle(branchList, BranchID);
		const ProgramName = getTitle(programList, ProgramID);
		const CurriculumName = getTitle(curriculumList, CurriculumID);
		const RoomName = getMultiTitle(dataFetchByBranch.roomList, RoomID);
		const DaySelectedName = getMultiTitle(dayOfWeek, DaySelected);
		const StudyTimeName = getMultiTitle(studyTimeList, StudyTimeID);
		const CourseName = `[${BranchName}] - [${ProgramName}] - [${moment(
			StartDay
		).format('DD/MM/YYY')}] - [${StudyTimeName}] - [${RoomName}]`;

		//
		setSaveCourseInfo({
			...saveCourseInfo,
			...stoneDataToSave.current,
			BranchName,
			RoomName,
			ProgramName,
			CurriculumName,
			DaySelectedName,
			StudyTimeName,
			CourseName,
			Schedule: newScheduleFm,
		});
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
								{isSave && (
									<SaveCreateCourse
										isLoading={isLoading}
										saveInfo={saveCourseInfo}
										handleSaveCourse={onSaveCourse}
										handleFetchDataToSave={onFetchDataToSave}
									/>
								)}
							</div>
						}
					>
						<div className="wrap-calendar">
							<CreateCourseCalendar
								eventList={calendarDateFormat(calendarList)}
								handleSelectDate={onSelectDate}
								dateSelected={dateSelected}
								//
								isLoading={isLoading}
								//
								// handleSelectSchedule={onSelectSchedule}
								handleFetchInfoAvailableSchedule={fetchInfoAvailableSchedule}
								handleChangeValueSchedule={onChangeValueSchedule}
								handleChangeStatusSchedule={onChangeStatusSchedule}
								//
								optionForScheduleList={optionForSchedule}
							/>
						</div>
					</Card>
				</div>
				<div className="col-md-4 col-12">
					<Schedule>
						<ScheduleList>
							{scheduleList.available.map((s, idx) => (
								<ScheduleItem
									key={idx}
									scheduleObj={s}
									handleChangeStatusSchedule={onChangeStatusSchedule}
									isUpdate={false}
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
