import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import Link from 'next/link';

const RegCourseBtn = () => {
	return (
		<>
			<button className="btn btn-icon edit">
				<Tooltip title="Ca học gần nhất" placement="left">
					<Link href={'/course/register-course/'}>
						<div>
							<img src="/images/icons/study-course.svg" />
						</div>
					</Link>
				</Tooltip>
			</button>
		</>
	);
};

export default RegCourseBtn;
