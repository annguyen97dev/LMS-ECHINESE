import { ControlOutlined } from '@ant-design/icons';
import { Spin, Tabs } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Bell, Book, BookOpen, Calendar, CheckCircle, Edit, FileText, Flag, Users, Edit3 } from 'react-feather';
import { courseApi, groupNewsFeedApi } from '~/apiBase';
import DocumentCourse from '~/components/Global/CourseList/CourseListDetail/Document/DocumentCourse';
import RollUp from '~/components/Global/CourseList/CourseListDetail/RollUp/RollUp';
import StudentsList from '~/components/Global/CourseList/CourseListDetail/StudentList/StudentList';
import { useWrap } from '~/context/wrap';
import LessionPage from '~/pages/course/lessons';
import CourseExamAdmin from '../../CourseExam/CourseExamAdmin';
import CourseExamStudent from '../../CourseExamStudent/CourseExamStudent';
import AddGroupFormFromCourseDetail from '../../NewsFeed/NewsFeedGroupComponents/AddGroupFormFromCourseDetail';
import LessonDetail from '../LessonDetail';
import CourseDetailCalendar from './CourseDetailCalendar/CourseDetailCalendar';
import Homework from './Homework/Homework';
import NotificationCourse from './NotificationCourse/NotificationCourse';
import TimelineCourse from './Timeline/Timeline';

const { TabPane } = Tabs;
const CourseListDetail = () => {
	const { userInformation, isAdmin } = useWrap();
	const [isLoading, setIsLoading] = useState({ type: '', status: false });
	const router = useRouter();
	const [groupID, setGroupID] = useState({ groupID: null, groupInfo: null });
	const [courseDetail, setCourseDetail] = useState<ICourseDetail>();
	console.log(courseDetail);
	const { showNoti, pageSize } = useWrap();
	const { slug: ID, type } = router.query;
	const parseIntID = parseInt(ID as string);

	console.log('courseDetail: ', courseDetail);

	const isStudent = () => {
		let role = userInformation?.RoleID;
		if (role == 3) {
			return true;
		} else {
			return false;
		}
	};

	const getGroupNewsFeed = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await groupNewsFeedApi.getAll({ pageSize: pageSize, pageIndex: 1, CourseID: Number(router.query.slug) });
			if (res.status === 200) {
				if (res.data.totalRow && res.data.data.length) {
					// @ts-ignore
					setGroupID({ groupID: res.data.data[0].ID, groupInfo: res.data.data });
				}
			} else if (res.status === 204) {
				setGroupID(null);
				// showNoti('danger', 'Nh??m ch??a t???n t???i, b???n c?? th??? t???o nh??m!');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	const getCourseDetail = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await courseApi.getById(Number(router.query.slug));
			if (res.status === 200) {
				setCourseDetail(res.data.data);
			} else if (res.status === 204) {
				showNoti('danger', 'Kh??ng t??m th???y');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	useEffect(() => {
		getGroupNewsFeed();
		getCourseDetail();
	}, [router.query.slug]);

	return (
		<div className="course-dt page-no-scroll">
			<Tabs
				tabPosition="right"
				onTabClick={(key) => {
					if (parseInt(key) === 2) {
						const url = () => {
							if (parseInt(type as string) === 1 || courseDetail?.TypeCourse === 1)
								return `/course/course-list/edit-course/${parseIntID}`;
							if (parseInt(type as string) === 2 || courseDetail?.TypeCourse === 2)
								return `/course/course-list/edit-course-online/${parseIntID}`;
							if (parseInt(type as string) === 3 || courseDetail?.TypeCourse === 3)
								return `/course/course-list/edit-self-course/${parseIntID}`;
						};
						router.push(url());
					}

					if (parseInt(key) === 9) {
						if (groupID) {
							router.push({ pathname: '/newsfeed/', query: { idGroup: groupID.groupID } });
						}
					}
				}}
				className="list-menu-course"
			>
				<TabPane
					tab={
						<>
							<Calendar />
							<span title="L???ch h???c"> L???ch h???c</span>
						</>
					}
					key="1"
				>
					<CourseDetailCalendar courseID={parseIntID} isAdmin={isAdmin || userInformation?.RoleID === 2} />
				</TabPane>
				<TabPane
					tab={
						<>
							<BookOpen />
							<span title="Gi??o tr??nh">Gi??o tr??nh</span>
						</>
					}
					key="10"
				>
					<LessonDetail />
				</TabPane>
				<TabPane
					tab={
						<>
							<Edit />
							<span title="Gi??o tr??nh">Ki???m tra</span>
						</>
					}
					key="11"
				>
					{!isAdmin ? <CourseExamStudent /> : <CourseExamAdmin />}
				</TabPane>
				<TabPane
					tab={
						<>
							<Edit />
							<span title="Gi??o tr??nh">B??i t???p</span>
						</>
					}
					key="12"
				>
					{!isAdmin ? (
						<Homework courseID={courseDetail?.ID} CurriculumID={courseDetail?.CurriculumID} />
					) : (
						<Homework courseID={courseDetail?.ID} CurriculumID={courseDetail?.CurriculumID} />
					)}
				</TabPane>
				<TabPane
					tab={
						<>
							<i className="far fa-calendar-alt" style={{ fontSize: 22, marginRight: 7 }}></i>
							<span title="Gi??o tr??nh">C??c bu???i h???c</span>
						</>
					}
					key="22"
				>
					{<LessionPage courseID={parseIntID} />}
				</TabPane>

				{courseDetail?.Status !== 2
					? (isAdmin || userInformation?.RoleID == 2 || (userInformation?.RoleID === 3 && courseDetail?.TypeCourse === 3)) && (
							<TabPane
								tab={
									<>
										<Edit3 />
										<span title="Ch???nh s???a">
											{userInformation?.RoleID === 3 && courseDetail?.TypeCourse === 3
												? '????ng k?? bu???i h???c'
												: 'Ch???nh s???a'}
										</span>
									</>
								}
								key="2"
							>
								<div className="d-flex align-items-center justify-content-center" style={{ height: 200 }}>
									<Spin size="large" />
								</div>
							</TabPane>
					  )
					: userInformation &&
					  userInformation.RoleID === 1 && (
							<TabPane
								tab={
									<>
										<Edit3 />
										<span title="Ch???nh s???a">Ch???nh s???a</span>
									</>
								}
								key="2"
							>
								<div className="d-flex align-items-center justify-content-center" style={{ height: 200 }}>
									<Spin size="large" />
								</div>
							</TabPane>
					  )}

				{(isAdmin || userInformation?.RoleID == 2) && (
					<TabPane
						tab={
							<>
								<Book />
								<span title="H???c vi??n"> H???c vi??n</span>
							</>
						}
						key="3"
					>
						<StudentsList courseID={parseIntID} />
					</TabPane>
				)}

				<TabPane
					tab={
						<>
							<CheckCircle />
							<span title="??i???m danh"> ??i???m danh</span>
						</>
					}
					key="4"
				>
					<RollUp courseID={parseIntID} />
				</TabPane>
				{/* <TabPane
					tab={
						<>
							<Activity />
							<span title="Nh???p ??i???m"> Nh???p ??i???m</span>
						</>
					}
					key="5"
				>
					<Transcript />
				</TabPane> */}
				<TabPane
					tab={
						<>
							<FileText />
							<span title="T??i li???u"> T??i li???u</span>
						</>
					}
					key="6"
				>
					<DocumentCourse courseID={parseIntID} courseDetail={courseDetail} />
				</TabPane>

				{!isStudent() && (
					<TabPane
						tab={
							<>
								<Flag />
								<span title="Ph???n h???i">Ph???n h???i bu???i h???c</span>
							</>
						}
						key="7"
					>
						<TimelineCourse courseID={parseIntID} />
					</TabPane>
				)}

				<TabPane
					tab={
						<>
							<Bell />
							<span title="Th??ng b??o"> Th??ng b??o qua email</span>
						</>
					}
					key="8"
				>
					<NotificationCourse courseID={parseIntID} />
				</TabPane>

				{userInformation &&
					(userInformation.RoleID == 1 || userInformation.RoleID == 2 || userInformation.RoleID == 5) &&
					(groupID ? (
						<TabPane
							tab={
								<>
									<Users />
									<span title="Nh??m"> Nh??m</span>
								</>
							}
							key="9"
						>
							<div className="d-flex align-items-center justify-content-center" style={{ height: 200 }}>
								<Spin size="large" />
							</div>
						</TabPane>
					) : (
						<TabPane
							tab={
								<AddGroupFormFromCourseDetail isCourseListDetail={true} courseDetail={courseDetail} isLoading={isLoading} />
							}
							key="9"
						>
							<div className="d-flex align-items-center justify-content-center" style={{ height: 200 }}>
								<Spin size="large" />
							</div>
						</TabPane>
					))}
			</Tabs>
		</div>
	);
};

export default CourseListDetail;
