import { Form, Select } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';
import { optionCommonPropTypes } from '~/utils/proptypes';

const SelectField = (props) => {
	const {
		form,
		name,
		isDynamicField,
		label,
		optionList,
		placeholder,
		disabled,
		mode,
		onChangeSelect,
		isLoading,
		style,
		className,
		isRequired,
		optionDisabledList
	} = props;
	const { Option } = Select;
	const { errors } = form.formState;

	let hasError;
	let errorMessage;
	if (isDynamicField) {
		// NAME.INDEX.KEY;
		const nameSlice = name.slice(0, name.indexOf('.'));
		const index = name.slice(name.indexOf('.') + 1, name.lastIndexOf('.'));
		const key = name.slice(name.lastIndexOf('.') + 1);
		// IF HAVE NAME SLICE
		if (errors[nameSlice] && errors[nameSlice][index]) {
			hasError = errors[nameSlice][index][key];
			errorMessage = errors[nameSlice][index][key]?.message;
		}
	} else {
		hasError = errors[name];
		errorMessage = errors[name]?.message;
	}

	const checkOnChangeSelect = (value) => {
		if (!onChangeSelect) return;
		onChangeSelect(value);
	};
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
					return (
						<Select
							{...field}
							mode={mode}
							className="style-input"
							showSearch
							loading={isLoading}
							style={{ width: '100%' }}
							placeholder={placeholder}
							optionFilterProp="children"
							disabled={disabled}
							onChange={(value) => {
								checkOnChangeSelect(value);
								field.onChange(value);
							}}
						>
							{optionList.map((o, idx) => (
								<Option key={idx} value={o.value} disabled={o.disabled || optionDisabledList?.includes(o.value)}>
									{o.title}
								</Option>
							))}
						</Select>
					);
				}}
			/>
			{hasError && (
				<div className="ant-form-item-explain ant-form-item-explain-error">
					<div role="alert">{errorMessage}</div>
				</div>
			)}
		</Form.Item>
	);
};

SelectField.propTypes = {
	form: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	isDynamicField: PropTypes.bool,
	optionList: optionCommonPropTypes,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	disabled: PropTypes.bool,
	mode: PropTypes.string,
	onChangeSelect: PropTypes.func,
	isLoading: PropTypes.bool,
	style: PropTypes.shape({}),
	className: PropTypes.string,
	isRequired: PropTypes.bool,
	optionDisabledList: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
};
SelectField.defaultProps = {
	isDynamicField: false,
	optionList: [],
	label: '',
	placeholder: '',
	disabled: false,
	onChangeSelect: null,
	mode: '',
	isLoading: false,
	style: {},
	className: '',
	isRequired: false,
	optionDisabledList: []
};
export default SelectField;
