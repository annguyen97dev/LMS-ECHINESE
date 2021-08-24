import React, { Fragment, useEffect, useState } from "react";
import PowerTable from "~/components/PowerTable";
import { data } from "../../../lib/option/dataOption2";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import SortBox from "~/components/Elements/SortBox";
import LayoutBase from "~/components/LayoutBase";
import { Copy, Power } from "react-feather";
import TitlePage from "~/components/Elements/TitlePage";
import SelectField from "~/components/FormControl/SelectField";
import InputTextField from "~/components/FormControl/InputTextField";
import {
  Modal,
  Form,
  Input,
  Button,
  Divider,
  Tooltip,
  Select,
  Card,
  Switch,
  Spin,
} from "antd";
import RegInfo from "~/components/Global/RegisterCourse/RegCourseBuy";
import RegCourseInfo from "~/components/Global/RegisterCourse/RegCourseBuy";
import RegCourseBuy from "~/components/Global/RegisterCourse/RegCourseInfo";
import RegCoursePayment from "~/components/Global/RegisterCourse/RegCoursePayment";
import { useWrap } from "~/context/wrap";
import { useForm } from "react-hook-form";
import {
  branchApi,
  programApi,
  studyTimeApi,
  userInformationApi,
} from "~/apiBase";
import moment from "moment";
import { courseRegistrationApi } from "~/apiBase/customer/student/course-registration";

const RegisterCourse = (props: any) => {
  const { Option } = Select;
  const { TextArea } = Input;
  const [option, setOption] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { examServicesId, reloadData, examServicesDetail, currentPage } = props;
  const [form] = Form.useForm();
  const { showNoti } = useWrap();
  const [loading, setLoading] = useState(false);
  const { setValue } = useForm();
  const [userAll, setUserAll] = useState<IUserinformation[]>();
  const [userDetail, setUserDetail] = useState<IUserinformation>();
  const [branch, setBranch] = useState<IBranch[]>();
  const [program, setProgram] = useState<IProgram[]>();
  const [studyTime, setStudyTime] = useState<IStudyTime[]>();

  const fetchDataUser = () => {
    (async () => {
      try {
        const res = await userInformationApi.getAll();
        //@ts-ignore
        res.status == 200 && setUserAll(res.data.data);
      } catch (err) {
        showNoti("danger", err.message);
      }
    })();
  };

  const fetchDataSelectList = () => {
    (async () => {
      try {
        const _branch = await branchApi.getAll({ selectAll: true });
        const _program = await programApi.getAll({ selectAll: true });
        const _studyTime = await studyTimeApi.getAll({ selectAll: true });
        _branch.status == 200 && setBranch(_branch.data.data);
        _program.status == 200 && setProgram(_program.data.data);
        _studyTime.status == 200 && setStudyTime(_studyTime.data.data);
      } catch (err) {
        showNoti("danger", err.message);
      }
    })();
  };

  useEffect(() => {
    fetchDataUser();
    fetchDataSelectList();
  }, []);

  console.log(option);

  const onChange = (value) => {
    setOption(value);
  };

  const handleChangeUser = (value) => {
    (async () => {
      try {
        const _detail = await userInformationApi.getByID(value);
        //@ts-ignore
        _detail.status == 200 && setUserDetail(_detail.data.data);
      } catch (err) {
        showNoti("danger", err.message);
      }
    })();
  };

  const onSubmit = async (data: any) => {
    console.log(data);
    setLoading(true);
    try {
      let res = await courseRegistrationApi.add(data);
      showNoti("success", res?.data.message);
      setLoading(false);
      form.resetFields();
    } catch (error) {
      showNoti("danger", error.message);
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <div className="row">
          <div className="col-6">
            <Card title="Thông tin cá nhân">
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Loại đăng ký">
                    <Select
                      onChange={onChange}
                      className="style-input w-100"
                      placeholder="Đăng ký học"
                    >
                      <Option value={1}>Đăng ký học</Option>
                      <Option value={4}>Hẹn đăng ký</Option>
                      <Option value={2}>Mua dịch vụ</Option>
                      <Option value={3}>Thanh toán</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Có hơp đồng">
                    <Switch defaultChecked />
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item
                    name="UserInformationID"
                    label="Email"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng điền đủ thông tin!",
                      },
                    ]}
                  >
                    <Select
                      className="style-input"
                      showSearch
                      optionFilterProp="children"
                      onChange={(value) => handleChangeUser(value)}
                    >
                      {userAll?.map((item, index) => (
                        <Option key={index} value={item.UserInformationID}>
                          {item.Email}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="col-md-6 col-12">
                  <Form.Item label="Họ và tên">
                    <Input
                      disabled
                      value={userDetail ? userDetail.FullNameUnicode : ""}
                      className="style-input"
                    />
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Ngày sinh">
                    <Input
                      disabled
                      className="style-input"
                      value={
                        userDetail
                          ? moment(userDetail.DOB).format("DD/MM/YYYY")
                          : ""
                      }
                    />
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="SĐT">
                    <Input
                      disabled
                      value={userDetail ? userDetail.Mobile : ""}
                      className="style-input"
                    />
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Tỉnh/Thành phố">
                    <Input disabled className="style-input" />
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Quận/Huyện">
                    <Input
                      disabled
                      value={userDetail ? userDetail.DistrictName : ""}
                      className="style-input"
                    />
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Phường xã">
                    <Input
                      disabled
                      value={userDetail ? userDetail.WardName : ""}
                      className="style-input"
                    />
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Địa chỉ">
                    <Input
                      disabled
                      value={
                        userDetail
                          ? `${userDetail.HouseNumber} ${userDetail.Address}`
                          : ""
                      }
                      className="style-input"
                    />
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="CMND">
                    <Input
                      disabled
                      value={userDetail ? userDetail.CMND : ""}
                      className="style-input"
                    />
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Nơi cấp">
                    <Input
                      disabled
                      value={userDetail ? userDetail.CMNDRegister : ""}
                      className="style-input"
                    />
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Ngày cấp">
                    <Input
                      disabled
                      value={
                        userDetail
                          ? moment(userDetail.CMNDDate).format("DD/MM/YYYY")
                          : ""
                      }
                      className="style-input"
                    />
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Công việc">
                    <Input disabled className="style-input" />
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Nơi công tác">
                    <Input className="style-input" disabled />
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Người nhà, liên hệ">
                    <Input className="style-input" disabled />
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Đầu vào">
                    <Input className="style-input" disabled />
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Mục tiêu">
                    <Input className="style-input" disabled />
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <Form.Item label="Thời gian thi">
                    <Input
                      className="style-input"
                      placeholder="dd/mm/yyyy"
                      disabled
                    />
                  </Form.Item>
                </div>
                <div className="col-md-6 col-12">
                  <Form.Item label="Mục đích học">
                    <Input className="style-input" disabled />
                  </Form.Item>
                </div>
              </div>
              {/*  */}
              {/*  */}
            </Card>
          </div>
          <div className="col-6">
            {option == 1 && <RegCourseInfo />}
            {option == 4 && (
              <Card title="Thông tin đăng kí">
                <div className="row">
                  <div className="col-12">
                    <Form.Item
                      name="BranchID"
                      label="Trung tâm mong muốn"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng điền đủ thông tin!",
                        },
                      ]}
                    >
                      <Select
                        className="style-input"
                        showSearch
                        optionFilterProp="children"
                      >
                        {branch?.map((item, index) => (
                          <Option key={index} value={item.ID}>
                            {item.BranchName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <Form.Item
                      name="ProgramID"
                      label="Chương trình mong muốn"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng điền đủ thông tin!",
                        },
                      ]}
                    >
                      <Select
                        className="style-input"
                        showSearch
                        optionFilterProp="children"
                      >
                        {program?.map((item, index) => (
                          <Option key={index} value={item.ID}>
                            {item.ProgramName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <Form.Item
                      name="StudyTimeID"
                      label="Ca học mong muốn"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng điền đủ thông tin!",
                        },
                      ]}
                    >
                      <Select
                        className="style-input"
                        showSearch
                        optionFilterProp="children"
                      >
                        {studyTime?.map((item, index) => (
                          <Option key={index} value={item.ID}>
                            {item.Name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 text-center text-left-mobile">
                    <button type="submit" className="btn btn-primary">
                      Xác nhận
                      {loading == true && <Spin className="loading-base" />}
                    </button>
                  </div>
                </div>
              </Card>
            )}
            {option == 2 && <RegCourseBuy />}
            {option == 3 && <RegCoursePayment />}
          </div>
        </div>
      </Form>
    </div>
  );
};
RegisterCourse.layout = LayoutBase;

export default RegisterCourse;
