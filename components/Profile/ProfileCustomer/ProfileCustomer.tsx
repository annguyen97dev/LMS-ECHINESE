import {
	AimOutlined,
	DeploymentUnitOutlined,
	MailOutlined,
	UserOutlined,
	WhatsAppOutlined,
} from '@ant-design/icons';
import {Avatar, Card, Tabs} from 'antd';
import React, {useEffect, useState} from 'react';
import {studentApi} from '~/apiBase';
import {useWrap} from '~/context/wrap';
import InfoChangeCard from './component/InfoChangeCard';
import InfoCourseCard from './InfoCourseCard/InfoCourseCard';
import InfoOtherCard from './component/InfoOtherCard';
import InfoPaymentCard from './InfoPaymentCard/InfoPaymentCard';
import InfoTestCard from './InfoTestCard/InfoTestCard';
import InfoTestResultCard from './InfoTestResultCard/InfoTestResultCard';

function ProfileCustomer(props) {
	const {id: studentID} = props;
	const studentIDInt = parseInt(studentID);
	const {showNoti} = useWrap();
	const {TabPane} = Tabs;
	const [info, setInfo] = useState<IStudent>(null);

	const getInfoCustomer = async () => {
		try {
			const res = await studentApi.getWithID(studentIDInt);
			res.status === 200 && setInfo(res.data.data);
		} catch (error) {
			showNoti('danger', error.message);
		}
	};

	useEffect(() => {
		getInfoCustomer();
	}, []);

	return (
		<div className="page-no-scroll">
			<div className="row">
				<div className="col-md-3 col-12">
					<Card className="info-profile-left">
						<div className="row">
							<div className="col-12 d-flex align-items-center justify-content-center">
								<Avatar size={120} src={<img src={info?.Avatar} />} />
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
							<div className="col-10  d-flex ">
								{info?.Branch.map((b) => b.BranchName).join(', ')}
							</div>
						</div>
					</Card>
				</div>
				<div className="col-md-9 col-12">
					<Card className="space-top-card">
						<Tabs type="card">
							<TabPane tab="Kiểm tra đầu vào" key="2" className="profile-tabs">
								<InfoTestCard studentID={studentIDInt} />
							</TabPane>
							<TabPane tab="Khóa học" key="3" className="profile-tabs">
								<InfoCourseCard studentID={studentIDInt} />
							</TabPane>
							<TabPane tab="Thanh toán" key="4" className="profile-tabs">
								<InfoPaymentCard studentID={studentIDInt} />
							</TabPane>
							<TabPane
								tab="Lịch sử tài khoản học viên"
								key="5"
								className="profile-tabs"
							>
								<InfoChangeCard studentID={studentIDInt} />
							</TabPane>
							<TabPane tab="Kết quả kiểm tra" key="6" className="profile-tabs">
								<InfoTestResultCard studentID={studentIDInt} />
							</TabPane>
							<TabPane tab="Other" key="7" className="profile-tabs">
								<InfoOtherCard />
							</TabPane>
						</Tabs>
					</Card>
				</div>
			</div>
			<div></div>
		</div>
	);
}

export default ProfileCustomer;
