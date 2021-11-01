import { DatePicker, Form, TimePicker } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';

const TimePickerField = (props) => {
	const { form, name, label, placeholder, disabled, style, className } = props;
	const { errors } = form.formState;
	const hasError = errors[name];

	const format = 'HH:mm';

	return (
		<Form.Item
			style={style}
			label={label}
			className={`${className} ${hasError ? 'ant-form-item-with-help ant-form-item-has-error' : ''}`}
		>
			<Controller
				name={name}
				control={form.control}
				render={({ field }) => {
					const checkValue = field.value ? moment(field.value, format) : undefined;
					return (
						<TimePicker
							{...field}
							className="style-input"
							style={{ width: '100%' }}
							placeholder={placeholder}
							disabled={disabled}
							allowClear={true}
							format={format}
							value={checkValue}
							onSelect={(time) => field.onChange(time?.format(format))}
						/>
					);
				}}
			/>
			{hasError && (
				<div className="ant-form-item-explain ant-form-item-explain-error">
					<div role="alert">{errors[name]?.message}</div>
				</div>
			)}
		</Form.Item>
	);
};

TimePickerField.propTypes = {
	form: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	disabled: PropTypes.bool,
	style: PropTypes.shape({}),
	className: PropTypes.string
};
TimePickerField.defaultProps = {
	label: '',
	placeholder: '',
	disabled: false,
	style: {},
	className: ''
};

export default TimePickerField;
