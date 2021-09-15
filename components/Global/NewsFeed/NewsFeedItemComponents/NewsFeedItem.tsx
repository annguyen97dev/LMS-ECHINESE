import {Image, Popover, Spin} from 'antd';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {
	MessageCircle,
	MoreHorizontal,
	Navigation,
	ThumbsUp,
} from 'react-feather';
import {fmDateFromNow} from '~/utils/functions';
import Comment from './Comment';
import CommentForm from './CommentForm';

NewsFeedItem.propTypes = {
	// FILTER SEARCH HANDLE
	handleFilters: PropTypes.func,
	// LIKE HANDLE
	isUserLiked: PropTypes.bool,
	handleUserLikeNewsFeed: PropTypes.func,
	// COMMENT HANDLE
	handleComment: PropTypes.func,
	fetchComment: PropTypes.func,
	// REPLY HANDLE
	handleReplyComment: PropTypes.func,
	fetchReplyComment: PropTypes.func,
	// INFORMATION
	item: PropTypes.shape({
		ID: PropTypes.number,
		UserInformationID: PropTypes.number,
		FullNameUnicode: PropTypes.string,
		Avatar: PropTypes.string,
		RoleID: PropTypes.number,
		RoleName: PropTypes.string,
		GroupNewsFeedID: PropTypes.number,
		GroupNewsFeedName: PropTypes.string,
		Content: PropTypes.string,
		TypeFile: PropTypes.number,
		isComment: PropTypes.bool,
		CommentCount: PropTypes.number,
		isLike: PropTypes.bool,
		LikeCount: PropTypes.number,
		NewsFeedFile: PropTypes.arrayOf(
			PropTypes.shape({
				ID: PropTypes.number,
				NameFile: PropTypes.string,
				Type: PropTypes.number,
				TypeName: PropTypes.string,
				UID: PropTypes.string,
				Thumnail: PropTypes.string,
			})
		),
		NewsFeedBranch: PropTypes.arrayOf(
			PropTypes.shape({
				ID: PropTypes.number,
				BranchID: PropTypes.number,
				BranchName: PropTypes.string,
			})
		),
	}),
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	userComment: PropTypes.object,
	//COMPONENT
	moreActionComponent: PropTypes.element,
};
NewsFeedItem.defaultProps = {
	// FILTER SEARCH HANDLE
	handleFilters: null,
	// LIKE HANDLE
	isUserLiked: false,
	handleUserLikeNewsFeed: null,
	// COMMENT HANDLE
	handleComment: null,
	fetchComment: null,
	// REPLY HANDLE
	handleReplyComment: null,
	fetchReplyComment: null,
	// INFORMATION
	item: {
		ID: 0,
		UserInformationID: 0,
		FullNameUnicode: '',
		Avatar: '',
		RoleID: 0,
		RoleName: '',
		GroupNewsFeedID: 0,
		GroupNewsFeedName: '',
		Content: '',
		TypeFile: 0,
		isComment: false,
		CommentCount: 0,
		isLike: false,
		LikeCount: 0,
		NewsFeedFile: [],
		NewsFeedBranch: [],
	},
	isLoading: {type: '', status: false},
	userComment: {},
	//COMPONENT
	moreActionComponent: null,
};
function NewsFeedItem(props) {
	const {
		// FILTER SEARCH HANDLE
		handleFilters,
		// LIKE HANDLE
		isUserLiked,
		handleUserLikeNewsFeed,
		// COMMENT HANDLE
		handleComment,
		fetchComment,
		// REPLY HANDLE
		handleReplyComment,
		fetchReplyComment,
		// INFORMATION
		item,
		isLoading,
		userComment,
		// COMPONENT
		moreActionComponent,
	} = props;
	const [showComments, setShowComments] = useState(false);
	const [commentList, setCommentList] = useState<INewsFeedComment[]>([]);
	const [visible, setVisible] = useState(false);

	const handleShowComments = () => {
		setShowComments(!showComments);
	};

	// FILTER AND SORT
	const checkHandleFilters = (field: string, value) => {
		if (!handleFilters) return;
		return () => handleFilters(field, value);
	};
	// LIKE
	const checkHandleUserLikeNewsFeed = (ID: number) => {
		if (!handleUserLikeNewsFeed) return;
		handleUserLikeNewsFeed(ID);
	};
	// COMMENT
	const checkHandleComment = (data: {
		CommentContent: string;
		NewsFeedID: number;
	}) => {
		if (!handleComment) return;
		return handleComment(data).then((res) => {
			if (res?.status === 200) {
				setCommentList([res.data.data, ...commentList]);
				return true;
			} else {
				return false;
			}
		});
	};
	const checkFetchComment = (ID: number) => {
		if (!fetchComment) return;
		if (!showComments) {
			fetchComment(ID).then((res) => {
				if (res?.status === 200) {
					setCommentList(res.data.data);
				} else {
					setCommentList([]);
				}
			});
		}
	};

	// IMAGES LIST
	const checkUIImageList = (imageList) => {
		const length = imageList.length;
		if (length >= 3) {
			return (
				<div className="more-than-3-images">
					{imageList.slice(0, 2).map((item, index) => (
						<Image
							key={index}
							src={item.NameFile}
							preview={false}
							width={'50%'}
							onClick={() => setVisible(true)}
						/>
					))}
					<div className="preview-total" onClick={() => setVisible(true)}>
						+ {imageList.length - 2}
					</div>
				</div>
			);
		}
		if (length >= 2) {
			return (
				<div className="two-images">
					{imageList.map((item, index) => (
						<Image
							key={index}
							src={item.NameFile}
							preview={false}
							width={'50%'}
							onClick={() => setVisible(true)}
						/>
					))}
				</div>
			);
		}
		if (length >= 1) {
			return (
				<div className="one-image">
					{imageList.map((item, index) => (
						<Image
							key={index}
							src={item.NameFile}
							preview={false}
							width={'100%'}
							onClick={() => setVisible(true)}
						/>
					))}
				</div>
			);
		}
	};
	const renderImageList = () => {
		const imageList = item.NewsFeedFile.filter((item) => item.Type === 2);
		if (imageList.length > 0) {
			return (
				<div className="newsfeed-images">
					{checkUIImageList(imageList)}
					<div style={{display: 'none'}}>
						<Image.PreviewGroup
							preview={{
								visible,
								onVisibleChange: (vis) => setVisible(vis),
							}}
						>
							{imageList.map((item, index) => (
								<Image src={item.NameFile} key={index} />
							))}
						</Image.PreviewGroup>
					</div>
				</div>
			);
		}
	};
	// AUDIO LIST
	const renderAudioList = () => {
		const audioList = item.NewsFeedFile.filter((item) => item.Type === 3);
		if (audioList.length > 0) {
			return (
				<div className="newsfeed-audio">
					{audioList.map((item, index) => (
						<audio className="audio-tag" controls key={index}>
							<source src={item.NameFile} type="audio/ogg" />
							<source src={item.NameFile} type="audio/mpeg" />
							Your browser does not support the audio element.
						</audio>
					))}
				</div>
			);
		}
	};
	// VIDEO LIST
	const renderVideoList = () => {
		const videoList = item.NewsFeedFile.filter((item) => item.Type === 4);
		if (videoList.length > 0) {
			return (
				<div className="newsfeed-video">
					{videoList.map((item, index) => (
						<video className="video-tag" controls key={index}>
							<source src={item.NameFile} type="video/mp4" />
							<source src={item.NameFile} type="video/ogg" />
							Your browser does not support the video tag.
						</video>
					))}
				</div>
			);
		}
	};
	// LIGHT BOX
	const renderNewsFeedBackground = () => {
		const isNewsFeedBackground = item.TypeFile === 1;
		if (isNewsFeedBackground && item.NewsFeedFile.length === 1) {
			const backgroundFile = item.NewsFeedFile[0];
			return (
				<div
					className="newsfeed-background"
					style={{
						color: item.Color,
						backgroundImage: `url(${backgroundFile.NameFile})`,
					}}
				>
					{item.Content}
				</div>
			);
		}
	};
	return (
		<li className="item-nf">
			<div className="newsfeed">
				<div className="newsfeed-header">
					<div className="info-current-user">
						<div className="avatar">
							<img src={item.Avatar || '/images/user.jpg'} alt="avatar" />
						</div>
						<div className="name-user">
							<div className="name">
								<a onClick={checkHandleFilters('name', item.FullNameUnicode)}>
									{item.FullNameUnicode}
								</a>
								<span className="share-point">
									<Navigation />
								</span>
								{item.GroupNewsFeedName ? (
									<ul>
										<li
											onClick={checkHandleFilters(
												'idGroup',
												item.GroupNewsFeedID
											)}
										>
											{item.GroupNewsFeedName}
										</li>
									</ul>
								) : (
									<ul>
										{item.NewsFeedBranch.map((item, idx) => (
											<li
												key={idx}
												className="item-branch"
												onClick={checkHandleFilters('idTeam', item.BranchID)}
											>
												{item.BranchName}
											</li>
										))}
									</ul>
								)}
							</div>
							<span className="newsfeed-time">
								{fmDateFromNow(item.CreatedOn)}
							</span>
						</div>
					</div>
					<div className="newsfeed-more">
						{moreActionComponent && (
							<Popover
								// trigger="focus"
								zIndex={999}
								content={moreActionComponent}
								placement="bottomRight"
							>
								<button className="btn-more">
									<MoreHorizontal />
								</button>
							</Popover>
						)}
					</div>
				</div>
				{item.Content && item.TypeFile !== 1 && (
					<div
						className="newsfeed-content"
						style={{
							color: item.Color,
						}}
					>
						<span>{item.Content}</span>
					</div>
				)}
				{/* SHOW IMAGE OR FILE */}
				{renderImageList()}
				{renderVideoList()}
				{renderAudioList()}
				{renderNewsFeedBackground()}
				<div className="newsfeed-total">
					{item.LikeCount > 0 && (
						<p>
							<ThumbsUp color="#0571e5" /> {item.LikeCount}
						</p>
					)}
					{(commentList.length > 0 || item.CommentCount > 0) && (
						<p
							className="total-comments"
							onClick={() => {
								checkFetchComment(item.ID);
								handleShowComments();
							}}
						>
							{commentList.length || item.CommentCount} Bình luận
						</p>
					)}
				</div>
				<div className="newsfeed-action">
					<div className="action">
						<button
							className={isUserLiked ? 'btn btn-light active' : 'btn btn-light'}
							onClick={() => checkHandleUserLikeNewsFeed(item.ID)}
						>
							<ThumbsUp />
							<span>Like</span>
						</button>
					</div>
					<div className="action">
						<button
							className="btn btn-light"
							onClick={() => {
								checkFetchComment(item.ID);
								handleShowComments();
							}}
						>
							<MessageCircle />
							<span>Bình luận</span>
						</button>
					</div>
				</div>
				<div className={showComments ? 'newsfeed-comments' : 'hide'}>
					<CommentForm
						isLoading={isLoading}
						userComment={userComment}
						handleComment={checkHandleComment}
						newsFeedID={item.ID}
					/>
					{commentList.length > 0 && (
						<ul className="list-comments">
							{commentList.map((cmt, index) => (
								<Comment
									key={cmt.ID}
									isLoading={isLoading}
									dataComment={cmt}
									fetchReplyComment={fetchReplyComment}
									handleReplyComment={handleReplyComment}
								/>
							))}
						</ul>
					)}
					{!commentList.length &&
						isLoading.type === `FETCH_COMMENT_${item.ID}` &&
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

export default NewsFeedItem;
