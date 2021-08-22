import React, { Fragment, useEffect, useState } from "react";
import { Popover, Button, Input, Modal, Form, Tooltip, Select, Image } from 'antd';
import { ThumbsUp, MessageCircle, MoreHorizontal, Users, Send , Home, Navigation, EyeOff, Trash2, Edit2, AlertTriangle } from "react-feather";
import { FileImageFilled, GroupOutlined, TeamOutlined } from "@ant-design/icons";
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
            _handleRemove,        
            groupNewsFeed, 
            userBranch, 
            inGroup, 
            inTeam,
            isLoading } = props;

    const content = (data) => {
        const [isVisibleModal, setIsVisibleModal] = useState(false);
        const [isOpenUploadFile, setIsOpenUploadFile] = useState(false);
        const [visibleSelectBranch, setVisibleSelectBranch] = useState(false);
        const [chooseBranch, setChooseBranch] = useState('team');
        const { showNoti } = useWrap();
        const [branchList, setBranchList]= useState([]);
        const [dataDelete, setDataDelete]  = useState({
            ID: null,
            Enable: null,
        });
        const [isModalVisible, setIsModalVisible] = useState(false);

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

        const hiddenPost = () => {
            // console.log(data);
            console.log("Data submit: ", dataDelete);
            _handleRemove(dataDelete)
        }

        const [form] = Form.useForm();

        const {
            register,
            handleSubmit,
            setValue,
            formState: { isSubmitting, errors, isSubmitted },
        } = useForm();
    
        const onSubmit = handleSubmit((data: any) => {
            console.log("Data submit: ", data);
            props._onSubmit(data);
            setIsVisibleModal(false);
            form.resetFields();
            setValue("Content", "");
            setValue("BranchList", "");
            setValue("GroupNewsFeedID", "");
            setValue("NewsFeedFile", "");
        });

        const setChooseBranchFunc = (data) => {
            setChooseBranch(data);
            if(data == 'team') {
                setValue('GroupNewsFeedID', null);
            }
            if(data == 'group') {
                setValue("BranchList", null) 
            }
        }

        const defaultValueBranchList = [];
        for(let i=0; i < data.NewsFeedBranch.length; i++) {
            defaultValueBranchList.push(data.NewsFeedBranch[i].BranchID);
        }
        // console.log(defaultValueMutipleSelect);
        // console.log(chooseBranch);
        // console.log("News branchList: ", branchList);
        useEffect(() => {
            if(isVisibleModal) {
                console.log("Data Index", data);
                if(data.GroupNewsFeedName != "") {
                    setChooseBranch('group');
                    setValue("GroupNewsFeedID", data.GroupNewsFeedID);
                }
                else if(Object.keys(data.NewsFeedBranch).length > 0) {
                    setChooseBranch('team');
                    console.log('team');
                    setValue("BranchList", defaultValueBranchList);
                }
                if(Object.keys(data.NewsFeedFile).length > 0) {
                    setIsOpenUploadFile(true);
                    setValue("NewsFeedFile", data.NewsFeedFile);
                }
                setValue("ID", data.ID);
            }
        }, [isVisibleModal]);

        return (
            <>
                <ul className="more-list">
                    {dataUser?.UserInformationID == data.UserInformationID ? (
                        <li>
                            <button className="btn" onClick={showModal}><Edit2 />Chỉnh sửa bài viết</button>
                        </li>
                    ) : ""}
                    <li>
                        <button 
                            className="btn del" 
                            onClick={() => {
                                setIsModalVisible(true);
                                setDataDelete({
                                    ID: data.ID,
                                    Enable: false,
                                });
                            }}
                        >
                            <Trash2 />Xóa bài viết
                        </button>
                    </li>

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
                                    <UploadMutipleFile 
                                        getValue={(value) => setValue("NewsFeedFile", value)}
                                        imagesOld={data.NewsFeedFile}
                                    />
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
                                                        <div className={isOpenUploadFile ? "btn active" : "btn"} onClick={openUploadFile}>
                                                            <FileImageFilled style={{color: "#10ca93"}}/>
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                                {inTeam != null || inGroup != null ? (
                                                <>
                                                <div className="item-option">
                                                    <Tooltip title="Chia sẻ vào trung tâm">
                                                        <div className={inTeam != null ? "btn active" : "btn disable"}>
                                                            <GroupOutlined style={{color: "#ffc107"}}/>
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                                <div className="item-option">
                                                    <Tooltip title="Chia sẻ vào nhóm">
                                                        <div className={inGroup != null ? "btn active" : "btn disable"}>
                                                            <TeamOutlined style={{color: "#00afef"}}/>
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                                </>
                                                ) : (
                                                <>
                                                <div className="item-option">
                                                    <Tooltip title="Chia sẻ vào trung tâm">
                                                        <div className={chooseBranch == 'team' ? "btn active" : "btn disable"} onClick={() => setChooseBranchFunc('team')}>
                                                            <GroupOutlined style={{color: "#ffc107"}}/>
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                                <div className="item-option">
                                                    <Tooltip title="Chia sẻ vào nhóm">
                                                        <div className={chooseBranch == 'group' ? "btn active" : "btn disable"} onClick={() => setChooseBranchFunc('group')}>
                                                            <TeamOutlined style={{color: "#00afef"}}/>
                                                        </div>
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
                <Modal
				title={<AlertTriangle color="red" />}
                    visible={isModalVisible}
                    onOk={() => hiddenPost()}
                    onCancel={() => setIsModalVisible(false)}
                >
                    <span className="text-confirm">Bạn có chắc chắn muốn xóa không ?</span>
                </Modal>
            </>
        )
    }

    const CommentAction = (props) => {
        const [form] = Form.useForm();
        const {
            register,
            handleSubmit,
            setValue,
            formState: { isSubmitting, errors, isSubmitted },
        } = useForm();

        const onChange = (e) => {
            if(!props.reply) {
                setValue("CommentContent", e.target.value);
            } else {
                setValue("ReplyContent", e.target.value);
            }
        }

        const onsubmit = handleSubmit((data) => {
            console.log("Data submit: ", data);
            if(!props.reply) {
                let res = props.commentNewsFeed(data);
                res.then(function (rs: any) {
                    rs && rs.status == 200 && form.resetFields();
                });
            } else {
                console.log("Reply");
                let res = props.commentReplyNewsFeed(data);
                res.then(function (rs: any) {
                    rs && rs.status == 200 && form.resetFields(), props.handleCommentsAction();
                });
            }
        });

        useEffect(() => {
            if(!props.reply) {
                setValue("NewsFeedID", props.id)
            } else {
                setValue("NewsFeedCommentID", props.id)
            }
        }, [])

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
                <Form form={form} onFinish={onsubmit}>
                    <Form.Item name="form bình luận">
                        <Input 
                            className="style-input" 
                            placeholder="Viết bình luận ..."
                            onChange={(e) => onChange(e)}
                            onPressEnter={onsubmit}
                            id={`form-comment-${props.id}`}
                        />
                    </Form.Item>
                </Form>
            </div>
        </div>
        )
    }

    const ReplyComment = (props) => {
        const [commentReply, setCommentReply] = useState<INewsFeedCommentReply[]>([]);
        const getCommentReply = async () => {
            try {
                let res = await newsFeedCommentReplyApi.getAll({selectAll: true, NewsFeedCommentID: props.id});
                if(res.status == 200) {
                    setCommentReply(res.data.data);
                } if(res.status == 204) {
                    return;
                }
            } catch (error) {
                console.log("Lỗi", error.message);
            }
        }

        useEffect(() => {
            getCommentReply();
        }, []);

        return (
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
        )
    }

    const Comments = (props) => {
        const { dataCommentIndex, commentReplyNewsFeed } = props;
        const [addCommentAction, setCommentAction] = useState(false);

        const handleCommentsAction = () => {
            setCommentAction(!addCommentAction);
        }

        return (
        <li className="item-comment">
            <div className="info-current-user">
                <div className="avatar">
                    <img
                        src={
                            dataCommentIndex?.Avatar
                            ? dataCommentIndex?.Avatar
                            : "/images/user.jpg"
                        }
                        alt=""
                    />
                </div>
                <div className="content-comment">
                    <div className="box-comment">
                        <p className="name-comment font-weight-black">{dataCommentIndex?.FullNameUnicode}</p>
                        {dataCommentIndex?.CommentContent}
                    </div>
                    <a className="a-reply" onClick={handleCommentsAction}>Phản hồi</a> <span className="time-comment">{moment(dataCommentIndex?.CreatedOn).format("DD/MM/YYYY HH:mm")}</span>
                    {addCommentAction && (
                        <CommentAction 
                            reply={true} 
                            id={dataCommentIndex?.ID}
                            commentReplyNewsFeed={(data) => commentReplyNewsFeed(data)}
                            handleCommentsAction={() => handleCommentsAction()}
                        />
                    )}
                    {dataCommentIndex.isReply && (
                        <ReplyComment 
                            id={dataCommentIndex?.ID}
                        />
                    )}
                </div>
            </div>
        </li>
        )
    }

    const NewsFeed = (data) => {
        const [showComments, setShowComments] = useState(false);
        const [totalLike, setTotalLike] = useState(0);
        const [totalComment, setTotalComment] = useState(0);
        const [listComment, setListComment] = useState<INewsFeedComment[]>([]);
        const [visible, setVisible] = useState(false);

        const [liked, setLiked] = useState(false);
        const handleShowComments = () => {
            setShowComments(!showComments);
        }

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
                    // checkedLike();
                }
            } catch (error) {
                console.log("Lỗi: ", error.message);
            }
        }

        const commentNewsFeed = async (data) => {
            let res;
            try {
                res = await newsFeedCommentApi.add(data);
                if(res.status == 204) {
                    console.log("Không có dữ liệu");
                }
                if(res.status == 200) {
                    getTotalComment();
                }
            } catch (error) {
                console.log("Lỗi: ", error.message);
            }
            return res;
        }

        const _onSearch = (e) => {
            onSearch(e.target.text);
        }

        const commentReplyNewsFeed = async (data) => {
            let res;
            try {
                res = await newsFeedCommentReplyApi.add(data);
                if(res.status == 204) {
                    console.log("Không có dữ liệu");
                }
                if(res.status == 200) {
                    getTotalComment();
                }
            } catch (error) {
                console.log("Lỗi: ", error.message);
            }
            return res;
        }

        // console.log("Data comment: ", listComment);

        useEffect(() => {
            if(!isLoading.status) {
                if(data.data?.isLike) {
                    getTotalLike();
                    checkedLike();
                }
                if(data.data?.isComment) {
                    getTotalComment();
                }
            }
        }, []);

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
                {Object.keys(data.data?.NewsFeedFile.filter((item) => item.Type == 2)).length > 0 && (
                <div className="newsfeed-images">
                    {Object.keys(data.data?.NewsFeedFile.filter((item) => item.Type == 2)).length > 2 ? (
                        <div className="more-than-3-images">
                        {data.data?.NewsFeedFile.filter((item, idx) => idx < 2 && item.Type == 2).map((item, index) => (
                            <Image
                                preview={{ visible: false }}
                                width={"50%"}
                                src={item.NameFile}
                                onClick={() => setVisible(true)}
                                key={index}
                            />
                        ))}
                            <div className="preview-total" onClick={() => setVisible(true)}>
                                + {Object.keys(data.data?.NewsFeedFile).length - 2}
                            </div>
                        </div>
                    ) : (
                        <>
                        {Object.keys(data.data?.NewsFeedFile.filter((item) => item.Type == 2)).length == 1 ? (
                            <div className="one-image">
                            {data.data?.NewsFeedFile.filter((item, idx) => item.Type == 2).map((item, index) => (
                                <Image
                                    preview={{ visible: false }}
                                    width={"100%"}
                                    src={item.NameFile}
                                    onClick={() => setVisible(true)}
                                    key={index}
                                />
                            ))}
                            </div>
                        ) : (
                            <div className="two-images">
                            {data.data?.NewsFeedFile.filter((item, idx) => item.Type == 2).map((item, index) => (
                                <Image
                                    preview={{ visible: false }}
                                    width={"50%"}
                                    src={item.NameFile}
                                    onClick={() => setVisible(true)}
                                    key={index}
                                />
                            ))}
                            </div>
                        )}

                        </>
                    )}
                    <div style={{ display: 'none' }}>
                        <Image.PreviewGroup preview={{ visible, onVisibleChange: vis => setVisible(vis) }}>
                        {data.data?.NewsFeedFile.filter((item) => item.Type == 2).map((item, index) => (
                            <Image src={item.NameFile} key={index} />
                        ))}
                        </Image.PreviewGroup>
                    </div>
                </div>
                ) }
                {Object.keys(data.data?.NewsFeedFile.filter((item) => item.Type == 3)).length > 0 && (
                <div className="newsfeed-audio">
                    {data.data?.NewsFeedFile.filter((item) => item.Type == 3).map((item, index) => (
                        <audio className="audio-tag" controls key={index}>
                            <source src={item.NameFile} type="audio/mpeg" />
                        </audio>
                    ))}
                </div>
                )}
                <div className="newsfeed-total">
                    {totalLike > 0 && (
                        <p><ThumbsUp color="#0571e5"/> {totalLike}</p>
                    )}
                    {totalComment > 0 && (
                        <p className="total-comments" onClick={() => setShowComments(!showComments)}>{totalComment} Bình luận</p>
                    )}
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
                    <CommentAction
                        getTotalComment={getTotalComment} 
                        reply={false} 
                        id={data.data?.ID} 
                        commentNewsFeed={(data) => commentNewsFeed(data)}
                    />
                    {totalComment > 0 && (
                        <ul className="list-comments">
                            {listComment?.map((item, index) => (
                                <Comments 
                                    key={index} 
                                    dataCommentIndex={item}
                                    commentReplyNewsFeed={(data) => commentReplyNewsFeed(data)}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </li>
        )
    }

    return (
        <>
            <ul className="list-nf">
                {dataNewsFeed && dataNewsFeed.map((item, index) => (
                    <NewsFeed key={index}  data={item}/>
                ))}
            </ul>
        </>
    )

}

export default ListNewsFeed;