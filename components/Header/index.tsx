import React, { useEffect, useState } from 'react';
import { Popover, Button, Input, Select, Drawer } from 'antd';
import { Grid } from 'react-feather';
import { useWrap } from '~/context/wrap';
import { signIn, signOut, useSession } from 'next-auth/client';

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

const { Search } = Input;

const { Option } = Select;

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

	function onChange(value) {
		console.log(`selected ${value}`);
	}

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
					{/* <div className="col-search">
            <div className="box-input">
              <SearchOutlined className="icon-search" />
              <input type="text" placeholder="Search in app..." />
            </div>
          </div> */}
					<div className="col-title-page">
						<TitlePageHeader title={titlePage} />
					</div>
				</div>
				<div className="col-setting">
					<ul className="col-setting-list">
						{/* <li className="notification">
              <span className="notification-icon">
                <i className="fal fa-bell" />
              </span>
              <span className="notification-number">5</span>
            </li> */}
						{/* <li className="select-center">
              <Select
                className="style-input"
                showSearch
                style={{ width: 200 }}
                placeholder="Chọn trung tâm"
                optionFilterProp="children"
                onChange={onChange}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                <Option value="center-1">Trung tâm Anh Ngữ Zim</Option>
                <Option value="center-2">Trung tâm Việt Hoa</Option>
                <Option value="center-3">Mona Media</Option>
              </Select>
            </li> */}
						{/* <li className="search">
              <Popover content={content_search} trigger="click">
                <a className="search-icon">
                  <SearchOutlined />
                </a>
              </Popover>
            </li> */}
						{userInformation?.RoleID !== undefined &&
							userInformation.RoleID !== 1 &&
							userInformation.RoleID !== 2 &&
							userInformation.RoleID !== 5 &&
							userInformation.RoleID !== 6 && (
								<li className="notification" style={{ marginRight: -15 }}>
									<Cart />
								</li>
							)}
						<li className="notification">
							<Notifiaction />
						</li>
						<li className="user">
							<Popover
								content={!session ? contentLogin : contentLogout}
								// visible={userFunc}
								// onVisibleChange={openUserFunc}
								trigger="click"
								title=""
							>
								<div className="user-wrap">
									{/* <div className="user-img">
                    <img src="/images/user.jpg" alt="" />
                  </div> */}
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
										{/* <p className="user-position">Teacher</p> */}
									</div>
								</div>
							</Popover>
						</li>
						<li className="custom-wrap">
							<div className="custom" onClick={showDrawer}>
								{/* <SettingOutlined /> */}
								<Grid />
							</div>
							<Drawer title="Chỉnh sửa" placement="right" onClose={onClose} visible={openMenuCustom}>
								<p className="text-center font-weight-bold">Chức năng này đang được cập nhật...</p>
							</Drawer>
						</li>
					</ul>
				</div>
			</div>
		</header>
	);
}
