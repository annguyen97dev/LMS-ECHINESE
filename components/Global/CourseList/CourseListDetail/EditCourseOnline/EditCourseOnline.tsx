import { Card } from 'antd';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import {
	checkTeacherApi,
	courseDetailApi,
	courseOnlineDetailAvailableDayApi,
	IApiCourseSchedule,
	studyTimeApi,
	subjectApi
} from '~/apiBase';
import CreateCourseCalendar from '~/components/Global/CreateCourse/Calendar/CreateCourseCalendar';
import Schedule from '~/components/Global/CreateCourse/Schedule/Schedule';
import ScheduleList from '~/components/Global/CreateCourse/Schedule/ScheduleList';
import SaveCreateCourseOnline from '~/components/Global/CreateCourseOnline/SaveCreateCourseOnline';
import ScheduleOnlineItem from '~/components/Global/CreateCourseOnline/ScheduleOnline/ScheduleOnlineItem';
import TitlePage from '~/components/TitlePage';
import { useWrap } from '~/context/wrap';
import { fmArrayToObjectWithSpecialKey, fmSelectArr } from '~/utils/functions';
import CreateNewScheduleForm from '../EditCourse/CreateNewScheduleForm';
import AvailableScheduleOnlineForm from './AvailableScheduleOnlineForm';

// ------------ MAIN COMPONENT ------------------
const EditCourseOnline = (props) => {
	const router = useRouter();
	const { slug: courseID } = router.query;
	// -----------STATE-----------
	// CREATE COURSE FORM STATE
	const { showNoti } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	//Lesson
	const [scheduleList, setScheduleList] = useState<ICOEditScheduleList>({
		available: [],
		unavailable: []
	});
	const [optionListForADay, setOptionListForADay] = useState<ICOOptionListForADay>({
		optionStudyTimeList: [],
		optionTeacherList: []
	});
	//StudyDay
	const [calendarList, setCalendarList] = useState<IStudyDay[]>([]);
	// SCHEDULE TO SHOW ON MODAL
	const [scheduleShow, setScheduleShow] = useState<ICOEditScheduleShowList>({});
	// CALENDAR MODAL
	const [dataModalCalendar, setDataModalCalendar] = useState<ICODataModalEdit>({
		dateString: '',
		limit: 0,
		scheduleInDay: 0,
		scheduleList: []
	});
	// EDIT
	const [isShowSaveBtnGroup, setIsShowSaveBtnGroup] = useState(false);
	const [optionListForGetAvailableSchedule, setOptionListForGetAvailableSchedule] = useState<{
		studyTimes: IOptionCommon[];
	}>({
		studyTimes: []
	});
	const [optionSubjectList, setOptionSubjectList] = useState<IOptionCommon[]>([]);
	const [scheduleListToSave, setScheduleListToSave] = useState<ICOScheduleListToSave[]>([]);
	const stoneScheduleListToFindDifference = useRef<ICourseDetailSchedule[]>([]);
	const [isClickAheadSchedule, setIsClickAheadSchedule] = useState(false);
	const [saveBeforeAheadSchedule, setSaveBeforeAheadSchedule] = useState(true);

	// -----------SAVE COURSE-----------
	const onFindScheduleChanged = (arr: ICourseDetailSchedule[]) => {
		const { current: stoneScheduleList } = stoneScheduleListToFindDifference;
		const rs: ICourseDetailSchedule[] = [];
		for (let i = 0, len = arr.length; i < len; i++) {
			const s = arr[i];
			if (typeof s.ID === 'string') {
				rs.push(s);
				continue;
			}
			for (let i2 = 0; i2 < stoneScheduleList.length; i2++) {
				const s2 = stoneScheduleList[i2];
				if (
					s.ID === s2.ID &&
					(moment(s.Date).format('YYYY/MM/DD') !== moment(s2.StartTime).format('YYYY/MM/DD') ||
						s.StudyTimeID !== s2.StudyTimeID ||
						s.TeacherID !== s2.TeacherID)
				) {
					// Date, StudyTimeID, TeacherID
					rs.push(s);
				}
			}
		}
		return rs;
	};
	const onValidateDateToSave = (arr: ICourseDetailSchedule[]) => {
		const { unavailable } = scheduleList;
		const rs: {
			show: Array<{
				ID: number;
				Date: string;
				dayOffWeek: string;
				StudyTimeID: number;
				studyTimeName: string;
				TeacherID: number;
				teacherName: string;
				isValid: boolean;
			}>;
			save: ICOEditScheduleListToSave[];
		} = {
			show: [],
			save: []
		};
		for (let i = 0, len = arr.length; i < len; i++) {
			const s = arr[i];
			const { ID, Date, StudyTimeName, TeacherID, TeacherName, StudyTimeID, CourseID, BranchID, SubjectID, CurriculumID } = s;
			const dayArr = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
			const dayOffWeek = dayArr[moment(s.Date).day()];
			let isValid = !s.TeacherID;
			for (let i2 = 0; i2 < unavailable.length; i2++) {
				const s2 = unavailable[i2];
				if (s.ID !== s2.ID && s.Date === s2.Date) {
					if (studyTimeOverFlow([s, s2])) {
						isValid = true;
						break;
					}
					if (s.StudyTimeID === s2.StudyTimeID) {
						isValid = true;
						break;
					}
				}
			}
			rs.show.push({
				ID: typeof ID === 'string' ? 0 : ID,
				Date,
				dayOffWeek,
				StudyTimeID,
				studyTimeName: StudyTimeName || optionListForADay.optionStudyTimeList.find((s) => s.value === StudyTimeID).title,
				TeacherID,
				teacherName: TeacherName,
				isValid
			});
			rs.save.push({
				ID: typeof ID === 'string' ? 0 : ID,
				CourseID,
				BranchID,
				CurriculumsDetailID: CurriculumID || 0,
				SubjectID,
				Date,
				StudyTimeID,
				TeacherID
			});
		}
		return rs;
	};
	const onFetchDataToSave = () => {
		const { unavailable } = scheduleList;

		const scheduleListChanged = onFindScheduleChanged(unavailable);
		const { show, save } = onValidateDateToSave(scheduleListChanged);

		const scheduleListSorted = show.sort((a, b) => moment(a.Date).valueOf() - moment(b.Date).valueOf());
		const fmScheduleListToShow = fmArrayToObjectWithSpecialKey(scheduleListSorted, 'Date');

		setScheduleShow(fmScheduleListToShow);
		setScheduleListToSave(save);
	};
	const onSaveCourse = async () => {
		setIsLoading({
			type: 'SAVE_COURSE',
			status: true
		});
		let res;
		try {
			const haveErrors = Object.keys(scheduleShow).find((date, idx) => scheduleShow[date].find((s) => s.isValid));
			if (haveErrors) {
				showNoti('danger', 'Đã xảy ra lỗi. Xin kiểm tra lại');
				return;
			}
			if (!scheduleListToSave.length) {
				showNoti('danger', 'Khóa học không có sự thay đổi');
				return;
			}
			res = await courseDetailApi.update(scheduleListToSave);
			if (res.status === 200) {
				setSaveBeforeAheadSchedule(true);
				showNoti('success', res.data.message);
				router.push(`/course/course-list/course-list-detail/${courseID}?type=2`);
			}
		} catch (error) {
			showNoti('error', error.message);
		} finally {
			setIsLoading({
				type: 'SAVE_COURSE',
				status: false
			});
		}
		return res;
	};
	const onCheckSaveBeforeAheadSchedule = () => {
		const { unavailable } = scheduleList;
		const scheduleListChanged = onFindScheduleChanged(unavailable);
		if (Array.from(scheduleListChanged) && scheduleListChanged.length >= 1) {
			setSaveBeforeAheadSchedule(false);
		}
	};
	useEffect(() => {
		onCheckSaveBeforeAheadSchedule();
	}, [scheduleList.unavailable]);
	// -----------SCHEDULE-----------
	const studyTimeOverFlow = (scheduleList: ICourseDetailSchedule[]) => {
		let rs = false;
		const studyTimeList = optionListForADay.optionStudyTimeList;
		const studyTimeIdList = scheduleList.map((s) => s.StudyTimeID).filter(Boolean);
		// COMPARE STUDY TIME RETURN TRUE IF INVALID
		for (let i = 0; i < studyTimeIdList.length - 1; i++) {
			const time1 = studyTimeList.find((s) => s.value === studyTimeIdList[i]);
			const s1 = +time1.options.TimeStart.replace(':', '');
			const e1 = +time1.options.TimeEnd.replace(':', '');

			for (let j = i + 1; j < studyTimeIdList.length; j++) {
				const time2 = studyTimeList.find((s) => s.value === studyTimeIdList[j]);
				const s2 = +time2.options.TimeStart.replace(':', '');
				const e2 = +time2.options.TimeEnd.replace(':', '');
				if (
					time1.value === time2.value ||
					(s1 < s2 && e1 > e2 && s1 < e2) ||
					(s1 > s2 && e1 > e2 && s1 < e2) ||
					(s1 < s2 && e1 < e2 && e1 > s2) ||
					(s1 > s2 && e1 < e2)
				) {
					rs = true;
				}
			}
		}
		return rs;
	};
	const getNewValueForSchedule = (uid: number | string, date: string, key: 'CaID' | 'TeacherID', vl: number) => {
		const { optionStudyTimeList } = optionListForADay;

		switch (key) {
			case 'CaID':
				const StudyTimeName = optionStudyTimeList.find((o) => o.value === vl)?.title;
				return {
					TeacherID: 0,
					TeacherName: 'Giáo viên trống',
					StudyTimeName,
					StudyTimeID: vl
				};
			case 'TeacherID':
				const optionTeacherList = optionListForADay.optionTeacherList.find((o) => o.id === uid)?.list || [];
				const newOptionTeacherList = [...optionTeacherList];
				const teacherName = newOptionTeacherList.find((o) => o.value === vl)?.title;
				return {
					TeacherName: vl ? teacherName : 'Giáo viên trống',
					[key]: vl
				};
				break;
			default:
				break;
		}
	};
	const getNewUnavailableScheduleList = (uid: number | string, key: 'CaID' | 'TeacherID', vl: number) => {
		const { unavailable } = scheduleList;
		const newUnavailable = [...unavailable];

		const idxSchedule = newUnavailable.findIndex((s) => s.ID === uid);

		// DATE TO CHECK DUPLICATE VALUE
		let date: string = '';
		if (idxSchedule >= 0) {
			const schedule = newUnavailable[idxSchedule];
			date = schedule.Date;
			const newVl = getNewValueForSchedule(uid, date, key, vl);
			const newSchedule = {
				...schedule,
				...newVl
			};
			newUnavailable.splice(idxSchedule, 1, newSchedule);
		}

		return { date, rs: newUnavailable };
	};
	const changeValueSchedule = (uid: number | string, key: 'CaID' | 'TeacherID', vl: number) => {
		const { rs: newUnavailableScheduleList, date } = getNewUnavailableScheduleList(uid, key, vl);
		const scheduleList = newUnavailableScheduleList.filter((s) => s.Date === date);
		if (studyTimeOverFlow(scheduleList)) {
			showNoti('danger', 'Dữ liệu không phù hợp');
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
	const changeStatusSchedule = async (sch: ICourseDetailSchedule, type = 1) => {
		const newDate = dataModalCalendar.dateString;
		if (!newDate) {
			showNoti('danger', 'Bạn chưa chọn ngày');
			return false;
		}
		const newScheduleUnavailableList = [...scheduleList.unavailable];
		const newScheduleAvailableList = [...scheduleList.available];
		const fmScheduleUnavailableToObject = fmArrayToObjectWithSpecialKey(newScheduleUnavailableList, 'Date');
		// type = 2 => unavailable to available
		if (type === 2) {
			const idx = newScheduleUnavailableList.findIndex((s) => s.ID === sch.ID);
			const newScheduleObj = {
				...newScheduleUnavailableList[idx],
				Date: newDate
			};
			newScheduleUnavailableList.splice(idx, 1);
			newScheduleAvailableList.push(newScheduleObj);
		}
		// type = 1 => available to unavailable
		if (type === 1) {
			const limit = calendarList.find((c) => c.Day === newDate)?.Limit;
			if (fmScheduleUnavailableToObject[newDate]?.length >= limit) {
				showNoti('danger', 'Số ca đạt giới hạn');
				return false;
			}
			const idx = newScheduleAvailableList.findIndex((s) => s.ID === sch.ID);
			const newScheduleObj = {
				...newScheduleAvailableList[idx],
				Date: newDate
			};
			newScheduleAvailableList.splice(idx, 1);
			newScheduleUnavailableList.push(newScheduleObj);
		}
		setScheduleList((prevState) => ({
			...prevState,
			available: newScheduleAvailableList,
			unavailable: newScheduleUnavailableList
		}));
		return true;
	};
	// -----------CALENDAR-----------
	const calendarDateFormat = (calendarArr: ICourseDetailAvailableDay[]) => {
		const { unavailable } = scheduleList;
		const fmScheduleUnavailableToObject = fmArrayToObjectWithSpecialKey(unavailable, 'Date');
		const rs = calendarArr.map((c, idx) => {
			let isValid = true;
			let limit = c.Limit;
			let scheduleList = [];
			let title = `Số buổi trống: ${limit}`;
			const calendarHadSchedule = fmScheduleUnavailableToObject[c.Day]?.length;

			if (calendarHadSchedule) {
				limit = c.Limit - calendarHadSchedule;
				scheduleList = fmScheduleUnavailableToObject[c.Day];
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
					scheduleList
				}
			};
		});
		return rs;
	};
	const onToggleSchedule = async (sch: ICourseDetailSchedule, type: number) => {
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
	const onCheckTeacherAvailable = async (params: {
		id: number | string;
		CourseID: number;
		StudyTimeID: number;
		TeacherID: number;
		ProgramID: number;
		BranchID: number;
		Date: string;
	}) => {
		try {
			setIsLoading({
				type: 'CHECK_SCHEDULE',
				status: true
			});
			const { id, TeacherID, ...rest } = params;

			const idxInOptList = optionListForADay.optionTeacherList.findIndex((o) => o.id === id);
			if (!params.StudyTimeID) {
				setOptionListForADay((prevState) => {
					const newOptList = [...prevState.optionTeacherList];
					newOptList.splice(idxInOptList, 1, {
						...prevState.optionTeacherList[idxInOptList],
						list: [{ title: '----Giáo viên trống----', value: 0 }]
					});
					return {
						...prevState,
						optionTeacherList: newOptList
					};
				});
				return false;
			}
			const res = await checkTeacherApi.getAllTeacherAvailable(rest);
			if (res.status === 200) {
				const newList = fmSelectArr(res.data.data, 'FullNameUnicode', 'UserInformationID');
				const finalList = [{ title: '----Giáo viên trống----', value: 0 }, ...newList];

				const isHadTeacherInList = finalList.some((o) => o.value === TeacherID); // kiểm tra nếu như trong buổi học còn giữ lại giá trị cũ nhưng api lại không có giá trị thỏa giá trị cũ
				if (!isHadTeacherInList) {
					changeValueSchedule(id, 'TeacherID', 0);
				}

				setOptionListForADay((prevState) => {
					const newOptList = [...prevState.optionTeacherList];
					newOptList.splice(idxInOptList, 1, {
						...prevState.optionTeacherList[idxInOptList],
						list: finalList
					});
					return {
						...prevState,
						optionTeacherList: newOptList
					};
				});
				return true;
			}
			if (res.status === 204) {
				setOptionListForADay((prevState) => {
					const newOptList = [...prevState.optionTeacherList];
					newOptList.splice(idxInOptList, 1, {
						...prevState.optionTeacherList[idxInOptList],
						list: [{ title: '----Giáo viên trống----', value: 0 }]
					});
					return {
						...prevState,
						optionTeacherList: newOptList
					};
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
	useEffect(() => {
		if (Array.isArray(dataModalCalendar.scheduleList) && dataModalCalendar.scheduleList.length >= 1) {
			dataModalCalendar.scheduleList.forEach((s) => {
				onCheckTeacherAvailable({
					id: s.ID,
					Date: dataModalCalendar.dateString,
					StudyTimeID: s.StudyTimeID,
					TeacherID: s.TeacherID,
					CourseID: +courseID,
					ProgramID: s.ProgramID,
					BranchID: s.BranchID
				});
			});
		}
	}, [dataModalCalendar.scheduleList]);
	// -----------EDIT COURSE-----------
	const fmCourseDetail = (res: IApiCourseSchedule<ICourseDetailSchedule[]>, isAheadSchedule?: boolean) => {
		const data = res.data;
		const newScheduleList = data.map((sch) => ({
			...sch,
			Date: moment(sch.StartTime).format('YYYY/MM/DD')
		}));
		if (!isAheadSchedule) {
			stoneScheduleListToFindDifference.current = newScheduleList;
		}

		const studyTimesFm = fmSelectArr(res.studyTimes, 'name', 'id', ['select']);

		const rs = {
			studyTimes: studyTimesFm
		};

		setOptionListForADay((preState) => ({
			...preState,
			optionTeacherList: data.map((s) => ({ id: +s.ID, list: [{ title: data[0].TeacherName, value: data[0].TeacherID }] }))
		}));
		setOptionListForGetAvailableSchedule(rs);
		setScheduleList({
			available: [],
			unavailable: newScheduleList
		});
		return rs;
	};
	const fetchCourseDetail = async () => {
		setIsLoading({
			type: 'FETCH_COURSE',
			status: true
		});
		try {
			const res = await courseDetailApi.getAll({ CourseID: courseID });
			if (res.status === 200) {
				const rs = fmCourseDetail(res.data);
				return rs;
			}
		} catch (error) {
			showNoti('error', error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_COURSE',
				status: false
			});
		}
	};
	const fetchSubject = async () => {
		setIsLoading({
			type: 'FETCH_SUBJECT',
			status: true
		});
		try {
			const res = await subjectApi.getAll({
				CourseID: courseID
			});
			if (res.status === 200) {
				const fmOption = fmSelectArr(res.data.data, 'SubjectName', 'ID');
				setOptionSubjectList([{ title: '---Chọn môn học---', value: 0 }, ...fmOption]);
			}
		} catch (error) {
			console.log('fetchSubject', error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_SUBJECT',
				status: false
			});
		}
	};
	const fetchStudyTime = async () => {
		try {
			const res = await studyTimeApi.getAll({
				CourseID: courseID
			});
			if (res.status === 200) {
				const fmOption = fmSelectArr(res.data.data, 'Name', 'ID', ['Time', 'TimeStart', 'TimeEnd']);

				setOptionListForADay((preState) => ({
					...preState,
					optionStudyTimeList: [
						{
							title: '---Chọn ca học---',
							value: 0
						},
						...fmOption
					]
				}));
			}
		} catch (error) {
			console.log('fetchStudyTime', error.message);
		}
	};
	const fetchAvailableSchedule = async (data: { StudyTimeID: number[] }) => {
		setIsShowSaveBtnGroup(false);
		setIsLoading({
			type: 'FETCH_SCHEDULE',
			status: true
		});
		try {
			const res = await courseOnlineDetailAvailableDayApi.getAll({
				StudyTime: data.StudyTimeID.join(','),
				Room: 0,
				CourseID: courseID
			});
			if (res.status === 200) {
				const newScheduleListFm = fmArrayToObjectWithSpecialKey(stoneScheduleListToFindDifference.current, 'Date');
				const dayListFm = res.data.data.map((d) => {
					const fmDay = moment(d.Day).format('YYYY/MM/DD');
					return {
						...d,
						Day: fmDay,
						Limit: newScheduleListFm[fmDay]?.length + d.Limit || d.Limit
					};
				});
				setIsShowSaveBtnGroup(true);
				setIsLoading({
					type: 'FETCH_SCHEDULE',
					status: false
				});
				setCalendarList(dayListFm);
				return true;
			}
			if (res.status === 204) {
				showNoti('danger', 'Không có ca trống');
			}
		} catch (error) {
			showNoti('error', error.message);
		}
	};
	const fetchAvailableScheduleFirstTime = async () => {
		const { studyTimes } = await fetchCourseDetail();
		const StudyTimeID = studyTimes.filter((r) => r.options.select).map((r) => r.value);
		if (StudyTimeID.length) {
			fetchAvailableSchedule({ StudyTimeID });
		}
	};
	const onCreateSchedule = (obj: { SubjectID: number; StudyDay: number }) => {
		setIsLoading({
			type: 'CREATE_SCHEDULE',
			status: true
		});
		let res;
		try {
			const { StudyDay, SubjectID } = obj;
			const rs = scheduleList.available;
			const newOptionTeacher = [];
			for (let i = 0; i < StudyDay; i++) {
				const newSchedule = {
					ID: `NewSch-${Math.floor(Math.random() * 10000)}`,
					CourseID: +courseID,
					CourseName: '',
					BranchID: scheduleList.unavailable[0].BranchID,
					BranchName: '',
					StudyTimeName: '----Ca học trống----',
					StudyTimeID: 0,
					Date: moment().format('YYYY/MM/DD'),
					StartTime: moment().format('YYYY/MM/DD'),
					EndTime: '',
					TeacherID: 0,
					TeacherName: '----Giáo viên trống----',
					SubjectID,
					SubjectName: optionSubjectList.find((s) => s.value === SubjectID).title,
					CurriculumID: scheduleList.unavailable[0].CurriculumID,
					ProgramID: scheduleList.unavailable[0].ProgramID,
					TeacherAttendanceID: 0
				};
				const newOption = {
					id: newSchedule.ID,
					list: []
				};
				newOptionTeacher.push(newOption);
				rs.push(newSchedule);
			}
			setScheduleList({
				...scheduleList,
				available: rs
			});
			setOptionListForADay((prevState) => ({
				...prevState,
				optionTeacherList: [...prevState.optionTeacherList, ...newOptionTeacher]
			}));
		} catch (error) {
			console.log('onCreateSchedule', error.message);
		} finally {
			setIsLoading({
				type: 'CREATE_SCHEDULE',
				status: false
			});
		}
		return res;
	};
	const onAheadSchedule = async (courseScheduleId: number, teacherId: number) => {
		try {
			setIsLoading({
				type: 'AHEAD_SCHEDULE',
				status: true
			});
			const res = await courseDetailApi.aheadSchedule({
				courseScheduleId,
				teacherId
			});
			if (res.status === 200) {
				setScheduleList({
					available: [],
					unavailable: []
				});
				setDataModalCalendar({
					...dataModalCalendar,
					scheduleInDay: dataModalCalendar.scheduleList.filter((s) => s.ID !== courseScheduleId).length,
					scheduleList: dataModalCalendar.scheduleList.filter((s) => s.ID !== courseScheduleId)
				});
				setIsClickAheadSchedule(true);

				await fmCourseDetail(res.data, true);
			}
		} catch (error) {
			if (error.status === 400) {
				showNoti('danger', error.message);
				setIsClickAheadSchedule(false);
			}
			console.log('onAheadSchedule', error.message);
		} finally {
			setIsLoading({
				type: 'AHEAD_SCHEDULE',
				status: false
			});
		}
	};
	useEffect(() => {
		let isMounted = true;
		if (isMounted) {
			fetchSubject();
			fetchStudyTime();
			fetchCourseDetail();
			fetchAvailableScheduleFirstTime();
		}
		return () => {
			isMounted = false;
		};
	}, []);
	return (
		<div className="create-course edit-course">
			<TitlePage title="Cập nhật khóa học" />
			<div className="row">
				<div className="col-md-8 col-12">
					<Card
						title="Sắp xếp lịch học"
						extra={
							<>
								<div className="btn-page-course">
									<AvailableScheduleOnlineForm
										isLoading={isLoading}
										handleGetAvailableSchedule={fetchAvailableSchedule}
										optionListForGetAvailableSchedule={optionListForGetAvailableSchedule}
									/>
									{isShowSaveBtnGroup && (
										<>
											<CreateNewScheduleForm
												isLoading={isLoading}
												optionSubjectList={optionSubjectList}
												handleOnCreateSchedule={onCreateSchedule}
											/>
											<SaveCreateCourseOnline
												isEdit={true}
												isLoading={isLoading}
												scheduleShow={scheduleShow}
												handleSaveCourse={onSaveCourse}
												handleFetchDataToSave={onFetchDataToSave}
											/>
										</>
									)}
								</div>
							</>
						}
					>
						<CreateCourseCalendar
							eventList={calendarDateFormat(calendarList)}
							isLoaded={isLoading.type === 'FETCH_SCHEDULE' && isLoading.status ? false : true}
							//
							handleSetDataModalCalendar={setDataModalCalendar}
							dataModalCalendar={dataModalCalendar}
							//
							unAvailableList={
								<Schedule>
									<ScheduleList>
										{scheduleList.available.map((s, idx) => (
											<ScheduleOnlineItem
												key={idx}
												scheduleObj={s}
												handleChangeStatusSchedule={onToggleSchedule}
												isEditView={true}
											/>
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
										isEditView={true}
										scheduleObj={s}
										isLoading={isLoading}
										handleChangeValueSchedule={changeValueSchedule}
										handleChangeStatusSchedule={onToggleSchedule}
										optionTeacherList={optionListForADay.optionTeacherList.find((o) => o.id === s.ID)?.list || []}
										optionStudyTime={optionListForADay.optionStudyTimeList}
										handleAheadSchedule={onAheadSchedule}
										isClickAheadSchedule={isClickAheadSchedule}
										saveBeforeAheadSchedule={saveBeforeAheadSchedule}
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
								<ScheduleOnlineItem
									key={idx}
									scheduleObj={s}
									handleChangeStatusSchedule={onToggleSchedule}
									isEditView={true}
								/>
							))}
						</ScheduleList>
					</Schedule>
				</div>
			</div>
		</div>
	);
};

export default EditCourseOnline;
