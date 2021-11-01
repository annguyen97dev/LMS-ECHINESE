import { DatePicker, Form } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';

const DateField = (props) => {
	const { form, name, label, placeholder, disabled, style, className, isRequired } = props;
	const { errors } = form.formState;
	const hasError = errors[name];

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
				render={({ field }) => {
					const checkValue = field.value ? moment(field.value) : undefined;
					return (
						<DatePicker
							{...field}
							className="style-input"
							style={{ width: '100%' }}
							placeholder={placeholder}
							disabled={disabled}
							allowClear={true}
							format="DD/MM/YYYY"
							value={checkValue}
							onChange={(date) => field.onChange(date?.format('YYYY/MM/DD'))}
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

DateField.propTypes = {
	form: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	disabled: PropTypes.bool,
	style: PropTypes.shape({}),
	className: PropTypes.string,
	isRequired: PropTypes.bool
};
DateField.defaultProps = {
	label: '',
	placeholder: '',
	disabled: false,
	style: {},
	className: '',
	isRequired: false
};

export default DateField;
