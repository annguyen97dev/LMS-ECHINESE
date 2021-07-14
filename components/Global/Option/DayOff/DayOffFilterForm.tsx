import {yupResolver} from '@hookform/resolvers/yup';
import {Form, Popover, Spin} from 'antd';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Filter} from 'react-feather';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import SelectField from '~/components/FormControl/SelectField';

const DayOffFilterForm = (props) => {
	const {dataOption, isLoading, handleFilterDayOff} = props;

	const [showFilter, showFilterSet] = useState(false);

	const funcShowFilter = () => {
		showFilter ? showFilterSet(false) : showFilterSet(true);
	};
	const schema = yup.object().shape({
		createdBy: yup.string(),
	});

	const defaultValuesInit = {
		createdBy: '',
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
						<SelectField
							form={form}
							name="createdBy"
							label="Modified By"
							optionList={dataOption}
						/>
					</div>
					<div className="col-md-12">
						<button
							type="submit"
							className="btn btn-primary"
							style={{marginRight: '10px'}}
						>
							Tìm kiếm
							{isLoading.type === 'FILTER_CREATED' && isLoading.status && (
								<Spin className="loading-base" />
							)}
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
	dataOption: PropTypes.arrayOf(
		PropTypes.shape({
			title: PropTypes.string.isRequired,
			value: PropTypes.string.isRequired,
		})
	).isRequired,
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	handleFilterDayOff: PropTypes.func,
};
DayOffFilterForm.defaultProps = {
	dataOption: [],
	isLoading: {type: '', status: false},
	handleFilterDayOff: null,
};
export default DayOffFilterForm;
