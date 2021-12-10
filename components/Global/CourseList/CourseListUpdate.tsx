import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Modal, Spin } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { UserCheck } from 'react-feather';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import InputTextField from '~/components/FormControl/InputTextField';
import SelectField from '~/components/FormControl/SelectField';
import { numberWithCommas } from '~/utils/functions';
import { optionCommonPropTypes } from '~/utils/proptypes';

const CourseListUpdate = (props) => {
	const { handleFetchDataForUpdateForm, handleOnUpdateCourse, courseObj, isLoading, optionList } = props;

	const [isModalVisible, setIsModalVisible] = useState(false);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const schema = yup.object().shape({
		// AcademicUID: yup.number(),
		TeacherLeaderUID: yup.number().min(1, 'Bạn không được để trống'),
		SalaryOfLesson: yup.string().nullable().required('Bạn không được để trống')
	});
	const defaultValuesInit = {
		// AcademicUID: 0,
		TeacherLeaderUID: 0,
		SalaryOfLesson: ''
	};

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	useEffect(() => {
		if (courseObj) {
			form.reset({
				...courseObj,
				SalaryOfLesson: numberWithCommas(courseObj.SalaryOfLesson)
			});
		}
	}, [courseObj]);

	// CHECK IF VALUE DO NOT IN THE SELECT => CHANGE VALUE TO DEFAULT (0)
	useEffect(() => {
		let { TeacherLeaderUID } = courseObj;
		const { teacherLeadList } = optionList;
		// if (academicList.length && teacherLeadList.length) {
		if (teacherLeadList.length) {
			// if (!academicList.some((o) => o.value === AcademicUID)) {
			// 	form.setValue('AcademicUID', 0);
			// }
			if (!teacherLeadList.some((o) => o.value === TeacherLeaderUID)) {
				form.setValue('TeacherLeaderUID', 0);
			}
		}
	}, [courseObj, optionList]);

	const checkHandleFetchDataForUpdateForm = ({ BranchID }) => {
		if (!handleFetchDataForUpdateForm) return;
		handleFetchDataForUpdateForm(BranchID);
	};

	const checkHandleOnUpdateCourse = (data) => {
		if (!handleOnUpdateCourse) return;
		handleOnUpdateCourse(data).then((res) => {
			res && res.status === 200 && handleCancel();
		});
	};

	useEffect(() => {
		isModalVisible && checkHandleFetchDataForUpdateForm(courseObj);
	}, [isModalVisible]);

	return (
		<>
			<button className="btn btn-icon" onClick={showModal}>
				<UserCheck />
			</button>
			<Modal
				width="350px"
				title="Cập nhật quản lý khóa học"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={null}
			>
				<div className="wrap-form">
					<Form layout="vertical" onFinish={form.handleSubmit(checkHandleOnUpdateCourse)}>
						{/* <SelectField
							form={form}
							name="AcademicUID"
							label="Học vụ"
							optionList={optionList.academicList}
							isLoading={isLoading.type == 'FETCH_DATA' && isLoading.status}
						/> */}
						<SelectField
							form={form}
							name="TeacherLeaderUID"
							isRequired
							label="Giáo viên quản lý"
							optionList={optionList.teacherLeadList}
							isLoading={isLoading.type == 'FETCH_DATA' && isLoading.status}
						/>
						<InputTextField
							form={form}
							name="SalaryOfLesson"
							isRequired
							label="Lương/buổi"
							placeholder="Nhập lương/buổi học"
							handleFormatCurrency={numberWithCommas}
						/>
						<button
							type="submit"
							className="btn btn-primary w-100"
							disabled={isLoading.type == 'UPDATE_DATA' && isLoading.status}
						>
							Cập nhật
							{isLoading.type == 'UPDATE_DATA' && isLoading.status && <Spin className="loading-base" />}
						</button>
					</Form>
				</div>
			</Modal>
		</>
	);
};

CourseListUpdate.propTypes = {
	handleOnUpdateCourse: PropTypes.func,
	handleFetchDataForUpdateForm: PropTypes.func,
	courseObj: PropTypes.shape({
		AcademicUID: PropTypes.number.isRequired,
		TeacherLeaderUID: PropTypes.number.isRequired
	}),
	optionList: PropTypes.shape({
		teacherLeadList: optionCommonPropTypes,
		academicList: optionCommonPropTypes
	}),
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	})
};
CourseListUpdate.defaultProps = {
	handleOnUpdateCourse: null,
	handleFetchDataForUpdateForm: null,
	courseObj: {
		AcademicUID: 0,
		TeacherLeaderUID: 0
	},
	optionList: {
		teacherLeadList: [],
		academicList: []
	},
	isLoading: { type: '', status: false }
};
export default CourseListUpdate;
