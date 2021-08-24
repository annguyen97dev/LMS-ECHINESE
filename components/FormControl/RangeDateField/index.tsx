import {DatePicker, Form} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import {Controller} from 'react-hook-form';

const {RangePicker} = DatePicker;
const RangeDateField = (props) => {
	const {form, name, label, placeholder, disabled, style, className} = props;
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
				render={({field}) => {
					const checkValue =
						field.value?.length === 2 ? field.value.map((d) => moment(d)) : [];
					return (
						<RangePicker
							{...field}
							className="style-input"
							style={{width: '100%'}}
							placeholder={placeholder}
							disabled={disabled}
							// allowClear={true} //TẠM THỜI VẪN CHƯA CLEAR ĐƯỢC
							format="DD/MM/YYYY"
							value={checkValue}
							allowEmpty={[true, true]}
							onChange={(date, dateString) => {
								if (date?.length === 2) {
									return field.onChange([
										date[0]?.format('YYYY/MM/DD'),
										date[1]?.format('YYYY/MM/DD'),
									]);
								}
								return date;
							}}
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

RangeDateField.propTypes = {
	form: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	disabled: PropTypes.bool,
	style: PropTypes.shape({}),
	className: PropTypes.string,
};
RangeDateField.defaultProps = {
	label: '',
	placeholder: '',
	disabled: false,
	style: {},
	className: '',
};

export default RangeDateField;
