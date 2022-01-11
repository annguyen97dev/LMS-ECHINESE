import React from 'react';
import { Airplay, FileText, Home, User, UserCheck } from 'react-feather';

export const StaffParentMenu = [
	{
		TabName: 'tab-home',
		Icon: <Home />
	},
	{
		TabName: 'tab-customer',
		Icon: <User />
	},
	{
		TabName: 'tab-staff',
		Icon: <UserCheck />
	}
];

export const StaffChildMenu = [
	{
		MenuName: 'tab-home',
		MenuTitle: 'Trang chủ',
		MenuKey: '/dashboard',
		MenuItem: [
			{
				TypeItem: 'single',
				Key: '/dashboard',
				Route: '/dashboard',
				Icon: '',
				Text: 'Thống kê'
			},
			{
				TypeItem: 'single',
				Key: '/newsfeed',
				Route: '/newsfeed',
				Icon: '',
				Text: 'Tin tức'
			},
			{
				ItemType: 'sub-menu',
				Key: 'sub-tab-option-1',
				Icon: '',
				TitleSub: 'Phản hồi',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/create-feedback',
						Route: '/create-feedback',
						Text: 'Phản hồi của bạn',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/feedback',
						Route: '/feedback',
						Text: 'Danh sách phản hồi',
						Icon: ''
					}
				]
			}
		]
	},
	{
		MenuName: 'tab-customer',
		MenuTitle: 'Khách hàng',
		MenuKey: '/customer',
		MenuItem: [
			{
				ItemType: 'sub-menu',
				Key: 'sub-list-course-child',
				Icon: '<span class="anticon"><img src="/images/icons/users.svg"></span>',
				TitleSub: 'Học viên',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/customer/student/student-advisory',
						Route: '/customer/student/student-advisory',
						Text: 'Khách hàng',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/customer/student/student-list',
						Route: '/customer/student/student-list',
						Text: 'Dữ liệu học viên',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/customer/student/student-appointment',
						Route: '/customer/student/student-appointment',
						Text: 'HV chờ xếp lớp',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/customer/student/student-course',
						Route: '/customer/student/student-course',
						Text: 'HV trong khóa',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/customer/student/student-change-course',
						Route: '/customer/student/student-change-course',
						Text: 'HV chuyển khóa',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/customer/student/student-reserve',
						Route: '/customer/student/student-reserve',
						Text: 'HV bảo lưu',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/customer/student/exchange-student',
						Route: '/customer/student/exchange-student',
						Text: 'HV chuyển giao',
						Icon: ''
					}
				]
			}
			// {
			// 	ItemType: 'sub-menu',
			// 	Key: 'sub-list-parants',
			// 	Icon: '<span class="anticon"><img src="/images/icons/users.svg"></span>',
			// 	TitleSub: 'Phụ Huynh',
			// 	SubMenuList: [
			// 		{
			// 			ItemType: 'single',
			// 			Key: '/customer/parents',
			// 			Route: '/customer/parents',
			// 			Text: 'Danh sách phụ huynh',
			// 			Icon: ''
			// 		}
			// 	]
			// }
		]
	},
	{
		MenuName: 'tab-staff',
		MenuTitle: 'Quản lí nhân viên',
		MenuKey: '/staff',
		MenuItem: [
			{
				TypeItem: 'single',
				Key: '/staff/salary-of-staff',
				Icon: '',
				Route: '/staff/salary-of-staff',
				Text: 'Bảng lương nhân viên'
			},
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
