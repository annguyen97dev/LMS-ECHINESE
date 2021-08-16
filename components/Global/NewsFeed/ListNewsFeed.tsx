import React, { Fragment, useEffect, useState } from "react";
import { Popover, Button, Input } from 'antd';
import { ThumbsUp, MessageCircle, MoreHorizontal } from "react-feather";
import moment from "moment";
import { newsFeedLikeApi, newsFeedCommentApi, newsFeedCommentReplyApi } from "~/apiBase";

const ListNewsFeed = (props) => {
    const { dataUser, dataNewsFeed } = props;

    // console.log(dataNewsFeed);

    const content = () => {
        return (
            <>
                <ul className="more-list">
                    <li><button className="btn">Xóa</button></li>
                    <li><button className="btn">Chỉnh sửa</button></li>
                </ul>
            </>
        )
    }

    const ItemComment = (data) => {
        const [addCommentAction, setCommentAction] = useState(false);
        const [commentReply, setCommentReply] = useState<INewsFeedCommentReply[]>([]);

        // console.log("Data Comment", data);

        const handleCommentsAction = () => {
            setCommentAction(!addCommentAction);
        }

        const getCommentReply = async () => {
            try {
                let res = await newsFeedCommentReplyApi.getAll({selectAll: true, NewsFeedCommentID: data.data?.ID});
                if(res.status == 200) {
                    setCommentReply(res.data.data);
                }
            } catch (error) {
                console.log("Lỗi", error.message);
            }
        }

        const commentReplyNewsFeed = async (data) => {
            try {
                let res = await newsFeedCommentReplyApi.add(data);
                if(res.status == 204) {
                    console.log("Không có dữ liệu");
                }
                if(res.status == 200) {
                    getCommentReply();
                }
            } catch (error) {
                console.log("Lỗi: ", error.message);
            }
        }

        // console.log("Data Comment Reply", commentReply);

        useEffect(() => {
            // getCommentReply();
        }, []);

        return (
        <li className="item-comment">
            <div className="info-current-user">
                <div className="avatar">
                    <img
                        src={
                        data.data?.Avatar
                            ? data.data.Avatar
                            : "/images/user.jpg"
                        }
                        alt=""
                    />
                </div>
                <div className="content-comment">
                    <div className="box-comment">
                        <p className="name-comment font-weight-black">{data.data?.FullNameUnicode}</p>
                        {data.data?.CommentContent}
                    </div>
                    <a className="a-reply" onClick={handleCommentsAction}>Phản hồi</a> <span className="time-comment">{moment(data.data?.CreatedOn).format("DD/MM/YYYY HH:mm")}</span>
                    {addCommentAction ? (
                        <CommentAction 
                            reply={true} 
                            id={data.data?.ID} 
                            commentReplyNewsFeed={(data) => commentReplyNewsFeed(data)}/>
                    ): (<></>)}
                    {Object.keys(commentReply).length > 0 ? (
                        <ul className="list-comments">
                            {commentReply?.map((item, index) => (
                                <li key={index} className="item-comment">
                                <div className="info-current-user">
                                    <div className="avatar">
                                        <img
                                            src={
                                                item?.Avatar
                                                ? item.Avatar
                                                : "/images/user.jpg"
                                            }
                                            alt=""
                                        />
                                    </div>
                                    <div className="content-comment">
                                        <div className="box-comment">
                                            <p className="name-comment font-weight-black">{item?.FullNameUnicode}</p>
                                            {item?.ReplyContent}
                                        </div>
                                        <span className="time-comment">{moment(item?.CreatedOn).format("DD/MM/YYYY HH:mm")}</span>
                                    </div>
                                </div>
                            </li>
                            ))}
                        </ul>
                    ) : (<></>)}
                </div>
            </div>
        </li>
        )
    }

    const CommentAction = (props) => {

        const onPressEnter = (e) => {
            if(!props.reply) {
                props.commentNewsFeed({
                    NewsFeedID: props.id,
                    CommentContent: e.target.value
                })
            } else {
                props.commentReplyNewsFeed({
                    NewsFeedCommentID: props.id,
                    ReplyContent: e.target.value
                })
            }
        }

        return (
        <div className="info-current-user user-comment">
            <div className="avatar">
                <img
                    src={
                    dataUser?.Avatar
                        ? dataUser.Avatar
                        : "/images/user.jpg"
                    }
                    alt=""
                />
            </div>
            <div className="input-comments">
                <Input className="style-input" placeholder="Bạn muốn bình luận" onPressEnter={(e) => onPressEnter(e)} />
            </div>
        </div>
        )
    }

    const NewsFeed = (data) => {
        const [showComments, setShowComments] = useState(false);
        const [totalLike, setTotalLike] = useState(0);
        const [totalComment, setTotalComment] = useState(0);
        const [listComment, setListComment] = useState<INewsFeedComment[]>([]);
        const [liked, setLiked] = useState(false);
        const handleShowComments = () => {
            setShowComments(!showComments);
        }

        // console.log("Data: ", data);

        const getTotalLike = async () => {
            try {
                let res = await newsFeedLikeApi.getAll({selectAll: true, NewsFeedID: data.data?.ID});
                if(res.status == 200) {
                    setTotalLike(res.data.totalRow)
                } if(res.status == 204) {
                    setTotalLike(0);
                }
            } catch (error) {
                console.log("Lỗi", error.message);
            }
        }

        const checkedLike = async () => {
            try {
                let res = await newsFeedLikeApi.getAll({selectAll: true, NewsFeedID: data.data?.ID, UserInformationID: dataUser?.UserInformationID});
                if(res.status == 200) {
                    if(res.data.totalRow > 0) {
                        setLiked(true);
                    } else {
                        setLiked(false)
                    }
                }
                if(res.status == 204) {
                    setLiked(false);
                }
            } catch (error) {
                console.log("Lỗi", error.message);
            }
        }

        const getTotalComment = async () => {
            try {
                let res = await newsFeedCommentApi.getAll({selectAll: true, NewsFeedID: data.data?.ID});
                if(res.status == 200) {
                    setTotalComment(res.data.totalRow);
                    setListComment(res.data.data);
                }
            } catch (error) {
                console.log("Lỗi", error.message);
            }
        }

        const likeNewsFeed = async (id) => {
            const data = {
                NewsFeedID: id
            }

            try {
                let res = await newsFeedLikeApi.add(data);
                if(res.status == 204) {
                    console.log("Không có dữ liệu");
                }
                if(res.status == 200) {
                    getTotalLike();
                    checkedLike();
                }
            } catch (error) {
                console.log("Lỗi: ", error.message);
            }
        }

        const commentNewsFeed = async (data) => {
            try {
                let res = await newsFeedCommentApi.add(data);
                if(res.status == 204) {
                    console.log("Không có dữ liệu");
                }
                if(res.status == 200) {
                    getTotalComment();
                }
            } catch (error) {
                console.log("Lỗi: ", error.message);
            }
        }

        useEffect(() => {
            // getTotalLike();
            // getTotalComment();
            // checkedLike();
        }, [])

        return (
        <li className="item-nf">
            <div className="newsfeed">
                <div className="newsfeed-header">
                    <div className="info-current-user">
                        <div className="avatar">
                            <img
                                src={
                                data.data?.Avatar
                                    ? data.data?.Avatar
                                    : "/images/user.jpg"
                                }
                                alt=""
                            />
                        </div>
                        <div className="name-user">
                            <p className="name">
                                {data.data?.FullNameUnicode}
                                <span className="share-point">Chia sẻ trong</span>
                                {data.data?.GroupNewsFeedName 
                                ? data.data?.GroupNewsFeedName 
                                : data.data?.NewsFeedBranch.map((item, index) => (
                                    <span key={index} className="item-branch">{item.BranchName}</span>
                                ))}
                            </p>
                            <span className="newsfeed-time">{moment(data.data?.CreatedOn).format("DD/MM/YY HH:mm")}</span>
                        </div>
                    </div>
                    <div className="newsfeed-more">
                        <Popover content={content} trigger="click">
                            <button className="btn-more">
                                <MoreHorizontal />
                            </button>
                        </Popover>
                    </div>
                </div>
                <div className="newsfeed-content">
                    <p>{data.data?.Content}</p>
                </div>
                <div className="newsfeed-total">
                    <p><ThumbsUp color="#0571e5"/> {totalLike}</p>
                    <p>{totalComment} Bình luận</p>
                </div>
                <div className="newsfeed-action">
                    <div className="action">
                        <button 
                            className={liked ? "btn btn-light active" : "btn btn-light"} 
                            onClick={() => likeNewsFeed(data.data?.ID)}>
                            <ThumbsUp />
                            <span>Like</span>
                        </button>
                    </div>
                    <div className="action">
                        <button className="btn btn-light" onClick={handleShowComments}>
                            <MessageCircle />
                            <span>Bình luận</span>
                        </button>
                    </div>
                </div>
                <div className={showComments ? "newsfeed-comments" : "hide"}>
                    <CommentAction reply={false} id={data.data?.ID} commentNewsFeed={(data) => commentNewsFeed(data)}/>
                    <ul className="list-comments">
                        {listComment?.map((item, index) => (
                            <ItemComment key={index} data={item} />
                        ))}
                    </ul>
                </div>
            </div>
        </li>
        )
    }

    return (
        <>
            <ul className="list-nf">
                {dataNewsFeed.map((item, index) => (
                    <NewsFeed key={index}  data={item}/>
                ))}
            </ul>
        </>
    )

}

export default ListNewsFeed;