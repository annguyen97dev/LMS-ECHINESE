import { DeploymentUnitOutlined, MailOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Divider, Form, Modal, Spin, Tooltip } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { RotateCcw } from 'react-feather';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import DateField from '~/components/FormControl/DateField';
import InputPassField from '~/components/FormControl/InputPassField';
import InputTextField from '~/components/FormControl/InputTextField';
import SelectField from '~/components/FormControl/SelectField';
import UploadAvatarField from '~/components/FormControl/UploadAvatarField';
import { useWrap } from '~/context/wrap';
import { optionCommonPropTypes } from '~/utils/proptypes';

SalerListForm.propTypes = {
	isUpdate: PropTypes.bool,
	updateObj: PropTypes.shape({}),
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
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
	handleFetchBranch: PropTypes.func,
	//
	handleSubmit: PropTypes.func
};
SalerListForm.defaultProps = {
	isUpdate: false,
	updateObj: {},
	isLoading: { type: '', status: false },
	//
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
	handleFetchBranch: null,
	//
	handleSubmit: null
};

function SalerListForm(props) {
	const {
		isUpdate,
		updateObj,
		isLoading,
		//
		optionStatusList,
		optionGenderList,
		optionAreaSystemList,
		handleFetchDistrict,
		handleFetchWard,
		optionBranchList,
		handleFetchBranch,
		//
		handleSubmit
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

	const schema = yup.object().shape({
		Branch: yup.array().min(1, 'B???n ph???i ch???n ??t nh???t 1 trung t??m').required('B???n kh??ng ???????c ????? tr???ng'),
		FullNameUnicode: yup.string().required('B???n kh??ng ???????c ????? tr???ng'),
		Jobdate: yup.string().required('B???n kh??ng ???????c ????? tr???ng'),
		Email: yup.string().email('Email kh??ng ????ng ?????nh d???ng').required('B???n kh??ng ???????c ????? tr???ng'),
		Mobile: yup
			.string()
			.required('B???n kh??ng ???????c ????? tr???ng')
			.matches(
				/^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/,
				'Sdt kh??ng ????ng ?????nh d???ng'
			),
		Address: yup.string(),
		AreaID: yup.number().nullable().required('B???n kh??ng ???????c ????? tr???ng'),
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
		Password: yup.string().nullable()
	});

	const defaultValuesInit = {
		Branch: undefined,
		FullNameUnicode: '',
		Jobdate: moment().format('YYYY/MM/DD'),
		Email: '',
		Mobile: '',
		Address: '',
		AreaID: null,
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
		StatusID: 0,
		Password: '',
		UserName: null
	};

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	useEffect(() => {
		if (isUpdate && updateObj) {
			form.reset({
				...updateObj,
				Branch: updateObj.Branch.map((obj) => obj.ID)
			});
		}
	}, [updateObj]);

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
		if (!handleSubmit) return;
		handleSubmit(data).then((res) => {
			if (res) {
				closeModal();
				if (!isUpdate) {
					form.reset({ ...defaultValuesInit });
				}
			}
		});
	};

	useEffect(() => {}, []);

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
				style={{ top: 20 }}
				title={isUpdate ? 'C???p nh???t t?? v???n vi??n' : 'Th??m t?? v???n vi??n'}
				visible={isModalVisible}
				onCancel={closeModal}
				footer={
					<div className="row">
						<div className="col-12 d-flex justify-content-center">
							<button
								type="submit"
								className="btn btn-primary w-100"
								onClick={form.handleSubmit(teacherSwitchFunc)}
								disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
							>
								{isUpdate ? 'C???p nh???t' : 'Th??m m???i'}
								{isLoading.type === 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
							</button>
						</div>
					</div>
				}
				className="modal-50 modal-scroll"
			>
				<div className="box-form">
					<Form layout="vertical" onFinish={form.handleSubmit(teacherSwitchFunc)}>
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
							{isUpdate && (
								<div className="col-12">
									<InputTextField form={form} name="UserName" label="T??n ????ng nh???p" disabled={true} />
								</div>
							)}
							<div className="col-md-6 col-12">
								<InputTextField form={form} name="Email" label="Email" placeholder="Nh???p email" />
							</div>
							<div className="col-md-6 col-12">
								<InputTextField form={form} name="FullNameUnicode" label="H??? v?? t??n" placeholder="Nh???p h??? v?? t??n" />
							</div>
							<div className="col-md-6 col-12">
								<InputTextField form={form} name="Mobile" label="S??? ??i???n tho???i" placeholder="Nh???p s??? ??i???n tho???i" />
							</div>
							<div className="col-md-6 col-12">
								<DateField form={form} name="DOB" label="Ng??y sinh" placeholder="Ch???n ng??y sinh" />
							</div>
							<div className="col-md-6 col-12">
								<InputTextField form={form} name="CMND" label="S??? CMND" placeholder="Nh???p s??? CMND" />
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
									name="StatusID"
									label="Tr???ng th??i ho???t ?????ng"
									optionList={optionStatusList}
									placeholder="Ch???n tr???ng th??i ho???t ?????ng"
									disabled={!isUpdate ? true : userInformation.RoleID === 1 ? false : true}
								/>
							</div>
							<div className="col-md-6 col-12">
								<InputPassField form={form} name="M???t kh???u" label="M???t kh???u" placeholder="Nh???p m???t kh???u" />
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

							<div className="col-12">
								<InputTextField form={form} name="Address" label="?????a ch???" placeholder="Nh???p ?????a ch???" />
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
}

export default SalerListForm;
