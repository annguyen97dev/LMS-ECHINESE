import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import Link from 'next/link';
import { EditOutlined } from '@ant-design/icons';

const RegCourseBtn = () => {
	return (
		<div style={{ position: 'fixed', right: 20, bottom: 80, zIndex: 900 }}>
			<Link href={'/course/register-course/'}>
				<Tooltip title="Đăng ký khóa học" placement="left">
					<div
						className="f-flex justify-content-center align-items-center"
						style={{
							width: 45,
							height: 45,
							borderRadius: '100%',
							cursor: 'pointer',
							backgroundColor: '#ccc',
							boxShadow: '1px 2px 12px #00000038'
						}}
					>
						<EditOutlined style={{ fontSize: 20, textAlign: 'center', paddingLeft: 10, paddingTop: 10 }} />
					</div>
				</Tooltip>
			</Link>
		</div>
	);
};

export default RegCourseBtn;
