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
		isDynamicField,
	} = props;

	const {errors} = form.formState;
	let hasError;
	let errorMessage;
	if (isDynamicField) {
		// NAME.INDEX.KEY;
		const nameSlice = name.slice(0, name.indexOf('.'));
		const index = name.slice(name.indexOf('.') + 1, name.lastIndexOf('.'));
		const key = name.slice(name.lastIndexOf('.') + 1);
		// IF HAVE NAME SLICE
		if (errors[nameSlice] && errors[nameSlice][index]) {
			hasError = errors[nameSlice][index][key];
			errorMessage = errors[nameSlice][index][key]?.message;
		}
	} else {
		hasError = errors[name];
		errorMessage = errors[name]?.message;
	}

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
					<div role="alert">{errorMessage}</div>
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
	isDynamicField: PropTypes.bool,
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
	isDynamicField: false,
};
export default InputTextField;
