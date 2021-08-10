import {yupResolver} from '@hookform/resolvers/yup';
import {Form, Modal, Spin} from 'antd';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {UserCheck} from 'react-feather';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import SelectField from '~/components/FormControl/SelectField';

const CourseListUpdate = (props) => {
	const {
		handleFetchDataForUpdateForm,
		handleOnUpdateCourse,
		courseObj,
		isLoading,
		optionList,
	} = props;

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
		AcademicUID: yup.number(),
		TeacherLeaderUID: yup.number(),
	});
	const defaultValuesInit = {
		AcademicUID: 0,
		TeacherLeaderUID: 0,
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		if (courseObj) {
			console.log(courseObj);
			form.reset({
				...courseObj,
			});
		}
	}, [courseObj]);

	const checkHandleFetchDataForUpdateForm = ({BranchID}) => {
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

	useEffect(() => {
		const {AcademicUID, TeacherLeaderUID} = courseObj;
		const {academicList, teacherLeadList} = optionList;
		if (academicList.length && teacherLeadList.length) {
			if (!academicList.some((o) => o.value === AcademicUID)) {
				form.setValue('AcademicUID', 0);
			}
			if (!teacherLeadList.some((o) => o.value === TeacherLeaderUID)) {
				form.setValue('TeacherLeaderUID', 0);
			}
		}
	}, [optionList]);

	return (
		<>
			<button className="btn btn-icon" onClick={showModal}>
				<UserCheck />
			</button>
			<Modal
				width="350px"
				title="Update Staff"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={null}
			>
				<div className="wrap-form">
					<Form
						layout="vertical"
						onFinish={form.handleSubmit(checkHandleOnUpdateCourse)}
					>
						<SelectField
							form={form}
							name="AcademicUID"
							label="Academic Officer:"
							optionList={optionList.academicList}
						/>
						<SelectField
							form={form}
							name="TeacherLeaderUID"
							label="Teacher Leader:"
							optionList={optionList.teacherLeadList}
						/>
						<button
							type="submit"
							className="btn btn-primary w-100"
							disabled={isLoading.type == 'UPDATE_DATA' && isLoading.status}
						>
							Update
							{isLoading.type == 'UPDATE_DATA' && isLoading.status && (
								<Spin className="loading-base" />
							)}
						</button>
					</Form>
				</div>
			</Modal>
		</>
	);
};

const propTypesOption = PropTypes.arrayOf(
	PropTypes.shape({
		title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	})
);
CourseListUpdate.propTypes = {
	handleOnUpdateCourse: PropTypes.func,
	handleFetchDataForUpdateForm: PropTypes.func,
	courseObj: PropTypes.shape({
		ID: PropTypes.number.isRequired,
		BranchID: PropTypes.number.isRequired,
	}),
	optionList: PropTypes.shape({
		teacherLeadList: propTypesOption,
		academicList: propTypesOption,
	}),
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
};
CourseListUpdate.defaultProps = {
	handleOnUpdateCourse: null,
	handleFetchDataForUpdateForm: null,
	courseObj: null,
	optionList: {},
	isLoading: {type: '', status: false},
};
export default CourseListUpdate;
