import {DatePicker, Form, Popover, Select} from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, {useState} from 'react';
import {Filter} from 'react-feather';
import moment from 'moment';
import { useForm } from "react-hook-form";

const dateFormat = 'YYYY/MM/DD';

const { RangePicker } = DatePicker;

const FilterSupplierTable = (props:any) => {
	const {Option} = Select;
	function handleChange(value) {
		console.log(`selected ${value}`);
	}

	function onChange(date, dateString) {
		console.log(date, dateString);
	}

	const [showFilter, showFilterSet] = useState(false);

	const funcShowFilter = () => {
		showFilter ? showFilterSet(false) : showFilterSet(true);
	};

	const {
		register,
		handleSubmit,
		setValue,
		formState: { isSubmitting, errors, isSubmitted },
	} = useForm();

	const onSubmit = handleSubmit((data: any) => {
		// console.log(data);
		props._onFilter(data);
		showFilterSet(false);
	});

	const content = (
		<div className={`wrap-filter small`}>
			<Form layout="vertical" onFinish={onSubmit}>
				<div className="row">
					<div className="col-md-12">
						<Form.Item>
							<RangePicker
								format={dateFormat}
								allowClear={true}
								className="style-input"
								onChange={(value, dateStrings) => {setValue("fromDate", dateStrings[0]); setValue("toDate", dateStrings[1])}}
							/>
						</Form.Item>
					</div>
					<div className="col-md-12">
						<Form.Item className="mb-0">
							<button className="btn btn-primary" style={{marginRight: '10px'}} onClick={onSubmit}>
								Tìm kiếm
							</button>
							{/* <button className="btn btn-success">Export</button> */}
						</Form.Item>
					</div>
				</div>
			</Form>
		</div>
	);

	return (
		<>
			<div className="wrap-filter-parent">
				<Popover
					visible={showFilter}
					placement="bottomRight"
					content={content}
					trigger="click"
					overlayClassName="filter-popover"
					onVisibleChange={funcShowFilter}
				>
					<button className="btn btn-secondary light btn-filter" onClick={funcShowFilter}>
						<Filter />
					</button>
				</Popover>
			</div>
		</>
	);
};

export default FilterSupplierTable;
