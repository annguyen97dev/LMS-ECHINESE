import React, { useEffect, useState } from 'react';
import { Popover, Button, Input, Select, Drawer } from 'antd';
import { Grid } from 'react-feather';
import { useWrap } from '~/context/wrap';
import { signIn, signOut, useSession } from 'next-auth/client';
import _ from '~/appConfig';

import Link from 'next/link';

import {
	SettingOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UserOutlined,
	MailOutlined,
	LogoutOutlined,
	SearchOutlined,
	LoginOutlined,
	FormOutlined,
	RedoOutlined
} from '@ant-design/icons';
import { User } from 'react-feather';
import TitlePage from '../Elements/TitlePage';
import TitlePageHeader from '../Elements/TitlePageHeader';
import Notifiaction from './notification';
import Cart from './cart';
import { GoogleLogout, GoogleLoginProps } from 'react-google-login';

let countOpen = 0;
export default function Header({
	isOpenMenu,
	isOpen,
	funcMenuMobile,
	openMenuMobile
}: {
	isOpen: boolean;
	isOpenMenu: Function;
	funcMenuMobile: Function;
	openMenuMobile: boolean;
}) {
	const [isSearch, setIsSearch] = useState(false);
	const { titlePage, userInformation } = useWrap();
	const [session, loading] = useSession();
	const [dataUser, setDataUser] = useState<IUser>();
	const [openMenuCustom, setOpenMenuCustom] = useState(false);
	const showDrawer = () => {
		setOpenMenuCustom(true);
	};
	const onClose = () => {
		setOpenMenuCustom(false);
	};

	const content_search = (
		<div className="input-search">
			<Input className="style-input" placeholder="search" />
			<SearchOutlined />
		</div>
	);

	const moveToLogin = () => {
		signIn();
	};

	const contentLogout = (
		<ul className="user-function">
			<li>
				<Link href="/profile">
					<a href="">
						<span className="icon">
							<UserOutlined />
						</span>
						<span className="function-name">Trang cá nhân</span>
					</a>
				</Link>
			</li>
			<li>
				<Link href="/change-password">
					<a href="#">
						<span className="icon inbox">
							<RedoOutlined />
						</span>
						<span className="function-name">Đổi mật khẩu</span>
					</a>
				</Link>
			</li>
			<li>
				<a href="#" onClick={() => (signOut(), localStorage.removeItem('dataUserEchinese'))}>
					<span className="icon logout">
						<LogoutOutlined />
					</span>
					<span className="function-name">Log out</span>
				</a>
			</li>
			{/* <li>
				<div className="wrap-google-logout">
					<GoogleLogout clientId={_.googleCredentials} icon={false} onLogoutSuccess={signOut}>
						<a href="#" onClick={() => (signOut(), localStorage.removeItem('dataUserEchinese'))}>
							<span className="icon logout">
								<LogoutOutlined />
							</span>
							<span className="function-name">Log out</span>
						</a>
					</GoogleLogout>
				</div>
			</li> */}
		</ul>
	);

	const contentLogin = (
		<ul className="user-function">
			<li>
				<a href="#" onClick={moveToLogin}>
					<span className="icon">
						<LoginOutlined />
					</span>
					<span className="function-name">Đăng nhập</span>
				</a>
			</li>
			<li>
				<a href="#">
					<span className="icon inbox">
						<FormOutlined />
					</span>
					<span className="function-name">Đăng kí</span>
				</a>
			</li>
		</ul>
	);

	const openSearch = () => {
		!isSearch ? setIsSearch(true) : setIsSearch(false);
	};

	let visibleUser: {
		visible: Boolean;
	};

	visibleUser = {
		visible: false
	};

	const [userFunc, userFuncSet] = useState(false);

	const closeUserFunc = () => {
		userFuncSet(false);
	};

	const openUserFunc = () => {
		userFuncSet(true);
	};

	if (!isOpen) {
		countOpen++;
	}

	function parseJwt(token) {
		var base64Url = token.split('.')[1];
		var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		var jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join('')
		);

		return JSON.parse(jsonPayload);
	}

	useEffect(() => {
		if (session !== undefined) {
			let token = session.accessToken;
			if (userInformation) {
				setDataUser(userInformation);
			} else {
				setDataUser(parseJwt(token));
			}
		}
	}, [userInformation]);

	return (
		<header className={`app-header ${openMenuMobile ? 'mobile' : ''}`}>
			<div className={`app-header-logo ${!isOpen ? 'close-app' : countOpen > 0 ? 'open' : 'open-no-ani'}`}>
				<Link href="/">
					{/* <a style={{ display: !isOpen ? "none" : "block" }}>Mona Media</a> */}
					<a href="#">
						{' '}
						<img className="logo-img" src="/images/logo-final.jpg"></img>
					</a>
				</Link>

				<p style={{ display: !isOpen ? 'block' : 'none' }}>E</p>
			</div>
			<div className={`app-header-inner ${!isOpen && 'close-app'}`}>
				<div className="right">
					<div className="col-button" onClick={() => isOpenMenu()}>
						<div className="box-menu">
							<div className="icon-action">{!isOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</div>
						</div>
					</div>

					<div className="col-button mobile" onClick={() => funcMenuMobile()}>
						<div className="box-menu">
							<div className="icon-action">{!openMenuMobile ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</div>
						</div>
					</div>
					<div className="col-title-page">
						<TitlePageHeader title={titlePage} />
					</div>
				</div>
				<div className="col-setting">
					<ul className="col-setting-list">
						{userInformation?.RoleID !== undefined &&
							userInformation?.RoleID !== 1 &&
							userInformation?.RoleID !== 2 &&
							userInformation?.RoleID !== 4 &&
							userInformation?.RoleID !== 5 &&
							userInformation?.RoleID !== 6 &&
							userInformation?.RoleID !== 10 && (
								<li className="notification" style={{ marginRight: -15 }}>
									<Cart />
								</li>
							)}
						<li className="notification">
							<Notifiaction />
						</li>
						<li className="user" style={{ paddingRight: 20 }}>
							<Popover content={!session ? contentLogin : contentLogout} trigger="click" title="">
								<div className="user-wrap">
									<div className="user-info">
										{session?.user ? (
											<div className="user-name-desktop">
												<div className="user-img">
													<img
														src={
															dataUser?.Avatar && dataUser?.Avatar !== ''
																? dataUser.Avatar
																: '/images/user.png'
														}
														alt=""
													/>
												</div>
												<div className="user-info">
													<p className="user-name">{dataUser?.FullNameUnicode}</p>
													<p className="user-position">{dataUser?.RoleName}</p>
												</div>
											</div>
										) : (
											<p>Tài khoản</p>
										)}

										<div className="user-name-mobile">
											<User />
										</div>
									</div>
								</div>
							</Popover>
						</li>
					</ul>
				</div>
			</div>
		</header>
	);
}
