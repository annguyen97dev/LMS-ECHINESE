import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Card } from 'antd';
import { examTopicApi } from '~/apiBase';
import Link from 'next/link';
ExamReview.propTypes = {};

function ExamReview() {
	const route = useRouter();
	const { examID: ID } = route.query;
	const { packageDetailID: packageDetailID, type: type } = route.query;
	const [examInfo, setExamInfo] = useState<IExamTopic>(null);
	const fetchExam = async () => {
		try {
			const res = await examTopicApi.getByID(ID);
			if (res.status === 200) {
				setExamInfo(res.data.data);
			}
		} catch (error) {
			console.log('fetchExam', error);
		}
	};
	useEffect(() => {
		fetchExam();
	}, []);
	return (
		<div className="exam-review">
			<Card title={`${examInfo?.Code || '...'} - ${examInfo?.Name || '...'}`}>
				<Card.Grid className="exam-review-item span-1" hoverable={false}>
					<p className="title">Giáo trình</p>
					<p className="desc">{examInfo?.CurriculumName || '...'}</p>
				</Card.Grid>
				<Card.Grid className="exam-review-item span-1" hoverable={false}>
					<p className="title">Thời gian làm bài</p>
					<p className="desc">{examInfo?.Time >= 0 ? examInfo?.Time : '...'} phút</p>
				</Card.Grid>
				<Card.Grid className="exam-review-item span-2" hoverable={false}>
					<p className="title">Số câu dễ</p>
					<p className="desc">{examInfo?.EasyExercise >= 0 ? examInfo?.EasyExercise : '...'}</p>
				</Card.Grid>
				<Card.Grid className="exam-review-item span-2" hoverable={false}>
					<p className="title">
						Số câu
						{window.matchMedia('(max-width: 767px)').matches ? ' TB' : ' trung bình'}
					</p>
					<p className="desc">{examInfo?.NormalExercise >= 0 ? examInfo?.NormalExercise : '...'}</p>
				</Card.Grid>
				<Card.Grid className="exam-review-item span-2" hoverable={false}>
					<p className="title">Số câu khó</p>
					<p className="desc">{examInfo?.DifficultExercise >= 0 ? examInfo?.DifficultExercise : '...'}</p>
				</Card.Grid>
				<Card.Grid className="exam-review-item span-3" hoverable={false}>
					<p className="title">Hướng dẫn làm bài</p>
					<p className="desc">{examInfo?.Description || '...'}</p>
				</Card.Grid>
				<Link
					href={{
						pathname: '/doing-test',
						query: { examID: ID, packageDetailID: packageDetailID, type: type }
					}}
				>
					<a className="exam-review-btn btn btn-primary">Bắt đầu thi</a>
				</Link>
			</Card>
		</div>
	);
}

export default ExamReview;
