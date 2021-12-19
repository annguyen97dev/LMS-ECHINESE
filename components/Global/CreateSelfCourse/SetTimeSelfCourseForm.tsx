import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Popover, Spin, TimePicker } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Clock } from 'react-feather';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const SetTimeSelfCourseForm = (props) => {
	const { isLoading, rangeTimeObj, handleSetRangeTime } = props;
	const [showForm, setShowForm] = useState(false);
	const funcShowFilter = () => {
		showForm ? setShowForm(false) : setShowForm(true);
	};
	const schema = yup.object().shape({
		RangeTime: yup.array().of(yup.string()).min(2, 'Bạn không được để trống')
	});

	const defaultValuesInit = {
		RangeTime: []
	};

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	const checkHandleSetRangeTime = (data: { RangeTime: Array<any> }) => {
		if (!handleSetRangeTime) return;
		const { RangeTime } = data;
		const fmData: ISCTime = {
			TimeStart: moment(RangeTime[0]).format('YYYY/MM/DD HH:mm').split(' ')[1],
			TimeEnd: moment(RangeTime[1]).format('YYYY/MM/DD HH:mm').split(' ')[1]
		};
		handleSetRangeTime(fmData).then((res) => {
			if (res) {
				funcShowFilter();
			}
		});
	};

	useEffect(() => {
		if (!rangeTimeObj || !showForm) return;
		const { TimeStart, TimeEnd } = rangeTimeObj;
		form.setValue('RangeTime', [moment(TimeStart, 'HH:mm'), moment(TimeEnd, 'HH:mm')]);
	}, [showForm]);

	const content = (
		<div className="available-schedule-course-form">
			<Form layout="vertical" onFinish={form.handleSubmit(checkHandleSetRangeTime)}>
				<div className="row">
					<div className="col-12">
						<Form.Item label="Khung giờ đặt lịch học" required>
							<TimePicker.RangePicker
								{...form.register('RangeTime')}
								showSecond={false}
								className="style-input"
								placeholder={['Giờ bắt đầu', 'Kết thúc']}
								defaultValue={[moment(rangeTimeObj?.TimeStart, 'HH:mm'), moment(rangeTimeObj?.TimeEnd, 'HH:mm')]}
								format="HH:mm"
								onChange={(date, dateString) => {
									const vl = [date[0]?.format('YYYY/MM/DD HH:mm'), date[1]?.format('YYYY/MM/DD HH:mm')];
									form.setValue('RangeTime', vl);
									return vl;
								}}
							/>
						</Form.Item>
					</div>
					<div className="col-12">
						<button type="submit" className="btn btn-primary" disabled={isLoading.type == 'SUBMIT_TIME' && isLoading.status}>
							Nhập
							{isLoading.type == 'SUBMIT_TIME' && isLoading.status && <Spin className="loading-base" />}
						</button>
					</div>
				</div>
			</Form>
		</div>
	);
	return (
		<Popover
			placement="bottomRight"
			content={content}
			trigger="click"
			visible={showForm}
			onVisibleChange={funcShowFilter}
			overlayClassName="filter-popover"
		>
			<button className="btn btn-secondary light btn-filter">
				<Clock />
			</button>
		</Popover>
	);
};

SetTimeSelfCourseForm.propTypes = {
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	handleSetRangeTime: PropTypes.func,
	rangeTimeObj: PropTypes.shape({
		TimeStart: PropTypes.string,
		TimeEnd: PropTypes.string
	})
};
SetTimeSelfCourseForm.defaultProps = {
	isLoading: { type: '', status: false },
	handleSetRangeTime: null,
	rangeTimeObj: {
		TimeStart: '',
		TimeEnd: ''
	}
};
export default SetTimeSelfCourseForm;
