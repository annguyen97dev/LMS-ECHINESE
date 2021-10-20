import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { examAppointmentResultApi } from '~/apiBase';
import ExpandTable from '~/components/ExpandTable';
import { useWrap } from '~/context/wrap';

InfoTestCard.propTypes = {
	studentID: PropTypes.number
};
InfoTestCard.defaultProps = {
	studentID: 0
};
function InfoTestCard(props) {
	const { studentID } = props;
	const { showNoti } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: null,
		status: false
	});
	const [exam, setExam] = useState<IExamAppointmentResult[]>(null);

	const getExamAppointmentResult = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true
			});
			const res = await examAppointmentResultApi.getAll({
				UserInformationID: studentID
			});
			if (res.status === 200) {
				setExam(res.data.data);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	useEffect(() => {
		getExamAppointmentResult();
	}, []);

	const columns = [
		{
			title: 'Ngày kiểm tra',
			dataIndex: 'CreatedOn',
			render: (date) => <p className="font-weight-black">{moment(date).format('DD/MM/YYYY')}</p>
		},
		{ title: 'Tên đề', dataIndex: 'ExamTopicName' },
		{ title: 'Nghe', dataIndex: 'ListeningPoint' },
		{ title: 'Nói', dataIndex: 'SpeakingPoint' },
		{ title: 'Đọc', dataIndex: 'ReadingPoint' },
		{ title: 'Viết', dataIndex: 'WritingPoint' },
		{
			title: 'Trạng thái',
			dataIndex: 'StatusName',
			render: (statusName) => <p className="font-weight-black">{statusName}</p>
		}
	];

	const expandedRowRender = (exam: IExamAppointmentResult) => {
		return (
			<table className="tb-expand">
				<tbody>
					<tr>
						<td>
							<p className="font-weight-black">Giáo viên kiểm tra</p>
						</td>
						<td>{exam.TeacherName}</td>
					</tr>
					<tr>
						<td>
							<p className="font-weight-black"> Tư vấn viên</p>
						</td>
						<td>{exam.CounselorsName}</td>
					</tr>
					<tr>
						<td>
							<p className="font-weight-black">Ghi chú</p>
						</td>
						<td>{exam.Note}</td>
					</tr>
				</tbody>
			</table>
		);
	};

	return (
		<>
			<ExpandTable
				loading={isLoading}
				dataSource={exam}
				columns={columns}
				addClass="basic-header"
				expandable={{ expandedRowRender }}
			/>
		</>
	);
}
export default InfoTestCard;
