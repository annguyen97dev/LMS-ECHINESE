import React from 'react';
import PropTypes from 'prop-types';
import {Form, Select} from 'antd';
import {Controller} from 'react-hook-form';

const SelectField = (props) => {
	const {form, name, label, optionList, placeholder, disabled} = props;
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
						defaultValue={optionList[0].value}
					>
						{optionList.map((o, idx) => (
							<Option key={idx} value={o.value}>
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

SelectField.propTypes = {
	form: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	optionList: PropTypes.arrayOf(
		PropTypes.shape({
			title: PropTypes.string.isRequired,
			value: PropTypes.string.isRequired,
		})
	).isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	disabled: PropTypes.bool,
};
SelectField.defaultProps = {
	label: '',
	placeholder: '',
	disabled: false,
};
export default SelectField;
