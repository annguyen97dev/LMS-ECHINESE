import { Form, Input } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';

const InputMoneyField = (props) => {
	const { form, name, label, placeholder, disabled, handleChange, style, className, isRequired } = props;

	const { errors } = form.formState;
	const hasError = errors[name];

	const checkHandleChange = (value) => {
		if (!handleChange) return;
		handleChange(value);
	};

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
						onChange={(e) => {
							let convertValue = e.target.value.toString();
							let value = parseInt(convertValue.replace(/\,/g, ''), 10);

							if (!isNaN(value)) {
								field.onChange(value.toLocaleString());
							} else {
								field.onChange('');
							}
						}}
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
