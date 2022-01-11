import { Menu, Button } from 'antd';
import React, { useEffect, useState, useReducer, PureComponent, useRef } from 'react';
import { useRouter } from 'next/router';
import ReactHtmlParser from 'react-html-parser';
import { AdminChildMenu, AdminParentMenu } from '~/lib/data-menu/AdminMenu';
import { TeacherChildMenu, TeacherParentMenu } from '~/lib/data-menu/TeacherMenu';
import { StudentChildMenu, StudentParentMenu } from '~/lib/data-menu/StudentMenu';
import { SellerChildMenu, SellerParentMenu } from '~/lib/data-menu/SellerMenu';
import { useSession } from 'next-auth/client';
import Link from 'next/link';
import { ParentsChildMenu, ParentsParentMenu } from '~/lib/data-menu/ParentsMenu';
import { StaffManagerChildMenu, StaffManagerParentMenu } from '~/lib/data-menu/StaffManagerMenu';
import { AcademicChildMenu, AcademicParentMenu } from '~/lib/data-menu/AcademinMenu';
import { ProfessionalManagerChildMenu, ProfessionalManagerParentMenu } from '~/lib/data-menu/ProfessionalManagerMenu';
import { AccountantChildMenu, AccountantParentMenu } from '~/lib/data-menu/AccountantMenu';
import { StaffChildMenu, StaffParentMenu } from '~/lib/data-menu/StaffMenu';

type childMenu = [];

const { SubMenu } = Menu;

type propState = {
	collapsed: boolean;
};

const MenuDefault = ({
	isOpen,
	isOpenMenu,
	openMenuMobile,
	funcMenuMobile,
	resetMenuMobile
}: {
	resetMenuMobile: Function;
	funcMenuMobile: Function;
	openMenuMobile: boolean;
	isOpen: boolean;
	isOpenMenu: Function;
}) => {
	const router = useRouter();
	let getRouter = router.pathname;
	if (getRouter == '/') {
		getRouter = '/newsfeed';
	}

	const [state, setState] = useState<propState>({
		collapsed: isOpen
	} as propState);
	const [isHover, setIsHover] = useState({
		changeHeight: null,
		status: false,
		position: null
	});

	const [tab, tabSet] = useState<String>('tab-home');
	const [subMenuActive, setSubMenuActive] = useState('');
	const menuChild = useRef(null);
	const [posMenu, setPosMenu] = useState(null);
	const [openKeys, setOpenKeys] = useState(null);
	const [statusOpen, setStatusOpen] = useState<boolean>(false);
	const [sameTab, setSameTab] = useState(false);
	const [parentMenu, setParentMenu] = useState([]);
	const [childMenu, setChildMenu] = useState([]);
	const [session, loading] = useSession();

	const changeTabs = (e) => {
		e.preventDefault();

		let element = e.target;
		let position = element.getBoundingClientRect();
		setPosMenu(position);

		if (!isOpen) {
			let dataTab = e.target.getAttribute('data-tabs');

			dataTab === tab ? setSameTab(true) : tabSet(dataTab);

			setStatusOpen(true);

			setIsHover({
				...isHover,
				status: true,
				changeHeight: false
			});
		}
	};

	const changeTabsClick = (e) => {
		e.preventDefault();

		let dataTab = e.target.getAttribute('data-tabs');
		tabSet(dataTab);
	};

	const closeTabs = (e) => {
		e.preventDefault();

		// Xóa tab trước khi tìm active tab
		tabSet('');

		// Func tìm active tap
		FindTabActive();

		// Reset is Hover
		if (isHover.status) {
			setStatusOpen(false);
			setIsHover({
				changeHeight: false,
				status: false,
				position: null
			});
		}
	};

	const FindTabActive = () => {
		childMenu.forEach((menu, index) => {
			menu.MenuItem.forEach((item, ind) => {
				if (getRouter === '/') {
					tabSet('tab-home');
				} else {
					if (item.ItemType === 'sub-menu') {
						item.SubMenuList.forEach((itemSub, key) => {
							if (itemSub.Route === getRouter) {
								tabSet(menu.MenuName);
								return false;
							}
						});
					} else {
						if (item.Route === getRouter) {
							tabSet(menu.MenuName);
							return false;
						}
					}
				}
			});
		});
	};

	const FindSubMenuActive = () => {
		let SubMenuActive = '';
		childMenu.forEach((menu, index) => {
			menu.MenuItem.forEach((item, ind) => {
				if (item.ItemType === 'sub-menu') {
					item.SubMenuList.forEach((itemSub, key) => {
						if (itemSub.Route === getRouter) {
							setSubMenuActive(item.Key);
							return false;
						}
					});
				}
			});
		});
	};

	const onOpenChange = (openKeys) => {
		setOpenKeys(openKeys);

		if (openKeys.length > 0) {
			for (const value of openKeys) {
				childMenu.forEach((menu, index) => {
					menu.MenuItem.forEach((item, ind) => {
						if (item.ItemType === 'sub-menu') {
							if (item.Key === value) {
								setSubMenuActive(value);
								return false;
							}
						}
					});
				});
			}
		} else {
			setSubMenuActive('');
		}
	};

	useEffect(() => {
		setTimeout(() => {
			// Get height Screen window
			let heightScr = window.innerHeight;
			heightScr = heightScr / 2;

			// Get height menu when hover
			let heightMenu = menuChild.current.clientHeight;

			if (!isOpen) {
				if (openKeys.length > 0) {
					if (heightMenu > heightScr) {
						setIsHover({
							...isHover,
							changeHeight: true
						});
					}
				} else {
					setIsHover({
						...isHover,
						changeHeight: false
					});
				}
			}
		}, 200);

		let itemMenu = document.querySelector('.menu-child-body-element .ant-menu-submenu-inline.is-open');
		if (itemMenu) {
			itemMenu.closest('.ant-menu-inline').classList.add('scroll');
		}
	}, [openKeys]);

	useEffect(() => {
		let widthScr = window.innerWidth;

		widthScr < 1000 ? resetMenuMobile() : FindSubMenuActive(), FindTabActive();
	}, [getRouter]);

	useEffect(() => {
		!isOpen &&
			(setIsHover({
				...isHover,
				status: false
			}),
			FindTabActive());
	}, [isOpen]);

	const changeTabsWithPostion = () => {
		// Get height menu when hover
		let heightMenu = menuChild.current.clientHeight;

		// Get height Screen window
		let heightScr = window.innerHeight;

		if (posMenu !== null) {
			// Get position menu when hover
			const position = posMenu;

			setIsHover({
				changeHeight: !isOpen && heightMenu > heightScr / 2 ? true : false,
				status: !statusOpen ? false : true,
				position: !statusOpen
					? null
					: heightMenu > heightScr / 2
					? position.top > heightScr / 3
						? position.top - heightScr / 3
						: position.top - 65
					: position.top - 52
			});
		}
	};

	// Functions fine active menu when at detail page
	const convertRouter = (router: string) => {
		let arrRouter = router.split('/');

		arrRouter = arrRouter.filter(function (item) {
			if (item == '' || item == '[slug]' || item.includes('detail')) {
				return false;
			}
			return true;
		});

		let finalRouter = '';

		arrRouter.forEach((item) => {
			finalRouter = finalRouter + '/' + item;
		});

		return finalRouter;
	};

	getRouter = convertRouter(getRouter);

	const closeMenuMobile = (e) => {
		e.preventDefault();
		funcMenuMobile();
	};

	useEffect(() => {
		changeTabsWithPostion();
	}, [tab]);

	useEffect(() => {
		if (sameTab) {
			changeTabsWithPostion();
			setTimeout(() => {
				setSameTab(false);
			}, 100);
		}
	}, [sameTab]);

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
			let userInfor = parseJwt(token);
			switch (parseInt(userInfor.roleID)) {
				case 1:
					setParentMenu(AdminParentMenu);
					setChildMenu(AdminChildMenu);
					break;
				case 2:
					setParentMenu(TeacherParentMenu);
					setChildMenu(TeacherChildMenu);
					break;
				case 3:
					setParentMenu(StudentParentMenu);
					setChildMenu(StudentChildMenu);
					break;
				case 4:
					setParentMenu(ParentsParentMenu);
					setChildMenu(ParentsChildMenu);
					break;
				case 5:
					setParentMenu(StaffManagerParentMenu);
					setChildMenu(StaffManagerChildMenu);
					break;
				case 6:
					setParentMenu(SellerParentMenu);
					setChildMenu(SellerChildMenu);
					break;
				case 7:
					setParentMenu(AcademicParentMenu);
					setChildMenu(AcademicChildMenu);
					break;
				case 8:
					setParentMenu(ProfessionalManagerParentMenu);
					setChildMenu(ProfessionalManagerChildMenu);
					break;
				case 9:
					setParentMenu(AccountantParentMenu);
					setChildMenu(AccountantChildMenu);
					break;
				case 10:
					setParentMenu(StaffParentMenu);
					setChildMenu(StaffChildMenu);
					break;
				default:
					break;
			}
		}
	}, []);

	useEffect(() => {
		if (childMenu.length > 0) {
			FindSubMenuActive();
			FindTabActive();
		}
	}, [childMenu]);

	const onClick_Sub = () => {
		console.log('Hello');
	};

	return (
		<aside className={`navbar-right ${openMenuMobile ? 'mobile' : ''}`}>
			<div className={`navbar-right-bg ${openMenuMobile ? 'active' : ''}`}>
				<a href="#" onClick={closeMenuMobile}></a>
			</div>
			<div className="menu-parent">
				<div className="menu-parent-logo">
					<Link href="/newfeeds">
						<a> {/* <img className="logo-img" src="/images/logo.png"></img> */}</a>
					</Link>
				</div>
				<div className="menu-parent-body">
					<ul className="list-menu">
						{parentMenu.map((item, index) => (
							<li className={tab === item.TabName ? 'active' : ''} key={index}>
								<b className={tab === item.TabName ? '' : 'd-none'}></b>
								<b className={tab === item.TabName ? '' : 'd-none'}></b>
								<a href="#" onClick={changeTabsClick} onMouseEnter={changeTabs} data-tabs={item.TabName}>
									{item.Icon}
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>
			<div className={`menu-child-bg ${!isOpen && `${isHover.status ? 'open' : ''}`}`} onMouseEnter={closeTabs}></div>
			<div className={`menu-child  ${!isOpen && `close-app  ${isHover.status ? 'hover-open' : ''} `}`}>
				<div className="app-header-logo">
					<p>Mona Media</p>
				</div>
				<div
					className={`menu-child-body ${isHover.changeHeight ? 'change-height' : ''}`}
					ref={menuChild}
					style={{
						top: isHover.status ? isHover.position : 'unset'
					}}
				>
					{childMenu?.map((menu, indexMenu) => (
						<div key={indexMenu} className="menu-child-body-element">
							<Menu
								key={indexMenu}
								onOpenChange={onOpenChange}
								selectedKeys={[getRouter == '/' ? '/newfeed' : getRouter]}
								openKeys={[subMenuActive]}
								mode="inline"
								theme="light"
								style={{ display: tab === menu.MenuName ? 'block' : 'none' }}
							>
								<Menu.ItemGroup key={menu.MenuKey} title={menu.MenuTitle}>
									{menu.MenuItem?.map((item, indexItem) =>
										item.ItemType !== 'sub-menu' ? (
											<Menu.Item key={item.Key} icon={ReactHtmlParser(item.Icon)}>
												<Link href={item.Route}>
													<a>{item.Text}</a>
												</Link>
											</Menu.Item>
										) : (
											<SubMenu
												className={`${openKeys && item.Key === openKeys[openKeys?.length - 1] ? 'is-open' : ''}`}
												key={item.Key}
												icon={ReactHtmlParser(item.Icon)}
												title={item.TitleSub}
											>
												{item?.SubMenuList.map((subitem, indexSubitem) => (
													<Menu.Item key={subitem.Key} icon={ReactHtmlParser(subitem.Icon)}>
														<Link href={subitem.Route}>
															<a>{subitem.Text}</a>
														</Link>
													</Menu.Item>
												))}
											</SubMenu>
										)
									)}
								</Menu.ItemGroup>
							</Menu>
						</div>
					))}
				</div>
			</div>
		</aside>
	);
};

export default MenuDefault;
