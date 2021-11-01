import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Select, Spin, Tooltip } from 'antd';
import { Info, RotateCcw } from 'react-feather';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputTextField from '~/components/FormControl/InputTextField';
import DateField from '~/components/FormControl/DateField';
import SelectField from '~/components/FormControl/SelectField';
import TextAreaField from '~/components/FormControl/TextAreaField';
import { useWrap } from '~/context/wrap';
import { id } from 'date-fns/locale';
import TimePickerField from '~/components/FormControl/TimePickerField';

let returnSchema = {};
let schema = null;

const TestCustomerForm = (props) => {
	const { TextArea } = Input;
	const { Option } = Select;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { isLoading, rowID, _onSubmit, getIndex, index, rowData, listData, dataTeacher } = props;

	const { showNoti } = useWrap();

	// -----  HANDLE ALL IN FORM -------------
	const defaultValuesInit = {
		BranchID: null, //int
		UserInformationID: null,
		AppointmentDate: null, //số điện thoại
		Time: '', //
		Note: null, //int ID nguồn khách
		TeacherID: null
	};

	(function returnSchemaFunc() {
		returnSchema = { ...defaultValuesInit };
		Object.keys(returnSchema).forEach(function (key) {
			switch (key) {
				case 'Email':
					returnSchema[key] = yup.string().email('Email nhập sai cú pháp').required('Bạn không được để trống');
					break;

				default:
					if (key !== 'Note') {
						returnSchema[key] = yup.mixed().required('Bạn không được để trống');
					}
					break;
			}
		});

		schema = yup.object().shape(returnSchema);
	})();

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	// SUBMI FORM
	const onSubmit = (data: any) => {
		let res = _onSubmit(data);

		res.then(function (rs: any) {
			rs && rs.status == 200 && (setIsModalVisible(false), form.reset(defaultValuesInit));
		});
	};

	useEffect(() => {
		if (isModalVisible) {
			if (rowData) {
				rowData.ExamTopicID = null;
				if (rowData.TeacherID == 0) {
					rowData.TeacherID = null;
				}

				form.reset(rowData);
			}
		}
	}, [isModalVisible]);

	return (
		<>
			<Tooltip title="Cập nhật lịch hẹn test">
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsModalVisible(true);
						getIndex(index);
					}}
				>
					<RotateCcw />
				</button>
			</Tooltip>

			<Modal title="Thông tin hẹn test" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
				<div className="wrap-form">
					<Form layout="vertical" onFinish={form.handleSubmit(onSubmit)}>
						{/*  */}
						<div className="row">
							<div className="col-md-6 col-12">
								<SelectField
									disabled={true}
									form={form}
									name="UserInformationID"
									label="Học viên"
									optionList={listData.Student}
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField form={form} name="BranchID" label="Trung tâm" optionList={listData.Branch} />
							</div>
						</div>
						{/*  */}
						<div className="row">
							<div className="col-md-6 col-12">
								<DateField form={form} name="AppointmentDate" label="Ngày hẹn" />
							</div>
							<div className="col-md-6 col-12">
								<TimePickerField form={form} name="Time" label="Giờ hẹn" />
							</div>
						</div>
						{/*  */}

						<div className="row">
							<div className="col-12">
								<SelectField form={form} name="TeacherID" label="Giáo viên chấm bài" optionList={listData.Teacher} />
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<TextAreaField rows={3} form={form} name="Note" label="Ghi chú" />
							</div>
						</div>
						{/*  */}
						<div className="row mt-3">
							<div className="col-12">
								<button type="submit" className="btn btn-primary w-100">
									Lưu
									{isLoading?.type == 'ADD_DATA' && isLoading?.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
};

export default TestCustomerForm;
