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
				Text: 'Kết quả làm bài',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/package/pay-fix-list',
				Route: '/package/pay-fix-list',
				Text: 'Mua lượt chấm bài',
				Icon: ''
			}
		]
	}
];
