import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '~/components/Header';
import Menu from '~/components/Menu';
import { signIn, useSession } from 'next-auth/client';
import { useWrap } from '~/context/wrap';
import TitlePageHeader from '~/components/Elements/TitlePageHeader';
import { Breadcrumb } from 'antd';
export const siteTitle = 'Mona Media Admin';
import { AdminChildMenu, AdminParentMenu } from '~/lib/data-menu/AdminMenu';
import { TeacherChildMenu, TeacherParentMenu } from '~/lib/data-menu/TeacherMenu';
import { StudentChildMenu, StudentParentMenu } from '~/lib/data-menu/StudentMenu';
import { SellerChildMenu, SellerParentMenu } from '~/lib/data-menu/SellerMenu';
import { ParentsChildMenu, ParentsParentMenu } from '~/lib/data-menu/ParentsMenu';
import { StaffManagerChildMenu, StaffManagerParentMenu } from '~/lib/data-menu/StaffManagerMenu';
import { AcademicChildMenu, AcademicParentMenu } from '~/lib/data-menu/AcademinMenu';
import { ProfessionalManagerChildMenu, ProfessionalManagerParentMenu } from '~/lib/data-menu/ProfessionalManagerMenu';
import { AccountantChildMenu, AccountantParentMenu } from '~/lib/data-menu/AccountantMenu';
import { Popover } from 'antd';
import InComingClassBtn from '../Global/CreateCourseOnline/InComingClassBtn';
import RegCourseBtn from '../Global/RegisterCourse/RegCourseBtn';

const name = 'Mona';

function Layout({ children, home }: { children: React.ReactNode; home?: boolean }) {
	const { userInformation } = useWrap();
	const [mainMenu, setMainMenu] = useState(null);

	// Get path and slug
	const router = useRouter();
	const slug = router.query.slug;
	let path: string = router.pathname;
	let pathString: string[] = path.split('/');

	pathString = pathString.filter((item) => {
		if (item == '' || item == '[slug]') {
			return false;
		}
		return true;
	});

	// --------------- //

	//   const defaultOptions = {
	//     loop: true,
	//     autoplay: true,
	//     animationData: panda,
	//     rendererSettings: {
	//       preserveAspectRatio: "xMidYMid slice",
	//     },
	//   };

	const [isOpen, setIsOpen] = useState(true);

	const [openMenuMobile, setOpenMenuMobile] = useState(false);
	const { titlePage } = useWrap();
	const funcMenuMobile = () => {
		!openMenuMobile ? setOpenMenuMobile(true) : setOpenMenuMobile(false);
	};
	//   const [session, loading] = useSession();
	//   const [isLoading, setIsLoading] = useState(true);

	//   useEffect(() => {
	//     console.log("Session: ", session);

	//     if (typeof session !== "undefined") {
	//       if (session == null) {
	//         // console.log("Test path: ", path.search("signin") < 0);
	//         if (path.search("signin") < 0) {
	//           signIn();
	//         }
	//       } else {
	//         setIsLoading(false);
	//       }
	//     }
	//   }, [session]);

	const resetMenuMobile = () => {
		setOpenMenuMobile(false);
	};

	const isOpenMenu = () => {
		if (isOpen) {
			setIsOpen(false);
		} else {
			setIsOpen(true);
		}
	};

	const handleSignIn = (event: React.SyntheticEvent<any>) => signIn();

	// Lấy rotuer đế gán vào route của Link
	const returnRouter = (index: number) => {
		let router = '';

		if (index > 0) {
			pathString.forEach((item, ind) => {
				if (ind <= index) {
					router = router + '/' + item;
				} else {
					return false;
				}
			});
		} else {
			router = '/' + pathString[0];
		}

		let nameRouter = null;
		mainMenu?.forEach((item, value) => {
			if (nameRouter == null) {
				item.MenuItem.forEach((element: any) => {
					if (nameRouter == null) {
						if (element.ItemType == 'sub-menu') {
							element.SubMenuList.forEach((menu, ind) => {
								if (router === menu.Key) {
									nameRouter = menu.Route;
									return false;
								}
							});
						} else {
							if (router === element.Key) {
								nameRouter = element.Route;
								return false;
							}
						}
					} else {
						return false;
					}
				});
			} else {
				return false;
			}
		});

		return nameRouter;
	};

	// Lấy router để bóc tách so sánh => trả về nameRouter
	const returnGetRouter = (index: number) => {
		let router = '';

		if (index > 0) {
			pathString.forEach((item, ind) => {
				if (ind <= index) {
					router = router + '/' + item;
				} else {
					return false;
				}
			});
		} else {
			router = '/' + pathString[0];
		}

		return router;
	};

	// Tìm nameRouter với trường hợp breadcum chỉ có 1
	const findNameRouterOnly = (getRouter: string) => {
		let nameRouter = '';
		mainMenu?.forEach((item, index) => {
			if (item.MenuKey === getRouter) {
				nameRouter = item.MenuTitle;
				return false;
			}
		});

		return nameRouter;
	};

	// Tìm nameRouter với trường hợp breadcum > 1
	const findNameRouterMany = (getRouter: string) => {
		let nameRouter = '';

		mainMenu?.forEach((item, value) => {
			if (nameRouter == '') {
				item.MenuItem.forEach((element: any) => {
					if (nameRouter == '') {
						if (element.ItemType == 'sub-menu') {
							element.SubMenuList.forEach((menu, ind) => {
								if (getRouter === menu.Key) {
									nameRouter = menu.Text;
									return false;
								}
							});
						} else {
							if (getRouter === element.Key) {
								nameRouter = element.Text;
								return false;
							}
						}
					} else {
						return false;
					}
				});
			} else {
				return false;
			}
		});

		if (nameRouter === '') {
			if (getRouter.search('detail') > 0) {
				nameRouter = 'Chi tiết';
				if (getRouter.includes('course-list-detail')) {
					nameRouter = 'Tên khóa học';
				}
			} else {
				nameRouter = '';
			}
		}

		return nameRouter;
	};

	// Trả về text
	const returnText = (index: number) => {
		let nameRouter = '';

		let getRouter = returnGetRouter(index);

		if (index < 1) {
			nameRouter = findNameRouterOnly(getRouter); // Tìm tên router trường hợp key chỉ có 1 từ
		} else {
			nameRouter = findNameRouterMany(getRouter); // Tìm tên router trường hợp key > 1 từ
		}

		return nameRouter;
	};

	const contentFanpage = (
		<div>
			<iframe
				src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fechinese.vn%2F&tabs=timeline%2C%20message&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=688873135187834"
				width="500"
				height="500"
				style={{ maxWidth: '100%', border: 'bone', overflow: 'hidden' }}
				scrolling="no"
				frameBorder="0"
				allowFullScreen
				allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
			></iframe>
		</div>
	);

	useEffect(() => {
		if (userInformation) {
			switch (userInformation.RoleID) {
				case 1:
					setMainMenu(AdminChildMenu);
					break;
				case 2:
					setMainMenu(TeacherChildMenu);
					break;
				case 3:
					setMainMenu(StudentChildMenu);
					break;
				case 4:
					setMainMenu(ParentsChildMenu);
					break;
				case 5:
					setMainMenu(StaffManagerChildMenu);
					break;
				case 6:
					setMainMenu(SellerChildMenu);
					break;
				case 7:
					setMainMenu(AcademicChildMenu);
					break;
				case 8:
					setMainMenu(ProfessionalManagerChildMenu);
					break;
				case 9:
					setMainMenu(AccountantChildMenu);
					break;
				default:
					break;
			}
		}
	}, [userInformation]);

	return (
		<div className="app">
			<Head>
				<link rel="icon" href="/logo.png" />
				<meta name="description" content="Mona Media Admin" />
				<meta name="og:title" content={siteTitle} />
				<meta name="twitter:card" content="summary_large_image" />
			</Head>
			<Header isOpenMenu={isOpenMenu} isOpen={isOpen} funcMenuMobile={funcMenuMobile} openMenuMobile={openMenuMobile} />
			<Menu
				resetMenuMobile={resetMenuMobile}
				isOpenMenu={isOpenMenu}
				isOpen={isOpen}
				openMenuMobile={openMenuMobile}
				funcMenuMobile={funcMenuMobile}
			/>
			<main className="app-main">
				{/* KIỂM TRA LỚP SẮP DIỄN RA DÀNH CHO HỌC VIÊN*/}
				{userInformation?.RoleID === 3 && <InComingClassBtn />}
				{/* Redirect to registor course */}
				{(userInformation?.RoleID === 1 ||
					userInformation?.RoleID === 2 ||
					userInformation?.RoleID === 5 ||
					userInformation?.RoleID === 6) && <RegCourseBtn />}
				{/* FACEBOOK */}
				<Popover content={contentFanpage} title="Fanpage" trigger="click">
					<div className="icon-facebook">
						<img className="facebook-img" src="/icons/facebook.png"></img>
					</div>
				</Popover>

				<div className={`app-content ${!isOpen && 'close-app'}`}>
					<div className="wrap-breadcrumb">
						{mainMenu && mainMenu.length > 0 && (
							<Breadcrumb>
								{pathString?.map(
									(item, index) =>
										returnText(index) !== '' && (
											<Breadcrumb.Item key={index}>
												{returnRouter(index) !== null ? (
													<Link href={returnRouter(index)}>
														<a>{returnText(index)}</a>
													</Link>
												) : (
													<span>{returnText(index)}</span>
												)}
											</Breadcrumb.Item>
										)
								)}
							</Breadcrumb>
						)}
					</div>
					<div className="app-content-title">
						<TitlePageHeader title={titlePage} />
					</div>
					<div className="container-fluid">{children}</div>
				</div>
			</main>
		</div>
	);
}

export default Layout;
