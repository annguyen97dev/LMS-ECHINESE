import {Card} from 'antd';
import moment from 'moment';
import {useRouter} from 'next/router';
import React, {useEffect, useRef, useState} from 'react';
import {
	branchApi,
	checkTeacherApi,
	courseApi,
	curriculumApi,
	gradeApi,
	lessonOnlineApi,
	programApi,
	staffApi,
	studyDayOnlineApi,
	studyTimeApi,
} from '~/apiBase';
import TitlePage from '~/components/TitlePage';
import {useDebounce} from '~/context/useDebounce';
import {useWrap} from '~/context/wrap';
import {fmArrayToObjectWithSpecialKey, fmSelectArr} from '~/utils/functions';
import CreateCourseOnlineCalendar from './CalendarOnline/CreateCourseOnlineCalendar';
import CreateCourseOnlineForm from './CreateCourseOnlineForm/CreateCourseOnlineForm';
import SaveCreateCourseOnline from './SaveCreateCourseOnline';
import Schedule from './ScheduleOnline/Schedule';
import ScheduleItem from './ScheduleOnline/ScheduleItem';
import ScheduleList from './ScheduleOnline/ScheduleList';

// ------------ MAIN COMPONENT ------------------
type IOptionListForForm = {
	branchList: IOptionCommon[];
	studyTimeList: IOptionCommon[];
	gradeList: IOptionCommon[];
	programList: IOptionCommon[];
	dayOfWeek: IOptionCommon[];
	curriculumList: IOptionCommon[];
	userInformationList: IOptionCommon[];
};
type IOptionListForADay = {
	optionStudyTimeList: IOptionCommon[];
	list: Array<{
		optionTeacherList: IOptionCommon[];
	}>;
};

type ICreateCourseScheduleList = {
	available: ISchedule[];
	unavailable: ISchedule[];
	endDate: string;
};
type ICreateCourseScheduleShowList = {
	[k: string]: ISchedule[];
};
type IDataModal = {
	dateFm: string;
	limit: number;
	scheduleInDay: number;
	scheduleList: ISchedule[];
};
type IScheduleListToSave = {
	CurriculumsDetailID?: number | string;
	Date: string;
	StudyTimeID: number;
	TeacherID: number;
	SubjectID: number;
};
type ISaveCourseInfo = {
	CourseName: string;
	AcademicUID: number;
	BranchID: number;
	BranchName: string;
	GradeID: number;
	StudyTimeID: string;
	StudyTimeName: string;
	ProgramID: number;
	ProgramName: string;
	CurriculumID: number;
	CurriculumName: string;
	StartDay: string;
	EndDay: string;
	DaySelected: string;
	DaySelectedName: string;
	Schedule: IScheduleListToSave[];
};
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
const CreateCourseOnline = () => {
	const router = useRouter();
	// -----------STATE-----------
	// FORM
	const {showNoti} = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [optionListForForm, setOptionListForForm] =
		useState<IOptionListForForm>({
			branchList: [],
			studyTimeList: [],
			gradeList: [],
			programList: [],
			dayOfWeek,
			curriculumList: [],
			userInformationList: [],
		});
	const stoneStudyTimeList = useRef(optionListForForm.studyTimeList);
	const [dataToFetchCurriculum, setDataToFetchCurriculum] = useState<{
		StudyTimeID: number[];
		ProgramID: number;
	}>({
		StudyTimeID: null,
		ProgramID: null,
	});
	//Lesson
	const [scheduleList, setScheduleList] = useState<ICreateCourseScheduleList>({
		available: [],
		unavailable: [],
		endDate: '',
	});
	const [optionListForADay, setOptionListForADay] =
		useState<IOptionListForADay>({
			optionStudyTimeList: [],
			list: [
				{
					optionTeacherList: [],
				},
			],
		});
	//StudyDay
	const [calendarList, setCalendarList] = useState<IStudyDay[]>([]);
	const [dateSelected, setDateSelected] = useState('');
	// SAVE
	const [isSave, setIsSave] = useState(false);
	const [scheduleShow, setScheduleShow] =
		useState<ICreateCourseScheduleShowList>({});
	const stoneDataToSave = useRef({
		CourseName: '',
		AcademicUID: 0,
		BranchID: 0,
		CurriculumID: 0,
		ProgramID: 0,
		StartDay: '',
		GradeID: 0,
		DaySelected: '',
		StudyTimeID: '',
	});
	const [saveCourseInfo, setSaveCourseInfo] = useState<ISaveCourseInfo>({
		CourseName: '',
		AcademicUID: 0,
		BranchID: 0,
		BranchName: '',
		GradeID: 0,
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
	// CALENDAR MODAL
	const [dataModalCalendar, setDataModalCalendar] = useState<IDataModal>({
		dateFm: '',
		limit: 0,
		scheduleInDay: 0,
		scheduleList: [],
	});
	// -----------CREATE COURSE FORM-----------
	// FETCH BRANCH, STUDY TIME, GRADE IN THE FIRST TIME
	const fetchData = async () => {
		setIsLoading({
			type: 'FETCH_DATA',
			status: true,
		});
		try {
			const [branch, studyTime, grade] = await Promise.all([
				branchApi.getAll({pageIndex: 1, pageSize: 9999}),
				studyTimeApi.getAll({selectAll: true}),
				gradeApi.getAll({selectAll: true}),
			]);
			// BRANCH
			const newBranchList = fmSelectArr(branch.data.data, 'BranchName', 'ID');
			// STUDY TIME
			const newStudyTimeList = fmSelectArr(studyTime.data.data, 'Name', 'ID', [
				'Time',
				'TimeStart',
				'TimeEnd',
			]);
			stoneStudyTimeList.current = newStudyTimeList;
			// GRADE
			const newGradeList = fmSelectArr(grade.data.data, 'GradeName', 'ID');
			setOptionListForForm({
				...optionListForForm,
				branchList: newBranchList,
				studyTimeList: newStudyTimeList,
				gradeList: newGradeList,
			});
		} catch (error) {
			console.log('fetchData - PromiseAll:', error);
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_DATA',
				status: false,
			});
		}
	};
	useEffect(() => {
		fetchData();
	}, []);
	// FETCH USER INFORMATION - STAFF
	const fetchStaffByBranch = async (id: number) => {
		setIsLoading({
			type: 'BranchID',
			status: true,
		});

		try {
			const res = await staffApi.getAll({BranchID: id, RoleID: 7});
			// USER INFORMATION
			if (res.status === 200) {
				const newUserInformationList = fmSelectArr(
					res.data.data,
					'FullNameUnicode',
					'UserInformationID'
				);
				setOptionListForForm((preState) => ({
					...preState,
					userInformationList: newUserInformationList,
				}));
			}
			if (res.status === 204) {
				setOptionListForForm((preState) => ({
					...preState,
					userInformationList: [],
				}));
			}
		} catch (error) {
			console.log('FetchDataByBranch - PromiseAll:', error);
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
				setOptionListForForm({
					...optionListForForm,
					programList: newProgramList,
				});
			}
			if (res.status === 204) {
				setOptionListForForm({
					...optionListForForm,
					programList: [],
				});
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
	const checkStudyTime = async (value: [number]) => {
		if (!value?.length) {
			setOptionListForForm({
				...optionListForForm,
				studyTimeList: stoneStudyTimeList.current,
			});
			return;
		}
		const newStudyTimeList = [...optionListForForm.studyTimeList];
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
					// KIỂM TRA MỖI CA HỌC KHÔNG CÓ THỜI GIAN TRÙNG LÊN NHAU
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
		setOptionListForForm({
			...optionListForForm,
			studyTimeList: rs,
		});
		setOptionListForADay({
			...optionListForADay,
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
				setOptionListForForm({
					...optionListForForm,
					curriculumList: newCurriculum,
				});
			}
			if (res.status === 204) {
				setOptionListForForm({
					...optionListForForm,
					curriculumList: [],
				});
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
				BranchID,
				CurriculumID,
				StartDay: StartDate,
				StudyTimeID,
				DaySelected,
				ProgramID,
				GradeID,
				CourseName,
				UserInformationID,
			} = object;
			stoneDataToSave.current = {
				CourseName,
				AcademicUID: UserInformationID,
				BranchID,
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
				BranchID,
				DaySelected: DaySelected.join(','),
			};
			const studyDayParams = {
				BranchID,
				StudyTimeID: StudyTimeID.join(','),
				StartDate,
				DaySelected: DaySelected.join(','),
			};
			const arrRes = await Promise.all([
				lessonOnlineApi.getAll(lessonParams),
				studyDayOnlineApi.getAll(studyDayParams),
			])
				.then(([lessonList, studyDayList]) => {
					if (lessonList.status === 200) {
						setScheduleList({
							endDate: '',
							available: [],
							unavailable: lessonList.data.schedule,
						});
					}
					studyDayList.status === 200 &&
						setCalendarList(studyDayList.data.data);
					if (lessonList.status === 200 && studyDayList.status === 200) {
						setIsSave(true);
						checkStudyTime(null);
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
	const fetchInfoAvailableSchedule = async (arrSchedule: ISchedule[]) => {
		const {BranchID} = stoneDataToSave.current;
		// SPLIT SCHEDULE TO 2 OBJECT TO CALL 2 API
		// paramsArr = [ {params teacher of schedule} ]
		const paramsArr = arrSchedule.map(({CaID, date, Tiet}, idx) => {
			const dateFm = moment(date).format('YYYY/MM/DD');
			const {SubjectID} = Tiet;
			return {
				BranchID,
				SubjectID,
				StudyTimeID: CaID,
				Date: dateFm,
			};
		});
		try {
			if (!paramsArr.length) return;
			// promises = [ {checkTeacher promise} ]
			const promises = paramsArr.map((param) => checkTeacherApi.getAll(param));
			await Promise.all(promises)
				.then((res) => {
					// res = [ {data teacher schedule 1} ]
					// newOptionForSchedule = [ {optionTeacherList:[]} ]
					const newOptionForSchedule = res.map((teacherRes) => {
						const rs = {
							optionTeacherList: [{title: '---Chọn giáo viên---', value: 0}],
						};

						if (teacherRes.status === 200) {
							rs.optionTeacherList = [
								...rs.optionTeacherList,
								...fmSelectArr(teacherRes.data.data, 'name', 'id', ['name']),
							];
						}
						return rs;
					});
					setOptionListForADay((prevState) => ({
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
	const onDebounceFetch = useDebounce(fetchInfoAvailableSchedule, 1000, []);
	const onDebounceFetchInfoAvailableSchedule = (params: ISchedule[]) => {
		setIsLoading({
			type: 'CHECK_SCHEDULE',
			status: true,
		});
		onDebounceFetch(params);
	};
	const checkDuplicateStudyTimeInDay = (arr: ISchedule[], vl) => {
		const scheduleSameStudyTime = arr.filter((s) => s.CaID === vl);
		if (scheduleSameStudyTime.length > 1) {
			return true;
		}
		return false;
	};
	const getNewValueForSchedule = (key, vl, pos) => {
		const {optionTeacherList} = optionListForADay.list[pos];
		switch (key) {
			case 'CaID':
				const CaName = optionListForADay.optionStudyTimeList.find(
					(o) => o.value === vl
				)?.title;
				return {
					TeacherID: 0,
					TeacherName: 'Giáo viên trống',
					CaName,
					[key]: vl,
				};
			case 'TeacherID':
				const TeacherName = optionTeacherList.find(
					(o) => o.value === vl
				)?.title;
				return {
					TeacherName: vl ? TeacherName : 'Giáo viên trống',
					[key]: vl,
				};
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
	const changeValueSchedule = (
		uid: number,
		key: 'CaID' | 'TeacherID',
		vl: number | string,
		pos: number
	) => {
		const {rs: newUnavailableScheduleList, date} =
			getNewUnavailableScheduleList(uid, key, vl, pos);

		if (key === 'CaID') {
			const scheduleList = newUnavailableScheduleList.filter(
				(s) => s.date === date
			);
			if (checkDuplicateStudyTimeInDay(scheduleList, vl)) {
				showNoti('danger', 'Dữ liệu trùng lập');
			} else {
				onDebounceFetchInfoAvailableSchedule(scheduleList);
			}
		}

		setScheduleList((prevState) => ({
			...prevState,
			unavailable: newUnavailableScheduleList,
		}));
	};
	const changeStatusSchedule = (sch: ISchedule, type: number = 1) => {
		const newScheduleUnavailableList = [...scheduleList.unavailable];
		const newScheduleAvailableList = [...scheduleList.available];
		const fmDate = moment(dateSelected).format('YYYY-MM-DD');
		const fmScheduleUnavailableToObject = fmArrayToObjectWithSpecialKey(
			newScheduleUnavailableList,
			'date'
		);
		// type = 2 => unavailable to available
		if (type === 2) {
			const idx = newScheduleUnavailableList.findIndex((s) => s.ID === sch.ID);
			const newScheduleObj = {
				...newScheduleUnavailableList[idx],
				date: fmDate,
			};
			newScheduleUnavailableList.splice(idx, 1);
			newScheduleAvailableList.push(newScheduleObj);
		}
		// type = 1 => available to unavailable
		if (type === 1) {
			const limit = calendarList.find((c) => c.Day === dateSelected).Limit;
			if (fmScheduleUnavailableToObject[fmDate]?.length >= limit) {
				showNoti('danger', 'Số ca đạt giới hạn');
				return false;
			}
			const idx = newScheduleAvailableList.findIndex((s) => s.ID === sch.ID);
			const newScheduleObj = {
				...newScheduleAvailableList[idx],
				date: fmDate,
			};
			newScheduleAvailableList.splice(idx, 1);
			newScheduleUnavailableList.push(newScheduleObj);
		}
		setScheduleList((prevState) => ({
			...prevState,
			available: newScheduleAvailableList,
			unavailable: newScheduleUnavailableList,
		}));
		return true;
	};
	// -----------CALENDAR-----------
	const calendarDateFormat = (calendarArr: IStudyDay[]) => {
		const {unavailable} = scheduleList;
		const fmScheduleUnavailableToObject = fmArrayToObjectWithSpecialKey(
			unavailable,
			'date'
		);
		const rs = calendarArr.map((c, idx) => {
			let isValid = true;
			let limit = c.Limit;
			let scheduleListForADay = [];
			let title = `Số buổi trống: ${limit}`;

			const calendarHadSchedule =
				fmScheduleUnavailableToObject[c.Day.slice(0, 10)]?.length;

			if (calendarHadSchedule) {
				limit = c.Limit - calendarHadSchedule;
				scheduleListForADay = fmScheduleUnavailableToObject[c.Day.slice(0, 10)];
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
					scheduleList: scheduleListForADay,
				},
			};
		});
		return rs;
	};
	const onSelectDate = (vl) => {
		setDateSelected(vl.resource.dateString);
	};
	const onToggleSchedule = (sch: ISchedule, type: number) => {
		if (changeStatusSchedule(sch, type)) {
			const newScheduleList = [...dataModalCalendar.scheduleList];
			const idx = newScheduleList.findIndex((s) => s.ID === sch.ID);
			if (idx >= 0) {
				newScheduleList.splice(idx, 1);
			} else {
				newScheduleList.push(sch);
			}
			setDataModalCalendar({
				...dataModalCalendar,
				scheduleInDay: newScheduleList.length,
				scheduleList: newScheduleList,
			});
		}
	};
	useEffect(() => {
		const {scheduleList} = dataModalCalendar;
		if (scheduleList.length) {
			onDebounceFetchInfoAvailableSchedule(scheduleList);
		}
	}, [dataModalCalendar]);
	// -----------SAVE COURSE-----------

	const getTitle = (arr: IOptionCommon[], vl) =>
		arr.find((p) => p.value === vl).title;
	const getMultiTitle = (arrList: IOptionCommon[], arrVl: string) => {
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
	const onValidateDateToSave = () => {
		const {unavailable} = scheduleList;
		const rs: {
			show: {
				date: string;
				dayOffWeek: string;
				studyTimeName: string;
				teacherName: string;
				StudyTimeID: number;
				isValid: boolean;
			}[];
			save: IScheduleListToSave[];
			endDate: number;
		} = {
			show: [],
			save: [],
			endDate: 0,
		};
		for (let i = 0, len = unavailable.length; i < len; i++) {
			const s = unavailable[i];
			// get end date of course
			const checkEndDay = moment(s.date).valueOf();
			if (rs.endDate < checkEndDay) {
				rs.endDate = checkEndDay;
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
			let isValid = !s.TeacherID;
			for (let i2 = 0; i2 < len; i2++) {
				const s2 = scheduleList.unavailable[i2];
				if (i !== i2 && s.date === s2.date && s.CaID === s2.CaID) {
					isValid = true;
				}
			}
			rs.show.push({
				date: s.date,
				dayOffWeek,
				studyTimeName: s.CaName,
				teacherName: s.TeacherName,
				StudyTimeID: s.CaID,
				isValid,
			});
			rs.save.push({
				CurriculumsDetailID: s.Tiet.CurriculumsDetailID,
				Date: s.date,
				StudyTimeID: s.CaID,
				TeacherID: s.TeacherID,
				SubjectID: s.Tiet.SubjectID,
			});
		}
		return rs;
	};
	const onFetchDataToSave = () => {
		const {branchList, programList, curriculumList, studyTimeList} =
			optionListForForm;
		const {show, save, endDate} = onValidateDateToSave();

		const scheduleListSorted = show.sort(
			(a, b) => moment(a.date).valueOf() - moment(b.date).valueOf()
		);

		const fmScheduleShowToObject = fmArrayToObjectWithSpecialKey(
			scheduleListSorted,
			'date'
		);

		const {
			BranchID,
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
			ProgramName,
			CurriculumName,
			DaySelectedName,
			StudyTimeName,
			EndDay: moment(endDate).format('YYYY/MM/DD'),
			Schedule: save,
		});
	};
	const onSaveCourse = async () => {
		setIsLoading({
			type: 'SAVE_COURSE',
			status: true,
		});

		try {
			const haveErrors = Object.keys(scheduleShow).find((date, idx) =>
				scheduleShow[date].find((s) => s.isValid)
			);
			if (haveErrors) {
				showNoti('danger', 'Đã xảy ra lỗi. Xin kiểm tra lại');
				return;
			}
			const res = await courseApi.add(saveCourseInfo);
			if (res.status === 200) {
				showNoti('success', res.data.message);
				router.push('/course/course-list/');
				return res;
			}
		} catch (error) {
			showNoti('error', error.message);
		} finally {
			setIsLoading({
				type: 'SAVE_COURSE',
				status: false,
			});
		}
	};
	return (
		<div className="create-course">
			<TitlePage title="Tạo khóa học online" />
			<div className="row">
				<div className="col-md-8 col-12">
					<Card
						title="Sắp xếp lịch học"
						extra={
							<div className="btn-page-course">
								<CreateCourseOnlineForm
									isLoading={isLoading}
									isUpdate={false}
									//
									optionListForForm={optionListForForm}
									//
									handleGetCourse={getCourse}
									handleCheckStudyTime={checkStudyTime}
									handleFetchDataByBranch={fetchStaffByBranch}
									handleFetchProgramByGrade={fetchProgramByGrade}
									handleGetValueBeforeFetchCurriculum={
										getValueBeforeFetchCurriculum
									}
								/>
								{isSave && (
									<SaveCreateCourseOnline
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
						<CreateCourseOnlineCalendar
							eventList={calendarDateFormat(calendarList)}
							handleSelectDate={onSelectDate}
							dateSelected={dateSelected}
							//
							isLoaded={true}
							//
							handleSetDataModalCalendar={setDataModalCalendar}
							dataModalCalendar={dataModalCalendar}
						>
							<ScheduleList
								panelActiveListInModal={dataModalCalendar.scheduleList.map(
									(_, idx) => idx
								)}
							>
								{dataModalCalendar.scheduleList.map((s, idx) => (
									<ScheduleItem
										key={idx}
										isUpdate={true}
										scheduleObj={s}
										isLoading={isLoading}
										handleChangeValueSchedule={(uid, key, vl) =>
											changeValueSchedule(uid, key, vl, idx)
										}
										handleChangeStatusSchedule={onToggleSchedule}
										optionTeacherList={
											optionListForADay.list[idx]?.optionTeacherList
										}
										optionStudyTime={optionListForADay.optionStudyTimeList}
									/>
								))}
							</ScheduleList>
						</CreateCourseOnlineCalendar>
					</Card>
				</div>
				<div className="col-md-4 col-12">
					<Schedule>
						<ScheduleList>
							{scheduleList.available.map((s, idx) => (
								<ScheduleItem
									key={idx}
									scheduleObj={s}
									handleChangeStatusSchedule={onToggleSchedule}
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

export default CreateCourseOnline;
