import React, { useEffect, useState } from 'react';
import { Modal, Select, Tooltip, DatePicker, Input } from 'antd';
import { useWrap } from '~/context/wrap';
import { homeworkApi } from '~/apiBase/course-detail/home-work';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ModalCreateExercise = (props) => {
	const { dataExam, courseID, CurriculumID, onFetchData } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const { showNoti } = useWrap();
	const [valueExam, setValueExam] = useState(null);
	const [note, setNote] = useState('');
	const [date, setDate] = useState({ start: '', end: '' });

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = async () => {
		const data = {
			CourseID: courseID,
			ExamTopicID: valueExam,
			CurriculumDetailID: CurriculumID,
			DateStart: date.start,
			DateEnd: date.end,
			Note: note
		};
		console.log('submit: ', data);

		setLoading(true);
		try {
			let res = await homeworkApi.add(data);
			if (res.status === 200) {
				setIsModalVisible(false);
				onFetchData && onFetchData();
				showNoti('success', 'Thành công');
				onFetchData();
			} else {
				showNoti('danger', 'Mạng đang kết nối không ổn định');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	function handleChange_exam(value) {
		setValueExam(value);
	}

	return (
		<>
			<Tooltip title="Thêm bài tập">
				<button className="btn btn-light" onClick={showModal}>
					Tạo bài tập
				</button>
			</Tooltip>

			<Modal
				title="Tạo bài tập cho khóa học"
				visible={isModalVisible}
				onOk={handleOk}
				confirmLoading={loading}
				okText="Thêm"
				onCancel={handleCancel}
			>
				<div className="wrap-create-exercise">
					<h6>Chọn đề</h6>
					<Select value={valueExam} className="style-input" onChange={handleChange_exam}>
						{dataExam?.map((item, index) => (
							<Option value={item.ID} key={index}>
								{item.Name}
							</Option>
						))}
					</Select>

					<h6 className="mt-3">Thời gian</h6>
					<RangePicker
						onChange={(e) => {
							console.log(moment(e[0]).format('DD/MM/yyyy'));
							setDate({ end: moment(e[1]).format('yyyy/MM/DD'), start: moment(e[0]).format('yyyy/MM/DD') });
						}}
					/>

					<h6 className="mt-3">Ghi chú</h6>
					<Input style={{ marginBottom: 0 }} placeholder="Ghi chú" onChange={(e) => setNote(e.target.value)} allowClear={false} />
				</div>
			</Modal>
		</>
	);
};

export default ModalCreateExercise;
