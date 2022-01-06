import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Card, List } from 'antd';
import { examTopicApi } from '~/apiBase';
import Link from 'next/link';
import { courseSchedulesApi } from '~/apiBase/course/course-schedules';
import moment from 'moment';

const RenderItem = (props: any) => {
	const { item, data } = props;

	const getTime = (date: any) => {
		return moment(date).format('hh:mm');
	};

	const getStrDate = (date: any) => {
		return moment(date).format('DD/MM');
	};

	return (
		<div style={{ marginBottom: 10, flexDirection: 'column', display: 'flex', alignItems: 'center' }}>
			<div
				style={{
					width: 60,
					height: 60,
					margin: 10,
					background: '#dd4667',
					borderRadius: 999,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<span style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{data.indexOf(item) + 1}</span>
			</div>
			<span style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>{getStrDate(item.StartTime)}</span>
			<span style={{ color: '#000', fontSize: 16 }}>{getTime(item.StartTime) + ' - ' + getTime(item.EndTime)}</span>
		</div>
	);
};

const Lessions = (props) => {
	const { courseID } = props;
	const [lessons, setLessions] = useState([]);

	const fetchExam = async () => {
		try {
			const res = await courseSchedulesApi.getByID(courseID);
			if (res.status === 200) {
				setLessions(res.data.data);
			}
		} catch (error) {
			console.log('fetchExam', error);
		}
	};

	useEffect(() => {
		fetchExam();
	}, []);

	return (
		<div>
			<Card>
				<List
					itemLayout="horizontal"
					dataSource={lessons}
					grid={{ gutter: 16, xs: 2, sm: 2, md: 3, lg: 4, xl: 6, xxl: 6 }}
					renderItem={(item) => <RenderItem item={item} data={lessons} />}
				/>
			</Card>
		</div>
	);
};

export default Lessions;
