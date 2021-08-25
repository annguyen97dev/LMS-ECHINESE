import React, {useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';

const DynamicComponentWithNoSSR = dynamic(() => import('./Editor'), {
	ssr: false,
});

EditorBase.propTypes = {
	isReset: PropTypes.bool,
	content: PropTypes.string,
	handleChangeDataEditor: PropTypes.func,
	handleOnImageUpload: PropTypes.func,
};

EditorBase.defaultProps = {
	isReset: false,
	content: '',
	handleChangeDataEditor: null,
	handleOnImageUpload: null,
};

function EditorBase(props) {
	const {handleChangeDataEditor, handleOnImageUpload, isReset, content} = props;

	return (
		<div className="summernote-style">
			<DynamicComponentWithNoSSR
				handleOnImageUpload={handleOnImageUpload}
				handleChangeDataEditor={handleChangeDataEditor}
				isReset={isReset}
				content={content}
			/>
		</div>
	);
}

export default EditorBase;
