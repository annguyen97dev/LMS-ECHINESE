import { Card } from 'antd';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import {
	cancelScheduleSelfCourse,
	checkStudyTimeSelfCourse,
	checkTeacherSelfCourse,
	courseApi,
	dayOffApi,
	getScheduleSelfCourse,
	studyTimeApi,
	updateScheduleSelfCourse
} from '~/apiBase';
import Schedule from '~/components/Global/CreateCourse/Schedule/Schedule';
import ScheduleList from '~/components/Global/CreateCourse/Schedule/ScheduleList';
import CreateSelfCourseCalendar from '~/components/Global/CreateSelfCourse/Calendar/CreateSelfCourseCalendar';
import SaveSelfCourse from '~/components/Global/CreateSelfCourse/SaveSelfCourse';
import ScheduleSelfItem from '~/components/Global/CreateSelfCourse/ScheduleSelf/ScheduleSelfItem';
import TitlePage from '~/components/TitlePage';
import { useWrap } from '~/context/wrap';
import { fmArrayToObjectWithSpecialKey, fmSelectArr } from '~/utils/functions';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.

// ------------ MAIN COMPONENT ------------------
const EditSelfCourse = (props) => {
	const router = useRouter();
	const { slug: courseID } = router.query;
	// -----------STATE-----------
	// CREATE COURSE FORM STATE
	const { showNoti } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [studyTimeList, setStudyTimeList] = useState<IStudyTime[]>([]);
	//Lesson
	const [scheduleList, setScheduleList] = useState<ISCCreateScheduleList>({
		available: [],
		unavailable: []
	});
	const [optionListForADay, setOptionListForADay] = useState<ISCOptionListForADay>({
		optionStudyTimeList: [],
		optionTeacherList: []
	});
	//StudyDay
	const [calendarList, setCalendarList] = useState<IStudyDay[]>([]);
	// SCHEDULE TO SHOW ON MODAL
	const [scheduleShow, setScheduleShow] = useState<ISCCreateScheduleShowList>({});
	// CALENDAR MODAL
	const [dataModalCalendar, setDataModalCalendar] = useState<ISCDataModal>({
		dateString: '',
		scheduleList: []
	});
	// EDIT
	const [isShowSaveBtnGroup, setIsShowSaveBtnGroup] = useState(false);
	const [scheduleListToSave, setScheduleListToSave] = useState<ICSScheduleToSave[]>([]);
	const stoneScheduleArranged = useRef<ISCSchedule[]>([]);
	const stoneScheduleListToFindDifference = useRef<ISCSchedule[]>([]);
	// -----------SCHEDULE-----------
	const isValidRegisterCourse = (date?: string) => {
		//user must select study time before 24h
		const checkDate = `${dataModalCalendar.dateString} ${date}`;
		const now = moment(checkDate).format();
		const nextDay = moment().add(1, 'days').format();
		const rs = moment(now).isSameOrAfter(nextDay);
		return rs;
	};
	const studyTimeOverFlow = (scheduleList: ISCSchedule[]) => {
		let rs = false;
		const studyTimeIdList = scheduleList.map((s) => s.StudyTimeID).filter(Boolean);
		// COMPARE STUDY TIME RETURN TRUE IF INVALID
		for (let i = 0; i < studyTimeIdList.length - 1; i++) {
			const time1 = studyTimeList.find((s) => s.ID === studyTimeIdList[i]);
			const s1 = +time1.TimeStart.replace(':', '');
			const e1 = +time1.TimeEnd.replace(':', '');

			for (let j = i + 1; j < studyTimeIdList.length; j++) {
				const time2 = studyTimeList.find((s) => s.ID === studyTimeIdList[j]);
				const s2 = +time2.TimeStart.replace(':', '');
				const e2 = +time2.TimeEnd.replace(':', '');
				if (
					time1.ID === time2.ID ||
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
	const getNewValueForSchedule = (uid: number, date: string, key: 'CaID' | 'TeacherID', vl: number) => {
		switch (key) {
			case 'CaID':
				const optionStudyTimeList = optionListForADay.optionStudyTimeList.find((o) => o.id === uid)?.list || [];
				const newOptionStudyTimeList = [...optionStudyTimeList];
				const StudyTimeName = newOptionStudyTimeList.find((o) => o.value === vl)?.title;
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
			default:
				break;
		}
	};
	const getNewUnavailableScheduleList = (uid: number, key: 'CaID' | 'TeacherID', vl: number) => {
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
	const changeValueSchedule = (uid: number, key: 'CaID' | 'TeacherID', vl: number) => {
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
	const changeStatusSchedule = (sch: ISCSchedule, type: number = 1) => {
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
	const onToggleSchedule = (sch: ISCSchedule, type: number) => {
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
	const onCheckTeacherAvailable = async (params: ISCCheckSchedule) => {
		try {
			const { id, teacherID, ...rest } = params;
			const idxInOptList = optionListForADay.optionTeacherList.findIndex((o) => o.id === id);
			if (!params.studyTimeID) {
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
			const res = await checkTeacherSelfCourse(rest);
			if (res.status === 200) {
				const newList = fmSelectArr(res.data.data, 'FullNameUnicode', 'UserInformationID');
				const finalList = [{ title: '----Giáo viên trống----', value: 0 }, ...newList];
				const isHadTeacherInList = finalList.some((o) => o.value === teacherID); // kiểm tra nếu như trong buổi học còn giữ lại giá trị cũ nhưng api lại không có giá trị thỏa giá trị cũ
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
	const onCheckStudyTimeAvailable = async (params: ISCCheckSchedule) => {
		try {
			setIsLoading({
				type: 'CHECK_SCHEDULE',
				status: true
			});
			const { id, date, studyTimeID, curriculumsDetailID } = params;
			const idxInOptList = optionListForADay.optionTeacherList.findIndex((o) => o.id === id);
			const res = await checkStudyTimeSelfCourse({ curriculumsDetailID, date });
			if (res.status === 200) {
				const validTimeList = res.data.data.filter((s) => isValidRegisterCourse(s.TimeStart));
				const newList = fmSelectArr(validTimeList, 'Name', 'ID', ['Time', 'TimeStart', 'TimeEnd']);
				const finalList = [{ title: '----Ca học trống----', value: 0 }, ...newList];

				const isHadTeacherInList = finalList.some((o) => o.value === studyTimeID); // kiểm tra nếu như trong buổi học còn giữ lại giá trị cũ nhưng api lại không có giá trị thỏa giá trị cũ
				if (!isHadTeacherInList) {
					changeValueSchedule(id, 'CaID', 0);
				}

				setOptionListForADay((prevState) => {
					const newOptList = [...prevState.optionStudyTimeList];
					newOptList.splice(idxInOptList, 1, {
						...prevState.optionTeacherList[idxInOptList],
						list: finalList
					});
					return {
						...prevState,
						optionStudyTimeList: newOptList
					};
				});
				return true;
			}
			if (res.status === 204) {
				setOptionListForADay((prevState) => {
					const newOptList = [...prevState.optionStudyTimeList];
					newOptList.splice(idxInOptList, 1, {
						...prevState.optionStudyTimeList[idxInOptList],
						list: [{ title: '----Giáo viên trống----', value: 0 }]
					});
					return {
						...prevState,
						optionStudyTimeList: newOptList
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
			setIsLoading({
				type: 'SCHEDULE_INVALID',
				status: false
			});
			dataModalCalendar.scheduleList.forEach((s) => {
				const params = {
					id: s.ID,
					date: dataModalCalendar.dateString,
					studyTimeID: s.StudyTimeID,
					curriculumsDetailID: s.CurriculumsDetailID,
					teacherID: s.TeacherID || 0
				};
				const now = moment().format();
				const conditionDate = `${dataModalCalendar.dateString} ${s.TimeStart || '00:00'}`;
				const isValid = moment(conditionDate).isSameOrAfter(now);
				if (isValid) {
					onCheckTeacherAvailable(params);
					onCheckStudyTimeAvailable(params);
				} else {
					setIsLoading({
						type: 'SCHEDULE_INVALID',
						status: true
					});
				}
			});
		}
	}, [dataModalCalendar.scheduleList]);
	// -----------SAVE COURSE-----------
	const onFindScheduleChanged = (arr: ISCSchedule[]) => {
		const { current: list } = stoneScheduleListToFindDifference;
		const rs: ISCSchedule[] = [];

		for (let i = 0, len = arr.length; i < len; i++) {
			const s = arr[i];
			if (typeof s.ID === 'string') {
				rs.push(s);
				continue;
			}
			for (let i2 = 0; i2 < list.length; i2++) {
				const s2 = list[i2];
				if (
					s.ID === s2.ID &&
					(moment(s.Date).format('YYYY/MM/DD') !== moment(s2.Date).format('YYYY/MM/DD') ||
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
	const onValidateDateToSave = (arr: ISCSchedule[]) => {
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
			save: ICSScheduleToSave[];
		} = {
			show: [],
			save: []
		};
		for (let i = 0, len = arr.length; i < len; i++) {
			const s = arr[i];
			const { ID, Date, TeacherID, TeacherName, StudyTimeID } = s;
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
				studyTimeName: studyTimeList.find((s) => s.ID === StudyTimeID)?.Name || '---Ca học trống---',
				TeacherID,
				teacherName: TeacherName || '---Giáo viên trống---',
				isValid
			});
			rs.save.push({
				ID: typeof ID === 'string' ? 0 : ID,
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
				showNoti('danger', 'Bạn chưa đăng ký buổi học nào');
				return;
			}
			const res = await Promise.all(scheduleListToSave.map((s) => updateScheduleSelfCourse(s)));
			if (res.every((r) => r.status === 200)) {
				fetchAvailableSchedule();
				showNoti('success', 'Đăng ký thành công!');
			} else {
				showNoti('danger', 'Có lỗi xảy ra');
			}
		} catch (error) {
			if (error.status === 400) {
				showNoti('danger', error.message);
			}
			console.log('onSaveCourse', error.message);
		} finally {
			setIsLoading({
				type: 'SAVE_COURSE',
				status: false
			});
		}
		return res;
	};
	// -----------EDIT COURSE-----------
	const fetchStudyTimeList = async () => {
		try {
			const res = await studyTimeApi.getAll({ selectAll: true });
			if (res.status === 200) {
				setStudyTimeList(res.data.data);
			}
			return [];
		} catch (error) {
			console.log('fetchDayOffList', error.message);
		}
	};
	const fetchDayOffList = async (eDate: string) => {
		try {
			const res = await dayOffApi.getAll({ selectAll: true, toDate: eDate });
			if (res.status === 200) {
				return res.data.data.map((r) => moment(r.DayOff).format('YYYY/MM/DD'));
			}
			return [];
		} catch (error) {
			console.log('fetchDayOffList', error.message);
		}
	};
	const createCalendarBlankList = async (eDate: string) => {
		const dates = [];
		const currDate = moment().startOf('day');
		const lastDate = moment(eDate).startOf('day');
		const dayOffList = await fetchDayOffList(eDate);
		do {
			const Day = currDate.clone().format('YYYY/MM/DD');
			if (!dayOffList.includes(Day)) {
				dates.push({ Day });
			}
		} while (currDate.add(1, 'days').diff(lastDate) <= 0);

		return dates;
	};
	type IFMOptionList = { id: number; list: IOptionCommon[] }[];
	const fmOptionList = (
		arranged: ISCSchedule[],
		inarranged: ISCSchedule[]
	): { optionStudyTimeList: IFMOptionList; optionTeacherList: IFMOptionList } => {
		const fm = (arr: ISCSchedule[], tt: string, vl: string) =>
			arr.map((s) => ({
				id: +s.ID,
				list: [{ title: s[tt] || '', value: s[vl] }]
			}));

		const optionStudyTimeListArranged: IFMOptionList = fm(arranged, 'StudyTimeName', 'StudyTimeID');
		const optionStudyTimeListInarranged: IFMOptionList = fm(inarranged, 'StudyTimeName', 'StudyTimeID');

		const optionTeacherListSchedulesArranged: IFMOptionList = fm(arranged, 'TeacherName', 'TeacherID');
		const optionTeacherListSchedulesInarranged: IFMOptionList = fm(inarranged, 'TeacherName', 'TeacherID');

		return {
			optionStudyTimeList: optionStudyTimeListArranged.concat(optionStudyTimeListInarranged),
			optionTeacherList: optionTeacherListSchedulesArranged.concat(optionTeacherListSchedulesInarranged)
		};
	};
	const fetchAvailableSchedule = async () => {
		setIsShowSaveBtnGroup(false);
		setIsLoading({
			type: 'FETCH_SCHEDULE',
			status: true
		});
		try {
			const courseIDInt = parseInt(courseID as string);
			const [courseInfo, courseSchedule] = await Promise.all([courseApi.getById(courseIDInt), getScheduleSelfCourse(courseIDInt)]);

			if (courseInfo.status === 200) {
				const { EndDay } = courseInfo.data.data;
				const calendarBlankList = await createCalendarBlankList(EndDay);
				setCalendarList(calendarBlankList);
			}
			if (courseSchedule.status === 200) {
				const { courseSchedulesArranged, courseSchedulesInarranged } = courseSchedule.data;
				const totalSchedule = [...courseSchedulesArranged, ...courseSchedulesInarranged];

				const optionList = fmOptionList(courseSchedulesArranged, courseSchedulesInarranged);

				setScheduleList({
					unavailable: courseSchedulesArranged.map((s) => ({ ...s, Date: moment(s.Date).format('YYYY/MM/DD') })),
					available: courseSchedulesInarranged.map((s) => ({ ...s, Date: moment(s.Date).format('YYYY/MM/DD') }))
				});
				setOptionListForADay(optionList);
				stoneScheduleArranged.current = courseSchedulesArranged;
				stoneScheduleListToFindDifference.current = totalSchedule;
			}
			setIsShowSaveBtnGroup(true);
			setIsLoading({
				type: 'FETCH_SCHEDULE',
				status: false
			});
		} catch (error) {
			showNoti('error', error.message);
		}
	};
	// -----------CANCEL SCHEDULE-----------
	const isValidCancelCourse = (sch: ISCSchedule) => {
		//user must cancel study time before 5h
		const { ID, StudyTimeID } = sch;
		const { current: checkList } = stoneScheduleArranged;
		if (!StudyTimeID || !checkList.some((s) => s.ID === ID)) return false;
		const nextFiveHours = moment().add(5, 'hours').format();
		const rs = moment().isSameOrBefore(nextFiveHours);
		return rs;
	};
	const onCancelSchedule = async (sch: ISCSchedule) => {
		try {
			setIsLoading({
				type: 'CANCEL_SCHEDULE',
				status: false
			});
			const { ID } = sch;
			const res = await cancelScheduleSelfCourse(ID);
			if (res.status === 200) {
				onToggleSchedule(sch, 2);
				fetchAvailableSchedule();
				showNoti('success', 'Hủy lịch học thành công');
			}
		} catch (error) {
			console.log('onCancelSchedule', error.message);
		} finally {
			setIsLoading({
				type: 'CANCEL_SCHEDULE',
				status: false
			});
		}
	};
	useEffect(() => {
		let isMounted = true;
		if (isMounted) {
			fetchStudyTimeList();
			fetchAvailableSchedule();
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
						title={
							<>
								<p style={{ marginBottom: 0 }}>Sắp xếp lịch học</p>
								<p style={{ fontSize: 13, color: '#bfbfcb' }}>
									Chỉ được xếp buổi học trước 24 tiếng, hủy buổi học trước 5 tiếng.
								</p>
							</>
						}
						extra={
							<>
								<div className="btn-page-course">
									{isShowSaveBtnGroup && (
										<>
											<SaveSelfCourse
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
						<CreateSelfCourseCalendar
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
											<ScheduleSelfItem
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
									<ScheduleSelfItem
										key={idx}
										isUnavailable={true}
										isEditView={true}
										scheduleObj={s}
										isLoading={isLoading}
										handleChangeValueSchedule={changeValueSchedule}
										handleChangeStatusSchedule={onToggleSchedule}
										optionTeacherList={optionListForADay.optionTeacherList.find((o) => o.id === s.ID)?.list || []}
										optionStudyTime={optionListForADay.optionStudyTimeList.find((o) => o.id === s.ID)?.list || []}
										isCancelSchedule={isValidCancelCourse(s)}
										handleCancelSchedule={onCancelSchedule}
										// handleAheadSchedule={onAheadSchedule}
										// isClickAheadSchedule={isClickAheadSchedule}
									/>
								))}
							</ScheduleList>
						</CreateSelfCourseCalendar>
					</Card>
				</div>
				<div className="col-md-4 col-12 d-none d-md-block">
					<Schedule>
						<ScheduleList>
							{scheduleList.available.map((s, idx) => (
								<ScheduleSelfItem
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

export default EditSelfCourse;
