import React from 'react';
import PropTypes from 'prop-types';
import {Form, Select} from 'antd';
import {Controller} from 'react-hook-form';

// interface SelectField {
// 	form: Object;
// 	name: String;
// 	label?: String;
// 	optionList?: Array[Object];
// 	placeholder?: String;
// 	disabled?: Boolean;
// }

const SelectField = ({
	form,
	name,
	label = '',
	optionList = [],
	placeholder = '',
	disabled = false,
}) => {
	const {Option} = Select;
	const {errors} = form.formState;
	const hasError = errors[name];
	return (
		<Form.Item label={label}>
			<Controller
				name={name}
				control={form.control}
				render={({field}) => (
					<Select
						{...field}
						className="style-input"
						size="large"
						showSearch
						style={{width: '100%'}}
						placeholder={placeholder}
						optionFilterProp="children"
						disabled={disabled}
						filterOption={(input, option) => {
							return (
								option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
							);
						}}
					>
						{optionList.map((o) => (
							<Option key={o.id} value={o.value}>
								{o.title}
							</Option>
						))}
					</Select>
				)}
			/>
			{hasError && <span style={{color: 'red'}}>{errors[name]?.message}</span>}
		</Form.Item>
	);
};

export default SelectField;
