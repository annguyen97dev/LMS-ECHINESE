import {yupResolver} from '@hookform/resolvers/yup';
import {Form, Spin} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import DateField from '~/components/FormControl/DateField';

SalerRevenueSearch.propTypes = {
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	handleSubmit: PropTypes.func,
};

SalerRevenueSearch.defaultProps = {
	isLoading: {type: '', status: false},
	handleSubmit: null,
};

function SalerRevenueSearch(props) {
	const {isLoading, handleSubmit} = props;

	const schema = yup.object().shape({
		fromDate: yup.date().required('Bạn không được để trống'),
		toDate: yup
			.date()
			.required('Bạn không được để trống')
			.when(
				'fromDate',
				(startDate, schema) =>
					startDate && schema.min(startDate, `Ngày không hợp lệ`)
			),
	});
	const defaultValuesInit = {
		fromDate: moment().format('YYYY/MM/DD'),
		toDate: moment().add(1, 'months').format('YYYY/MM/DD'),
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});

	const checkHandleSubmit = (data) => {
		if (!handleSubmit) return;
		handleSubmit(data);
	};
	return (
		<div className="revenue-detail-row">
			<Form layout="vertical" onFinish={form.handleSubmit(checkHandleSubmit)}>
				<div className="row">
					<div className="col-md-2">
						<DateField form={form} name="fromDate" />
					</div>
					<div className="col-md-2">
						<DateField form={form} name="toDate" />
					</div>
					<div className="col-md-3">
						<button
							type="submit"
							className="btn btn-primary"
							disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
						>
							Tìm kiếm
							{isLoading.type === 'ADD_DATA' && isLoading.status && (
								<Spin className="loading-base" />
							)}
						</button>
					</div>
				</div>
			</Form>
		</div>
	);
}

export default SalerRevenueSearch;
