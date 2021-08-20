import React, { Fragment, useEffect, useState } from "react";
import { Image, Users, Send, Home } from "react-feather";
import { useWrap } from "~/context/wrap";
import { Form, Modal, Button, Input, Tooltip, Upload, Popover, Select, Spin } from 'antd';
import { FileImageFilled, GroupOutlined, TeamOutlined } from "@ant-design/icons";
import { PlusOutlined } from '@ant-design/icons';
import UploadMutipleFile from "./components/UploadMutipleFile";
import { useForm } from "react-hook-form";
const { TextArea } = Input;
const { Option } = Select;

const CreateNewsFeed = (props) => {
    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const [isOpenUploadFile, setIsOpenUploadFile] = useState(false);
    const [visibleSelectBranch, setVisibleSelectBranch] = useState(false);
    const [chooseBranch, setChooseBranch] = useState('team');

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
    });

    const { dataUser, groupNewsFeed, userBranch, inGroup, inTeam } = props;

    const showModal = () => {
        setIsVisibleModal(true);
    };

    const showModalUploadImage = () => {
        setIsVisibleModal(true);
        setIsOpenUploadFile(true);
    };

    const showModalSelectBranch = () => {
        setIsVisibleModal(true);
        setVisibleSelectBranch(true);
        setChooseBranchFunc('group');
    };

    const resetOption = () => {
        setIsOpenUploadFile(false);
        setVisibleSelectBranch(false);
        setChooseBranchFunc('team');
    }

    const openUploadFile = () => {
        setIsOpenUploadFile(!isOpenUploadFile);
    };

    const setChooseBranchFunc = (data) => {
        setChooseBranch(data);
    }

    useEffect(() => {
        if(inGroup != null || inTeam != null) {
            if(inGroup != null) { 
                setValue("GroupNewsFeedID", inGroup); 
                setValue("BranchList", null) 
            } 
            else { 
                setValue("BranchList", [inTeam]); 
                setValue("GroupNewsFeedID", null)
            }
        }
    })

    return (
        <>
        <div className="create-newsfeed">
            <div className="top-nf">
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
                <div className="box-newsfeed">
                    <button className="btn-thinking" onClick={showModal}>Bạn đang nghĩ gì ?</button>
                </div>
            </div>
            <div className="bottom-nf">
                <div className="item-func">
                    <button className="btn btn-light" onClick={showModalUploadImage}>
                        <Image color="#10ca93"/>
                        <span>Ảnh/Video</span>
                    </button>
                </div>
                <div className="item-func">
                    <button className={inGroup != null || inTeam != null ? "btn disable" : "btn btn-light"} onClick={showModalSelectBranch}>
                        <Users color="#ffc107"/>
                        <span>Chia sẻ nhóm</span>
                    </button>
                </div>
                <div className="item-func">
                    <button className="btn btn-light" onClick={showModal}>
                        <Send color="#00afef"/>
                        <span>Đăng bài</span>
                    </button>
                </div>
            </div>
        </div>
        <Modal 
            title="Tạo bài viết" 
            visible={isVisibleModal} 
            footer={null}
            onCancel={() => {setIsVisibleModal(false), resetOption()}}
            className="modal-create-nf"
        >
            <div className="container-fluid wrap-create-nf">
                <Form form={form} layout="vertical">
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
                                                <button className={isOpenUploadFile ? "btn active" : "btn"} onClick={openUploadFile}>
                                                    <FileImageFilled style={{color: "#10ca93"}}/>
                                                </button>
                                            </Tooltip>
                                        </div>
                                        {inTeam != null || inGroup != null ? (
                                        <>
                                        <div className="item-option">
                                            <Tooltip title="Chia sẻ vào trung tâm">
                                                <button className={inTeam != null ? "btn active" : "btn disable"}>
                                                    <GroupOutlined style={{color: "#ffc107"}}/>
                                                </button>
                                            </Tooltip>
                                        </div>
                                        <div className="item-option">
                                            <Tooltip title="Chia sẻ vào nhóm">
                                                <button className={inGroup != null ? "btn active" : "btn disable"}>
                                                    <TeamOutlined style={{color: "#00afef"}}/>
                                                </button>
                                            </Tooltip>
                                        </div>
                                        </>
                                        ) : (
                                        <>
                                        <div className="item-option">
                                            <Tooltip title="Chia sẻ vào trung tâm">
                                                <button className={chooseBranch == 'team' ? "btn active" : "btn"} onClick={() => setChooseBranchFunc('team')}>
                                                    <GroupOutlined style={{color: "#ffc107"}}/>
                                                </button>
                                            </Tooltip>
                                        </div>
                                        <div className="item-option">
                                            <Tooltip title="Chia sẻ vào nhóm">
                                                <button className={chooseBranch == 'group' ? "btn active" : "btn"} onClick={() => setChooseBranchFunc('group')}>
                                                    <TeamOutlined style={{color: "#00afef"}}/>
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
                                        >
                                            <Select
                                                mode="multiple"
                                                placeholder="Chọn trung tâm"
                                                className="style-input w-100"
                                                allowClear={true}
                                                onChange={(value) => setValue("BranchList", value)}
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
                                        >
                                            <Select
                                                showSearch
                                                placeholder="Chọn nhóm"
                                                className="style-input w-100"
                                                allowClear={true}
                                                onChange={(value) => setValue("GroupNewsFeedID", value)}
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
                            <button type="submit" className="btn btn-primary w-100" onClick={onSubmit}>
                            Đăng
                            {props.isLoading.type == "ADD" && props.isLoading.status && (
                                <Spin className="loading-base" />
                            )}
                            </button>
                        </div>
                    </div>
                </Form>
            </div>
        </Modal>
        </>
    )
}

export default CreateNewsFeed;