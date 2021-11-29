import React from 'react';
import { Airplay, FileText, Home, User, UserCheck } from 'react-feather';

export const AccountantParentMenu = [
	{
		TabName: 'tab-home',
		Icon: <Home />
	}
];

export const AccountantChildMenu = [
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
				Key: '/dashboard',
				Route: '/dashboard',
				Icon: '',
				Text: 'Thống kê'
			},
			{
				TypeItem: 'single',
				Key: '/staff/salary-of-staff',
				Route: '/staff/salary-of-staff',
				Icon: '',
				Text: 'Bảng lương nhân viên'
			},
			{
				ItemType: 'sub-menu',
				Key: 'sub-list-course-child-4',
				Icon: '',
				TitleSub: 'Tài chính',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/customer/finance/finance-customer-debts',
						Route: '/customer/finance/finance-customer-debts',
						Text: 'Thông tin thanh toán',
						Icon: ''
					},

					{
						ItemType: 'single',
						key: '/customer/finance/finance-cashier-invoice',
						Route: '/customer/finance/finance-cashier-invoice',
						Text: 'Phiếu thu',
						Icon: ''
					}
				]
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
