import {Checkbox, Form} from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import {Controller} from 'react-hook-form';
import {checkboxCommonPropTypes} from '~/utils/proptypes';

const CheckboxGroupField = (props) => {
	const {
		form,
		name,
		label,
		checkboxList,
		disabled,
		handleChange,
		style,
		className,
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
					<Checkbox.Group
						{...field}
						disabled={disabled}
						options={checkboxList}
						onChange={(checkedValue) => {
							checkHandleChange(checkedValue);
							field.onChange(checkedValue);
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
CheckboxGroupField.propTypes = {
	form: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	disabled: PropTypes.bool,
	handleChange: PropTypes.func,
	style: PropTypes.shape({}),
	className: PropTypes.string,
	checkboxList: checkboxCommonPropTypes,
};
CheckboxGroupField.defaultProps = {
	label: '',
	disabled: false,
	handleChange: null,
	style: {},
	className: '',
	checkboxList: [],
};
export default CheckboxGroupField;
