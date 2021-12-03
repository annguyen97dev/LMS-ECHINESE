import React from 'react';
import { Airplay, FileText, Home, User, UserCheck } from 'react-feather';

export const TeacherParentMenu = [
	{
		TabName: 'tab-home',
		Icon: <Home />
	},
	{
		TabName: 'tab-course',
		Icon: <Airplay />
	},
	// {
	// 	TabName: 'tab-package',
	// 	Icon: <FileText />
	// },
	{
		TabName: 'tab-student',
		Icon: <User />
	},
	{
		TabName: 'tab-staff',
		Icon: <UserCheck />
	}
];

export const TeacherChildMenu = [
	{
		MenuName: 'tab-home',
		MenuTitle: 'Trang chủ',
		MenuKey: '/dashboard',
		MenuItem: [
			{
				TypeItem: 'single',
				Key: '/newsfeed',
				Route: '/newsfeed',
				Icon: '',
				Text: 'Tin tức'
			},
			{
				TypeItem: 'single',
				Key: '/course/schedule-study-teacher',
				Icon: '',
				Route: '/course/schedule-study-teacher',
				Text: 'Lịch dạy '
			},
			{
				TypeItem: 'single',
				Key: '/teacher/day-off-schedule',
				Icon: '',
				Route: '/teacher/day-off-schedule',
				Text: 'Lịch nghỉ'
			},
			{
				TypeItem: 'single',
				Key: '/staff/salary-of-teacher',
				Icon: '',
				Route: '/staff/salary-of-teacher',
				Text: 'Bảng lương giáo viên'
			}
		]
	},
	{
		MenuName: 'tab-course',
		MenuTitle: 'Khóa học',
		MenuKey: '/course',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/course/course-list',
				Route: '/course/course-list',
				Text: 'Danh sách khóa học',
				Icon: ''
			},
			{
				TypeItem: 'single',
				Key: '/course/register-course',
				Icon: '',
				Route: '/course/register-course',
				Text: 'Đăng ký khóa học'
			}
			// {
			// 	ItemType: 'sub-menu',
			// 	Key: 'sub-course-zoom',
			// 	Icon: '<span class="anticon"><img src="/images/icons/zoom-video.svg" ></span>',
			// 	TitleSub: 'Quản lý Zoom',
			// 	SubMenuList: [
			// 		{
			// 			ItemType: 'single',
			// 			Key: '/course/manage-zoom/config-zoom',
			// 			Route: '/course/manage-zoom/config-zoom',
			// 			Text: 'Cấu hình',
			// 			Icon: ''
			// 		},
			// 		{
			// 			ItemType: 'single',
			// 			Key: '/course/manage-zoom/meeting-zoom',
			// 			Route: '/course/manage-zoom/meeting-zoom',
			// 			Text: 'Danh sách phòng học',
			// 			Icon: ''
			// 		}
			// 	]
			// }
		]
	},

	{
		MenuName: 'tab-student',
		MenuTitle: 'Học viên',
		MenuKey: '/customer',
		MenuItem: [
			{
				ItemType: 'sub-menu',
				Key: 'sub-list-course-child-3',
				Icon: '',
				TitleSub: 'Báo cáo học viên',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/customer/report/report-customer-warning',
						Route: '/customer/report/report-customer-warning',
						Text: 'Cảnh báo học viên',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/customer/report/report-customer-test',
						Route: '/customer/report/report-customer-test',
						Text: 'Học viên sắp thi',
						Icon: ''
					}
				]
			},

			{
				ItemType: 'single',
				Key: '/feedback',
				Route: '/feedback',
				Text: 'Phản hồi',
				Icon: ''
			},
			{
				TypeItem: 'single',
				Key: '/customer/service/service-test-teacher',
				Route: '/customer/service/service-test-teacher',
				Icon: '',
				Text: 'Chấm bài hẹn test'
			},
			{
				ItemType: 'single',
				Key: '/package/package-result-teacher',
				Route: '/package/package-result-teacher',
				Text: 'Chấm đề thi',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/customer/student/course-exam',
				Route: '/customer/student/course-exam',
				Text: 'Chấm bài tập & kiểm tra',
				Icon: ''
			}
		]
	},
	{
		MenuName: 'tab-staff',
		MenuTitle: 'Phân công',
		MenuKey: '/staff',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/staff/manage-task',
				Route: '/staff/manage-task',
				Text: 'Quản lí công việc',
				Icon: ''
			}
		]
	}
];
