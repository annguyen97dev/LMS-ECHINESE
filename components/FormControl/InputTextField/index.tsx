import {Form, Input} from 'antd';
import React from 'react';
import {Controller} from 'react-hook-form';

function InputTextField({
	form,
	name,
	label = '',
	placeholder = '',
	disabled = false,
}) {
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
}

export default InputTextField;
