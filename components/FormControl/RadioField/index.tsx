import {Form, Radio} from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import {Controller} from 'react-hook-form';

const RadioField = (props) => {
	const {
		form,
		name,
		label,
		disabled,
		style,
		className,
		size,
		radioList,
		radioType,
		radioButtonStyle,
		handleChange,
	} = props;

	const {errors} = form.formState;
	const hasError = errors[name];

	const checkHandleChange = (value) => {
		if (!handleChange) return;
		handleChange(value);
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
				render={({field}) => (
					<Radio.Group
						{...field}
						disabled={disabled}
						size={size}
						options={radioList}
						optionType={radioType}
						buttonStyle={radioButtonStyle}
						onChange={(e) => {
							checkHandleChange(e.target.value);
							field.onChange(e.target.value);
						}}
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
RadioField.propTypes = {
	form: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	disabled: PropTypes.bool,
	style: PropTypes.shape({}),
	className: PropTypes.string,
	size: PropTypes.oneOf(['', 'small', 'middle', 'large']),
	radioList: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.oneOfType([
				PropTypes.string.isRequired,
				PropTypes.number.isRequired,
			]),
			value: PropTypes.oneOfType([
				PropTypes.string.isRequired,
				PropTypes.number.isRequired,
			]),
			disabled: PropTypes.bool,
		})
	),
	radioType: PropTypes.oneOf(['default', 'button']),
	radioButtonStyle: PropTypes.oneOf(['outline', 'solid']),
	handleChange: PropTypes.func,
};
RadioField.defaultProps = {
	label: '',
	disabled: false,
	style: {},
	className: '',
	size: '',
	radioList: [],
	radioType: 'default',
	radioButtonStyle: 'outline',
	handleChange: null,
};
export default RadioField;
