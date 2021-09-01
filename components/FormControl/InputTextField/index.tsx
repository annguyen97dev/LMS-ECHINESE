import {Form, Input} from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import {Controller} from 'react-hook-form';

const InputTextField = (props) => {
	const {
		form,
		name,
		label,
		placeholder,
		disabled,
		handleChange,
		style,
		className,
		allowClear,
		handleFormatCurrency,
	} = props;

	const {errors} = form.formState;
	const hasError = errors[name];

	const checkHandleChange = (value) => {
		if (!handleChange) return;
		handleChange(value);
	};

	return (
		<Form.Item
			style={style}
			label={label}
			className={`${className} ${
				hasError ? 'ant-form-item-with-help ant-form-item-has-error' : ''
			}`}
		>
			<Controller
				name={name}
				control={form.control}
				render={({field}) => (
					<Input
						{...field}
						className="style-input"
						allowClear={allowClear}
						placeholder={placeholder}
						disabled={disabled}
						onChange={(e) => {
							checkHandleChange(e.target.value);
							if (handleFormatCurrency) {
								field.onChange(handleFormatCurrency(e.target.value));
							} else {
								field.onChange(e.target.value);
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
InputTextField.propTypes = {
	form: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	disabled: PropTypes.bool,
	handleChange: PropTypes.func,
	handleFormatCurrency: PropTypes.func,
	style: PropTypes.shape({}),
	className: PropTypes.string,
	allowClear: PropTypes.bool,
};
InputTextField.defaultProps = {
	label: '',
	placeholder: '',
	disabled: false,
	handleChange: null,
	handleFormatCurrency: null,
	style: {},
	className: '',
	allowClear: true,
};
export default InputTextField;
