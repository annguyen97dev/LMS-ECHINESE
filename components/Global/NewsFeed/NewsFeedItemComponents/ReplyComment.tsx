import PropTypes from 'prop-types';
import React from 'react';
import { fmDateFromNow } from '~/utils/functions';

ReplyComment.propTypes = {
	replyCommentList: PropTypes.shape({
		ID: PropTypes.number,
		NewsFeedCommentID: PropTypes.number,
		UserInformationID: PropTypes.number,
		FullNameUnicode: PropTypes.string,
		ReplyContent: PropTypes.string,
		Avatar: PropTypes.string
	})
};
ReplyComment.defaultProps = {
	replyCommentList: {
		ID: 0,
		NewsFeedCommentID: 0,
		UserInformationID: 0,
		FullNameUnicode: '',
		ReplyContent: '',
		Avatar: ''
	}
};

function ReplyComment(props) {
	const { replyCommentList } = props;
	return (
		<ul className="list-comments">
			{replyCommentList.map((item: INewsFeedCommentReply, index) => (
				<li key={index} className="item-comment">
					<div className="info-current-user">
						<div className="avatar">
							<img src={item.Avatar || '/images/user.png'} alt="avatar" />
						</div>
						<div className="content-comment reply">
							<div className="box-comment">
								<p className="name-comment font-weight-black">{item.FullNameUnicode}</p>
								{item.ReplyContent}
							</div>
							<span className="time-comment">{fmDateFromNow(item.CreatedOn)}</span>
						</div>
					</div>
				</li>
			))}
		</ul>
	);
}

export default ReplyComment;
