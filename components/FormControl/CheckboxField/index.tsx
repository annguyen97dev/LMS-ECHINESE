import {Form, Input} from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import PropTypes from 'prop-types';
import React from 'react';
import {Controller} from 'react-hook-form';

const CheckboxField = (props) => {
	const {
		form,
		name,
		label,
		text,
		disabled,
		handleChangeCheckbox,
		style,
		className,
	} = props;

	const {errors} = form.formState;
	const hasError = errors[name];

	const checkHandleChangeCheckbox = (value) => {
		if (!handleChangeCheckbox) return;
		handleChangeCheckbox(value);
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
					<Checkbox
						{...field}
						disabled={disabled}
						checked={field.value}
						onChange={(e) => {
							checkHandleChangeCheckbox(e.target.checked);
							field.onChange(e.target.checked);
						}}
					>
						{text}
					</Checkbox>
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
CheckboxField.propTypes = {
	form: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	text: PropTypes.string,
	disabled: PropTypes.bool,
	handleChangeCheckbox: PropTypes.func,
	style: PropTypes.shape({}),
	className: PropTypes.string,
};
CheckboxField.defaultProps = {
	label: '',
	text: '',
	disabled: false,
	handleChangeCheckbox: null,
	style: {},
	className: '',
};
export default CheckboxField;
