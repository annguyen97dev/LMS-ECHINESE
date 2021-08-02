import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Modal from 'antd/lib/modal/Modal';
import ScheduleList from '../Schedule/ScheduleList';
import ScheduleItem from '../Schedule/ScheduleItem';
import moment from 'moment';

const CreateCourseModal = (props) => {
	const [isVisible, setIsVisible] = useState(false);

	const openModal = () => setIsVisible(() => true);
	const closeModal = () => setIsVisible(false);
	const {resource} = props;
	const {dateString, limit, scheduleList, valid} = resource;
	const scheduleInDay = scheduleList.length;
	const dateFm = moment(dateString).format('DD/MM/YYYY');
	console.log(resource);
	return (
		<Modal
			title={`Chi tiết ngày ${dateFm}`}
			visible={isVisible}
			footer={null}
			onCancel={closeModal}
		>
			<div>
				<p style={{marginBottom: '5px'}}>
					<strong>Thông tin cơ bản: </strong>
				</p>
				<div className="row">
					<div className="col-12 col-md-4">
						<p>
							Tổng số ca: <strong>{limit}</strong>
						</p>
					</div>
					<div className="col-12 col-md-4">
						<p>
							Số ca đã sắp xếp: <strong>{scheduleInDay}</strong>
						</p>
					</div>
					<div className="col-12 col-md-4">
						<p>
							Số ca còn lại: <strong>{limit - scheduleInDay}</strong>
						</p>
					</div>
				</div>
				<div>
					<p style={{marginBottom: '5px'}}>
						<strong>Chi tiết các buổi học trong ngày: </strong>
					</p>
					<div className="wrap-card-info-course">
						<div className="info-course">
							{
								<ScheduleList>
									{scheduleList.map((s, idx) => (
										<ScheduleItem key={idx} scheduleObj={s} />
									))}
								</ScheduleList>
							}
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};

CreateCourseModal.propTypes = {};

export default CreateCourseModal;
