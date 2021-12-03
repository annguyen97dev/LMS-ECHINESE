import { Descriptions, Modal, Tooltip, List, Card } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { comingCourseApi } from '~/apiBase';

const InComingClassBtn = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isOpenModal, setIsOpenModal] = useState(false);
	const [course, setCourse] = useState<IComingCourse[]>([]);

	const onOpen = () => {
		setIsOpenModal(true);
	};
	const onClose = () => {
		setIsOpenModal(false);
	};

	const getComingCourse = async () => {
		try {
			setIsLoading(true);
			const res = await comingCourseApi.getAll();
			if (res.status === 200) {
				setCourse([res.data.data]);
			}
		} catch (error) {
			console.log('getComingCourse', error.message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (isOpenModal) {
			getComingCourse();
		}
	}, [isOpenModal]);

	return (
		<>
			<Tooltip title="Ca học gần nhất" placement="left">
				<div className="in-coming-class-btn" onClick={onOpen}>
					<img src="/images/icons/study-course.svg" />
				</div>
			</Tooltip>
			<Modal title="Ca học sắp diễn ra" visible={isOpenModal} footer={null} onCancel={onClose}>
				<List
					pagination={false}
					loading={isLoading}
					dataSource={course}
					grid={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
					renderItem={(item: IComingCourse, idx) => (
						<List.Item>
							<p>
								<span className="font-weight-bold">Môn học:</span> {item.SubjectName}
							</p>
							<p>
								<span className="font-weight-bold">Giáo viên:</span> {item.TeacherName}
							</p>
							<p>
								<span className="font-weight-bold">Ngày:</span> {moment(item.Date).format('DD/MM/YYYY')}
							</p>
							<p>
								<span className="font-weight-bold">Ca học:</span> {item.StudyTimeName}
							</p>
							<p>
								<span className="font-weight-bold">Khóa học:</span> {item.CourseName}
							</p>
							<div className="text-right">
								<button
									disabled={!item.isHappenning}
									className="btn btn-secondary"
									onClick={() => {
										window.open(`/course/zoom-view/${item.ID}`);
									}}
								>
									Tham gia lớp học
								</button>
							</div>
						</List.Item>
					)}
				/>
			</Modal>
		</>
	);
};

export default InComingClassBtn;
