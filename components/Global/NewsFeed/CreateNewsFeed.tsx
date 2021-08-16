import React, { Fragment, useEffect, useState } from "react";
import { Image, Users, Send, Home } from "react-feather";
import { useWrap } from "~/context/wrap";
import { Form, Modal, Button, Input, Tooltip, Upload, Popover, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import UploadMutipleFile from "./components/UploadMutipleFile";
import { useForm } from "react-hook-form";
const { TextArea } = Input;
const { Option } = Select;

const CreateNewsFeed = (props) => {
    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const [isOpenUploadFile, setIsOpenUploadFile] = useState(false);
    const [visibleSelectBranch, setVisibleSelectBranch] = useState(false);
    const [chooseBranch, setChooseBranch] = useState(true);

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

    const { dataUser, groupNewsFeed, userBranch } = props;

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
    };

    const resetOption = () => {
        setIsOpenUploadFile(false);
        setVisibleSelectBranch(false);
    }

    const openUploadFile = () => {
        setIsOpenUploadFile(!isOpenUploadFile);
    };

    const setChooseBranchFunc = () => {
        setChooseBranch(!chooseBranch);
    }

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
                    <button className="btn btn-light" onClick={showModalSelectBranch}>
                        <Users color="#ffc107"/>
                        <span>Chia sẻ vào nhóm</span>
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
            <div className="container-fluid">
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
                                        <div className="item-option">
                                            <Tooltip title="Chia sẻ vào trung tâm">
                                                <button className="btn" onClick={setChooseBranchFunc}>
                                                    <Users color="#ffc107"/>
                                                </button>
                                            </Tooltip>
                                        </div>
                                        <div className="item-option">
                                            <Tooltip title="Chia sẻ vào nhóm">
                                                <button className="btn" onClick={setChooseBranchFunc}>
                                                    <Home color="#00afef"/>
                                                </button>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                                <div className="option-for-nf--body">
                                    <div className="choose-branch">
                                        {chooseBranch ? (
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
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col-12">
                            <button type="submit" className="btn btn-primary w-100">
                            Đăng
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

export default CreateNewsFeed;