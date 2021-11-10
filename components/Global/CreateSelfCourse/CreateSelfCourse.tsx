import { Card } from 'antd';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import {
	branchApi,
	curriculumApi,
	gradeApi,
	programApi,
	staffApi,
	createSelfCourse,
	getScheduleSelfCourse,
	checkStudyTimeSelfCourse
} from '~/apiBase';
import TitlePage from '~/components/TitlePage';
import { useWrap } from '~/context/wrap';
import { fmArrayToObjectWithSpecialKey, fmSelectArr } from '~/utils/functions';
import Schedule from '../CreateCourse/Schedule/Schedule';
import ScheduleList from '../CreateCourse/Schedule/ScheduleList';
import CreateSelfCourseCalendar from './Calendar/CreateSelfCourseCalendar';
import CreateSelfCourseForm from './CreateSelfCourseForm/CreateSelfCourseForm';
import SaveSelfCourse from './SaveSelfCourse';
import ScheduleSelfItem from './ScheduleSelf/ScheduleSelfItem';
import { useDebounce } from '~/context/useDebounce';

// ------------ MAIN COMPONENT ------------------
type IOptionListForForm = {
	branchList: IOptionCommon[];
	gradeList: IOptionCommon[];
	programList: IOptionCommon[];
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
	available: ISelfCourseSchedule[];
	unavailable: ISelfCourseSchedule[];
};
type ICreateCourseScheduleShowList = {
	[k: string]: ISelfCourseSchedule[];
};
type IDataModal = {
	dateString: string;
	scheduleList: ISelfCourseSchedule[];
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
	ProgramID: number;
	ProgramName: string;
	CurriculumID: number;
	CurriculumName: string;
	StartDay: string;
	EndDay: string;
	Schedule: IScheduleListToSave[];
};
const CreateSelfCourse = () => {
	const router = useRouter();
	// -----------STATE-----------
	// FORM
	const { showNoti } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [optionListForForm, setOptionListForForm] = useState<IOptionListForForm>({
		branchList: [],
		gradeList: [],
		programList: [],
		curriculumList: [],
		userInformationList: []
	});
	//Lesson
	const [scheduleList, setScheduleList] = useState<ICreateCourseScheduleList>({
		available: [],
		unavailable: []
	});
	const [optionListForADay, setOptionListForADay] = useState<IOptionListForADay>({
		optionStudyTimeList: [],
		list: [
			{
				optionTeacherList: []
			}
		]
	});
	//StudyDay
	const [calendarList, setCalendarList] = useState<{ Day: string }[]>([]);
	// SAVE
	const [isSave, setIsSave] = useState(false);
	const [scheduleShow, setScheduleShow] = useState<ICreateCourseScheduleShowList>({});
	const stoneDataToSave = useRef({
		CourseName: '',
		AcademicUID: 0,
		BranchID: 0,
		CurriculumID: 0,
		ProgramID: 0,
		StartDay: '',
		GradeID: 0,
		DaySelected: '',
		StudyTimeID: ''
	});
	const [saveCourseInfo, setSaveCourseInfo] = useState<ISaveCourseInfo>({
		CourseName: '',
		AcademicUID: 0,
		BranchID: 0,
		BranchName: '',
		GradeID: 0,
		ProgramID: 0,
		ProgramName: '',
		CurriculumID: 0,
		CurriculumName: '',
		StartDay: '',
		EndDay: '',
		Schedule: []
	});
	// CALENDAR MODAL
	const [dataModalCalendar, setDataModalCalendar] = useState<IDataModal>({
		dateString: '',
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
			const [branch, grade] = await Promise.all([
				branchApi.getAll({ pageIndex: 1, pageSize: 9999 }),
				gradeApi.getAll({ selectAll: true })
			]);
			// BRANCH
			const newBranchList = fmSelectArr(branch.data.data, 'BranchName', 'ID');
			// GRADE
			const newGradeList = fmSelectArr(grade.data.data, 'GradeName', 'ID');
			setOptionListForForm({
				...optionListForForm,
				branchList: newBranchList,
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
				const newProgramList = fmSelectArr(res.data.data, 'ProgramName', 'ID');
				setOptionListForForm((preState) => ({
					...preState,
					programList: newProgramList
				}));
			}
			if (res.status === 204) {
				setOptionListForForm((preState) => ({
					...preState,
					programList: []
				}));
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
	const fetchCurriculumByProgram = async (id: number) => {
		setIsLoading({
			type: 'ProgramID',
			status: true
		});

		try {
			const res = await curriculumApi.getAll({
				ProgramID: id
			});
			if (res.status === 200) {
				const newCurriculum = fmSelectArr(res.data.data, 'CurriculumName', 'ID');
				setOptionListForForm((preState) => ({
					...preState,
					curriculumList: newCurriculum
				}));
			}
			if (res.status === 204) {
				setOptionListForForm((preState) => ({
					...preState,
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
	//CREATE SCHEDULE
	const createCalendarBlankList = (sDate: string, eDate: string) => {
		const dates = [];
		const currDate = moment(sDate).startOf('day');
		const lastDate = moment(eDate).startOf('day');

		do {
			dates.push({ Day: currDate.clone().format('YYYY/MM/DD') });
		} while (currDate.add(1, 'days').diff(lastDate) <= 0);

		return dates;
	};

	// -----------SCHEDULE-----------
	// // FETCH DATA FOR SELECT SCHEDULE
	const fetchInfoAvailableSchedule = async (arrSchedule: ISelfCourseSchedule[]) => {
		// paramsArr = [ {params teacher of schedule} ]
		const paramsArr = arrSchedule.map(({ Date }, idx) => Date);
		try {
			if (!paramsArr.length) return;
			// promises = [ {checkTeacher promise} ]
			const promises = paramsArr.map((param) => checkStudyTimeSelfCourse(param));
			await Promise.all(promises)
				.then((res) => {
					// res = [ {data teacher schedule 1} ]
					// newOptionForSchedule = [ {optionTeacherList:[]} ]
					const newOptionForSchedule = res.map((teacherRes) => {
						const rs = {
							optionTeacherList: [{ title: '---Chọn giáo viên---', value: 0 }]
						};

						if (teacherRes.status === 200) {
							rs.optionTeacherList = [...rs.optionTeacherList, ...fmSelectArr(teacherRes.data.data, 'name', 'id', ['name'])];
						}
						return rs;
					});
					setOptionListForADay((prevState) => ({
						...prevState,
						list: newOptionForSchedule
					}));
				})
				.catch((err) => console.log('fetchInfoAvailableSchedule - PromiseAll:', err));
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'CHECK_SCHEDULE',
				status: false
			});
		}
	};
	const onDebounceFetch = useDebounce(fetchInfoAvailableSchedule, 300, []);
	const onDebounceFetchInfoAvailableSchedule = (params: ISelfCourseSchedule[]) => {
		setIsLoading({
			type: 'CHECK_SCHEDULE',
			status: true
		});
		onDebounceFetch(params);
	};
	// const checkDuplicateStudyTimeInDay = (arr: ISchedule[], vl) => {
	// 	const scheduleSameStudyTime = arr.filter((s) => s.CaID === vl);
	// 	if (scheduleSameStudyTime.length > 1) {
	// 		return true;
	// 	}
	// 	return false;
	// };
	// const getNewValueForSchedule = (key, vl, pos) => {
	// 	const { optionTeacherList } = optionListForADay.list[pos];
	// 	switch (key) {
	// 		case 'CaID':
	// 			const CaName = optionListForADay.optionStudyTimeList.find((o) => o.value === vl)?.title;
	// 			return {
	// 				TeacherID: 0,
	// 				TeacherName: 'Giáo viên trống',
	// 				CaName,
	// 				[key]: vl
	// 			};
	// 		case 'TeacherID':
	// 			const TeacherName = optionTeacherList.find((o) => o.value === vl)?.title;
	// 			return {
	// 				TeacherName: vl ? TeacherName : 'Giáo viên trống',
	// 				[key]: vl
	// 			};
	// 		default:
	// 			break;
	// 	}
	// };
	// const getNewUnavailableScheduleList = (uid, key, vl, pos) => {
	// 	const { unavailable } = scheduleList;
	// 	// DATE TO CHECK DUPLICATE VALUE
	// 	let date;
	// 	const rs = unavailable.map((s) => {
	// 		if (s.ID === uid) {
	// 			const newVl = getNewValueForSchedule(key, vl, pos);
	// 			date = s.date;
	// 			return {
	// 				...s,
	// 				...newVl
	// 			};
	// 		} else {
	// 			return s;
	// 		}
	// 	});
	// 	return { date, rs };
	// };
	// const changeValueSchedule = (uid: number, key: 'CaID' | 'TeacherID', vl: number | string, pos: number) => {
	// 	const { rs: newUnavailableScheduleList, date } = getNewUnavailableScheduleList(uid, key, vl, pos);

	// 	if (key === 'CaID') {
	// 		const scheduleList = newUnavailableScheduleList.filter((s) => s.date === date);
	// 		if (checkDuplicateStudyTimeInDay(scheduleList, vl)) {
	// 			showNoti('danger', 'Dữ liệu trùng lập');
	// 		} else {
	// 			setDataModalCalendar({
	// 				...dataModalCalendar,
	// 				scheduleList: scheduleList
	// 			});
	// 		}
	// 	}
	// 	setScheduleList((prevState) => ({
	// 		...prevState,
	// 		unavailable: newUnavailableScheduleList
	// 	}));
	// };
	const changeStatusSchedule = (sch: ISelfCourseSchedule, type: number = 1) => {
		if (!dataModalCalendar.dateString) {
			showNoti('danger', 'Bạn chưa chọn ngày');
			return false;
		}
		const newScheduleUnavailableList = [...scheduleList.unavailable];
		const newScheduleAvailableList = [...scheduleList.available];
		const fmDate = moment(dataModalCalendar.dateString).format('YYYY/MM/DD');
		// type = 2 => unavailable to available
		if (type === 2) {
			const idx = newScheduleUnavailableList.findIndex((s) => s.ID === sch.ID);
			const newScheduleObj = {
				...newScheduleUnavailableList[idx],
				Date: fmDate
			};
			newScheduleUnavailableList.splice(idx, 1);
			newScheduleAvailableList.push(newScheduleObj);
		}
		// type = 1 => available to unavailable
		if (type === 1) {
			const idx = newScheduleAvailableList.findIndex((s) => s.ID === sch.ID);
			const newScheduleObj = {
				...newScheduleAvailableList[idx],
				Date: fmDate
			};
			newScheduleAvailableList.splice(idx, 1);
			newScheduleUnavailableList.push(newScheduleObj);
		}
		setScheduleList({
			...scheduleList,
			available: newScheduleAvailableList,
			unavailable: newScheduleUnavailableList
		});
		return true;
	};
	// -----------CALENDAR-----------
	const calendarDateFormat = (calendarArr: { Day: string }[]) => {
		const { unavailable } = scheduleList;
		const fmScheduleUnavailableToObject = fmArrayToObjectWithSpecialKey(unavailable, 'Date');

		const rs = calendarArr.map((c, idx) => {
			const scheduleListForADay = fmScheduleUnavailableToObject[c.Day]?.length ? fmScheduleUnavailableToObject[c.Day] : [];

			return {
				id: idx + 1,
				title: '',
				start: moment(c.Day).toDate(),
				end: moment(c.Day).toDate(),
				resource: {
					dateString: c.Day,
					scheduleList: scheduleListForADay
				}
			};
		});
		return rs;
	};

	const onToggleSchedule = (sch: ISelfCourseSchedule, type: number) => {
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
				scheduleList: newScheduleList
			});
		}
	};
	// useEffect(() => {
	// 	const { scheduleList } = dataModalCalendar;
	// 	if (scheduleList.length) {
	// 		onDebounceFetchInfoAvailableSchedule(scheduleList);
	// 	}
	// }, [dataModalCalendar]);
	// // -----------SAVE COURSE-----------

	// const getTitle = (arr: IOptionCommon[], vl) => arr.find((p) => p.value === vl).title;
	// const getMultiTitle = (arrList: IOptionCommon[], arrVl: string) => {
	// 	const rs = [];
	// 	for (const r1 of arrVl.split(',')) {
	// 		for (const r2 of arrList) {
	// 			if (+r1 === r2.value) {
	// 				rs.push(r2.title);
	// 				break;
	// 			}
	// 		}
	// 	}
	// 	return rs.join(', ');
	// };
	// const onValidateDateToSave = () => {
	// 	const { unavailable } = scheduleList;
	// 	const rs: {
	// 		show: {
	// 			date: string;
	// 			dayOffWeek: string;
	// 			studyTimeName: string;
	// 			teacherName: string;
	// 			StudyTimeID: number;
	// 			isValid: boolean;
	// 		}[];
	// 		save: IScheduleListToSave[];
	// 		endDate: number;
	// 	} = {
	// 		show: [],
	// 		save: [],
	// 		endDate: 0
	// 	};
	// 	for (let i = 0, len = unavailable.length; i < len; i++) {
	// 		const s = unavailable[i];
	// 		// get end date of course
	// 		const checkEndDay = moment(s.date).valueOf();
	// 		if (rs.endDate < checkEndDay) {
	// 			rs.endDate = checkEndDay;
	// 		}
	// 		const dayArr = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
	// 		const dayOffWeek = dayArr[moment(s.date).day()];
	// 		let isValid = !s.TeacherID;
	// 		for (let i2 = 0; i2 < len; i2++) {
	// 			const s2 = scheduleList.unavailable[i2];
	// 			if (i !== i2 && s.date === s2.date && s.CaID === s2.CaID) {
	// 				isValid = true;
	// 			}
	// 		}
	// 		rs.show.push({
	// 			date: s.date,
	// 			dayOffWeek,
	// 			studyTimeName: s.CaName,
	// 			teacherName: s.TeacherName,
	// 			StudyTimeID: s.CaID,
	// 			isValid
	// 		});
	// 		rs.save.push({
	// 			CurriculumsDetailID: s.Tiet.CurriculumsDetailID,
	// 			Date: s.date,
	// 			StudyTimeID: s.CaID,
	// 			TeacherID: s.TeacherID,
	// 			SubjectID: s.Tiet.SubjectID
	// 		});
	// 	}
	// 	return rs;
	// };
	// const onFetchDataToSave = () => {
	// 	const { branchList, programList, curriculumList } = optionListForForm;
	// 	const { show, save, endDate } = onValidateDateToSave();

	// 	const scheduleListSorted = show.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());

	// 	const fmScheduleShowToObject = fmArrayToObjectWithSpecialKey(scheduleListSorted, 'date');

	// 	const { BranchID, ProgramID, CurriculumID, DaySelected, StudyTimeID, StartDay, CourseName } = stoneDataToSave.current;

	// 	const BranchName = getTitle(branchList, BranchID);
	// 	const ProgramName = getTitle(programList, ProgramID);
	// 	const CurriculumName = getTitle(curriculumList, CurriculumID);
	// 	const CourseNameFinal = CourseName
	// 		? CourseName
	// 		: `[${BranchName}][${ProgramName}][${CurriculumName}] - ${moment(StartDay).format('DD/MM/YYYY')}`;

	// 	setScheduleShow(fmScheduleShowToObject);
	// 	setSaveCourseInfo({
	// 		...saveCourseInfo,
	// 		...stoneDataToSave.current,
	// 		CourseName: CourseNameFinal,
	// 		BranchName,
	// 		ProgramName,
	// 		CurriculumName,
	// 		EndDay: moment(endDate).format('YYYY/MM/DD'),
	// 		Schedule: save
	// 	});
	// };
	// const onSaveCourse = async () => {
	// 	setIsLoading({
	// 		type: 'SAVE_COURSE',
	// 		status: true
	// 	});

	// 	try {
	// 		const haveErrors = Object.keys(scheduleShow).find((date, idx) => scheduleShow[date].find((s) => s.isValid));
	// 		if (haveErrors) {
	// 			showNoti('danger', 'Đã xảy ra lỗi. Xin kiểm tra lại');
	// 			return;
	// 		}
	// 		const res = await courseApi.add(saveCourseInfo);
	// 		if (res.status === 200) {
	// 			showNoti('success', res.data.message);
	// 			router.push('/course/course-list/');
	// 			return res;
	// 		}
	// 	} catch (error) {
	// 		showNoti('error', error.message);
	// 	} finally {
	// 		setIsLoading({
	// 			type: 'SAVE_COURSE',
	// 			status: false
	// 		});
	// 	}
	// };
	// CREATE COURSE
	const getTitle = (arr: IOptionCommon[], vl) => arr.find((p) => p.value === vl).title;
	const onCreateCourse = async (object) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		try {
			const { branchList, programList, curriculumList } = optionListForForm;
			const { BranchID, ProgramID, Price, CurriculumID, CourseName, SalaryOfLesson, StartDay, EndDay, UserInformationID } = object;
			const startDayFm = moment(StartDay).format('YYYY/MM/DD');
			const endDayFm = moment(EndDay).format('YYYY/MM/DD');

			const BranchName = getTitle(branchList, BranchID);
			const ProgramName = getTitle(programList, ProgramID);
			const CurriculumName = getTitle(curriculumList, CurriculumID);
			const CourseNameFinal = CourseName
				? CourseName
				: `[${BranchName}][${ProgramName}][${CurriculumName}] - ${moment(StartDay).format('DD/MM/YYYY')}`;

			const fmValues: IPostSelfCourse = {
				...object,
				Price: parseInt(Price.replace(/\D/g, '')),
				SalaryOfLesson: parseInt(SalaryOfLesson.replace(/\D/g, '')),
				StartDay: startDayFm,
				EndDay: endDayFm,
				AcademicUID: UserInformationID,
				CourseName: CourseNameFinal
			};
			const res = await createSelfCourse(fmValues);
			if (res.status === 200) {
				const scheduleList = await getScheduleSelfCourse(res.data.data.ID);
				const calendarBlankList = createCalendarBlankList(startDayFm, endDayFm);
				setIsSave(true);
				setScheduleList({
					unavailable: scheduleList.data.courseSchedulesArranged,
					available: scheduleList.data.courseSchedulesInarranged
				});
				setCalendarList(calendarBlankList);
				showNoti('success', 'Tạo khóa học thành công. Hãy sắp xếp lịch học');
				return true;
			}
		} catch (error) {
			showNoti('error', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
	};
	return (
		<div className="create-course">
			<TitlePage title="Tạo khóa học 1 với 1" />
			<div className="row">
				<div className="col-md-8 col-12">
					<Card
						title="Sắp xếp lịch học"
						extra={
							<div className="btn-page-course">
								<CreateSelfCourseForm
									isLoading={isLoading}
									isUpdate={false}
									//
									optionListForForm={optionListForForm}
									//
									handleGetCourse={onCreateCourse}
									handleFetchDataByBranch={fetchStaffByBranch}
									handleFetchProgramByGrade={fetchProgramByGrade}
									handleFetchCurriculumByProgram={fetchCurriculumByProgram}
								/>
								{isSave && (
									<SaveSelfCourse
										isLoading={isLoading}
										saveInfo={saveCourseInfo}
										scheduleShow={scheduleShow}
										// handleSaveCourse={onSaveCourse}
										// handleFetchDataToSave={onFetchDataToSave}
									/>
								)}
							</div>
						}
					>
						<CreateSelfCourseCalendar
							eventList={calendarDateFormat(calendarList)}
							//
							isLoaded={true}
							//
							handleSetDataModalCalendar={setDataModalCalendar}
							dataModalCalendar={dataModalCalendar}
						>
							<ScheduleList panelActiveListInModal={dataModalCalendar.scheduleList.map((_, idx) => idx)}>
								{dataModalCalendar.scheduleList.map((s, idx) => (
									<ScheduleSelfItem
										key={idx}
										isUpdate={true}
										scheduleObj={s}
										isLoading={isLoading}
										// handleChangeValueSchedule={(uid, key, vl) => changeValueSchedule(uid, key, vl, idx)}
										handleChangeStatusSchedule={onToggleSchedule}
										optionTeacherList={optionListForADay.list[idx]?.optionTeacherList}
										optionStudyTime={optionListForADay.optionStudyTimeList}
									/>
								))}
							</ScheduleList>
						</CreateSelfCourseCalendar>
					</Card>
				</div>
				<div className="col-md-4 col-12">
					<Schedule>
						<ScheduleList>
							{scheduleList.available.map((s, idx) => (
								<ScheduleSelfItem
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

export default CreateSelfCourse;
