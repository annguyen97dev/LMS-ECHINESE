import React from 'react';
import { Airplay, FileText, Home, User, UserCheck } from 'react-feather';

export const SellerParentMenu = [
	{
		TabName: 'tab-home',
		Icon: <Home />
	},
	{
		TabName: 'tab-course',
		Icon: <Airplay />
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

export const SellerChildMenu = [
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
			},
			{
				ItemType: 'single',
				Key: '/option/faq',
				Route: '/option/faq',
				Text: 'Câu hỏi thường gặp',
				Icon: ''
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
					{
						ItemType: 'single',
						Key: '/course/create-course-online',
						Route: '/course/create-course-online',
						Text: 'Tạo khóa học online',
						Icon: ''
					},

					{
						ItemType: 'single',
						Key: '/course/course-list',
						Route: '/course/course-list',
						Text: 'Danh sách khóa học',
						Icon: ''
					}
				]
			},

			{
				TypeItem: 'single',
				Key: '/course/register-course',
				Icon: '<span class="anticon"><img src="/images/icons/shopping-bag.svg"></span>',
				Route: '/course/register-course',
				Text: 'Đăng ký khóa học'
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
						Key: '/customer/service/service-info-student',
						Route: '/customer/service/service-info-student',
						Text: 'Thêm lịch hẹn test',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/customer/service/service-appointment-test',
						Route: '/customer/service/service-appointment-test',
						Text: 'Khách hẹn test',
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
					},

					{
						ItemType: 'single',
						Key: '/package/package-payment',
						Route: '/package/package-payment',
						Text: 'HV mua bộ đề',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/customer/service/service-customer-exam',
						Route: '/customer/service/service-customer-exam',
						Text: 'HV đăng kí thi',
						Icon: ''
					}
				]
			},
			{
				ItemType: 'sub-menu',
				Key: 'sub-list-parants',
				Icon: '<span class="anticon"><img src="/images/icons/users.svg"></span>',
				TitleSub: 'Phụ Huynh',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/customer/parents',
						Route: '/customer/parents',
						Text: 'Danh sách phụ huynh',
						Icon: ''
					}
				]
			},

			{
				ItemType: 'sub-menu',
				Key: 'sub-list-course-child-4',
				Icon: '<span class="anticon"><img src="/images/icons/dollar-sign.svg"></span>',
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
				Key: '/customer/contract/contract-customer-list',
				Route: '/customer/contract/contract-customer-list',
				Text: 'Học viên có hợp đồng',
				Icon: '<span class="anticon"><img src="/images/icons/clipboard.svg"></span>'
			}
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
				ItemType: 'sub-menu',
				Key: 'sub-list-staff-child-3',
				Icon: '',
				TitleSub: 'Tư vấn viên',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/staff/sales-campaign',
						Route: '/staff/sales-campaign',
						Text: 'Chiến dịch kinh doanh',
						Icon: ''
					}
					// {
					// 	ItemType: 'single',
					// 	Key: '/staff/sales-salary',
					// 	Route: '/staff/sales-salary',
					// 	Text: 'Duyệt lương',
					// 	Icon: ''
					// },
					// {
					// 	ItemType: 'single',
					// 	Key: '/staff/sales-salary-history',
					// 	Route: '/staff/sales-salary-history',
					// 	Text: 'Lịch sử duyệt',
					// 	Icon: ''
					// },
					// {
					// 	ItemType: 'single',
					// 	Key: '/staff/saler-list',
					// 	Route: '/staff/saler-list',
					// 	Text: 'Danh sách tư vấn viên',
					// 	Icon: ''
					// },
					// {
					// 	ItemType: 'single',
					// 	Key: '/staff/saler-revenue',
					// 	Route: '/staff/saler-revenue',
					// 	Text: 'Doanh thu tư vấn viên',
					// 	Icon: ''
					// }
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
