import {yupResolver} from '@hookform/resolvers/yup';
import {Form, Popover, Spin} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Filter} from 'react-feather';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import DateField from '~/components/FormControl/DateField';

const DayOffFilterForm = (props) => {
	const {handleFilterDayOff} = props;

	const [showFilter, showFilterSet] = useState(false);

	const funcShowFilter = () => {
		showFilter ? showFilterSet(false) : showFilterSet(true);
	};
	const schema = yup.object().shape({
		fromDate: yup
			.date()
			.max(
				yup.ref('toDate'),
				({max}) => `Ngày bắt đầu cần trước ${moment(max).format('DD-MM-YYYY')}`
			)
			.required('Bạn không được bỏ trống'),
		toDate: yup
			.date()
			.min(
				yup.ref('fromDate'),
				({min}) => `Ngày kết thúc cần sau ${moment(min).format('DD-MM-YYYY')}`
			)
			.required('Bạn không được bỏ trống'),
	});

	const defaultValuesInit = {
		fromDate: moment().format('YYYY/MM/DD'),
		toDate: moment().add(1, 'months').format('YYYY/MM/DD'),
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});
	const checkHandleFilterDayOff = (createdBy) => {
		if (!handleFilterDayOff) return;
		handleFilterDayOff(createdBy);
		funcShowFilter();
	};
	const content = (
		<div className={`wrap-filter small`}>
			<Form
				layout="vertical"
				onFinish={form.handleSubmit(checkHandleFilterDayOff)}
			>
				<div className="row">
					<div className="col-md-12">
						<DateField form={form} name="fromDate" label="Ngày khởi tạo từ" />
					</div>
					<div className="col-md-12">
						<DateField form={form} name="toDate" label="Đến ngày" />
					</div>
					<div className="col-md-12 mt-3">
						<button
							type="submit"
							className="btn btn-primary"
							style={{marginRight: '10px'}}
						>
							Tìm kiếm
							{/* {isLoading.type === 'FILTER_CREATED' && isLoading.status && (
								<Spin className="loading-base" />
							)} */}
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
					<button className="btn btn-secondary light btn-filter">
						<Filter />
					</button>
				</Popover>
			</div>
		</>
	);
};
DayOffFilterForm.propTypes = {
	handleFilterDayOff: PropTypes.func,
};
DayOffFilterForm.defaultProps = {
	handleFilterDayOff: null,
};
export default DayOffFilterForm;
