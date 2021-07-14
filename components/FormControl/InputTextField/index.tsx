import {Form, Input} from 'antd';
import React from 'react';
import {Controller} from 'react-hook-form';
import PropTypes from 'prop-types';

const InputTextField = (props) => {
	const {form, name, label, placeholder, disabled} = props;

	const {errors} = form.formState;
	const hasError = errors[name];
	return (
		<Form.Item label={label}>
			<Controller
				name={name}
				control={form.control}
				render={({field}) => (
					<Input
						{...field}
						size="large"
						className="style-input"
						placeholder={placeholder}
						disabled={disabled}
					/>
				)}
			/>
			{hasError && <span style={{color: 'red'}}>{errors[name]?.message}</span>}
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
