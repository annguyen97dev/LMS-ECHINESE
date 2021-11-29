import React from 'react';
import { UserOutlined, DeploymentUnitOutlined, WhatsAppOutlined, MailOutlined, AimOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import Link from 'next/link';

const ProfileSummary = (props) => {
	const { dataForm, isFix } = props;
	return (
		<>
			<div className="row mb-3">
				<div className="col-12 d-flex align-items-center justify-content-center flex-wrap">
					<Avatar
						size={64}
						src={
							<img src={dataForm?.Avatar ? dataForm.Avatar : '/images/user.png'} />
							// <img src={"/images/user.png"} />
						}
					/>
				</div>
			</div>
			<div className="row pt-3">
				<div className="col-2 line-height-0">
					<UserOutlined />
				</div>
				<div className="col-10  d-flex ">{dataForm?.FullNameUnicode ? dataForm?.FullNameUnicode : '...'}</div>
			</div>
			<div className="row pt-4">
				<div className="col-2 line-height-0">
					<DeploymentUnitOutlined />
				</div>
				<div className="col-10  d-flex ">{dataForm?.RoleName ? dataForm?.RoleName : '...'}</div>
			</div>
			<div className="row pt-4">
				<div className="col-2 line-height-0">
					<WhatsAppOutlined />
				</div>
				<div className="col-10  d-flex ">{dataForm?.Mobile ? dataForm?.Mobile : '...'}</div>
			</div>
			<div className="row pt-4">
				<div className="col-2 line-height-0">
					<MailOutlined />
				</div>
				<div className="col-10  d-flex ">{dataForm?.Email ? dataForm?.Email : '...'}</div>
			</div>
			<div className="row pt-4">
				<div className="col-2 line-height-0">
					<AimOutlined />
				</div>
				<div className="col-10  d-flex ">{dataForm?.Address ? dataForm?.Address : '...'}</div>
			</div>
			<div className="text-center w-100">
				{isFix && (
					<Link
						href={{
							pathname: '/profile'
						}}
					>
						<button className="btn btn-primary mt-3">Chỉnh sửa</button>
					</Link>
				)}
			</div>
		</>
	);
};

export default ProfileSummary;
