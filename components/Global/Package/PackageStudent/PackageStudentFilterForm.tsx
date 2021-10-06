import {yupResolver} from '@hookform/resolvers/yup';
import {Form, Popover} from 'antd';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Filter} from 'react-feather';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import SelectField from '~/components/FormControl/SelectField';
import {optionCommonPropTypes} from '~/utils/proptypes';

const PackageStudentFilterForm = (props) => {
	const {handleFilter, handleResetFilter, typeOptionList} = props;
	const [showFilter, showFilterSet] = useState(false);

	const funcShowFilter = () => {
		showFilter ? showFilterSet(false) : showFilterSet(true);
	};
	const schema = yup.object().shape({
		Type: yup.number().nullable(),
	});

	const defaultValuesInit = {
		Type: null,
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});
	const checkHandleFilter = (data) => {
		if (!handleFilter) return;
		handleFilter(data);
		funcShowFilter();
	};
	const checkHandleResetFilter = () => {
		if (!handleResetFilter) return;
		handleResetFilter();
		funcShowFilter();
		form.reset({...defaultValuesInit});
	};
	const content = (
		<div className={`wrap-filter small`}>
			<Form layout="vertical" onFinish={form.handleSubmit(checkHandleFilter)}>
				<div className="row">
					<div className="col-md-12">
						<SelectField
							form={form}
							name="Type"
							label="Loại"
							placeholder="Chọn loại"
							optionList={typeOptionList}
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
};
PackageStudentFilterForm.propTypes = {
	handleFilter: PropTypes.func,
	handleResetFilter: PropTypes.func,
	typeOptionList: optionCommonPropTypes,
};
PackageStudentFilterForm.defaultProps = {
	handleFilter: null,
	handleResetFilter: null,
	typeOptionList: [],
};
export default PackageStudentFilterForm;
