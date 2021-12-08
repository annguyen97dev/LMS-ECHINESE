import React, { useEffect, useState } from 'react';
import { Tooltip, Menu, Dropdown } from 'antd';
import Link from 'next/link';
import { EditOutlined } from '@ant-design/icons';

const RegCourseBtn = () => {
	const menu = () => {
		return (
			<div style={{ backgroundColor: '#ccc', boxShadow: '1px 2px 12px #00000038' }}>
				<Menu>
					<Menu.Item>
						<Link href={'/course/register-course/'}>
							<a>Đăng ký khóa học</a>
						</Link>
					</Menu.Item>
					<Menu.Item>
						<Link href={'/course/create-course-online/'}>
							<a>Tạo khóa học</a>
						</Link>
					</Menu.Item>
					<Menu.Item>
						<Link href={'/course/register-course/'}>
							<a>Tạo khách hàng</a>
						</Link>
					</Menu.Item>
				</Menu>
			</div>
		);
	};
	return (
		<Dropdown overlay={menu} placement="bottomLeft">
			<div
				style={{
					position: 'fixed',
					right: 20,
					bottom: 80,
					zIndex: 2900,
					width: 45,
					height: 45,
					borderRadius: '100%',
					cursor: 'pointer',
					backgroundColor: '#dd4667',
					boxShadow: '1px 2px 12px #00000038'
				}}
			>
				<EditOutlined style={{ fontSize: 20, textAlign: 'center', paddingLeft: 10, paddingTop: 10, color: '#fff' }} />
			</div>
		</Dropdown>
	);
};

export default RegCourseBtn;
