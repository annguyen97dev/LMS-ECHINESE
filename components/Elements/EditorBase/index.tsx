import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import React from 'react';

const DynamicComponentWithNoSSR = dynamic(() => import('./Editor'), {
	ssr: false,
});

EditorBase.propTypes = {
	isReset: PropTypes.bool,
	content: PropTypes.string,
	height: PropTypes.number,
	handleChangeDataEditor: PropTypes.func,
	// PROP TYPES FOR CUSTOM FIELD. CAN SKIP
	customFieldProps: PropTypes.shape({
		name: PropTypes.string.isRequired,
		onBlur: PropTypes.func.isRequired,
		onChange: PropTypes.func.isRequired,
		innerRef: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.shape({current: PropTypes.any}),
		]).isRequired,
		value: PropTypes.string.isRequired,
	}),
};

EditorBase.defaultProps = {
	isReset: false,
	content: '',
	height: 600,
	handleChangeDataEditor: null,
};

function EditorBase(props) {
	const {isReset, content, height, handleChangeDataEditor, customFieldProps} =
		props;

	return (
		<div className="summernote-style">
			<DynamicComponentWithNoSSR
				isReset={isReset}
				content={content}
				height={height}
				handleChangeDataEditor={handleChangeDataEditor}
				customFieldProps={customFieldProps}
			/>
		</div>
	);
}

export default EditorBase;
