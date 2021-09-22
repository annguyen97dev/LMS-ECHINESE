import {yupResolver} from '@hookform/resolvers/yup';
import {Checkbox, Form, Modal, Spin, Tooltip} from 'antd';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {RotateCcw} from 'react-feather';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import InputTextField from '~/components/FormControl/InputTextField';
import {numberWithCommas} from '~/utils/functions';

PackageExaminerSalary.propTypes = {
	isUpdate: PropTypes.bool,
	examinerObj: PropTypes.object,
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	handleSubmit: PropTypes.func,
};
PackageExaminerSalary.defaultProps = {
	isUpdate: false,
	examinerObj: {},
	isLoading: {type: '', status: false},
	handleSubmit: null,
};

function PackageExaminerSalary(props) {
	const {isLoading, isUpdate, examinerObj, handleSubmit} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const openModal = () => {
		setIsModalVisible(true);
	};
	const closeModal = () => {
		setIsModalVisible(false);
	};

	const schema = yup.object().shape({
		TeacherName: yup.string().required('Bạn không được để trống'),
		TeacherID: yup.number().required('Bạn không được để trống'),
		Salary: yup.string().required('Bạn không được để trống'),
	});
	const defaultValuesInit = {
		TeacherName: '',
		TeacherID: '',
		Salary: '',
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		if (isUpdate) {
			form.reset({
				Salary: examinerObj.Salary ? numberWithCommas(examinerObj.Salary) : '',
				TeacherID: examinerObj.UserInformationID || examinerObj.TeacherID,
				TeacherName: examinerObj.FullNameUnicode || examinerObj.TeacherName,
			});
		} else {
			form.reset({
				TeacherID: examinerObj.UserInformationID || examinerObj.TeacherID,
				TeacherName: examinerObj.FullNameUnicode || examinerObj.TeacherName,
			});
		}
	}, [examinerObj]);

	const checkHandleSubmit = (data) => {
		if (!handleSubmit) return;
		handleSubmit(data).then((res) => {
			if (res) {
				closeModal();
				if (!isUpdate) {
					form.reset({...defaultValuesInit});
				}
			}
		});
	};

	return (
		<>
			{isUpdate ? (
				<button className="btn btn-icon edit" onClick={openModal}>
					<Tooltip title="Cập nhật">
						<RotateCcw />
					</Tooltip>
				</button>
			) : (
				<Checkbox
					checked={examinerObj?.isFixSetpacked || isModalVisible}
					disabled={examinerObj?.isFixSetpacked}
					onChange={openModal}
				></Checkbox>
			)}
			<Modal
				title="Danh sách giáo viên"
				visible={isModalVisible}
				onOk={closeModal}
				onCancel={closeModal}
				footer={null}
			>
				<div>
					<Form
						layout="vertical"
						onFinish={form.handleSubmit(checkHandleSubmit)}
					>
						<div className="row">
							<div className="col-12">
								<InputTextField
									form={form}
									name="TeacherID"
									label="Mã giáo viên"
									placeholder="Nhập mã giáo viên"
									disabled={true}
								/>
							</div>
							<div className="col-12">
								<InputTextField
									form={form}
									name="TeacherName"
									label="Tên giáo viên"
									placeholder="Nhập tên giáo viên"
									disabled={true}
								/>
							</div>
							<div className="col-12">
								<InputTextField
									form={form}
									name="Salary"
									label="Thưởng chấm bài"
									placeholder="Nhập thưởng chấm bài"
									handleFormatCurrency={numberWithCommas}
								/>
							</div>

							<div
								className="col-md-12 col-12 mt-3 "
								style={{textAlign: 'center'}}
							>
								<button
									type="submit"
									className="btn btn-primary"
									disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
								>
									Lưu
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
}

export default PackageExaminerSalary;
