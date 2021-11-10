import { Card } from 'antd';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import {
	checkTeacherApi,
	courseApi,
	getScheduleSelfCourse,
	studyTimeApi,
	checkStudyTimeSelfCourse,
	checkTeacherSelfCourse,
	ICheckTeacherSelfCourse,
	dayOffApi
} from '~/apiBase';
import Schedule from '~/components/Global/CreateCourse/Schedule/Schedule';
import ScheduleList from '~/components/Global/CreateCourse/Schedule/ScheduleList';
import CreateSelfCourseCalendar from '~/components/Global/CreateSelfCourse/Calendar/CreateSelfCourseCalendar';
import SaveSelfCourse from '~/components/Global/CreateSelfCourse/SaveSelfCourse';
import ScheduleSelfItem from '~/components/Global/CreateSelfCourse/ScheduleSelf/ScheduleSelfItem';
import TitlePage from '~/components/TitlePage';
import { useDebounce } from '~/context/useDebounce';
import { useWrap } from '~/context/wrap';
import { clearOptionsDuplicate, fmArrayToObjectWithSpecialKey, fmSelectArr } from '~/utils/functions';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.

// ------------ MAIN COMPONENT ------------------
type IOptionListForADay = {
	optionStudyTimeList: IOptionCommon[];
	list: Array<{
		optionTeacherList: IOptionCommon[];
	}>;
};
type IEditCourseScheduleList = {
	available: ISelfCourseSchedule[];
	unavailable: ISelfCourseSchedule[];
};
type IEditCourseScheduleShowList = {
	[k: string]: ISelfCourseSchedule[];
};
type IDataModal = {
	dateString: string;
	scheduleList: ISelfCourseSchedule[];
};
type IScheduleListToSave = {
	ID: number;
	CourseID: number;
	BranchID: number;
	CurriculumsDetailID: number;
	SubjectID: number;
	Date: string;
	StudyTimeID: number;
	TeacherID: number;
};
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
	//Lesson
	const [scheduleList, setScheduleList] = useState<IEditCourseScheduleList>({
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
	const [calendarList, setCalendarList] = useState<IStudyDay[]>([]);
	// SCHEDULE TO SHOW ON MODAL
	const [scheduleShow, setScheduleShow] = useState<IEditCourseScheduleShowList>({});
	// CALENDAR MODAL
	const [dataModalCalendar, setDataModalCalendar] = useState<IDataModal>({
		dateString: '',
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
	const [scheduleListToSave, setScheduleListToSave] = useState<IScheduleListToSave[]>([]);
	const stoneScheduleListToFindDifference = useRef<ISelfCourseSchedule[]>([]);
	// -----------SCHEDULE-----------
	const isValidRegisterCourse = (date?: string) => {
		const checkDate = `${dataModalCalendar.dateString} ${date}`;
		const now = moment(checkDate).format();
		const nextDay = moment().add(1, 'days').format();
		const rs = moment(now).isSameOrAfter(nextDay);
		return rs;
	};
	// FETCH DATA FOR SELECT SCHEDULE5
	const fetchInfoAvailableSchedule = async (arrSchedule: ISelfCourseSchedule[]) => {
		// SPLIT SCHEDULE TO 2 OBJECT TO CALL 2 API
		// paramsArr = [ {Schedule-*: [{params study time}, {params teacher}]} ]
		const paramsArr = arrSchedule.map(({ Date, CurriculumsDetailID, StudyTimeID }, idx) => {
			const dateFm = moment(dataModalCalendar.dateString).format('YYYY/MM/DD');
			return {
				[`Schedule-${idx + 1}`]: [
					{
						date: dateFm
					},
					// GET TEACHER BY STUDY TIME
					{
						curriculumsDetailID: CurriculumsDetailID,
						studyTimeID: StudyTimeID || 0,
						date: dateFm
					}
				]
			};
		});
		try {
			if (!paramsArr.length) return;
			// promises = [ {checkStudyTime promise}, {checkTeacher promise} ]
			const promises = paramsArr
				.map((obj, idx1) => {
					return obj[`Schedule-${idx1 + 1}`].map((p, idx2) =>
						idx2 % 2 === 0 ? checkStudyTimeSelfCourse(p) : checkTeacherSelfCourse(p as ICheckTeacherSelfCourse)
					);
				})
				.flat(1);
			// @ts-ignore
			await Promise.all(promises)
				.then((res) => {
					//res = [ {data study time}, {data teacher} ]
					//newRes = [ [{data study time}, {data teacher}] ]
					const newRes = [];
					for (let i = 0, len = res.length; i < len; i += 2) {
						newRes.push([res[i], res[i + 1]]);
					}
					// newOptionForSchedule = [ {optionStudyTimeList:[], optionTeacherList:[]} ]
					const newOptionForSchedule = newRes.map((r) => {
						const studyTimeList = r[0];
						const teacherList = r[1];
						const rs = {
							optionStudyTimeList: [{ title: '---Chọn ca---', value: 0 }],
							optionTeacherList: [{ title: '---Chọn giáo viên---', value: 0 }]
						};

						if (studyTimeList.status === 200) {
							const validTimeList = studyTimeList.data.data.filter((s) => isValidRegisterCourse(s.TimeStart));
							rs.optionStudyTimeList = [
								...rs.optionStudyTimeList,
								...fmSelectArr(validTimeList, 'Name', 'ID', ['Time', 'TimeStart', 'TimeEnd'])
							];
						}
						if (teacherList.status === 200) {
							rs.optionTeacherList = [
								...rs.optionTeacherList,
								...fmSelectArr(teacherList.data.data, 'FullNameUnicode', 'UserInformationID', ['FullNameUnicode'])
							];
						}
						return rs;
					});
					setOptionListForADay((prevState) => ({
						...prevState,
						optionStudyTimeList: newOptionForSchedule[0].optionStudyTimeList,
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
	const checkDuplicateStudyTimeInDay = (arr: ISelfCourseSchedule[], vl) => {
		const scheduleSameStudyTime = arr.filter((s) => s.StudyTimeID === vl);
		if (scheduleSameStudyTime.length > 1) {
			return true;
		}
		return false;
	};
	const studyTimeOverFlow = (scheduleList: ISelfCourseSchedule[]) => {
		const newStudyTimeList = [...optionListForADay.optionStudyTimeList];
		let rs = false;
		const studyTimeInDay = newStudyTimeList.filter((s) => scheduleList.map((sch) => sch.StudyTimeID).includes(+s.value));
		// COMPARE STUDY TIME RETURN TRUE IF IN VALID
		for (let i = 0; i < studyTimeInDay.length; i++) {
			const timeObjBase = studyTimeInDay[i];
			if (!timeObjBase.value) continue;
			const s1 = +timeObjBase.options.TimeStart.replace(':', '');
			const e1 = +timeObjBase.options.TimeEnd.replace(':', '');
			studyTimeInDay.filter((st) => {
				if (!st.value) return;
				const s2 = +st.options.TimeStart.replace(':', '');
				const e2 = +st.options.TimeEnd.replace(':', '');
				if (timeObjBase.value === st.value) {
					return;
				}
				if (
					(s1 < s2 && e1 > e2 && s1 < e2) ||
					(s1 > s2 && e1 > e2 && s1 < e2) ||
					(s1 < s2 && e1 < e2 && e1 > s2) ||
					(s1 > s2 && e1 < e2)
				) {
					rs = true;
				}
			});
		}
		return rs;
	};
	const getNewValueForSchedule = (key, vl, pos) => {
		const { optionTeacherList } = optionListForADay.list[pos];
		switch (key) {
			case 'CaID':
				const StudyTimeName = optionListForADay.optionStudyTimeList.find((o) => o.value === vl)?.title;
				return {
					TeacherID: 0,
					TeacherName: 'Giáo viên trống',
					StudyTimeName,
					StudyTimeID: vl
				};
			case 'TeacherID':
				const TeacherName = optionTeacherList.find((o) => o.value === vl)?.title;
				return {
					TeacherName: vl ? TeacherName : 'Giáo viên trống',
					[key]: vl
				};
			default:
				break;
		}
	};
	const getNewUnavailableScheduleList = (uid, key, vl, pos) => {
		const { unavailable } = scheduleList;
		// DATE TO CHECK DUPLICATE VALUE
		let date;
		const rs = unavailable.map((s) => {
			if (s.ID === uid) {
				const newVl = getNewValueForSchedule(key, vl, pos);
				date = s.Date;
				return {
					...s,
					...newVl
				};
			} else {
				return s;
			}
		});
		return { date, rs };
	};

	const changeValueSchedule = (uid: number, key: 'CaID' | 'TeacherID', vl: number | string, pos: number) => {
		const { rs: newUnavailableScheduleList, date } = getNewUnavailableScheduleList(uid, key, vl, pos);
		if (key === 'CaID') {
			const scheduleList = newUnavailableScheduleList.filter((s) => s.Date === date);
			const TimeStart = optionListForADay.optionStudyTimeList.find((s) => s.value === vl)?.options.TimeStart;
			if (studyTimeOverFlow(scheduleList) || checkDuplicateStudyTimeInDay(scheduleList, vl)) {
				showNoti('danger', 'Dữ liệu không phù hợp');
			} else {
				setDataModalCalendar({
					...dataModalCalendar,
					scheduleList: scheduleList
				});
			}
		}
		setScheduleList((prevState) => ({
			...prevState,
			unavailable: newUnavailableScheduleList
		}));
	};

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
	useEffect(() => {
		const { scheduleList } = dataModalCalendar;
		if (scheduleList.length) {
			onDebounceFetchInfoAvailableSchedule(scheduleList);
		}
	}, [dataModalCalendar]);
	// -----------SAVE COURSE-----------
	const onFindScheduleChanged = (arr: ISelfCourseSchedule[]) => {
		const { current: stoneScheduleList } = stoneScheduleListToFindDifference;
		const rs: ISelfCourseSchedule[] = [];
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
	const onValidateDateToSave = (arr: ISelfCourseSchedule[]) => {
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
			save: IScheduleListToSave[];
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
				if (i !== i2 && s.ID !== s2.ID && s.Date === s2.Date) {
					if (studyTimeOverFlow([s, s2])) {
						isValid = true;
					}
					if (s.StudyTimeID === s2.StudyTimeID) {
						isValid = true;
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
				showNoti('danger', 'Bạn chưa đăng ký buổi học nào');
				return;
			}
			// res = await courseDetailApi.update(scheduleListToSave);
			// if (res.status === 200) {
			// 	showNoti('success', res.data.message);
			// }
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
	// -----------EDIT COURSE-----------
	const fetchDayOffList = async (eDate: string) => {
		try {
			const res = await dayOffApi.getAll({ selectAll: true, toDate: eDate });
			return res.data.data.map((r) => moment(r.DayOff).format('YYYY/MM/DD'));
		} catch (error) {
			console.log('fetchDayOffList', error.message);
		}
	};
	const createCalendarBlankList = async (eDate: string) => {
		const dates = [];
		const currDate = moment().add(1, 'days').startOf('day');
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
				setScheduleList({
					unavailable: courseSchedulesArranged,
					available: courseSchedulesInarranged
				});
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
	useEffect(() => {
		let isMounted = true;
		if (isMounted) {
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
						title="Sắp xếp lịch học"
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
						>
							<ScheduleList panelActiveListInModal={dataModalCalendar.scheduleList.map((_, idx) => idx)}>
								{dataModalCalendar.scheduleList.map((s, idx) => (
									<ScheduleSelfItem
										key={idx}
										isUpdate={true}
										scheduleObj={s}
										isLoading={isLoading}
										handleChangeValueSchedule={(uid, key, vl) => changeValueSchedule(uid, key, vl, idx)}
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

export default EditSelfCourse;
