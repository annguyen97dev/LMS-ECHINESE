import {Collapse} from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import SelectField from '~/components/FormControl/SelectField';
const {Panel} = Collapse;

const ScheduleItem = (props) => {
	const {
		handleActiveSchedule,
		handleSelectSchedule,
		handleGetInfoAvailableSchedule,
		handleFetchInfoAvailableSchedule,
		scheduleObj,
		isLoading,
		//
		optionForScheduleList,
	} = props;
	const {
		eventName,
		Tiet,
		RoomName,
		RoomID,
		CaID,
		CaName,
		TeacherID,
		TeacherName,
		date,
	} = scheduleObj;
	const [isChecked, setIsChecked] = useState(false);
	const [valueToFetchAvailableSchedule, setValueToFetchAvailableSchedule] =
		useState({
			RoomID,
			RoomName,
			TeacherID,
			TeacherName,
			StudyTimeID: CaID,
			StudyTimeName: CaName,
			Date: date,
			SubjectID: Tiet.CurriculumsDetailID,
		});
	const checkHandleActiveSchedule = () => {
		if (!handleActiveSchedule) return;
		handleActiveSchedule();
	};
	const checkHandleSelectSchedule = (vl) => {
		if (!handleSelectSchedule) return;
		return handleSelectSchedule(vl);
	};

	const findValueChanged = (options, vl) => {
		return options.find((o) => o.value === vl).title;
	};
	const checkHandleGetInfoAvailableSchedule = (key: string, vl: any) => {
		if (!handleGetInfoAvailableSchedule) return;
		const {optionRoomList, optionStudyTimeList, optionTeacherList} =
			optionForScheduleList;
		let key2, vl2;
		if (key === 'RoomID') {
			key2 = 'RoomName';
			vl2 = findValueChanged(optionRoomList, vl);
		}
		if (key === 'StudyTimeID') {
			key2 = 'StudyTimeName';
			vl2 = findValueChanged(optionStudyTimeList, vl);
		}
		if (key === 'TeacherID') {
			key2 = 'TeacherName';
			vl2 = findValueChanged(optionTeacherList, vl);
		}
		setValueToFetchAvailableSchedule({
			...valueToFetchAvailableSchedule,
			[key]: vl,
			[key2]: vl2,
		});
	};
	// useEffect(() => {
	// 	handleGetInfoAvailableSchedule(valueToFetchAvailableSchedule);
	// }, [valueToFetchAvailableSchedule]);

	const checkHandleFetchInfoAvailableSchedule = () => {
		if (!handleFetchInfoAvailableSchedule) return;
		return handleFetchInfoAvailableSchedule(valueToFetchAvailableSchedule);
	};

	const defaultValuesInit = {
		RoomID: RoomID,
		TeacherID: TeacherID,
		StudyTimeID: CaID,
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
	});

	useEffect(() => {}, []);
	//   scheduleObj = {
	//     "ID": 1,
	//     "eventName": "26/07 - Hữu Minh Teacher 10 [20:00-21:00]-[Phòng 2]",
	//     "Color": "orange",
	//     "Tiet": {
	//         "CurriculumsDetailID": 140,
	//         "CurriculumsDetailName": "1: Sinh"
	//     },
	//     "date": "2021-07-26",
	//     "TeacherID": 1060,
	//     "TeacherName": "Hữu Minh Teacher 10[20:00-21:00]",
	//     "CaID": 5,
	//     "CaName": "Ca: 20:00 - 21:00",
	//     "RoomID": 32,
	//     "RoomName": "Phòng: Phòng 2"
	// }
	return (
		<Panel
			{...props}
			header={
				<div className="info-course-item">
					<Checkbox
						onChange={() => {
							if (checkHandleSelectSchedule(scheduleObj)) {
								checkHandleActiveSchedule();
								setIsChecked(!isChecked);
								// if (!isChecked) {
								// 	checkHandleFetchInfoAvailableSchedule();
								// 	handleGetInfoAvailableSchedule(valueToFetchAvailableSchedule);
								// }
							}
						}}
						checked={isChecked}
					/>
					<p className="title">{eventName}</p>
					<ul className="info-course-list">
						<li>{Tiet.CurriculumsDetailName}</li>
					</ul>
				</div>
			}
		>
			<div className="info-course-select">
				<div className="row">
					<div className="col-6">
						<SelectField
							form={form}
							name="RoomID"
							isLoading={
								isLoading.type === 'CHECK_SCHEDULE' && isLoading.status
							}
							placeholder="Chọn phòng"
							optionList={optionForScheduleList.optionRoomList}
							onChangeSelect={(value) => {
								checkHandleGetInfoAvailableSchedule('RoomID', value);
							}}
						/>
					</div>
					<div className="col-6">
						<SelectField
							form={form}
							name="StudyTimeID"
							isLoading={
								isLoading.type === 'CHECK_SCHEDULE' && isLoading.status
							}
							placeholder="Chọn ca"
							optionList={optionForScheduleList.optionStudyTimeList}
							onChangeSelect={(value) => {
								checkHandleGetInfoAvailableSchedule('StudyTimeID', value);
							}}
						/>
					</div>
					<div className="col-12 mt-2">
						<SelectField
							form={form}
							name="TeacherID"
							isLoading={
								isLoading.type === 'CHECK_SCHEDULE' && isLoading.status
							}
							placeholder="Chọn giáo viên"
							optionList={optionForScheduleList.optionTeacherList}
							onChangeSelect={(value) => {
								checkHandleGetInfoAvailableSchedule('TeacherID', value);
							}}
						/>
					</div>
				</div>
			</div>
		</Panel>
	);
};
const optionPropTypes = PropTypes.arrayOf(
	PropTypes.shape({
		title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	})
);
ScheduleItem.propTypes = {
	handleActiveSchedule: PropTypes.func, //form ScheduleList
	handleSelectSchedule: PropTypes.func,
	handleGetInfoAvailableSchedule: PropTypes.func,
	handleFetchInfoAvailableSchedule: PropTypes.func,
	scheduleObj: PropTypes.shape({}),
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	//
	optionForScheduleList: PropTypes.shape({
		optionRoomList: optionPropTypes,
		optionTeacherList: optionPropTypes,
		optionStudyTimeList: optionPropTypes,
	}),
};
ScheduleItem.defaultProps = {
	handleActiveSchedule: null,
	handleSelectSchedule: null,
	handleGetInfoAvailableSchedule: null,
	handleFetchInfoAvailableSchedule: null,
	scheduleObj: {},
	isLoading: {type: '', status: false},
	//
	optionForScheduleList: {
		optionRoomList: [],
		optionTeacherList: [],
		optionStudyTimeList: [],
	},
};
export default ScheduleItem;
