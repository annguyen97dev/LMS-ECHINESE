import {Form, Input} from 'antd';
import React from 'react';
import {Controller} from 'react-hook-form';
import PropTypes from 'prop-types';

const InputTextField = (props) => {
	const {form, name, label, placeholder, disabled} = props;

	const {errors} = form.formState;
	const hasError = errors[name];
	return (
		<Form.Item
			label={label}
			className={`${
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
						allowClear={true}
						placeholder={placeholder}
						disabled={disabled}
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
};
InputTextField.defaultProps = {
	label: '',
	placeholder: '',
	disabled: false,
};
export default InputTextField;
