import {DatePicker, Form} from 'antd';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Controller} from 'react-hook-form';

// interface InputTextField {
// 	form: Object;
// 	name: String;
// 	label?: String;
// 	optionList?: Array[Object];
// 	placeholder?: String;
// 	disabled?: Boolean;
// }
const DateField = ({
	form,
	name,
	label = '',
	placeholder = '',
	disabled = false,
}) => {
	const {errors} = form.formState;
	const hasError = errors[name];

	return (
		<Form.Item label={label}>
			<Controller
				name={name}
				control={form.control}
				render={({field}) => {
					return (
						<DatePicker
							{...field}
							className="style-input"
							style={{width: '100%'}}
							placeholder={placeholder}
							disabled={disabled}
							allowClear={false}
							format="DD/MM/YYYY"
							value={moment(field.value)}
							onChange={field.onChange}
						/>
					);
				}}
			/>
			{hasError && <span style={{color: 'red'}}>{errors[name]?.message}</span>}
		</Form.Item>
	);
};

export default DateField;
