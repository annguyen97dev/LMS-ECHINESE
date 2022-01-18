import React, { Fragment } from 'react';
import { Home, Airplay, User, Package, Book, UserCheck, Tool, FileText } from 'react-feather';

export const StudentParentMenu = [
	{
		TabName: 'tab-home',
		Icon: <Home />
	},
	//   {
	//     TabName: "tab-course",
	//     Icon: <Airplay />,
	//   },
	//   {
	//     TabName: "tab-exercise",
	//     Icon: <FileText />,
	//   },
	//   {
	//     TabName: "tab-student",
	//     Icon: <User />,
	//   },
	//   {
	//     TabName: "tab-staff",
	//     Icon: <UserCheck />,
	//   },
	{
		TabName: 'tab-package',
		Icon: <Package />
	}
];

export const StudentChildMenu = [
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
				Key: '/course/schedule-study-student',
				Icon: '',
				Route: '/course/schedule-study-student',
				Text: 'Lịch học'
			},
			{
				TypeItem: 'single',
				Key: '/customer/service/service-test-student',
				Route: '/customer/service/service-test-student',
				Icon: '',
				Text: 'Thông tin hẹn test'
			},
			{
				TypeItem: 'single',
				Key: '/course/course-list',
				Route: '/course/course-list',
				Icon: '',
				Text: 'Khóa học của bạn'
			},
			// {
			// 	TypeItem: 'single',
			// 	Key: '/stationery',
			// 	Route: '/stationery',
			// 	Icon: '',
			// 	Text: 'Cửa hàng văn phòng phẩm'
			// },
			{
				ItemType: 'sub-menu',
				Key: 'video-course',
				Icon: '',
				TitleSub: 'Khóa học video',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/video-course',
						Route: '/video-course',
						Text: 'Danh sách khóa học',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/video-course-student',
						Route: '/video-course-student',
						Text: 'Danh sách đơn hàng',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/video-course-list',
						Route: '/video-course-list',
						Text: 'Khóa học đã sở hữu',
						Icon: ''
					}
				]
			},
			{
				ItemType: 'single',
				Key: '/option/services',
				Route: '/option/services',
				Text: 'Dịch vụ đã mua',
				Icon: ''
			},
			// {
			// 	ItemType: 'single',
			// 	Key: '/customer/finance/product-paid',
			// 	Route: '/customer/finance/product-paid',
			// 	Text: 'Sản phẩm đã mua',
			// 	Icon: ''
			// },
			// {
			// 	ItemType: 'single',
			// 	Key: '/option/day-off',
			// 	Route: '/option/day-off',
			// 	Text: 'Ngày nghỉ',
			// 	Icon: ''
			// },
			// {
			// 	TypeItem: 'single',
			// 	Key: '/customer/student/course-exam-student',
			// 	Route: '/customer/student/course-exam-student',
			// 	Icon: '',
			// 	Text: 'Bài kiểm tra & bài tập'
			// },
			{
				ItemType: 'single',
				Key: '/option/faq',
				Route: '/option/faq',
				Text: 'Câu hỏi thường gặp',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/feedback',
				Route: '/feedback',
				Text: 'Phản hồi',
				Icon: ''
			}
		]
	},
	{
		MenuName: 'tab-package',
		MenuTitle: 'Bộ đề thi',
		MenuKey: '/package',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/package/package-student',
				Route: '/package/package-student',
				Text: 'Danh sách bộ đề',
				Icon: ''
			},

			{
				ItemType: 'single',
				Key: '/package/package-store',
				Route: '/package/package-store',
				Text: 'Cửa hàng',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/package/package-result-student',
				Route: '/package/package-result-student',
				Text: 'Kết quả thi',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/package/pay-fix-list',
				Route: '/package/pay-fix-list',
				Text: 'Mua lượt chấm bài',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/package/rank-result-student',
				Route: '/package/rank-result-student',
				Text: 'Bảng xếp hạng làm bài',
				Icon: ''
			}
		]
	}
];
