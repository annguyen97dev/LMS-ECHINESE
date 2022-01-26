import React, { useState } from 'react';
import TitlePage from '~/components/TitlePage';
import LayoutBase from '~/components/LayoutBase';
import dynamic from 'next/dynamic';
import { Waypoint } from 'react-waypoint';
import { Skeleton } from 'antd';

const DynamicStatisticalRate = dynamic(() => import('~/components/Dashboard/StatisticalRate'));
const DynamicStatisticalTotal = dynamic(() => import('~/components/Dashboard/StatisticalTotal'));
const DynamicStatisticalCourse = dynamic(() => import('~/components/Dashboard/StatisticalCourse'));
const DynamicStatisticalRevenue = dynamic(() => import('~/components/Dashboard/RevenueChart'));
const DynamicStatisticalAcademic = dynamic(() => import('~/components/Dashboard/AcademicChart'));
const DynamicStatisticalRankTeacher = dynamic(() => import('~/components/Dashboard/StatisticalRankTeacher'));
const DynamicStatisticalJobOfStudent = dynamic(() => import('~/components/Dashboard/StatisticalJobOfStudent'));
const DynamicStatisticalSalaryOfStaff = dynamic(() => import('~/components/Dashboard/StatisticalSalaryOfStaff'));
const DynamicStatisticalCoursePurchases = dynamic(() => import('~/components/Dashboard/StatisticalCoursePurchases'));
const DynamicStatisticalRateVideoCourse = dynamic(() => import('~/components/Dashboard/StatisticalRateVideoCourse'));
const DynamicStatisticalAverageAgeOfStudent = dynamic(() => import('~/components/Dashboard/StatisticalAverageAgeOfStudent'));
const DynamicStatisticalTotalLessonOfTeacher = dynamic(() => import('~/components/Dashboard/StatisticalTable'));
const DynamicStatisticalPercentOfStudentByArea = dynamic(() => import('~/components/Dashboard/StatisticalPercentOfStudentByArea'));
const DynamicStatisticalPercentOfStudentBySource = dynamic(() => import('~/components/Dashboard/StatisticalPercentOfStudentBySource'));

const Dashboard = () => {
	const [countItem, setCountItem] = useState(0);
	const [isOverList, setIsOverList] = useState(false);
	let loadList = [
		<DynamicStatisticalCourse />,
		<DynamicStatisticalAverageAgeOfStudent />,
		<DynamicStatisticalPercentOfStudentByArea />,
		<DynamicStatisticalPercentOfStudentBySource />,
		<DynamicStatisticalCoursePurchases />,
		<DynamicStatisticalJobOfStudent />,
		<DynamicStatisticalSalaryOfStaff />,
		<DynamicStatisticalTotalLessonOfTeacher />,
		<DynamicStatisticalRankTeacher />
	];
	const loadMore = () => {
		setCountItem((preState) => (preState += 2));
		if (countItem > loadList.length - 2) {
			setIsOverList(true);
		}
	};
	const renderLoadMore = () => {
		return loadList.map((item, index) => {
			if (index <= countItem) {
				return item;
			} else if (index > countItem) return;
		});
	};

	return (
		<div>
			<TitlePage title="Dashboard" />
			<DynamicStatisticalTotal />

			<DynamicStatisticalRevenue />

			<div className="mt-5">
				<DynamicStatisticalAcademic />
			</div>

			<div className="row mt-5">
				<DynamicStatisticalRate />
				<DynamicStatisticalRateVideoCourse />
			</div>

			{renderLoadMore()}

			{!isOverList && (
				<Waypoint onEnter={loadMore}>
					<ul className="list-nf skeleton mt-5">
						<li className="item-nf">
							<div className="newsfeed">
								<Skeleton avatar paragraph={{ rows: 0 }} active />
								<Skeleton active paragraph={{ rows: 2 }} />
							</div>
						</li>
					</ul>
				</Waypoint>
			)}
		</div>
	);
};

Dashboard.layout = LayoutBase;

export default Dashboard;
