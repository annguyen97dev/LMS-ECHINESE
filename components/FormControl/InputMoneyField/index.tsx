import { Form, Input } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { parseToMoney } from '~/utils/functions';

const InputMoneyField = (props) => {
	const { form, name, label, placeholder, disabled, handleChange, style, className, isRequired } = props;

	const { errors } = form.formState;
	const hasError = errors[name];

	const checkHandleChange = (value) => {
		if (!handleChange) return;
		handleChange(value);
	};

	const [salary, setSalary] = useState('');

	useEffect(() => {
		const value = salary;
		if (value !== null && value !== undefined) {
			setSalary(parseToMoney(value.replace(/[^0-9\.]+/g, '')));
		}
	}, [salary]);

	return (
		<Form.Item
			style={style}
			label={label}
			className={`${className} ${hasError ? 'ant-form-item-with-help ant-form-item-has-error' : ''}`}
			required={isRequired}
		>
			<Controller
				name={name}
				control={form.control}
				render={({ field }) => (
					<Input
						{...field}
						className="style-input"
						allowClear={true}
						placeholder={placeholder}
						disabled={disabled}
						value={salary}
						onChange={(e) => {
							setSalary(e.target.value);
							field.onChange(e.target.value.toLocaleString());
						}}

						// onChange={(e) => {
						// 	console.log(e.target.value);

						// 	let convertValue = e.target.value.toString();
						// 	// parseToMoney(value.replace(/[^0-9\.]+/g, ''))
						// 	let value = parseToMoney(convertValue.replace(/[^0-9\.]+/g, ''));

						// 	if (!isNaN(value)) {
						// 		field.onChange(value.toLocaleString());
						// 	} else {
						// 		field.onChange('');
						// 	}
						// }}
					/>
				)}
			/>
			{hasError && (
				<div className="ant-form-item-explain ant-form-item-explain-error">
					<div role="alert">{errors[name]?.message}</div>
				</div>
			)}
		</Form.Item>
	);
};
InputMoneyField.propTypes = {
	form: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	disabled: PropTypes.bool,
	handleChange: PropTypes.func,
	style: PropTypes.shape({}),
	className: PropTypes.string,
	isRequired: PropTypes.bool
};
InputMoneyField.defaultProps = {
	label: '',
	placeholder: '',
	disabled: false,
	handleChange: null,
	style: {},
	className: '',
	isRequired: false
};
export default InputMoneyField;
