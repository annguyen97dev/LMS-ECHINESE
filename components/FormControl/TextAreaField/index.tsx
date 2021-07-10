import {Form} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React from 'react';
import {Controller} from 'react-hook-form';

function TextAreaField({
	form,
	name,
	rows = 2,
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
					<TextArea
						{...field}
						rows={rows}
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

export default TextAreaField;
