import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import InputTextField from '~/components/FormControl/InputTextField';

CommentForm.propTypes = {
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	handleComment: PropTypes.func,
	userComment: PropTypes.object,
	newsFeedID: PropTypes.number,
	newsFeedCommentID: PropTypes.number,
	isReplay: PropTypes.bool
};
CommentForm.defaultProps = {
	isLoading: { type: '', status: false },
	handleComment: null,
	userComment: {},
	newsFeedID: 0,
	newsFeedCommentID: 0,
	isReply: false
};

function CommentForm(props) {
	const { isLoading, dataUser, handleComment, newsFeedID, isReplay, newsFeedCommentID } = props;

	const schema = yup.object().shape({
		CommentContent: yup.string().required('Bạn không được bỏ trống')
	});

	const defaultValuesInit = {
		CommentContent: ''
	};

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	const checkHandleComment = (data: { CommentContent: string }) => {
		if (!handleComment) return;
		const newData = isReplay
			? {
					ReplyContent: data.CommentContent,
					NewsFeedCommentID: newsFeedCommentID
			  }
			: { ...data, NewsFeedID: newsFeedID };
		handleComment(newData).then((res) => res && form.reset({ ...defaultValuesInit }));
	};

	return (
		<div className="info-current-user user-comment">
			<div className="avatar">
				<img src={dataUser?.Avatar || '/images/user.png'} alt="" />
			</div>
			<div className="input-comments">
				<Form layout="vertical" onFinish={form.handleSubmit(checkHandleComment)}>
					<InputTextField form={form} name="CommentContent" allowClear={false} />
					<button type="submit" className="input-btn btn" disabled={isLoading.type === 'ADD_COMMENT' && isLoading.status}>
						Gửi
					</button>
				</Form>
			</div>
		</div>
	);
}

export default CommentForm;
