import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import SelectField from '~/components/FormControl/SelectField';
import {optionCommonPropTypes} from '~/utils/proptypes';

TranscriptSelectSubject.propTypes = {
	handleOnFetchStudent: PropTypes.func,
	optionSubjectList: optionCommonPropTypes,
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
};
TranscriptSelectSubject.defaultProps = {
	handleOnFetchStudent: null,
	optionSubjectList: [],
	isLoading: {type: '', status: false},
};
function TranscriptSelectSubject(props) {
	const {handleOnFetchStudent, isLoading, optionSubjectList} = props;

	const defaultValuesInit = {
		SubjectID: 0,
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		mode: 'onChange',
	});

	useEffect(() => {
		form.setValue('SubjectID', optionSubjectList[1]?.value);
	}, [optionSubjectList]);

	const checkHandleOnFetchStudent = (value) => {
		if (!handleOnFetchStudent) return;
		if (!value) return;
		handleOnFetchStudent(value);
	};

	return (
		<div className="d-flex align-items-center">
			<div className="">
				<b>Môn học:</b>
			</div>
			<div>
				<SelectField
					style={{width: '250px', paddingLeft: '20px', marginBottom: 0}}
					form={form}
					name="SubjectID"
					optionList={optionSubjectList}
					isLoading={isLoading.type === 'FETCH_SUBJECT' && isLoading.status}
					onChangeSelect={(value) => {
						checkHandleOnFetchStudent(value);
					}}
				/>
			</div>
		</div>
	);
}

export default TranscriptSelectSubject;
