import {yupResolver} from '@hookform/resolvers/yup';
import {Form, Modal, Spin, Tooltip} from 'antd';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {MinusCircle, PlusCircle, RotateCcw} from 'react-feather';
import {useFieldArray, useForm} from 'react-hook-form';
import * as yup from 'yup';
import DateField from '~/components/FormControl/DateField';
import InputTextField from '~/components/FormControl/InputTextField';
import SelectField from '~/components/FormControl/SelectField';
import TextAreaField from '~/components/FormControl/TextAreaField';
import {numberWithCommas} from '~/utils/functions';
import {optionCommonPropTypes} from '~/utils/proptypes';

SalesCampaignForm.propTypes = {
	isUpdate: PropTypes.bool,
	updateObj: PropTypes.shape({}),
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	handleSubmit: PropTypes.func,
	optionStatusList: optionCommonPropTypes,
};
SalesCampaignForm.defaultProps = {
	isUpdate: false,
	updateObj: {},
	isLoading: {type: '', status: false},
	handleSubmit: null,
	optionStatusList: [],
};

interface SalesCampaignFormProps {
	isUpdate: boolean;
	updateObj: ISaleCampaign;
	isLoading: {
		type: string;
		status: boolean;
	};
	handleSubmit: any;
	optionStatusList: IOptionCommon[];
}
function SalesCampaignForm(props: SalesCampaignFormProps) {
	const {isUpdate, isLoading, updateObj, handleSubmit, optionStatusList} =
		props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);

	const schema = yup.object().shape({
		Name: yup.string().required('Bạn không được để trống'),
		StartTime: yup.date().nullable().required('Bạn không được để trống'),
		EndTime: yup
			.date()
			.nullable()
			.required('Bạn không được để trống')
			.when(
				'StartTime',
				(startDate, schema) =>
					startDate && schema.min(startDate, `Ngày không hợp lệ`)
			),
		Note: yup.string(),
		StatusID: yup.number().nullable(),
		SaleBonusList: yup.array().of(
			yup.object().shape({
				MoneyCollected: yup.string().required('Bạn không được để trống'),
				PercentBonus: yup
					.number()
					.typeError('Bạn không được để trống')
					.nullable()
					.required('Bạn không được để trống'),
			})
		),
	});
	const defaultValuesInit = {
		Name: '',
		StartTime: undefined,
		EndTime: undefined,
		Note: '',
		StatusID: null,
		SaleBonusList: [],
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});
	const {fields, append, remove} = useFieldArray({
		control: form.control,
		name: 'SaleBonusList',
	});

	useEffect(() => {
		if (isUpdate && updateObj) {
			form.reset({
				...updateObj,
				SaleBonusList: updateObj.SaleBonusList.map((s) => ({
					...s,
					MoneyCollected: numberWithCommas(s.MoneyCollected),
				})),
			});
		}
	}, [updateObj]);

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
				<button className="btn btn-warning add-new" onClick={openModal}>
					Tạo chiến dịch
				</button>
			)}
			<Modal
				style={{top: 50}}
				title={isUpdate ? 'Cập nhật chiến dịch' : 'Tạo chiến dịch mới'}
				visible={isModalVisible}
				footer={null}
				onCancel={closeModal}
			>
				<div className="wrap-form">
					<Form
						layout="vertical"
						onFinish={form.handleSubmit(checkHandleSubmit)}
					>
						<div className="row">
							<div className="col-12">
								<InputTextField
									form={form}
									name="Name"
									label="Tên chiến dịch"
									placeholder="Nhập tên chiến dịch"
								/>
							</div>
							{isUpdate &&
								optionStatusList
									.map((o) => o.value)
									.includes(form.getValues('StatusID')) && (
									<div className="col-12">
										<SelectField
											form={form}
											name="StatusID"
											label="Trạng thái"
											placeholder="Chọn trạng thái"
											optionList={optionStatusList}
										/>
									</div>
								)}
							<div className="col-md-6 col-12">
								<DateField
									form={form}
									name="StartTime"
									label="Ngày bắt đầu"
									placeholder="Chọn ngày bắt đầu"
								/>
							</div>
							<div className="col-md-6 col-12">
								<DateField
									form={form}
									name="EndTime"
									label="Ngày kết thúc"
									placeholder="Chọn ngày kết thúc"
								/>
							</div>
							<div className="col-md-12 col-12">
								<TextAreaField
									form={form}
									name="Note"
									label="Ghi chú"
									placeholder="Nhập ghi chú"
									rows={2}
								/>
							</div>
							<div className="col-12">
								<div className="more-revenue">
									<PlusCircle
										size="20px"
										className="add"
										onClick={() => {
											append({MoneyCollected: '', PercentBonus: null});
										}}
										style={{
											right: `${
												form.getValues('SaleBonusList').length > 2 ? '10px' : 0
											}`,
										}}
									/>
									<Form.Item label="Mốc doanh thu">
										<div className="more-revenue-list">
											{fields.map((item, index) => {
												return (
													<div className="more-revenue-item" key={item.id}>
														<div className="row">
															<div className="col-md-6 col-12">
																<InputTextField
																	isDynamicField={true}
																	form={form}
																	name={`SaleBonusList.${index}.MoneyCollected`}
																	label={`Mốc ${index + 1}`}
																	placeholder="Nhập mốc"
																	handleFormatCurrency={numberWithCommas}
																/>
															</div>
															<div className="col-md-6 col-12">
																<InputTextField
																	isDynamicField={true}
																	form={form}
																	name={`SaleBonusList.${index}.PercentBonus`}
																	placeholder="Nhập thưởng khi đạt mốc chỉ tiêu"
																	label="Thưởng (%)"
																/>
															</div>
														</div>
														<MinusCircle
															size="20px"
															className="remove"
															onClick={() => {
																remove(index);
															}}
														/>
													</div>
												);
											})}
										</div>
									</Form.Item>
								</div>
							</div>
							<div
								className="col-md-12 col-12 mt-3 "
								style={{textAlign: 'center'}}
							>
								<button
									type="submit"
									className="btn btn-primary w-100"
									disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
								>
									{isUpdate ? 'Cập nhật' : 'Khởi tạo'}
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

export default SalesCampaignForm;
