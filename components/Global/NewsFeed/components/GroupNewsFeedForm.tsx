import { Input,Form, Spin, Select } from "antd";
import Modal from "antd/lib/modal/Modal";
import { useEffect, useState } from "react";
import { PlusCircle } from "react-feather";
import { useForm } from "react-hook-form";
import { useWrap } from "~/context/wrap";
import { courseApi } from "~/apiBase";
import UploadBackGroundGroup from "./UploadBackgroundGroup";
import ImgCrop from "antd-img-crop";

const { Option } = Select;

const GroupNewsFeedFrom = (props) => {
    const {showAdd, showEdit, oldData, isLoading, onSubmitGroupNewsFeed, getGroupByID} = props;
    const [course, setCourse] = useState<ICourse[]>([]);
    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const [form] = Form.useForm();
    const { showNoti } = useWrap();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { isSubmitting, errors, isSubmitted },
    } = useForm();

    const fetchCourse = async () => {
        try {
            let res = await courseApi.getAll({selectAll: true});
            if(res.status == 204) {
                console.log("Không có dữ liệu");
            }
            if(res.status == 200) {
                setCourse(res.data.data);
            }
        } catch (error) {
            console.log("Lỗi UserBranch", error.message);
        }
    }

    const onSubmit = handleSubmit((data: any) => {
        if(Object.keys(data).length <= 1) {
            setIsVisibleModal(false);
            showNoti("danger", "Bạn chưa chỉnh sửa");
        }
        if(data.ID) {
            let res = onSubmitGroupNewsFeed(data);
            res.then(function (rs: any) {
                rs && rs.status == 200 && setIsVisibleModal(false), form.resetFields(), getGroupByID();
            });
        } else {
            let res = onSubmitGroupNewsFeed(data);
            res.then(function (rs: any) {
                rs && rs.status == 200 && setIsVisibleModal(false), form.resetFields();
            });
        }
    });

    useEffect(() => {
        if(isVisibleModal) {
            if(oldData) {
                setValue("ID", oldData?.ID)
            }
        }
        fetchCourse();
    }, [isVisibleModal]);

    return (
        <>
        {showAdd && (
            <div className="add-group" onClick={() => setIsVisibleModal(true)}>
                <PlusCircle />
                <span>Thêm nhóm</span>
            </div>
        )
        }
        {showEdit && (
            <li className="edit-group btn" onClick={() => setIsVisibleModal(true)}>Chỉnh sửa nhóm</li>
        )
        }
        {/* {} */}
        <Modal
            title={showAdd ? "Thêm nhóm" : "Chỉnh sửa nhóm"}
            visible={isVisibleModal}
            onCancel={() => setIsVisibleModal(false)}
            footer={null}
        >
            <div className="container-fluid">
                <Form form={form} layout="vertical" onFinish={onSubmit}>
                    <div className="row">
                        <div className="col-12">
                        <Form.Item 
                            label="Tên nhóm" 
                            name="Tên nhóm"
                            rules={[
                                { required: true, message: "Bạn không được để trống" },
                            ]}
                            initialValue={oldData?.Name}
                            >
                            <Input 
                                className="style-input" 
                                placeholder="Nhập tên nhóm"
                                onChange={(e) => setValue("Name", e.target.value)}
                            />
                        </Form.Item>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                        <Form.Item 
                            label="Thuộc khóa học" 
                            name="Thuộc khóa học"
                            rules={[
                                { required: true, message: "Bạn không được để trống" },
                            ]}
                            initialValue={oldData?.CourseID}
                            >
                            <Select 
                                className="style-input"
                                onChange={(value) => setValue("CourseID", value)}
                            >
                                {course && course.map((item, index) => (
                                    <Option key={index} value={item.ID}>{item.CourseName}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <Form.Item label="Chọn Background" name="Chọn Background">
                                <ImgCrop grid>
                                    <UploadBackGroundGroup
                                        imageUrl={oldData?.BackGround}
                                        getValue={(value) => setValue("BackGround", value)}
                                    />
                                </ImgCrop>
                            </Form.Item>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col-12">
                            <button type="submit" className="btn btn-primary w-100">
                            Lưu
                            {isLoading.type == "ADD" &&
                                isLoading.status && <Spin className="loading-base" />}
                            </button>
                        </div>
                    </div>
                </Form>
            </div>
        </Modal>
        </>
    )
}

export default GroupNewsFeedFrom;