import { Input,Form, Spin, Select } from "antd";
import Modal from "antd/lib/modal/Modal";
import { useEffect, useState } from "react";
import { PlusCircle } from "react-feather";
import { useForm } from "react-hook-form";
import { useWrap } from "~/context/wrap";
import { userInformationApi } from "~/apiBase";
import { Roles } from "~/lib/roles/listRoles";

const { Option } = Select;

const AddUserToGroupForm = (props) => {
    const {isLoading, GroupID, addUserToGroup} = props;
    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const [form] = Form.useForm();
    const { showNoti } = useWrap();
    const [roleID, setRoleID] = useState(null);
    const [user, setUser] = useState([]);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { isSubmitting, errors, isSubmitted },
    } = useForm();

    const fetchUser = async () => {
        try {
            let res = await userInformationApi.getAllRole(roleID);
            if(res.status == 204) {
                console.log("Không có dữ liệu");
            }
            if(res.status == 200) {
                setUser(res.data.data);
            }
        } catch (error) {
            console.log("Lỗi UserBranch", error.message);
        }
    }

    const onSubmit = handleSubmit((data: any) => {
        if(Object.keys(data).length <= 2) {
            setIsVisibleModal(false);
            showNoti("danger", "Bạn chưa chỉnh sửa");
        }
        let res = addUserToGroup(data);
        res.then(function (rs: any) {
            rs && rs.status == 200 && setIsVisibleModal(false), form.resetFields();
        });
    });

    useEffect(() => {
        if(isVisibleModal) {
            setValue("GroupNewsFeedID", GroupID);
            setValue("RoleID", 2);
        }
        fetchUser();
    }, [isVisibleModal, roleID])
    return (
        <>
        <li className="add-user-to-group btn" onClick={() => setIsVisibleModal(true)}>
            <span>Thêm thành viên</span>
        </li>
        {/* {} */}
        <Modal
            title="Thêm thành viên"
            visible={isVisibleModal}
            onCancel={() => setIsVisibleModal(false)}
            footer={null}
        >
            <div className="container-fluid">
                <Form form={form} layout="vertical" onFinish={onSubmit}>
                    <div className="row">
                        <div className="col-12">
                        <Form.Item 
                            label="Roles" 
                            name="Roles"
                            rules={[
                                { required: true, message: "Bạn không được để trống" },
                            ]}
                            >
                            <Select 
                                className="style-input"
                                placeholder="Chọn thành viên"
                                onChange={(value) => setRoleID(value)}
                            >
                                {Roles.map((item, index) => (
                                    <Option value={item.id}>{item.RoleName}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                        <Form.Item 
                            label="Thành viên" 
                            name="Thành viên"
                            rules={[
                                { required: true, message: "Bạn không được để trống" },
                            ]}
                            >
                            <Select 
                                className="style-input"
                                placeholder="Chọn thành viên"
                                onChange={(value) => setValue("UserInformationID", value)}
                            >
                                {user && user.map((item, index) => (
                                    <Option value={item.UserInformationID}>{item.FullNameUnicode}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col-12">
                            <button type="submit" className="btn btn-primary w-100">
                            Lưu
                            {/* {isLoading.type == "ADD_DATA" &&
                                isLoading.status && <Spin className="loading-base" />} */}
                            </button>
                        </div>
                    </div>
                </Form>
            </div>
        </Modal>
        </>
    )
}
export default AddUserToGroupForm;