import {Card} from 'antd';
import moment from 'moment';
import {useRouter} from 'next/router';
import React, {useEffect, useRef, useState} from 'react';
import {
	branchApi,
	checkRoomApi,
	checkTeacherApi,
	courseApi,
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
	const router = useRouter();
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
	const [scheduleShow, setScheduleShow] = useState({});
	const stoneDataToSave = useRef({
		CourseName: '',
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
		EndDay: '',
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
				CourseName,
			} = object;
			stoneDataToSave.current = {
				CourseName,
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
					error.status === 400 && showNoti('danger', error.message);
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
	// FETCH DATA FOR SELECT SCHEDULE
	const fetchInfoAvailableSchedule = async (arrSchedule) => {
		setIsLoading({
			type: 'CHECK_SCHEDULE',
			status: true,
		});
		const {BranchID, RoomID} = stoneDataToSave.current;
		// SPLIT SCHEDULE TO 2 OBJECT TO CALL 2 API
		// paramsArr = [ {Schedule-*: [{params teacher}, {params room}]} ]
		const paramsArr = arrSchedule.map(({CaID, date, Tiet}, idx) => {
			const dateFm = moment(date).format('YYYY/MM/DD');
			const {SubjectID} = Tiet;
			return {
				[`Schedule-${idx + 1}`]: [
					// TEACHER
					{
						BranchID,
						SubjectID,
						StudyTimeID: CaID,
						Date: dateFm,
					},
					// ROOM
					{
						BranchID,
						Rooms: RoomID,
						StudyTimeID: CaID,
						Date: dateFm,
					},
				],
			};
		});
		try {
			if (!paramsArr.length) return;
			// promises = [ {checkTeacher promise}, {checkRoom promise} ]
			const promises = paramsArr
				.map((obj, idx1) => {
					return obj[`Schedule-${idx1 + 1}`].map((p, idx2) =>
						idx2 % 2 === 0 ? checkTeacherApi.getAll(p) : checkRoomApi.getAll(p)
					);
				})
				.flat(1);
			await Promise.all(promises)
				.then((res) => {
					//res = [ {data teacher}, {data room} ]
					//newRes = [ [{data teacher}, {data room}] ]
					const newRes = [];
					for (let i = 0, len = res.length; i < len; i += 2) {
						newRes.push([res[i], res[i + 1]]);
					}
					// newOptionForSchedule = [ {optionRoomList:[], optionTeacherList:[]} ]
					const newOptionForSchedule = newRes.map((r) => {
						const teacherList = r[0];
						const roomList = r[1];
						const rs = {
							optionRoomList: [{title: '---Chọn phòng---', value: 0}],
							optionTeacherList: [{title: '---Chọn giáo viên---', value: 0}],
						};

						if (teacherList.status === 200) {
							rs.optionTeacherList = [
								...rs.optionTeacherList,
								...fmSelectArr(teacherList.data.data, 'name', 'id', ['name']),
							];
						}
						if (roomList.status === 200) {
							rs.optionRoomList = [
								...rs.optionRoomList,
								...fmSelectArr(roomList.data.data, 'name', 'id', ['name']),
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
	const getNewValueForSchedule = (key, vl, pos) => {
		const {optionRoomList, optionTeacherList} = optionForSchedule.list[pos];
		switch (key) {
			case 'CaID':
				const CaName = optionForSchedule.optionStudyTimeList.find(
					(o) => o.value === vl
				)?.title;
				return {
					RoomID: 0,
					TeacherID: 0,
					TeacherName: 'Giáo viên trống',
					RoomName: 'Phòng trống',
					CaName,
					[key]: vl,
				};
			case 'TeacherID':
				const TeacherName = optionTeacherList.find(
					(o) => o.value === vl
				)?.title;
				return {
					TeacherName,
					[key]: vl,
				};
				break;
			case 'RoomID':
				const RoomName = optionRoomList.find((o) => o.value === vl)?.title;
				return {
					RoomName,
					[key]: vl,
				};
				break;
			default:
				break;
		}
	};
	const getNewUnavailableScheduleList = (uid, key, vl, pos) => {
		const {unavailable} = scheduleList;
		// DATE TO CHECK DUPLICATE VALUE
		let date;
		const rs = unavailable.map((s) => {
			if (s.ID === uid) {
				const newVl = getNewValueForSchedule(key, vl, pos);
				date = s.date;
				return {
					...s,
					...newVl,
				};
			} else {
				return s;
			}
		});
		return {date, rs};
	};
	const onChangeValueSchedule = (uid, key, vl, pos) => {
		const {rs: newUnavailableScheduleList, date} =
			getNewUnavailableScheduleList(uid, key, vl, pos);

		if (key === 'CaID') {
			const scheduleList = newUnavailableScheduleList.filter(
				(s) => s.date === date
			);
			if (checkDuplicateStudyTimeInDay(scheduleList, vl)) {
				showNoti('danger', 'Dữ liệu trùng lập');
			} else {
				fetchInfoAvailableSchedule(scheduleList);
			}
		}

		setScheduleList((prevState) => ({
			...prevState,
			unavailable: newUnavailableScheduleList,
		}));
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
			const limit = calendarList.find((c) => c['Day'] === dateString)['Limit'];
			if (fmScheduleUnavailableToObject[fmDate]?.length >= limit) {
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
			const haveErrors = Object.keys(scheduleShow).find((date, idx) =>
				scheduleShow[date].find((s) => s.isValid)
			);
			if (haveErrors) {
				showNoti('danger', 'Đã xảy ra lỗi. Xin kiểm tra lại');
				return;
			}
			res = await courseApi.add(saveCourseInfo);
			if (res.status === 200) {
				showNoti('success', res.data.message);
				router.push('/course/course-list/');
			}
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
		let EndDay = 0;
		// SHOW IN MODAL
		const scheduleShow = [];
		// SEND TO API
		const newScheduleFm = [];
		for (let i = 0, len = scheduleList.unavailable.length; i < len; i++) {
			const s = scheduleList.unavailable[i];
			// get end date of course
			const checkEndDay = moment(s.date).valueOf();
			if (EndDay < checkEndDay) {
				EndDay = checkEndDay;
			}
			const dayArr = [
				'Chủ Nhật',
				'Thứ 2',
				'Thứ 3',
				'Thứ 4',
				'Thứ 5',
				'Thứ 6',
				'Thứ 7',
			];
			const dayOffWeek = dayArr[moment(s.date).day()];
			let isValid = !s.RoomID || !s.TeacherID;
			for (let i2 = 0; i2 < len; i2++) {
				const s2 = scheduleList.unavailable[i2];
				if (i !== i2 && s.date === s2.date && s.CaID === s2.CaID) {
					isValid = true;
				}
			}
			scheduleShow.push({
				date: s.date,
				dayOffWeek,
				studyTimeName: s.CaName,
				roomName: s.RoomName,
				teacherName: s.TeacherName,
				StudyTimeID: s.CaID,
				isValid,
			});
			newScheduleFm.push({
				CurriculumsDetailID: s.Tiet.CurriculumsDetailID,
				Date: s.date,
				StudyTimeID: s.CaID,
				RoomID: s.RoomID,
				TeacherID: s.TeacherID,
				SubjectID: s.Tiet.SubjectID,
			});
		}
		const fmScheduleShowToObject = scheduleShow
			.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf())
			.reduce((newObj, s) => {
				newObj[s.date] ? newObj[s.date].push(s) : (newObj[s.date] = [s]);
				return newObj;
			}, {});

		const {
			BranchID,
			RoomID,
			ProgramID,
			CurriculumID,
			DaySelected,
			StudyTimeID,
			StartDay,
			CourseName,
		} = stoneDataToSave.current;

		const BranchName = getTitle(branchList, BranchID);
		const ProgramName = getTitle(programList, ProgramID);
		const CurriculumName = getTitle(curriculumList, CurriculumID);
		const RoomName = getMultiTitle(dataFetchByBranch.roomList, RoomID);
		const DaySelectedName = getMultiTitle(dayOfWeek, DaySelected);
		const StudyTimeName = getMultiTitle(studyTimeList, StudyTimeID);
		const CourseNameFinal = CourseName
			? CourseName
			: `[${BranchName}][${ProgramName}][${CurriculumName}][${StudyTimeName}] - ${moment(
					StartDay
			  ).format('DD/MM/YYYY')}`;

		setScheduleShow(fmScheduleShowToObject);
		setSaveCourseInfo({
			...saveCourseInfo,
			...stoneDataToSave.current,
			CourseName: CourseNameFinal,
			BranchName,
			RoomName,
			ProgramName,
			CurriculumName,
			DaySelectedName,
			StudyTimeName,
			EndDay: moment(EndDay).format('YYYY/MM/DD'),
			Schedule: newScheduleFm,
		});
	};
	return (
		<div className="create-course">
			<TitlePage title="Tạo khóa học" />
			<div className="row">
				<div className="col-xl-8 col-12">
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
										scheduleShow={scheduleShow}
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
								handleFetchInfoAvailableSchedule={fetchInfoAvailableSchedule}
								handleChangeValueSchedule={onChangeValueSchedule}
								handleChangeStatusSchedule={onChangeStatusSchedule}
								//
								optionForScheduleList={optionForSchedule}
							/>
						</div>
					</Card>
				</div>
				<div className="col-xl-4 col-12">
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
