import {yupResolver} from '@hookform/resolvers/yup';
import {Form, Popover} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Filter} from 'react-feather';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import DateField from '~/components/FormControl/DateField';
import SelectField from '~/components/FormControl/SelectField';
import {optionCommonPropTypes} from '~/utils/proptypes';

SalesCampaignFilter.propTypes = {
	handleFilter: PropTypes.func,
	handleResetFilter: PropTypes.func,
};
SalesCampaignFilter.defaultProps = {
	handleFilter: null,
	handleResetFilter: null,
};

function SalesCampaignFilter(props) {
	const {handleFilter, handleResetFilter} = props;

	const [showFilter, showFilterSet] = useState(false);

	const funcShowFilter = () => {
		showFilter ? showFilterSet(false) : showFilterSet(true);
	};

	const schema = yup.object().shape({
		Time: yup.date().required('Bạn không được để trống'),
	});

	const defaultValuesInit = {
		Time: moment().format('YYYY/MM/DD'),
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});
	const checkHandleFilter = (createdBy) => {
		if (!handleFilter) return;
		handleFilter(createdBy);
		funcShowFilter();
	};
	const checkHandleResetFilter = () => {
		if (!handleResetFilter) return;
		handleResetFilter();
		funcShowFilter();
		form.reset({
			Time: undefined,
		});
	};
	const content = (
		<div className={`wrap-filter small`}>
			<Form layout="vertical" onFinish={form.handleSubmit(checkHandleFilter)}>
				<div className="row">
					<div className="col-12 ">
						<DateField
							form={form}
							name="Time"
							label="Ngày có chiến dịch"
							placeholder="Chọn ngày"
						/>
					</div>
					<div className="col-md-12 mt-3">
						<button
							type="submit"
							className="btn btn-primary"
							style={{marginRight: '10px'}}
						>
							Tìm kiếm
						</button>
						<button
							type="button"
							className="light btn btn-secondary"
							onClick={checkHandleResetFilter}
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
					<button className="btn btn-secondary light btn-filter">
						<Filter />
					</button>
				</Popover>
			</div>
		</>
	);
}

export default SalesCampaignFilter;
