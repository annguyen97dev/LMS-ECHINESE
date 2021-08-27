import {Form} from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import {Controller} from 'react-hook-form';
import EditorBase from '~/components/Elements/EditorBase';

const EditorField = (props) => {
	const {form, name, label, disabled, style, className, height} = props;
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
					return (
						<EditorBase
							content={field.value}
							height={height}
							customFieldProps={{
								name: field.name,
								onBlur: field.onBlur,
								onChange: field.onChange,
								innerRef: field.ref,
								value: field.value,
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
EditorField.propTypes = {
	form: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	disabled: PropTypes.bool,
	style: PropTypes.shape({}),
	className: PropTypes.string,
	height: PropTypes.number,
};
EditorField.defaultProps = {
	label: '',
	disabled: false,
	style: {},
	className: '',
	height: 150,
};
export default EditorField;
