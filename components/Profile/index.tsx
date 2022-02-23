import React, { useState, useEffect } from 'react';
import { Form, Card, Divider, Spin, Skeleton, Tabs } from 'antd';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputTextField from '~/components/FormControl/InputTextField';
import DateField from '~/components/FormControl/DateField';
import SelectField from '~/components/FormControl/SelectField';
import { useWrap } from '~/context/wrap';
import AvatarBase from '~/components/Elements/AvatarBase';
import { userApi } from '~/apiBase';
import TitlePage from '../Elements/TitlePage';
import ProfileSummary from '../ProfileSummary.tsx/ProfileSummary';
import InfoStudyCard from './ProfileCustomer/InfoStudyCard/InfoStudyCard';
import InfoPaymentCard from './ProfileCustomer/InfoPaymentCard/InfoPaymentCard';
import InfoDiscountCard from './ProfileCustomer/InfoDiscountCard/InfoDiscountCard';
import InfoCourseCard from './ProfileCustomer/InfoCourseCard/InfoCourseCard';
import InfoTestCard from './ProfileCustomer/InfoTestCard/InfoTestCard';
import InfoTestResultCard from './ProfileCustomer/component/InfoTestResultCard';
import InfoTimelineCard from './ProfileCustomer/InfoTimelineCard/InfoTimelineCard';

let returnSchema = {};
const { TabPane } = Tabs;
let schema = null;

const optionGender = [
	{
		value: 0,
		title: 'Nữ'
	},
	{
		value: 1,
		title: 'Nam'
	},
	{
		value: 2,
		title: 'Khác'
	}
];

const ProfileBase = (props) => {
	const { showNoti, getDataUser, userInformation } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [imageUrl, setImageUrl] = useState(null);
	const { dataUser } = props;
	const [dataForm, setDataForm] = useState<IUser>(null);
	const [loading, setLoading] = useState(true);

	const defaultValuesInit = {
		FullNameUnicode: null,
		DOB: null,
		Email: '',
		Gender: null,
		Address: null,
		Mobile: null,
		Avatar: null
	};

	(function returnSchemaFunc() {
		returnSchema = { ...defaultValuesInit };
		Object.keys(returnSchema).forEach(function (key) {
			switch (key) {
				case 'Email':
					returnSchema[key] = yup.string().email('Email nhập sai cú pháp');
					break;
				case 'Mobile':
					returnSchema[key] = yup.number().typeError('SDT phải là số');
					break;
				default:
					break;
			}
		});
		schema = yup.object().shape(returnSchema);
	})();

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	// ----------- SUBMI FORM ------------
	const onSubmit = async (data: any) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		let res = null;
		try {
			res = await userApi.update(data);
			res?.status == 200 &&
				(showNoti('success', 'Cập nhật thành công'), form.reset(data), setDataForm(res.data.data), getDataUser(res.data.data));
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
	};

	const onChange_tabs = (activeKey) => {
		console.log('active Key: ', activeKey);
	};

	useEffect(() => {
		if (dataUser) {
			setTimeout(() => {
				setLoading(false);
			}, 500);
			dataUser.Gender = parseInt(dataUser.Gender);
			if (userInformation === null) {
				form.reset(dataUser);
				setDataForm(dataUser);
				setImageUrl(dataUser.Avatar);
			} else {
				setDataForm(userInformation);
				form.reset(userInformation);
				setImageUrl(userInformation.Avatar);
			}
		}
	}, [userInformation]);

	return (
		<>
			<TitlePage title="Profile" />
			<div className="row">
				<div className="col-md-3 col-12">
					<Card className="info-profile-left">
						{loading ? (
							<Skeleton />
						) : (
							<>
								<ProfileSummary dataForm={dataForm} />
							</>
						)}
					</Card>
				</div>

				{/** Form */}
				<div className="col-md-8 col-12">
					<Card className="space-top-card">
						{loading ? (
							<Skeleton />
						) : (
							<Form layout="vertical" onFinish={form.handleSubmit(onSubmit)}>
								<div className="row d-flex justify-content-center align-items-center">
									<h5>Tài khoản cá nhân</h5>
									<Divider />
								</div>

								<Tabs type="card" onChange={onChange_tabs}>
									<TabPane tab="Chi tiết" key="1" className="profile-tabs">
										{loading ? (
											<Skeleton />
										) : (
											<>
												<div className="row mb-3">
													<div className="col-12">
														<AvatarBase
															imageUrl={imageUrl}
															getValue={(value) => form.setValue('Avatar', value)}
														/>
													</div>
												</div>
												<div className="row">
													<div className="col-md-6 col-12">
														<InputTextField form={form} name="FullNameUnicode" label="Họ tên" />
													</div>
													<div className="col-md-6 col-12">
														<SelectField
															form={form}
															name="Gender"
															label="Giới tính"
															optionList={optionGender}
														/>
													</div>
												</div>

												<div className="row">
													<div className="col-md-6 col-12">
														<DateField form={form} name="DOB" label="Ngày sinh" />
													</div>
													<div className="col-md-6 col-12">
														<InputTextField form={form} name="Email" label="Email" />
													</div>
												</div>
												<div className="row">
													<div className="col-md-6 col-12">
														<InputTextField form={form} name="Mobile" label="Số điện thoại" />
													</div>
													<div className="col-md-6 col-12">
														<InputTextField form={form} name="Address" label="Địa chỉ" />
													</div>
												</div>
												<div className="row mt-3">
													<div className="col-12 d-flex justify-content-center">
														<button type="submit" className="btn btn-primary">
															Lưu
															{isLoading.type == 'ADD_DATA' && isLoading.status && (
																<Spin className="loading-base" />
															)}
														</button>
													</div>
												</div>
											</>
										)}
									</TabPane>
									{userInformation && userInformation.RoleID === 3 && (
										<>
											<TabPane tab="Kiểm tra đầu vào" key="2" className="profile-tabs">
												<InfoTestCard studentID={userInformation && userInformation.UserInformationID} />
											</TabPane>

											<TabPane tab="Lộ trình" key="9" className="profile-tabs">
												<InfoStudyCard studentID={userInformation && userInformation.UserInformationID} />
											</TabPane>

											<TabPane tab="Mã khuyến mãi" key="7" className="profile-tabs">
												<InfoDiscountCard studentID={userInformation && userInformation.UserInformationID} />
											</TabPane>

											<TabPane tab="Khóa học" key="3" className="profile-tabs">
												<InfoCourseCard studentID={userInformation && userInformation.UserInformationID} />
											</TabPane>

											<TabPane tab="Kết quả kiểm tra" key="6" className="profile-tabs">
												<InfoTestResultCard studentID={userInformation && userInformation.UserInformationID} />
											</TabPane>

											<TabPane tab="Thanh toán" key="4" className="profile-tabs">
												<InfoPaymentCard studentID={userInformation && userInformation.UserInformationID} />
											</TabPane>

											<TabPane tab="Lịch sử tài khoản" key="5" className="profile-tabs">
												<InfoTimelineCard studentID={userInformation && userInformation.UserInformationID} />
											</TabPane>
										</>
									)}
								</Tabs>
							</Form>
						)}
					</Card>
				</div>
			</div>

			<div></div>
		</>
	);
};

export default ProfileBase;
