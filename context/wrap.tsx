import React, { createContext, useState, useContext, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userApi, userInformationApi } from '~/apiBase';
import { signIn, useSession } from 'next-auth/client';

export type IProps = {
	titlePage: string;
	getRouter: any;
	getTitlePage: Function;
	showNoti: Function;
	getDataUser: Function;
	userInformation: IUser;
	useAllRoles: IRole[];
	useStaffRoles: IRole[];
	pageSize: number;
	isAdmin: boolean;
	reloadNotification: boolean;
	handleReloadNoti: Function;
	reloadCart: boolean;
	handleReloadCart: Function;
};

const WrapContext = createContext<IProps>({
	titlePage: '',
	getRouter: '',
	getTitlePage: () => {},
	showNoti: () => {},
	getDataUser: () => {},
	userInformation: null,
	useAllRoles: null,
	useStaffRoles: null,
	pageSize: 30,
	isAdmin: false,
	reloadNotification: false,
	handleReloadNoti: Function,
	reloadCart: false,
	handleReloadCart: Function
});

// const initialState = {
//   noti: "",
// };

// function reducer() {}

export const WrapProvider = ({ children }) => {
	// Get path and slug
	const router = useRouter();
	const slug = router.query.slug;
	let path: string = router.pathname;
	let pathString: string[] = path.split('/');
	// ---- //
	const [session, loading] = useSession();
	const [titlePage, setTitlePage] = useState('');

	const getRouter = router.pathname;
	const [typeNoti, setTypeNoti] = useState({
		content: '',
		type: ''
	});
	const [userInfo, setUserInfo] = useState<IUser>(null);
	const [roles, setRoles] = useState<IRole[]>(null);
	const [staffRoles, setStaffRoles] = useState<IRole[]>(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [reloadNotification, setReloadNotification] = useState(false);
	const [reloadCart, setReloadCart] = useState(false);

	// --- Get Title Page ---
	const getTitlePage = (title) => {
		setTitlePage(title);
	};

	// --- Show Notification ---
	const showNoti = (type: string, content: string) => {
		const nodeNoti = () => {
			return (
				<div className={`noti-box`}>
					<div className="noti-box__content">
						<span className="icon">
							{type == 'danger' ? <WarningOutlined /> : type == 'success' && <CheckCircleOutlined />}
						</span>
						<span className="text">{content}</span>
					</div>
				</div>
			);
		};

		switch (type) {
			case 'success':
				toast.success(nodeNoti);
				break;
			case 'danger':
				toast.error(nodeNoti);
				break;
			case 'warning':
				toast.warning(nodeNoti);
				break;
			default:
				break;
		}
	};

	const getRoles = async (roleType) => {
		try {
			let res = await userInformationApi.getRole(roleType);
			res.status == 200 && roleType == 0 ? setRoles(res.data.data) : setStaffRoles(res.data.data);
		} catch (error) {
			console.log('Lỗi lấy thông tin roles: ', error);
		}
	};

	// --- Get Data User ---
	const getDataUser = (data) => {
		data && setUserInfo(data);
	};

	// --- Check is Admin ---
	const checkIsAdmin = (data) => {
		let role = data.RoleID;
		if (role == 1 || role == 5) {
			setIsAdmin(true);
		}
	};

	// --- Get New Data Use ---
	const getNewDataUser = async () => {
		try {
			let res = await userApi.getNew();

			res.status == 200 && (setUserInfo(res.data.data), checkIsAdmin(res.data.data));
		} catch (error) {
			console.log('Lỗi lấy thông tin user: ', error);
		}
	};

	// --- Handle Reload Notification ---
	const handleReloadNoti = () => {
		setReloadNotification(!reloadNotification);
	};

	// --- Handle Reload Card ---
	const handleReloadCart = () => {
		setReloadCart(!reloadCart);
	};

	useEffect(() => {
		// console.log('Session: ', session);
		if (loading && typeof session !== 'undefined' && session !== null) {
			if (path.search('signin') < 1) {
				getNewDataUser();
				getRoles(0);
				getRoles(1);
			}
		}
	}, [session]);

	return (
		<>
			<WrapContext.Provider
				value={{
					pageSize: 30,
					titlePage: titlePage,
					getTitlePage,
					getRouter,
					showNoti,
					getDataUser,
					userInformation: userInfo,
					useAllRoles: roles,
					useStaffRoles: staffRoles,
					isAdmin: isAdmin,
					reloadNotification: reloadNotification,
					handleReloadNoti: handleReloadNoti,
					reloadCart: reloadCart,
					handleReloadCart: handleReloadCart
				}}
			>
				<ToastContainer
					position="top-right"
					autoClose={3000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>

				{children}
			</WrapContext.Provider>
		</>
	);
};

export const useWrap = () => useContext(WrapContext);
