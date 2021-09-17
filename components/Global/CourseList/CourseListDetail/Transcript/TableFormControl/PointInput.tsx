import {yupResolver} from '@hookform/resolvers/yup';
import Form from 'antd/lib/form/Form';
import PropTypes from 'prop-types';
import React, {useEffect, useRef} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import InputTextField from '~/components/FormControl/InputTextField';

PointInput.propTypes = {
	handleCreatePointColumn: PropTypes.func,
	handleUpdatePointColumn: PropTypes.func,
	isUpdate: PropTypes.bool,
	item: PropTypes.shape({
		UserInformationID: PropTypes.number,
		CourseID: PropTypes.number,
		FullNameUnicode: PropTypes.string,
		PointColumnID: PropTypes.number,
		Note: PropTypes.string,
		Point: PropTypes.number,
	}),
	disabled: PropTypes.bool,
};
PointInput.defaultProps = {
	handleCreatePointColumn: null,
	handleUpdatePointColumn: null,
	isUpdate: false,
	item: {},
	disabled: false,
};
function PointInput(props) {
	const {
		handleCreatePointColumn,
		handleUpdatePointColumn,
		isUpdate,
		item,
		disabled,
	} = props;
	const debounceOnChange = useRef(null);
	const timeMs = 1000;
	const schema = yup.object().shape({
		Point: yup
			.number()
			.nullable()
			.typeError('Hãy nhập điểm')
			.min(0, 'Số điểm tối thiểu: 0')
			.max(10, 'Số điểm tối đa: 10'),
	});
	const defaultValuesInit = {
		Point: null,
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
		mode: 'all',
	});

	useEffect(() => {
		form.setValue('Point', Math.round(item.Point * 10) / 10 || 0);
	}, [isUpdate]);
	const transcriptSwitchFunc = ({Point}) => {
		if (debounceOnChange.current) {
			clearTimeout(debounceOnChange.current);
		}
		debounceOnChange.current = setTimeout(() => {
			switch (isUpdate) {
				case true:
					if (!handleUpdatePointColumn) return;
					handleUpdatePointColumn({...item, Point, Type: 'Point'});
					break;
				case false:
					if (!handleCreatePointColumn) return;
					handleCreatePointColumn({...item, Point, Type: 'Point'});
					break;
				default:
					break;
			}
		}, timeMs);
	};
	return (
		<>
			<Form onChange={form.handleSubmit(transcriptSwitchFunc)}>
				<InputTextField
					style={{marginBottom: 0}}
					form={form}
					name="Point"
					placeholder="Điểm"
					allowClear={false}
					disabled={disabled}
				/>
			</Form>
		</>
	);
}

export default PointInput;
