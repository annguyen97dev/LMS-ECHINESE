import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Modal, Spin } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import DateField from '~/components/FormControl/DateField';
import InputTextField from '~/components/FormControl/InputTextField';
import SelectField from '~/components/FormControl/SelectField';
import { numberWithCommas } from '~/utils/functions';
import { optionCommonPropTypes } from '~/utils/proptypes';

const CreateSelfCourseForm = (props) => {
	const {
		isUpdate,
		isLoading,
		//
		optionListForForm,
		//
		handleGetCourse,
		handleFetchProgramByGrade,
		handleFetchCurriculumByProgram
	} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);

	const schema = yup.object().shape({
		BranchID: yup.number().nullable().required('Bạn không được để trống'),
		GradeID: yup.number().nullable().required('Bạn không được để trống'),
		ProgramID: yup.number().nullable().required('Bạn không được để trống'),
		CurriculumID: yup.number().nullable().required('Bạn không được để trống'),
		StartDay: yup.date().required('Bạn không được để trống'),
		EndDay: yup
			.date()
			.required('Bạn không được để trống')
			.when('fromDate', (startDate, schema) => startDate && schema.min(startDate, `Ngày không hợp lệ`)),
		CourseName: yup.string(),
		Price: yup.string().required('Bạn không được để trống'),
		SalaryOfLesson: yup.string().required('Bạn không được để trống')
	});
	const defaultValuesInit = {
		BranchID: null,
		GradeID: null,
		ProgramID: null,
		CurriculumID: null,
		StartDay: moment().format('YYYY/MM/DD'),
		EndDay: moment().add(1, 'month').format('YYYY/MM/DD'),
		CourseName: '',
		Price: '',
		SalaryOfLesson: ''
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});
	const createCourseSwitchFunc = (data) => {
		switch (isUpdate) {
			case false:
				if (!handleGetCourse) return;
				handleGetCourse(data).then((res) => {
					if (res) {
						closeModal();
						form.reset({ ...defaultValuesInit });
					}
				});
				break;
			default:
				break;
		}
	};
	// ONCHANGE OF GRADE FIELD
	const checkHandleFetchProgramByGrade = (value) => {
		if (!handleFetchProgramByGrade) return;
		form.setValue('ProgramID', undefined);
		handleFetchProgramByGrade(value);
	};
	// ONCHANGE STUDY TIME AND PROGRAM
	const checkHandleFetchCurriculumByProgram = (value: number) => {
		if (!handleFetchCurriculumByProgram) return;
		form.setValue('CurriculumID', undefined);
		handleFetchCurriculumByProgram(value);
	};

	return (
		<>
			<button type="button" className="btn btn-warning" onClick={openModal}>
				Tạo khóa học 1 - 1
			</button>
			<Modal
				// style={{top: 20}}
				title="Thông tin khóa học"
				visible={isModalVisible}
				footer={null}
				width={800}
				onCancel={closeModal}
			>
				<div className="wrap-form">
					<Form layout="vertical" onFinish={form.handleSubmit(createCourseSwitchFunc)}>
						<div className="row">
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="BranchID"
									label="Trung Tâm"
									placeholder="Chọn trung tâm"
									isRequired
									optionList={optionListForForm.branchList}
									isLoading={isLoading.type === 'FETCH_DATA' && isLoading.status}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="GradeID"
									isRequired
									label="Khối học"
									placeholder="Chọn khối học"
									isLoading={isLoading.type === 'FETCH_DATA' && isLoading.status}
									optionList={optionListForForm.gradeList}
									onChangeSelect={checkHandleFetchProgramByGrade}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="ProgramID"
									isRequired
									label="Chương trình học"
									isLoading={isLoading.type === 'GradeID' && isLoading.status}
									placeholder="Chọn chương trình học"
									optionList={optionListForForm.programList}
									onChangeSelect={(value) => {
										const price = optionListForForm.programList.find((p) => p.value === value)?.options.Price || 0;
										form.setValue('Price', numberWithCommas(price));
										checkHandleFetchCurriculumByProgram(value);
									}}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="CurriculumID"
									isRequired
									label="Giáo trình"
									isLoading={isLoading.type === 'ProgramID' && isLoading.status}
									placeholder="Chọn giáo trình"
									optionList={optionListForForm.curriculumList}
								/>
							</div>

							<div className="col-md-6 col-12">
								<InputTextField
									form={form}
									name="Price"
									isRequired
									label="Học phí"
									placeholder="Nhập học phí"
									handleFormatCurrency={numberWithCommas}
								/>
							</div>
							<div className="col-md-6 col-12">
								<InputTextField
									form={form}
									name="SalaryOfLesson"
									isRequired
									label="Lương/buổi"
									placeholder="Nhập lương/buổi"
									handleFormatCurrency={numberWithCommas}
								/>
							</div>

							<div className="col-md-6 col-12">
								<DateField form={form} name="StartDay" isRequired label="Ngày mở" placeholder="Chọn ngày mở" />
							</div>
							<div className="col-md-6 col-12">
								<DateField form={form} name="EndDay" isRequired label="Ngày đóng" placeholder="Chọn ngày đóng" />
							</div>
							<div className="col-12">
								<InputTextField
									form={form}
									name="CourseName"
									label="Tên khóa học"
									placeholder="[Trung tâm][Chương trình học][Giáo trình] - (Ngày học - Ngày đóng)"
								/>
							</div>
							<div className="col-md-12 col-12 mt-3" style={{ textAlign: 'center' }}>
								<button
									type="submit"
									className="btn btn-primary"
									disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
								>
									Tạo khóa học
									{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
};
CreateSelfCourseForm.propTypes = {
	isUpdate: PropTypes.bool,
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	//
	optionListForForm: PropTypes.shape({
		branchList: optionCommonPropTypes,
		gradeList: optionCommonPropTypes,
		programList: optionCommonPropTypes,
		curriculumList: optionCommonPropTypes
	}),
	//
	handleGetCourse: PropTypes.func,
	handleFetchProgramByGrade: PropTypes.func,
	handleFetchCurriculumByProgram: PropTypes.func
};
CreateSelfCourseForm.defaultProps = {
	isUpdate: false,
	isLoading: { type: '', status: false },
	//
	optionListForForm: {
		branchList: [],
		gradeList: [],
		programList: [],
		curriculumList: []
	},
	handleGetCourse: null,
	handleFetchProgramByGrade: null,
	handleFetchCurriculumByProgram: null
};
export default CreateSelfCourseForm;
