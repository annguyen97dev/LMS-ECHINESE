import { DeploymentUnitOutlined, MailOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Divider, Form, Modal, Spin, Tooltip } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { RotateCcw } from 'react-feather';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import UploadFile from '~/components/Elements/UploadFile/UploadFile';
import DateField from '~/components/FormControl/DateField';
import InputNumberField from '~/components/FormControl/InputNumberField';
import InputPassField from '~/components/FormControl/InputPassField';
import InputPreventText from '~/components/FormControl/InputPreventText';
import InputTextField from '~/components/FormControl/InputTextField';
import SelectField from '~/components/FormControl/SelectField';
import UploadAvatarField from '~/components/FormControl/UploadAvatarField';
import { useWrap } from '~/context/wrap';
import { optionCommonPropTypes } from '~/utils/proptypes';

const TeacherForm = (props) => {
	const {
		handleCreateTeacher,
		isUpdate,
		handleUpdateTeacher,
		updateObj,
		isLoading,
		indexUpdateObj,
		//
		isClearForm,
		//
		optionStatusList,
		optionGenderList,
		optionAreaSystemList,
		handleFetchDistrict,
		handleFetchWard,
		optionBranchList,
		handleFetchBranch
	} = props;
	const { areaList, districtList, wardList } = optionAreaSystemList;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { userInformation } = useWrap();
	const openModal = () => {
		setIsModalVisible(true);
		if (isUpdate && updateObj && updateObj.AreaID) {
			if (handleFetchBranch) {
				handleFetchBranch(updateObj.AreaID);
			}
			if (handleFetchDistrict) {
				handleFetchDistrict(updateObj.AreaID);
			}
			if (handleFetchWard && updateObj.DistrictID) {
				handleFetchWard(updateObj.DistrictID);
			}
		}
	};
	const closeModal = () => setIsModalVisible(false);
	const schemaBase = yup.object().shape({
		AreaID: yup.number().nullable().required('B???n kh??ng ???????c ????? tr???ng'),
		Branch: yup.array().min(1, 'B???n ph???i ch???n ??t nh???t 1 trung t??m').required('B???n kh??ng ???????c ????? tr???ng'),
		FullNameUnicode: yup.string().required('B???n kh??ng ???????c ????? tr???ng'),
		Jobdate: yup.string().required('B???n kh??ng ???????c ????? tr???ng'),
		Email: yup.string().email('Email kh??ng ????ng ?????nh d???ng').required('B???n kh??ng ???????c ????? tr???ng'),
		Address: yup.string()
	});
	const schemaUpdate = yup.object().shape({
		DistrictID: yup.number().nullable(),
		WardID: yup.number().nullable(),
		HouseNumber: yup.string().nullable(),
		Avatar: yup.string().nullable(),
		DOB: yup.string().nullable(),
		Gender: yup.number().nullable().oneOf([0, 1, 2]),
		CMND: yup.string().nullable(),
		CMNDDate: yup.string().nullable(),
		CMNDRegister: yup.string().nullable(),
		Extension: yup.string().nullable(),
		StatusID: yup.number().nullable().oneOf([0, 1]),
		Password: yup.string().nullable(),
		Mobile: yup
			.string()
			.required('B???n kh??ng ???????c ????? tr???ng')
			.matches(
				/^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/,
				'Sdt kh??ng ????ng ?????nh d???ng'
			)
	});

	const schema = isUpdate ? schemaBase.concat(schemaUpdate) : schemaBase;

	const defaultValuesInit = {
		AreaID: null,
		Branch: undefined,
		FullNameUnicode: '',
		ChineseName: '',
		LinkFaceBook: '',
		Jobdate: moment().format('YYYY/MM/DD'),
		Email: '',
		Mobile: '',
		Address: '',
		DistrictID: null,
		WardID: null,
		HouseNumber: '',
		Avatar: '',
		DOB: '',
		Gender: 0,
		CMND: '',
		CMNDDate: '',
		CMNDRegister: '',
		Extension: '',
		StatusID: 1,
		Password: '',
		ContractOfStaff: null, //file h???p ?????ng
		DegreeOfStaff: null, //file b???ng c???p
		BankAccountNumber: null,
		BankAccountHolderName: null,
		BankBranch: null,
		UserName: null
	};

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	// Get file
	const getFile = (file, type) => {
		switch (type) {
			case 'contract':
				form.setValue('ContractOfStaff', file);
				break;
			case 'degree':
				form.setValue('DegreeOfStaff', file);
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		if (isUpdate && updateObj) {
			form.reset({
				...updateObj,
				Branch: updateObj.Branch.map((obj) => obj.ID)
			});
		}
	}, [updateObj]);

	useEffect(() => {
		isClearForm && form.reset({ ...defaultValuesInit });
	}, [isClearForm]);

	const checkHandleFetchBranch = (value) => {
		if (!handleFetchBranch) return;
		form.setValue('Branch', undefined);
		form.setValue('DistrictID', null);
		form.setValue('WardID', null);
		handleFetchBranch(value);
	};
	const checkHandleFetchDistrict = (value) => {
		if (!handleFetchDistrict) return;
		handleFetchDistrict(value);
	};
	const checkHandleFetchWard = (value) => {
		if (!handleFetchWard) return;
		form.setValue('WardID', null);
		handleFetchWard(value);
	};
	const teacherSwitchFunc = (data) => {
		switch (isUpdate) {
			case true:
				if (!handleUpdateTeacher) return;
				handleUpdateTeacher(data, indexUpdateObj).then((res) => {
					if (res && res.status === 200) {
						closeModal();
					}
				});
				break;
			case false:
				if (!handleCreateTeacher) return;
				handleCreateTeacher(data).then((res) => {
					if (res && res.status === 200) {
						closeModal();
					}
				});
				break;
			default:
				break;
		}
	};

	return (
		<>
			{isUpdate ? (
				<button className="btn btn-icon edit" onClick={openModal}>
					<Tooltip title="C???p nh???t">
						<RotateCcw />
					</Tooltip>
				</button>
			) : (
				<button className="btn btn-warning add-new" onClick={openModal}>
					Th??m m???i
				</button>
			)}
			<Modal
				style={{ top: isUpdate ? 20 : 100 }}
				title={isUpdate ? 'C???p nh???t gi??o vi??n' : 'Th??m gi??o vi??n'}
				visible={isModalVisible}
				onCancel={closeModal}
				footer={
					isUpdate ? (
						<div className="row">
							<div className="col-12 d-flex justify-content-center">
								<button
									type="submit"
									className="btn btn-primary w-100"
									onClick={form.handleSubmit(teacherSwitchFunc)}
									disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
								>
									C???p nh???t
									{isLoading.type === 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					) : null
				}
				className={`${isUpdate && 'modal-scroll'} modal-50`}
			>
				<div className="box-form">
					<Form layout="vertical" onFinish={form.handleSubmit(teacherSwitchFunc)}>
						{isUpdate ? (
							<div className="row">
								<div className="col-12">
									<div className="info-modal">
										<div className="info-modal-avatar">
											<UploadAvatarField style={{ marginBottom: 0 }} form={form} name="Avatar" />
										</div>
										<div className="info-modal-content">
											{isUpdate && (
												<div className="box-info-modal">
													<p className="name">{updateObj.FullNameUnicode}</p>
													<p className="detail">
														<span className="icon role">
															<DeploymentUnitOutlined />
														</span>
														<span className="text">{updateObj.Branch.map((b) => b.BranchName).join(', ')}</span>
													</p>
													<p className="detail">
														<span className="icon mobile">
															<WhatsAppOutlined />
														</span>
														<span className="text">{updateObj.Mobile}</span>
													</p>
													<p className="detail">
														<span className="icon email">
															<MailOutlined />
														</span>
														<span className="text">{updateObj.Email}</span>
													</p>
												</div>
											)}
										</div>
									</div>
								</div>
								<div className="col-12">
									<Divider orientation="center">Th??ng tin c?? b???n</Divider>
								</div>
								<div className="col-12">
									<InputTextField form={form} name="UserName" label="T??n ????ng nh???p" disabled={true} />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField form={form} name="Email" label="Email" placeholder="Nh???p email" isRequired={true} />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField
										form={form}
										name="FullNameUnicode"
										label="H??? v?? t??n"
										placeholder="Nh???p h??? v?? t??n"
										isRequired={true}
									/>
								</div>
								<div className="col-md-6 col-12">
									<InputTextField
										form={form}
										name="ChineseName"
										label="T??n ti???ng Trung"
										placeholder="Nh???p t??n ti???ng Trung"
									/>
								</div>
								<div className="col-md-6 col-12">
									<InputPreventText form={form} name="Mobile" label="S??? ??i???n tho???i" placeholder="Nh???p s??? ??i???n tho???i" />
								</div>
								<div className="col-md-6 col-12">
									<DateField form={form} name="DOB" label="Ng??y sinh" placeholder="Ch???n ng??y sinh" />
								</div>
								<div className="col-md-6 col-12">
									<InputPreventText form={form} name="CMND" label="S??? CMND" placeholder="Nh???p s??? CMND" />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField form={form} name="CMNDRegister" label="N??i c???p CMND" placeholder="Nh???p n??i c???p CMND" />
								</div>
								<div className="col-md-6 col-12">
									<DateField form={form} name="CMNDDate" label="Ng??y c???p CMND" placeholder="Ch???n ng??y c???p CMND" />
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										form={form}
										name="Gender"
										label="Gi???i t??nh"
										optionList={optionGenderList}
										placeholder="Ch???n gi???i t??nh"
									/>
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										form={form}
										disabled={userInformation.RoleID === 1 ? false : true}
										name="StatusID"
										label="Tr???ng th??i ho???t ?????ng"
										optionList={optionStatusList}
										placeholder="Ch???n tr???ng th??i ho???t ?????ng"
									/>
								</div>
								<div className="col-12">
									<InputPassField form={form} name="Password" label="M???t kh???u" placeholder="Nh???p m???t kh???u" />
								</div>
								<div className="col-12">
									<Divider orientation="center">?????a ch???</Divider>
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										form={form}
										name="AreaID"
										label="T???nh/Th??nh ph???"
										optionList={areaList}
										onChangeSelect={(value) => {
											checkHandleFetchBranch(value);
											checkHandleFetchDistrict(value);
										}}
										placeholder="Ch???n t???nh/th??nh ph???"
									/>
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										form={form}
										name="DistrictID"
										label="Qu???n/Huy???n"
										optionList={districtList}
										onChangeSelect={checkHandleFetchWard}
										isLoading={isLoading.type === 'FETCH_DATA_BY_AREA' && isLoading.status}
										placeholder="Ch???n qu???n/huy???n"
									/>
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										form={form}
										name="WardID"
										label="Ph?????ng/X??"
										optionList={wardList}
										isLoading={isLoading.type === 'FETCH_WARD_BY_DISTRICT' && isLoading.status}
										placeholder="Ch???n ph?????ng/x??"
									/>
								</div>
								<div className="col-md-6 col-12">
									<InputTextField form={form} name="Extension" label="M?? t??? th??m" placeholder="Nh???p m?? t??? th??m" />
								</div>
								<div className="col-12">
									<InputTextField
										form={form}
										name="HouseNumber"
										label="S??? nh??/T??n ???????ng"
										placeholder="Nh???p s??? nh??/t??n ???????ng"
									/>
								</div>
								<div className="col-12">
									<Divider orientation="center">Kh??c</Divider>
								</div>
								<div className="col-md-6 col-12">
									<Form.Item label="H???p ?????ng">
										<UploadFile getFile={(file) => getFile(file, 'contract')} />
										{updateObj?.ContractOfStaff && (
											<a href={updateObj?.ContractOfStaff} className="link-upload">
												File h???p ?????ng
											</a>
										)}
									</Form.Item>
								</div>
								<div className="col-md-6 col-12">
									<Form.Item label="B???ng c???p">
										<UploadFile url={updateObj?.DegreeOfStaff} getFile={(file) => getFile(file, 'degree')} />
										{updateObj?.ContractOfStaff && (
											<a href={updateObj?.ContractOfStaff} className="link-upload">
												File h???p ?????ng
											</a>
										)}
									</Form.Item>
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										form={form}
										name="Branch"
										label="Trung t??m"
										mode="multiple"
										optionList={optionBranchList}
										isLoading={isLoading.type === 'FETCH_DATA_BY_AREA' && isLoading.status}
										placeholder="Ch???n trung t??m"
									/>
								</div>
								<div className="col-md-6 col-12">
									<DateField form={form} name="Jobdate" label="Ng??y nh???n vi???c" placeholder="Ch???n ng??y nh???n vi???c" />
								</div>

								<div className="col-md-6 col-12">
									<InputTextField
										form={form}
										name="LinkFaceBook"
										label="Link Facebook"
										placeholder="Nh???p link facebook"
									/>
								</div>
								<div className="col-md-6 col-12">
									<InputTextField form={form} name="Address" label="?????a ch???" placeholder="Nh???p ?????a ch???" />
								</div>

								{/** ==== Th??ng tin ng??n h??ng  ====*/}
								<div className="col-12">
									<Divider orientation="center">Th??ng tin ng??n h??ng</Divider>
								</div>
								<div className="col-md-6 col-12">
									<InputTextField form={form} name="BankAccountHolderName" label="T??n ch??? th???" />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField form={form} name="BankAccountNumber" label="S??? t??i kho???n" />
								</div>
								<div className="col-md-12 col-12">
									<InputTextField form={form} name="BankBranch" label="Chi nh??nh ng??n h??ng" />
								</div>
							</div>
						) : (
							<div className="row">
								<div className="col-md-6 col-12">
									<SelectField
										form={form}
										name="AreaID"
										label="T???nh/th??nh ph???"
										optionList={areaList}
										onChangeSelect={checkHandleFetchBranch}
										placeholder="Ch???n t???nh/th??nh ph???"
										isRequired={true}
									/>
									<InputTextField
										form={form}
										name="FullNameUnicode"
										label="H??? v?? t??n"
										placeholder="Nh???p h??? v?? t??n"
										isRequired={true}
									/>
									<InputTextField form={form} name="Email" label="Email" placeholder="Nh???p email" isRequired={true} />
									<DateField
										form={form}
										name="Jobdate"
										label="Ng??y nh???n vi???c"
										placeholder="Ch???n ng??y nh???n vi???c"
										isRequired={true}
									/>
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										form={form}
										name="Branch"
										label="Trung t??m"
										mode="multiple"
										optionList={optionBranchList}
										isLoading={isLoading.type === 'FETCH_DATA_BY_AREA' && isLoading.status}
										placeholder="Ch???n trung t??m"
										isRequired={true}
									/>
									<InputTextField
										form={form}
										name="ChineseName"
										label="T??n ti???ng Trung"
										placeholder="Nh???p t??n ti???ng Trung"
									/>
									<InputPreventText
										form={form}
										name="Mobile"
										label="S??? ??i???n tho???i"
										placeholder="Nh???p s??? ??i???n tho???i"
										isRequired={true}
									/>
									<InputTextField form={form} name="LinkFaceBook" label="Link Facebook" placeholder="Nh???p link faebook" />
								</div>
								<div className="col-12">
									<InputTextField form={form} name="Address" label="?????a ch???" placeholder="Nh???p ?????a ch???" />
								</div>
								<div className="col-md-6 col-12">
									<Form.Item label="H???p ?????ng">
										<UploadFile getFile={(file) => getFile(file, 'contract')} />
										{updateObj?.ContractOfStaff && (
											<a href={updateObj?.ContractOfStaff} className="link-upload">
												File h???p ?????ng
											</a>
										)}
									</Form.Item>
								</div>
								<div className="col-md-6 col-12">
									<Form.Item label="B???ng c???p">
										<UploadFile url={updateObj?.DegreeOfStaff} getFile={(file) => getFile(file, 'degree')} />
										{updateObj?.ContractOfStaff && (
											<a href={updateObj?.ContractOfStaff} className="link-upload">
												File h???p ?????ng
											</a>
										)}
									</Form.Item>
								</div>
								{/** ==== Th??ng tin ng??n h??ng  ====*/}
								<div className="col-12">
									<Divider orientation="center">Th??ng tin ng??n h??ng</Divider>
								</div>
								<div className="col-md-6 col-12">
									<InputTextField form={form} name="BankAccountHolderName" label="T??n ch??? th???" />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField form={form} name="BankAccountNumber" label="S??? t??i kho???n" />
								</div>
								<div className="col-md-12 col-12">
									<InputTextField form={form} name="BankBranch" label="Chi nh??nh ng??n h??ng" />
								</div>
								<div className="col-12 mt-3">
									<button
										type="submit"
										className="btn btn-primary w-100"
										disabled={isLoading.type === 'ADD_DATA' && isLoading.status}
									>
										Th??m m???i
										{isLoading.type === 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
									</button>
								</div>
							</div>
						)}
					</Form>
				</div>
			</Modal>
		</>
	);
};

TeacherForm.propTypes = {
	handleCreateTeacher: PropTypes.func,
	isUpdate: PropTypes.bool,
	handleUpdateTeacher: PropTypes.func,
	updateObj: PropTypes.shape({}),
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	//
	isClearForm: PropTypes.bool,
	indexUpdateObj: PropTypes.number,
	//
	optionStatusList: optionCommonPropTypes,
	optionGenderList: optionCommonPropTypes,
	optionAreaSystemList: PropTypes.shape({
		areaList: optionCommonPropTypes,
		districtList: optionCommonPropTypes,
		wardList: optionCommonPropTypes
	}),
	handleFetchDistrict: PropTypes.func,
	handleFetchWard: PropTypes.func,
	optionBranchList: optionCommonPropTypes,
	handleFetchBranch: PropTypes.func
};
TeacherForm.defaultProps = {
	handleCreateTeacher: null,
	isUpdate: false,
	handleUpdateTeacher: null,
	updateObj: {},
	isLoading: { type: '', status: false },
	isClearForm: false,
	indexUpdateObj: -1,
	optionStatusList: [],
	optionGenderList: [],
	optionAreaSystemList: {
		areaList: [],
		districtList: [],
		wardList: []
	},
	handleFetchDistrict: null,
	handleFetchWard: null,
	optionBranchList: [],
	handleFetchBranch: null
};
export default TeacherForm;
