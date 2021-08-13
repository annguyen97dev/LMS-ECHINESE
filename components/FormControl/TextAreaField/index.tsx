import {Form} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React from 'react';
import {Controller} from 'react-hook-form';
import PropTypes from 'prop-types';

const TextAreaField = (props) => {
	const {form, name, rows, label, placeholder, disabled, style, className} =
		props;
	const {errors} = form.formState;
	const hasError = errors[name];
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
			{hasError && (
				<div className="ant-form-item-explain ant-form-item-explain-error">
					<div role="alert">{errors[name]?.message}</div>
				</div>
			)}
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
	style: PropTypes.shape({}),
	className: PropTypes.string,
};
TextAreaField.defaultProps = {
	rows: 2,
	label: '',
	placeholder: '',
	disabled: false,
	style: {},
	className: '',
};
export default TextAreaField;
