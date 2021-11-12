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
				Key: '/course-exam-student',
				Route: '/course-exam-student',
				Icon: '',
				Text: 'Bài kiểm tra'
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
