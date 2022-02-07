import React from 'react';
import { Home } from 'react-feather';

export const ParentsParentMenu = [
	{
		TabName: 'tab-home',
		Icon: <Home />
	}
];

export const ParentsChildMenu = [
	{
		MenuName: 'tab-home',
		MenuTitle: 'Trang chủ',
		MenuKey: '/parents',
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
				Key: '/parents/course-of-student',
				Route: '/parents/course-of-student',
				Icon: '',
				Text: 'Các khóa học'
			},
			{
				TypeItem: 'single',
				Key: '/parents/course-of-student-price',
				Route: '/parents/course-of-student-price',
				Icon: '',
				Text: 'Công nợ'
			},
			{
				TypeItem: 'single',
				Key: '/parents/schedule-of-student',
				Route: '/parents/schedule-of-student',
				Icon: '',
				Text: 'Lịch học'
			},
			{
				TypeItem: 'single',
				Key: '/parents/score-of-student',
				Route: '/parents/score-of-student',
				Icon: '',
				Text: 'Xem điểm'
			},
			{
				TypeItem: 'single',
				Key: '/parents/roll-up-student',
				Route: '/parents/roll-up-student',
				Icon: '',
				Text: 'Chi tiết điểm danh'
			}
		]
	}
];
