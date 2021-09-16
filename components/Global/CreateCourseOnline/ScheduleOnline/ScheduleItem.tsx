import {yupResolver} from '@hookform/resolvers/yup';
import {Collapse} from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import SelectField from '~/components/FormControl/SelectField';
import {optionCommonPropTypes} from '~/utils/proptypes';
const {Panel} = Collapse;

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
// }
const ScheduleItem = (props) => {
	const {
		handleChangeStatusSchedule,
		handleChangeValueSchedule,
		//
		scheduleObj,
		isLoading,
		isUpdate,
		//
		optionTeacherList,
		optionStudyTime,
	} = props;
	const {
		ID,
		eventName,
		Tiet,
		CaID,
		// EDIT
		Date,
		TeacherName,
		SubjectName,
	} = scheduleObj;
	console.log(optionTeacherList);
	const defaultValuesInit = {
		TeacherID: 0,
		StudyTimeID: CaID,
	};
	const schema = yup.object().shape({
		StudyTimeID: yup
			.number()
			.min(1, 'Bạn cần chọn ca học')
			.required('Bạn không được để trống'),
		TeacherID: yup
			.number()
			.min(1, 'Bạn cần chọn giáo viên')
			.required('Bạn không được để trống'),
	});

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
		mode: 'all',
	});

	const checkHandleChangeStatusSchedule = (vl, type) => {
		if (!handleChangeStatusSchedule) return;
		handleChangeStatusSchedule(vl, type);
	};
	const checkHandleChangeValueSchedule = (uid, key, vl) => {
		if (!handleChangeValueSchedule) return;
		handleChangeValueSchedule(uid, key, vl);
	};
	const setSiblingsFieldToDefault = () => {
		form.setValue('TeacherID', 0);
	};

	// SET VALUE TO INPUT IF HAVE DATA
	useEffect(() => {
		let {TeacherID, CaID, StudyTimeID} = scheduleObj;
		form.setValue('StudyTimeID', CaID || StudyTimeID);
		form.setValue('TeacherID', TeacherID || 0);
		form.clearErrors();
	}, [scheduleObj]);

	return (
		<Panel
			{...props}
			header={
				<div className="info-course-item">
					<Checkbox
						onChange={() => {
							if (isUpdate) {
								// remove schedule from unavailable list
								// add schedule to available list
								checkHandleChangeStatusSchedule(scheduleObj, 2);
							} else {
								// remove schedule from available list
								// add schedule to unavailable list
								checkHandleChangeStatusSchedule(scheduleObj, 1);
							}
						}}
						checked={isUpdate}
					/>
					<p className="title">
						{eventName || `${moment(Date).format('DD/MM')} - ${TeacherName}`}
					</p>
					<ul className="info-course-list">
						<li>{Tiet?.CurriculumsDetailName || SubjectName}</li>
					</ul>
				</div>
			}
		>
			<div className="info-course-select">
				<div className="row">
					<div className="col-12">
						<SelectField
							form={form}
							name="StudyTimeID"
							placeholder="Chọn ca"
							optionList={optionStudyTime}
							onChangeSelect={(value) => {
								setSiblingsFieldToDefault();
								checkHandleChangeValueSchedule(ID, 'CaID', value);
							}}
						/>
					</div>
					<div className="col-12 mt-3">
						<SelectField
							form={form}
							name="TeacherID"
							isLoading={
								isLoading.type === 'CHECK_SCHEDULE' && isLoading.status
							}
							placeholder="Chọn giáo viên"
							optionList={optionTeacherList}
							onChangeSelect={(value) => {
								checkHandleChangeValueSchedule(ID, 'TeacherID', value);
							}}
						/>
					</div>
				</div>
			</div>
		</Panel>
	);
};
ScheduleItem.propTypes = {
	handleChangeValueSchedule: PropTypes.func,
	handleChangeStatusSchedule: PropTypes.func,
	//
	scheduleObj: PropTypes.shape({
		ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		eventName: PropTypes.string,
		Tiet: PropTypes.shape({
			CurriculumsDetailID: PropTypes.number,
			CurriculumsDetailName: PropTypes.string,
			SubjectID: PropTypes.number,
		}),
		TeacherID: PropTypes.number,
		TeacherName: PropTypes.string,
		CaID: PropTypes.number,
		CaName: PropTypes.string,
		StudyTimeID: PropTypes.number,
		SubjectName: PropTypes.string,
		Date: PropTypes.string,
	}),
	isUpdate: PropTypes.bool,
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	//
	optionTeacherList: optionCommonPropTypes,
	optionStudyTime: optionCommonPropTypes,
};
ScheduleItem.defaultProps = {
	handleChangeValueSchedule: null,
	handleChangeStatusSchedule: null,
	//
	scheduleObj: {},
	isUpdate: false,
	isLoading: {type: '', status: false},
	positionInScheduleList: null,
	//
	optionTeacherList: [],
	optionStudyTime: [],
};
export default ScheduleItem;
