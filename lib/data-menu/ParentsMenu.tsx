import React from 'react';
import { Airplay, FileText, Home, User, UserCheck } from 'react-feather';

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
				Text: 'Newsfeed'
			},
			{
				TypeItem: 'single',
				Key: '/parents',
				Route: '/parents/course-of-student',
				Icon: '',
				Text: 'Các khóa học'
			},
			{
				TypeItem: 'single',
				Key: '/parents',
				Route: '/parents/course-of-student-price',
				Icon: '',
				Text: 'Công nợ'
			},
			{
				TypeItem: 'single',
				Key: '/parents',
				Route: '/parents/schedule-of-student',
				Icon: '',
				Text: 'Lịch học'
			},
			{
				TypeItem: 'single',
				Key: '/parents',
				Route: '/parents/score-of-student',
				Icon: '',
				Text: 'Xem điểm'
			}
		]
	}
];
