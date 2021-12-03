import { Spin, Tabs } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';
import { Bell, Book, BookOpen, Calendar, CheckCircle, Edit, FileText, Flag } from 'react-feather';
import DocumentCourse from '~/components/Global/CourseList/CourseListDetail/Document/DocumentCourse';
import RollUp from '~/components/Global/CourseList/CourseListDetail/RollUp/RollUp';
import StudentsList from '~/components/Global/CourseList/CourseListDetail/StudentList/StudentList';
import { useWrap } from '~/context/wrap';
import CourseExamAdmin from '../../CourseExam/CourseExamAdmin';
import CourseExamStudent from '../../CourseExamStudent/CourseExamStudent';
import LessonDetail from '../LessonDetail';
import CourseDetailCalendar from './CourseDetailCalendar/CourseDetailCalendar';
import NotificationCourse from './NotificationCourse/NotificationCourse';
import TimelineCourse from './Timeline/Timeline';

const { TabPane } = Tabs;
const CourseListDetail = () => {
	const { userInformation, isAdmin } = useWrap();
	const router = useRouter();
	const { slug: ID, type } = router.query;
	const parseIntID = parseInt(ID as string);

	return (
		<div className="course-dt page-no-scroll">
			<Tabs
				tabPosition="right"
				onTabClick={(key) => {
					if (parseInt(key) === 2) {
						const url =
							parseInt(type as string) === 1
								? `/course/course-list/edit-course/${parseIntID}`
								: `/course/course-list/edit-course-online/${parseIntID}`;
						router.push(url);
					}
				}}
				className="list-menu-course"
			>
				<TabPane
					tab={
						<>
							<Calendar />
							<span title="Lịch học"> Lịch học</span>
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
							<span title="Giáo trình">Giáo trình</span>
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
							<span title="Giáo trình">Bài tâp/Kiểm tra</span>
						</>
					}
					key="11"
				>
					{!isAdmin ? <CourseExamStudent /> : <CourseExamAdmin />}
				</TabPane>
				{isAdmin && (
					<TabPane
						tab={
							<>
								<Edit />
								<span title="Chỉnh sửa"> Chỉnh sửa</span>
							</>
						}
						key="2"
					>
						<div className="d-flex align-items-center justify-content-center" style={{ height: 200 }}>
							<Spin size="large" />
						</div>
					</TabPane>
				)}

				{isAdmin && (
					<TabPane
						tab={
							<>
								<Book />
								<span title="Học viên"> Học viên</span>
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
							<span title="Điểm danh"> Điểm danh</span>
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
							<span title="Nhập điểm"> Nhập điểm</span>
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
							<span title="Tài liệu"> Tài liệu</span>
						</>
					}
					key="6"
				>
					<DocumentCourse courseID={parseIntID} />
				</TabPane>
				<TabPane
					tab={
						<>
							<Flag />
							<span title="Phản hồi">Lộ trình</span>
						</>
					}
					key="7"
				>
					<TimelineCourse courseID={parseIntID} />
				</TabPane>
				<TabPane
					tab={
						<>
							<Bell />
							<span title="Thông báo"> Thông báo</span>
						</>
					}
					key="8"
				>
					<NotificationCourse courseID={parseIntID} />
				</TabPane>
			</Tabs>
		</div>
	);
};

export default CourseListDetail;
