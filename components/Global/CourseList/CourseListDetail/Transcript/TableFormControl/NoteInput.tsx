import {yupResolver} from '@hookform/resolvers/yup';
import Form from 'antd/lib/form/Form';
import PropTypes from 'prop-types';
import React, {useEffect, useRef} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import InputTextField from '~/components/FormControl/InputTextField';

NoteInput.propTypes = {
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
};
NoteInput.defaultProps = {
	handleCreatePointColumn: null,
	handleUpdatePointColumn: null,
	isUpdate: false,
	item: {},
};
function NoteInput(props) {
	const {handleCreatePointColumn, handleUpdatePointColumn, isUpdate, item} =
		props;
	const debounceOnChange = useRef(null);
	const timeMs = 1000;
	const schema = yup.object().shape({
		Note: yup.string(),
	});
	const defaultValuesInit = {
		Note: null,
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
		mode: 'all',
	});

	useEffect(() => {
		form.setValue('Note', item.Note);
	}, [isUpdate]);

	const transcriptSwitchFunc = ({Note}) => {
		if (debounceOnChange.current) {
			clearTimeout(debounceOnChange.current);
		}
		debounceOnChange.current = setTimeout(() => {
			switch (isUpdate) {
				case true:
					if (!handleUpdatePointColumn) return;
					handleUpdatePointColumn({...item, Note: Note, Type: 'Note'});
					break;
				case false:
					if (!handleCreatePointColumn) return;
					handleCreatePointColumn({...item, Note: Note, Type: 'Note'});
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
					name="Note"
					placeholder="Ghi chú"
					allowClear={false}
				/>
				{/* <SelectField /> */}
			</Form>
		</>
	);
}

export default NoteInput;
