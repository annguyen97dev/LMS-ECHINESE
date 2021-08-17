import React, { Fragment, useEffect, useState } from "react";
import { Popover, Button, Input, Modal, Form, Tooltip, Select } from 'antd';
import { ThumbsUp, MessageCircle, MoreHorizontal, Image, Users, Send, Home, Navigation  } from "react-feather";
import UploadMutipleFile from "./components/UploadMutipleFile";
import { useForm } from "react-hook-form";
import moment from "moment";
import { newsFeedLikeApi, newsFeedCommentApi, newsFeedCommentReplyApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";

const { TextArea } = Input;
const { Option } = Select;

const ListNewsFeed = (props) => {
    const { dataUser, 
            dataNewsFeed, 
            onSearch, 
            inGroupFunc, 
            inTeamFunc, 
            _onSubmit,        
            groupNewsFeed, 
            userBranch, 
            inGroup, 
            inTeam } = props;

    const hiddenPost = (data) => {
        // console.log(data);
        const dataSubmit = {
            ID: data.ID,
            Enable: false,
        }
        console.log(dataSubmit);
        _onSubmit(dataSubmit)
    }

    const content = (data) => {
        const [isVisibleModal, setIsVisibleModal] = useState(false);
        const [isOpenUploadFile, setIsOpenUploadFile] = useState(false);
        const [visibleSelectBranch, setVisibleSelectBranch] = useState(false);
        const [chooseBranch, setChooseBranch] = useState('team');
        const { showNoti } = useWrap();
        const [branchList, setBranchList]= useState([]);

        const showModal = () => {
            setIsVisibleModal(true);
        };
    
        const resetOption = () => {
            setIsOpenUploadFile(false);
            setVisibleSelectBranch(false);
        }
    
        const openUploadFile = () => {
            setIsOpenUploadFile(!isOpenUploadFile);
        };

        const [form] = Form.useForm();

        const {
            register,
            handleSubmit,
            setValue,
            formState: { isSubmitting, errors, isSubmitted },
        } = useForm();
    
        const onSubmit = handleSubmit((data: any) => {
            console.log("Data submit: ", data);
            if(Object.keys(data).length <= 2) {
                showNoti("danger", "Bạn chưa thay đổi");
                setIsVisibleModal(false);
            } else {
                props._onSubmit(data);
                setIsVisibleModal(false);
                form.resetFields();
                setValue("Content", "");
                setValue("BranchList", "");
                setValue("GroupNewsFeedID", "");
            }
        });

        const setChooseBranchFunc = (data) => {
            setChooseBranch(data);
        }

        // console.log("Data Index", data);
        const defaultValueBranchList = [];
        for(let i=0; i < data.NewsFeedBranch.length; i++) {
            defaultValueBranchList.push(data.NewsFeedBranch[i].BranchID);
        }
        // console.log(defaultValueMutipleSelect);
        // console.log(chooseBranch);
        // console.log("News branchList: ", branchList);
        useEffect(() => {
            if(data.GroupNewsFeedName != "") {
                setChooseBranch('group');
            }
            else if(Object.keys(data.NewsFeedBranch).length > 0) {
                setChooseBranch('team');
            }
            setValue("ID", data.ID);
            // setValue("BranchList", defaultValueBranchList);
            setValue("File", data.NewsFeedFile);
        }, []);

        return (
            <>
                <ul className="more-list">
                    <li><button className="btn" onClick={() => hiddenPost(data)}>Ẩn bài viết</button></li>
                    {dataUser?.UserInformationID == data.UserInformationID ? (
                        <li>
                            <button className="btn" onClick={showModal}>Chỉnh sửa bài viết</button>
                        </li>
                    ) : ""}
                </ul>
                <Modal 
                    title="Chỉnh sửa bài viết" 
                    visible={isVisibleModal} 
                    footer={null}
                    onCancel={() => {setIsVisibleModal(false), resetOption()}}
                    className="modal-create-nf"
                >
                    <div className="container-fluid wrap-create-nf">
                        <Form form={form} layout="vertical" onFinish={onSubmit}>
                            <div className="row">
                                <div className="col-12">
                                    <div className="info-current-user">
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
                                        <div className="name-user">
                                            <p className="name">{dataUser?.FullNameUnicode}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <Form.Item 
                                    name="Nội dung"
                                    initialValue={data.Content}
                                    >
                                <TextArea
                                    placeholder="Bạn đang nghĩ gì ?"
                                    rows={4}
                                    className="text-area-nf" 
                                    onChange={(e) => setValue("Content", e.target.value)}  
                                />
                                </Form.Item>
                            </div>
                            <div className={isOpenUploadFile ? "row" : "hide"}>
                                <div className="col-12">
                                    <UploadMutipleFile />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="option-for-nf">
                                        <div className="option-for-nf--header">
                                            <div className="text">
                                                <p>Thêm vào bài viết</p>
                                            </div>
                                            <div className="list-option">
                                                <div className="item-option">
                                                    <Tooltip title="Thêm Ảnh/Video">
                                                        <button className="btn" onClick={openUploadFile}>
                                                            <Image color="#10ca93"/>
                                                        </button>
                                                    </Tooltip>
                                                </div>
                                                {inTeam != null || inGroup != null ? (
                                                <>
                                                <div className="item-option">
                                                    <Tooltip title="Chia sẻ vào trung tâm">
                                                        <button className={inTeam != null ? "btn active" : "btn disable"}>
                                                            <Users color="#ffc107"/>
                                                        </button>
                                                    </Tooltip>
                                                </div>
                                                <div className="item-option">
                                                    <Tooltip title="Chia sẻ vào nhóm">
                                                        <button className={inGroup != null ? "btn active" : "btn disable"}>
                                                            <Home color="#00afef"/>
                                                        </button>
                                                    </Tooltip>
                                                </div>
                                                </>
                                                ) : (
                                                <>
                                                <div className="item-option">
                                                    <Tooltip title="Chia sẻ vào trung tâm">
                                                        <button className={chooseBranch == 'team' ? "btn active" : "btn disable"} onClick={() => setChooseBranchFunc('team')}>
                                                            <Users color="#ffc107"/>
                                                        </button>
                                                    </Tooltip>
                                                </div>
                                                <div className="item-option">
                                                    <Tooltip title="Chia sẻ vào nhóm">
                                                        <button className={chooseBranch == 'group' ? "btn active" : "btn disable"} onClick={() => setChooseBranchFunc('group')}>
                                                            <Home color="#00afef"/>
                                                        </button>
                                                    </Tooltip>
                                                </div>
                                                </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="option-for-nf--body">
                                            {inGroup != null || inTeam != null ? (
                                                <div className="choose-branch">
                                                    {inGroup != null ? (
                                                    <Form.Item>
                                                        {groupNewsFeed && groupNewsFeed.map((item, index) => (
                                                            item.ID == inGroup && (
                                                                <Input 
                                                                    className="style-input"
                                                                    value={item.Name}
                                                                />
                                                            )
                                                        ))}
                                                    </Form.Item>
                                                    ) : (
                                                    <Form.Item>
                                                        {userBranch && userBranch.map((item, index) => (
                                                            item.BranchID == inTeam && (
                                                                <Input 
                                                                    className="style-input"
                                                                    value={item.BranchName}
                                                                />
                                                            )
                                                        ))}
                                                    </Form.Item>
                                                    )}
                                                </div>
                                            ) : (
                                            <div className="choose-branch">
                                                {chooseBranch == 'team' ? (
                                                <Form.Item 
                                                    name="Chọn trung tâm"
                                                    rules={[
                                                        { required: true, message: "Bạn không được để trống" },
                                                    ]}
                                                    initialValue={defaultValueBranchList}
                                                >
                                                    <Select
                                                        mode="multiple"
                                                        placeholder="Chọn trung tâm"
                                                        className="style-input w-100"
                                                        allowClear={true}
                                                        onChange={(value) => setValue("BranchList", value)}
                                                        // onChange={(value) => setBranchList(value)}
                                                        // defaultValue={data.NewsFeedBranch}
                                                        // defaultValue={['a10', 'c12']}
                                                    >
                                                        {userBranch && userBranch.map((item, index) => (
                                                            <Option key={index} value={item.BranchID} >{item.BranchName}</Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                                ) : (
                                                <Form.Item 
                                                    name="Chọn nhóm"
                                                    rules={[
                                                        { required: true, message: "Bạn không được để trống" },
                                                    ]}
                                                    initialValue={data.GroupNewsFeedName}
                                                >
                                                    <Select
                                                        showSearch
                                                        placeholder="Chọn nhóm"
                                                        className="style-input w-100"
                                                        allowClear={true}
                                                        onChange={(value) => setValue("GroupNewsFeedID", value)}
                                                        disabled
                                                    >
                                                        {groupNewsFeed && groupNewsFeed.map((item, index) => (
                                                            <Option key={index} value={item.ID} >{item.Name}</Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                                )}
                                            </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row ">
                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary w-100">
                                    Lưu
                                    {/* {props.isLoading.type == "ADD_DATA" && props.isLoading.status && (
                                        <Spin className="loading-base" />
                                    )} */}
                                    </button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </Modal>
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
            getCommentReply();
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
                                    <div className="content-comment reply">
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
                <Input className="style-input" placeholder="Viết bình luận ..." onPressEnter={(e) => onPressEnter(e)} />
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
            setLiked(!liked);
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
        const _onSearch = (e) => {
            onSearch(e.target.text);
        }

        useEffect(() => {
            getTotalLike();
            getTotalComment();
            checkedLike();
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
                            <div className="name">
                                <a data-text={data.data?.FullNameUnicode} onClick={_onSearch}>{data.data?.FullNameUnicode}</a>
                                <span className="share-point"><Navigation/></span>
                                {data.data?.GroupNewsFeedName 
                                ? 
                                (
                                <ul>
                                    <li 
                                        value={data.data?.GroupNewsFeedID} 
                                        onClick={e => inGroupFunc(e)}>
                                            {data.data?.GroupNewsFeedName}
                                    </li>
                                </ul>
                                ) 
                                : (
                                    <ul>
                                        {data.data?.NewsFeedBranch.map((item, index) => (
                                            <li 
                                                key={index} 
                                                className="item-branch"
                                                value={item.BranchID} 
                                                onClick={e => inTeamFunc(e)}
                                            >
                                                    {item.BranchName}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <span className="newsfeed-time">{moment(data.data?.CreatedOn).format("DD/MM/YY HH:mm")}</span>
                        </div>
                    </div>
                    <div className="newsfeed-more">
                        <Popover content={content(data.data)} trigger="focus" placement="bottomRight">
                            <button className="btn-more">
                                <MoreHorizontal />
                            </button>
                        </Popover>
                    </div>
                </div>
                <div className="newsfeed-content">
                    <pre>{data.data?.Content}</pre>
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