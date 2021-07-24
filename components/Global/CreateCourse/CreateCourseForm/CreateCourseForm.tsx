import {DatePicker, Form, Input, Modal, Select, Spin} from 'antd';
import React, {useEffect, useState} from 'react';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import moment from 'moment';
import {useForm} from 'react-hook-form';
import PropTypes from 'prop-types';
import SelectField from '~/components/FormControl/SelectField';
import DateField from '~/components/FormControl/DateField';
import InputTextField from '~/components/FormControl/InputTextField';
//  ----------- POPUP FORM ------------
const CreateCourseForm = (props) => {
	const {
		handleGetCourse,
		isUpdate,
		handleUpdateTeacher,
		updateObj,
		isLoading,
		indexUpdateObj,

		//
		optionBranchList,
		optionStudyTimeList,
		optionGradeList,
		optionFetchByBranch,
		optionProgramList,
		optionCurriculum,
		optionDayOfWeek,
		handleCheckStudyTime,
		handleFetchDataByBranch,
		handleFetchProgramByGrade,
		handleGetValueBeforeFetchCurriculum,
	} = props;
	const {Option} = Select;
	const [isModalVisible, setIsModalVisible] = useState(false);
	function onSearch(val) {
		console.log('search:', val);
	}
	function onChangeDate(date, dateString) {
		console.log(date, dateString);
	}

	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);

	const schema = yup.object().shape({
		BranchID: yup.number().nullable().required('Bạn không được để trống'),
		UserInformationID: yup
			.number()
			.nullable()
			.required('Bạn không được để trống'),
		RoomID: yup.number().nullable().required('Bạn không được để trống'),
		StudyTimeID: yup
			.array()
			.min(1, 'Bạn phải chọn ít nhất 1 trung tâm')
			.required('Bạn không được để trống'),
		GradeID: yup.number().nullable().required('Bạn không được để trống'),
		ProgramID: yup.number().nullable().required('Bạn không được để trống'),
		CurriculumID: yup.number().nullable().required('Bạn không được để trống'),
		StartDay: yup.string().required('Bạn không được để trống'),
		DaySelected: yup
			.array()
			.min(1, 'Bạn phải chọn ít nhất 1 ngày trong tuần')
			.required('Bạn không được để trống'),
		CourseName: yup.string().required('Bạn không được để trống'),
	});
	const defaultValuesInit = {
		BranchID: null,
		UserInformationID: null,
		RoomID: null,
		StudyTimeID: undefined,
		GradeID: null,
		ProgramID: null,
		CurriculumID: null,
		StartDay: moment().format('YYYY/MM/DD'),
		CourseName: '',
	};

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});

	// useEffect(() => {
	// 	if (isUpdate && updateObj) {
	// 		form.reset({
	// 			...updateObj,
	// 			Branch: updateObj.Branch.split(','),
	// 		});
	// 	}
	// }, [updateObj]);

	const createCourseSwitchFunc = (data) => {
		switch (isUpdate) {
			case true:
				// if (!handleUpdateTeacher) return;
				// handleUpdateTeacher(data, indexUpdateObj).then((res) => {
				// 	if (res && res.status === 200) {
				// 		closeModal();
				// 	}
				// });
				break;
			case false:
				if (!handleGetCourse) return;
				handleGetCourse(data).then((res) => {
					if (res) {
						closeModal();
						form.reset({...defaultValuesInit});
					}
				});
				break;
			default:
				break;
		}
	};
	// ONCHANGE OF BRANCH FIELD
	const checkHandleFetchUserInformation = (value) => {
		if (!handleFetchDataByBranch) return;
		form.setValue('UserInformationID', undefined);
		form.setValue('RoomID', undefined);
		handleFetchDataByBranch(value);
	};
	// ONCHANGE OF GRADE FIELD
	const checkHandleFetchProgramByGrade = (value) => {
		if (!handleFetchProgramByGrade) return;
		form.setValue('ProgramID', undefined);
		handleFetchProgramByGrade(value);
	};
	// ONCHANGE STUDY TIME AND PROGRAM
	const checkHandleGetValueBeforeFetchCurriculum = (
		key: string,
		value: number
	) => {
		if (!handleGetValueBeforeFetchCurriculum) return;
		form.setValue('CurriculumID', undefined);
		handleGetValueBeforeFetchCurriculum(key, value);
		if (key === 'StudyTimeID' && handleCheckStudyTime) {
			handleCheckStudyTime(value);
		}
	};
	return (
		<>
			<button type="button" className="btn btn-warning" onClick={openModal}>
				Thông tin khóa học
			</button>
			<Modal
				style={{top: 20}}
				title="Thông tin khóa học"
				visible={isModalVisible}
				footer={null}
				width={800}
				onCancel={closeModal}
			>
				<div className="wrap-form">
					<Form
						layout="vertical"
						onFinish={form.handleSubmit(createCourseSwitchFunc)}
					>
						<div className="row">
							<div className="col-md-12 col-12">
								<SelectField
									form={form}
									name="BranchID"
									label="Trung Tâm"
									placeholder="Chọn trung tâm"
									optionList={optionBranchList}
									onChangeSelect={checkHandleFetchUserInformation}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="UserInformationID"
									label="Học vụ"
									placeholder="Chọn học vụ"
									isLoading={isLoading.type === 'BranchID' && isLoading.status}
									optionList={optionFetchByBranch.userInformationList}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="RoomID"
									label="Phòng học"
									placeholder="Chọn phòng học"
									isLoading={isLoading.type === 'BranchID' && isLoading.status}
									optionList={optionFetchByBranch.roomList}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="StudyTimeID"
									label="Ca học"
									placeholder="Chọn ca học"
									optionList={optionStudyTimeList}
									mode="multiple"
									onChangeSelect={(value) => {
										checkHandleGetValueBeforeFetchCurriculum(
											'StudyTimeID',
											value
										);
									}}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="GradeID"
									label="Khối học"
									placeholder="Chọn khối học"
									optionList={optionGradeList}
									onChangeSelect={checkHandleFetchProgramByGrade}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="ProgramID"
									label="Chương trình học"
									isLoading={isLoading.type === 'GradeID' && isLoading.status}
									placeholder="Chọn chương trình học"
									optionList={optionProgramList}
									onChangeSelect={(value) => {
										checkHandleGetValueBeforeFetchCurriculum(
											'ProgramID',
											value
										);
									}}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="CurriculumID"
									label="Giáo trình"
									isLoading={isLoading.type === 'ProgramID' && isLoading.status}
									placeholder="Chọn giáo trình"
									optionList={optionCurriculum}
								/>
							</div>
							<div className="col-md-6 col-12">
								<DateField
									form={form}
									name="StartDay"
									label="Ngày mở"
									placeholder="Chọn ngày mở"
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="DaySelected"
									label="Thứ"
									placeholder="Chọn thứ"
									optionList={optionDayOfWeek}
									mode="multiple"
								/>
							</div>
							<div className="col-md-12 col-12">
								<InputTextField
									form={form}
									name="CourseName"
									label="Tên khóa học"
									placeholder="Ghi tên khóa học"
								/>
							</div>
							<div
								className="col-md-12 col-12 mt-3 "
								style={{textAlign: 'center'}}
							>
								<button type="submit" className="btn btn-primary">
									Xem Lịch
									{isLoading.type == 'ADD_DATA' && isLoading.status && (
										<Spin className="loading-base" />
									)}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
};
const optionPropTypes = PropTypes.arrayOf(
	PropTypes.shape({
		title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	})
);
CreateCourseForm.propTypes = {
	handleGetCourse: PropTypes.func,
	isUpdate: PropTypes.bool,
	handleUpdateTeacher: PropTypes.func,
	updateObj: PropTypes.shape({}),
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	indexUpdateObj: PropTypes.number,
	//
	optionBranchList: optionPropTypes,
	optionStudyTimeList: optionPropTypes,
	optionGradeList: optionPropTypes,
	optionFetchByBranch: PropTypes.shape({
		userInformationList: optionPropTypes,
		roomList: optionPropTypes,
	}),
	optionProgramList: optionPropTypes,
	optionCurriculum: optionPropTypes,
	optionDayOfWeek: optionPropTypes,
	handleCheckStudyTime: PropTypes.func,
	handleFetchDataByBranch: PropTypes.func,
	handleFetchProgramByGrade: PropTypes.func,
	handleGetValueBeforeFetchCurriculum: PropTypes.func,
};

CreateCourseForm.defaultProps = {
	handleGetCourse: null,
	isUpdate: false,
	handleUpdateTeacher: null,
	updateObj: {},
	isLoading: {type: '', status: false},
	indexUpdateObj: -1,
	//
	optionBranchList: [],
	optionStudyTimeList: [],
	optionGradeList: [],
	optionFetchByBranch: {
		userInformationList: [],
		roomList: [],
	},
	optionProgramList: [],
	optionCurriculum: [],
	optionDayOfWeek: [],
	handleCheckStudyTime: null,
	handleFetchDataByBranch: null,
	handleFetchProgramByGrade: null,
	handleGetValueBeforeFetchCurriculum: null,
};

export default CreateCourseForm;
