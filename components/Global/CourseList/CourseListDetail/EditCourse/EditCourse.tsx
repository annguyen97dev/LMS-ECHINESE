import {Card, Spin} from 'antd';
import moment from 'moment';
import {useRouter} from 'next/router';
import React, {useEffect, useRef, useState} from 'react';
import {
	checkRoomApi,
	checkTeacherApi,
	courseDetailApi,
	studyTimeApi,
	subjectApi,
} from '~/apiBase';
import {courseDetailAvailableDayApi} from '~/apiBase/course-detail/available-day';
import CreateCourseCalendar from '~/components/Global/CreateCourse/Calendar/CreateCourseCalendar';
import SaveCreateCourse from '~/components/Global/CreateCourse/SaveCreateCourse';
import Schedule from '~/components/Global/CreateCourse/Schedule/Schedule';
import ScheduleItem from '~/components/Global/CreateCourse/Schedule/ScheduleItem';
import ScheduleList from '~/components/Global/CreateCourse/Schedule/ScheduleList';
import TitlePage from '~/components/TitlePage';
import {useWrap} from '~/context/wrap';
import {fmSelectArr} from '~/helpers';
import CreateNewScheduleForm from './CreateNewScheduleForm';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.

// ------------ MAIN COMPONENT ------------------
const EditCourse = (props) => {
	const router = useRouter();
	const {slug: courseID} = router.query;
	// -----------STATE-----------
	// CREATE COURSE FORM STATE
	const {showNoti} = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	//Lesson
	const [scheduleList, setScheduleList] = useState({
		available: [],
		unavailable: [],
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
	const [calendarList, setCalendarList] = useState([]);
	const [dateSelected, setDateSelected] = useState({
		dateString: '',
	});
	// SCHEDULE TO SHOW ON MODAL
	const [scheduleShow, setScheduleShow] = useState({});
	// CALENDAR MODAL
	const [unavailableSch, setUnavailableSch] = useState({});
	// EDIT
	const [isLoaded, setIsLoaded] = useState(false);
	const [optionSubjectList, setOptionSubjectList] = useState([]);
	const [scheduleListToSave, setScheduleListToSave] = useState([]);
	const stoneScheduleListToFindDifference = useRef([]);
	// -----------SCHEDULE-----------
	// FETCH DATA FOR SELECT SCHEDULE
	const fetchInfoAvailableSchedule = async (arrSchedule: ICourseDetail[]) => {
		setIsLoading({
			type: 'CHECK_SCHEDULE',
			status: true,
		});
		// SPLIT SCHEDULE TO 2 OBJECT TO CALL 2 API
		// paramsArr = [ {Schedule-*: [{params teacher}, {params room}]} ]
		const paramsArr = arrSchedule.map((sch, idx) => {
			const {BranchID, Date, SubjectID, StudyTimeID, RoomID, CourseID} = sch;
			return {
				[`Schedule-${idx + 1}`]: [
					// TEACHER
					{
						BranchID,
						SubjectID,
						StudyTimeID,
						Date,
					},
					// ROOM
					{
						BranchID,
						Rooms: RoomID,
						StudyTimeID,
						Date,
						CourseID,
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
					// newOptionForSchedule = [ {optionTeacherList:[], optionRoomList:[]} ]
					const newOptionForSchedule = newRes.map((r, idx) => {
						const teacherList = r[0];
						const roomList = r[1];
						const {RoomID, RoomName, TeacherID, TeacherName} = arrSchedule[idx];
						const rs = {
							optionTeacherList: [
								{title: '---Chọn giáo viên---', value: 0},
								{title: TeacherName, value: TeacherID},
							],
							optionRoomList: [
								{title: '---Chọn phòng---', value: 0},
								{title: RoomName, value: RoomID},
							],
						};
						//
						if (teacherList.status === 200) {
							const newOptionTeacherList = [
								...rs.optionTeacherList,
								...fmSelectArr(teacherList.data.data, 'name', 'id', ['name']),
							];
							const clearDuplicate = newOptionTeacherList.reduce(
								(newArr, o) => {
									if (!newArr.some((o2) => o2.value === o.value)) {
										newArr.push(o);
									}
									return newArr;
								},
								[]
							);
							rs.optionTeacherList = clearDuplicate;
						}
						if (TeacherID === 0 && teacherList.status === 204) {
							rs.optionTeacherList = [
								{title: '---Chọn giáo viên---', value: 0},
							];
						}
						//
						if (roomList.status === 200) {
							const newOptionRoomList = [
								...rs.optionRoomList,
								...fmSelectArr(roomList.data.data, 'name', 'id', ['name']),
							];
							const clearDuplicate = newOptionRoomList.reduce((newArr, o) => {
								if (!newArr.some((o2) => o2.value === o.value)) {
									newArr.push(o);
								}
								return newArr;
							}, []);
							rs.optionRoomList = clearDuplicate;
						}
						if (RoomID === 0 && roomList.status === 204) {
							rs.optionRoomList = [{title: '---Chọn phòng---', value: 0}];
						}
						//
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
		const scheduleSameStudyTime = arr.filter((s) => s.StudyTimeID === vl);
		if (scheduleSameStudyTime.length > 1) {
			return true;
		}
		return false;
	};
	const studyTimeOverFlow = (scheduleList) => {
		const newStudyTimeList = [...optionForSchedule.optionStudyTimeList];
		let rs = false;
		const studyTimeInDay = newStudyTimeList.filter((s) =>
			scheduleList.map((sch) => sch.StudyTimeID).includes(s.value)
		);
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
		const {optionRoomList, optionTeacherList} = optionForSchedule.list[pos];
		switch (key) {
			case 'CaID':
				const StudyTimeName = optionForSchedule.optionStudyTimeList.find(
					(o) => o.value === vl
				)?.title;
				return {
					RoomID: 0,
					TeacherID: 0,
					TeacherName: 'Giáo viên trống',
					RoomName: 'Phòng trống',
					StudyTimeName,
					StudyTimeID: vl,
				};
			case 'TeacherID':
				const TeacherName = optionTeacherList.find(
					(o) => o.value === vl
				)?.title;
				return {
					TeacherName: vl ? TeacherName : 'Giáo viên trống',
					[key]: vl,
				};
				break;
			case 'RoomID':
				const RoomName = optionRoomList.find((o) => o.value === vl)?.title;
				return {
					RoomName: vl ? RoomName : 'Phòng trống',
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
				date = s.Date;
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
				(s) => s.Date === date
			);
			if (
				studyTimeOverFlow(scheduleList) ||
				checkDuplicateStudyTimeInDay(scheduleList, vl)
			) {
				showNoti('danger', 'Dữ liệu không phù hợp');
			} else {
				fetchInfoAvailableSchedule(scheduleList);
			}
		}
		if (key === 'RoomID') {
			const scheduleList = newUnavailableScheduleList.filter(
				(s) => s.Date === date
			);
			fetchInfoAvailableSchedule(scheduleList);
		}

		setScheduleList((prevState) => ({
			...prevState,
			unavailable: newUnavailableScheduleList,
		}));
	};
	const onChangeStatusSchedule = (sch, type = 1) => {
		const {dateString} = dateSelected;
		if (!dateString) {
			showNoti('danger', 'Bạn chưa chọn ngày');
			return;
		}
		const newScheduleUnavailableList = [...scheduleList.unavailable];
		const newScheduleAvailableList = [...scheduleList.available];
		const fmScheduleUnavailableToObject = newScheduleUnavailableList.reduce(
			(newObj, s) => {
				newObj[s.Date] ? newObj[s.Date].push(s) : (newObj[s.Date] = [s]);
				return newObj;
			},
			{}
		);
		// type = 2 => unavailable to available
		if (type === 2) {
			const idx = newScheduleUnavailableList.findIndex((s) => s.ID === sch.ID);
			const newScheduleObj = {
				...newScheduleUnavailableList[idx],
				Date: dateString,
			};
			newScheduleUnavailableList.splice(idx, 1);
			newScheduleAvailableList.push(newScheduleObj);
			setUnavailableSch({});
		}
		// type = 1 => available to unavailable
		if (type === 1) {
			const limit = calendarList.find((c) => c.Day === dateString)?.Limit;
			if (fmScheduleUnavailableToObject[dateString]?.length >= limit) {
				showNoti('danger', 'Số ca đạt giới hạn');
				return;
			}
			const idx = newScheduleAvailableList.findIndex((s) => s.ID === sch.ID);
			const newScheduleObj = {
				...newScheduleAvailableList[idx],
				Date: dateString,
			};
			newScheduleAvailableList.splice(idx, 1);
			newScheduleUnavailableList.push(newScheduleObj);
			setUnavailableSch(newScheduleObj);
		}
		setScheduleList((prevState) => ({
			...prevState,
			available: newScheduleAvailableList,
			unavailable: newScheduleUnavailableList,
		}));
	};
	// -----------CALENDAR-----------
	const calendarDateFormat = (calendarArr: ICourseDetailAvailableDay[]) => {
		const {unavailable} = scheduleList;
		const fmScheduleUnavailableToObject = unavailable.reduce((newObj, s) => {
			newObj[s.Date] ? newObj[s.Date].push(s) : (newObj[s.Date] = [s]);
			return newObj;
		}, {});
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
	const onFindScheduleChanged = (arr) => {
		const {current: stoneScheduleList} = stoneScheduleListToFindDifference;
		const rs = [];
		for (let i = 0, len = arr.length; i < len; i++) {
			const s = arr[i];
			if (isNaN(s.ID)) {
				rs.push(s);
				continue;
			}
			for (let i2 = 0; i2 < stoneScheduleList.length; i2++) {
				const s2 = stoneScheduleList[i2];
				if (
					s.ID === s2.ID &&
					(s.Date !== s2.Date ||
						s.StudyTimeID !== s2.StudyTimeID ||
						s.RoomID !== s2.RoomID ||
						s.TeacherID !== s2.TeacherID)
				) {
					// Date, StudyTimeID, RoomID, TeacherID
					rs.push(s);
				}
			}
		}
		return rs;
	};
	const onValidateScheduleListBeforeSave = (arr) => {
		const rs = {
			show: [],
			save: [],
		};
		for (let i = 0, len = arr.length; i < len; i++) {
			const s = arr[i];
			const {
				ID,
				Date,
				StudyTimeName,
				RoomID,
				RoomName,
				TeacherID,
				TeacherName,
				StudyTimeID,
				CourseID,
				BranchID,
				SubjectID,
				CurriculumID,
			} = s;
			const dayArr = [
				'Chủ Nhật',
				'Thứ 2',
				'Thứ 3',
				'Thứ 4',
				'Thứ 5',
				'Thứ 6',
				'Thứ 7',
			];
			const dayOffWeek = dayArr[moment(s.Date).day()];
			let isValid = !s.RoomID || !s.TeacherID;
			for (let i2 = 0; i2 < len; i2++) {
				const s2 = arr[i2];
				if (i !== i2 && s.Date === s2.Date) {
					if (studyTimeOverFlow([s, s2])) {
						isValid = true;
					}
					if (s.StudyTimeID === s2.StudyTimeID) {
						isValid = true;
					}
				}
			}
			rs.show.push({
				ID: isNaN(ID) ? 0 : ID,
				Date,
				dayOffWeek,
				StudyTimeID,
				studyTimeName:
					StudyTimeName ||
					optionForSchedule.optionStudyTimeList.find(
						(s) => s.value === StudyTimeID
					).title,
				RoomID,
				roomName: RoomName,
				TeacherID,
				teacherName: TeacherName,
				isValid,
			});
			rs.save.push({
				ID: isNaN(ID) ? 0 : ID,
				CourseID,
				BranchID,
				CurriculumsDetailID: CurriculumID || 0,
				SubjectID,
				Date,
				StudyTimeID,
				RoomID,
				TeacherID,
			});
		}
		return rs;
	};
	const onFetchDataToSave = () => {
		const {unavailable} = scheduleList;

		const scheduleListChanged = onFindScheduleChanged(unavailable);
		const {show, save} = onValidateScheduleListBeforeSave(scheduleListChanged);

		const fmScheduleListToShow = show
			.sort((a, b) => moment(a.Date).valueOf() - moment(b.Date).valueOf())
			.reduce((newObj, s) => {
				newObj[s.Date] ? newObj[s.Date].push(s) : (newObj[s.Date] = [s]);
				return newObj;
			}, {});

		setScheduleShow(fmScheduleListToShow);
		setScheduleListToSave(save);
	};
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
			if (!scheduleListToSave.length) {
				showNoti('danger', 'Khóa học chưa được thay đổi');
				return;
			}
			res = await courseDetailApi.update(scheduleListToSave);
			if (res.status === 200) {
				showNoti('success', res.data.message);
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
	// -----------EDIT COURSE-----------
	const fetchCourseToEdit = async () => {
		try {
			await Promise.all([
				courseDetailApi.getByID(courseID),
				courseDetailAvailableDayApi.getAll(courseID),
			])
				.then(([scheduleList, dayList]) => {
					if (scheduleList.status === 200) {
						const scheduleListFm = scheduleList.data.data.map((sch) => ({
							...sch,
							Date: moment(sch.StartTime).format('YYYY/MM/DD'),
						}));
						stoneScheduleListToFindDifference.current = scheduleListFm;
						setScheduleList({
							available: [],
							unavailable: scheduleListFm,
						});
					}
					if (dayList.status === 200) {
						const dayListFm = dayList.data.data.map((d) => ({
							...d,
							Day: moment(d.Day).format('YYYY/MM/DD'),
						}));
						setCalendarList(dayListFm);
					}
					if (scheduleList.status === 200 && dayList.status === 200) {
						showNoti('success', 'Thành công');
						setIsLoaded(true);
						return true;
					}
				})
				.catch((err) => console.log('fetchCourseToEdit', err.message));
		} catch (error) {
			showNoti('error', error.message);
		}
	};
	const fetchSubject = async () => {
		setIsLoading({
			type: 'FETCH_SUBJECT',
			status: true,
		});
		try {
			const res = await subjectApi.getAll({
				CourseID: courseID,
			});
			if (res.status === 200) {
				const fmOption = fmSelectArr(res.data.data, 'SubjectName', 'ID');
				setOptionSubjectList([
					{title: '---Chọn môn học---', value: 0},
					...fmOption,
				]);
			}
		} catch (error) {
			console.log('fetchSubject', error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_SUBJECT',
				status: false,
			});
		}
	};
	const fetchStudyTime = async () => {
		try {
			const res = await studyTimeApi.getAll({
				CourseID: courseID,
			});
			if (res.status === 200) {
				const fmOption = fmSelectArr(res.data.data, 'Name', 'ID', [
					'Time',
					'TimeStart',
					'TimeEnd',
				]);

				setOptionForSchedule({
					...optionForSchedule,
					optionStudyTimeList: [
						{
							title: '---Chọn ca học---',
							value: 0,
						},
						...fmOption,
					],
				});
			}
		} catch (error) {
			console.log('fetchSubject', error.message);
		}
	};
	const onCreateSchedule = (obj) => {
		setIsLoading({
			type: 'CREATE_SCHEDULE',
			status: true,
		});
		let res;
		try {
			const {StudyDay, SubjectID} = obj;
			const rs = scheduleList.available;
			for (let i = 0; i < StudyDay; i++) {
				const newSchedule = {
					ID: `NewSch-${Math.floor(Math.random() * 10000)}`,
					CourseID: courseID,
					CourseName: '',
					BranchID: scheduleList.unavailable[0].BranchID,
					BranchName: '',
					RoomID: 0,
					RoomName: 'Trống',
					StudyTimeName: 'Trống',
					StudyTimeID: 0,
					Date: moment().format('YYYY/MM/DD'),
					StartTime: moment().format('YYYY/MM/DD'),
					EndTime: '',
					TeacherID: 0,
					TeacherName: 'Trống',
					SubjectID,
					SubjectName: optionSubjectList.find((s) => s.value === SubjectID)
						.title,
					CurriculumID: 0,
				};
				rs.push(newSchedule);
			}
			setScheduleList({
				...scheduleList,
				available: rs,
			});
		} catch (error) {
			console.log('fetchSubject', error.message);
		} finally {
			setIsLoading({
				type: 'CREATE_SCHEDULE',
				status: false,
			});
		}
		return res;
	};
	useEffect(() => {
		fetchSubject();
		fetchStudyTime();
		fetchCourseToEdit();
	}, []);
	return (
		<div className="create-course">
			<TitlePage title="Tạo khóa học" />
			<div className="row">
				<div className="col-md-8 col-12">
					<Card
						title="Sắp xếp lịch học"
						extra={
							<div className="btn-page-course">
								{isLoaded && (
									<>
										<CreateNewScheduleForm
											isLoading={isLoading}
											optionSubjectList={optionSubjectList}
											handleOnCreateSchedule={onCreateSchedule}
										/>
										<SaveCreateCourse
											isEdit={true}
											isLoading={isLoading}
											scheduleShow={scheduleShow}
											handleSaveCourse={onSaveCourse}
											handleFetchDataToSave={onFetchDataToSave}
										/>
									</>
								)}
							</div>
						}
					>
						<div
							className={`wrap-calendar ${
								!isLoaded ? 'wrap-calendar-loading' : ''
							}`}
						>
							<CreateCourseCalendar
								eventList={calendarDateFormat(calendarList)}
								handleSelectDate={onSelectDate}
								dateSelected={dateSelected}
								//
								isEdit={true}
								isLoading={isLoading}
								//
								unavailableSch={unavailableSch}
								//
								handleFetchInfoAvailableSchedule={fetchInfoAvailableSchedule}
								handleChangeValueSchedule={onChangeValueSchedule}
								handleChangeStatusSchedule={onChangeStatusSchedule}
								//
								optionForScheduleList={optionForSchedule}
							/>
							<Spin className="loading-base" />
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

export default EditCourse;
