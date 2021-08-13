import ProfileBase from '~/components/Profile';
import LayoutBase from '~/components/LayoutBase';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import TeacherProfile from '../TeacherProfile';
import {useWrap} from '~/context/wrap';
import {teacherApi} from '~/apiBase';

const TeacherDetail = () => {
	const router = useRouter();
	const slug = router.query.slug;
	const [dataUser, setDataUser] = useState({});
	const [dataSubject, setDataSubject] = useState([]);
	const {showNoti} = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});

	const fetchTeacherByID = async () => {
		setIsLoading({
			type: 'GET_BYID',
			status: true,
		});
		try {
			let res = await teacherApi.getById(Number(slug));
			if (res.status === 200) {
				setDataUser(res.data.data);
			} else if (res.status === 204) {
				showNoti('danger', 'Không tìm thấy');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_BYID',
				status: false,
			});
		}
	};

	const updateTeacherID = async (data) => {
		setIsLoading({
			type: 'UPDATE_BYID',
			status: true,
		});
		try {
			let res = await teacherApi.update(data);
			res?.status == 200 && showNoti('success', 'Cập nhật thành công'),
				fetchTeacherByID();
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'UPDATE_BYID',
				status: false,
			});
		}
	};

	const fetchTeacherForSubject = async () => {
		// setIsLoading({
		//   type: "GET_BYID",
		//   status: true,
		// });
		try {
			let res = await teacherApi.getAllTeacherForSubject(Number(slug));
			if (res.status === 200) {
				const result = res.data.data.map((item, i) => ({
					key: item.ProgramID,
					ProgramName: item.ProgramName,
					Subject: item.Subject,
				}));
				setDataSubject(result);
			} else if (res.status === 204) {
				showNoti('danger', 'Không tìm thấy');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_BYID',
				status: false,
			});
		}
	};

	const updateTeacherForSubject = async (data) => {
		try {
			let res = await teacherApi.updateTeacherForSubject(data);
			res?.status == 200 && showNoti('success', 'Cập nhật thành công'),
				fetchTeacherForSubject();
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'UPDATE_BYID',
				status: false,
			});
		}
	};

	useEffect(() => {
		fetchTeacherByID();
		fetchTeacherForSubject();
	}, [slug]);

	return (
		<TeacherProfile
			updateTeacherID={(data) => updateTeacherID(data)}
			updateTeacherForSubject={(data) => updateTeacherForSubject(data)}
			isLoading={isLoading}
			dataSubject={dataSubject}
			dataUser={dataUser}
			userID={Number(slug)}
		/>
	);
};
export default TeacherDetail;
