import {Form} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, {useState} from 'react';
import {Controller} from 'react-hook-form';
import PropTypes from 'prop-types';

const TextAreaField = (props) => {
	const {
		form,
		name,
		rows,
		label,
		placeholder,
		disabled,
		style,
		className,
		allowClear,
		autoSize,
		maxLength,
	} = props;
	const {errors} = form.formState;
	const hasError = errors[name];
	const [isChange, setIsChange] = useState(false);

	const onChange = (e) => {
		if (e.target.value === '') {
			setIsChange(false);
		} else {
			setIsChange(true);
		}
	};

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
				render={({field}) => {
					return (
						<TextArea
							{...field}
							rows={rows}
							className={`${!field.value && !isChange ? 'style-input' : ''}`}
							allowClear={allowClear}
							placeholder={placeholder}
							disabled={disabled}
							autoSize={autoSize}
							maxLength={maxLength}
							onChange={(e) => (onChange(e), field.onChange(e.target.value))}
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
TextAreaField.propTypes = {
	form: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	rows: PropTypes.number,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	disabled: PropTypes.bool,
	style: PropTypes.shape({}),
	className: PropTypes.string,
	allowClear: PropTypes.bool,
	autoSize: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
	maxLength: PropTypes.number,
};
TextAreaField.defaultProps = {
	rows: 2,
	label: '',
	placeholder: '',
	disabled: false,
	style: {},
	className: '',
	allowClear: true,
	autoSize: false,
	maxLength: null,
};
export default TextAreaField;
