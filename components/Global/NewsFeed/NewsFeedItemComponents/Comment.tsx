import { Spin } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { fmDateFromNow } from '~/utils/functions';
import CommentForm from './CommentForm';
import ReplyComment from './ReplyComment';

Comment.propTypes = {
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	dataComment: PropTypes.shape({
		Avatar: PropTypes.string,
		ID: PropTypes.number,
		UserInformationID: PropTypes.number,
		FullNameUnicode: PropTypes.string,
		NewsFeedID: PropTypes.number,
		CommentContent: PropTypes.string,
		isReply: PropTypes.bool
	}),
	fetchReplyComment: PropTypes.func,
	handleReplyComment: PropTypes.func
};
Comment.defaultProps = {
	isLoading: { type: '', status: false },
	dataComment: {
		Avatar: '',
		ID: 0,
		UserInformationID: 0,
		FullNameUnicode: '',
		NewsFeedID: 0,
		CommentContent: '',
		isReply: false
	},
	fetchReplyComment: null,
	handleReplyComment: null
};

function Comment(props) {
	const { dataComment, fetchReplyComment, isLoading, handleReplyComment } = props;
	const [addCommentAction, setCommentAction] = useState(false);
	const [replyCommentList, setReplyCommentList] = useState<INewsFeedCommentReply[]>([]);

	const handleCommentsAction = () => {
		setCommentAction(!addCommentAction);
	};

	const checkFetchReplyComment = (ID: number) => {
		if (!fetchReplyComment) return;
		fetchReplyComment(ID).then((res) => {
			if (res?.status === 200) {
				setReplyCommentList(res.data.data);
			} else {
				setReplyCommentList([]);
			}
		});
	};
	const checkHandleReplyComment = (data) => {
		if (!handleReplyComment) return;
		return handleReplyComment(data).then((res) => {
			if (res?.status === 200) {
				setReplyCommentList([...replyCommentList, res.data.data]);
				return true;
			} else {
				return false;
			}
		});
	};

	return (
		<li className="item-comment">
			<div className="info-current-user">
				<div className="avatar">
					<img src={dataComment.Avatar || '/images/user.png'} alt="avatar" />
				</div>
				<div className="content-comment">
					<div className="box-comment">
						<p className="name-comment font-weight-black">{dataComment.FullNameUnicode}</p>
						{dataComment.CommentContent}
					</div>
					<a className="a-reply" onClick={handleCommentsAction}>
						Phản hồi
					</a>
					<span className="time-comment">{fmDateFromNow(dataComment.CreatedOn)}</span>
					{replyCommentList.length > 0 && <ReplyComment replyCommentList={replyCommentList} />}
					{dataComment.isReply && !replyCommentList.length && (
						<div>{dataComment.isReply && <a onClick={() => checkFetchReplyComment(dataComment.ID)}>Xem các phản hồi</a>}</div>
					)}
					{addCommentAction && (
						<CommentForm isReplay={true} newsFeedCommentID={dataComment.ID} handleComment={checkHandleReplyComment} />
					)}

					{!replyCommentList.length &&
						dataComment.isReply &&
						isLoading.type === `FETCH_REPLY_COMMENT_${dataComment.ID}` &&
						isLoading.status && (
							<div className="text-center">
								<Spin />
							</div>
						)}
				</div>
			</div>
		</li>
	);
}

export default Comment;
