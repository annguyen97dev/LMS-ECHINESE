import {DatePicker, Form} from 'antd';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Controller} from 'react-hook-form';
import PropTypes from 'prop-types';

const DateField = (props) => {
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
				render={({field}) => {
					const checkValue = field.value ? moment(field.value) : undefined;
					return (
						<DatePicker
							{...field}
							className="style-input"
							style={{width: '100%'}}
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
};
DateField.defaultProps = {
	label: '',
	placeholder: '',
	disabled: false,
};

export default DateField;
