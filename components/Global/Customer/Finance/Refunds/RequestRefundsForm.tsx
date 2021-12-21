import { yupResolver } from '@hookform/resolvers/yup';
import { Checkbox, Form, Modal, Spin, Tooltip } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { DollarSign } from 'react-feather';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import CheckboxField from '~/components/FormControl/CheckboxField';
import InputTextField from '~/components/FormControl/InputTextField';
import RadioField from '~/components/FormControl/RadioField';
import TextAreaField from '~/components/FormControl/TextAreaField';
import { numberWithCommas } from '~/utils/functions';
import { radioCommonPropTypes } from '~/utils/proptypes';

RequestRefundsForm.propTypes = {
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	studentObj: PropTypes.object,
	getInfoCourse: PropTypes.func,
	courseListOfStudent: PropTypes.array,
	paymentMethodOptionList: radioCommonPropTypes,
	onSubmit: PropTypes.func
};

RequestRefundsForm.defaultProps = {
	isLoading: { type: '', status: false },
	studentObj: {},
	getInfoCourse: null,
	courseListOfStudent: [],
	paymentMethodOptionList: [],
	onSubmit: null
};

function RequestRefundsForm(props) {
	const { isLoading, studentObj, getInfoCourse, courseListOfStudent, paymentMethodOptionList, onSubmit } = props;

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [courseIDList, setCourseIDList] = useState<number[]>([]);
	const [customErrorCheckbox, setCustomErrorCheckbox] = useState({
		message: '',
		hasError: false
	});
	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);

	const schema = yup.object().shape({
		ListCourseOfStudentID: yup
			.array(yup.number())
			.min(1, 'Bạn phải chọn ít nhất 1 khóa học')
			.nullable()
			.required('Bạn không được để trống'),
		Price: yup.string().required('Bạn không được để trống'),
		PaymentMethodsID: yup.number().oneOf([1, 2], 'Bạn không được để trống'),
		Reason: yup.string(),
		isExpulsion: yup.bool()
	});

	const defaultValuesInit = {
		ListCourseOfStudentID: null,
		Price: '',
		PaymentMethodsID: 1,
		Reason: '',
		isExpulsion: false
	};

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	useEffect(() => {
		const { errors } = form.formState;
		const hasError = errors['ListCourseOfStudentID'];
		const listCourseID = form.watch('ListCourseOfStudentID');
		if (hasError) {
			setCustomErrorCheckbox({
				hasError,
				message: errors['ListCourseOfStudentID']?.message
			});
		}
		if (listCourseID?.length) {
			setCustomErrorCheckbox({
				hasError: false,
				message: ''
			});
		}
	}, [form.watch('ListCourseOfStudentID'), form.formState.errors]);

	useEffect(() => {
		isModalVisible && studentObj.ID && getInfoCourse && getInfoCourse(studentObj.ID);
	}, [isModalVisible]);

	const checkOnSubmit = (data) => {
		if (!onSubmit) return;
		onSubmit(data).then((res) => {
			if (res?.status === 200) {
				form.reset({ ...defaultValuesInit });
				closeModal();
				setCourseIDList([]);
			}
		});
	};
	return (
		<>
			<Tooltip title="Yêu cầu hoàn tiền">
				<button className="btn btn-icon" onClick={openModal}>
					<DollarSign />
				</button>
			</Tooltip>
			<Modal title="Thông tin yêu cầu hoàn tiền" visible={isModalVisible} onCancel={closeModal} footer={null} width={600}>
				<div className="request-refund-form">
					<Form layout="vertical" onFinish={form.handleSubmit(checkOnSubmit)}>
						<div className="row">
							<div className="col-12">
								<div
									className={`refund-branch ${
										isLoading.type === 'FETCH_INFO_COURSE' && isLoading.status ? 'custom-loading' : ''
									} ${customErrorCheckbox.hasError ? 'ant-form-item-with-help ant-form-item-has-error' : ''}`}
								>
									<Checkbox.Group
										{...form.register('ListCourseOfStudentID')}
										name="ListCourseOfStudentID"
										value={courseIDList}
										onChange={(arrID: number[]) => {
											form.setValue('ListCourseOfStudentID', arrID);
											setCourseIDList(arrID);
										}}
									>
										{courseListOfStudent.map((c: any) => {
											return (
												<>
													<div className="refund-branch-item" key={c.ID}>
														<Checkbox value={c.ID} />
														<div className="info">
															<p className="name">{c.CourseName}</p>
															<ul className="list">
																<li className="price">
																	Giá:
																	{c.Price && <span>{numberWithCommas(c.Price)} VNĐ</span>}
																</li>
																<li className="date-start">
																	Ngày bắt đầu:
																	{c.StartDay && <span>{moment(c.StartDay).format('DD/MM/YYYY')}</span>}
																</li>
																<li className="date-end">
																	Ngày kết thúc:
																	{c.EndDay && <span>{moment(c.EndDay).format('DD/MM/YYYY')}</span>}
																</li>
															</ul>
														</div>
													</div>
												</>
											);
										})}
									</Checkbox.Group>
									{customErrorCheckbox.hasError && (
										<div className="ant-form-item-explain ant-form-item-explain-error">
											<div role="alert">{customErrorCheckbox.message}</div>
										</div>
									)}
									<Spin className="custom-loading-icon" size="large" />
								</div>
							</div>
							<div className="col-12">
								<InputTextField
									form={form}
									name="Price"
									label="Số tiền hoàn"
									placeholder="Nhập số tiền hoàn"
									handleFormatCurrency={numberWithCommas}
								/>
							</div>
							<div className="col-12">
								<RadioField
									form={form}
									name="PaymentMethodsID"
									label="Phương thức hoàn tiền"
									radioList={paymentMethodOptionList}
								/>
							</div>
							<div className="col-12">
								<TextAreaField form={form} name="Reason" label="Lý do" placeholder="Nhập lý do" rows={5} />
							</div>
							<div className="col-12">
								<CheckboxField form={form} name="isExpulsion" text="Xóa học viên ra khỏi lớp" />
							</div>
							<div className="col-12">
								<button
									type="submit"
									className="btn btn-primary w-100"
									disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
								>
									Xác nhận
									{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
}

export default RequestRefundsForm;
