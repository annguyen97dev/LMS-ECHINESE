import React, { Fragment } from 'react';
import { Home, Airplay, User, Package, Book, UserCheck, Tool, FileText } from 'react-feather';

export const AdminParentMenu = [
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
	},
	{
		TabName: 'tab-package',
		Icon: <Package />
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

export const AdminChildMenu = [
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

			{
				ItemType: 'sub-menu',
				Key: 'sub-course-zoom',
				Icon: '<span class="anticon"><img src="/images/icons/zoom-video.svg" ></span>',
				TitleSub: 'Quản lý Zoom',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/course/manage-zoom/config-zoom',
						Route: '/course/manage-zoom/config-zoom',
						Text: 'Cấu hình',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/course/manage-zoom/meeting-zoom',
						Route: '/course/manage-zoom/meeting-zoom',
						Text: 'Danh sách phòng học',
						Icon: ''
					}
					// {
					// 	ItemType: 'single',
					// 	Key: '/course/manage-zoom/meeting-internal',
					// 	Route: '/course/manage-zoom/meeting-internal',
					// 	Text: 'Phòng họp nội bộ',
					// 	Icon: '',
					// },
				]
			},
			//
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
			// {
			// 	ItemType: 'sub-menu',
			// 	Key: 'sub-list-course-child-2',
			// 	Icon: '<span class="anticon"><img src="/images/icons/info.svg"></span>',
			// 	TitleSub: 'Thi, hẹn test và dịch vụ',
			// 	SubMenuList: [
			// 		{
			// 		  ItemType: "single",
			// 		  Key: "/customer/service/service-customer",
			// 		  Route: "/customer/service/service-customer",
			// 		  Text: "Khách mua dịch vụ",
			// 		  Icon: "",
			// 		},

			// 		{
			// 		  ItemType: "single",
			// 		  Key: "/customer/service/service-package-customer",
			// 		  Route: "/customer/service/service-package-customer",
			// 		  Text: "Danh sách khách mua gói",
			// 		  Icon: "",
			// 		},
			// 		{
			// 			ItemType: 'single',
			// 			Key: '/customer/service/service-package-result',
			// 			Route: '/customer/service/service-package-result',
			// 			Text: 'Danh sách kết quả đợt thi',
			// 			Icon: ''
			// 		}
			// 	]
			// },
			{
				ItemType: 'sub-menu',
				Key: 'sub-list-course-child-3',
				Icon: '<span class="anticon"><img src="/images/icons/user.svg"></span>',
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
					// {
					//   ItemType: "single",
					//   Key: "/customer/report/report-customer-result",
					//   Route: "/customer/report/report-customer-result",
					//   Text: "Kết quả thi thực tế",
					//   Icon: "",
					// },
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
						Key: '/customer/finance/finance-cashier-refund',
						Route: '/customer/finance/finance-cashier-refund',
						Text: 'Yêu cầu hoàn tiền',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/customer/finance/finance-cashier-payment',
						Route: '/customer/finance/finance-cashier-payment',
						Text: 'Phiếu chi',
						Icon: ''
					},
					{
						ItemType: 'single',
						key: '/customer/finance/finance-cashier-invoice',
						Route: '/customer/finance/finance-cashier-invoice',
						Text: 'Phiếu thu',
						Icon: ''
					}
					// {
					//   ItemType: "single",
					//   Key: "/customer/finance/finance-customer-reward",
					//   Route: "/customer/finance/finance-customer-reward",
					//   Text: "Thưởng/Tài trợ",
					//   Icon: "",
					// },
				]
			},
			{
				ItemType: 'single',
				Key: '/customer/contract/contract-customer-list',
				Route: '/customer/contract/contract-customer-list',
				Text: 'Học viên có hợp đồng',
				Icon: '<span class="anticon"><img src="/images/icons/clipboard.svg"></span>'
			}
			// {
			//   ItemType: "sub-menu",
			//   Key: "sub-list-course-child-5",
			//   Icon: '<span class="anticon"><img src="/images/icons/clipboard.svg"></span>',
			//   TitleSub: "Hợp đồng",
			//   SubMenuList: [
			//     {
			//       ItemType: "single",
			//       Key: "/customer/contract/contract-customer-list",
			//       Route: "/customer/contract/contract-customer-list",
			//       Text: "Học viên có hợp đồng",
			//       Icon: "",
			//     },
			//     {
			//       ItemType: "single",
			//       Key: "/customer/contract/contract-customer-censorship",
			//       Route: "/customer/contract/contract-customer-censorship",
			//       Text: "Duyệt hợp đồng",
			//       Icon: "",
			//     },
			//   ],
			// },
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
		MenuName: 'tab-staff',
		MenuTitle: 'Quản lí nhân viên',
		MenuKey: '/staff',
		MenuItem: [
			{
				ItemType: 'sub-menu',
				Key: 'sub-list-staff-child-1',
				Icon: '',
				TitleSub: 'Nhân viên',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/staff/staff-list',
						Route: '/staff/staff-list',
						Text: 'Danh sách nhân viên',
						Icon: ''
					}
					// {
					//   ItemType: "single",
					//   Key: "/staff/saler-list",
					//   Route: "/staff/saler-list",
					//   Text: "Danh sách Salers",
					//   Icon: "",
					// },
					// {
					// 	ItemType: 'single',
					// 	Key: '/staff/feedback-list',
					// 	Route: '/staff/feedback-list',
					// 	Text: 'Duyệt feedback',
					// 	Icon: ''
					// }
				]
			},
			// {
			// 	ItemType: 'single',
			// 	Key: '/staff/salary-review',
			// 	Route: '/staff/salary-review',
			// 	Text: 'Bảng lương nhân viên',
			// 	Icon: ''
			// },

			{
				ItemType: 'sub-menu',
				Key: 'sub-list-staff-child-2',
				Icon: '',
				TitleSub: 'Giáo viên',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/staff/teacher-list',
						Route: '/staff/teacher-list',
						Text: 'Giáo viên',
						Icon: ''
					}

					// {
					//   ItemType: "single",
					//   Key: "/staff/exercise-done-list",
					//   Route: "/staff/exercise-done-list",
					//   Text: "Bài đã chấm",
					//   Icon: "",
					// },
					// {
					//   ItemType: "single",
					//   Key: "/staff/exercise-check-list",
					//   Route: "/staff/exercise-check-list",
					//   Text: "Duyệt bài",
					//   Icon: "",
					// },
					// {
					//   ItemType: "single",
					//   Key: "/staff/teach-hours-list",
					//   Route: "/staff/teach-hours-list",
					//   Text: "Giờ dạy giáo viên",
					//   Icon: "",
					// },
					// {
					//   ItemType: "single",
					//   Key: "/staff/teach-hours-center",
					//   Route: "/staff/teach-hours-center",
					//   Text: "Giờ dạy GV theo trung tâm",
					//   Icon: "",
					// },
					// {
					//   ItemType: "single",
					//   Key: "/staff/cost-list",
					//   Route: "/staff/cost-list",
					//   Text: "Giá vốn hàng bán",
					//   Icon: "",
					// },
					// {
					//   ItemType: "single",
					//   Key: "/staff/teacher-salary-list",
					//   Route: "/staff/teacher-salary-list",
					//   Text: "Chi phí lương giáo viên",
					//   Icon: "",
					// },
					// add more
				]
			},
			{
				ItemType: 'single',
				Key: '/staff/teacher-salary',
				Route: '/staff/teacher-salary',
				Text: 'Bảng lương giáo viên',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/staff/admin-salary-staff',
				Route: '/staff/admin-salary-staff',
				Text: 'Bảng lương nhân viên',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/feedback',
				Route: '/feedback',
				Text: 'Phản hồi',
				Icon: ''
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
					},
					{
						ItemType: 'single',
						Key: '/staff/sales-salary',
						Route: '/staff/sales-salary',
						Text: 'Duyệt lương',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/staff/sales-salary-history',
						Route: '/staff/sales-salary-history',
						Text: 'Lịch sử duyệt',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/staff/saler-list',
						Route: '/staff/saler-list',
						Text: 'Danh sách tư vấn viên',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/staff/saler-revenue',
						Route: '/staff/saler-revenue',
						Text: 'Doanh thu tư vấn viên',
						Icon: ''
					}
					// {
					// 	ItemType: 'single',
					// 	Key: '/staff/config-bounus',
					// 	Route: '/staff/config-bounus',
					// 	Text: 'Cấu hình thưởng',
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
	},
	{
		MenuName: 'tab-package',
		MenuTitle: 'Bộ đề',
		MenuKey: '/package',
		MenuItem: [
			{
				ItemType: 'sub-menu',
				Key: 'sub-tab-package-1',
				Icon: '',
				TitleSub: 'Quản lí bộ đề',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/package/package-list',
						Route: '/package/package-list',
						Text: 'Quản lí bộ đề',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/package/package-examiner',
						Route: '/package/package-examiner',
						Text: 'Danh sách giáo viên chấm bài',
						Icon: ''
					}
					// {
					// 	ItemType: 'single',
					// 	Key: '/package/payroll-fix',
					// 	Route: '/package/payroll-fix',
					// 	Text: 'Bảng lương chấm bài',
					// 	Icon: ''
					// }
				]
			},

			{
				ItemType: 'sub-menu',
				Key: 'sub-tab-package-2',
				Icon: '',
				TitleSub: 'Thuộc về học viên',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/package/package-set-result',
						Route: '/package/package-set-result',
						Text: 'Thi cử',
						Icon: ''
					},
					// {
					// 	ItemType: 'single',
					// 	Key: '/customer/student/course-exam',
					// 	Route: '/customer/student/course-exam',
					// 	Text: 'Kiểm tra',
					// 	Icon: ''
					// },
					{
						ItemType: 'single',
						Key: '/package/pay-fix-list',
						Route: '/package/pay-fix-list',
						Text: 'Danh sách mua lượt chấm',
						Icon: ''
					}
					// {
					// 	ItemType: 'single',
					// 	Key: '/package/package-student',
					// 	Route: '/package/package-student',
					// 	Text: 'Danh sách bộ đề học viên',
					// 	Icon: ''
					// },
					// {
					// 	ItemType: 'single',
					// 	Key: '/package/package-store',
					// 	Route: '/package/package-store',
					// 	Text: 'Cửa hàng',
					// 	Icon: ''
					// }
				]
			},
			{
				ItemType: 'single',
				Key: '/package/rank-result',
				Route: '/package/rank-result',
				Text: 'Bảng xếp hạng làm bài',
				Icon: ''
			}

			// {
			//   ItemType: "single",
			//   Key: "/package/package-create",
			//   Route: "/package/package-create",
			//   Text: "Tạo gói mới",
			//   Icon: "",
			// },
			// {
			//   ItemType: "single",
			//   Key: "/package/topic-list",
			//   Route: "/package/topic-list",
			//   Text: "Topic",
			//   Icon: "",
			// },
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
				Key: 'sub-tab-option-1',
				Icon: '',
				TitleSub: 'Địa chỉ',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/option/provincial',
						Route: '/option/provincial',
						Text: 'Tỉnh/Tp',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/option/district',
						Route: '/option/district',
						Text: 'Quận huyện',
						Icon: ''
					}
				]
			},
			{
				ItemType: 'sub-menu',
				Key: 'sub-tab-option-2',
				Icon: '',
				TitleSub: 'Dịch vụ',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/option/supplier',
						Route: '/option/supplier',
						Text: 'Nhà cung cấp',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/option/exam',
						Route: '/option/exam',
						Text: 'Đợt thi',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/option/services',
						Route: '/option/services',
						Text: 'Dịch vụ',
						Icon: ''
					}
				]
			},
			{
				ItemType: 'sub-menu',
				Key: 'sub-tab-option-4',
				Icon: '',
				TitleSub: 'Cấu hình học',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/option/center',
						Route: '/option/center',
						Text: 'Trung tâm'
					},
					{
						ItemType: 'single',
						Key: '/option/grade',
						Route: '/option/grade',
						Text: 'Khối học',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/option/study-time',
						Route: '/option/study-time',
						Text: 'Ca học',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/option/program',
						Route: '/option/program',
						Text: 'Chương trình',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/option/price-fix-exam',
						Route: '/option/price-fix-exam',
						Text: 'Giá lượt chấm bài',
						Icon: ''
					}
				]
			},
			{
				ItemType: 'sub-menu',
				Key: 'sub-tab-option-3',
				Icon: '',
				TitleSub: 'Khác',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/option/discount',
						Route: '/option/discount',
						Text: 'Mã khuyến mãi',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/option/customer-supplier',
						Route: '/option/customer-supplier',
						Text: 'Nguồn khách hàng',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/option/day-off',
						Route: '/option/day-off',
						Text: 'Ngày nghỉ',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/option/jobs',
						Route: '/option/jobs',
						Text: 'Nghề nghiệp',
						Icon: ''
					},

					{
						ItemType: 'single',
						Key: '/option/consultation-status',
						Route: '/option/consultation-status',
						Text: 'Tình trạng tư vấn khách hàng',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/option/feedback',
						Route: '/option/feedback',
						Text: 'Loại phản hồi',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/option/purpose',
						Route: '/option/purpose',
						Text: 'Mục đích học',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/option/staff-salary',
						Route: '/option/staff-salary',
						Text: 'Lương office',
						Icon: ''
					},

					// {
					//   ItemType: "single",
					//   Key: "/option/post",
					//   Route: "/option/post",
					//   Text: "Kiểm duyệt bài viết",
					//   Icon: "",
					// },
					// {
					//   ItemType: "single",
					//   Key: "/option/info-form",
					//   Route: "/option/info-form",
					//   Text: "Form thông tin",
					//   Icon: "",
					// },
					{
						ItemType: 'single',
						Key: '/option/notification',
						Route: '/option/notification',
						Text: 'Tạo thông báo',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/option/idiom',
						Route: '/option/idiom',
						Text: 'Thành ngữ lịch',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/option/contract',
						Route: '/option/contract',
						Text: 'Hợp đồng',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/option/term-of-service',
						Route: '/option/term-of-service',
						Text: 'Điều khoản',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/option/config-voucher-invoice',
						Route: '/option/config-voucher-invoice',
						Text: 'Phiếu thu, phiếu chi',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/option/faq',
						Route: '/option/faq',
						Text: 'Câu hỏi thường gặp',
						Icon: ''
					}
				]
			}
			// {
			// 	ItemType: 'sub-menu',
			// 	Key: 'sub-tab-option-5',
			// 	Icon: '',
			// 	TitleSub: 'Sản phẩm',
			// 	SubMenuList: [
			// 		{
			// 			ItemType: 'single',
			// 			Key: '/option/product-type',
			// 			Route: '/option/product-type',
			// 			Text: 'Cấu hình sản phẩm',
			// 			Icon: ''
			// 		}
			// 	]
			// }
		]
		// MenuItem: [
		// 	{
		// 		ItemType: 'single',
		// 		Key: '/option/center',
		// 		Route: '/option/center',
		// 		Text: 'Trung tâm',
		// 	},
		// 	{
		// 		ItemType: 'single',
		// 		Key: '/option/grade',
		// 		Route: '/option/grade',
		// 		Text: 'Khối học',
		// 		Icon: '',
		// 	},
		// 	{
		// 		ItemType: 'single',
		// 		Key: '/option/class',
		// 		Route: '/option/class',
		// 		Text: 'Lớp học',
		// 		Icon: '',
		// 	},
		// 	{
		// 		ItemType: 'single',
		// 		Key: '/option/study-time',
		// 		Route: '/option/study-time',
		// 		Text: 'Ca học',
		// 		Icon: '',
		// 	},
		// 	{
		// 		ItemType: 'single',
		// 		Key: '/option/program',
		// 		Route: '/option/program',
		// 		Text: 'Chương trình',
		// 		Icon: '',
		// 	},
		// 	{
		// 		ItemType: 'single',
		// 		Key: '/option/provincial',
		// 		Route: '/option/provincial',
		// 		Text: 'Tỉnh/Tp',
		// 		Icon: '',
		// 	},
		// 	{
		// 		ItemType: 'single',
		// 		Key: '/option/district',
		// 		Route: '/option/district',
		// 		Text: 'Quận huyện',
		// 		Icon: '',
		// 	},
		// 	{
		// 		ItemType: 'single',
		// 		Key: '/option/discount',
		// 		Route: '/option/discount',
		// 		Text: 'Mã khuyến mãi',
		// 		Icon: '',
		// 	},
		// 	{
		// 		ItemType: 'single',
		// 		Key: '/option/customer-supplier',
		// 		Route: '/option/customer-supplier',
		// 		Text: 'Nguồn khách hàng',
		// 		Icon: '',
		// 	},

		// 	{
		// 		ItemType: 'single',
		// 		Key: '/option/jobs',
		// 		Route: '/option/jobs',
		// 		Text: 'Nghề nghiệp',
		// 		Icon: '',
		// 	},
		// 	{
		// 		ItemType: 'single',
		// 		Key: '/option/services',
		// 		Route: '/option/services',
		// 		Text: 'Dịch vụ',
		// 		Icon: '',
		// 	},
		// 	{
		// 		ItemType: 'single',
		// 		Key: '/option/feedback',
		// 		Route: '/option/feedback',
		// 		Text: 'Loại phản hồi',
		// 		Icon: '',
		// 	},
		// 	{
		// 		ItemType: 'single',
		// 		Key: '/option/supplier',
		// 		Route: '/option/supplier',
		// 		Text: 'Nhà cung cấp',
		// 		Icon: '',
		// 	},
		// 	{
		// 		ItemType: 'single',
		// 		Key: '/option/purpose',
		// 		Route: '/option/purpose',
		// 		Text: 'Mục đích học',
		// 		Icon: '',
		// 	},
		// 	{
		// 		ItemType: 'single',
		// 		Key: '/option/staff-salary',
		// 		Route: '/option/staff-salary',
		// 		Text: 'Lương office',
		// 		Icon: '',
		// 	},
		// 	// {
		// 	//   ItemType: "single",
		// 	//   Key: "/option/teacher-salary",
		// 	//   Route: "/option/teacher-salary",
		// 	//   Text: "Lương giáo viên",
		// 	//   Icon: "",
		// 	// },
		// 	{
		// 		ItemType: 'single',
		// 		Key: '/option/exam',
		// 		Route: '/option/exam',
		// 		Text: 'Đợt thi',
		// 		Icon: '',
		// 	},
		// 	{
		// 		ItemType: 'single',
		// 		Key: '/option/post',
		// 		Route: '/option/post',
		// 		Text: 'Kiểm duyệt bài viết',
		// 		Icon: '',
		// 	},
		// 	{
		// 		ItemType: 'single',
		// 		Key: '/option/info-form',
		// 		Route: '/option/info-form',
		// 		Text: 'Form thông tin',
		// 		Icon: '',
		// 	},
		// 	{
		// 		ItemType: 'single',
		// 		Key: '/option/notification',
		// 		Route: '/option/notification',
		// 		Text: 'Tạo thông báo',
		// 		Icon: '',
		// 	},
		// 	{
		// 		ItemType: 'single',
		// 		Key: '/option/idiom',
		// 		Route: '/option/idiom',
		// 		Text: 'Thành ngữ lịch',
		// 		Icon: '',
		// 	},
		// 	{
		// 		ItemType: 'single',
		// 		Key: '/option/contract',
		// 		Route: '/option/contract',
		// 		Text: 'Hợp đồng',
		// 		Icon: '',
		// 	},
		// 	{
		// 		ItemType: 'single',
		// 		Key: '/option/term-of-service',
		// 		Route: '/option/term-of-service',
		// 		Text: 'Điều khoản',
		// 		Icon: '',
		// 	},
		// ],
	}
	// {
	//   MenuName: "tab-layout",
	//   MenuTitle: "Giao diện",
	//   MenuKey: "/layoutBase",
	//   MenuItem: [
	//     {
	//       ItemType: "sub-menu",
	//       Key: "sublayout",
	//       Icon: "",
	//       TitleSub: "Layout",
	//       SubMenuList: [
	//         {
	//           ItemType: "single",
	//           Key: "/layoutBase/layoutTables",
	//           Route: "/layoutBase/layoutTables",
	//           Text: "Tables",
	//           Icon: "",
	//         },
	//         {
	//           ItemType: "single",
	//           Key: "/layoutBase/layoutButtons",
	//           Route: "/layoutBase/layoutButtons",
	//           Text: "Buttons",
	//           Icon: "",
	//         },
	//         {
	//           ItemType: "single",
	//           Key: "/layoutBase/layoutForms",
	//           Route: "/layoutBase/layoutForms",
	//           Text: "Forms",
	//           Icon: "",
	//         },
	//         {
	//           ItemType: "single",
	//           Key: "/layoutBase/layoutCharts",
	//           Route: "/layoutBase/layoutCharts",
	//           Text: "Charts",
	//           Icon: "",
	//         },
	//         {
	//           ItemType: "single",
	//           Key: "/layoutBase/layoutTags",
	//           Route: "/layoutBase/layoutTags",
	//           Text: "Tags",
	//           Icon: "",
	//         },
	//       ],
	//     },
	//   ],
	// },
];
