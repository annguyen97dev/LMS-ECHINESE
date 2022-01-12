//@ts-nocheck
import React, { useEffect, useState } from 'react';
import NestedTable from '~/components/Elements/NestedTable';
import { useWrap } from '~/context/wrap';
import { examAppointmentResultApi } from '~/apiBase';
import { homeworkResultApi } from '~/apiBase/course-detail/home-work-result';

const ExamAppointmentPoint = (props) => {
	const { infoID, userID, isExercise, visible } = props;
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [detail, setDetail] = useState<IExamAppointmentResult>([]);
	const { showNoti, userInformation } = useWrap();
	const [isDone, setIsDone] = useState(false);

	const fetchDetailInfo = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await examAppointmentResultApi.getAll({
				selectAll: true,
				UserInformationID: userID,
				ExamAppointmentID: infoID
			});
			if (res.status == 200) {
				setIsDone(res.data.data[0].isDone);
				let arr = [];
				arr.push(res.data.data[0]);
				setDetail(arr);
			}
		} catch (err) {
			showNoti('danger', err.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	const fetchDetailExercise = async () => {
		if (visible == true) {
			setIsLoading({
				type: 'GET_ALL',
				status: true
			});
			try {
				let res = await homeworkResultApi.getAll({
					selectAll: true,
					UserInformationID: userID,
					HomeworkID: infoID
				});
				if (res.status == 200) {
					setIsDone(res.data.data[0].isDone);
					let arr = [];
					arr.push(res.data.data[0]);
					setDetail(arr);
				}
			} catch (err) {
				showNoti('danger', err.message);
			} finally {
				setIsLoading({
					type: 'GET_ALL',
					status: false
				});
			}
		}
	};

	useEffect(() => {
		isExercise ? fetchDetailExercise() : fetchDetailInfo();
	}, []);

	const columns = [
		{
			title: 'Tổng câu hỏi',
			dataIndex: 'NumberExercise',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Điểm từng môn',
			align: 'center',
			children: [
				{
					title: 'Nghe',
					align: 'center',
					dataIndex: 'ListeningPoint'
				},
				{
					title: 'Nói',
					align: 'center',
					dataIndex: 'SpeakingPoint'
				},
				{
					title: 'Đọc',
					align: 'center',
					dataIndex: 'ReadingPoint'
				},
				{
					title: 'Viết',
					align: 'center',
					dataIndex: 'WritingPoint'
				}
			]
		},
		{
			title: 'Tổng điểm',
			align: 'center',
			dataIndex: 'PointTotal',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Ghi chú',
			dataIndex: 'Note'
		}
	];

	return (
		<>
			{(isDone || userInformation?.RoleID == 1 || userInformation?.RoleID == 2) && (
				<NestedTable
					loading={isLoading}
					addClass="basic-header"
					dataSource={detail[0]?.isDone ? detail : {}}
					columns={columns}
					haveBorder={true}
				/>
			)}
		</>
	);
};

export default ExamAppointmentPoint;
