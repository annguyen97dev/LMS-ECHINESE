import { yupResolver } from '@hookform/resolvers/yup';
import { Popover, Spin } from 'antd';
import Form from 'antd/lib/form/Form';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import SelectField from '~/components/FormControl/SelectField';
import { optionCommonPropTypes } from '~/utils/proptypes';

const AvailableScheduleOnlineForm = (props) => {
	const { isLoading, handleGetAvailableSchedule, optionListForGetAvailableSchedule } = props;
	const [showForm, setShowForm] = useState(false);
	const funcShowFilter = () => {
		showForm ? setShowForm(false) : setShowForm(true);
	};
	const schema = yup.object().shape({
		StudyTimeID: yup.array().min(1, 'Bạn phải chọn ít nhất 1 ca học').required('Bạn không được để trống')
	});

	const defaultValuesInit = {
		StudyTimeID: undefined
	};

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	const checkHandleGetAvailableSchedule = (data) => {
		if (!handleGetAvailableSchedule) return;
		handleGetAvailableSchedule(data).then((res) => {
			if (res) {
				funcShowFilter();
			}
		});
	};

	useEffect(() => {
		const { studyTimes } = optionListForGetAvailableSchedule;
		if (studyTimes.length) {
			const studyTimesSelected = studyTimes.filter((r) => r.options.select).map((r) => r.value);
			form.reset({
				StudyTimeID: studyTimesSelected
			});
		}
	}, [optionListForGetAvailableSchedule]);

	const content = (
		<div className="available-schedule-course-form">
			<Form layout="vertical" onFinish={form.handleSubmit(checkHandleGetAvailableSchedule)}>
				<div className="row">
					<div className="col-12">
						<SelectField
							form={form}
							name="StudyTimeID"
							optionList={optionListForGetAvailableSchedule.studyTimes}
							mode="multiple"
							label="Ca học"
							isLoading={isLoading.type === 'FETCH_COURSE' && isLoading.status}
							isRequired
						/>
					</div>
					<div className="col-12 mt-1">
						<button type="submit" className="btn btn-primary" disabled={isLoading.type == 'FETCH_SCHEDULE' && isLoading.status}>
							Gửi
							{isLoading.type == 'FETCH_SCHEDULE' && isLoading.status && <Spin className="loading-base" />}
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
			<button className="btn btn-primary">Tải lịch học</button>
		</Popover>
	);
};

AvailableScheduleOnlineForm.propTypes = {
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	handleGetAvailableSchedule: PropTypes.func,
	optionListForGetAvailableSchedule: PropTypes.shape({
		studyTimes: optionCommonPropTypes
	})
};
AvailableScheduleOnlineForm.defaultProps = {
	isLoading: { type: '', status: false },
	handleGetAvailableSchedule: null,
	optionListForGetAvailableSchedule: {
		studyTimes: []
	}
};
export default AvailableScheduleOnlineForm;
