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
				Route: '/parents',
				Icon: '',
				Text: 'Phụ huynh'
			}
		]
	}
];
