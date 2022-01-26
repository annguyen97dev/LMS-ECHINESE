import { Form, Input, Spin, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { signIn, getProviders } from 'next-auth/client';
import { devApi } from './../../apiBase/dev/dev';

export default function BelongingToDev(props) {
	const [isAccess, setIsAccess] = useState(false);
	const [level, setLevel] = useState([]);
	const [grandMenu, setGrandMenu] = useState([]);
	const [parentMenu, setParentMenu] = useState([]);
	const [childMenu, setChildMenu] = useState([]);
	const [form] = Form.useForm();
	const [isLoading, setIsLoading] = useState({ type: '', status: false });
	const { Option } = Select;
	const useAllRoles = [
		{ ID: 1, name: 'Admin' },
		{ ID: 2, name: 'Giáo viên' },
		{ ID: 3, name: 'Học viên' },
		{ ID: 4, name: 'Phụ huynh' },
		{ ID: 5, name: 'Quản lý' },
		{ ID: 6, name: 'Tư vấn viên' },
		{ ID: 10, name: 'Nhân viên' }
	];

	const handleAccess = async (data) => {
		setIsLoading({ type: 'ACCESS', status: true });
		try {
			let res = await devApi.checkPass(data);
			if (res.status === 200) {
				setIsAccess(true);
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'ACCESS', status: true });
		}
	};

	const renderInputPassScreen = () => {
		return (
			<div className="dev__screen d-flex justify-content-center align-items-center">
				<Form form={form} onFinish={handleAccess}>
					<div className="dev__screen-content row">
						<div className="col-12 d-flex justify-content-center align-items-end">
							<Form.Item name="pass">
								<Input placeholder="show me your power" style={{ width: 300 }} className="style-input" />
							</Form.Item>
						</div>
						<div className="col-12 d-flex justify-content-center align-items-center">
							<button className="btn btn-primary" disabled={isLoading.status} type="submit" style={{ width: 200 }}>
								{isLoading.type === 'ACCESS' && isLoading.status ? <Spin /> : 'Access Me'}
							</button>
						</div>
					</div>
				</Form>
			</div>
		);
	};

	const handleRedirect = async (data) => {
		setIsLoading({ type: 'REDIRECT', status: true });
		try {
			let res = await devApi.loginByDev(data);
			if (res.status === 200) {
				console.log(res.data);
				console.log(res.headers);
				setIsAccess(true);
				signIn('credentials-dev-signin', {
					...data,
					callbackUrl: '/'
				});
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'REDIRECT', status: true });
		}
	};

	const handleSelect = async (event) => {
		console.log(event);
		setIsLoading({ type: 'SELECT_ROLE', status: true });
		try {
			let res = await devApi.getAllMenuByRole({ roleId: 1 });
		} catch (error) {
		} finally {
			setIsLoading({ type: 'SELECT_ROLE', status: true });
		}
	};

	const renderMainScreen = () => {
		return (
			<Form form={form} onFinish={handleRedirect}>
				<div className="dev__main d-flex justify-content-center align-items-center p-5">
					<div className="dev__main-screen row">
						<div className="dev__main-redirect col-12 d-flex justify-content-between ">
							<div className="d-flex justify-content-center align-items-center" style={{ width: '80%' }}>
								<Form.Item
									name="roleId"
									className="d-flex justify-content-center align-items-center"
									style={{ width: '100%' }}
								>
									<Select className="style-input" onChange={handleSelect}>
										{useAllRoles &&
											useAllRoles.map((item, index) => {
												return (
													<Option value={item.ID} key={index}>
														{item.name}
													</Option>
												);
											})}
									</Select>
								</Form.Item>
							</div>
							<div className="d-flex justify-content-center align-items-center" style={{ width: '10%' }}>
								<button type="submit" className="btn btn-primary">
									GO
								</button>
							</div>
						</div>
						<div className="dev__main-menu col-12"></div>
					</div>
				</div>
			</Form>
		);
	};

	return <>{isAccess ? renderMainScreen() : renderInputPassScreen()}</>;
}
export async function getServerSideProps(context) {
	const providers = await getProviders();
	return {
		props: { providers }
	};
}
