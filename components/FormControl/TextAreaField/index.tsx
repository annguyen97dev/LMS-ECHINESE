import {Form} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React from 'react';
import {Controller} from 'react-hook-form';
import PropTypes from 'prop-types';

const TextAreaField = (props) => {
	const {form, name, rows, label, placeholder, disabled} = props;
	const {errors} = form.formState;
	const hasError = errors[name];
	return (
		<Form.Item label={label}>
			<Controller
				name={name}
				control={form.control}
				render={({field}) => (
					<TextArea
						{...field}
						rows={rows}
						className="style-input"
						allowClear={true}
						placeholder={placeholder}
						disabled={disabled}
					/>
				)}
			/>
			{hasError && <span style={{color: 'red'}}>{errors[name]?.message}</span>}
		</Form.Item>
	);
};
TextAreaField.propTypes = {
	form: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	rows: PropTypes.number,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	disabled: PropTypes.bool,
};
TextAreaField.defaultProps = {
	rows: 2,
	label: '',
	placeholder: '',
	disabled: false,
};
export default TextAreaField;
