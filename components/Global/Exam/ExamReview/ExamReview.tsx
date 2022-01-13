import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Button, Card, Divider } from 'antd';
import { examTopicApi } from '~/apiBase';
import Link from 'next/link';
import ControlVolume from '~/components/Elements/ControlVolume';
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
ExamReview.propTypes = {};

function ExamReview() {
	const route = useRouter();
	const { examID: ID, isExercise: isExercise } = route.query;
	const { packageDetailID: packageDetailID, type: type, CurriculumDetailID: CurriculumDetailID } = route.query;
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

	const SoundTest = () => {
		const [isPlaying, setIsPlaying] = useState(false);
		const audio = useRef(null);

		const playSound = () => {
			if (!isPlaying) {
				audio.current.play();
				setIsPlaying(true);
			} else {
				audio.current.pause();
				setIsPlaying(false);
			}
		};

		const controlVolume = (value) => {
			let customValue = value / 100;
			audio.current.volume = customValue;
		};

		return (
			<div className="sound-test doing-test-box">
				<Divider orientation="center">Kiểm tra âm thanh</Divider>
				<div className="sound-img">
					<img src="/images/headphone-icon.jpg" alt="" />
				</div>
				<div className="sound-test-content position-relative">
					<p>Đeo tai nghe và bấm vào nút bên dưới để kiểm tra âm thanh.</p>
					<div className="position-absolute" style={{ opacity: 0 }}>
						<audio controls ref={audio} onEnded={() => setIsPlaying(false)}>
							<source
								src="https://s3-eu-west-1.amazonaws.com/oep2stt/sample-listening-multiple-choice-one-answer/sample-audio.ogg"
								type="audio/mpeg"
							/>
						</audio>
					</div>
					<div className="w-100 d-flex justify-content-center">
						<ControlVolume getValueControl={(value) => controlVolume(value)} />
					</div>
					<Button onClick={playSound} icon={!isPlaying ? <CaretRightOutlined /> : <PauseOutlined />}>
						Nghe thử
					</Button>
				</div>
			</div>
		);
	};

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
				<Card.Grid className="exam-review-item span-3" hoverable={false}>
					<SoundTest />
				</Card.Grid>
				<Link
					href={{
						pathname: '/doing-test',
						query:
							type !== 'check'
								? { examID: ID, packageDetailID: packageDetailID, type: type, isExercise: isExercise }
								: { examID: ID, packageDetailID: packageDetailID, type: type, CurriculumDetailID: CurriculumDetailID }
					}}
				>
					<a className="exam-review-btn btn btn-primary">Bắt đầu thi</a>
				</Link>
			</Card>
		</div>
	);
}

export default ExamReview;
