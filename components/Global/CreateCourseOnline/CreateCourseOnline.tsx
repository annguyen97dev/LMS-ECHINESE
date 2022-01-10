import { Card } from 'antd';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
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
	teacherApi
} from '~/apiBase';
import TitlePage from '~/components/TitlePage';
import { useWrap } from '~/context/wrap';
import { fmArrayToObjectWithSpecialKey, fmSelectArr } from '~/utils/functions';
import CreateCourseCalendar from '../CreateCourse/Calendar/CreateCourseCalendar';
import Schedule from '../CreateCourse/Schedule/Schedule';
import ScheduleList from '../CreateCourse/Schedule/ScheduleList';
import CreateCourseOnlineForm from './CreateCourseOnlineForm/CreateCourseOnlineForm';
import SaveCreateCourseOnline from './SaveCreateCourseOnline';
import ScheduleOnlineItem from './ScheduleOnline/ScheduleOnlineItem';

// ------------ MAIN COMPONENT ------------------
const dayOfWeek = [
	{
		title: 'Thứ 2',
		value: 1
	},
	{
		title: 'Thứ 3',
		value: 2
	},
	{
		title: 'Thứ 4',
		value: 3
	},
	{
		title: 'Thứ 5',
		value: 4
	},
	{
		title: 'Thứ 6',
		value: 5
	},
	{
		title: 'Thứ 7',
		value: 6
	},
	{
		title: 'Chủ nhật',
		value: 0
	}
];

const CreateCourseOnline = () => {
	const router = useRouter();
	// -----------STATE-----------
	// FORM
	const { showNoti } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [optionListForForm, setOptionListForForm] = useState<ICOOptionListForForm>({
		branchList: [],
		studyTimeList: [],
		gradeList: [],
		programList: [],
		teacherList: [],
		dayOfWeek,
		curriculumList: [],
		userInformationList: []
	});
	const [dataToFetchCurriculum, setDataToFetchCurriculum] = useState<{
		StudyTimeID: number;
		ProgramID: number;
	}>({
		StudyTimeID: null,
		ProgramID: null
	});
	const [dataToFetchTeacher, setDataToFetchTeacher] = useState<{ ProgramID: number; BranchID: number }>({
		BranchID: null,
		ProgramID: null
	});
	//Lesson
	const [scheduleList, setScheduleList] = useState<ICOCreateScheduleList>({
		available: [],
		unavailable: []
	});
	const [optionListForADay, setOptionListForADay] = useState<ICOOptionListForADay>({
		optionStudyTimeList: [],
		optionTeacherList: []
	});
	//StudyDay
	const [calendarList, setCalendarList] = useState<IStudyDay[]>([]);
	// SAVE
	const [isSave, setIsSave] = useState(false);
	const [scheduleShow, setScheduleShow] = useState<ICOCreateScheduleShowList>({});
	const stoneDataToSave = useRef<ICOStoneDataToSave>({
		CourseName: '',
		AcademicUID: 0,
		BranchID: 0,
		CurriculumID: 0,
		ProgramID: 0,
		TeacherID: 0,
		StartDay: '',
		GradeID: 0,
		SalaryOfLesson: 0,
		Price: 0,
		TimeCourse: []
	});
	const [saveCourseInfo, setSaveCourseInfo] = useState<ICOSaveCourseInfo>({
		CourseName: '',
		AcademicUID: 0,
		BranchID: 0,
		BranchName: '',
		GradeID: 0,
		StudyTimeID: '',
		StudyTimeName: '',
		ProgramID: 0,
		ProgramName: '',
		TeacherID: 0,
		TeacherName: '',
		CurriculumID: 0,
		CurriculumName: '',
		StartDay: '',
		EndDay: '',
		DaySelected: '',
		DaySelectedName: '',
		TypeCourse: 2,
		SalaryOfLesson: 0,
		Price: 0,
		Schedule: []
	});
	// CALENDAR MODAL
	const [dataModalCalendar, setDataModalCalendar] = useState<ICODataModal>({
		dateString: '',
		limit: 0,
		scheduleInDay: 0,
		scheduleList: []
	});
	// -----------CREATE COURSE FORM-----------
	// FETCH BRANCH, STUDY TIME, GRADE IN THE FIRST TIME
	const fetchData = async () => {
		setIsLoading({
			type: 'FETCH_DATA',
			status: true
		});
		try {
			const [branch, studyTime, grade] = await Promise.all([
				branchApi.getAll({ pageIndex: 1, pageSize: 9999 }),
				studyTimeApi.getAll({ selectAll: true }),
				gradeApi.getAll({ selectAll: true })
			]);
			// BRANCH
			const newBranchList = fmSelectArr(branch.data.data, 'BranchName', 'ID');
			// STUDY TIME
			const newStudyTimeList = fmSelectArr(studyTime.data.data, 'Name', 'ID', ['Time', 'TimeStart', 'TimeEnd']);
			// GRADE
			const newGradeList = fmSelectArr(grade.data.data, 'GradeName', 'ID');
			setOptionListForForm({
				...optionListForForm,
				branchList: newBranchList,
				studyTimeList: newStudyTimeList,
				gradeList: newGradeList
			});
		} catch (error) {
			console.log('fetchData - PromiseAll:', error);
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_DATA',
				status: false
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
			status: true
		});

		try {
			const res = await staffApi.getAll({ BranchID: id, RoleID: 7 });
			// USER INFORMATION
			if (res.status === 200) {
				const newUserInformationList = fmSelectArr(res.data.data, 'FullNameUnicode', 'UserInformationID');
				setOptionListForForm((preState) => ({
					...preState,
					userInformationList: newUserInformationList
				}));
			}
			if (res.status === 204) {
				setOptionListForForm((preState) => ({
					...preState,
					userInformationList: []
				}));
			}
		} catch (error) {
			console.log('FetchDataByBranch - PromiseAll:', error);
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'BranchID',
				status: false
			});
		}
	};
	// PROGRAM
	const fetchProgramByGrade = async (id: number) => {
		setIsLoading({
			type: 'GradeID',
			status: true
		});

		try {
			const res = await programApi.getAll({
				GradeID: id
			});
			if (res.status === 200) {
				const newProgramList = fmSelectArr(res.data.data, 'ProgramName', 'ID', ['Price']);
				setOptionListForForm({
					...optionListForForm,
					programList: newProgramList
				});
			}
			if (res.status === 204) {
				setOptionListForForm({
					...optionListForForm,
					programList: []
				});
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GradeID',
				status: false
			});
		}
	};
	// GET ENOUGH 2 VALUE TO GET TEACHER - NEED BRANCH ID - PROGRAM ID
	const getValueBeforeFetchTeacher = async (key: string, value: number) => {
		setDataToFetchTeacher((prevState) => ({
			...prevState,
			[key]: value
		}));
	};
	const fetchTeacher = async () => {
		setIsLoading({
			type: 'ProgramID',
			status: true
		});

		try {
			const res = await teacherApi.getTeacherByProgram(dataToFetchTeacher);
			if (res.status === 200) {
				const newTeacherList = fmSelectArr(res.data.data, 'FullNameUnicode', 'UserInformationID');
				setOptionListForForm((prevState) => ({
					...prevState,
					teacherList: newTeacherList
				}));
			}
			if (res.status === 204) {
				setOptionListForForm((prevState) => ({
					...prevState,
					teacherList: []
				}));
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ProgramID',
				status: false
			});
		}
	};
	useEffect(() => {
		if (dataToFetchTeacher.ProgramID && dataToFetchTeacher.BranchID) {
			fetchTeacher();
		}
	}, [dataToFetchTeacher]);
	// CURRICULUM: GET ENOUGH 2 VALUE TO GET CURRICULUM - NEED PROGRAM ID - STUDY TIME ID
	const getValueBeforeFetchCurriculum = async (key: string, value: number) => {
		setDataToFetchCurriculum((prevState) => ({
			...prevState,
			[key]: value
		}));
	};
	const fetchCurriculum = async () => {
		setIsLoading({
			type: 'ProgramID',
			status: true
		});

		try {
			const res = await curriculumApi.getAll({
				StudyTimeID: dataToFetchCurriculum.StudyTimeID,
				ProgramID: dataToFetchCurriculum.ProgramID
			});
			if (res.status === 200) {
				const newCurriculum = fmSelectArr(res.data.data, 'CurriculumName', 'ID');
				setOptionListForForm((prevState) => ({
					...prevState,
					curriculumList: newCurriculum
				}));
			}
			if (res.status === 204) {
				setOptionListForForm((prevState) => ({
					...prevState,
					curriculumList: []
				}));
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ProgramID',
				status: false
			});
		}
	};
	useEffect(() => {
		if (dataToFetchCurriculum.ProgramID && dataToFetchCurriculum.StudyTimeID) {
			fetchCurriculum();
		}
	}, [dataToFetchCurriculum]);
	// -----------GET COURSE-----------
	const getCourse = async (object: ICOCreateForm) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		try {
			const {
				BranchID,
				CurriculumID,
				StartDay: StartDate,
				ProgramID,
				TeacherID,
				GradeID,
				CourseName,
				SalaryOfLesson,
				Price,
				TimeCourse
			} = object;
			stoneDataToSave.current = {
				CourseName,
				AcademicUID: 0,
				BranchID,
				CurriculumID,
				ProgramID,
				TeacherID,
				GradeID,
				StartDay: StartDate,
				SalaryOfLesson: +SalaryOfLesson.replace(/\D/g, ''),
				Price: +Price.replace(/\D/g, ''),
				TimeCourse
			};
			const lessonParams = {
				CurriculumnID: CurriculumID,
				StartDate,
				BranchID,
				StudyTimeID: TimeCourse.map((t) => t.StudyTimeID).join(','),
				DaySelected: TimeCourse.map((t) => t.DaySelected).join(','),
				TeacherID
			};
			const studyDayParams = {
				BranchID,
				StartDate,
				StudyTimeID: TimeCourse.map((t) => t.StudyTimeID).join(','),
				DaySelected: TimeCourse.map((t) => t.DaySelected).join(',')
			};
			const arrRes = await Promise.all([lessonOnlineApi.getAll(lessonParams), studyDayOnlineApi.getAll(studyDayParams)])
				.then(([lessonList, studyDayList]) => {
					if (lessonList.status === 200) {
						setScheduleList({
							available: [],
							unavailable: lessonList.data.schedule
						});
					}
					if (studyDayList.status === 200) {
						setCalendarList(studyDayList.data.data);
					}
					if (lessonList.status === 200 && studyDayList.status === 200) {
						const finalTeacherList = optionListForForm.teacherList.filter((o) => o.value === TeacherID);
						setIsSave(true);
						setOptionListForADay({
							optionStudyTimeList: optionListForForm.studyTimeList.filter((opt) =>
								TimeCourse.map((t) => t.StudyTimeID).includes(opt.value as number)
							),
							optionTeacherList: lessonList.data.schedule.map((s) => ({
								id: s.ID,
								list: finalTeacherList
							}))
						});
						setOptionListForForm({
							...optionListForForm,
							teacherList: finalTeacherList
						});
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
				status: false
			});
		}
	};
	// -----------SCHEDULE-----------
	const onCheckTeacherAvailable = async (params: {
		id: number;
		TeacherID: number;
		Date: string;
		StudyTimeID: number;
		CourseID: number;
	}) => {
		try {
			setIsLoading({
				type: 'CHECK_SCHEDULE',
				status: true
			});
			const { id, ...rest } = params;
			const res = await checkTeacherApi.getAll(rest);
			const idxInOptList = optionListForADay.optionTeacherList.findIndex((o) => o.id === id);
			const newOptionTeacherList = [...optionListForADay.optionTeacherList];
			if (res.status === 200) {
				newOptionTeacherList.splice(idxInOptList, 1, {
					...optionListForADay.optionTeacherList[idxInOptList],
					list: optionListForForm.teacherList
				});
				setOptionListForADay({
					...optionListForADay,
					optionTeacherList: newOptionTeacherList
				});
				return true;
			}
			if (res.status === 204) {
				newOptionTeacherList.splice(idxInOptList, 1, {
					...optionListForADay.optionTeacherList[idxInOptList],
					list: [{ title: '----Giáo viên trống----', value: 0 }]
				});
				setOptionListForADay({
					...optionListForADay,
					optionTeacherList: newOptionTeacherList
				});
				return false;
			}
		} catch (error) {
		} finally {
			setIsLoading({
				type: 'CHECK_SCHEDULE',
				status: false
			});
		}
	};
	const checkDuplicateStudyTimeInDay = (arr: ISchedule[], vl: number) => {
		const scheduleSameStudyTime = arr.filter((s) => s.CaID === vl);
		if (scheduleSameStudyTime.length > 1) {
			return true;
		}
		return false;
	};
	const getNewValueForSchedule = async (uid: number, date: string, key: 'CaID', vl: number) => {
		const { optionStudyTimeList } = optionListForADay;

		switch (key) {
			case 'CaID':
				const CaName = optionStudyTimeList.find((o) => o.value === vl)?.title;

				const isHasTeacher = await onCheckTeacherAvailable({
					id: uid,
					TeacherID: stoneDataToSave.current.TeacherID,
					CourseID: 0,
					StudyTimeID: Number(vl),
					Date: date
				});

				const newTeacher = isHasTeacher
					? {
							TeacherID: stoneDataToSave.current.TeacherID,
							TeacherName: optionListForForm.teacherList[0].title
					  }
					: {
							TeacherID: 0,
							TeacherName: 'Giáo viên trống'
					  };
				return {
					...newTeacher,
					CaName,
					[key]: vl
				};
			default:
				break;
		}
	};
	const getNewUnavailableScheduleList = async (uid: number, key: 'CaID', vl: number) => {
		const { unavailable } = scheduleList;
		const newUnavailable = [...unavailable];

		const idxSchedule = newUnavailable.findIndex((s) => s.ID === uid);

		// DATE TO CHECK DUPLICATE VALUE
		let date: string = '';
		if (idxSchedule >= 0) {
			const schedule = newUnavailable[idxSchedule];
			date = schedule.date;
			const newVl = await getNewValueForSchedule(uid, date, key, vl);
			const newSchedule = {
				...schedule,
				...newVl
			};
			newUnavailable.splice(idxSchedule, 1, newSchedule);
		}

		return { date, rs: newUnavailable };
	};
	const changeValueSchedule = async (uid: number, key: 'CaID', vl: number) => {
		const { rs: newUnavailableScheduleList, date } = await getNewUnavailableScheduleList(uid, key, vl);
		const scheduleList = newUnavailableScheduleList.filter((s) => s.date === date);
		if (checkDuplicateStudyTimeInDay(scheduleList, vl)) {
			showNoti('danger', 'Dữ liệu trùng lập');
		}
		setDataModalCalendar({
			...dataModalCalendar,
			scheduleList: scheduleList
		});
		setScheduleList((prevState) => ({
			...prevState,
			unavailable: newUnavailableScheduleList
		}));
	};
	const changeStatusSchedule = async (sch: ISchedule, type: number = 1) => {
		const newScheduleUnavailableList = [...scheduleList.unavailable];
		const newScheduleAvailableList = [...scheduleList.available];
		const fmDate = moment(dataModalCalendar.dateString).format('YYYY-MM-DD');
		const fmScheduleUnavailableToObject = fmArrayToObjectWithSpecialKey(newScheduleUnavailableList, 'date');
		// type = 2 => unavailable to available
		if (type === 2) {
			const idx = newScheduleUnavailableList.findIndex((s) => s.ID === sch.ID);
			const newScheduleObj = {
				...newScheduleUnavailableList[idx],
				date: fmDate
			};
			newScheduleUnavailableList.splice(idx, 1);
			newScheduleAvailableList.push(newScheduleObj);
		}
		// type = 1 => available to unavailable
		if (type === 1) {
			const limit = calendarList.find((c) => c.Day === dataModalCalendar.dateString).Limit;
			if (fmScheduleUnavailableToObject[fmDate]?.length >= limit) {
				showNoti('danger', 'Số ca đạt giới hạn');
				return false;
			}
			const idx = newScheduleAvailableList.findIndex((s) => s.ID === sch.ID);
			const newScheduleObj = {
				...newScheduleAvailableList[idx],
				date: fmDate
			};
			// CHECK AVAILABLE TEACHER
			const newTeacher = await getNewValueForSchedule(newScheduleObj.ID, fmDate, 'CaID', newScheduleObj.CaID);

			newScheduleAvailableList.splice(idx, 1);
			newScheduleUnavailableList.push({ ...newScheduleObj, ...newTeacher });
		}
		setScheduleList((prevState) => ({
			...prevState,
			available: newScheduleAvailableList,
			unavailable: newScheduleUnavailableList
		}));
		return true;
	};

	// -----------CALENDAR-----------
	const calendarDateFormat = (calendarArr: IStudyDay[]) => {
		const { unavailable } = scheduleList;
		const fmScheduleUnavailableToObject = fmArrayToObjectWithSpecialKey(unavailable, 'date');
		const rs = calendarArr.map((c, idx) => {
			let isValid = true;
			let limit = c.Limit;
			let scheduleListForADay = [];
			let title = `Số buổi trống: ${limit}`;

			const calendarHadSchedule = fmScheduleUnavailableToObject[c.Day.slice(0, 10)]?.length;

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
					scheduleList: scheduleListForADay
				}
			};
		});
		return rs;
	};
	const onToggleSchedule = async (sch: ISchedule, type: number) => {
		const isChangeStatus = await changeStatusSchedule(sch, type);
		if (isChangeStatus) {
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
				scheduleList: newScheduleList
			});
		}
	};
	// -----------SAVE COURSE-----------
	const getTitle = (arr: IOptionCommon[], vl) => arr.find((p) => p.value === vl).title;
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
	const onValidateDataToSave = () => {
		const { unavailable } = scheduleList;
		const rs: {
			show: {
				date: string;
				dayOffWeek: string;
				studyTimeName: string;
				teacherName: string;
				StudyTimeID: number;
				isValid: boolean;
			}[];
			save: ICOScheduleListToSave[];
			endDate: number;
		} = {
			show: [],
			save: [],
			endDate: 0
		};
		for (let i = 0, len = unavailable.length; i < len; i++) {
			const s = unavailable[i];
			// get end date of course
			const checkEndDay = moment(s.date).valueOf();
			if (rs.endDate < checkEndDay) {
				rs.endDate = checkEndDay;
			}
			const dayArr = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
			const dayOffWeek = dayArr[moment(s.date).day()];
			let isValid = !s.TeacherID;
			for (let i2 = 0; i2 < len; i2++) {
				const s2 = scheduleList.unavailable[i2];
				if (i !== i2 && s.date === s2.date && s.CaID === s2.CaID) {
					isValid = true;
					break;
				}
			}
			rs.show.push({
				date: s.date,
				dayOffWeek,
				studyTimeName: s.CaName,
				teacherName: s.TeacherName,
				StudyTimeID: s.CaID,
				isValid
			});
			rs.save.push({
				CurriculumsDetailID: s.Tiet.CurriculumsDetailID,
				Date: s.date,
				StudyTimeID: s.CaID,
				TeacherID: s.TeacherID,
				SubjectID: s.Tiet.SubjectID
			});
		}
		return rs;
	};
	const onFetchDataToSave = () => {
		const { branchList, programList, curriculumList, studyTimeList, teacherList } = optionListForForm;
		const { show, save, endDate } = onValidateDataToSave();

		const scheduleListSorted = show.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());

		const fmScheduleShowToObject = fmArrayToObjectWithSpecialKey(scheduleListSorted, 'date');

		const { BranchID, ProgramID, CurriculumID, StartDay, CourseName, TeacherID, TimeCourse } = stoneDataToSave.current;

		const BranchName = getTitle(branchList, BranchID);
		const ProgramName = getTitle(programList, ProgramID);
		const TeacherName = getTitle(teacherList, TeacherID);
		const CurriculumName = getTitle(curriculumList, CurriculumID);

		const daySelectedListString = TimeCourse.map((t) => t.DaySelected).join(',');
		const DaySelectedName = getMultiTitle(dayOfWeek, daySelectedListString);
		const studyTimeListString = TimeCourse.map((t) => t.StudyTimeID).join(',');
		const StudyTimeName = getMultiTitle(studyTimeList, studyTimeListString);

		const CourseNameFinal = CourseName
			? CourseName
			: `[${BranchName}][${ProgramName}][${CurriculumName}][${StudyTimeName}] - ${moment(StartDay).format('DD/MM/YYYY')}`;

		setScheduleShow(fmScheduleShowToObject);
		setSaveCourseInfo({
			...saveCourseInfo,
			...stoneDataToSave.current,
			CourseName: CourseNameFinal,
			BranchName,
			ProgramName,
			TeacherName,
			CurriculumName,
			DaySelectedName,
			StudyTimeName,
			DaySelected: daySelectedListString,
			StudyTimeID: studyTimeListString,
			EndDay: moment(endDate).format('YYYY/MM/DD'),
			Schedule: save
		});
	};
	const onSaveCourse = async () => {
		setIsLoading({
			type: 'SAVE_COURSE',
			status: true
		});

		try {
			const haveErrors = Object.keys(scheduleShow).find((date, idx) => scheduleShow[date].find((s) => s.isValid));
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
				status: false
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
									handleFetchDataByBranch={fetchStaffByBranch}
									handleFetchProgramByGrade={fetchProgramByGrade}
									handleGetValueBeforeFetchCurriculum={getValueBeforeFetchCurriculum}
									handleGetValueBeforeFetchTeacher={getValueBeforeFetchTeacher}
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
						<CreateCourseCalendar
							eventList={calendarDateFormat(calendarList)}
							//
							isLoaded={true}
							//
							handleSetDataModalCalendar={setDataModalCalendar}
							dataModalCalendar={dataModalCalendar}
							//
							unAvailableList={
								<Schedule>
									<ScheduleList>
										{scheduleList.available.map((s, idx) => (
											<ScheduleOnlineItem key={idx} scheduleObj={s} handleChangeStatusSchedule={onToggleSchedule} />
										))}
									</ScheduleList>
								</Schedule>
							}
						>
							<ScheduleList panelActiveListInModal={dataModalCalendar.scheduleList.map((_, idx) => idx)}>
								{dataModalCalendar.scheduleList.map((s, idx) => (
									<ScheduleOnlineItem
										key={idx}
										isUnavailable={true}
										scheduleObj={s}
										isLoading={isLoading}
										handleChangeValueSchedule={changeValueSchedule}
										handleChangeStatusSchedule={onToggleSchedule}
										optionTeacherList={optionListForADay.optionTeacherList.find((o) => o.id === s.ID)?.list || []}
										optionStudyTime={optionListForADay.optionStudyTimeList}
									/>
								))}
							</ScheduleList>
						</CreateCourseCalendar>
					</Card>
				</div>
				<div className="col-md-4 col-12 d-none d-md-block">
					<Schedule>
						<ScheduleList>
							{scheduleList.available.map((s, idx) => (
								<ScheduleOnlineItem key={idx} scheduleObj={s} handleChangeStatusSchedule={onToggleSchedule} />
							))}
						</ScheduleList>
					</Schedule>
				</div>
			</div>
		</div>
	);
};

export default CreateCourseOnline;
