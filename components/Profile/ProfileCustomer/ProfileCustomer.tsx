import { AimOutlined, DeploymentUnitOutlined, MailOutlined, UserOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { Avatar, Card, Tabs, Divider, Skeleton, Button, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useWrap } from '~/context/wrap';
import InfoCourseCard from './InfoCourseCard/InfoCourseCard';
import InfoOtherCard from './InfoOtherCard/InfoOtherCard';
import InfoPaymentCard from './InfoPaymentCard/InfoPaymentCard';
import InfoTestCard from './InfoTestCard/InfoTestCard';
import InfoTimelineCard from './InfoTimelineCard/InfoTimelineCard';
import moment from 'moment';
import StudentForm from '~/components/Global/Customer/Student/StudentForm';
import { areaApi, branchApi, jobApi, parentsApi, puroseApi, sourceInfomationApi, staffApi, studentApi } from '~/apiBase';
import InfoDiscountCard from './InfoDiscountCard/InfoDiscountCard';
import InfoStudyCard from './InfoStudyCard/InfoStudyCard';

// -- FOR DIFFERENT VIEW --
interface optionObj {
	title: string;
	value: number;
}

interface listDataForm {
	Area: Array<optionObj>;
	DistrictID: Array<optionObj>;
	WardID: Array<optionObj>;
	Job: Array<optionObj>;
	Branch: Array<optionObj>;
	Purposes: Array<optionObj>;
	SourceInformation: Array<optionObj>;
	Parent: Array<optionObj>;
	Counselors: Array<optionObj>;
}

const listApi = [
	{
		api: areaApi,
		text: 'Tỉnh/Tp',
		name: 'Area'
	},

	{
		api: jobApi,
		text: 'Công việc',
		name: 'Job'
	},
	{
		api: puroseApi,
		text: 'Mục đích học',
		name: 'Purposes'
	},
	{
		api: branchApi,
		text: 'Trung tâm',
		name: 'Branch'
	},
	{
		api: parentsApi,
		text: 'Phụ huynh',
		name: 'Parent'
	},
	{
		api: sourceInfomationApi,
		text: 'Nguồn khách hàng',
		name: 'SourceInformation'
	},
	{
		api: staffApi,
		text: 'Tư vấn viên',
		name: 'Counselors'
	}
];

function ProfileCustomer(props) {
	const { id: studentID } = props;
	const studentIDInt = parseInt(studentID);
	const { showNoti } = useWrap();
	const { TabPane } = Tabs;
	const [info, setInfo] = useState<IStudent>(null);
	const [loading, setLoading] = useState(false);
	const [listDataForm, setListDataForm] = useState<listDataForm>({
		Area: [],
		DistrictID: [],
		WardID: [],
		Job: [],
		Branch: [],
		Purposes: [],
		SourceInformation: [],
		Parent: [],
		Counselors: []
	});
	const [isSubmit, setIsSubmit] = useState(false);
	const [loadingForm, setLoadingForm] = useState(false);
	const [activeKey, setActiveKey] = useState(1);

	// FOR STUDENT FORM
	// ------------- ADD data to list --------------

	const makeNewData = (data, name) => {
		let newData = null;
		switch (name) {
			case 'Area':
				newData = data.map((item) => ({
					title: item.AreaName,
					value: item.AreaID
				}));
				break;
			case 'DistrictID':
				newData = data.map((item) => ({
					title: item.DistrictName,
					value: item.ID
				}));
				break;
			case 'WardID':
				newData = data.map((item) => ({
					title: item.WardName,
					value: item.ID
				}));
				break;
			case 'Branch':
				newData = data.map((item) => ({
					title: item.BranchName,
					value: item.ID
				}));

				break;
			case 'Job':
				newData = data.map((item) => ({
					title: item.JobName,
					value: item.JobID
				}));
				break;
			case 'Purposes':
				newData = data.map((item) => ({
					title: item.PurposesName,
					value: item.PurposesID
				}));
				break;
			case 'Parent':
				newData = data.map((item) => ({
					title: item.FullNameUnicode,
					value: item.UserInformationID
				}));
				break;
			case 'SourceInformation':
				newData = data.map((item) => ({
					title: item.SourceInformationName,
					value: item.SourceInformationID
				}));

				break;
			case 'Counselors':
				newData = data.map((item) => ({
					title: item.FullNameUnicode,
					value: item.UserInformationID
				}));
				break;
			default:
				break;
		}

		return newData;
	};

	const getDataTolist = (data: any, name: any) => {
		let newData = makeNewData(data, name);

		Object.keys(listDataForm).forEach(function (key) {
			if (key == name) {
				listDataForm[key] = newData;
			}
		});
		setListDataForm({ ...listDataForm });
	};

	const checkEmptyData = () => {
		let count = 0;
		let res = false;
		Object.keys(listDataForm).forEach(function (key) {
			if (listDataForm[key].length == 0) {
				count++;
			}
		});
		if (count < 3) {
			res = true;
		}
		return res;
	};

	const getDataStudentForm = (arrApi) => {
		arrApi.forEach((item, index) => {
			(async () => {
				let res = null;
				try {
					if (item.name == 'Counselors') {
						res = await item.api.getAll({
							pageIndex: 1,
							pageSize: 99999,
							RoleID: 6,
							StatusID: 0,
							Enable: true
						});
					} else {
						res = await item.api.getAll({
							pageIndex: 1,
							pageSize: 99999,
							Enable: true
						});
					}

					res.status == 200 && getDataTolist(res.data.data, item.name);

					res.status == 204 && console.log(item.text + ' Không có dữ liệu');
				} catch (error) {
					console.log(error.message);
				} finally {
				}
			})();
		});
	};

	const getInfoCustomer = async () => {
		setLoading(true);
		try {
			const res = await studentApi.getWithID(studentIDInt);
			res.status === 200 && setInfo(res.data.data);
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoading(false);
		}
	};

	const updateFormInfo = () => {
		setIsSubmit(true);
		setLoadingForm(true);
	};

	const onChange_tabs = (activeKey) => {
		console.log('active Key: ', activeKey);
		setActiveKey(activeKey);
	};

	useEffect(() => {
		getInfoCustomer();
		getDataStudentForm(listApi);
	}, []);

	return (
		<div className="page-no-scroll">
			<div className="row">
				<div className="col-md-3 col-12">
					<Card className="info-profile-left">
						{loading ? (
							<Skeleton />
						) : (
							<>
								<div className="row">
									<div className="col-12 d-flex align-items-center justify-content-center">
										<Avatar size={100} src={<img src={info?.Avatar ? info.Avatar : '/images/user.png'} />} />
									</div>
								</div>
								<div className="row pt-5">
									<div className="col-2">
										<UserOutlined />
									</div>
									<div className="col-10  d-flex ">{info?.FullNameUnicode}</div>
								</div>
								<div className="row pt-4">
									<div className="col-2">
										<DeploymentUnitOutlined />
									</div>
									<div className="col-10  d-flex ">{info?.JobName}</div>
								</div>
								<div className="row pt-4">
									<div className="col-2">
										<WhatsAppOutlined />
									</div>
									<div className="col-10  d-flex ">{info?.Mobile}</div>
								</div>
								<div className="row pt-4">
									<div className="col-2">
										<MailOutlined />
									</div>
									<div className="col-10  d-flex ">{info?.Email}</div>
								</div>
								<div className="row pt-4">
									<div className="col-2">
										<AimOutlined />
									</div>
									<div className="col-10  d-flex ">{info?.Branch.map((b) => b.BranchName).join(', ')}</div>
								</div>
								<div className="row mt-3">
									<div className="col-12">
										<Divider>Thông tin khác</Divider>
										<ul className="info-dif-user">
											<li>
												<p className="title">Nhu cầu học</p>
												<p className="text">{info?.AcademicPurposesName}</p>
											</li>
											<li>
												<p className="title">Người tư vấn</p>
												<p className="text">{info?.CounselorsName}</p>
											</li>
											<li>
												<p className="title">Ngày tạo tài khoản</p>
												<p className="text">{moment(info?.CreatedOn).format('DD/MM/YYYY')}</p>
											</li>
											<li>
												<p className="title">Được tạo bởi</p>
												<p className="text">{info?.CreatedBy}</p>
											</li>
										</ul>
									</div>
								</div>
							</>
						)}
					</Card>
				</div>
				<div className="col-md-9 col-12">
					<Card
						className="space-top-card"
						actions={[
							activeKey == 1 && (
								<button className="btn btn-primary" onClick={() => updateFormInfo()}>
									Lưu {loadingForm && <Spin className="loading-base" />}
								</button>
							)
						]}
					>
						<Tabs type="card" onChange={onChange_tabs}>
							<TabPane tab="Chi tiết" key="1" className="profile-tabs">
								{loading ? (
									<Skeleton />
								) : (
									<StudentForm
										isHideButton={true}
										isSubmitOutSide={isSubmit}
										dataRow={info}
										listDataForm={checkEmptyData && listDataForm}
										isSuccess={() => (setLoadingForm(false), setIsSubmit(false))}
									/>
								)}
							</TabPane>
							<TabPane tab="Lộ trình" key="9" className="profile-tabs">
								<InfoStudyCard studentID={studentIDInt} />
							</TabPane>
							<TabPane tab="Kiểm tra đầu vào" key="2" className="profile-tabs">
								<InfoTestCard studentID={studentIDInt} />
							</TabPane>
							<TabPane tab="Khóa học" key="3" className="profile-tabs">
								<InfoCourseCard studentID={studentIDInt} />
							</TabPane>
							<TabPane tab="Thanh toán" key="4" className="profile-tabs">
								<InfoPaymentCard studentID={studentIDInt} />
							</TabPane>
							<TabPane tab="Lịch sử tài khoản" key="5" className="profile-tabs">
								<InfoTimelineCard studentID={studentIDInt} />
							</TabPane>
							<TabPane tab="Kết quả kiểm tra" key="6" className="profile-tabs">
								{/* <InfoTestResultCard studentID={studentIDInt} /> */}
							</TabPane>
							<TabPane tab="Mã khuyến mãi" key="7" className="profile-tabs">
								<InfoDiscountCard studentID={studentIDInt} />
							</TabPane>
							<TabPane tab="Khác" key="8" className="profile-tabs">
								<InfoOtherCard studentID={studentIDInt} />
							</TabPane>
						</Tabs>
					</Card>
				</div>
			</div>
		</div>
	);
}

export default ProfileCustomer;
