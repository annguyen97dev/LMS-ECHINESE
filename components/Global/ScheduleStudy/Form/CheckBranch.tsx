import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Popover, Spin } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import DateField from '~/components/FormControl/DateField';
import SelectField from '~/components/FormControl/SelectField';
import { optionCommonPropTypes } from '~/utils/proptypes';

CheckBranch.propTypes = {
	optionList: PropTypes.shape({
		branchList: optionCommonPropTypes,
		studyTimeList: optionCommonPropTypes,
		roomList: optionCommonPropTypes,
		teacherList: optionCommonPropTypes
	}),
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	handleSubmit: PropTypes.func
};
CheckBranch.defaultProps = {
	optionList: {
		branchList: [],
		studyTimeList: [],
		roomList: [],
		teacherList: []
	},
	isLoading: { type: '', status: false },
	//
	handleSubmit: null
};
function CheckBranch(props) {
	const { isLoading, optionList, handleSubmit } = props;
	const { branchList } = optionList;
	const [showFilter, showFilterSet] = useState(false);

	const funcShowFilter = () => {
		showFilter ? showFilterSet(false) : showFilterSet(true);
	};

	const schema = yup.object().shape({
		BranchID: yup.number().nullable().required('Bạn không được để trống'),
		StartTime: yup.date().required('Bạn không được để trống'),
		EndTime: yup
			.date()
			.required('Bạn không được để trống')
			.when('StartTime', (startDate, schema) => startDate && schema.min(startDate, `Ngày không hợp lệ`))
	});

	const defaultValuesInit = {
		BranchID: null,
		StartTime: moment().format('YYYY/MM/DD'),
		EndTime: moment().add(1, 'months').format('YYYY/MM/DD')
	};

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	const checkHandleSubmit = (value) => {
		if (!handleSubmit) return;
		handleSubmit(value).then((res) => {
			if (res && res.status === 200) {
				funcShowFilter();
				// form.reset({...defaultValuesInit});
			}
		});
	};
	const handleResetFilter = () => {
		form.reset({
			BranchID: null,
			StartTime: undefined,
			EndTime: undefined
		});
	};

	const content = (
		<div className={`wrap-filter small`}>
			<Form layout="vertical" onFinish={form.handleSubmit(checkHandleSubmit)}>
				<div className="row">
					<div className="col-md-12">
						<SelectField
							form={form}
							name="BranchID"
							label="Trung tâm"
							optionList={branchList}
							placeholder="Chọn trung tâm"
							isLoading={isLoading.type === 'FETCH_DATA' && isLoading.status}
							isRequired
						/>
					</div>
					<div className="col-md-6">
						<DateField form={form} name="StartTime" label="Từ ngày" placeholder="Chọn ngày" isRequired />
					</div>

					<div className="col-md-6">
						<DateField form={form} name="EndTime" label="Đến ngày" placeholder="Chọn ngày" isRequired />
					</div>

					<div className="col-md-12 mt-3">
						<button type="submit" className="btn btn-primary " disabled={isLoading.type == 'ADD_DATA' && isLoading.status}>
							Kiểm tra
							{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
						</button>
						<button
							type="button"
							className="light btn btn-secondary"
							style={{ marginLeft: '10px' }}
							onClick={handleResetFilter}
						>
							Reset
						</button>
					</div>
				</div>
			</Form>
		</div>
	);

	return (
		<>
			<div className="wrap-filter-parent">
				<Popover
					placement="bottomRight"
					content={content}
					trigger="click"
					visible={showFilter}
					onVisibleChange={funcShowFilter}
					overlayClassName="filter-popover"
				>
					<button className="light btn btn-info">Kiểm tra lịch trung tâm</button>
				</Popover>
			</div>
		</>
	);
}

export default CheckBranch;
