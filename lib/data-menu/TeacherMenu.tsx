import React from 'react';
import { Airplay, Tool, Home, User, UserCheck, FileText, Book } from 'react-feather';

export const TeacherParentMenu = [
	{
		TabName: 'tab-home',
		Icon: <Home />
	},
	{
		TabName: 'tab-course',
		Icon: <Airplay />
	},
	{
		TabName: 'tab-student',
		Icon: <User />
	},
	{
		TabName: 'tab-staff',
		Icon: <UserCheck />
	},
	{
		TabName: 'tab-document',
		Icon: <Book />
	},
	{
		TabName: 'tab-question-bank',
		Icon: <FileText />
	},
	{
		TabName: 'tab-option',
		Icon: <Tool />
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
				ItemType: 'sub-menu',
				Key: 'sub-course',
				Icon: '<span class="anticon"><img src="/images/icons/study-course.svg" ></span>',
				TitleSub: 'Quản lí khóa học',
				SubMenuList: [
					// {
					// 	ItemType: 'single',
					// 	Key: '/course/create-course',
					// 	Route: '/course/create-course',
					// 	Text: 'Tạo khóa học',
					// 	Icon: ''
					// },
					{
						ItemType: 'single',
						Key: '/course/create-course-online',
						Route: '/course/create-course-online',
						Text: 'Tạo khóa học online',
						Icon: ''
					},
					// {
					//   ItemType: "single",
					//   Key: "/course/create-course-self",
					//   Route: "/course/create-course-self",
					//   Text: "Tạo khóa tự học",
					//   Icon: "",
					// },
					{
						ItemType: 'single',
						Key: '/course/course-list',
						Route: '/course/course-list',
						Text: 'Danh sách khóa học',
						Icon: ''
					}
					// {
					//   ItemType: "single",
					//   Key: "/course/course-list-self",
					//   Route: "/course/course-list-self",
					//   Text: "Danh sách khóa tự học",
					//   Icon: "",
					// },
				]
			},
			{
				TypeItem: 'single',
				Key: '/course/schedule-study',
				Icon: '<span class="anticon"><img src="/images/icons/calendar.svg"></span>',
				Route: '/course/schedule-study',
				Text: 'Kiểm tra lịch'
			},
			//   {
			//     TypeItem: "single",
			//     Key: "/course/schedule-study-teacher",
			//     Icon: '<span class="anticon"><img src="/images/icons/calendar.svg"></span>',
			//     Route: "/course/schedule-study-teacher",
			//     Text: "Lịch dạy giáo viên",
			//   },
			// {
			// 	TypeItem: 'single',
			// 	Key: '/course/course-list-report',
			// 	Icon: '<span class="anticon"><img src="/images/icons/list.svg"></span>',
			// 	Route: '/course/course-list-report',
			// 	Text: 'Danh sách khóa học - báo cáo'
			// },
			// {
			// 	TypeItem: 'single',
			// 	Key: '/course/course-buy',
			// 	Icon: '<span class="anticon"><img src="/images/icons/list.svg"></span>',
			// 	Route: '/course/course-buy',
			// 	Text: 'Danh sách khóa học - mua bán'
			// },
			{
				TypeItem: 'single',
				Key: '/course/register-course',
				Icon: '<span class="anticon"><img src="/images/icons/shopping-bag.svg"></span>',
				Route: '/course/register-course',
				Text: 'Đăng ký khóa học'
			},
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
			// 		{
			// 			ItemType: 'single',
			// 			Key: '/course/manage-zoom/meeting-internal',
			// 			Route: '/course/manage-zoom/meeting-internal',
			// 			Text: 'Phòng họp nội bộ',
			// 			Icon: '',
			// 		},
			// 	]
			// },
			{
				ItemType: 'sub-menu',
				Key: 'video-course',
				Icon: '<span class="anticon"><img src="/images/icons/zoom-video.svg" ></span>',
				TitleSub: 'Khóa học video',
				SubMenuList: [
					{
						TypeItem: 'single',
						Key: '/video-course',
						Route: '/video-course',
						Icon: '',
						Text: 'Danh sách khóa học'
					},
					{
						TypeItem: 'single',
						Key: '/video-course-order',
						Icon: '',
						Route: '/video-course-order',
						Text: 'Danh sách đơn hàng'
					},
					{
						TypeItem: 'single',
						Key: '/video-course-list',
						Icon: '',
						Route: '/video-course-list',
						Text: 'Khóa học đã Active'
					}
				]
			}
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
	},
	{
		MenuName: 'tab-document',
		MenuTitle: 'Document List',
		MenuKey: '/document-list',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/document-list',
				Route: '/document-list',
				Text: 'Danh sách tài liệu',
				Icon: ''
			}
		]
	},
	{
		MenuName: 'tab-question-bank',
		MenuTitle: 'Ngân hàng đề thi',
		MenuKey: '/question-bank',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/question-bank/question-list',
				Route: '/question-bank/question-list',
				Text: 'Danh sách câu hỏi',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/question-bank/exam-list',
				Route: '/question-bank/exam-list',
				Text: 'Danh sách đề thi',
				Icon: ''
			}
		]
	},
	{
		MenuName: 'tab-option',
		MenuTitle: 'Cấu hình',
		MenuKey: '/option',
		MenuItem: [
			{
				ItemType: 'sub-menu',
				Key: 'sub-tab-option-4',
				Icon: '',
				TitleSub: 'Cấu hình học',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/option/program',
						Route: '/option/program',
						Text: 'Chương trình',
						Icon: ''
					}
				]
			}
		]
	}
];
